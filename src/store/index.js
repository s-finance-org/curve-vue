/**
 *  NOtE:
 *  Store
 */

import Vue from 'vue'

import dotenv from 'dotenv-flow'
// /**
//  *  .env
//  */
// const dotenv = require('dotenv-flow').config();

const store = {
  a: 'a'
}

export default Vue.observable(store)
