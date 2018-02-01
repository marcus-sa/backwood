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
    this.app = express(Feathers.app)
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
      if (typeof route.handler === 'string') {
        route.handler = this._createHandler(this._controllersPath, ...route.namespace, route.handler)
      }

      const middleware = route.middleware.map(name => {
        return namedMiddleware[name]
      })

      const path = route.prefix.join('/') + '/' + route.route
      const handlers = [].concat(globalMiddleware, middleware, route.handler)

      this.app[route.method](path, ...handlers)
    })

    this.app.listen(this._config.port)
    console.info('Feathers REST API is listening on port:', this._config.port)
  }

}
