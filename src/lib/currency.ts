export function formatXof(value: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

