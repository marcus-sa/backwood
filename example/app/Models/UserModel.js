'use strict'

const Model = use('Model')

module.exports = class UserModel extends Model {

  static get tableName() {
    return 'users'
  }

  static attributes(DataTypes) {
    return {
      username: DataTypes.STRING
    }
  }

  static get options() {
    return {
      timestamps: false
    }
  }

  static findOneByAccount(id, other = {}) {
    return this.findOne({
      where: { account_id: id, ...other }
    })
  }

}
