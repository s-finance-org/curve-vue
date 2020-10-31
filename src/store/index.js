/**
 *  NOtE:
 *  Store
 */

import Vue from 'vue'

import { notifyHandler, notifyNotification } from '../init'
import * as common from '../utils/common.js'
import * as gaugeStore from '../components/dao/gaugeStore'
import daoabis from '../components/dao/allabis'
import * as gasPriceStore from '../components/common/gasPriceStore'
import BN from 'bignumber.js'
import * as errorStore from '../components/common/errorStore'

import I18nLanguages from '../i18n/languages'
import { valueModel } from '../model'
import { floor } from '../utils/math/round'

import abiSNX from '../components/dao/abi/snx'
import abiCRV from '../components/dao/abi/crv'
import abiSUSDv2 from '../components/dao/abi/susdv2'
import abiBpt from '../components/dao/abi/bpt'
import BALANCER_POOL_ABI from '../components/dao/abi/BALANCER_POOL_ABI'
import abiSFG from '../components/dao/abi/sfg'
import abiDfi from '../components/dao/abi/dfi'
import abi_iUSD_LPT from '../components/dao/abi/iUSD_LPT'
import swapAbi_iUSD_LPT from '../components/dao/abi/swapAbi_iUSD_LPT'
import abi_susdv2_swap from '../components/dao/abi/susdv2_swap'
import { ERC20_abi as abiSusdv2LpToken } from '../allabis'

// TEMP:
import { contract as currentContract} from '../contract'

// Swap
import uniswapV2Router2 from './swap/uniswap_v2_router2'
import multicall from './swap/multicall'

// import TOKEN_USDT_ABI from './token/abi/USDT'
// import TOKEN_DF_ABI from './token/abi/DF'
import TOKEN_DUSD_ABI from './token/abi/dUSD'


import { GAUGE_DUSD_ABI } from './gauge'

import ModelToken from '../model/token'
import ModelLpToken from '../model/lptoken'
import ModelValueEther from '../model/value/ether'

import request from './request'

const requiresResetAllowance = [
  process.env.VUE_APP_USDT_TOKEN, // USDT
  '0xC25a3A3b969415c80451098fa907EC722572917F', // Curve.fi DAI/USDC/USDT/sUSD
  '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3', // Curve.fi renBTC/wBTC/sBTC
  '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8', // Curve.fi yDAI/yUSDC/yUSDT/yTUSD
  process.env.VUE_APP_DFI_TOKEN, // s.finance iUSDT/iDAI/iUSDC
  process.env.VUE_APP_DUSD_TOKEN, // s.finance dDAI/dUSDC/dUSDT/dUSDx
  process.env.VUE_APP_OKUU_TOKEN, // s.finance OKU/USDT
]

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

const errorModelStore = {
  create () {
    return {
      message: '',
      dismissCountDown: 0
    }
  }
}

const errorModel = {
  create () {
    const __store__ = errorModelStore.create()

    return {
      // get hasMessage () {
      //   const { message } = this

      //   return !!message
      // },

      get message () {
        return __store__.message
      },
      set message (val) {
        const { dismissSecs } = this

        this.dismissCountDown = dismissSecs
        __store__.message = val
      },

      dismissSecs: 10,
      get dismissCountDown () {
        return __store__.dismissCountDown
      },
      set dismissCountDown (val) {
        const result = __store__.dismissCountDown = val

        if (result === 0) {
          __store__.message = ''
        }
      }
      // countDownChanged (val) {
      //   __store__.dismissCountDown = val
      // },
    }
  }
}

const store = {
  metaInfo: {
    template: {
      title: 'S.finance',
      meta: [
        { 'property': 'og:title', 'content': 's.finance' },
        { 'property': 'og:url', 'content': 'https://s.finance'},
        {'property': 'og:type', 'content': 'website'},
        {'property': 'og:description', 'content': ''},
        {'property': 'og:image', 'content': '/sfinance.png'},
        {'name': 'twitter:card', 'content': 'summary_large_image'},
        {'name': 'twitter:title', 'content': 's.finance'},
        {'name': 'twitter:site', 'content': ''},
        {'name': 'twitter:creator', 'content': ''},
        {'name': 'twitter:description', 'content': ''},
        {'name': 'twitter:url', 'content': 'https://s.finance'},
        {'name': 'twitter:image', 'content': '/sfinance.png'},
      ]
    },
    getData () {
      return this.template
    }
  }
}

store.price = {
  address: '0x2f49eea1efc1b04e9ecd3b81321060e29db26a19',
  abi: BALANCER_POOL_ABI,
  __contract: null,
  get contract () {
    const { __contract, abi, address } = this

    return __contract ||
      (this.__contract = new web3.eth.Contract(abi, address))
  },
  async getPrice (UnitAddress, targetAddress) {
    const { contract } = this

    return await contract.methods.getSpotPrice(UnitAddress, targetAddress).call()
  }
}

// TODO: defaultAccount
// store.account = {
//   __address: undefined,
//   get address () {
//     const { __address } = this

//     return __address ||
//       (this.__address = new web3.eth.defaultAccount) 
//   }
// }

store.tokens = {
  usdt: {
    code: 'usdt',
    name: 'Tether USD',
    symbol: 'USDT',
    deprecated: false,
    totalSupply: 0, // XXX:
    address: process.env.VUE_APP_USDT_TOKEN,

    decimal: 6,
    /**
     *  @type {number}
     */
    get precision () {
      const { decimal } = this

      return Math.pow(10, decimal)
    },

    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },
    async getBalances (address) {
    },
    async getBalanceOf (address) {

    },
    async doAllowance () {

    }
  },
  // df: ModelToken.create({
  //   address: process.env.VUE_APP_DF_TOKEN,
  //   // abi: TOKEN_DF_ABI,
  //   abi: abiSFG,
  //   code: 'df',
  //   name: 'dForce',
  //   symbol: 'DF',
  // }),

  // dusd: ModelToken.create({
  //   address: process.env.VUE_APP_DUSD_TOKEN,
  //   // abi: TOKEN_DUSD_ABI,
  //   abi: abiSFG,
  //   code: 'dusd',
  //   name: 'dUSD LP token',
  //   symbol: 'dUSD',
  // }),

  df: {
    name: 'DF',
    address: process.env.VUE_APP_DF_TOKEN,
    // abi: TOKEN_DF_ABI,
    abi: abiSFG,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    decimal: 18,
    /**
     *  @type {number}
     */
    get precision () {
      const { decimal } = this

      return Math.pow(10, decimal)
    },

    userBalanceOf: valueModel.create(),
    async getBalanceOf (target, accountAddress) {
      const { contract, userBalanceOf } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      userBalanceOf.ether = target.ether = result

      return result
    },

    error: errorModel.create(),

    price: valueModel.create(),
    priceUnit: 'USDT',
    // FIXME: 
    async getPrice () {
      const { address, price } = this

      let amountsTether = await uniswapV2Router2.getPrice(this, store.tokens.usdt)
      // FIXME: try
      amountsTether = BN(amountsTether).times(1e18).toString()
      price.ether = amountsTether

      return price.handled
    },

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    // ether
    minAllowance: 1,
    // ether
    maxAllowance: BN(2).pow(256).minus(1),
    async hasValidAmount (val) {
      const { minAllowance, maxAllowance, error } = this
      const _val = BN(val).times(1e18)
      // FIXME: balance Of
      const result = _val.gte(minAllowance) &&
        // TODO: div(2) why?
        _val.lte(maxAllowance.div(2))

      if (!result) {
        error.message = store.i18n.$i18n.t('model.valueOutValidRange')
      }

      return result
    },
    async hasApprove (amount, accountAddress, toContract) {
      const { contract, error } = this
      const _amount = BN(amount).times(1e18)
      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())
console.log('allowance', allowance.toString(), allowance.toString() / 1e18, '->', _amount.toString(), _amount.toString() / 1e18 )
      // allowance >= amount && amount > 0
      const result = allowance.gte(_amount) && BN(_amount).gt(0)

      if (!result) {
        error.message = store.i18n.$i18n.t('model.approveOperation')
      }

      return result
    },
    async onApproveAmount (amount, accountAddress, toContract, infinite = false) {
      const { contract, maxAllowance } = this
      const _amount = BN(amount).times(1e18)

      console.log('amount', amount)
      if (!await this.hasValidAmount(amount)) return false

      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())

      if (infinite) {
        // allowance < maxAllowance / 2 && amount > 0
        // TODO: div(2) why?
        if (allowance.lt(maxAllowance.div(2))) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, maxAllowance, accountAddress, toContract)
          }
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, _amount, accountAddress, toContract)
          }
        }
      }
    },
  },

  okuu: {
    name: 'OKUU',
    address: process.env.VUE_APP_OKUU_TOKEN,
    // abi: TOKEN_DF_ABI,
    abi: abiSFG,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },
    swapAddress: process.env.VUE_APP_OKUU_SWAP,
    swapAbi: swapAbi_iUSD_LPT,
    __contractSwap: null,
    get contractSwap () {
      const { __contractSwap, swapAbi, swapAddress } = this

      return __contractSwap ||
        (this.__contractSwap = new web3.eth.Contract(swapAbi, swapAddress))
    },

    decimal: 6,
    /**
     *  @type {number}
     */
    get precision () {
      const { decimal } = this

      return Math.pow(10, decimal)
    },

    userBalanceOf: valueModel.create(),
    async getBalanceOf (target, accountAddress) {
      const { contract, userBalanceOf } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      userBalanceOf.ether = target.ether = result

      return result
    },

    error: errorModel.create(),

    price: valueModel.create(),
    priceUnit: 'USDT',
    // FIXME: 
    async getPrice () {
      const { price, contractSwap } = this

      const result = await contractSwap.methods.get_virtual_price().call()

      price.ether = result

      return price.handled
    },

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    // ether
    minAllowance: 1,
    // ether
    maxAllowance: BN(2).pow(256).minus(1),
    async hasValidAmount (val) {
      const { minAllowance, maxAllowance, error } = this
      const _val = BN(val).times(1e18)
      // FIXME: balance Of
      const result = _val.gte(minAllowance) &&
        // TODO: div(2) why?
        _val.lte(maxAllowance.div(2))

      if (!result) {
        error.message = store.i18n.$i18n.t('model.valueOutValidRange')
      }

      return result
    },
    async hasApprove (amount, accountAddress, toContract) {
      const { contract, error } = this
      const _amount = BN(amount).times(1e18)
      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())
console.log('allowance', allowance.toString(), allowance.toString() / 1e18, '->', _amount.toString(), _amount.toString() / 1e18 )
      // allowance >= amount && amount > 0
      const result = allowance.gte(_amount) && BN(_amount).gt(0)

      if (!result) {
        error.message = store.i18n.$i18n.t('model.approveOperation')
      }

      return result
    },
    async onApproveAmount (amount, accountAddress, toContract, infinite = false) {
      const { contract, maxAllowance } = this
      const _amount = BN(amount).times(1e18)

      console.log('amount', amount)
      if (!await this.hasValidAmount(amount)) return false

      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())

      if (infinite) {
        // allowance < maxAllowance / 2 && amount > 0
        // TODO: div(2) why?
        if (allowance.lt(maxAllowance.div(2))) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, maxAllowance, accountAddress, toContract)
          }
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, _amount, accountAddress, toContract)
          }
        }
      }
    },
  },

  usd5: {
    name: 'usd5',
    address: process.env.VUE_APP_USD5_TOKEN,
    // abi: TOKEN_DF_ABI,
    abi: abiSFG,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },
    swapAddress: process.env.VUE_APP_USD5_SWAP,
    swapAbi: swapAbi_iUSD_LPT,
    __contractSwap: null,
    get contractSwap () {
      const { __contractSwap, swapAbi, swapAddress } = this

      return __contractSwap ||
        (this.__contractSwap = new web3.eth.Contract(swapAbi, swapAddress))
    },

    decimal: 6,
    /**
     *  @type {number}
     */
    get precision () {
      const { decimal } = this

      return Math.pow(10, decimal)
    },

    userBalanceOf: valueModel.create(),
    async getBalanceOf (target, accountAddress) {
      const { contract, userBalanceOf } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      userBalanceOf.ether = target.ether = result

      return result
    },

    error: errorModel.create(),

    price: valueModel.create(),
    priceUnit: 'USDT',
    // FIXME: 
    async getPrice () {
      const { price, contractSwap } = this

      const result = await contractSwap.methods.get_virtual_price().call()

      price.ether = result

      return price.handled
    },

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    // ether
    minAllowance: 1,
    // ether
    maxAllowance: BN(2).pow(256).minus(1),
    async hasValidAmount (val) {
      const { minAllowance, maxAllowance, error } = this
      const _val = BN(val).times(1e18)
      // FIXME: balance Of
      const result = _val.gte(minAllowance) &&
        // TODO: div(2) why?
        _val.lte(maxAllowance.div(2))

      if (!result) {
        error.message = store.i18n.$i18n.t('model.valueOutValidRange')
      }

      return result
    },
    async hasApprove (amount, accountAddress, toContract) {
      const { contract, error } = this
      const _amount = BN(amount).times(1e18)
      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())
console.log('allowance', allowance.toString(), allowance.toString() / 1e18, '->', _amount.toString(), _amount.toString() / 1e18 )
      // allowance >= amount && amount > 0
      const result = allowance.gte(_amount) && BN(_amount).gt(0)

      if (!result) {
        error.message = store.i18n.$i18n.t('model.approveOperation')
      }

      return result
    },
    async onApproveAmount (amount, accountAddress, toContract, infinite = false) {
      const { contract, maxAllowance } = this
      const _amount = BN(amount).times(1e18)

      console.log('amount', amount)
      if (!await this.hasValidAmount(amount)) return false

      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())

      if (infinite) {
        // allowance < maxAllowance / 2 && amount > 0
        // TODO: div(2) why?
        if (allowance.lt(maxAllowance.div(2))) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, maxAllowance, accountAddress, toContract)
          }
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, _amount, accountAddress, toContract)
          }
        }
      }
    },
  },

  dusd: {
    name: 'dUSD LP token',
    address: process.env.VUE_APP_DUSD_TOKEN,
    swapAddress: process.env.VUE_APP_DUSD_SWAP,
    abi: TOKEN_DUSD_ABI,
    // abi: abiSFG,
    swapAbi: swapAbi_iUSD_LPT,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    __contractSwap: null,
    get contractSwap () {
      const { __contractSwap, swapAbi, swapAddress } = this

      return __contractSwap ||
        (this.__contractSwap = new web3.eth.Contract(swapAbi, swapAddress))
    },

    userBalanceOf: valueModel.create(),
    async getBalanceOf (target, accountAddress) {
      const { contract, userBalanceOf } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      userBalanceOf.ether = target.ether = result

      return result
    },

    error: errorModel.create(),

    price: valueModel.create(),
    async getPrice () {
      const { contractSwap, price } = this
      const result = await contractSwap.methods.get_virtual_price().call()

      price.ether = result

      return price.handled
    },

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    // ether
    minAllowance: 1,
    // ether
    maxAllowance: BN(2).pow(256).minus(1),
    async hasValidAmount (val) {
      const { minAllowance, maxAllowance, error } = this
      const _val = BN(val).times(1e18)
      // FIXME: balance Of
      const result = _val.gte(minAllowance) &&
        // TODO: div(2) why?
        _val.lte(maxAllowance.div(2))

      if (!result) {
        error.message = store.i18n.$i18n.t('model.valueOutValidRange')
      }

      return result
    },
    async hasApprove (amount, accountAddress, toContract) {
      const { contract, error } = this
      const _amount = BN(amount).times(1e18)
      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())

      console.log('allowance', allowance.toString(), allowance.toString() / 1e18, '->', _amount.toString(), _amount.toString() / 1e18 )
      // allowance >= amount && amount > 0
      const result = allowance.gte(_amount) && BN(_amount).gt(0)

      if (!result) {
        error.message = store.i18n.$i18n.t('model.approveOperation')
      }

      return result
    },
    async onApproveAmount (amount, accountAddress, toContract, infinite = false) {
      const { contract, maxAllowance } = this
      const _amount = BN(amount).times(1e18)

      console.log('amount', amount)
      if (!await this.hasValidAmount(amount)) return false

      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())

      if (infinite) {
        // allowance < maxAllowance / 2 && amount > 0
        // TODO: div(2) why?
        if (allowance.lt(maxAllowance.div(2))) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, maxAllowance, accountAddress, toContract)
          }
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, _amount, accountAddress, toContract)
          }
        }
      }
    },
  },


  dai: {
    address: process.env.VUE_APP_DAI_TOKEN,
    // TEMP: 
    price: {
      handled: 1.0115
    },
    // async getPrice () {
    //   const { address, price } = this
    //   // FIXME:
    //   const result = await store.price.getPrice(store.tokens.usdt.address, address)

    //   price.ether = result

    //   return result
    // }
  },
  sfg: {
    name: 'SFG',

    miningRate: 0.001,

    address: process.env.VUE_APP_SFG_TOKEN,
    abi: abiSFG,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    // FIXME: change
    priceUnit: 'DAI',
    priceUnitAddress: process.env.VUE_APP_DAI_TOKEN, // DAI
    price: valueModel.create(),
    // TODO: priceUnit
    async getPrice (priceUnit) {
      const { address, priceUnitAddress, price } = this
      const result = await store.price.getPrice(priceUnitAddress, address)

      // XXX: ether?
      price.ether = result

      return result
    },

    dailyYield: valueModel.create(),
    async getDailyYield () {
      const { contract, dailyYield, miningRate } = this

      // TEMP: 
      return dailyYield.ether = await contract.methods.balanceOf(process.env.VUE_APP_PS_MINTER).call() * miningRate
    },
  },
  susdv2LpToken: {
    address: process.env.VUE_APP_SUSDV2_LPT_TOKEN,
    swapAddress: '0xA5407eAE9Ba41422680e2e00537571bcC53efBfD',
    abi: abiSusdv2LpToken,
    swapAbi: abi_susdv2_swap,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    __contractSwap: null,
    get contractSwap () {
      const { __contractSwap, swapAbi, swapAddress } = this

      return __contractSwap ||
        (this.__contractSwap = new web3.eth.Contract(swapAbi, swapAddress))
    },

    price: valueModel.create(),
    async getPrice () {
      const { contractSwap, price } = this
      const result = await contractSwap.methods.get_virtual_price().call()

      price.ether = result

      return price.handled
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()
console.log('getBalanceOf', result)
      target.ether = result

      return result
    },

    error: errorModel.create(),

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    // ether
    minAllowance: 1,
    // ether
    maxAllowance: BN(2).pow(256).minus(1),
    async hasValidAmount (val) {
      const { minAllowance, maxAllowance, error } = this
      const _val = BN(val).times(1e18)
      // FIXME: balance Of
      const result = _val.gte(minAllowance) &&
        // TODO: div(2) why?
        _val.lte(maxAllowance.div(2))

      if (!result) {
        error.message = store.i18n.$i18n.t('model.valueOutValidRange')
      }

      return result
    },
    async hasApprove (amount, accountAddress, toContract) {
      const { contract, error } = this
      const _amount = BN(amount).times(1e18)
      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())
      console.log('allowance', allowance.toString(), allowance.toString() / 1e18)
      // allowance >= amount && amount > 0
      const result = allowance.gte(_amount) && BN(_amount).gt(0)

      if (!result) {
        error.message = store.i18n.$i18n.t('model.approveOperation')
      }

      return result
    },
    async onApproveAmount (amount, accountAddress, toContract, infinite = false) {
      const { contract, maxAllowance } = this
      const _amount = BN(amount).times(1e18)

      console.log('amount', amount)
      if (!await this.hasValidAmount(amount)) return false

      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())

      if (infinite) {
        // allowance < maxAllowance / 2 && amount > 0
        // TODO: div(2) why?
        if (allowance.lt(maxAllowance.div(2))) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, maxAllowance, accountAddress, toContract)
          }
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, _amount, accountAddress, toContract)
          }
        }
      }
    },
  },
  snx: {
    address: process.env.VUE_APP_SNX_TOKEN ,
    abi: abiSNX,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },
  },
  crv: {
    address: process.env.VUE_APP_CRV_TOKEN,
    abi: abiCRV,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },
  },
  bpt: {
    address: process.env.VUE_APP_BPT_TOKEN,
    abi: abiBpt,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    userBalanceOf: valueModel.create(),
    async getBalanceOf (target, accountAddress) {
      const { contract, userBalanceOf } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      userBalanceOf.ether = target.ether = result

      return result
    },

    error: errorModel.create(),

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    minAllowance: 1,
    maxAllowance: BN(2).pow(256).minus(1),
    async hasValidAmount (val) {
      const { minAllowance, maxAllowance, error } = this
      const _val = BN(val).times(1e18)
      // FIXME: balance Of
      const result = _val.gte(minAllowance) &&
        // TODO: div(2) why?
        _val.lte(maxAllowance.div(2))

      if (!result) {
        error.message = store.i18n.$i18n.t('model.valueOutValidRange')
      }

      return result
    },
    async hasApprove (amount, accountAddress, toContract) {
      const { contract, error } = this
      const _amount = BN(amount).times(1e18)
      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())
      console.log('allowance', allowance.toString(), allowance.toString() / 1e18)
      // allowance >= amount && amount > 0
      const result = allowance.gte(_amount) && BN(_amount).gt(0)

      if (!result) {
        error.message = store.i18n.$i18n.t('model.approveOperation')
      }

      return result
    },
    async onApproveAmount (amount, accountAddress, toContract, infinite = false) {
      const { contract, maxAllowance } = this
      const _amount = BN(amount).times(1e18)

      console.log('amount', amount)
      if (!await this.hasValidAmount(amount)) return false

      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())

      if (infinite) {
        // allowance < maxAllowance / 2 && amount > 0
        // TODO: div(2) why?
        if (allowance.lt(maxAllowance.div(2))) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, maxAllowance, accountAddress, toContract)
          }
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, _amount, accountAddress, toContract)
          }
        }
      }
    },

    price: valueModel.create(),
    // TODO: priceUnit
    async getPrice () {
      const { price, contract } = this
      const { sfg, dai } = store.tokens

      // FIXME:
      const getalanceDaiInBpt = await contract.methods.getBalance(dai.address).call()
      const getalanceSfgInBpt = await contract.methods.getBalance(sfg.address).call() / 1e18
      const getTotalSupply = await contract.methods.totalSupply().call()

      price.handled = BN(getalanceDaiInBpt)
        // FIXME: Dai price
        // .times(1.02)
        .plus(
          BN(getalanceSfgInBpt)
          .times(sfg.price.handled)
        )
        .dividedBy(
          getTotalSupply
        ).toString()

      return price.handled
    },
  },
  iUSD_LPT: {
    name: 'iUSD LP token',
    address: process.env.VUE_APP_DFI_TOKEN,
    swapAddress: process.env.VUE_APP_DFI_SWAP,
    abi: abi_iUSD_LPT,
    swapAbi: swapAbi_iUSD_LPT,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    __contractSwap: null,
    get contractSwap () {
      const { __contractSwap, swapAbi, swapAddress } = this

      return __contractSwap ||
        (this.__contractSwap = new web3.eth.Contract(swapAbi, swapAddress))
    },

    userBalanceOf: valueModel.create(),
    async getBalanceOf (target, accountAddress) {
      const { contract, userBalanceOf } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      userBalanceOf.ether = target.ether = result

      return result
    },

    error: errorModel.create(),

    price: valueModel.create(),
    async getPrice () {
      const { contractSwap, price } = this
      const result = await contractSwap.methods.get_virtual_price().call()

      price.ether = result

      return price.handled
    },

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    // ether
    minAllowance: 1,
    // ether
    maxAllowance: BN(2).pow(256).minus(1),
    async hasValidAmount (val) {
      const { minAllowance, maxAllowance, error } = this
      const _val = BN(val).times(1e18)
      // FIXME: balance Of
      const result = _val.gte(minAllowance) &&
        // TODO: div(2) why?
        _val.lte(maxAllowance.div(2))

      if (!result) {
        error.message = store.i18n.$i18n.t('model.valueOutValidRange')
      }

      return result
    },
    async hasApprove (amount, accountAddress, toContract) {
      const { contract, error } = this
      const _amount = BN(amount).times(1e18)
      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())
console.log('allowance', allowance.toString(), allowance.toString() / 1e18, '->', _amount.toString(), _amount.toString() / 1e18 )
      // allowance >= amount && amount > 0
      const result = allowance.gte(_amount) && BN(_amount).gt(0)

      if (!result) {
        error.message = store.i18n.$i18n.t('model.approveOperation')
      }

      return result
    },
    async onApproveAmount (amount, accountAddress, toContract, infinite = false) {
      const { contract, maxAllowance } = this
      const _amount = BN(amount).times(1e18)

      console.log('amount', amount)
      if (!await this.hasValidAmount(amount)) return false

      // FIXME:
      const allowance = BN(await contract.methods.allowance(accountAddress, toContract).call())

      if (infinite) {
        // allowance < maxAllowance / 2 && amount > 0
        // TODO: div(2) why?
        if (allowance.lt(maxAllowance.div(2))) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, maxAllowance, accountAddress, toContract)
          }
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
            await approve(contract, 0, accountAddress, toContract)
          } else {
            await approve(contract, _amount, accountAddress, toContract)
          }
        }
      }
    },
  }
}

store.i18n = {
  $i18n: null,

  cacheKeyLocaleCacheKey: '__Global_I18n_locale',
  get defaultLocale () {
    const { cacheKeyLocaleCacheKey } = this

    return localStorage.getItem(cacheKeyLocaleCacheKey) || process.env.VUE_APP_I18N_LOCALE
  },

  // TODO:
  // get locale () {
  //   return this.$i18n.locale
  // },
  set locale (val) {
    const { cacheKeyLocaleCacheKey } = this

    localStorage.setItem(cacheKeyLocaleCacheKey, val)
  },

  supportLanguage: ['zh-CN', 'en-US'],
  // TODO:
  // isSupportLanguage () {
  // },
  languages: I18nLanguages
}

store.gauges = {
  dusd: {
    code: 'dusd',
    name: 'dUSD',
    propagateMark: 'dForce',
    mortgagesUnit: 'dUSD LP token',
    address: process.env.VUE_APP_DUSD_GAUGE,
    abi: abiSUSDv2,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    get mortgageMember () {
      const { mortgages } = this

      return Object.keys(mortgages)
    },
    mortgages: {
      dusd: {
        code: 'dusd',
        name: 'dUSD LP token',
        priceDecimal: 4,

        totalStaking: valueModel.create(),
        userStaking: valueModel.create(),
        userBalanceOf: valueModel.create(),

        userStake: valueModel.create(),
        stakeSliderSelected: 0,
        // FIXME: common
        stakeSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        get stakeAmountInput () {
          const { userStake } = this

          return userStake.revised || ''
        },
        set stakeAmountInput (val) {
          const { userStake } = this

          userStake.revised = val
          this.stakeSliderSelected = 0
        },

        get stakeSliderSelectedRadio () {
          return this.stakeSliderSelected
        },
        set stakeSliderSelectedRadio (val) {
          const { userStake, priceDecimal, userBalanceOf } = this

          if (val === 0) return false

          // FIXME: format
          userStake.revised = +userBalanceOf.handled > 0
            ? floor(BN(val).times(userBalanceOf.handled).toString(), priceDecimal)
            : 0
          this.stakeSliderSelected = val
        },

        userRedemption: valueModel.create(),
        redemptionSliderSelected: 0,
        // FIXME: common
        redemptionSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        get redemptionAmountInput () {
          const { userRedemption } = this

          return userRedemption.revised || ''
        },
        set redemptionAmountInput (val) {
          const { userRedemption } = this

          userRedemption.revised = val
          this.redemptionSliderSelected = 0
        },

        get redemptionSliderSelectedRadio () {
          return this.redemptionSliderSelected
        },
        set redemptionSliderSelectedRadio (val) {
          const { userRedemption, priceDecimal, userStaking } = this

          if (val === 0) return false

          // FIXME: format
          userRedemption.revised = +userStaking.handled > 0
            ? floor(BN(val).times(userStaking.handled).toString(), priceDecimal)
            : 0
          this.stakeSliderSelected = val
        }
      }
    },
    // FIXME: auto create
    rewardsUnit: ['SFG', 'DF'],
    rewards: {
      sfg: {
        code: 'sfg',
        name: 'SFG',
        weighting: valueModel.create(),

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
      },
      df: {
        code: 'df',
        name: 'DF',
        weighting: valueModel.create(),

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
      }
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    dailyAPY: valueModel.create(),
    apy: valueModel.create(),
    // TEMP: 
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice, dfPrice) {
      const { contract, dailyAPY, apy, rewards } = this

      // 0.1*DAI APY + 0.4*USDC APY +0.4*USDT APY + 0.1*USDx APY
      const { dDAI, dUSDC, dUSDT, dUSDx} = await request.getDforceApy()

      const dDAI_apy = BN(dDAI.now_apy).dividedBy(100 * 365).times(0.1)
      const dUSDC_apy = BN(dUSDC.now_apy).dividedBy(100 * 365).times(0.4)
      const dUSDT_apy = BN(dUSDT.now_apy).dividedBy(100 * 365).times(0.4)
      const dUSDx_apy = BN(dUSDx.now_apy).dividedBy(100 * 365).times(0.1)

      // TEMP:
      const dfSwapABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"constant":true,"inputs":[],"name":"DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"df","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"earned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastTimeRewardApplicable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastUpdateTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lockedDetails","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lp","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"reward","type":"uint256"}],"name":"notifyRewardAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"periodFinish","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerTokenStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_rewardDistribution","type":"address"}],"name":"setRewardDistribution","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userRewardPerTokenPaid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
      const contractDfSwap = new web3.eth.Contract(dfSwapABI, '0xD26033b5CEEDce6d8cdDF532c6Cd1eBc2f0ccadf')
      const dfApy = BN(await dfPrice).times(86400).times(await contractDfSwap.methods.rewardRate().call() / 1e18)
        .dividedBy(BN(await totalStaking / 1e18 ).times(await lpTokenPrice))
      dailyAPY.handled = BN(await price / 1e18)
        .times(await dailyYield / 1e18)
        .times(rewards.sfg.weighting.handled)
        .dividedBy(BN(await totalStaking / 1e18).times(await lpTokenPrice))
        .plus(dDAI_apy)
        .plus(dUSDC_apy)
        .plus(dUSDT_apy)
        .plus(dUSDx_apy)
        .plus(dfApy)
        .toString()
      apy.handled = +dailyAPY.handled * 365
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },
    async getUserPendingReward_SFG (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getUserPaidReward_SFG (target, accountAddress) {
      const { contract } = this

      // return target.ether = await contract.methods.integrate_fraction(accountAddress).call()
      return target.ether = await gaugeStore.state.minter.methods.minted(accountAddress, this.address).call()
    },
    async getUserTotalReward_SFG (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async getUserPendingReward_DF (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimable_reward(accountAddress).call()
    },
    async getUserPaidReward_DF (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimed_rewards_for(accountAddress).call()
    },
    async getUserTotalReward_DF (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async onStake (accountAddress, infApproval) {
      const { tokens } = store
      const { name, address, contract, mortgages } = this

      const deposit = BN(mortgages.dusd.userStake.revised).times(1e18)

      // await common.approveAmount(tokens.bpt.contract, deposit, accountAddress, address, infApproval)

      var { dismiss } = notifyNotification(`Please confirm depositing into ${name} gauge`)

      await contract.methods.deposit(deposit.toFixed(0,1)).send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: this.currentPool.deposit.gas,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onRedemption (accountAddress, infApproval) {
      const { name, address, contract, mortgages } = this

      let withdraw = BN(mortgages.dusd.userRedemption.revised).times(1e18)
      let balance = BN(await contract.methods.balanceOf(accountAddress).call())

      console.log('withdraw', withdraw, 'balance', balance)

      if(withdraw.gt(balance))
        withdraw = balance

      // let gas = this.currentPool.deposit.gas
      let withdrawMethod = contract.methods.withdraw(withdraw.toFixed(0,1))

      // try {
      //   // update
      //   gas = await withdrawMethod.estimateGas()
      // }
      // catch(err) { }

      var { dismiss } = notifyNotification(`Please confirm withdrawing from ${name} gauge`)

      await withdrawMethod.send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: gas * 1.5 | 0,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onHarvest (accountAddress) {
      const { name, address, contract, mortgages, rewards } = this
      // let minter = new web3.eth.Contract(daoabis.minter_abi, process.env.VUE_APP_PS_MINTER)

      const mint = await gaugeStore.state.minter.methods.mint(address)
      // let gas = await mint.estimateGas()

      var { dismiss } = notifyNotification(`Please confirm claiming ${rewards.sfg.name} from ${name} gauge`)

      await mint.send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: gas * 1.5 | 0,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onClaimRewards (accountAddress) {
      // const { name, address, contract, mortgages, rewards } = this
      // // let minter = new web3.eth.Contract(daoabis.minter_abi, process.env.VUE_APP_PS_MINTER)

      // // const mint = await gaugeStore.state.minter.methods.mint(address)
      // // let gas = await mint.estimateGas()

      // var { dismiss } = notifyNotification(`Please confirm claiming ${rewards.sfg.name} from ${name} gauge`)

      // await mint.send({
      //   from: accountAddress,
      //   // gasPrice: gasPriceStore.gasPriceWei,
      //   // gas: gas * 1.5 | 0,
      // })
      // .once('transactionHash', hash => {
      //   dismiss()
      //   notifyHandler(hash)
      // })



      const { name, address, contract, mortgages, rewards } = this

      var { dismiss } = notifyNotification(`Please confirm claiming ${rewards.df.name}`)

      await contract.methods.claim_rewards(accountAddress).send({
          from: accountAddress
        })
        .once('transactionHash', hash => {
          dismiss()
          notifyHandler(hash)
        })
    }
  },

  bpt: {
    code: 'bpt',
    name: 'BPT',
    propagateMark: 'SFG',
    mortgagesUnit: 'BPT',
    address: process.env.VUE_APP_BPT_GAUGE,
    abi: abiSUSDv2,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    get mortgageMember () {
      const { mortgages } = this

      return Object.keys(mortgages)
    },
    mortgages: {
      bpt: {
        code: 'bpt',
        name: 'BPT',
        priceDecimal: 4,
        gainUrl: 'https://pools.balancer.exchange/#/pool/0x2f49eea1efc1b04e9ecd3b81321060e29db26a19/',

        totalStaking: valueModel.create(),
        userStaking: valueModel.create(),
        userBalanceOf: valueModel.create(),

        userStake: valueModel.create(),
        stakeSliderSelected: 0,
        // FIXME: common
        stakeSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        get stakeAmountInput () {
          const { userStake } = this

          return userStake.revised || ''
        },
        set stakeAmountInput (val) {
          const { userStake } = this

          userStake.revised = val
          this.stakeSliderSelected = 0
        },

        get stakeSliderSelectedRadio () {
          return this.stakeSliderSelected
        },
        set stakeSliderSelectedRadio (val) {
          const { userStake, priceDecimal, userBalanceOf } = this

          if (val === 0) return false

          // FIXME: format
          userStake.revised = +userBalanceOf.handled > 0
            ? floor(BN(val).times(userBalanceOf.handled).toString(), priceDecimal)
            : 0
          this.stakeSliderSelected = val
        },

        userRedemption: valueModel.create(),
        redemptionSliderSelected: 0,
        // FIXME: common
        redemptionSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        get redemptionAmountInput () {
          const { userRedemption } = this

          return userRedemption.revised || ''
        },
        set redemptionAmountInput (val) {
          const { userRedemption } = this

          userRedemption.revised = val
          this.redemptionSliderSelected = 0
        },

        get redemptionSliderSelectedRadio () {
          return this.redemptionSliderSelected
        },
        set redemptionSliderSelectedRadio (val) {
          const { userRedemption, priceDecimal, userStaking } = this

          if (val === 0) return false

          // FIXME: format
          userRedemption.revised = +userStaking.handled > 0
            ? floor(BN(val).times(userStaking.handled).toString(), priceDecimal)
            : 0
          this.stakeSliderSelected = val
        }
      }
    },
    // FIXME: auto create
    rewardsUnit: ['SFG'],
    rewards: {
      sfg: {
        code: 'sfg',
        name: 'SFG',
        weighting: valueModel.create(),

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
      }
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    dailyAPY: valueModel.create(),
    apy: valueModel.create(),
    // TEMP: 
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice) {
      const { contract, dailyAPY, apy, rewards } = this

      dailyAPY.handled = BN(await price / 1e18).times(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).dividedBy(BN(await totalStaking / 1e18).times(await lpTokenPrice)).toString()
      apy.handled = +dailyAPY.handled * 365
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },
    async getUserPendingReward_SFG (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getUserPaidReward_SFG (target, accountAddress) {
      const { contract } = this

      // return target.ether = await contract.methods.integrate_fraction(accountAddress).call()
      return target.ether = await gaugeStore.state.minter.methods.minted(accountAddress, this.address).call()
    },
    async getUserTotalReward_SFG (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async onStake (accountAddress, infApproval) {
      const { tokens } = store
      const { name, address, contract, mortgages } = this

      const deposit = BN(mortgages.bpt.userStake.revised).times(1e18)

      // await common.approveAmount(tokens.bpt.contract, deposit, accountAddress, address, infApproval)

      var { dismiss } = notifyNotification(`Please confirm depositing into ${name} gauge`)

      await contract.methods.deposit(deposit.toFixed(0,1)).send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: this.currentPool.deposit.gas,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onRedemption (accountAddress, infApproval) {
      const { name, address, contract, mortgages } = this

      let withdraw = BN(mortgages.bpt.userRedemption.revised).times(1e18)
      let balance = BN(await contract.methods.balanceOf(accountAddress).call())

      console.log('withdraw', withdraw, 'balance', balance)

      if(withdraw.gt(balance))
        withdraw = balance

      // let gas = this.currentPool.deposit.gas
      let withdrawMethod = contract.methods.withdraw(withdraw.toFixed(0,1))

      // try {
      //   // update
      //   gas = await withdrawMethod.estimateGas()
      // }
      // catch(err) { }

      var { dismiss } = notifyNotification(`Please confirm withdrawing from ${name} gauge`)

      await withdrawMethod.send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: gas * 1.5 | 0,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onHarvest (accountAddress) {
      const { name, address, contract, mortgages, rewards } = this
      // let minter = new web3.eth.Contract(daoabis.minter_abi, process.env.VUE_APP_PS_MINTER)

      const mint = await gaugeStore.state.minter.methods.mint(address)
      // let gas = await mint.estimateGas()

      var { dismiss } = notifyNotification(`Please confirm claiming ${rewards.sfg.name} from ${name} gauge`)

      await mint.send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: gas * 1.5 | 0,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    }
  },
  dfi: {
    code: 'dfi',
    name: 'DFI',
    propagateMark: 'dfi',
    mortgagesUnit: 'iUSD LP token',
    address: process.env.VUE_APP_DFI_GAUGE,
    // abi: abiDfi, // FIXME: ???
    abi: abiSUSDv2,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    mortgages: {
      iUSD_LPT: {
        code: 'iUSD_LPT',
        name: 'iUSD LP token',
        priceDecimal: 5,

        totalStaking: valueModel.create(),
        userStaking: valueModel.create(),
        userBalanceOf: valueModel.create(),

        userStake: valueModel.create(),
        stakeSliderSelected: 0,
        // FIXME: common
        stakeSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        get stakeAmountInput () {
          const { userStake } = this

          return userStake.revised || ''
        },
        set stakeAmountInput (val) {
          const { userStake } = this

          userStake.revised = val
          this.stakeSliderSelected = 0
        },

        get stakeSliderSelectedRadio () {
          return this.stakeSliderSelected
        },
        set stakeSliderSelectedRadio (val) {
          const { userStake, priceDecimal, userBalanceOf } = this

          if (val === 0) return false

          // FIXME: format
          userStake.revised = +userBalanceOf.handled > 0
            ? floor(BN(val).times(userBalanceOf.handled).toString(), priceDecimal)
            : 0
          this.stakeSliderSelected = val
        },

        userRedemption: valueModel.create(),
        redemptionSliderSelected: 0,
        // FIXME: common
        redemptionSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        get redemptionAmountInput () {
          const { userRedemption } = this

          return userRedemption.revised || ''
        },
        set redemptionAmountInput (val) {
          const { userRedemption } = this

          userRedemption.revised = val
          this.redemptionSliderSelected = 0
        },

        get redemptionSliderSelectedRadio () {
          return this.redemptionSliderSelected
        },
        set redemptionSliderSelectedRadio (val) {
          const { userRedemption, priceDecimal, userStaking } = this

          if (val === 0) return false

          // FIXME: format
          userRedemption.revised = +userStaking.handled > 0
            ? floor(BN(val).times(userStaking.handled).toString(), priceDecimal)
            : 0
          this.stakeSliderSelected = val
        }
      }
    },

    // FIXME: auto create
    rewardsUnit: ['SFG'],
    rewards: {
      sfg: {
        code: 'sfg',
        name: 'SFG',
        weighting: valueModel.create(),

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
      }
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    dailyAPY: valueModel.create(),
    apy: valueModel.create(),
    // TEMP: 
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice) {
      const { contract, dailyAPY, apy, rewards } = this

      const req = await fetch('https://api.dfi.money/apy.json')
      let daiDailyAPY = BN((await req.json()).dai.replace('%','')).dividedBy(100 * 365)
      dailyAPY.handled = BN(await price / 1e18).times(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).dividedBy(BN(await totalStaking).times(await lpTokenPrice / 1e18)).plus(daiDailyAPY).toString()
      apy.handled = +dailyAPY.handled * 365
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },
    async getUserPendingReward_SFG (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getUserPaidReward_SFG (target, accountAddress) {
      const { contract } = this

      // return target.ether = await contract.methods.integrate_fraction(accountAddress).call()
      return target.ether = await gaugeStore.state.minter.methods.minted(accountAddress, this.address).call()
    },
    async getUserTotalReward_SFG (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async onStake (accountAddress, infApproval) {
      const { tokens } = store
      const { name, address, contract, mortgages } = this
      // TODO: target
      const deposit = BN(mortgages.iUSD_LPT.userStake.revised).times(1e18)

      // await common.approveAmount(tokens.bpt.contract, deposit, accountAddress, address, infApproval)

      var { dismiss } = notifyNotification(`Please confirm depositing into ${name} gauge`)

      await contract.methods.deposit(deposit.toFixed(0,1)).send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: this.currentPool.deposit.gas,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onRedemption (accountAddress, infApproval) {
      const { name, address, contract, mortgages } = this
      // TODO: target
      let withdraw = BN(mortgages.iUSD_LPT.userRedemption.revised).times(1e18)
      let balance = BN(await contract.methods.balanceOf(accountAddress).call())

      console.log('withdraw', withdraw, 'balance', balance)

      if(withdraw.gt(balance))
        withdraw = balance

      // let gas = this.currentPool.deposit.gas
      let withdrawMethod = contract.methods.withdraw(withdraw.toFixed(0,1))

      // try {
      //   // update
      //   gas = await withdrawMethod.estimateGas()
      // }
      // catch(err) { }

      var { dismiss } = notifyNotification(`Please confirm withdrawing from ${name} gauge`)

      await withdrawMethod.send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: gas * 1.5 | 0,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onHarvest (accountAddress) {
      const { name, address, contract, mortgages, rewards } = this
      // let minter = new web3.eth.Contract(daoabis.minter_abi, process.env.VUE_APP_PS_MINTER)

      const mint = await gaugeStore.state.minter.methods.mint(address)
      // let gas = await mint.estimateGas()

      var { dismiss } = notifyNotification(`Please confirm claiming ${rewards.sfg.name} from ${name} gauge`)

      await mint.send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: gas * 1.5 | 0,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    }
  },

  okuu: {
    code: 'okuu',
    name: 'OKU',
    propagateMark: 'oku',
    mortgagesUnit: 'OKUU LP token',
    address: process.env.VUE_APP_OKUU_GAUGE,
    // abi: abiDfi, // FIXME: ???
    abi: abiSUSDv2,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    mortgages: {
      okuu: {
        code: 'okuu',
        name: 'OKUU LP token',
        priceDecimal: 5,

        totalStaking: valueModel.create(),
        userStaking: valueModel.create(),
        userBalanceOf: valueModel.create(),

        userStake: valueModel.create(),
        stakeSliderSelected: 0,
        // FIXME: common
        stakeSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        get stakeAmountInput () {
          const { userStake } = this

          return userStake.revised || ''
        },
        set stakeAmountInput (val) {
          const { userStake } = this

          userStake.revised = val
          this.stakeSliderSelected = 0
        },

        get stakeSliderSelectedRadio () {
          return this.stakeSliderSelected
        },
        set stakeSliderSelectedRadio (val) {
          const { userStake, priceDecimal, userBalanceOf } = this

          if (val === 0) return false

          // FIXME: format
          userStake.revised = +userBalanceOf.handled > 0
            ? floor(BN(val).times(userBalanceOf.handled).toString(), priceDecimal)
            : 0
          this.stakeSliderSelected = val
        },

        userRedemption: valueModel.create(),
        redemptionSliderSelected: 0,
        // FIXME: common
        redemptionSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        get redemptionAmountInput () {
          const { userRedemption } = this

          return userRedemption.revised || ''
        },
        set redemptionAmountInput (val) {
          const { userRedemption } = this

          userRedemption.revised = val
          this.redemptionSliderSelected = 0
        },

        get redemptionSliderSelectedRadio () {
          return this.redemptionSliderSelected
        },
        set redemptionSliderSelectedRadio (val) {
          const { userRedemption, priceDecimal, userStaking } = this

          if (val === 0) return false

          // FIXME: format
          userRedemption.revised = +userStaking.handled > 0
            ? floor(BN(val).times(userStaking.handled).toString(), priceDecimal)
            : 0
          this.stakeSliderSelected = val
        }
      }
    },

    // FIXME: auto create
    rewardsUnit: ['SFG'],
    rewards: {
      sfg: {
        code: 'sfg',
        name: 'SFG',
        weighting: valueModel.create(),

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
      }
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    dailyAPY: valueModel.create(),
    apy: valueModel.create(),
    // TEMP: 
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice) {
      const { contract, dailyAPY, apy, rewards } = this

      dailyAPY.handled = BN(await price / 1e18).times(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).dividedBy(BN(await totalStaking).times(await lpTokenPrice / 1e18)).toString()
      apy.handled = +dailyAPY.handled * 365
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },
    async getUserPendingReward_SFG (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getUserPaidReward_SFG (target, accountAddress) {
      const { contract } = this

      // return target.ether = await contract.methods.integrate_fraction(accountAddress).call()
      return target.ether = await gaugeStore.state.minter.methods.minted(accountAddress, this.address).call()
    },
    async getUserTotalReward_SFG (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async onStake (accountAddress, infApproval) {
      const { tokens } = store
      const { name, address, contract, mortgages } = this
      // TODO: target
      const deposit = BN(mortgages.okuu.userStake.revised).times(1e18)

      // await common.approveAmount(tokens.bpt.contract, deposit, accountAddress, address, infApproval)

      var { dismiss } = notifyNotification(`Please confirm depositing into ${name} gauge`)

      await contract.methods.deposit(deposit.toFixed(0,1)).send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: this.currentPool.deposit.gas,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onRedemption (accountAddress, infApproval) {
      const { name, address, contract, mortgages } = this
      // TODO: target
      let withdraw = BN(mortgages.okuu.userRedemption.revised).times(1e18)
      let balance = BN(await contract.methods.balanceOf(accountAddress).call())

      console.log('withdraw', withdraw, 'balance', balance)

      if(withdraw.gt(balance))
        withdraw = balance

      // let gas = this.currentPool.deposit.gas
      let withdrawMethod = contract.methods.withdraw(withdraw.toFixed(0,1))

      // try {
      //   // update
      //   gas = await withdrawMethod.estimateGas()
      // }
      // catch(err) { }

      var { dismiss } = notifyNotification(`Please confirm withdrawing from ${name} gauge`)

      await withdrawMethod.send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: gas * 1.5 | 0,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onHarvest (accountAddress) {
      const { name, address, contract, mortgages, rewards } = this
      // let minter = new web3.eth.Contract(daoabis.minter_abi, process.env.VUE_APP_PS_MINTER)

      const mint = await gaugeStore.state.minter.methods.mint(address)
      // let gas = await mint.estimateGas()

      var { dismiss } = notifyNotification(`Please confirm claiming ${rewards.sfg.name} from ${name} gauge`)

      await mint.send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: gas * 1.5 | 0,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    }
  },

  usd5: {
    code: 'usd5',
    name: 'usd5',
    propagateMark: '5pool',
    mortgagesUnit: 'usd5 LP token',
    address: process.env.VUE_APP_USD5_GAUGE,
    // abi: abiDfi, // FIXME: ???
    abi: abiSUSDv2,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    mortgages: {
      usd5: {
        code: 'usd5',
        name: 'usd5 LP token',
        priceDecimal: 5,

        totalStaking: valueModel.create(),
        userStaking: valueModel.create(),
        userBalanceOf: valueModel.create(),

        userStake: valueModel.create(),
        stakeSliderSelected: 0,
        // FIXME: common
        stakeSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        get stakeAmountInput () {
          const { userStake } = this

          return userStake.revised || ''
        },
        set stakeAmountInput (val) {
          const { userStake } = this

          userStake.revised = val
          this.stakeSliderSelected = 0
        },

        get stakeSliderSelectedRadio () {
          return this.stakeSliderSelected
        },
        set stakeSliderSelectedRadio (val) {
          const { userStake, priceDecimal, userBalanceOf } = this

          if (val === 0) return false

          // FIXME: format
          userStake.revised = +userBalanceOf.handled > 0
            ? floor(BN(val).times(userBalanceOf.handled).toString(), priceDecimal)
            : 0
          this.stakeSliderSelected = val
        },

        userRedemption: valueModel.create(),
        redemptionSliderSelected: 0,
        // FIXME: common
        redemptionSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        get redemptionAmountInput () {
          const { userRedemption } = this

          return userRedemption.revised || ''
        },
        set redemptionAmountInput (val) {
          const { userRedemption } = this

          userRedemption.revised = val
          this.redemptionSliderSelected = 0
        },

        get redemptionSliderSelectedRadio () {
          return this.redemptionSliderSelected
        },
        set redemptionSliderSelectedRadio (val) {
          const { userRedemption, priceDecimal, userStaking } = this

          if (val === 0) return false

          // FIXME: format
          userRedemption.revised = +userStaking.handled > 0
            ? floor(BN(val).times(userStaking.handled).toString(), priceDecimal)
            : 0
          this.stakeSliderSelected = val
        }
      }
    },

    // FIXME: auto create
    rewardsUnit: ['SFG'],
    rewards: {
      sfg: {
        code: 'sfg',
        name: 'SFG',
        weighting: valueModel.create(),

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
      }
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    dailyAPY: valueModel.create(),
    apy: valueModel.create(),
    // TEMP: 
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice) {
      const { contract, dailyAPY, apy, rewards } = this

      dailyAPY.handled = BN(await price / 1e18).times(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).dividedBy(BN(await totalStaking).times(await lpTokenPrice / 1e18)).toString()
      apy.handled = +dailyAPY.handled * 365
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },
    async getUserPendingReward_SFG (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getUserPaidReward_SFG (target, accountAddress) {
      const { contract } = this

      // return target.ether = await contract.methods.integrate_fraction(accountAddress).call()
      return target.ether = await gaugeStore.state.minter.methods.minted(accountAddress, this.address).call()
    },
    async getUserTotalReward_SFG (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async onStake (accountAddress, infApproval) {
      const { tokens } = store
      const { name, address, contract, mortgages } = this
      // TODO: target
      const deposit = BN(mortgages.usd5.userStake.revised).times(1e18)

      // await common.approveAmount(tokens.bpt.contract, deposit, accountAddress, address, infApproval)

      var { dismiss } = notifyNotification(`Please confirm depositing into ${name} gauge`)

      await contract.methods.deposit(deposit.toFixed(0,1)).send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: this.currentPool.deposit.gas,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onRedemption (accountAddress, infApproval) {
      const { name, address, contract, mortgages } = this
      // TODO: target
      let withdraw = BN(mortgages.usd5.userRedemption.revised).times(1e18)
      let balance = BN(await contract.methods.balanceOf(accountAddress).call())

      console.log('withdraw', withdraw, 'balance', balance)

      if(withdraw.gt(balance))
        withdraw = balance

      // let gas = this.currentPool.deposit.gas
      let withdrawMethod = contract.methods.withdraw(withdraw.toFixed(0,1))

      // try {
      //   // update
      //   gas = await withdrawMethod.estimateGas()
      // }
      // catch(err) { }

      var { dismiss } = notifyNotification(`Please confirm withdrawing from ${name} gauge`)

      await withdrawMethod.send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: gas * 1.5 | 0,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },

    async onHarvest (accountAddress) {
      const { name, address, contract, mortgages, rewards } = this
      // let minter = new web3.eth.Contract(daoabis.minter_abi, process.env.VUE_APP_PS_MINTER)

      const mint = await gaugeStore.state.minter.methods.mint(address)
      // let gas = await mint.estimateGas()

      var { dismiss } = notifyNotification(`Please confirm claiming ${rewards.sfg.name} from ${name} gauge`)

      await mint.send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: gas * 1.5 | 0,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    }
  },

  susdv2: {
    code: 'susdv2',
    name: 'sUSD',

    address: process.env.VUE_APP_PSS_GAUGE,
    abi: abiSUSDv2,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    get mortgageMember () {
      const { mortgages } = this

      return Object.keys(mortgages)
    },
    mortgages: {

    },

    rewards: {
      sfg: {
        code: 'sfg',
        name: 'SFG',
        weighting: valueModel.create(),

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
      },
      crv: {},
      snx: {}
    },

    dailyAPY: valueModel.create(),
    apy: valueModel.create(),
    // TEMP: 
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice) {
      const { contract, dailyAPY, apy, rewards } = this

      dailyAPY.handled = BN(await price / 1e18).times(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).dividedBy(BN(await totalStaking / 1e18).times(await lpTokenPrice)).toString()
      // TMEP: + 0.11
      apy.handled = +dailyAPY.handled * 365 + 0.11
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.balanceOf(accountAddress).call()
    },

    async getTotalSupply (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    async getSfgPendingReward (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getSfgPaidReward (target, accountAddress) {
      const { contract } = this

      // return target.ether = await contract.methods.integrate_fraction(accountAddress).call()
      // FIXME:
      // const minter = new web3.eth.Contract(daoabis.minter_abi, process.env.VUE_APP_PS_MINTER)
      return target.ether = await gaugeStore.state.minter.methods.minted(accountAddress, this.address).call()
    },
    async getSfgTotalReward (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async getCrvPendingReward (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimable_reward(accountAddress).call()
    },
    async getCrvPaidReward (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimed_rewards_for(accountAddress).call()
    },
    async getCrvTotalReward (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async getSnxPendingReward (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimable_reward2(accountAddress).call()
    },
    async getSnxPaidReward (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimed_rewards_for2(accountAddress).call()
    },
    async getSnxTotalReward (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    }
  }
}

store.announcement = {
  /** @type {Object} */
  statement: null,
  notices: [],
}

store.swap = {
  uniswapV2Router2,
  multicall
}

store.request = request



// {
//   pool
//     deposit? -> exchange
//     mining?
//   token
//   lptoken
// }
store.wallet = {
  get address () {
    return currentContract.default_account
  }
}

store.lptoken = {
  BPT: ModelLpToken.create({
    code: 'BPT',
    address: process.env.VUE_APP_BPT_TOKEN,
    abi: abiBpt,
  }),
  dUSD: {
    name: 'dUSD LP token',
    address: process.env.VUE_APP_DUSD_TOKEN,
    swapAddress: process.env.VUE_APP_DUSD_SWAP,
    abi: TOKEN_DUSD_ABI,
    // abi: abiSFG,
    swapAbi: swapAbi_iUSD_LPT,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    __contractSwap: null,
    get contractSwap () {
      const { __contractSwap, swapAbi, swapAddress } = this

      return __contractSwap ||
        (this.__contractSwap = new web3.eth.Contract(swapAbi, swapAddress))
    },

    userBalanceOf: valueModel.create(),
    async getBalanceOf (target, accountAddress) {
      const { contract, userBalanceOf } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      userBalanceOf.ether = target.ether = result

      return result
    },

    error: errorModel.create(),

    price: valueModel.create(),
    async getPrice () {
      const { contractSwap, price } = this
      const result = await contractSwap.methods.get_virtual_price().call()

      price.ether = result

      return price.handled
    }
  }
}

export default Vue.observable(store)
