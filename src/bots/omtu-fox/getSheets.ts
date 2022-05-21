import { RawSpecialty, RawSubject, RawEvent, Sheets } from './types'

function normalizeRow(rows: any) {
  return rows.map((row: any) => (row && (row.v !== null && row.v !== undefined)) ? row : {})
}

function applyHeaderIntoRows(header: any, rows: any) {
  return rows
  .map(({ c: row }: any) => normalizeRow(row))
  .map((row: any) => row.reduce((p: any, c: any, i: any) => c.v ? Object.assign(p, { [header[i]]: c.v }) : p, {}))
}

export function getItems(spreadsheetResponse: string) {
  let rows = []

  try {
    const parsedJSON = JSON.parse(spreadsheetResponse.split('\n')[1].replace(/google.visualization.Query.setResponse\(|\);/g, ''))
    const hasSomeLabelPropertyInCols = parsedJSON.table.cols.some(({ label }: { label: string }) => !!label)
    if (hasSomeLabelPropertyInCols) {
      const header = parsedJSON.table.cols.map(({ label }: { label: string }) => label)

      rows = applyHeaderIntoRows(header, parsedJSON.table.rows)
    } else {
      const [headerRow, ...originalRows] = parsedJSON.table.rows
      const header = normalizeRow(headerRow.c).map((row: any) => row.v)

      rows = applyHeaderIntoRows(header, originalRows)
    }
  } catch (e) {}

  return rows
}

function request<T>(url: string): Promise<T> {
  return new Promise((success, fail) => {
    utils.request({ method: 'GET', url }, (error, response, body) => {
      if (error) fail(error)
      success(getItems(body))
    });
  })
}

const SPECIALTY_URL = 'https://docs.google.com/spreadsheets/d/1sTEvkTc0QIcec_AUjcflMijUau2fnwIyNnLZU-kcsgA/gviz/tq?sheet=%D0%A1%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F'
const SUBJECTS_URL = 'https://docs.google.com/spreadsheets/d/1sTEvkTc0QIcec_AUjcflMijUau2fnwIyNnLZU-kcsgA/gviz/tq?sheet=%D0%9F%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D1%8B'
const CLASSES_URL = 'https://docs.google.com/spreadsheets/d/1sTEvkTc0QIcec_AUjcflMijUau2fnwIyNnLZU-kcsgA/gviz/tq?sheet=%D0%97%D0%B0%D0%BD%D1%8F%D1%82%D0%B8%D1%8F'

export async function getSheets(): Promise<Sheets> {
  const [specialties, subjects, events] = await Promise.all([
    request<RawSpecialty[]>(SPECIALTY_URL),
    request<RawSubject[]>(SUBJECTS_URL),
    request<RawEvent[]>(CLASSES_URL)
  ])

  return {
    events,
    subjects,
    specialties
  }
}
