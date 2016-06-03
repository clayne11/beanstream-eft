import request from 'request'
import fetch from 'node-fetch'
import {parseString} from 'xml2js'
import promisify from 'node-promisify'
import get from 'lodash/get'
import moment from 'moment'

import {getUrl} from './url-utils'

const LOGIN_COMPANY = 'casalova'
const MERCHANT_ID = '300202493'

const BATCH_PAYMENTS_API_KEY = 'DA1815E80Af548cfbffaC5c30599622e'
const BATCH_REPORTING_API_KEY = '4C253654FF484d5AaF7Ed0F0e0d3c46B'

const BATCH_PAYMENTS_URL = 'https://www.beanstream.com/api/v1/batchpayments'
const BATCH_REPORTING_URL = 'https://www.beanstream.com/scripts/report.aspx'

const parseXml = promisify(parseString)

const getPasscode = (apiKey) => new Buffer(`${MERCHANT_ID}:${apiKey}`).toString('base64')

const getAuthorizationHeader = (apiKey) => ({
  Authorization: `Passcode ${getPasscode(apiKey)}`,
})

const m = (...args) => args // eslint-disable-line id-length
  .filter((arg) => !!arg)
  .reduce((result, arg) => ({
    ...result,
    ...arg,
  }), {});

export const makePayment = ({
  processDate,
  bankNumber,
  transitNumber,
  accountNumber,
  amountCents,
  recipientName,
  customerCode,
  subMerchantId,
  referenceNumber,
}) => new Promise((resolve, reject) => {
  const criteria = m(
    {process_now: processDate ? 0 : 1},
    subMerchantId && {sub_merchant_id: 'TEST'},
    processDate && {process_date: moment(processDate).format('YYYYMMDD')},
  )

  const formData = {
    criteria: {
      value: JSON.stringify(criteria),
      options: {
        contentType: 'application/json',
      },
    },
    filename: {
      value: `E,D,${bankNumber},${transitNumber},${accountNumber},${amountCents},${referenceNumber},${recipientName},${customerCode}`,
      options: {
        filename: 'testing.csv',
        contentType: 'text/csv',
      },
    },
  }

  const options = {
    url: BATCH_PAYMENTS_URL,
    headers: {
      ...getAuthorizationHeader(BATCH_PAYMENTS_API_KEY),
    },
    formData,
  }

  request.post(options, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.log(`ERROR: ${error}`)
      reject(error)
      return
    }

    resolve(JSON.parse(body))
  })
})

export const getReport = async (batchId) => {
  const url = getUrl({
    baseUrl: BATCH_REPORTING_URL,
    query: {
      loginCompany: LOGIN_COMPANY,
      merchantId: MERCHANT_ID,
      passCode: BATCH_REPORTING_API_KEY,
      rptFormat: 'XML',
      rptVersion: '1.1',
      rptType: 'BATCH_EFTTRANS',
      rptRangeSelector: 1,
      rptStartBatchId: batchId,
      rptEndBatchId: batchId,
    },
  })
  const response = await fetch(url, {
    method: 'GET',
  })
  const xml = await response.text()
  const responseJson = await parseXml(xml)
  const row = get(responseJson, 'BATCH_EFTTRANS.row[0].$')
  return row
}
