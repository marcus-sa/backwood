'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

const NAMESPACE = 'Backwood/Feathers'

class FeathersProvider extends ServiceProvider {

  register() {
    this.app.singleton(NAMESPACE, (app) => {
      const Feathers = require('./Feathers')

      const Config = app.use('Config')
      const Env = app.use('Env')
      const Helpers = app.use('Helpers')

      return new Feathers(app, Config, Env, Helpers)
    })
    this.app.alias(NAMESPACE, 'Feathers')

    this.app.singleton(`${NAMESPACE}/Service`, () => require('./Service'))
    this.app.alias(`${NAMESPACE}/Service`, 'Service')
    this.app.alias(`${NAMESPACE}/Service`, 'Hooks')
  }

  boot() {
    this.app.use(NAMESPACE)._start(this.app)
  }

}

module.exports = FeathersProvider
