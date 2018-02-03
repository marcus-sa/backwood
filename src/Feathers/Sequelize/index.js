'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

const SEQUELIZE = 'Backwood/Feathers/Sequelize'
const MODEL = `Backwood/Feathers/Model`

class FeathersSequelizeProvider extends ServiceProvider {

    register() {
        this.app.singleton(MODEL, (app) => {
            return require('./Model')
        })
        this.app.alias(MODEL, 'Model')

        this.app.singleton(SEQUELIZE, (app) => {
          const Sequelize = require('./Sequelize')

          const Rest = this.app.use('Rest')
          const Config = this.app.use('Config')
          const Helpers = this.app.use('Helpers')

          return new Sequelize(Rest, app, Config, Helpers)
        })
    }

    boot() {
      this.app.use(SEQUELIZE)._start()
    }

}

module.exports = FeathersSequelizeProvider
