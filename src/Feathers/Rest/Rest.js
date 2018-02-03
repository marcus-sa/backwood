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
    this.app = express(Feathers.app)//express(Feathers.app)
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
    this.app.configure(express.rest())

    const globalMiddleware = this._createGlobalMiddleware(start.globalMiddleware)
    const namedMiddleware = this._createNamedMiddleware(start.namedMiddleware)
    const routes = this.routeStore.list()

    routes.forEach(route => {
      route = route.toJSON()

      const slashes = route.route[0] === '/' ? '' : '/'
      const path = route.prefix.join('/') + slashes + route.route

      if (route.method === 'service') {
        const { closure } = this.feathers.getServices(route.route)
        const service = typeof closure === 'string'
          ? this.feathers._createService(closure)
          : closure

        this.app.use(path, service)//...middleware.concat(service.closure))

        if (service.hooks) {
          this.app.service(path).hooks(service.hooks)
        }

        return null
      }

      const middleware = route.middleware.map(
          (name) => namedMiddleware[name]
      ).concat(globalMiddleware)

      if (typeof route.handler === 'string') {
          route.handler = this._createHandler(this._controllersPath, ...route.namespace, route.handler)
      }

      console.log(path, route.method)

      this.app[route.method](path, ...middleware.concat(route.handler))
    })

    this.app.listen(this._config.port)
    console.info('Feathers REST API is listening on port:', this._config.port)
  }

  service(name, closure) {
    this.feathers.service(name, closure, true)

    //console.log(this.feathers.service(name))

    this.route('service', name, closure)

    return this
  }

  dependencies(dependencies) {
    this.feathers.dependencies(dependencies)

    return this
  }

  before(closure) { // beforeHooks
    this.feathers.before(closure)

    return this
  }

  after(closure) { // afterHooks
    this.feathers.after(closure)

    return this
  }

}
