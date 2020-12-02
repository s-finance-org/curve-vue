import web3 from '../web3'
import BN from 'bignumber.js'

// TODO: store.wallet.address

// FIXME: temp
// import wallet from '../../store/wallet'

import store from '../../store'
import * as errorStore from '../../components/common/errorStore'
import { notifyHandler, notifyNotification } from '../../init'

import swaps from '../../store_v2/swaps'

import ModelValueEther from '../value/ether'
import ModelValueEther1 from '../value/ether1'
import ModelWalletEther from '../wallet/ether'
import ModelValueString from '../value/string'
import ModelValueBytes32 from '../value/bytes32'
import ModelValueUint8 from '../value/uint8'
import ModelValueError from '../value/error'

import { TOKEN_MIN_AMOUNT_ETHER, TOKEN_MAX_AMOUNT_ETHER } from '../helpers/constant'
import { USD } from '../../store_v2/currencies'

export default {
  /**
   *  @param {Object} opts
   *  @param {string} opts.code
   *  @param {string} opts.address
   *  @param {Array} opts.abi
   * @param {Object=} opts.name
   *  @param {number=} opts.decimal
   *  @param {number=} opts.contDecimal
   *  @param {Object=} opts.moneyOfAccount
   *  @param {Object=} opts.getPrice
   *  @param {Object=} opts.symbol
   *  @param {string=} opts.symbolMethodName
   *  @param {string=} opts.balanceOfMethodName
   *  @param {string=} opts.totalSupplyMethodName
   *  @return {!Object}
   */
  create ({
    code = '',
    address = '',
    abi = [],
    isLpToken = false,
    name = ModelValueString.create(),
    decimal = 18,
    decimals = ModelValueUint8.create(),
    contDecimal = 4,
    moneyOfAccount = USD,
    // XXX: default
    getPrice = null,
    symbol = ModelValueString.create(),
    // ERC20
    nameMethodName = 'name',
    symbolMethodName = 'symbol',
    decimalsMethodName = 'decimals',
    balanceOfMethodName = 'balanceOf',
    approveMethodName = 'approve',
    allowanceMethodName = 'allowance',
    totalSupplyMethodName = 'totalSupply',
    transferFromMethodName = 'transferFrom',
    transferMethodName = 'transfer',
  } = {}) {
    const __store__ = {
      contract: null,
      initialized: false,
      decimal,
      precision: 0,
    }

    const valueOpts = {
      decimal,
      decimals,
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
      getNameMethod: mixin.contract.methods[nameMethodName],
      getSymbolMethod: mixin.contract.methods[symbolMethodName],
      getDecimalsMethod: mixin.contract.methods[decimalsMethodName],
      getTotalSupplyMethod: mixin.contract.methods[totalSupplyMethodName],
      getBalanceOfMethod: mixin.contract.methods[balanceOfMethodName],
      getAllowanceMethod: mixin.contract.methods[allowanceMethodName],
      getApproveMethod: mixin.contract.methods[approveMethodName],
      getTransferFromMethod: mixin.contract.methods[transferFromMethodName],
      getTransferMethod: mixin.contract.methods[transferMethodName],
    }

    return {
      ...mixin,

      /**
       *  Base
       */

      code,
      address,
      abi,

      /**
       *  是否为 LP token
       *  - TODO:
       *  @type {boolean}
       */
      isLpToken,

      error: ModelValueError.create(),

      /**
       *  是否已初始化
       *  @type {boolean}
       */
      get initialized () {
        return __store__.initialized
      },

      async initiate (isSerie = false) {
        const {
          address,
          name,
          symbol,
          totalSupply,
        } = this
        const {
          decimals
        } = valueOpts

        /* sync */
        // XXX: this.getPriceMethod 为合约方法，getPrice为自定义方法，取其一
        this.getPrice && await this.getPrice()

        const base = [
          { decodeType: decimals.type, call: [address, methods.getDecimalsMethod().encodeABI()], target: decimals }
        ]

        const once = [
          { decodeType: name.type, call: [address, methods.getNameMethod().encodeABI()], target: name },
          { decodeType: symbol.type, call: [address, methods.getSymbolMethod().encodeABI()], target: symbol },
          { decodeType: totalSupply.type, call: [address, methods.getTotalSupplyMethod().encodeABI()], target: totalSupply }
        ]

        const wallet = [
        ]

        let queues = []

        if (!__store__.initialized) {
          __store__.initialized = true
          queues = base.concat(once)
        }

        // XXX:
        queues = queues.concat(wallet)

        // await swaps.multicall.batcher(queues)

        return queues
      },

      price: ModelValueEther1.create(valueOpts),
      getPrice,
      /* 计价货币 */
      moneyOfAccount,
      // XXX: 未设定
      // getPriceMethod,

      /** @type {string} */
      name,

      /** @type {string} */
      symbol,
      /** @type {number} */
      // decimal,

      // decimals,
      ...valueOpts,

      /** @type {number} */
      get precision () {
        const { precision } = __store__
        const { decimal } = this

        return precision
          || (__store__.precision = Math.pow(10, decimal))
      },

      /** @type {string} */
      totalSupply: ModelValueEther1.create(valueOpts),

      /**
       *  Amount
       */
      minAmount: ModelValueEther1.create({
        ...valueOpts,
        ether: TOKEN_MIN_AMOUNT_ETHER,
        contDecimal: 0
      }),
      maxAmount: ModelValueEther1.create({
        ...valueOpts,
        ether: TOKEN_MAX_AMOUNT_ETHER,
        contDecimal: 0
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

        // amount >= minAmount && maxAmount <= amount
        const result = bnAmountEther.gte(minAmount.ether)
          && bnAmountEther.let(maxAmount.ether)

        if (!result) {
          error.message = store.i18n.$i18n.t('model.valueOutValidRange')
        }

        return result
      },

      /**
       *  是否允许无限授权数量
       *  @type {boolean}
       */
      isInfiniteAllowance: false,

      /**
       *  是否需要重置授权
       *  @type {boolean}
       */
      needResetAllowance: false,

      /**
       *  @param {string|number} amount
       *  @param {string} toContractAddress
       *  @param {boolean=} infinite
       */
      async ensureAllowance (amount, toContractAddress) {
        // const { precision, error, maxAmount, isInfiniteAllowance, needResetAllowance } = this

        // const amountEther = BN(amount).times(precision)
        // if (!this.isValidAmount(amountEther)) {
        //   return false
        // }

        // const allowanceEther = BN(await methods.getAllowanceMethod(store.wallet.address, toContractAddress).call())

        // if (isInfiniteAllowance) {
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


        // // isInfiniteAllowance
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

      /**
       *  Wallet
       */
      walletBalanceOf: ModelWalletEther.create({
        ...valueOpts,
        async trigger (address) {
          const result = await methods.getBalanceOfMethod(address).call()
          return result
        }
      }),

      /**
       *  @param {string} address
       *  @return {string}
       */
      async getBalanceOf (address) {
        const result = await methods.getBalanceOfMethod(address).call()

        return result
      }
    }
  }
}
