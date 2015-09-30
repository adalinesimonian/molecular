'use strict'

import Route from './route'
import Router from './router'

const name = Symbol()

export default class Molecule {
  constructor ({ name: moleculeName, routes = [], register }) {
    if (typeof moleculeName !== 'string') {
      throw new Error('Molecule name must be a string')
    }
    if (!/^[a-z_]([a-z0-9_\-]*[a-z0-9_])?$/i.test(moleculeName)) {
      throw new Error('Molecule name must: \n' +
        '* contain only alphanumeric characters, _, or - \n' +
        '* start with an alphabetic character or _ \n' +
        '* cannot end with a -'
      )
    }
    if (!routes || !Array.isArray(routes)) {
      throw new Error('Molecule routes must be defined as an array')
    }
    if (register && typeof register !== 'function') {
      throw new Error('Molecule register hook must be defined as a function')
    }
    this.router = new Router()
    if (routes.length) {
      routes = routes.map(route =>
        (route instanceof Route) ? route : new Route(route))
      for (let route of routes) {
        this.router.register(route)
        console.log(`Registered route '${route}'`)
      }
    }
    this[name] = moleculeName
    this.routes = routes
    this.register = register
  }

  get name () { return this[name] }
}
