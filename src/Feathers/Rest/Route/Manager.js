'use strict'

const _ = require('lodash')

const Route = require('./index')
const RouteStore = require('./Store')
const MiddlewareChain = require('../Chain')
const RouteGroup = require('./Group')

module.exports = class RouteManager {

  constructor() {
    this.middlewareChain = new MiddlewareChain()
    this.routeStore = new RouteStore()
  }

  _validateGroupClosure (callback) {
    if (typeof callback !== 'function') {
      throw new Error('Route.group expects a callback')
    }
  }

  _validateNestedGroups () {
    if (this.routeStore.hasBreakpoint()) {
      this.routeStore.releaseBreakpoint()
      throw new Error('Nested route groups are not allowed')
    }
  }

  route(method, route, handler) {
    const routeInstance = new Route(method, route, handler)
    this.routeStore.add(routeInstance)

    this.middlewareChain.add(routeInstance)

    return routeInstance
  }

  get(route, handler) {
    return this.route('get', route, handler)
  }

  post(route, handler) {
    return this.route('post', route, handler)
  }

  group (name, callback) {
    /**
     * If name is a function, consider it as a callback
     * and mark name as null.
     */
    if (typeof name === 'function') {
      callback = name
      name = null
    }

    this._validateGroupClosure(callback)
    this._validateNestedGroups()

    this.routeStore.breakpoint(name)
    callback()

    const group = new RouteGroup(this.routeStore.breakpointRoutes())

    this.routeStore.releaseBreakpoint()
    return group
  }

}
