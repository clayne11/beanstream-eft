import request from 'request'
import fetch from 'node-fetch'

const MERCHANT_ID = '300202493'

const BATCH_API_KEY = 'DA1815E80Af548cfbffaC5c30599622e'

const PASSCODE = new Buffer(`${MERCHANT_ID}:${BATCH_API_KEY}`).toString('base64')

const BATCH_PAYMENTS_URL = 'https://www.beanstream.com/api/v1/batchpayments'
const BATCH_REPORTING_URL = 'https://www.beanstream.com/scripts/report.aspx'

const getAuthorizationHeader = () => ({
  Authorization: `Passcode ${PASSCODE}`,
})

export const makePayment = () => new Promise((resolve, reject) => {
  const criteria = {
    process_now: 1,
  }

  const formData = {
    criteria: {
      value: JSON.stringify(criteria),
      options: {
        contentType: 'application/json',
      },
    },
    filename: {
      value: 'A,C,TEST,TEST,TEST,TEST,10000,TESTREF,NAME,TEST',
      options: {
        filename: 'testing.csv',
        contentType: 'text/csv',
      },
    },
  }

  const options = {
    url: BATCH_PAYMENTS_URL,
    headers: {
      ...getAuthorizationHeader(),
    },
    formData,
  }

  request.post(options, (error, response, body) => {
    console.log('--- Request ---')
    console.log('Headers')
    console.log(response.request.headers)
    console.log('\n\n')

    console.log('--- Response ---')
    console.log('Status code')
    console.log(response.statusCode)
    console.log('\n')
    console.log('Body')
    console.log(body)
    console.log('\n\n')

    if (error || response.statusCode !== 200) {
      console.log(`ERROR: ${error}`)
      reject(error)
      return
    }

    const info = JSON.parse(body)
    console.log(info)
    resolve(info)
    return
  })
})

export const getReport = () => fetch(BATCH_REPORTING_URL, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  })
})