'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

const SEQUELIZE = 'Backwood/Feathers/Sequelize'
const MODEL = `${SEQUELIZE}/Model`

class FeathersSequelizeProvider extends ServiceProvider {

    register() {
        this.app.singleton(MODEL, (app) => {
            return require('./Model')
        })
        this.app.alias(MODEL, 'Model')

        this.app.singleton(SEQUELIZE, (app) => {
            const Sequelize = require('./Sequelize')

            const Rest = app.use('Rest')
            const Config = app.use('Config')
            const Helpers = app.use('Helpers')

            return new Sequelize(Rest, app, Config, Helpers)
        })
    }

    boot() {
        console.log(this.app.use(SEQUELIZE)._models)
    }

}

module.exports = FeathersSequelizeProvider