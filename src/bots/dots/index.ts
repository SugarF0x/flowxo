import { GoogleSpreadsheet } from 'google-spreadsheet'

async function main() {
  // const sheet = new GoogleSpreadsheet('1d6za5hmxe2k-RM1FOf1n9qb3gyoXzkRlyaSkoJ8KeyE')
  console.log(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
}

main()
