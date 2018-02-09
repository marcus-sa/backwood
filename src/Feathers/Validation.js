'use strict'

const errors = require('@feathersjs/errors')

module.exports = function validateSchema(schema) {
  return async (hook) => {
    try {
      await schema.validate(hook.data, { abortEarly: false })

      return hook
    } catch ({ inner }) {
      const errorsValidation = inner.reduce((stack, error) => {
        stack[error.path] = error.message

        return stack
      }, {})

      throw new errors.BadRequest('Validation failed', errorsValidation)
    }
  }
}
