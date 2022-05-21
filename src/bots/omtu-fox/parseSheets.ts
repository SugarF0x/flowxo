import { Sheets, FormattedSheets } from './types'
import { getColorFromText, parseDates, replaceDashWithUndefined } from './utils'

export function parseSheets(sheets: Sheets) {
  const formatted: FormattedSheets = {
    specialties: {},
    subjects: [],
    events: []
  }

  for (const entry of sheets.specialties) {
    formatted.specialties[entry.id] = entry.title
  }

  for (const entry of sheets.subjects) {
    const { course, title, id } = entry
    formatted.subjects.push({
      professor: replaceDashWithUndefined(entry.professor),
      color:  entry.color === '-' ? getColorFromText(entry.title) : entry.color,
      specs: entry.specs === '-' ? Object.keys(formatted.specialties) : entry.specs.split(','),
      id,
      course,
      title
    })
  }

  for (const entry of sheets.events) {
    const { id, subjectId, time, room, course } = entry
    formatted.events.push({
      note: replaceDashWithUndefined(entry.note),
      groups: entry.groups === '-' ? [1,2,3,4] : entry.groups.split(',').map(item => Number(item)),
      dates: parseDates(entry.dates),
      room: replaceDashWithUndefined(room),
      time: replaceDashWithUndefined(time),
      id,
      subjectId,
      course
    })
  }

  return formatted
}
