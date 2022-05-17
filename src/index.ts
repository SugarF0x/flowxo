import { getSheets } from './getSheets'
import { parseSheets } from './parseSheets'
import { getEvents } from './getEvents'
import { format, isBefore, isSameDay } from 'date-fns'
import { formatResponse } from './utils'

async function main() {
  const filter = inputs.group
  const sheets = await getSheets()
  const parsedSheets = parseSheets(sheets)
  const events = getEvents(parsedSheets)

  const today = new Date()

  const todayEvents = events.filter((event) => {
    if (filter === 'today') return isSameDay(event.date, today)
    if (filter === 'exam') return event.subject.id.includes('ex')
  }).sort((a, b) => (isBefore(a.date, b.date) ? -1 : 1)).map(entry => {
    if (filter !== 'exam') return entry
    return {
      ...entry,
      time: `${format(entry.date, 'dd.MM.yyyy')} ${entry.time}`
    }
  })

  if (!todayEvents.length) resolve('Сегодня занятий нет!')

  resolve(formatResponse(todayEvents, parsedSheets.specialties))
}

main()
