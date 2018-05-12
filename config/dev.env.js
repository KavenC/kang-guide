'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const env = require('dotenv')
const result = env.config()

module.exports = merge(result.parsed, {
  NODE_ENV: '"development"',
})
