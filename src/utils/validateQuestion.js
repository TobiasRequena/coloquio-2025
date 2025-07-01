export function validateQuestion(text) {
  const trimmed = text.trim();
  const startsAndEnds = /^¿.*\?$/; 
  const endsWith = /\?$/;
  return startsAndEnds.test(trimmed) || endsWith.test(trimmed);
}
