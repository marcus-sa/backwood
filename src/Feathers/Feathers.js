'use strict'

const _ = require('lodash')
const path = require('path')
const feathers = require('@feathersjs/feathers')

const Service = require('./Service')

module.exports = class Feathers {

  constructor(Ioc, Config, Env, Helpers) {
    this._config = Config.get('feathers', { port: 3030 })
    this._ioc = Ioc
    this._env = Env.get('NODE_ENV')
    this._helpers = Helpers

    this._booted = false
    this._dependencyBreakpoint = null
    this._serviceBreakpoint = null
    this._services = {}
    this._resolvers = []
    this._servicesPath = 'App/Services'
    this._hooksPath = 'App/Services/Hooks'

    this.app = feathers()
  }

  _createService(name, dependencies = null) {
    const Service = this._ioc.use(`${this._servicesPath}/${name}`)

    this._validateService(Service)

    return new Service(dependencies)

    //return this._ioc._makeInstanceOf(this._ioc.use(`${path}/${name}`))
  }

  _validateService(Module) {
    if (Module.prototype instanceof Service === false) {
        throw new Error(`${Module.name} must extend base Service class`)
    }
  }

  /*_createClosureHooks(name) {
    return this._ioc.use(`${this._hooksPath}/${name}`)
  }

  _createHooks(name, closure) {
    this._services[this._serviceBreakpoint].hooks[name] = (
      typeof closure === 'string'
        ? this._createClosureHooks(closure)
        : closure
    )

    this._serviceBreakpoint = null
  }*/

  _validateServiceBreakpoint() {
    if (!this._serviceBreakpoint) {
      throw new Error('No service breakpoint')
    }
  }

  _validateDependencyBreakpoint() {
    if (!this._dependencyBreakpoint) {
      throw new Error('No dependency breakpoint')
    }
  }

  _start(adonis) {
    this._start = require(path.join(this._helpers.appRoot(), 'start', 'feathers.js'))

    console.log(this._resolvers)

    Object.keys(this._services)
      .filter(service => !service.express)
      .forEach(serviceName => {
        const { closure, express, dependencies } = this._services[serviceName]

        const service = typeof closure === 'string'
          ? this._createService(closure, dependencies)
          : closure

        const app = express
          ? use('Rest').app.use(serviceName, service)
          : this.app

        if (service.hooks) {
          app.service(serviceName).hooks(service.hooks)
        }
      })

    this.app.listen(this._config.port)
    console.log('Feathers App is listening on port:', this._config.port)
  }

  addResolver(handler) {
    this._resolvers.push(handler)
  }

  service(name, closure, express = false) {
    if (!closure) {
      if (!this._services[name]) {
        throw new Error(`${name} service doesn't exist yet`)
      } else if (!this._booted) {
        throw new Error(`Feathers has not booted yet`)
      }

      return this.app.service(name)
    }

    this._dependencyBreakpoint = name
    this._serviceBreakpoint = name

    /*if (typeof closure === 'string') {
      closure = this._createService(closure)
    }*/

    this._services[name] = {
      closure,
      express
    }

    return this
  }

  use(module) {
    this.app.use(module)

    return this
  }

  configure(module) {
    this.app.configure(module)

    return this
  }

  before(closure) { // beforeHooks
    this._validateServiceBreakpoint()

    this._createHooks('before', closure)

    return this
  }

  after(closure) { // afterHooks
    this._validateServiceBreakpoint()

    this._createHooks('after', closure)

    return this
  }

  dependencies(dependencies = []) {
    this._validateDependencyBreakpoint()

    this._services[this._dependencyBreakpoint].dependencies = dependencies.map(dependency => {
      return this._ioc.use(dependency)
    })

    return this
  }

  getServices(name) {
    return name ? this._services[name] : this._services
  }

  /*hooks(closure) {
    this._validateServiceBreakpoint()

    if (typeof closure === 'string') {
      closure = this._createClosureHooks(closure)
    }

    this._services[this._serviceBreakpoint].hooks = closure
    this._serviceBreakpoint = null

    return this
  }*/

}
