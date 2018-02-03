'use strict'

const path = require('path')
const Sequelize = require('sequelize')
const service = require('feathers-sequelize')

module.exports = class FeathersSequelize {

    constructor(Rest, Ioc, Config, Helpers) {
        this._rest = Rest
        this._ioc = Ioc
        this._helpers = Helpers
        const config = Config.get('database')
        const dialect = config.connection
        const database = config[dialect]

        this._modelsPath = 'App/Models'

        this.sequelize = new Sequelize(
            database.database || '',
            database.username || '',
            database.password || '',
            {
                dialect: database.client,
                host: database.host,
                pool: database.pool || {},
                storage: database.storage
            }
        )

        this._models = {}
        this._start()
    }

    _start() {
        const { models } = require(path.join(this._helpers.appRoot(), 'start', 'app.js'))

        Object.keys(models).forEach(modelName => {
            this._ioc.singleton(`Model/${modelName}`, (ioc) => {
                const Model = this._ioc.use(models[modelName])
                const sequelizeModel = this.sequelize.define(
                    Model.tableName,
                    Model.attributes(Sequelize),
                    Model.options || {}
                )

                const modelInstance = new Model()

                Object.keys(Model).forEach(prop => {
                    if (!sequelizeModel.hasOwnProperty(prop)) {
                        sequelizeModel[prop] = Model[prop].bind(sequelizeModel)
                    }
                })

                Object.keys(modelInstance).forEach(prop => {
                    if (!sequelizeModel.prototype.hasOwnProperty(prop)) {
                        sequelizeModel.prototype[prop] = modelInstance[prop].bind(sequelizeModel.prototype)
                    }
                })

                this._models[modelName] = sequelizeModel

                this._rest.app.use(Model.tableName, service({
                    Model: sequelizeModel
                }))

                return sequelizeModel
            })
        })
    }

}