'use strict'

const _ = require('lodash')

module.exports = class RouteStore {

  constructor () {
    this._routes = []
    this.releaseBreakpoint()
  }

  breakpoint (name = null) {
    this._breakpoint.enabled = true
    this._breakpoint.name = name
  }

  hasBreakpoint () {
    return this._breakpoint.enabled
  }

  breakpointRoutes () {
    return this._breakpoint.routes
  }

  releaseBreakpoint () {
    this._breakpoint = {
      enabled: false,
      routes: [],
      name: null
    }
  }

  add (route) {
    if (this.hasBreakpoint()) {
      this._breakpoint.routes.push(route)
    }
    this._routes.push(route)
  }

  remove (routeToRemove) {
    _.remove(this._routes, (route) => route === routeToRemove)
    if (this.hasBreakpoint()) {
      _.remove(this._breakpoint.routes, (route) => route === routeToRemove)
    }
  }

  clear () {
    this._routes = []
  }

  find (routeNameOrHandler, domain) {
    return _.find(this._routes, (route) => {
      const isName = () => route._name === routeNameOrHandler
      const isRoute = () => route._route === routeNameOrHandler
      const isHandler = () => route._handler === routeNameOrHandler
      const isDomain = domain && route._domain && route._domain.test(domain)

      return domain
        ? (isName() && isDomain) || (isHandler() && isDomain) || (isRoute() && isDomain)
        : isName() || isRoute() || isHandler()
    })
  }

  list () {
    return this._routes
  }
}
