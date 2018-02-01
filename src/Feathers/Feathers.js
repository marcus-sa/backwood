'use strict'

const _ = require('lodash')
const path = require('path')
const feathers = require('@feathersjs/feathers')

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

  _createClosure(path, name) {
    return this._ioc._makeInstanceOf(this._ioc.use(`${path}/${name}`))
  }

  _createHooks(name, closure) {
    this._services[this._serviceBreakpoint].hooks[name] = (
      typeof closure === 'string'
        ? this._createClosure(this._hooksPath, closure)
        : closure
    )

    this._serviceBreakpoint = null
  }

  _validateServiceBreakpoint() {
    if (!this._serviceBreakpoint) {
      throw new Error('No service breakpoint')
    }
  }

  _start(adonis) {
    this._start = require(path.join(this._helpers.appRoot(), 'start', 'feathers.js'))

    Object.keys(this._services).forEach(serviceName => {
      const service = this._services[serviceName]
      this.app.use(serviceName, service.closure)

      if (service.hooks) {
        this.app.service(serviceName).hooks(service.hooks)
      }
    })

    this.app.listen(this._config.port)
    console.log('Feathers App is listening on port:', this._config.port)
  }

  service(name, closure) {
    if (!closure) {
      if (!this._services[name]) {
        throw new Error('Service doesnt exist yet')
      }

      return this.app.service(name)
    }

    this._serviceBreakpoint = name

    if (typeof closure === 'string') {
      closure = this._createClosure(this._servicesPath, closure)
    }

    this._services[name] = {
      closure,
      hooks: {}
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

  hooksBefore(closure) {
    this._validateServiceBreakpoint()

    this._createHooks('before', closure)

    return this
  }

  hooksAfter(closure) {
    this._validateServiceBreakpoint()

    this._createHooks('after', closure)

    return this
  }

  hooks(closure) {
    this._validateServiceBreakpoint()

    if (typeof closure === 'string') {
      closure = this._createClosure(this._hooksPath, closure)
    }

    this._services[this._serviceBreakpoint].hooks = closure
    this._serviceBreakpoint = null

    return this
  }

}
