import request from 'request'

const MERCHANT_ID = '300202493'

const BATCH_API_KEY = '25803feCd25A4F8b9a1Fbda8056cE646'

const PASSCODE = new Buffer(`${MERCHANT_ID}:${BATCH_API_KEY}`).toString('base64')

console.log(PASSCODE)
