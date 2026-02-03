export function generarFolioM9MEX(now = new Date(), counter = 1) {
  const y = now.getFullYear().toString();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(counter).padStart(4, "0");
  return `M9MEX-${y}${m}${d}-${seq}`;
}
