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

// import TOKEN_USDT_ABI from './token/abi/USDT'
// import TOKEN_DF_ABI from './token/abi/DF'
// import TOKEN_DUSD_ABI from './token/abi/dUSD'


import { GAUGE_DUSD_ABI } from './gauge'

import ModelToken from '../model/token'
import request from './request'

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
    name: 'dForce',
    address: process.env.VUE_APP_DF_TOKEN,
    // abi: TOKEN_DF_ABI,
    abi: abiSFG,
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

      userBalanceOf.tether = target.tether = result

      return result
    },

    error: errorModel.create(),

    price: valueModel.create(),
    async getPrice () {
      const { contractSwap, price } = this
      const result = await contractSwap.methods.get_virtual_price().call()

      price.tether = result

      return price.handled
    },

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    // tether
    minAllowance: 1,
    // tether
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
          // TODO: ?
          // if (allowance.gt(0) && requiresResetAllowance.includes(contract._address))
          //   await approve(contract, 0, account, toContract)
          await approve(contract, maxAllowance, accountAddress, toContract)
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          // TODO: ?
          // if (allowance.gt(0) && requiresResetAllowance.includes(contract._address))
          //   await approve(contract, 0, account, toContract)
          await approve(contract, _amount, accountAddress, toContract)
        }
      }
    },
  },

  dusd: {
    name: 'dUSD LP toke',
    address: process.env.VUE_APP_DUSD_TOKEN,
    swapAddress: process.env.VUE_APP_DUSD_SWAP,
    // abi: TOKEN_DUSD_ABI,
    abi: abiSFG,
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

      userBalanceOf.tether = target.tether = result

      return result
    },

    error: errorModel.create(),

    price: valueModel.create(),
    async getPrice () {
      const { contractSwap, price } = this
      const result = await contractSwap.methods.get_virtual_price().call()

      price.tether = result

      return price.handled
    },

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    // tether
    minAllowance: 1,
    // tether
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
          // TODO: ?
          // if (allowance.gt(0) && requiresResetAllowance.includes(contract._address))
          //   await approve(contract, 0, account, toContract)
          await approve(contract, maxAllowance, accountAddress, toContract)
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          // TODO: ?
          // if (allowance.gt(0) && requiresResetAllowance.includes(contract._address))
          //   await approve(contract, 0, account, toContract)
          await approve(contract, _amount, accountAddress, toContract)
        }
      }
    },
  },

  usdt: {
    code: 'usdt',
    name: 'Tether USD',
    symbol: 'USDT',
    deprecated: false,
    totalSupply: 0, // XXX:
    address: process.env.VUE_APP_USDT_TOKEN,

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

    //   price.tether = result

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

      // XXX: tether?
      price.tether = result

      return result
    },

    dailyYield: valueModel.create(),
    async getDailyYield () {
      const { contract, dailyYield, miningRate } = this

      // TEMP: 
      return dailyYield.tether = await contract.methods.balanceOf(process.env.VUE_APP_PS_MINTER).call() * miningRate
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

      price.tether = result

      return price.handled
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()
console.log('getBalanceOf', result)
      target.tether = result

      return result
    },

    error: errorModel.create(),

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    // tether
    minAllowance: 1,
    // tether
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
          // TODO: ?
          // if (allowance.gt(0) && requiresResetAllowance.includes(contract._address))
          //   await approve(contract, 0, account, toContract)
          await approve(contract, maxAllowance, accountAddress, toContract)
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          // TODO: ?
          // if (allowance.gt(0) && requiresResetAllowance.includes(contract._address))
          //   await approve(contract, 0, account, toContract)
          await approve(contract, _amount, accountAddress, toContract)
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

      userBalanceOf.tether = target.tether = result

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
          // TODO: ?
          // if (allowance.gt(0) && requiresResetAllowance.includes(contract._address))
          //   await approve(contract, 0, account, toContract)
          await approve(contract, maxAllowance, accountAddress, toContract)
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          // TODO: ?
          // if (allowance.gt(0) && requiresResetAllowance.includes(contract._address))
          //   await approve(contract, 0, account, toContract)
          await approve(contract, _amount, accountAddress, toContract)
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
    name: 'iUSD LP tokens',
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

      userBalanceOf.tether = target.tether = result

      return result
    },

    error: errorModel.create(),

    price: valueModel.create(),
    async getPrice () {
      const { contractSwap, price } = this
      const result = await contractSwap.methods.get_virtual_price().call()

      price.tether = result

      return price.handled
    },

    // amount: 0,
    // approveAmount: 0,
    // TODO: common & format type
    // tether
    minAllowance: 1,
    // tether
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
          // TODO: ?
          // if (allowance.gt(0) && requiresResetAllowance.includes(contract._address))
          //   await approve(contract, 0, account, toContract)
          await approve(contract, maxAllowance, accountAddress, toContract)
        }
      } else {
        // allowance < amount && amount > 0
        if (allowance.lt(_amount)) {
          // TODO: ?
          // if (allowance.gt(0) && requiresResetAllowance.includes(contract._address))
          //   await approve(contract, 0, account, toContract)
          await approve(contract, _amount, accountAddress, toContract)
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
        name: 'dUSD',
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

      return target.tether = await contract.methods.totalSupply().call()
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

      target.tether = result
      return result
    },
    async getUserPendingReward_SFG (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getUserPaidReward_SFG (target, accountAddress) {
      const { contract } = this

      // return target.tether = await contract.methods.integrate_fraction(accountAddress).call()
      return target.tether = await gaugeStore.state.minter.methods.minted(accountAddress, this.address).call()
    },
    async getUserTotalReward_SFG (target, pendingReward, paidReward) {
      return target.tether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async getUserPendingReward_DF (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimable_reward(accountAddress).call()
    },
    async getUserPaidReward_DF (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimed_rewards_for(accountAddress).call()
    },
    async getUserTotalReward_DF (target, pendingReward, paidReward) {
      return target.tether = BN(await pendingReward).plus(await paidReward).toString()
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

      return target.tether = await contract.methods.totalSupply().call()
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

      target.tether = result
      return result
    },
    async getUserPendingReward_SFG (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getUserPaidReward_SFG (target, accountAddress) {
      const { contract } = this

      // return target.tether = await contract.methods.integrate_fraction(accountAddress).call()
      return target.tether = await gaugeStore.state.minter.methods.minted(accountAddress, this.address).call()
    },
    async getUserTotalReward_SFG (target, pendingReward, paidReward) {
      return target.tether = BN(await pendingReward).plus(await paidReward).toString()
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
    mortgagesUnit: 'iUSD LP tokens',
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
        name: 'iUSD LP tokens',
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

      return target.tether = await contract.methods.totalSupply().call()
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

      target.tether = result
      return result
    },
    async getUserPendingReward_SFG (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getUserPaidReward_SFG (target, accountAddress) {
      const { contract } = this

      // return target.tether = await contract.methods.integrate_fraction(accountAddress).call()
      return target.tether = await gaugeStore.state.minter.methods.minted(accountAddress, this.address).call()
    },
    async getUserTotalReward_SFG (target, pendingReward, paidReward) {
      return target.tether = BN(await pendingReward).plus(await paidReward).toString()
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

      return target.tether = await contract.methods.balanceOf(accountAddress).call()
    },

    async getTotalSupply (target) {
      const { contract } = this

      return target.tether = await contract.methods.totalSupply().call()
    },

    async getSfgPendingReward (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getSfgPaidReward (target, accountAddress) {
      const { contract } = this

      // return target.tether = await contract.methods.integrate_fraction(accountAddress).call()
      // FIXME:
      // const minter = new web3.eth.Contract(daoabis.minter_abi, process.env.VUE_APP_PS_MINTER)
      return target.tether = await gaugeStore.state.minter.methods.minted(accountAddress, this.address).call()
    },
    async getSfgTotalReward (target, pendingReward, paidReward) {
      return target.tether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async getCrvPendingReward (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimable_reward(accountAddress).call()
    },
    async getCrvPaidReward (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimed_rewards_for(accountAddress).call()
    },
    async getCrvTotalReward (target, pendingReward, paidReward) {
      return target.tether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async getSnxPendingReward (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimable_reward2(accountAddress).call()
    },
    async getSnxPaidReward (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimed_rewards_for2(accountAddress).call()
    },
    async getSnxTotalReward (target, pendingReward, paidReward) {
      return target.tether = BN(await pendingReward).plus(await paidReward).toString()
    }
  }
}

store.announcement = {
  /** @type {Object} */
  statement: null,
  notices: [],
}

store.request = request

export default Vue.observable(store)
