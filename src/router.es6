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

    if (this.find(route)) {
      throw new Error('Route already registered; must be unregistered first')
    } else {
      this[routes].push(route)
    }
  }

  unregister (route) {
    if (!(route instanceof Route)) {
      throw new Error('unregister must be called with a Route instance')
    }

    let index = this[routes].findIndex(
      existingRoute => existingRoute.toString() === route.toString()
    )

    if (index !== -1) {
      this[routes].splice(index, 1)
    }
  }

  find (route) {
    if (!(route instanceof Route)) {
      throw new Error('find must be called with a Route instance')
    }

    return this[routes].find(
      existingRoute => existingRoute.toString() === route.toString()
    )
  }

  getRoute (path) {
    if (typeof path !== 'string') {
      throw new Error('path must be a string')
    }

    return this[routes].find(route => route.matches(path))
  }
}
