'use strict'

const Service = use('Service')
const Users = use('Users')

class MessageService extends Service {

  static get hooks() {
    return {
      before: {
        create(ctx) {
          ctx.data.updatedAt = new Date()
        }
      }
    }

  }

  get(id, params) {
    return Users.getById(id)
  }

}

module.exports = MessageService
