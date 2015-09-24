'use strict'

import Route from './route'

const routes = Symbol()

export default class Router {
  constructor () {
    this[routes] = []
  }

  register (route) {
    if (!(route instanceof Route)) {
      throw new Error('register must be called with a Route instance')
    }

    if (this[routes][route]) {
      throw new Error('Route already registered; must be unregistered first')
    } else {
      this[routes][route] = route
    }
  }

  unregister (route) {
    if (!(route instanceof Route)) {
      throw new Error('unregister must be called with a Route instance')
    }

    delete this[routes][route]
  }
}
