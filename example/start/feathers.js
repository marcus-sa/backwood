'use strict'

const primus = use('@feathersjs/primus')

const Feathers = use('Feathers')

Feathers
  .configure(primus({ transformer: 'websockets' }))
  .service('message', 'MessageService')
  //.service('products', 'ProductService').hooks('ProductService')
  //.service('products', 'ProductService').before('ProductService')
  //.service('products', 'ProductService').after('ProductService')
