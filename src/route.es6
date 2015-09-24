'use strict'

import XRegExp from 'xregexp'

const regex = Symbol()
const handlers = Symbol()

function getHandlerAttachError (message) {
  if (typeof message === 'string') {
    message += '; cannot attach handler'
  } else {
    message = 'Cannot attach handler'
  }
  return new Error(message)
}

function getHandlerDetachError (message) {
  if (typeof message === 'string') {
    message += '; cannot detach handler'
  } else {
    message = 'Cannot detach handler'
  }
  return new Error(message)
}

function validateHandlerId (handlers, id) {
  if (!Number.isSafeInteger(id) || id < 1) {
    return `Invalid identifier '${id}'`
  }

  if (id > handlers.length) {
    return `Identifier '${id}' is out of bounds`
  }

  return null
}

function getNextId (ids) {
  for (let i = 1; i <= Number.MAX_SAFE_INTEGER; i++) {
    if (!ids[i]) {
      ids[i] = true
      return i
    }
  }
  return 0
}

export default class Route {
  constructor ({
    route, regex: isRegex = false, handlers: predefinedHandlers
  } = {}) {
    if (!(
      route instanceof RegExp || typeof route === 'string')
    ) {
      throw new Error('Route must either be a regular expression or a string')
    }

    if (!regex && typeof route === 'string') {
      let routeParts = route.split('/')
      route = '^' + routeParts.map(part => {
        let escapedPart = part.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        return escapedPart.startsWith(':')
          ? `(?<${escapedPart.slice(1)}>[^/]+)`
          : escapedPart
      }).join('/') + '$'
    }

    this[regex] = XRegExp(route)
    this[handlers] = []
    this[handlers].ids = {}

    if (Array.isArray(predefinedHandlers)) {
      predefinedHandlers.forEach(handler => this.attachHandler(handler))
    }
  }

  get params () {
    return this[regex].xregexp.captureNames
      ? this[regex].xregexp.captureNames.filter(name => name !== null)
      : []
  }

  matches (path) {
    return this[regex].test(path)
  }

  parsePath (path) {
    let paramMatches = XRegExp.exec(path, this[regex])
    let paramValues = {}
    this.params.forEach(param => paramValues[param] = paramMatches[param])
    return paramValues
  }

  attachHandler ({ methods = 'ALL', handler } = {}, {
      before, after, replace
    } = {}) {
    if (!handler) {
      throw getHandlerAttachError(
        'No handler given; cannot attach to route'
      )
    }

    if (typeof methods === 'string') {
      methods = [methods]
    }

    if (!Array.isArray(methods)) {
      throw getHandlerAttachError(
        'methods must either be a string or an array'
      )
    }

    methods = methods.map(method => {
      if (typeof method !== 'string') {
        throw getHandlerAttachError(
          'methods array must only contain strings'
        )
      }

      let upperCaseMethod = method.toUpperCase()

      if (![
        'ALL', 'GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'TRACE', 'OPTIONS',
        'CONNECT', 'PATCH'
      ].find(validMethod => upperCaseMethod === validMethod)) {
        throw getHandlerAttachError(`Invalid method '${method}`)
      }

      return upperCaseMethod
    })

    let handlerObject = { methods, handler, id: getNextId(this[handlers].ids) }

    if (!handlerObject.id) {
      throw getHandlerAttachError('Exhausted maximum number of handlers')
    }

    let placementOptionCount =
      (before ? 1 : 0) + (after ? 1 : 0) + (replace ? 1 : 0)

    if (placementOptionCount > 1) {
      throw new Error('before, after, and replace cannot be used together')
    } else if (placementOptionCount) {
      let id = before || after || replace
      let idValidationError = validateHandlerId(this[handlers], id)

      if (idValidationError) {
        throw getHandlerAttachError(idValidationError)
      }

      let index = this[handlers].findIndex(handler => handler.id === id)

      if (index === -1) {
        throw getHandlerAttachError(`No handler with id ${id}`)
      }

      if (before) {
        this[handlers].splice(index, 0, handlerObject)
      } else if (after) {
        this[handlers].splice(index + 1, 0, handlerObject)
      } else if (replace) {
        delete this[handlers].ids[this[handlers][index].id]
        this[handlers].splice(index, 1, handlerObject)
      }
    } else {
      this[handlers].push(handlerObject)
    }

    return handlerObject.id
  }

  detachHandler (id) {
    let idValidationError = validateHandlerId(this[handlers], id)

    if (idValidationError) {
      throw getHandlerDetachError(idValidationError)
    }

    let index = this[handlers].findIndex(handler => handler.id === id)

    if (index === -1) {
      throw getHandlerDetachError(`No handler with id ${id}`)
    }

    delete this[handlers].ids[this[handlers][index].id]
    this[handlers].splice(index, 1)
  }

  getHandlers (method) {
    if (typeof method !== 'string') {
      throw new Error('method must be a string')
    }

    method = method.toUpperCase()

    return this[handlers].filter(handler =>
      handler.methods.find(
        handlerMethod => handlerMethod === 'ALL' || handlerMethod === handler
      )
    ).map(handler => handler.handler)
  }

  toString () {
    return this[regex].xregexp.source
  }

  toJSON () {
    return this[regex].xregexp.source
  }
}
