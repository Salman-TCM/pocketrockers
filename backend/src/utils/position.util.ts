export function calculatePosition(prevPosition?: number | null, nextPosition?: number | null): number {
  if (!prevPosition && !nextPosition) return 1.0;
  if (!prevPosition) return nextPosition! - 1;
  if (!nextPosition) return prevPosition + 1;
  return (prevPosition + nextPosition) / 2;
}