'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

const NAMESPACE = 'Adonis/Addons/Feathers/Rest'

class FeathersRestProvider extends ServiceProvider {

  register() {
    this.app.singleton(NAMESPACE, (app) => {
      const Rest = require('./Rest')

      const Feathers = app.use('Feathers')
      const Config = app.use('Config')
      const Env = app.use('Env')
      const Helpers = app.use('Helpers')

      return new Rest(app, Feathers, Config, Env, Helpers)
    })

    this.app.alias(NAMESPACE, 'Rest')
  }


  boot() {
    this.app.use(NAMESPACE)._start()
  }

}

module.exports = FeathersRestProvider
