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

    this._serviceBreakpoint = null
    this._services = {}
    this._servicesPath = 'App/Services'
    this._hooksPath = 'App/Services/Hooks'

    this.app = feathers()
  }

  _createService(name) {
    const service = this._ioc.use(`${this._servicesPath}/${name}`)

    this._validateService(service)

    return this._ioc._makeInstanceOf(service)
  }

  _validateService(Module) {
    if (Module.prototype instanceof Service === false) {
        throw new Error(`${Module.name} must extend base Service class`)
    }
  }

  _validateServiceBreakpoint() {
    if (!this._serviceBreakpoint) {
      throw new Error('No service breakpoint')
    }
  }

  _start(adonis) {
    this._start = require(path.join(this._helpers.appRoot(), 'start', 'feathers.js'))

    Object.keys(this._services)
      .filter(service => service.express)
      .forEach(serviceName => {
        const { closure } = this._services[serviceName]

        const service = typeof closure === 'string'
          ? this._createService(closure)
          : closure

        this.app.use(serviceName, service).hooks(service.hooks || {})

        /*this._ioc.singleton(`Services/${serviceName}`, () => {
          return this.app.service(serviceName)
        })*/
      })

    this.app.listen(this._config.port)
    console.log('Feathers App is listening on port:', this._config.port)
  }

  /**
   * Create a Feathers service
   *
   * @method service
   *
   * @param {String} name
   * @param {String | Object} closure
   * @param {Boolean: false} express
   *
   * @return {Service}
   * @chainable
   */
  service(name, closure, express = false) {
    if (!closure) {
      if (!this._services[name]) {
        throw new Error(`${name} service doesn't exist yet`)
      } else if (!this._booted) {
        throw new Error(`Feathers has not booted yet`)
      }

      return this.app.service(name)
    }

    this._serviceBreakpoint = name

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

  before(closure) {
    this._validateServiceBreakpoint()

    this._createHooks('before', closure)

    return this
  }

  after(closure) {
    this._validateServiceBreakpoint()

    this._createHooks('after', closure)

    return this
  }

  getServices(name) {
    return name ? this._services[name] : this._services
  }

}
