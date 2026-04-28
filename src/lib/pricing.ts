export function calculateTotalDkk(squareMeters: number, pricePerSquareMeter: number, minimumDkk: number) {
  const raw = squareMeters * pricePerSquareMeter;
  return Math.max(minimumDkk, Math.round(raw));
}
