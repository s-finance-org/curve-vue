import web3 from './web3'
import BN from 'bignumber.js'

// TODO: store.wallet.address


// FIXME: temp
import store from '../store'
import * as errorStore from '../components/common/errorStore'
import { notifyHandler, notifyNotification } from '../init'

import multicall from '../store/swap/multicall'

import ModelValueEther from './value/ether'
import ModelValueText from './value/text'
import ModelValueError from './value/error'

const ModelLpToken = {
  /**
   *  @param {Object} opts
   *  @param {string} opts.code
   *  @param {string} opts.address
   *  @param {Array} opts.abi
   *  @param {number=} opts.decimal
   *  @param {number=} opts.contDecimal
   *  @param {string=} opts.symbolMethodName
   *  @param {string=} opts.balanceOfMethodName
   *  @param {string=} opts.totalSupplyMethodName
   *  @return {!Object}
   */
  create ({
    code = '',
    address = '',
    abi = [],
    decimal = 18,
    contDecimal = 4,
    symbolMethodName = 'symbol',
    balanceOfMethodName = 'balanceOf',
    totalSupplyMethodName = 'totalSupply'
  } = {}) {
    const __store__ = {
      contract: null,
      decimal,
      precision: 0,
    }

    const valueOpts = {
      decimal,
      contDecimal
    }

    return {
      code,
      address,
      abi,

      error: ModelValueError.create(),

      async initiate () {
        const {
          address,
          name,
          getNameMethod,
          symbol,
          getSymbolMethod,
          totalSupply,
          getTotalSupplyMethod
        } = this

        const queues = [
          { decodeType: 'string', call: [address, getNameMethod().encodeABI()], target: name },
          { decodeType: 'string', call: [address, getSymbolMethod().encodeABI()], target: symbol },
          { decodeType: 'uint256', call: [address, getTotalSupplyMethod().encodeABI()], target: totalSupply }
        ]

        const result = await multicall.batcher(queues)

        return result
      },

      /** @type {Object} */
      get contract () {
        const { contract } = __store__
        const { abi, address } = this

        return contract
          || (__store__.contract = new web3.eth.Contract(abi, address))
      },

      /** @type {string} */
      name: ModelValueText.create(),
      /** @type {Function} */
      get getNameMethod () {
        const { contract } = this

        return contract.methods.name
      },

      /** @type {string} */
      symbol: ModelValueText.create(),
      /** @type {Function} */
      get getSymbolMethod () {
        const { contract } = this

        return contract.methods[symbolMethodName]
      },

      /** @type {number} */
      decimal,

      /** @type {number} */
      get precision () {
        const { precision } = __store__
        const { decimal } = this

        return precision
          || (__store__.precision = Math.pow(10, decimal))
      },

      /** @type {string} */
      totalSupply: ModelValueEther.create(valueOpts),
      /** @type {Function} */
      get getTotalSupplyMethod () {
        const { contract } = this

        return contract.methods[totalSupplyMethodName]
      },

      minAmount: ModelValueEther.create({
        ...valueOpts,
        ether: 1
      }),
      maxAmount: ModelValueEther.create({
        ...valueOpts,
        // TODO: div(2) ?
        ether: BN(2).pow(256).minus(1).toString()
      }),
      // TODO:
      // amount:

      /**
       *  @param {string|number} amountEther
       *  @return {boolean}
       */
      isValidAmount (amountEther) {
        const { minAmount, maxAmount, error } = this
        const bnAmountEther = BN(amountEther)

        const result = bnAmountEther.gte(minAmount.ether)
          && bnAmountEther.let(maxAmount.ether)

        if (!result) {
          error.message = store.i18n.$i18n.t('model.valueOutValidRange')
        }

        return result
      },

      /** @type {boolean} */
      infiniteAllowance: false,

      /** @type {boolean} */
      needResetAllowance: false,

      /**
       *  @param {string|number} amount
       *  @param {string} toContractAddress
       *  @param {boolean=} infinite
       */
      async ensureAllowance (amount, toContractAddress) {
        // const { precision, error, maxAmount, infiniteAllowance, needResetAllowance } = this

        // const amountEther = BN(amount).times(precision)
        // if (!this.isValidAmount(amountEther)) {
        //   return false
        // }

        // const allowanceEther = BN(await this.getAllowanceMethod(store.wallet.address, toContractAddress).call())

        // if (infiniteAllowance) {
        //   // allowanceEther < maxAmount.ether / 2
        //   // Half used
        //   allowanceEther.lt(BN(maxAmount.ether).div(2))
        // } else {

        // }
        // // allowanceEther = 0
        // // if (allowanceEther)

        // // // allowanceEther < amountEther
        // // if (allowanceEther.lt(amountEther)) {
        // //   error.message = store.i18n.$i18n.t('model.approveOperation')
        // // }

        // // needResetAllowance


        // // infiniteAllowance
        // //   ? maxAmount.ether
        // //   : amountEther



        // // await approve(contract, maxAllowance, accountAddress, toContract)


        // // // TEST:
        // // if (infinite) {

        // //   if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
        // //     await approve(contract, 0, accountAddress, toContract)
        // //   } else {
        // //     await approve(contract, maxAllowance, accountAddress, toContract)
        // //   }
        // // } else {
        // //   // allowance < amount
        // //   if (allowance.lt(_amount)) {
        // //     if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
        // //       await approve(contract, 0, accountAddress, toContract)
        // //     } else {
        // //       await approve(contract, _amount, accountAddress, toContract)
        // //     }
        // //   }
        // // }
      },
      /** @type {Function} */
      get getAllowanceMethod () {
        const { contract } = this

        return contract.methods.allowance
      },

      get getApproveMethod () {
        const { contract } = this

        return contract.methods.approve
      },

      /**
       *  Wallet
       */

      walletBalanceOf: ModelValueEther.create(valueOpts),
      /**
       *  - sync walletBalanceOf
       *  @return {string}
       */
      async getWalletBalanceOf () {
        const { contract, walletBalanceOf } = this

        walletBalanceOf.ether = await contract.methods[balanceOfMethodName](store.wallet.address).call()

        return walletBalanceOf.handled
      },

      /**
       *  @param {string} address
       *  @return {string}
       */
      async getBalanceOf (address) {
        const result = await this.getBalanceOfMethod(address).call()

        return result
      },
      async getBalanceOfMethod (address) {
        const { contract } = this

        return contract.methods[balanceOfMethodName](address)
      },



      price: ModelValueEther.create(valueOpts),





      underlyingCoins: {},

      hasTokensCoins: false,
      tokensCoins: {},





      


      // ------------------------------
      // FIXME: TEMP
      priceUnitAddress: process.env.VUE_APP_DAI_TOKEN, // DAI
      // // TODO: priceUnit
      // async getPrice (priceUnit) {
      //   const { address, priceUnitAddress, price } = this
      //   const result = await storeprice.getPrice(priceUnitAddress, address)

      //   // XXX: ether?
      //   price.ether = result

      //   return result
      // },


    }
  }
}

export default ModelLpToken
