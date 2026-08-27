/** Pins follow present-day civic centres that occupy the same ground
 *  as the 11th–13th century courts along the Brantas, the valley Panji
 *  would have walked. Jenggala is placed at Hujung Galuh, the kingdom’s
 *  river-mouth harbour (now Kota Lama Surabaya), not at later Sidoarjo. */

export const kingdoms = [
  {
    id: "jenggala",
    name: "Jenggala",
    historic: "Hujung Galuh · Kahuripan",
    today: "Kota Lama, Surabaya",
    lat: -7.2374,
    lng: 112.7368,
    blurb:
      "Eastern court of Janggala. Panji Asmarabangun leaves from this harbour city at the mouth of the Brantas.",
  },
  {
    id: "sidoarjo",
    name: "Sidoarjo",
    historic: "Delta settlements of Janggala",
    today: "Alun-alun Sidoarjo",
    lat: -7.4478,
    lng: 112.7183,
    blurb:
      "Rice plains just south of the estuary. The first inland halt on the road upriver toward Daha.",
  },
  {
    id: "mojokerto",
    name: "Mojokerto",
    historic: "Watan Mas hinterland",
    today: "Alun-alun Kota Mojokerto",
    lat: -7.4722,
    lng: 112.4338,
    blurb:
      "Where the Brantas bends west. An older capital, Watan Mas, once stood nearby before Kahuripan was founded.",
  },
  {
    id: "jombang",
    name: "Jombang",
    historic: "Middle Brantas crossing",
    today: "Alun-alun Jombang",
    lat: -7.5459,
    lng: 112.2334,
    blurb:
      "A river crossing between the eastern and western courts. Roads split here toward Nganjuk or due south to Kediri.",
  },
  {
    id: "nganjuk",
    name: "Nganjuk",
    historic: "Western approaches to Panjalu",
    today: "Alun-alun Nganjuk",
    lat: -7.6051,
    lng: 111.9035,
    blurb:
      "Last northern court before the Kediri plain. From here the road turns south into Daha.",
  },
  {
    id: "kediri",
    name: "Kediri",
    historic: "Daha · Kadiri",
    today: "Alun-alun Kota Kediri",
    lat: -7.8167,
    lng: 112.0114,
    blurb:
      "Western court of Panjalu. Home of Dewi Sekartaji — Cakra Kirana — and the end of Panji’s search.",
  },
];

/** Driving kilometres on the present Brantas-corridor roads.
 *  These follow the same valley the historic royal road used. */
export const roads = [
  { from: "jenggala", to: "sidoarjo", km: 23, note: "Harbour road south along Kali Mas" },
  { from: "sidoarjo", to: "mojokerto", km: 39, note: "West through Krian" },
  { from: "mojokerto", to: "jombang", km: 33, note: "Brantas valley road" },
  { from: "jombang", to: "nganjuk", km: 42, note: "Via Kertosono" },
  { from: "nganjuk", to: "kediri", km: 35, note: "South onto the Kediri plain" },
  { from: "jenggala", to: "mojokerto", km: 54, note: "Inland road, skipping Sidoarjo" },
  { from: "sidoarjo", to: "jombang", km: 68, note: "Southern bypass of Mojokerto" },
  { from: "mojokerto", to: "nganjuk", km: 81, note: "Direct via Kertosono, skipping Jombang" },
  { from: "jombang", to: "kediri", km: 46, note: "South via Pare, skipping Nganjuk" },
];

export const byId = Object.fromEntries(kingdoms.map((k) => [k.id, k]));