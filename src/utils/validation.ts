export function validateTitle(s: string) {
  return s.trim().length >= 3;
}

export function validateDateTime(ms: number) {
  return !Number.isNaN(ms) && ms > 0;
}

export function validateLocation(s: string) {
  return s.trim().length > 0; // simple non-empty check
}
