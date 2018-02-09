'use strict'

const _ = require('lodash')

module.exports = class Route {

  constructor(method, route, handler) {
    this._validateMethod(method)
    this._validateRoute(route)
    this._validateHandler(handler)

    this._method = method
    this._route = route
    this._handler = handler

    this._namespace = []
    this._prefix = []
    this._middleware = []

  }

  _validateMethod(method) {
    if (typeof method !== 'string') {
      throw new Error('Cannot instantiate route without a method string')
    }
  }

  _validateRoute(route) {
    if (typeof route === 'undefined') {
      throw new Error('Cannot instantiate route without a valid url string')
    }
  }

  _validateHandler(handler) {
    if (!['string', 'function'].includes(typeof handler)) {
      throw new Error('Cannot instantiate route without route handler')
    }
  }

  middleware(...middleware) {
    this._middleware = this._middleware.concat(_.flatten(middleware))
    return this
  }

  prependMiddleware (...middleware) {
    this._middleware = _.flatten(middleware).concat(this._middleware)
    return this
  }

  prefix(prefix) {
    this._prefix.push(prefix)
    return this
  }

  namespace(namespace) {
    this._namespace.push(namespace)
    return this
  }

  toJSON() {
    return {
      method: this._method,
      route: this._route,
      handler: this._handler,
      namespace: this._namespace,
      prefix: this._prefix,
      middleware: this._middleware
    }
  }

}
