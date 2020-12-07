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
import ABI from '../constant/abi'

// TEMP:
import { contract as currentContract} from '../contract'

// Swap
import uniswapV2Router2 from './swap/uniswap_v2_router2'
import multicall from './swap/multicall'

import tokensV2 from '../store_v2/tokens'

import { GAUGE_DUSD_ABI } from './gauge'

import ModelLpToken from '../model/lptoken'

import request from './request'
import wallet from './wallet'

import {
  ModelValueEther,
  ModelValueDate,
  // ModelWalletEther,
  ModelCurrencyRates,
  ModelPool
} from '../model/index1'


const requiresResetAllowance = [
  process.env.VUE_APP_USDT_TOKEN, // USDT
  '0xC25a3A3b969415c80451098fa907EC722572917F', // Curve.fi DAI/USDC/USDT/sUSD
  '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3', // Curve.fi renBTC/wBTC/sBTC
  '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8', // Curve.fi yDAI/yUSDC/yUSDT/yTUSD
  process.env.VUE_APP_DFI_TOKEN, // s.finance iUSDT/iDAI/iUSDC
  process.env.VUE_APP_DUSD_TOKEN, // s.finance dDAI/dUSDC/dUSDT/dUSDx
  process.env.VUE_APP_USD5_TOKEN, // s.finance DAI/USDC/USDT/TUSD/PAX
  process.env.VUE_APP_QUSD5_TOKEN, // s.finance QUSD/DAI/USDC/USDT/TUSD/PAX
  process.env.VUE_APP_USDG5_TOKEN, // s.finance USDG/DAI/USDC/USDT/TUSD/PAX
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
    const result = await contract.methods.getSpotPrice(UnitAddress, targetAddress).call()
    return result
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
    /**
     *  @type {number}
     */
    get precision () {
      const { decimal } = this

      return Math.pow(10, decimal)
    },
    totalSupply: 0, // XXX:
    address: process.env.VUE_APP_USDT_TOKEN,
    decimal: 6,
  },

  df: {
    name: 'DF',
    address: process.env.VUE_APP_DF_TOKEN,
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

  qusd5: {
    name: 'QUSD5',
    address: process.env.VUE_APP_QUSD5_TOKEN,
    abi: tokensV2.QUSD5.abi,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    swapAddress: process.env.VUE_APP_QUSD5_SWAP,
    swapAbi: swapAbi_iUSD_LPT,
    __contractSwap: null,
    get contractSwap () {
      const { __contractSwap, swapAbi, swapAddress } = this

      return __contractSwap ||
        (this.__contractSwap = new web3.eth.Contract(swapAbi, swapAddress))
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

  usdg5: {
    name: 'USDG5',
    address: process.env.VUE_APP_USDG5_TOKEN,
    abi: tokensV2.QUSD5.abi,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    swapAddress: process.env.VUE_APP_USDG5_SWAP,
    swapAbi: swapAbi_iUSD_LPT,
    __contractSwap: null,
    get contractSwap () {
      const { __contractSwap, swapAbi, swapAddress } = this

      return __contractSwap ||
        (this.__contractSwap = new web3.eth.Contract(swapAbi, swapAddress))
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

  kun: {
    name: 'KUN',
    address: process.env.VUE_APP_KUN_TOKEN,
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


    // FIXME: change
    priceUnit: 'QUSD',
    priceUnitAddress: process.env.VUE_APP_QUSD_TOKEN,
    price: valueModel.create(),
    // TODO: priceUnit
    async getPrice (priceUnit) {
      const { address, priceUnitAddress, price } = this
      const priceContract = new web3.eth.Contract(BALANCER_POOL_ABI, process.env.VUE_APP_KUN_QUSD_BPT_TOKEN)
      const result = await priceContract.methods.getSpotPrice(priceUnitAddress, address).call()

      // XXX: ether?
      price.ether = result

      return result
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

  gt: {
    name: 'GT',
    address: process.env.VUE_APP_GT_TOKEN,
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

    // FIXME: change
    priceUnit: 'USDT',
    price: valueModel.create(),
    // TODO: priceUnit
    async getPrice (priceUnit) {
      const { price } = this
      const rates = await request.getTokenGt()

      const result = price.ether = BN(rates.USDT).times(1e18).toString()
  
      return result
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
    abi: tokensV2.dUSD.abi,
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
    async getPrice () {
      const { address, priceUnitAddress, price } = this
      const result = await store.price.getPrice(priceUnitAddress, process.env.VUE_APP_SFG_PRICE_TOKEN)
      // XXX: ether?
      price.ether = result

      return result
    },

    // 总锁仓量
    totalSupply: ModelValueEther.create(),
    async getTotalSupply () {
      const { contract, totalSupply } = this

      // TEMP: 
      return totalSupply.ether = await contract.methods.totalSupply().call()
    },

    // 已发行量
    supplied: ModelValueEther.create({ contDecimal: 2 }),
    async getSupplied (amount) {
      const { contract, supplied, totalSupply } = this
      let result = 0

      if (amount) {
        result = await amount
      } else {
        await this.getTotalSupply()
        result = BN(totalSupply.ether).minus(await contract.methods.balanceOf(process.env.VUE_APP_PS_MINTER).call()).toString()
      }

      // TEMP: 
      return supplied.ether = result
    },

    // 每日预计发行量
    dailyYield: ModelValueEther.create({ contDecimal: 2 }),
    async getDailyYield () {
      const { contract, dailyYield, miningRate } = this

      // TEMP: 
      return dailyYield.ether = await contract.methods.balanceOf(process.env.VUE_APP_PS_MINTER).call() * miningRate
    },

    totalStakeRate: valueModel.create(),
    // 流通量
    circulation: ModelValueEther.create({ contDecimal: 2 }),
    circulationRate: valueModel.create(),
    async getCirculation (lockEther) {
      const { contract, supplied, circulation, circulationRate, totalStakeRate } = this

      // FIXME: 流程
      await this.getSupplied()

      const _lockEther = await lockEther

      totalStakeRate.handled = BN(_lockEther).dividedBy(supplied.ether).toString()
      circulationRate.handled = BN(1).minus(totalStakeRate.handled).toString()

      return circulation.ether = BN(supplied.ether).minus(_lockEther).toString()
    },

    // 钱包余额
    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      return target.ether = result
    },

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

    error: errorModel.create(),
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

  dai: {
    address: process.env.VUE_APP_DAI_TOKEN,
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
        name1: 'dToken',
        priceDecimal: 4,

        totalStaking: valueModel.create(),
        userStaking: valueModel.create(),
        userBalanceOf: valueModel.create(),

        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),

        ratioStaking: valueModel.create(),
        needLockAmount: valueModel.create(),
        factorOf: valueModel.create(),
        needLockDay: ModelValueDate.create(),

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
        dailyYield: valueModel.create(),

        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
        totalMaxApy: valueModel.create(),
      },
      df: {
        code: 'df',
        name: 'DF',
        weighting: valueModel.create(),

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
        dailyYield: valueModel.create(),

        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
      }
    },

    async getNeedLockAmount(target, stakingPerLPT, balanceOf, lockSfgBalanceOf) {
      const { contract, mortgages } = this
// FIXME: 1E18
      const result = Math.max(
        BN(await stakingPerLPT / 1e18).times(await balanceOf / 1e18).minus(await lockSfgBalanceOf / 1e18),
        0
      )
      target.ether = result * 1e18

      return result
    },

    async getRatioStaking(target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.ratioStaking(accountAddress).call()
    },

    // FIXME: 秒而非 ether
    async getNeedLockDay (target, stakeTimeOf) {
      const result = Math.max(
        // FIXME: 
        ((+await stakeTimeOf + 80 * 86400) - Date.now() / 1000) / 86400,
        0
      )
      target.handled = result
      return result
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    dailyAPY: valueModel.create(),
    totalApy: valueModel.create(),
    myApy: valueModel.create(),
    maxApy: valueModel.create(),
    // TEMP: 
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice, dfPrice) {
      const { mortgages, contract, dailyAPY, totalApy, rewards } = this

      // 0.1*DAI APY + 0.4*USDC APY +0.4*USDT APY + 0.1*USDx APY
      const { dDAI, dUSDC, dUSDT, dUSDx } = await request.getDforceApy()

      const dDAI_apy = BN(dDAI.now_apy).dividedBy(100 * 365).times(0.1)
      const dUSDC_apy = BN(dUSDC.now_apy).dividedBy(100 * 365).times(0.4)
      const dUSDT_apy = BN(dUSDT.now_apy).dividedBy(100 * 365).times(0.4)
      const dUSDx_apy = BN(dUSDx.now_apy).dividedBy(100 * 365).times(0.1)

      // TEMP:
      const dfSwapABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"constant":true,"inputs":[],"name":"DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"df","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"earned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastTimeRewardApplicable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastUpdateTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lockedDetails","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lp","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"reward","type":"uint256"}],"name":"notifyRewardAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"periodFinish","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerTokenStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_rewardDistribution","type":"address"}],"name":"setRewardDistribution","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userRewardPerTokenPaid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
      const contractDfSwap = new web3.eth.Contract(dfSwapABI, process.env.VUE_APP_DF_SWAP)

      rewards.sfg.dailyYield.handled = BN(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).toString()
      rewards.df.dailyYield.handled = BN(await dfPrice).times(86400).times(await contractDfSwap.methods.rewardRate().call() / 1e18).toString()
      mortgages.dusd.dailyApy.handled = BN(dDAI_apy)
        .plus(dUSDC_apy)
        .plus(dUSDT_apy)
        .plus(dUSDx_apy).toString()

      rewards.sfg.dailyApy.handled = BN(await price / 1e18)
        .times(rewards.sfg.dailyYield.handled)
        .dividedBy(BN(await totalStaking / 1e18).times(await lpTokenPrice)).toString()
      rewards.df.dailyApy.handled = BN(rewards.df.dailyYield.handled)
        .dividedBy(BN(await totalStaking / 1e18 ).times(await lpTokenPrice)).toString()

      mortgages.dusd.totalApy.handled = +mortgages.dusd.dailyApy.handled * 365
      rewards.sfg.totalApy.handled = +rewards.sfg.dailyApy.handled * 365
      rewards.df.totalApy.handled = +rewards.df.dailyApy.handled * 365

      totalApy.handled = BN(mortgages.dusd.totalApy.handled)
        .plus(rewards.sfg.totalApy.handled)
        .plus(rewards.df.totalApy.handled)
        .toString()

      // FIXME: SFG min apy
      return rewards.sfg.totalApy.handled
    },

    async getMyApy (sfgMinApy, factorOf) {
      const { myApy, mortgages, rewards } = this

      const result = BN(await sfgMinApy).times(await factorOf / 1e18)
        .plus(rewards.df.totalApy.handled)
        .plus(mortgages.dusd.totalApy.handled)
        .toString()

      myApy.handled = result
      return result
    },

    async getMaxApy (sfgMinApy, multiple) {
      const { maxApy, mortgages, rewards } = this

      rewards.sfg.totalMaxApy.handled = BN(await sfgMinApy).times(await multiple / 1e18).toString()

      const result = BN(rewards.sfg.totalMaxApy.handled)
        .plus(rewards.df.totalApy.handled)
        .plus(mortgages.dusd.totalApy.handled)
        .toString()

      return maxApy.handled = result
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },

    virtualTotalSupply: valueModel.create(),
    async getVirtualTotalSupply () {
      const { contract, virtualTotalSupply } = this
      const result = await contract.methods.virtualTotalSupply().call()

      virtualTotalSupply.ether = result
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
    },

    /** 加速系数 */
    async getFactorOf (target, address) {
      const { contract } = this
      // TODO: ether?
      const result = await contract.methods.factorOf(address).call()
  
      target.ether = result
      return result
    },
  },

  bpt: {
    code: 'bpt',
    name: 'BPT',
    propagateMark: 'SFG',
    mortgagesUnit: 'BPT',
    address: process.env.VUE_APP_BPT_GAUGE,
    // abi: abiSUSDv2,
    abi: ABI.USD5.mining,
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

        ratioStaking: valueModel.create(),
        needLockAmount: valueModel.create(),
        factorOf: valueModel.create(),
        needLockDay: ModelValueDate.create(),

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
        dailyYield: valueModel.create(),

        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
      }
    },

    async getNeedLockAmount(target, stakingPerLPT, balanceOf, lockSfgBalanceOf) {
      const { contract, mortgages } = this
      // FIXME: 1E18
      const result = Math.max(
        BN(await stakingPerLPT / 1e18).times(await balanceOf / 1e18).minus(await lockSfgBalanceOf / 1e18).toString(),
        0
      )
      target.ether = result * 1e18

      return result
    },

    async getRatioStaking(target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.ratioStaking(accountAddress).call()
    },

    // FIXME: 秒而非 ether
    async getNeedLockDay (target, stakeTimeOf) {
      const result = Math.max(
        // FIXME: 
        ((+await stakeTimeOf + 80 * 86400) - Date.now() / 1000) / 86400,
        0
      )
      target.handled = result
      return result
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    dailyAPY: valueModel.create(),
    totalApy: valueModel.create(),
    myApy: valueModel.create(),
    maxApy: valueModel.create(),
    // TEMP:
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice) {
      const { contract, dailyAPY, totalApy, rewards } = this

      rewards.sfg.dailyYield.handled = BN(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).toString()
      rewards.sfg.dailyApy.handled = BN(await price / 1e18).times(rewards.sfg.dailyYield.handled).dividedBy(BN(await totalStaking / 1e18).times(await lpTokenPrice)).toString()
      dailyAPY.handled = rewards.sfg.dailyApy.handled

      rewards.sfg.totalApy.handled = +dailyAPY.handled * 365
      totalApy.handled = rewards.sfg.totalApy.handled

      return totalApy.handled
    },

    async getMyApy (apy, factorOf) {
      const { myApy } = this

      const result = BN(await apy).times(await factorOf / 1e18).toString()

      myApy.handled = result
      return result
    },

    async getMaxApy (minApy, multiple) {
      const { maxApy } = this

      const result = BN(await minApy).times(await multiple / 1e18).toString()

      return maxApy.handled = result
    },

    /** 加速系数 */
    async getFactorOf (target, address) {
      const { contract } = this
      // TODO: ether?
      const result = await contract.methods.factorOf(address).call()

      target.ether = result

      return result
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },

    virtualTotalSupply: valueModel.create(),
    async getVirtualTotalSupply () {
      const { contract, virtualTotalSupply } = this
      const result = await contract.methods.virtualTotalSupply().call()

      virtualTotalSupply.ether = result
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
    name: 'iUSD',
    propagateMark: 'dfi',
    mortgagesUnit: 'iUSD LP token',
    address: process.env.VUE_APP_DFI_GAUGE,
    // abi: abiDfi, // FIXME: ???
    abi: ABI.USD5.mining,
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
        name1: 'iToken',
        priceDecimal: 5,

        totalStaking: valueModel.create(),
        userStaking: valueModel.create(),
        userBalanceOf: valueModel.create(),

        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),

        ratioStaking: valueModel.create(),
        needLockAmount: valueModel.create(),
        factorOf: valueModel.create(),
        needLockDay: ModelValueDate.create(),

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
        dailyYield: valueModel.create(),

        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
        totalMaxApy: valueModel.create(),
      }
    },

    async getNeedLockAmount(target, stakingPerLPT, balanceOf, lockSfgBalanceOf) {
      const { contract, mortgages } = this
// FIXME: 1E18
      const result = Math.max(
        BN(await stakingPerLPT / 1e18).times(await balanceOf / 1e18).minus(await lockSfgBalanceOf / 1e18),
        0
      )
      target.ether = result * 1e18

      return result
    },

    async getRatioStaking(target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.ratioStaking(accountAddress).call()
    },

    // FIXME: 秒而非 ether
    async getNeedLockDay (target, stakeTimeOf) {
      const result = Math.max(
        // FIXME: 
        ((+await stakeTimeOf + 80 * 86400) - Date.now() / 1000) / 86400,
        0
      )
      target.handled = result
      return result
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    dailyAPY: valueModel.create(),
    totalApy: valueModel.create(),
    myApy: valueModel.create(),
    maxApy: valueModel.create(),
    // TEMP: 
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice) {
      const { mortgages, contract, dailyAPY, totalApy, rewards } = this

      const req = await fetch('https://api.dfi.money/apy.json')
      mortgages.iUSD_LPT.dailyApy.handled = BN((await req.json()).dai.replace('%','')).dividedBy(100 * 365).toString()
      // mortgages.iUSD_LPT.dailyApy.handled = 0

      rewards.sfg.dailyYield.handled = BN(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).toString()
      rewards.sfg.dailyApy.handled = BN(await price / 1e18).times(rewards.sfg.dailyYield.handled).dividedBy(BN(await totalStaking).times(await lpTokenPrice / 1e18)).toString()
      dailyAPY.handled = rewards.sfg.dailyApy.handled

      mortgages.iUSD_LPT.totalApy.handled = +mortgages.iUSD_LPT.dailyApy.handled * 365
      rewards.sfg.totalApy.handled = +rewards.sfg.dailyApy.handled * 365
      totalApy.handled = BN(rewards.sfg.totalApy.handled).plus(mortgages.iUSD_LPT.totalApy.handled).toString()

      // FIXME: SFG min apy
      return rewards.sfg.totalApy.handled
    },

    async getMyApy (sfgMinApy, factorOf) {
      const { myApy, mortgages } = this

      const result = BN(await sfgMinApy).times(await factorOf / 1e18).plus(mortgages.iUSD_LPT.totalApy.handled).toString()

      myApy.handled = result
      return result
    },

    async getMaxApy (sfgMinApy, multiple) {
      const { maxApy, mortgages, rewards } = this

      rewards.sfg.totalMaxApy.handled = BN(await sfgMinApy).times(await multiple / 1e18).toString()
// XXX:
      const result = BN(rewards.sfg.totalMaxApy.handled).plus(mortgages.iUSD_LPT.totalApy.handled).toString()

      return maxApy.handled = result
    },

    /** 加速系数 */
    async getFactorOf (target, address) {
      const { contract } = this
      // TODO: ether?
      const result = await contract.methods.factorOf(address).call()

      target.ether = result

      return result
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },

    virtualTotalSupply: valueModel.create(),
    async getVirtualTotalSupply () {
      const { contract, virtualTotalSupply } = this
      const result = await contract.methods.virtualTotalSupply().call()

      virtualTotalSupply.ether = result
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
    abi: ABI.USD5.mining,
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

        ratioStaking: valueModel.create(),
        needLockAmount: valueModel.create(),
        factorOf: valueModel.create(),
        needLockDay: ModelValueDate.create(),

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
        dailyYield: valueModel.create(),

        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
      }
    },

    async getNeedLockAmount(target, stakingPerLPT, balanceOf, lockSfgBalanceOf) {
      const { contract, mortgages } = this
// FIXME: 1E18
      const result = Math.max(
        BN(await stakingPerLPT / 1e18).times(await balanceOf / 1e18).minus(await lockSfgBalanceOf / 1e18),
        0
      )
      target.ether = result * 1e18

      return result
    },

    async getRatioStaking(target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.ratioStaking(accountAddress).call()
    },

    // FIXME: 秒而非 ether
    async getNeedLockDay (target, stakeTimeOf) {
      const result = Math.max(
        // FIXME: 
        ((+await stakeTimeOf + 80 * 86400) - Date.now() / 1000) / 86400,
        0
      )
      target.handled = result
      return result
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    dailyAPY: valueModel.create(),
    totalApy: valueModel.create(),
    myApy: valueModel.create(),
    maxApy: valueModel.create(),
    // TEMP:
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice) {
      const { contract, dailyAPY, totalApy, rewards } = this

      rewards.sfg.dailyYield.handled = BN(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).toString()

      rewards.sfg.dailyApy.handled = BN(await price / 1e18).times(rewards.sfg.dailyYield.handled).dividedBy(BN(await totalStaking).times(await lpTokenPrice / 1e18)).toString()
      rewards.sfg.totalApy.handled = +rewards.sfg.dailyApy.handled * 365

      dailyAPY.handled = rewards.sfg.dailyApy.handled

      totalApy.handled = +dailyAPY.handled * 365

      return totalApy.handled
    },

    async getMyApy (apy, factorOf) {
      const { myApy } = this

      const result = BN(await apy).times(await factorOf / 1e18).toString()

      myApy.handled = result
      return result
    },

    async getMaxApy (minApy, multiple) {
      const { maxApy } = this

      const result = BN(await minApy).times(await multiple / 1e18).toString()

      return maxApy.handled = result
    },

    /** 加速系数 */
    async getFactorOf (target, address) {
      const { contract } = this
      // TODO: ether?
      const result = await contract.methods.factorOf(address).call()

      target.ether = result

      return result
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },

    virtualTotalSupply: valueModel.create(),
    async getVirtualTotalSupply () {
      const { contract, virtualTotalSupply } = this
      const result = await contract.methods.virtualTotalSupply().call()

      virtualTotalSupply.ether = result
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

  qusd5: {
    code: 'qusd5',
    name: 'qusd5',
    propagateMark: 'qian',
    mortgagesUnit: 'qusd5 LP token',
    address: process.env.VUE_APP_QUSD5_GAUGE,
    // abi: abiDfi, // FIXME: ???
    abi: abiSUSDv2,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },
    mortgages: {
      qusd5: {
        code: 'qusd5',
        name: 'qusd5 LP token',
        priceDecimal: 5,
  
        totalStaking: valueModel.create(),
        userStaking: valueModel.create(),
        userBalanceOf: valueModel.create(),
  
        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),

        ratioStaking: valueModel.create(),
        needLockAmount: valueModel.create(),
        factorOf: valueModel.create(),
        needLockDay: ModelValueDate.create(),
        
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
    rewardsUnit: ['SFG', 'KUN'],
    rewards: {
      sfg: {
        code: 'sfg',
        name: 'SFG',
        weighting: valueModel.create(),
  
        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
        dailyYield: valueModel.create(),

        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
        totalMaxApy: valueModel.create(),
      },
      kun: {
        code: 'kun',
        name: 'KUN',
        weighting: valueModel.create(),

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
        dailyYield: valueModel.create(),

        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
      }
    },

    async getNeedLockAmount(target, stakingPerLPT, balanceOf, lockSfgBalanceOf) {
      const { contract, mortgages } = this
// FIXME: 1E18
      const result = Math.max(
        BN(await stakingPerLPT / 1e18).times(await balanceOf / 1e18).minus(await lockSfgBalanceOf / 1e18),
        0
      )
      target.ether = result * 1e18

      return result
    },

    async getRatioStaking(target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.ratioStaking(accountAddress).call()
    },

    // FIXME: 秒而非 ether
    async getNeedLockDay (target, stakeTimeOf) {
      const result = Math.max(
        // FIXME: 
        ((+await stakeTimeOf + 80 * 86400) - Date.now() / 1000) / 86400,
        0
      )
      target.handled = result
      return result
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    // dailyAPY: valueModel.create(),
    totalApy: valueModel.create(),
    myApy: valueModel.create(),
    maxApy: valueModel.create(),
    // TEMP:
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice, kunPrice) {
      const { contract, dailyAPY, totalApy, rewards } = this

      rewards.sfg.dailyYield.handled = BN(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).toString()
      rewards.kun.dailyYield.handled = 0

      const lpt = BN(await totalStaking).times(await lpTokenPrice / 1e18)
      rewards.sfg.dailyApy.handled = BN(await price / 1e18).times(rewards.sfg.dailyYield.handled).dividedBy(lpt).toString()
      rewards.sfg.totalApy.handled = +rewards.sfg.dailyApy.handled * 365
      rewards.kun.dailyApy.handled = BN(await kunPrice / 1e18).times(rewards.kun.dailyYield.handled).dividedBy(lpt)
      rewards.kun.totalApy.handled = +rewards.kun.dailyApy.handled * 365

      totalApy.handled = BN(rewards.sfg.totalApy.handled).plus(rewards.kun.totalApy.handled).toString()
      
      // FIXME: SFG min apy
      return rewards.sfg.totalApy.handled
    },

    async getMyApy (sfgMinApy, factorOf) {
      const { myApy, mortgages, rewards } = this

      const result = BN(await sfgMinApy).times(await factorOf / 1e18).plus(rewards.kun.totalApy.handled).toString()

      myApy.handled = result
      return result
    },

    async getMaxApy (sfgMinApy, multiple) {
      const { maxApy, mortgages, rewards } = this

      rewards.sfg.totalMaxApy.handled = BN(await sfgMinApy).times(await multiple / 1e18).toString()

      const result = BN(rewards.sfg.totalMaxApy.handled).plus(rewards.kun.totalApy.handled).toString()

      return maxApy.handled = result
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },
    virtualTotalSupply: valueModel.create(),
    async getVirtualTotalSupply () {
      const { contract, virtualTotalSupply } = this
      const result = await contract.methods.virtualTotalSupply().call()

      virtualTotalSupply.ether = result
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
  
    async getUserPendingReward_KUN (target, accountAddress) {
      const { contract } = this
  
      return target.ether = await contract.methods.claimable_reward(accountAddress).call()
    },
    async getUserPaidReward_KUN (target, accountAddress) {
      const { contract } = this
  
      return target.ether = await contract.methods.claimed_rewards_for(accountAddress).call()
    },
    async getUserTotalReward_KUN (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    },
  
    async onStake (accountAddress, infApproval) {
      const { tokens } = store
      const { name, address, contract, mortgages } = this
      // TODO: target
      const deposit = BN(mortgages.qusd5.userStake.revised).times(1e18)
  
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
      let withdraw = BN(mortgages.qusd5.userRedemption.revised).times(1e18)
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

      var { dismiss } = notifyNotification(`Please confirm claiming ${rewards.kun.name}`)

      await contract.methods.claim_rewards(accountAddress).send({
          from: accountAddress
        })
        .once('transactionHash', hash => {
          dismiss()
          notifyHandler(hash)
        })
    },

    /** 加速系数 */
    async getFactorOf (target, address) {
      const { contract } = this
      // TODO: ether?
      const result = await contract.methods.factorOf(address).call()

      target.ether = result
      return result
    },
  },

  usdg5: {
    code: 'usdg5',
    name: 'usdg5',
    propagateMark: 'gate',
    mortgagesUnit: 'usdg5 LP token',
    address: process.env.VUE_APP_USDG5_GAUGE,
    // abi: abiDfi, // FIXME: ???
    abi: abiSUSDv2,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },
    mortgages: {
      usdg5: {
        code: 'usdg5',
        name: 'usdg5 LP token',
        priceDecimal: 5,
  
        totalStaking: valueModel.create(),
        userStaking: valueModel.create(),
        userBalanceOf: valueModel.create(),
  
        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),

        ratioStaking: valueModel.create(),
        needLockAmount: valueModel.create(),
        factorOf: valueModel.create(),
        needLockDay: ModelValueDate.create(),

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
    rewardsUnit: ['SFG', 'GT'],
    rewards: {
      sfg: {
        code: 'sfg',
        name: 'SFG',
        weighting: valueModel.create(),
  
        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
        dailyYield: valueModel.create(),
  
        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
        totalMaxApy: valueModel.create(),
      },
      gt: {
        code: 'gt',
        name: 'GT',
        weighting: valueModel.create(),
  
        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
        dailyYield: valueModel.create(),
  
        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
      }
    },

    async getNeedLockAmount(target, stakingPerLPT, balanceOf, lockSfgBalanceOf) {
      const { contract, mortgages } = this
// FIXME: 1E18
      const result = Math.max(
        BN(await stakingPerLPT / 1e18).times(await balanceOf / 1e18).minus(await lockSfgBalanceOf / 1e18),
        0
      )
      target.ether = result * 1e18

      return result
    },

    async getRatioStaking(target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.ratioStaking(accountAddress).call()
    },

    // FIXME: 秒而非 ether
    async getNeedLockDay (target, stakeTimeOf) {
      const result = Math.max(
        // FIXME: 
        ((+await stakeTimeOf + 80 * 86400) - Date.now() / 1000) / 86400,
        0
      )
      target.handled = result
      return result
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.ether = await contract.methods.totalSupply().call()
    },

    // dailyAPY: valueModel.create(),
    totalApy: valueModel.create(),
    myApy: valueModel.create(),
    maxApy: valueModel.create(),
    // TEMP:
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice, gtPrice) {
      const { contract, dailyAPY, totalApy, rewards } = this

      rewards.sfg.dailyYield.handled = BN(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).toString()
      const abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousGovernor","type":"address"},{"indexed":true,"internalType":"address","name":"newGovernor","type":"address"}],"name":"GovernorshipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"begin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"earned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"exit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"address","name":"addr","type":"address"}],"name":"getConfig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getConfig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getConfig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getRewardForDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"governor","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_rewardsDistribution","type":"address"},{"internalType":"address","name":"_rewardsToken","type":"address"},{"internalType":"address","name":"_stakingToken","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"governor_","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_governor","type":"address"},{"internalType":"address","name":"_rewardsDistribution","type":"address"},{"internalType":"address","name":"_rewardsToken","type":"address"},{"internalType":"address","name":"_stakingToken","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastTimeRewardApplicable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastUpdateTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lep","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"reward","type":"uint256"}],"name":"notifyRewardAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lep","type":"uint256"},{"internalType":"uint256","name":"_period","type":"uint256"},{"internalType":"uint256","name":"_span","type":"uint256"},{"internalType":"uint256","name":"_begin","type":"uint256"}],"name":"notifyRewardBegin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"period","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"periodFinish","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceGovernorship","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardDelta","outputs":[{"internalType":"uint256","name":"amt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardPerTokenStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardsDistribution","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardsDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardsToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"setConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"setConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"setConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"stakeWithPermit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakingToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newGovernor","type":"address"}],"name":"transferGovernorship","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userRewardPerTokenPaid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
      const GT_STAKING_CONTRACT = new web3.eth.Contract(abi, process.env.VUE_APP_GT_STAKING_SWAP)

      rewards.gt.dailyYield.ether = BN(86400)
        .times(await GT_STAKING_CONTRACT.methods.getRewardForDuration().call())
        .dividedBy(
          BN(await GT_STAKING_CONTRACT.methods.periodFinish().call())
            .minus(~~(Date.now()/1000))
        )
        .toString()

      const lpt = BN(await totalStaking).times(await lpTokenPrice / 1e18)
      rewards.sfg.dailyApy.handled = BN(await price / 1e18).times(rewards.sfg.dailyYield.handled).dividedBy(lpt).toString()
      rewards.sfg.totalApy.handled = +rewards.sfg.dailyApy.handled * 365
      rewards.gt.dailyApy.handled = BN(await gtPrice / 1e18).times(rewards.gt.dailyYield.handled).dividedBy(lpt)
      rewards.gt.totalApy.handled = +rewards.gt.dailyApy.handled * 365

      totalApy.handled = BN(rewards.sfg.totalApy.handled).plus(rewards.gt.totalApy.handled).toString()
    
      // FIXME: SFG min apy
      return rewards.sfg.totalApy.handled
    },

    async getMyApy (sfgMinApy, factorOf) {
      const { myApy, mortgages, rewards } = this

      const result = BN(await sfgMinApy).times(await factorOf / 1e18).plus(rewards.gt.totalApy.handled).toString()

      myApy.handled = result
      return result
    },

    async getMaxApy (sfgMinApy, multiple) {
      const { maxApy, mortgages, rewards } = this

      rewards.sfg.totalMaxApy.handled = BN(await sfgMinApy).times(await multiple / 1e18).toString()

      const result = BN(rewards.sfg.totalMaxApy.handled).plus(rewards.gt.totalApy.handled).toString()

      return maxApy.handled = result
    },

    /** 加速系数 */
    async getFactorOf (target, address) {
      const { contract } = this
      // TODO: ether?
      const result = await contract.methods.factorOf(address).call()

      target.ether = result

      return result
    },

    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()
  
      target.ether = result
      return result
    },

    virtualTotalSupply: valueModel.create(),
    async getVirtualTotalSupply () {
      const { contract, virtualTotalSupply } = this
      const result = await contract.methods.virtualTotalSupply().call()

      virtualTotalSupply.ether = result
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
  
    async getUserPendingReward_GT (target, accountAddress) {
      const { contract } = this
  
      return target.ether = await contract.methods.claimable_reward(accountAddress).call()
    },
    async getUserPaidReward_GT (target, accountAddress) {
      const { contract } = this

      return target.ether = await contract.methods.claimed_rewards_for(accountAddress).call()
    },
    async getUserTotalReward_GT (target, pendingReward, paidReward) {
      return target.ether = BN(await pendingReward).plus(await paidReward).toString()
    },
  
    async onStake (accountAddress, infApproval) {
      const { tokens } = store
      const { name, address, contract, mortgages } = this
      // TODO: target
      const deposit = BN(mortgages.usdg5.userStake.revised).times(1e18)
  
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
      let withdraw = BN(mortgages.usdg5.userRedemption.revised).times(1e18)
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
  
      var { dismiss } = notifyNotification(`Please confirm claiming ${rewards.gt.name}`)
  
      await contract.methods.claim_rewards(accountAddress).send({
          from: accountAddress
        })
        .once('transactionHash', hash => {
          dismiss()
          notifyHandler(hash)
        })
    },
  
    /** 加速系数 */
    async getFactorOf (target, address) {
      const { contract } = this
      // TODO: ether?
      const result = await contract.methods.factorOf(address).call()
  
      target.ether = result
      return result
    },
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
      susdv2: {
        code: 'susdv2',
        name: 'susdv2 LP token',
        priceDecimal: 4,
        totalStaking: valueModel.create(),
      }
    },

    rewards: {
      sfg: {
        code: 'sfg',
        name: 'SFG',
        weighting: valueModel.create(),

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
        dailyYield: valueModel.create(),

        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
      },
      crv: {
        code: 'crv',
        name: 'CRV',
        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
      },
      snx: {
        code: 'snx',
        name: 'SNX',
        dailyApy: valueModel.create(),
        totalApy: valueModel.create(),
      }
    },

    dailyAPY: valueModel.create(),
    totalApy: valueModel.create(),
    // TEMP: 
    async getAPY (price, dailyYield, totalStaking, lpTokenPrice) {
      const { contract, dailyAPY, totalApy, rewards } = this

      rewards.sfg.dailyYield.handled = BN(await dailyYield / 1e18).times(rewards.sfg.weighting.handled).toString()
      rewards.sfg.dailyApy.handled = BN(await price / 1e18).times(rewards.sfg.dailyYield.handled).dividedBy(BN(await totalStaking / 1e18).times(await lpTokenPrice)).toString()

      dailyAPY.handled = rewards.sfg.dailyApy.handled

      rewards.sfg.totalApy.handled = +dailyAPY.handled * 365
      // TEMP: 
      rewards.crv.totalApy.handled = 0.11

      totalApy.handled = BN(rewards.sfg.totalApy.handled).plus(rewards.crv.totalApy.handled).toString()
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

// ====================== V2 ======================

// {
//   pool
//     deposit? -> exchange
//     mining?
//   token
//   lptoken
// }
store.wallet = wallet



const BPT_LPT = ModelLpToken.create({
  code: 'BPT',
  address: process.env.VUE_APP_BPT_TOKEN,
  abi: abiBpt,
  needResetAllowance: true
})

store.lock = {
  SFG: {
    code: 'SFG',
    name: 'SFG',
    address: process.env.VUE_APP_LOCK_SFG_SWAP,
    abi: ABI.SFG.lock,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    mortgages: {
      SFG: {
        code: 'SFG',
        name: 'SFG',
        priceDecimal: 4,
        gainUrl: 'https://legacy.balancer.exchange/#/swap/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0',

        // totalStaking: ModelValueEther.create(),
        userStaking: ModelValueEther.create(),
        userBalanceOf: ModelValueEther.create(),

        // 份额
        share: ModelValueEther.create(),
        // 加速倍数
        factorOf: ModelValueEther.create({ contDecimal: 4 }),
        // 已锁仓天数
        stakeTimeOf: ModelValueEther.create(),
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

    totalSupply: ModelValueEther.create({ contDecimal: 2 }),
    async getTotalSupply () {
      const { contract, totalSupply } = this

      // TEMP: 
      return totalSupply.ether = await contract.methods.totalSupply().call()
    },

    /** 质押数量 */
    async getBalanceOf (target, accountAddress) {
      const { contract } = this
      const result = await contract.methods.balanceOf(accountAddress).call()

      target.ether = result
      return result
    },

    /** 质押 */
    async onStake (accountAddress, infApproval) {
      const { name, address, contract, mortgages } = this

      const deposit = BN(mortgages.SFG.userStake.revised).times(1e18)

      var { dismiss } = notifyNotification(`Please confirm depositing into ${name} gauge`)

      await contract.methods.stake(deposit.toFixed(0,1)).send({
        from: accountAddress,
        // gasPrice: gasPriceStore.gasPriceWei,
        // gas: this.currentPool.deposit.gas,
      })
      .once('transactionHash', hash => {
        dismiss()
        notifyHandler(hash)
      })
    },
    /** 赎回 */
    async onRedemption (accountAddress, infApproval) {
      const { name, address, contract, mortgages } = this

      let withdraw = BN(mortgages.SFG.userRedemption.revised).times(1e18)
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
    /** 加速系数 */
    async getFactorOf (target, address) {
      const { contract } = this
      // TODO: ether?
      const result = await contract.methods.factorOf(address).call()

      target.ether = result

      return result
    },

    async getShare (target, balanceOf, factorOf) {
      const { contract } = this
      // TODO: ether?
      const result = BN(await balanceOf / 1e18).times(await factorOf / 1e18).toString()

      target.handled = result
      return result
    },

    async getStakeTimeOf (target, address) {
      const { contract } = this
      // TODO: ether?
      const result = await contract.methods.stakeTimeOf(address).call()

      target.ether = result

      return result
    },

    async getStakingPerLPT (address) {
      const { contract } = this

      const result = await contract.methods.stakingPerLPT(address).call()

      return result
    },

    multiple: ModelValueEther.create(),
    async getMultiple () {
      const { contract, multiple } = this
      // TODO: ether?
      const result = await contract.methods.factorOf('0x1d22aBf08A30a7881D8F6B24b52E7586272BA20b').call()

      multiple.ether = result

      return result
    },

    async getWeightOfGauge (target, address) {
      const { contract } = this

      const result = await contract.methods.weightOfGauge(address).call()

      target.ether = result

      return result
    },
    totalMinted: ModelValueEther.create(),
    async getTotalMinted () {
      const { contract, totalMinted } = this

      const result = await contract.methods.totalMinted().call()
      totalMinted.ether = result
      return result
    }
  }
}

store.pool = {
  SFG_DAI_BPT: {
    code: 'SFG_DAI_BPT',
    name: 'SFG',
    lptoken: BPT_LPT,
    mining: {
      apy: {
        base: {},
        max: {},
      }
    },
    dailyVol: ModelCurrencyRates.create()
  },
  /**
   *  USDG5
   *  - (USDG/USD5)
   *  - (USDG/DAI/USDC/USDT/TUSD/PAX)
   */
  USDG5: ModelPool.create({
    code: 'USDG5',
    token: {
      address: process.env.VUE_APP_USDG5_TOKEN,
      abi: tokensV2.QUSD5.abi,
    },
    swap: {
      address: process.env.VUE_APP_USDG5_SWAP,
      abi: swapAbi_iUSD_LPT,
    }
  }),
  QUSD5: ModelPool.create({
    code: 'QUSD5',
    // token: store.token.QUSD5,
    swap: {
      address: process.env.VUE_APP_QUSD5_SWAP,
      abi: swapAbi_iUSD_LPT,
    }
  }),
  USD5: {
    dailyVol: ModelCurrencyRates.create()
  },
  dUSD: {
    dailyVol: ModelCurrencyRates.create()
  },
  iUSD: {
    dailyVol: ModelCurrencyRates.create()
  },
  sUSDv2: {
    dailyVol: ModelCurrencyRates.create()
  }
}

store.sFinance = {
  dailyVol: ModelCurrencyRates.create(),
  totalValueStaked: ModelCurrencyRates.create()
}

store.lptoken = {
  BPT: BPT_LPT,
  dUSD: {
    name: 'dUSD LP token',
    address: process.env.VUE_APP_DUSD_TOKEN,
    swapAddress: process.env.VUE_APP_DUSD_SWAP,
    abi: tokensV2.dUSD.abi,
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
