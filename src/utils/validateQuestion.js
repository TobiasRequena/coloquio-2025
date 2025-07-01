export function validateQuestion(text) {
  const trimmed = text.trim();
  const pattern = /^¿?\s*\S.+\?$/;
  return pattern.test(trimmed);
}
