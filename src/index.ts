import { getSheets } from './getSheets'
import { parseSheets } from './parseSheets'
import { getEvents } from './getEvents'
import { isBefore, isSameDay } from 'date-fns'
import { formatResponse } from './utils'

async function main() {
  const sheets = await getSheets()
  const parsedSheets = parseSheets(sheets)
  const events = getEvents(parsedSheets)

  const today = new Date()

  const todayEvents = events.filter((event) => {
    return isSameDay(event.date, today)
  }).sort((a, b) => (isBefore(a.date, b.date) ? -1 : 1))

  if (!todayEvents.length) resolve('Сегодня занятий нет!')

  resolve(formatResponse(todayEvents, parsedSheets.specialties))
}

main()
