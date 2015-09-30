'use strict'

import http from 'http'
import url from 'url'

const req = Symbol()
const pathData = Symbol()

export default class WebRequest {
  constructor (request) {
    if (!(request instanceof http.IncomingMessage)) {
      throw new Error('request must be an IncomingMessage')
    }

    this[req] = request
    this[pathData] = url.parse(request.url)
  }

  get method () { return this[req].method }
  get url () { return this[req].url }
  get path () { return this[pathData].pathname }
  get query () { return this[pathData].query }
  get hash () { return this[pathData].hash }
}
