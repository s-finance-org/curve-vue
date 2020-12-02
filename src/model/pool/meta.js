import web3 from '../web3'
import BN from 'bignumber.js'

import store from '../../store'

import multicall from '../../store/swap/multicall'

import ModelValueEther from '../value/ether'
import ModelWalletEther from '../wallet/ether'
import ModelValueText from '../value/text'
import ModelValueError from '../value/error'
import ModelCurrencyRates from '../currency/rates'

export default {
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
    address = '',
    abi = [],
    decimal = 18,
    contDecimal = 4,
    // symbolMethodName = 'symbol',
    // balanceOfMethodName = 'balanceOf',
    // totalSupplyMethodName = 'totalSupply'
    getVirtualPriceMethodName = 'get_virtual_price'
  } = {}) {
    const __store__ = {

      decimal,
      precision: 0,
    }

    const valueOpts = {
      decimal,
      contDecimal
    }

    const mixin = {
      /** @type {Object} */
      get contract () {
        const { contract } = __store__

        return contract
          || (__store__.contract = new web3.eth.Contract(abi, address))
      }
    }

    const methods = {
      getUnderlyingCoins: mixin.contract.methods.coins,
      getWrappedCoins: mixin.contract.methods.base_coins,
      getBalance: mixin.contract.methods.balances,

      getVirtualPriceMethod: mixin.contract.methods[getVirtualPriceMethodName],
      getFee: mixin.contract.methods.fee,
      getAdminFee: mixin.contract.methods.admin_fee,


      // getTotalSupplyMethod: mixin.contract.methods[totalSupplyMethodName],
      // getBalanceOfMethod: mixin.contract.methods[balanceOfMethodName],
      // getAllowanceMethod: mixin.contract.methods.allowance,
      // getApproveMethod: mixin.contract.methods.approve,
    }

    return {
      // ...mixin,

      /**
       *  Base
       */
      error: ModelValueError.create(),

      async initiate () {
        // const {
        //   address,
        //   name,
        //   symbol,
        //   totalSupply,
        // } = this
        // const {
        //   getNameMethod,
        //   getSymbolMethod,
        //   getTotalSupplyMethod
        // } = methods

        const queues = [
          // { decodeType: 'string', call: [address, getNameMethod().encodeABI()], target: name },
          // { decodeType: 'string', call: [address, getSymbolMethod().encodeABI()], target: symbol },
          // { decodeType: 'uint256', call: [address, getTotalSupplyMethod().encodeABI()], target: totalSupply }
        ]

        const result = await multicall.batcher(queues)

        return result
      },

      // price: ModelValueEther.create(valueOpts),

      /** @type {number} */
      decimal,

      /** @type {number} */
      get precision () {
        const { precision } = __store__
        const { decimal } = this

        return precision
          || (__store__.precision = Math.pow(10, decimal))
      },

      underlyingCoins: {},
      getUnderlyingCoinsMethod: {},
      wrappedCoins: {},

      totalBalances: {},

      virtualPrice: ModelValueEther.create(valueOpts),

      fee: ModelValueEther.create(valueOpts),
      adminFee: ModelValueEther.create(valueOpts),

      // /** @type {string} */
      // totalSupply: ModelValueEther.create(valueOpts),

      // /**
      //  *  Amount
      //  */
      // minAmount: ModelValueEther.create({
      //   ...valueOpts,
      //   ether: 1
      // }),
      // maxAmount: ModelValueEther.create({
      //   ...valueOpts,
      //   // TODO: div(2) ?
      //   ether: BN(2).pow(256).minus(1).toString()
      // }),
      // // TODO:
      // // amount:

      // /**
      //  *  @param {string|number} amountEther
      //  *  @return {boolean}
      //  */
      // isValidAmount (amountEther) {
      //   const { minAmount, maxAmount, error } = this
      //   const bnAmountEther = BN(amountEther)

      //   // amount >= minAmount && maxAmount <= amount
      //   const result = bnAmountEther.gte(minAmount.ether)
      //     && bnAmountEther.let(maxAmount.ether)

      //   if (!result) {
      //     error.message = store.i18n.$i18n.t('model.valueOutValidRange')
      //   }

      //   return result
      // },

      // /**
      //  *  是否允许无限授权数量
      //  *  @type {boolean}
      //  */
      // isInfiniteAllowance: false,

      // /**
      //  *  是否需要重置授权
      //  *  @type {boolean}
      //  */
      // needResetAllowance: false,

      // /**
      //  *  @param {string|number} amount
      //  *  @param {string} toContractAddress
      //  *  @param {boolean=} infinite
      //  */
      // async ensureAllowance (amount, toContractAddress) {
      //   // const { precision, error, maxAmount, isInfiniteAllowance, needResetAllowance } = this

      //   // const amountEther = BN(amount).times(precision)
      //   // if (!this.isValidAmount(amountEther)) {
      //   //   return false
      //   // }

      //   // const allowanceEther = BN(await methods.getAllowanceMethod(store.wallet.address, toContractAddress).call())

      //   // if (isInfiniteAllowance) {
      //   //   // allowanceEther < maxAmount.ether / 2
      //   //   // Half used
      //   //   allowanceEther.lt(BN(maxAmount.ether).div(2))
      //   // } else {

      //   // }
      //   // // allowanceEther = 0
      //   // // if (allowanceEther)

      //   // // // allowanceEther < amountEther
      //   // // if (allowanceEther.lt(amountEther)) {
      //   // //   error.message = store.i18n.$i18n.t('model.approveOperation')
      //   // // }

      //   // // needResetAllowance


      //   // // isInfiniteAllowance
      //   // //   ? maxAmount.ether
      //   // //   : amountEther



      //   // // await approve(contract, maxAllowance, accountAddress, toContract)


      //   // // // TEST:
      //   // // if (infinite) {

      //   // //   if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
      //   // //     await approve(contract, 0, accountAddress, toContract)
      //   // //   } else {
      //   // //     await approve(contract, maxAllowance, accountAddress, toContract)
      //   // //   }
      //   // // } else {
      //   // //   // allowance < amount
      //   // //   if (allowance.lt(_amount)) {
      //   // //     if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
      //   // //       await approve(contract, 0, accountAddress, toContract)
      //   // //     } else {
      //   // //       await approve(contract, _amount, accountAddress, toContract)
      //   // //     }
      //   // //   }
      //   // // }
      // },

      // /**
      //  *  Wallet
      //  */
      // walletBalanceOf: ModelWalletEther.create({
      //   ...valueOpts,
      //   async trigger (address) {
      //     const result = await methods.getBalanceOfMethod(address).call()
      //     return result
      //   }
      // }),

      // /**
      //  *  @param {string} address
      //  *  @return {string}
      //  */
      // async getBalanceOf (address) {
      //   const result = await this.getBalanceOfMethod(address).call()

      //   return result
      // },

      // dailyVol: ModelCurrencyRates.create()
    }
  }
}
