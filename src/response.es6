'use strict'

import http from 'http'

const res = Symbol()

const validStatusCodes = [
  // 1xx - Informational
  100, 101, 102,
  // 2xx - Success
  200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
  // 3xx - Redirection
  300, 301, 302, 303, 304, 305, 306, 307, 308,
  // 4xx - Client error
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
  415, 416, 417, 418, 421, 422, 423, 424, 426, 428, 429, 431, 451,
  // 5xx - Server error
  500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511
]

export default class WebResponse {
  constructor (response) {
    if (!(response instanceof http.ServerResponse)) {
      throw new Error('response must be an ServerResponse')
    }

    this[res] = response
  }

  getHeader (...args) { return this[res].getHeader(...args) }
  setHeader (...args) { return this[res].setHeader(...args) }

  get statusCode () { return this[res].statusCode }
  set statusCode (value) {
    if (!validStatusCodes.some(code => code === value)) {
      throw new Error('Invalid or unsupported status code.')
    }
    this[res].statusCode = value
  }

  send (data) {
    let contentType = this.getHeader('Content-Type')
    if (typeof contentType === 'undefined') {
      if (typeof data === 'string') {
        this.setHeader('Content-Type', 'text/html')
      } else if (Buffer.isBuffer(data)) {
        this.setHeader('Content-Type', 'application/octet-stream')
      } else if (Array.isArray(data) || (data && typeof data === 'object')) {
        this.setHeader('Content-Type', 'application/json')
      }
    }
    if (!Buffer.isBuffer(data)) {
      if (typeof data === 'string') {
        data = new Buffer(data)
      } else {
        data = new Buffer(JSON.stringify(data))
      }
    }
    let contentLength = this.getHeader('Content-Length')
    if (typeof contentLength === 'undefined') {
      this.setHeader('Content-Length', data.length)
    }
    this[res].write(data)
    this[res].end('')
  }
}
