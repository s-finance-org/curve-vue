<template>
	<div>
    <div class="total-bg">
      <b-container class="py-4 pl-5 d-flex align-items-center">
        <img class="logo_lg mr-4" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
        <h3 class="mb-0">
          {{ $t('lock.title') }}<br/>
          <b-badge variant="success" class="text-12">{{ $t('lock.subtitle') }}</b-badge>
        </h3>
      </b-container>
    </div>

    <b-container>
      <root-sub />

      <h4 class="mt-4 mb-2">
        {{ $t('lock.overview') }}
      </h4>

      <div class="box mb-5">
        <div class="px-4 pt-4">
          <div class="row">
            <span class="col-12 col-md mb-4">
              <h6 class="mb-1 text-black-65 d-flex align-items-center">
                {{ $t('lock.cumulativeCirculation') }}
                <b-avatar text="!" class="iconTip iconTip-warning -1" id="tooltip-tip1"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip1" variant="success">???</b-tooltip>
              </h6>
              <text-overlay-loading inline show="false">
                11111
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-4">
              <h6 class="mb-1 text-black-65">
                {{ $t('lock.expectedReleaseToday') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip2"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip2" variant="success">???</b-tooltip>
              </h6>
              <text-overlay-loading inline show="false">
                11111
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-4">
              <h6 class="mb-1 text-black-65 d-flex align-items-center">
                {{ $t('lock.totalLockedPosition') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip3"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip3" variant="success">???</b-tooltip>
              </h6>
              <text-overlay-loading inline show="false">
                11111
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-4">
              <h6 class="mb-1 text-black-65 d-flex align-items-center">
                {{ $t('lock.circulation') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip4"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip4" variant="success">???</b-tooltip>
              </h6>
              <text-overlay-loading inline show="false">
                11111
              </text-overlay-loading>
            </span>
          </div>
        </div>
      </div>

      <h4 class="mb-2 d-flex flex-wrap align-items-end">
        <span class="mr-3">{{ $t('lock.lockUp') }}</span>
        <small class="mr-auto">{{ $t('lock.lockedTip') }}</small>
      </h4>
      <div class="box mb-4 px-4 py-3">
        <div class="row mb-3 line-bottom">
          <span class="col-12 col-md-6 pb-3">
            <h6 class="mb-0 text-black-65">{{ $t('lock.totalLockedPosition') }}</h6>
            <text-overlay-loading inline :show="store.lock.SFG.mortgages.SFG.totalStaking.loading">
              <span class="h4 mr-2">{{ store.lock.SFG.mortgages.SFG.totalStaking.cont }}</span>
              <span class="inline-block text-black-65">{{ store.lock.SFG.mortgagesUnit }}</span>
            </text-overlay-loading>
          </span>
          <span class="col-12 col-md-6 pb-3">
            <h6 class="mb-0 text-black-65">{{ $t('lock.myLock') }}</h6>
            <!-- <text-overlay-loading inline :show="store.lock.SFG.mortgages.SFG.userStaking.loading">
              <span class="h4 mr-2">{{ store.gauges.qusd5.mortgages.qusd5.userStaking.cont }}</span>
              <span class="inline-block text-black-65">{{ store.gauges.qusd5.mortgagesUnit }}</span>
            </text-overlay-loading> -->
          </span>
          <span class="col-12 col-md-6 pb-3">
            <h6 class="mb-0 text-black-65 d-flex align-items-center">
              {{ $t('lock.myShare') }}
              <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip5"></b-avatar>
              <b-tooltip placement="topright" target="tooltip-tip5" variant="success">???</b-tooltip>
            </h6>
            <!-- <text-overlay-loading inline :show="store.tokens.qusd5.price.loading">
              <span class="h4">
                1 <span class="h6 text-black-65">{{ store.tokens.qusd5.name }} = </span>
              </span>
              <span class="h4">
                {{ store.tokens.qusd5.price.cont }}
                <span class="text-black-65 h6">USD</span>
              </span>
            </text-overlay-loading> -->
          </span>
          <span class="col-12 col-md-6 pb-3">
            <h6 class="mb-0 text-black-65 d-flex align-items-center">
              {{ $t('lock.myAccelerationFactor') }}
              <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip6"></b-avatar>
              <b-tooltip placement="topright" target="tooltip-tip6" variant="success">???</b-tooltip>
            </h6>
            <text-overlay-loading inline :show="store.gauges.qusd5.rewards.sfg.dailyYield.loading">
              <span class="h4 text-danger-1">
                {{ store.gauges.qusd5.rewards.sfg.dailyYield.cont }}
              </span>
            </text-overlay-loading>
          </span>
        </div>

        <b-tabs pills nav-class="tabs-nav" class="mt-1">
          <b-tab :title="$t('lock.lockUp')" class="pt-3" active>
            <label class="text-black-65 mb-0">{{ $t('lock.lockUp') }}</label>
            <div class="row flex-wrap">
              <div class="col-12 col-lg mt-2">
                <b-form-input class="h-38" v-model="store.lock.SFG.mortgages.SFG.stakeAmountInput" :placeholder="$t('lock.enterLockedPosition')"></b-form-input>
              </div>
              <b-form-radio-group
                class="mt-2 col"
                v-model="store.lock.SFG.mortgages.SFG.stakeSliderSelectedRadio"
                :options="store.lock.SFG.mortgages.SFG.stakeSliderOptions"
                buttons
                button-variant="outline-secondary"
              ></b-form-radio-group>
            </div>
            <small class="d-flex mt-1 flex-wrap">
              {{ $t('lock.currentLockablePosition') }}：
              <text-overlay-loading class="mr-2" :show="store.lock.SFG.mortgages.SFG.userBalanceOf.loading">{{ store.lock.SFG.mortgages.SFG.userBalanceOf.cont }} {{ store.lock.SFG.mortgages.SFG.name }}</text-overlay-loading>
              <b-button class="text-blue-1" target="_blank" :href=store.lock.SFG.mortgages.SFG.gainUrl size="xsm" variant="light">{{ $t('lock.goBalancer') }}</b-button>
            </small>
            <!-- FIXME: inf_approval -->
            <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
            <b-alert class="mt-3" :show="dismissCountDown" variant="dark" dismissible fade
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged"
              v-html='waitingMessage'>
            </b-alert>
            <b-alert class="mt-3" :show="store.tokens.sfg.error.dismissCountDown" variant="dark" dismissible fade
              @dismissed="store.tokens.sfg.error.dismissCountDown=0"
              v-html='store.tokens.sfg.error.message'>
            </b-alert>

            <div class="d-flex align-items-end mt-5 float-right">
              <text-overlay-loading :show="loadingAction">
                <b-button size="lg" variant="danger" @click=onStake>
                  {{ $t('lock.confirmLock') }}
                </b-button>
              </text-overlay-loading>
            </div>
          </b-tab>
          <b-tab :title="$t('lock.unlock')" class="pt-3">
            <label class="text-black-65 mb-0 d-flex align-items-center">
              {{ $t('lock.unlock') }}
            </label>
            <div class="row flex-wrap">
              <div class="col-12 col-lg mt-2">
                <b-form-input class="h-38" v-model="store.lock.SFG.mortgages.SFG.redemptionAmountInput" :placeholder="$t('lock.enterunLockPosition')"></b-form-input>
              </div>
              <b-form-radio-group
                class="mt-2 col"
                v-model="store.lock.SFG.mortgages.SFG.redemptionSliderSelectedRadio"
                :options="store.lock.SFG.mortgages.SFG.redemptionSliderOptions"
                buttons
                button-variant="outline-secondary"
              ></b-form-radio-group>
            </div>
            <small class="d-flex mt-1">
              {{ $t('lock.currentlyUnlockable') }}：
              <text-overlay-loading :show="store.lock.SFG.mortgages.SFG.userStaking.loading">{{ store.lock.SFG.mortgages.SFG.userStaking.cont }} {{ store.lock.SFG.mortgages.SFG.name }}</text-overlay-loading>
            </small>
            <!-- FIXME: inf_approval -->
            <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
            <b-alert class="mt-3" :show="dismissCountDown && waitingMessageTargetId === 'withdraw'" variant="dark" dismissible fade
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged"
              v-html='waitingMessage'>
            </b-alert>
            <div class="d-flex align-items-end mt-5 float-right">
              <text-overlay-loading :show="loadingAction">
                <b-button size="lg" variant="danger" @click=onRedemption>
                  {{ $t('lock.confirmUnlock') }}
                </b-button>
              </text-overlay-loading>
            </div>
          </b-tab>
        </b-tabs>
      </div>

      <h4 class="mb-2 d-flex flex-wrap align-items-end">
        <span class="mr-3">{{ $t('lock.dividends') }}</span>
        <small class="mr-auto">{{ $t('lock.dividendsTip') }}</small>
      </h4>
      <div class="box mb-4">
        <div class="px-4 py-3 line-bottom">
          <h6 class="text-black-65 mb-3">{{ $t('lock.assetDistribution') }}</h6>
          <div class="row">
            <span class="col-3" v-for='(currency, i) in Object.keys(currencies)'>
              <h6 class="mb-0 text-black-65">{{currency | capitalize}}：</h6>
              <text-overlay-loading inline :show="!(bal_info && bal_info[i])">
                {{bal_info && toFixed(bal_info[i]) }} ({{((bal_info && bal_info[i] * 100) / totalBalances) | toFixed2}}%) 
              </text-overlay-loading>
            </span>
          </div>
        </div>
        <div class="px-4 py-3 line-bottom">
          <h6 class="text-black-65 mb-3">{{ $t('global.fee') }}</h6>
          <div class="row">
            <span class="col-3">
              <h6 class="mb-0 text-black-65">{{ $t('lock.swapFeeRate') }}</h6>
              {{ fee && fee.toFixed(3) }}%
            </span>
            <span class="col-3">
              <h6 class="mb-0 text-black-65">{{ $t('lock.adminFeeRate') }}</h6>
              {{ $t('lock.reserveSwapFee', [`${admin_fee && admin_fee.toFixed(3)}%`]) }}
            </span>
          </div>
        </div>
        <!-- <div class="px-4 py-3">
          <h6 class="text-black-65 mb-3">{{ $t('global.norm') }}</h6>
           <div class="row">
            <span class="col-3">{{ $t('lock.lpTokenPrice') }}：?</span>
            <span class="col-3">{{ $t('lock.liquidityAPY') }}：?</span>
            <span class="col-3">{{ $t('lock.fundingFeeRate') }}：?</span>
          </div>
        </div> -->
      </div>

    </b-container>
	</div>
</template>

<script>
	  import Vue from 'vue'
    import { notify, notifyHandler, notifyNotification } from '../init'
    import * as common from '../utils/common.js'
    import { getters, contract as currentContract, gas as contractGas } from '../contract'
    import allabis, { ERC20_abi, balancer_ABI, balancer_address } from '../allabis'
    import * as helpers from '../utils/helpers'

    import * as gasPriceStore from './common/gasPriceStore'
    import GasPrice from './common/GasPrice.vue'
    import RootSub from './root/RootSub.vue'

    import * as errorStore from './common/errorStore'

    import TextOverlayLoading from '../components/common/TextOverlayLoading.vue'

    import BN from 'bignumber.js'

    import Slippage from './common/Slippage.vue'
    import * as gaugeStore from './dao/gaugeStore'

    import { getBTCPrice } from './common/priceStore'

    import store from '../store'
    import { valueModel } from '../model'
    import { floor } from '../utils/math/round'
  	import * as volumeStore from '@/components/common/volumeStore'

    const __store__ = {
      loadingAction: true,
      notationDecimal: 1e18,

      tokens: {
        sfg: {
          priceDecimal: 2,
        },
        crv: {
          priceDecimal: 4,
        },
        snx: {
          priceDecimal: 4,
        }
      }
    }

    export default {
    	components: {
        Slippage,
        GasPrice,
        TextOverlayLoading,
        RootSub
    	},
    	data: () => ({
        store,

        waitingMessage: '',
        waitingMessageTargetId: '',
        dismissSecs: 10,
        dismissCountDown: 0,

        // TODO: 
        pools: {
          stand: ['susdv2', 'dfi'],
          token: ['sfg']
        },

        pools: [],
        mypools: [],
        claimFromGauges: [],

        inf_approval: true,

        gaugeContract: null,
        depositSlider: 100,
        withdrawSlider: 100,

        // FIXME:
        claimableReward: 0,
        gaugeContract: null,
        gauge: '',
      }),

        computed: {
          ...getters,
          gasPrice() {
            return gasPriceStore.state.gasPrice
          },
          gasPriceWei() {
            return gasPriceStore.gasPriceWei
          },
          loadingAction: {
            get () {
              // FIXME: 
              if (__store__.loadingAction && currentContract.initializedContracts) {
                this.mounted()
                __store__.loadingAction = false
              }

              return __store__.loadingAction
            },
            set (val) {
              __store__.loadingAction = val
            }
          },



        },
        created() {
          // FIXME: ?
          this.$watch(() => currentContract.currentContract, (val, oldval) => {
            console.log('watch currentContract', val, oldval)
          })
        },
        async mounted() {
        },
        watch: {
        },
        methods: {
          // FIXME:
          async onStake () {
            const { lock, tokens } = store
            // this.alert('notice.approveOperationWarning', 'stake')

            if (!await tokens.sfg.hasValidAmount(lock.SFG.mortgages.SFG.userStake.revised)) return false

            if (await tokens.sfg.hasApprove(lock.SFG.mortgages.SFG.userStake.revised, currentContract.default_account, lock.SFG.address)) {
              lock.SFG.onStake(currentContract.default_account, this.inf_approval)
            } else {
              tokens.sfg.onApproveAmount(lock.SFG.mortgages.SFG.userStake.revised, currentContract.default_account, lock.SFG.address, this.inf_approval)
            }
          },
          async onRedemption () {
            store.lock.SFG.onRedemption(currentContract.default_account, this.inf_approval)
          },

          async mounted() {

            await gaugeStore.getState()

            this.loadingAction = false

            this.pools = gaugeStore.state.pools
            this.mypools = gaugeStore.state.mypools
            this.claimFromGauges = this.myGauges

            store.tokens.sfg.getDailyYield()
            store.lock.SFG.getTotalStaking(store.lock.SFG.mortgages.SFG.totalStaking),

            store.tokens.sfg.getBalanceOf(store.lock.SFG.mortgages.SFG.userBalanceOf, currentContract.default_account)

            store.lock.SFG.getBalanceOf(store.lock.SFG.mortgages.SFG.userStaking, currentContract.default_account)

            // qusd5.getUserTotalReward_SFG(
            //   qusd5.rewards.sfg.userTotalReward,
            //   qusd5.getUserPendingReward_SFG(qusd5.rewards.sfg.userPendingReward, currentContract.default_account),
            //   qusd5.getUserPaidReward_SFG(qusd5.rewards.sfg.userPaidReward, currentContract.default_account)
            // )

            // qusd5.getUserTotalReward_KUN(
            //   qusd5.rewards.kun.userTotalReward,
            //   qusd5.getUserPendingReward_KUN(qusd5.rewards.kun.userPendingReward, currentContract.default_account),
            //   qusd5.getUserPaidReward_KUN(qusd5.rewards.kun.userPaidReward, currentContract.default_account)
            // )
          },
          countDownChanged(val) {
            this.dismissCountDown = val
          },
          alert(msg = '', targetId = '') {
            this.dismissCountDown = this.dismissSecs
            this.waitingMessage = this.$i18n.t(msg)
            this.waitingMessageTargetId = targetId
          },
          getTokenIcon(token) {
            return helpers.getTokenIcon(token, false, '')
          },
          toFixed(num) {
            if(num == '' || num == undefined || +num == 0) return '0.00'
            if(!BN.isBigNumber(num)) num = +num
            return num.toFixed(2)
          },
        }
  }
</script>

<style>
  .area {
    background: rgba(255,255,255,0.3);
    border: 1px solid #dadedf;
    border-radius: 2px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .area:last-child {
    margin-bottom: 0px;
  }
  .area > .row > .col {
    border-right: 1px solid rgba(0,0,0,0.08);
  }
  .area > .row > .col:last-child {
    border-right-width: 0px;
  }
</style>
