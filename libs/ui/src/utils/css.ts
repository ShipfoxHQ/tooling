export function getCssVariableValue(variableName: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName);
}
