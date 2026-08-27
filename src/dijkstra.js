/**
 * Dijkstra on a tiny undirected kilometre graph.
 * Returns the path, total cost, and the order nodes were settled
 * so the map can play the search instead of jumping to the answer.
 */
export function shortestPath(nodes, edges, startId, endId) {
  const adj = new Map(nodes.map((n) => [n.id, []]));
  for (const e of edges) {
    adj.get(e.from).push({ to: e.to, km: e.km });
    adj.get(e.to).push({ to: e.from, km: e.km });
  }

  const dist = Object.fromEntries(nodes.map((n) => [n.id, Infinity]));
  const prev = Object.fromEntries(nodes.map((n) => [n.id, null]));
  const settled = [];
  dist[startId] = 0;

  const open = new Set(nodes.map((n) => n.id));

  while (open.size) {
    let u = null;
    let best = Infinity;
    for (const id of open) {
      if (dist[id] < best) {
        best = dist[id];
        u = id;
      }
    }
    if (u === null || best === Infinity) break;
    open.delete(u);
    settled.push(u);
    if (u === endId) break;

    for (const { to, km } of adj.get(u)) {
      if (!open.has(to)) continue;
      const alt = dist[u] + km;
      if (alt < dist[to]) {
        dist[to] = alt;
        prev[to] = u;
      }
    }
  }

  if (dist[endId] === Infinity) {
    return { path: [], km: null, settled, dist };
  }

  const path = [];
  for (let cur = endId; cur; cur = prev[cur]) path.push(cur);
  path.reverse();

  return { path, km: dist[endId], settled, dist };
}
