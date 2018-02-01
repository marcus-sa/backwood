'use strict'

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
exports.providers = [
  require('path').join(__dirname, '..', 'providers', 'Feathers'),
  require('path').join(__dirname, '..', 'providers', 'Feathers', 'Rest'),
  '@adonisjs/framework/providers/AppProvider',
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
exports.aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider'
]

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
exports.aliases = {}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
exports.commands = []
