export function replaceDashWithUndefined(value: string) {
  if (value === '-') return undefined
  return value
}
