'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

const SEQUELIZE = 'Backwood/Feathers/Sequelize'
const MODEL = `Backwood/Feathers/Model`

class FeathersSequelizeProvider extends ServiceProvider {

    async register() {
        this.app.singleton(MODEL, () => require('./Model'))
        this.app.alias(MODEL, 'Model')

        this.app.singleton(SEQUELIZE, (app) => {
          const Sequelize = require('./Sequelize')

          const Rest = app.use('Rest')
          const Config = app.use('Config')
          const Helpers = app.use('Helpers')

          return new Sequelize(Rest, app, Config, Helpers)
        })

        this.app.alias(SEQUELIZE, 'Sequelize')
    }

    async boot() {
      this.app.use(SEQUELIZE)._start()
    }

}

module.exports = FeathersSequelizeProvider
