import web3 from '../web3'
import BN from 'bignumber.js'


// FIXME: temp
import store from '../../store'
import * as errorStore from '../../components/common/errorStore'
import { notifyHandler, notifyNotification } from '../../init'

import ModelValueTether from '../value/tether'
import ModelValueError from '../value/error'



// FIXME: 
const approve = (contract, amount, account, toContract) => {
  // if(!toContract) toContract = currentContract.swap_address
  return new Promise((resolve, reject) => {
      contract.methods.approve(toContract, BN(amount).toFixed(0,1))
      .send({
          from: account,
          // gasPrice: gasPriceStore.state.gasPriceWei,
          // gas: 100000,
      })
      .once('transactionHash', hash => {
        notifyHandler(hash)
        resolve(true)
      })
      .on('error', err => {
        errorStore.handleError(err)
        reject(err)
      })
      .catch(err => {
        errorStore.handleError(err)
        reject(err)
      });
    })
}

const ModelToken = {
  /**
   *  @param {Object} opts
   *  @param {string} opts.address
   *  @param {Array} opts.abi
   *  @param {string} opts.code
   *  @param {string} opts.name
   *  @param {string} opts.symbol
   *  @param {number} [opts.decimal=]


   *  @return {!Object}
   */
  create ({
    address = '',
    abi = [],
    code = '',
    name = '',
    symbol = '',
    decimal = 18
  } = {}) {
    const __store__ = {
      contract: null,

      precision: 0
    }

    return {
      address,
      abi,

      get contract () {
        const { contract } = __store__
        const { abi, address } = this

        return contract ||
          (__store__.contract = new web3.eth.Contract(abi, address))
      },

      code,
      name,
      symbol,
      decimal,

      /**
       *  @type {number}
       */
      get precision () {
        const { decimal } = this

        return Math.pow(10, decimal)
      },

      /**
       *  @param {Object!} target
       *  @param {string} address
       *  @return {Promise}
       */
      async getBalanceOf (target, address) {
        const { contract } = this

        const result = target.tether = await contract.methods.balanceOf(address).call()

        return result
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

      error: ModelValueError.create(),

    }
  }
}

export default ModelToken
