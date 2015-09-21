'use strict'

import Router from './router'

export default class Server {
  constructor () {
    this.router = new Router()
  }

  static createServer () {
    return new Server()
  }

  use ({ name, routes, register }) {
    if (!name || !register) {
      throw new Error('No component provided')
    }
  }

  listen () {

  }
}
