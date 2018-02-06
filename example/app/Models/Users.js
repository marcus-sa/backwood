'use strict'

const bcrypt = use('bcryptjs')
const Model = use('Model')

module.exports = class UserModel extends Model {

  /**
   * Whether or not a service
   * should be created for this model
   *
   * @property createService
   * @optional
   * @static
   * @type {Boolean}
   */
   static get createService() {
     return true
   }

  /**
   * Define name for the service
   *
   * @property serviceName
   * @optional
   * @static
   * @type {String}
   */
  static get serviceName() {
    return 'users'
  }

  /**
   * Define pagination for the service
   *
   * @property paginate
   * @optional
   * @static
   * @type {Object}
   */
  static get paginate() {

  }

  /**
   * Define database table for the Sequelize Model
   *
   * @property tableName
   * @required
   * @static
   * @type {String}
   */
  static get tableName() {
    return 'users'
  }

  /**
   * Define attributes for the Sequelize Model
   *
   * @method attributes
   * @argument {Object} DataTypes
   * @returns {Object}
   * @static
   * @required
   */
  static attributes(DataTypes) {
    return {
      username: DataTypes.STRING
    }
  }

  /**
   * Define options for the Sequelize Model
   *
   * @property options
   * @optional
   * @static
   * @type {Object}
   */
  static get options() {
    return {
      timestamps: false
    }
  }

  /**
   * Define service hooks
   *
   * @property serviceHooks
   * @static
   * @optional
   * @type {Object}
   */
  static get serviceHooks() {
    return {}
  }

  /**
  * Define hooks for the Sequelize Model
  *
  * @property hooks
  * @optional
  * @static
  * @type {Object}
  */
  static get hooks() {
    return {
      beforeCreate(account, options) {
        const salt = bcrypt.genSaltSync(10)
        account.password = bcrypt.hashSync(account.password, salt)
      }
    }
  }

  /**
   * Sequelize instance method
   * for verifying a users password
   *
   * @method verifyPassword
   * @param {String} password
   * @return {String} hashed password
   */
  verifyPassword(password) {
    return bcrypt.compareSync(password, this.password)
  }

}
