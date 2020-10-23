import web3 from './web3'
import BN from 'bignumber.js'


// FIXME: temp
import store from '../store'
import * as errorStore from '../components/common/errorStore'
import { notifyHandler, notifyNotification } from '../init'

import ModelValueTether from './value/tether'
import ModelValueError from './value/error'

const ModelLpToken = {
  /**
   *  @param {Object} opts
   *  @param {string} opts.address
   *  @param {Array} opts.abi
   *  @param {string} opts.code
   *  @param {string} opts.name
   *  @param {string} opts.symbol
   *  @param {number=} opts.decimal
   *  @param {string=} opts.getBalanceOfMethod
   *  @return {!Object}
   */
  create ({
    address = '',
    abi = [],
    code = '',
    decimal = 18,
    wrappedDecimal = 4,
    getBalanceOfMethod = 'balanceOf',
    getDecimalMethod = 'decimals'
  } = {}) {
    const __store__ = {
      contract: null,
      name: '',
      symbol: '',
      decimal,
      wrappedDecimal
    }

    return {
      code,
      address,
      abi,

      get contract () {
        const { contract } = __store__
        const { abi, address } = this

        return contract ||
          (__store__.contract = new web3.eth.Contract(abi, address))
      },

      get name () {
        const { name } = __store__

        !name && this.getName()

        return name
      },
      async getName () {
        const { contract } = this
        const result = __store__.name = await contract.methods.name().call()

        return result
      },

      get symbol () {
        const { symbol } = __store__

        !symbol && this.getSymbol()

        return symbol
      },
      async getSymbol () {
        const { contract } = this
        const result = __store__.symbol = await contract.methods.symbol().call()

        return result
      },

      decimal,

      /** @type {number} */
      get precision () {
        const { decimal } = this

        return Math.pow(10, decimal)
      },

      accountBalanceOf: ModelValueTether.create(__store__),
      /**
       *  - FIXME: auto bind account address
       *  @param {string} address
       *  @return {Promise}
       */
      async getAccountBalanceOf (address) {
        const { contract, accountBalanceOf } = this

        accountBalanceOf.tether = await contract.methods[getBalanceOfMethod](address).call()

        return accountBalanceOf.handled
      },

      getBalance (tokenAddress) {
        
      },
      tokens: {
        SFG: {},
        DAI: {}
      },





      price: ModelValueTether.create(),


      // ------------------------------
      // FIXME: TEMP
      priceUnitAddress: process.env.VUE_APP_DAI_TOKEN, // DAI
      // // TODO: priceUnit
      // async getPrice (priceUnit) {
      //   const { address, priceUnitAddress, price } = this
      //   const result = await storeprice.getPrice(priceUnitAddress, address)

      //   // XXX: tether?
      //   price.tether = result

      //   return result
      // },

      // error: ModelValueError.create(),

    }
  }
}

export default ModelLpToken
