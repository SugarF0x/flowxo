import { Specialties, TransformedEvent } from '../types'

function bold(val: string) { return `*${val}*` }
function italic(val: string) { return `_${val}_` }
function underline(val: string) { return `__${val}__` }

function sanitize(val: string) { return val.replace(/[!\-.]/g, '\\$&') }

export function formatResponse(events: TransformedEvent[], specLocales: Specialties): string {
  if (!events.length) return sanitize('Сегодня пар нет!')

  const result = events.map((val) => {
    const { room, groups, subject, time, note } = val
    const { professor, title, specs } = subject

    const fields = [
      underline(title),
      ''
    ]

    if (groups.length !== 4) fields.push(bold('Языковые: ') + groups.join(','))
    if (specs.length < Object.values(specLocales).length) fields.push(bold('Специализации: ') + specs.map(specId => specLocales[specId]).join(', '))
    if (room) fields.push(bold('Аудитория: ') + room)
    if (professor) fields.push(bold('Преподаватель: ') + professor)
    if (time) fields.push(bold('Время: ') + time)
    if (note) fields.push(bold('Примечание: ') + note)

    return fields.join('\n')
  }, '').join('\n\n\n')

  return sanitize(result)
}
