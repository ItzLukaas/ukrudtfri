/** Erstat {{nøgle}} i tekst med værdier (bruges til emne og HTML-skabeloner). */
export function substituteTemplateVars(template: string, vars: Record<string, string>) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value);
  }
  return out;
}
