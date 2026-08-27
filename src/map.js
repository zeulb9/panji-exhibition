import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { byId, kingdoms, roads } from "./data.js";
import { shortestPath } from "./dijkstra.js";

const JAVA_BOUNDS = L.latLngBounds([-8.85, 105.05], [-5.85, 114.65]);
const ROUTE_BOUNDS = L.latLngBounds(
  kingdoms.map((k) => [k.lat, k.lng])
).pad(0.35);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function createMap(root, onChange) {
  const map = L.map(root, {
    zoomControl: false,
    attributionControl: false,
    minZoom: 6,
    maxZoom: 12,
    maxBounds: JAVA_BOUNDS.pad(0.15),
    maxBoundsViscosity: 0.85,
  });
  // Stamen / Esri Terrain or Antique basemap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  // Guarantee container dimensions are set before fitting bounds
  map.whenReady(() => {
    map.invalidateSize();
    map.fitBounds(ROUTE_BOUNDS, { animate: false });
});

  map.on("zoomend", () => {
    const show = map.getZoom() >= 8;
    root.classList.toggle("close-up", show);
  });

  const roadLayer = L.layerGroup().addTo(map);
  const pathLayer = L.layerGroup().addTo(map);
  const markerLayer = L.layerGroup().addTo(map);
  const labelLayer = L.layerGroup().addTo(map);

  const roadLines = new Map();

  for (const road of roads) {
    const a = byId[road.from];
    const b = byId[road.to];
    const line = L.polyline(
      [
        [a.lat, a.lng],
        [b.lat, b.lng],
      ],
      {
        color: "#2c2118",
        weight: 1.6,
        opacity: 0.28,
        dashArray: "5 8",
        interactive: true,
      }
    ).addTo(roadLayer);

    line.bindTooltip(`${road.km} km · ${road.note}`, {
      sticky: true,
      className: "km-tip",
      opacity: 1,
    });

    const mid = L.latLng((a.lat + b.lat) / 2, (a.lng + b.lng) / 2);
    const chip = L.marker(mid, {
      interactive: false,
      icon: L.divIcon({
        className: "km-chip",
        html: `<span>${road.km}</span>`,
        iconSize: [36, 18],
        iconAnchor: [18, 9],
      }),
    }).addTo(labelLayer);

    roadLines.set(key(road.from, road.to), { line, chip, road });
  }

  const markers = {};
  for (const k of kingdoms) {
    const m = L.marker([k.lat, k.lng], {
      icon: pinIcon(k, ""),
      riseOnHover: true,
      zIndexOffset: 400,
    }).addTo(markerLayer);

    m.bindTooltip(
      `<strong>${k.name}</strong><br>${k.historic}<br><em>${k.today}</em>`,
      { direction: "top", offset: [0, -16], className: "place-tip", opacity: 1 }
    );

    m.on("click", () => onChange({ type: "select", id: k.id }));
    markers[k.id] = m;
  }

  const state = {
    start: "jenggala",
    end: "kediri",
    busy: false,
  };

  function paintPins() {
    for (const k of kingdoms) {
      let role = "";
      if (k.id === state.start) role = "start";
      if (k.id === state.end) role = "end";
      markers[k.id].setIcon(pinIcon(k, role));
    }
  }

  function resetRoads() {
    pathLayer.clearLayers();
    for (const { line, chip } of roadLines.values()) {
      line.setStyle({ color: "#2c2118", weight: 1.6, opacity: 0.28, dashArray: "5 8" });
      chip.getElement()?.classList.remove("on-path");
    }
    for (const k of kingdoms) {
      markers[k.id].getElement()?.classList.remove("is-settled", "is-path");
    }
  }

  async function runSearch() {
    if (state.busy) return null;
    if (state.start === state.end) {
      return { error: "Pick two different courts." };
    }
    state.busy = true;
    resetRoads();
    paintPins();

    const result = shortestPath(kingdoms, roads, state.start, state.end);

    for (const id of result.settled) {
      markers[id].getElement()?.classList.add("is-settled");
      await wait(220);
    }

    const latlngs = result.path.map((id) => [byId[id].lat, byId[id].lng]);

    for (let i = 0; i < result.path.length - 1; i++) {
      const a = result.path[i];
      const b = result.path[i + 1];
      const rec = roadLines.get(key(a, b));
      if (rec) {
        rec.line.setStyle({
          color: "#9b2c1a",
          weight: 4,
          opacity: 1,
          dashArray: null,
        });
        rec.chip.getElement()?.classList.add("on-path");
      }
      markers[a].getElement()?.classList.add("is-path");
      markers[b].getElement()?.classList.add("is-path");

      const grow = L.polyline([latlngs[i], latlngs[i]], {
        color: "#9b2c1a",
        weight: 5,
        opacity: 0.95,
        lineCap: "round",
      }).addTo(pathLayer);

      await animateLine(grow, latlngs[i], latlngs[i + 1], 420);
    }

    state.busy = false;
    map.fitBounds(L.latLngBounds(latlngs).pad(0.35), { animate: true, duration: 0.8 });
    return result;
  }

  function setEnds(start, end) {
    state.start = start;
    state.end = end;
    paintPins();
    resetRoads();
  }

  function focusJava() {
    map.fitBounds(JAVA_BOUNDS, { padding: [20, 20], animate: true });
  }

  function focusRoute() {
    map.fitBounds(ROUTE_BOUNDS, { animate: true });
  }

  paintPins();

  return {
    map,
    state,
    setEnds,
    runSearch,
    resetRoads,
    focusJava,
    focusRoute,
    paintPins,
  };
}

function key(a, b) {
  return [a, b].sort().join("::");
}

function pinIcon(k, role) {
  const letter = k.name.slice(0, 1);
  return L.divIcon({
    className: `court-pin ${role}`,
    html: `<div class="pin" role="img" aria-label="${k.name}"><i>${letter}</i><span>${k.name}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function animateLine(layer, from, to, duration) {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const e = 1 - (1 - t) ** 3;
      const lat = from[0] + (to[0] - from[0]) * e;
      const lng = from[1] + (to[1] - from[1]) * e;
      layer.setLatLngs([from, [lat, lng]]);
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}