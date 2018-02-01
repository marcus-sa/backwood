'use strict'

const primus = use('@feathersjs/primus')

const Feathers = use('Feathers')

Feathers
  .configure(primus({ transformer: 'websockets' }))
  .service('message', 'MessageService').hooks('MessageHooks')
  //.service('products', 'ProductService').hooks('ProductService')
