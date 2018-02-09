'use strict'

const _ = require('lodash')
const pascalCase = require('pascal-case')
const express = require('@feathersjs/express')

const Route = require('./Route')
const RouteManager = require('./Route/Manager')

module.exports = class Rest extends RouteManager {

  constructor(Ioc, Feathers, Config, Env, Helpers) {
    super()

    this._config = Config.get('feathers.express', { port: 3000 })
    this._env = Env.get('NODE_ENV')
    this._helpers = Helpers
    this._controllersPath = 'App/Controllers'

    this._ioc = Ioc
    this._services = []
    this.express = express
    this.feathers = Feathers
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
    const start = require(this._helpers.appRoot('start/rest.js'))
    this.app.configure(express.rest())

    const globalMiddleware = this._createGlobalMiddleware(start.globalMiddleware)
    const namedMiddleware = this._createNamedMiddleware(start.namedMiddleware)
    //const routes = this.routeStore.list()
    const chain = this.middlewareChain.list()

    chain.forEach(next => {
      if (next instanceof Route) {
        const route = next.toJSON()

        const slashes = route.route[0] === '/' ? '' : '/'
        const path = route.prefix.join('/') + slashes + route.route

        if (route.method === 'service') {
          const { closure } = this.feathers.getServices(route.route)

          return this.feathers._createService(closure, path, this.app)
        }

        const middleware = route.middleware.map(
            (name) => namedMiddleware[name]
        ).concat(globalMiddleware)

        if (typeof route.handler === 'string') {
            route.handler = this._createHandler(this._controllersPath, ...route.namespace, route.handler)
        }

        return this.app[route.method](path, ...middleware.concat(route.handler))
      }

      next()
    })

    this.app.listen(this._config.port)
    console.info('Feathers REST API is listening on port:', this._config.port)
  }

  _addMethod(methodName, method) {
    this[methodName] = method.bind(this)
  }

  use(middleware) {
    this.middlewareChain.add(() => {
      this.app.use(middleware)
    })

    return this
  }

  configure(middleware) {
    this.middlewareChain.add(() => {
      this.app.configure(middleware)
    })

    return this
  }

  service(name, closure) {
    this.feathers.service(name, closure, true)

    this.route('service', name, closure)

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
