'use strict'

import http from 'http'

const req = Symbol()

export default class WebRequest {
  constructor (request) {
    if (!(request instanceof http.IncomingMessage)) {
      throw new Error('request must be an IncomingMessage')
    }

    this[req] = request
  }

  get method () { return this[req].method }
  get url () { return this[req].url }
}
