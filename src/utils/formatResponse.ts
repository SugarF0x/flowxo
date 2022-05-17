import { TransformedEvent } from '../types'

export function formatResponse(events: TransformedEvent[]): string {
  return events.map((val) => {
    let result = `*_${val.subject.title}_*

*Языковые*: ${val.groups.join(', ')}
*Аудитория*: ${val.room}
*Преподаватель*: ${val.subject.professor}
*Время*: ${val.time}`

    if (val.note !== '-') result += `\n*Примечание*: ${val.note}`

    return result
  }, '').join('\n\n‑‑‑‑‑\n\n').replace(/-/g, '\\-')
}
