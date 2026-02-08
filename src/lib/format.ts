export function formatXof(value: number): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

