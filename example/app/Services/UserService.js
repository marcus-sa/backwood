'use strict'

const Service = use('Service')
const Users = use('Models/Users')

class UserService extends Service {

  get(id, params) {
    return Users.findById(id)
  }

}

module.exports = UserService
