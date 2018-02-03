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

  async get(id, params) {
    console.log(this.config)
    console.log(id, params) // gets logged, but request results in 404?
    return await Users.findAll()
  }

}

module.exports = MessageService
