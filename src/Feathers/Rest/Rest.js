'use strict'

const _ = require('lodash')
const path = require('path')
const express = require('@feathersjs/express')

const RouteManager = require('./Route/Manager')

module.exports = class Rest extends RouteManager {

  constructor(Ioc, Feathers, Config, Env, Helpers) {
    super()

    this._config = Config.get('feathers.express', { port: 3031 })
    this._env = Env.get('NODE_ENV')
    this._helpers = Helpers
    this._controllersPath = 'App/Controllers'

    this._ioc = Ioc
    this.express = express
    this.feathers = Feathers
    this.app = express(Feathers.app).configure(express.rest())//express(Feathers.app)
  }

  _createNamedMiddleware(namedMiddleware = {}) {
    return Object.keys(namedMiddleware).reduce((middleware, name) => {
      middleware[name] = typeof middleware[name] === 'string'
        ? this._ioc.use(middleware[name])
        : middleware[name]

      return middleware
    }, namedMiddleware)
  }

  _createGlobalMiddleware(globalMiddleware = []) {
    return globalMiddleware.map(middleware => {
      return typeof middleware === 'string'
        ? this._ioc.use(middleware)
        : middleware
    })
  }

  _createHandler(...args) {
    return this._ioc.makeFunc(args.join('/')).method
  }

  _start(options) {
    const start = require(path.join(this._helpers.appRoot(), 'start', 'rest.js'))

    const globalMiddleware = this._createGlobalMiddleware(start.globalMiddleware)
    const namedMiddleware = this._createNamedMiddleware(start.namedMiddleware)
    const routes = this.routeStore.list()

    routes.forEach(route => {
      route = route.toJSON()

      const slashes = route.route[0] === '/' ? '' : '/'
      const path = route.prefix.join('/') + slashes + route.route
      const middleware = [globalMiddleware, route.middleware.map(
          (name) => namedMiddleware[name]
      )]

      if (route.method === 'service') {
        const service = this.feathers.getServices(route.route)

        this.app.use(path, service.closure)//...middleware.concat(service.closure))

        if (service.hooks) {
          this.app.service(path).hooks(service.hooks)
        }

        return null
      }

      if (typeof route.handler === 'string') {
          route.handler = this._createHandler(this._controllersPath, ...route.namespace, route.handler)
      }

      this.app[route.method](path, ...middleware.concat(route.handler))
    })

    this.app.listen(this._config.port)
    console.info('Feathers REST API is listening on port:', this._config.port)
  }

  service(name, closure) {
    this.feathers.service(name, closure, true)

    this.route('service', name, closure)

    return this
  }

  before(closure) {
    this.feathers.before(closure)

    return this
  }

  before(closure) { // beforeHooks
    this.feathers._validateServiceBreakpoint()
    this.feathers._createHooks('before', closure)

    return this
  }

  after(closure) { // afterHooks
    this.feathers._validateServiceBreakpoint()
    this.feathers._createHooks('after', closure)

    return this
  }

}
