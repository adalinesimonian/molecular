'use strict'

import http from 'http'

const res = Symbol()

export default class WebResponse {
  constructor (response) {
    if (!(response instanceof http.ServerResponse)) {
      throw new Error('response must be an ServerResponse')
    }

    this[res] = response
  }

  getHeader (...args) { return this[res].getHeader(...args) }
  setHeader (...args) { return this[res].setHeader(...args) }

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
