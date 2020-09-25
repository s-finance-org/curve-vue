/**
 *  NOtE:
 *  Store
 */

import Vue from 'vue'

import { notifyHandler, notifyNotification } from '../init'
import * as common from '../utils/common.js'
import * as gaugeStore from '../components/dao/gaugeStore'
import daoabis from '../components/dao/allabis'

import I18nLanguages from '../i18n/languages'
import { valueModel } from '../model'
import { floor } from '../utils/math/round'

// FIXME: temp
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
import abiBpt from '../components/dao/abi/bpt'
import abiBptGauge from '../components/dao/abi/bptGauge'
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
      __contract: null,
      get contract () {
        const { __contract, abi, address } = this

        return __contract ||
          (this.__contract = new web3.eth.Contract(abi, address))
      },
    },
    bpt: {
      address: '0x5F6eF509e65676134BD73baf85E0cf2744D8e254',
      abi: abiBpt,
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

store.gauges = {
  bpt: {
    code: 'bpt',
    name: 'BPT',
    propagateMark: 'SFG',
    mortgagesUnit: 'BPT',

    address: '0xf9417badb0692bdedad616058619201fcd292532',
    abi: abiSUSDv2,
    // abi: abiBptGauge,
    __contract: null,
    get contract () {
      const { __contract, abi, address } = this

      return __contract ||
        (this.__contract = new web3.eth.Contract(abi, address))
    },

    mortgages: {
      bpt: {
        code: 'bpt',
        name: 'BPT',
        priceDecimal: 4,
        gainUrl: 'https://legacy.balancer.exchange/#/swap/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0',

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

        userPendingReward: valueModel.create(),
        userPaidReward: valueModel.create(),
        userTotalReward: valueModel.create(),
      }
    },

    async getTotalStaking (target) {
      const { contract } = this

      return target.tether = await contract.methods.totalSupply().call()
    },
    async getBalanceOf (target, accountAddress) {
      const { contract } = this

      return target.tether = await this.contract.methods.balanceOf(accountAddress).call()
    },
    async getUserPendingReward_SFG (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.claimable_tokens(accountAddress).call()
    },
    async getUserPaidReward_SFG (target, accountAddress) {
      const { contract } = this

      return target.tether = await contract.methods.integrate_fraction(accountAddress).call()
    },
    async getUserTotalReward_SFG (target, pendingReward, paidReward) {
      return target.tether = BN(await pendingReward).plus(await paidReward).toString()
    },

    async onStake (accountAddress, infApproval) {
      const { tokens } = store
      const { name, address, contract, mortgages } = this

      let deposit = BN(mortgages.bpt.userStake.revised).times(1e18)

      await common.approveAmount(tokens.bpt.contract, deposit, accountAddress, address, infApproval)

      var { dismiss } = notifyNotification(`Please confirm depositing into ${name} gauge`)

      await contract.methods.deposit(deposit.toFixed(0,1)).send({
        from: accountAddress,
        // gasPrice: this.gasPriceWei,
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
        // gasPrice: this.gasPriceWei,
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
        // gasPrice: this.gasPriceWei,
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
}

export default Vue.observable(store)
