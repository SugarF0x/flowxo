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

  const today = filter === 'tomorrow' ? new Date(Date.now() + 1000 * 60 * 60 * 24) : new Date()

  const todayEvents = events.filter((event) => {
    if (filter === 'exam') return event.subject.id.includes('ex')
    return isSameDay(event.date, today)
  }).sort((a, b) => (isBefore(a.date, b.date) ? -1 : 1)).map(entry => {
    if (filter !== 'exam') return entry
    return {
      ...entry,
      time: `${format(entry.date, 'dd.MM.yyyy')} ${entry.time}`
    }
  })

  if (!todayEvents.length) resolve('Занятий нет')

  resolve(formatResponse(todayEvents, parsedSheets.specialties))
}

main()
