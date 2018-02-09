'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

const NAMESPACE = 'Backwood/Rest'

class FeathersRestProvider extends ServiceProvider {

  async register() {
    this.app.singleton(NAMESPACE, (Ioc) => {
      const Rest = require('./Rest')

      const Feathers = Ioc.use('Feathers')
      const Config = Ioc.use('Config')
      const Env = Ioc.use('Env')
      const Helpers = Ioc.use('Helpers')

      return new Rest(Ioc, Feathers, Config, Env, Helpers)
    })

    this.app.alias(NAMESPACE, 'Rest')
  }


  async boot() {
    this.app.use(NAMESPACE)._start()
  }

}

module.exports = FeathersRestProvider
