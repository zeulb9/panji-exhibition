import { byId, kingdoms } from "./data.js";
import { createMap } from "./map.js";

document.addEventListener("DOMContentLoaded", () => {
  // Populate year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const startSelect = document.getElementById("start");
  const endSelect = document.getElementById("end");
  const findBtn = document.getElementById("find");
  const resetBtn = document.getElementById("reset");
  const swapBtn = document.getElementById("swap");
  const viewJavaBtn = document.getElementById("view-java");
  const viewRouteBtn = document.getElementById("view-route");
  const resultDiv = document.getElementById("result");
  const pickHint = document.getElementById("pick-hint");

  // 1. Populate select dropdowns
  kingdoms.forEach((k) => {
    const optStart = document.createElement("option");
    optStart.value = k.id;
    optStart.textContent = k.name;
    startSelect.appendChild(optStart);

    const optEnd = document.createElement("option");
    optEnd.value = k.id;
    optEnd.textContent = k.name;
    endSelect.appendChild(optEnd);
  });

  startSelect.value = "jenggala";
  endSelect.value = "kediri";

  let clickStep = "start";

  // 2. Map Callback Handler
  const mapController = createMap(document.getElementById("map"), (event) => {
    if (event.type === "select") {
      if (clickStep === "start") {
        startSelect.value = event.id;
        clickStep = "end";
        pickHint.textContent = "Now tap a second court on the map for your destination.";
      } else {
        endSelect.value = event.id;
        clickStep = "start";
        pickHint.textContent = "Tap a court on the map to choose a start, then another for the end.";
      }
      mapController.setEnds(startSelect.value, endSelect.value);
    }
  });

  // 3. Control Listeners
  startSelect.addEventListener("change", () => {
    mapController.setEnds(startSelect.value, endSelect.value);
  });

  endSelect.addEventListener("change", () => {
    mapController.setEnds(startSelect.value, endSelect.value);
  });

  swapBtn.addEventListener("click", () => {
    const temp = startSelect.value;
    startSelect.value = endSelect.value;
    endSelect.value = temp;
    mapController.setEnds(startSelect.value, endSelect.value);
  });

  findBtn.addEventListener("click", async () => {
    findBtn.disabled = true;
    resultDiv.hidden = true;

    const res = await mapController.runSearch();

    if (res?.error) {
      resultDiv.innerHTML = `<p class="err">${res.error}</p>`;
    } else if (res) {
      const startName = byId[startSelect.value].name;
      const endName = byId[endSelect.value].name;
      const days = (res.km / 25).toFixed(1);

      resultDiv.innerHTML = `
        <div class="kicker">Shortest Path Found</div>
        <div class="route">${startName} <span>→</span> ${endName}</div>
        <dl>
          <div><dt>Total Distance</dt><dd>${res.km} km</dd></div>
          <div><dt>Estimated Walking Time</dt><dd>~${days} days</dd></div>
          <div><dt>Courts Settled</dt><dd>${res.settled.length} of ${kingdoms.length}</dd></div>
        </dl>
      `;
    }
    resultDiv.hidden = false;
    findBtn.disabled = false;
  });

  resetBtn.addEventListener("click", () => {
    startSelect.value = "jenggala";
    endSelect.value = "kediri";
    mapController.setEnds("jenggala", "kediri");
    mapController.resetRoads();
    resultDiv.hidden = true;
    pickHint.textContent = "Tap a court on the map to choose a start, then another for the end.";
  });

  viewJavaBtn.addEventListener("click", () => mapController.focusJava());
  viewRouteBtn.addEventListener("click", () => mapController.focusRoute());
});