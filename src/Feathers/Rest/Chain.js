'use strict'

const _ = require('lodash')

module.exports = class RouteStore {

  constructor () {
    this._chain = []
  }

  add (middleware) {
    this._chain.push(middleware)
  }

  /*remove (routeToRemove) {
    _.remove(this._routes, (route) => route === routeToRemove)
    if (this.hasBreakpoint()) {
      _.remove(this._breakpoint.routes, (route) => route === routeToRemove)
    }
  }*/

  clear () {
    this._chain = []
  }

  list () {
    return this._chain
  }
}
