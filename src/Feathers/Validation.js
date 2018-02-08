'use strict'

const errors = require('@feathersjs/errors')
const validator = require('validator')
const validation = require('../src/utils/validation')

const isEmpty = (value) => value === undefined || value === null || value === ''
const join = (rules) => (value, data, params) => rules.map(rule => rule(value, data, params)).filter(error => !!error)[0]

const validations = {
  isEmail(value) {
    if (!validator.isEmail(String(value))) {
      return 'You need to give a valid email address.'
    }
  },
  required(value) {
    if (isEmpty(value)) {
      return 'This field is required.'
    }
  },
  minLength(min) {
    return (value) => {
      if (!isEmpty(value) && value.length < min) {
        return `Must be at least ${min} characters`
      }
    }
  },
  maxLength(max) {
    return (value) => {
      if (!isEmpty(value) && value.length > max) {
        return `Must be no more than ${max} characters`
      }
    }
  },
  integer(value) {
    if (!isEmpty(value) && !Number.isInteger(Number(value))) {
      return 'Must be an integer'
    }
  },
  oneOf(enumeration) {
    return (value) => {
      if (!~enumeration.indexOf(value)) {
        return `Must be one of: ${enumeration.join(', ')}`
      }
    }
  },
  match(field) {
    return (value, data) => {
      if (data) {
        if (value !== data[field]) {
          return 'Do not match'
        }
      }
    }
  },
  unique(field) {
    return async (value, data, { hook }) => {
      const result = await hook.service.find({ query: { [field]: value } })
      if (result.total !== 0) {
        throw new Error('Already exist')
      }
    }
  }
}

function createValidator(rules, params) {
  return (data = {}) => {
    const errors = {}
    Object.keys(rules).forEach(key => {
      const rule = join([].concat(rules[key])) // concat enables both functions and arrays of functions
      const error = rule(data[key], data, { key, ...params })

      if (error) errors[key] = error
    })
    return errors
  }
}

function validateHook(schema) {
  return async (hook) => {
    try {
      await createAsyncValidator(schema, { hook })(hook.data)
      return hook
    } catch (errorsValidation) {
      if (Object.keys(errorsValidation).length) {
        throw new errors.BadRequest('Validation failed', errorsValidation)
      }
    }
  }
}

function createAsyncValidator(rules, params) {
  return async (data = {}) => {
    const errors = validation.createValidator(rules, params)(data)

    const finalErrors = await Object.keys(errors).reduce(async (result, name) => {
      try {
        const error = await errors[name]
        return error ? Object.assign(result, { [name]: error }) : result
      } catch (error) {
        return Object.assign(result, { [name]: error.message || error })
      }
    }, {})

    if (Object.keys(finalErrors).length) {
      throw finalErrors
    }

    return data
  }
}

module.exports = {
  ...validations,
  validateHook,
  createValidator,
  createAsyncValidator
}
