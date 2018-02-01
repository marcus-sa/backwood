'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

const NAMESPACE = 'Adonis/Addons/Feathers'

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
  }

  boot() {
    this.app.use(NAMESPACE)._start(this.app)
  }

}

module.exports = FeathersProvider
