import { FormattedSheets, TransformedEvent } from './types'
import { DAYS_FORMAT } from './consts'
import { endOfDay, parse, setHours, setMinutes } from 'date-fns'

function applyTime(date: Date, time: string) {
  const [start] = time.split(' - ')
  if (isNaN(Number(start.replace(/:/g,'')))) return endOfDay(date)

  const [hours, minutes] = start.split(':')
  return setHours(setMinutes(date, Number(minutes)), Number(hours))
}

export function getEvents(parsedSheets: FormattedSheets): TransformedEvent[] {
  const events: TransformedEvent[] = []

  for (const entry of parsedSheets.events) {
    for (const day of entry.dates) {
      const subject = parsedSheets.subjects.find(subj => subj.id === entry.subjectId && subj.course === entry.course)
      if (!subject) throw new Error('Неопознанный ID предмета')

      const dayIndex = entry.dates.indexOf(day) + 1

      const { note, time, room, groups, course } = entry
      events.push({
        id: `${entry.id}#${dayIndex}`,
        date: applyTime(parse(day, DAYS_FORMAT, new Date()), entry.time),
        note,
        time,
        room,
        groups,
        course,
        subject
      })
    }
  }

  return events
}
