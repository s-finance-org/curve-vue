/**
 *  NOtE:
 *  Store
 */

import Vue from 'vue'

import I18nLanguages from '../i18n/languages'

const __store__ = {
  create () {
    return {
      i18n: {
        locale: ''
      }
    }
  }
}

import abiSNX from '../components/dao/abi/snx'
import abiCRV from '../components/dao/abi/crv'
import abiSUSDv2 from '../components/dao/abi/susdv2'
import { ERC20_abi as abiSusdv2LpToken } from '../allabis'

const store = {
  metaInfo: {
    template: {
      title: 'S.finance',
      meta: [
        {'property': 'og:title', 'content': 's.finance'},
        {'property': 'og:url', 'content': 'https://s.finance'},
        {'property': 'og:type', 'content': 'website'},
        {'property': 'og:description', 'content': ''},
        {'property': 'og:image', 'content': '/curve.png'},
        {'name': 'twitter:card', 'content': 'summary_large_image'},
        {'name': 'twitter:title', 'content': 's.finance'},
        {'name': 'twitter:site', 'content': ''},
        {'name': 'twitter:creator', 'content': ''},
        {'name': 'twitter:description', 'content': ''},
        {'name': 'twitter:url', 'content': 'https://s.finance'},
        {'name': 'twitter:image', 'content': '/sfinance.png'},
      ]
    },
    getData() {
      return this.template
    }
  },
  gauges: {
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
      async getBalanceOf (target, accountAddress) {
        const { contract } = this

        return target.tether = await this.contract.methods.balanceOf(accountAddress).call()
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

        return target.tether = await contract.methods.integrate_fraction(accountAddress).call()
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
  },
  tokens: {
    susdv2LpToken: {
      address: process.env.VUE_APP_LPT,
      abi: abiSusdv2LpToken,
      __contract: null,
      get contract () {
        const { __contract, abi, address } = this

        return __contract ||
          (this.__contract = new web3.eth.Contract(abi, address))
      },
      async getBalanceOf (target, accountAddress) {
        const { contract } = this

        return target.tether = await contract.methods.balanceOf(accountAddress).call()
      },
    },
    snx: {
      address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      abi: abiSNX,
      __contract: null,
      get contract () {
        const { __contract, abi, address } = this

        return __contract ||
          (this.__contract = new web3.eth.Contract(abi, address))
      },
    },
    crv: {
      address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
      abi: abiCRV,
      contract: null
    }
  },
  i18n: {
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
}

export default Vue.observable(store)
