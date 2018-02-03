'use strict'

module.exports = class Model {

    static get inject() {
        return ['Helpers', 'Sequelize', 'Ioc']
    }

    constructor(Helpers, Sequelize, Ioc) {
        const { models } = require(path.join(Helpers.appRoot(), 'start', 'app.js'))

        Object.keys(models).forEach(modelName => {
            Ioc.singleton(`Model/${modelName}`, (ioc) => {
                const sequelizeModel = Sequelize.define(
                    this.tableName,
                    this.attributes(Sequelize),
                    this.options || {}
                )

                Object.keys(this).forEach(prop => {
                    if (!sequelizeMode.hasOwnProperty(prop)) {
                    sequelizeModel[prop] = this[prop].bind(sequelizeModel)
                }

                Object.keys(this).forEach(prop => {
                    if (sequelizeModel.prototype.hasOwnProperty(prop)) {
                        sequelizeModel.prototype[prop] = modelInstance[prop].bind(sequelizeModel.prototype)
                    }
                })

                return sequelizeModel
            })
        })
    }

}