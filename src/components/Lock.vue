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
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip1"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip1" variant="success">{{ $t('lock.cumulativeCirculationTip') }}</b-tooltip>
              </h6>
              <text-overlay-loading inline :show="store.tokens.sfg.supplied.loading">
                {{ store.tokens.sfg.supplied.cont }} {{ store.tokens.sfg.name }}
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-4">
              <h6 class="mb-1 text-black-65">
                {{ $t('lock.expectedReleaseToday') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip2"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip2" variant="success">{{ $t('lock.expectedReleaseTodayTip') }}</b-tooltip>
              </h6>
              <text-overlay-loading inline :show="store.tokens.sfg.dailyYield.loading">
                {{ store.tokens.sfg.dailyYield.cont }} {{ store.tokens.sfg.name }}
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-4">
              <h6 class="mb-1 text-black-65 d-flex align-items-center">
                {{ $t('lock.totalLockedPosition') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip3"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip3" variant="success">{{ $t('lock.totalLockedPositionTip') }}</b-tooltip>
              </h6>
              <text-overlay-loading inline :show="store.lock.SFG.totalSupply.loading">
                {{ store.lock.SFG.totalSupply.cont }} {{ store.tokens.sfg.name }}
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-4">
              <h6 class="mb-1 text-black-65 d-flex align-items-center">
                {{ $t('lock.circulation') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip4"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip4" variant="success">{{ $t('lock.circulationTip') }}</b-tooltip>
              </h6>
              <text-overlay-loading inline :show="store.tokens.sfg.circulation.loading">
                {{ store.tokens.sfg.circulation.cont }} {{ store.tokens.sfg.name }}
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
          <span class="col-12 col-md-4 pb-3">
            <h6 class="mb-0 text-black-65">{{ $t('lock.myLock') }}</h6>
            <text-overlay-loading inline :show="store.lock.SFG.mortgages.SFG.userStaking.loading">
              <span class="h4 mr-2">{{ store.lock.SFG.mortgages.SFG.userStaking.cont }}</span>
              <span class="inline-block text-black-65">{{ store.tokens.sfg.name }}</span>
            </text-overlay-loading>
          </span>
          <span class="col-12 col-md-4 pb-3">
            <h6 class="mb-0 text-black-65 d-flex align-items-center">
              {{ $t('lock.myAccelerationFactor') }}
              <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip10"></b-avatar>
              <b-tooltip placement="topright" target="tooltip-tip10" variant="success">{{ $t('lock.myAccelerationFactorTip') }}</b-tooltip>
            </h6>
            <text-overlay-loading inline :show="store.lock.SFG.mortgages.SFG.factorOf.loading">
              <span class="h4 text-danger-1">
                {{ store.lock.SFG.mortgages.SFG.factorOf.cont }}
              </span>
            </text-overlay-loading>
          </span>
          <span class="col-12 col-md-4 pb-3">
            <h6 class="mb-0 text-black-65 d-flex align-items-center">
              {{ $t('lock.myShare') }}
              <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip5"></b-avatar>
              <b-tooltip placement="topright" target="tooltip-tip5" variant="success">{{ $t('lock.myShareTip') }}</b-tooltip>
            </h6>
            <text-overlay-loading inline :show="store.lock.SFG.mortgages.SFG.share.loading">
              <span class="h4">
                {{ store.lock.SFG.mortgages.SFG.share.cont }}
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
        <span class="mr-3">{{ $t('lock.miningAcceleration') }}</span>
        <small class="mr-auto">{{ $t('lock.miningAccelerationTip') }}</small>
      </h4>
      <div class="box mb-4">
        <div class="px-4 py-3">
          <h5>{{ $t('lock.stablecoinMiningPool') }}</h5>
          <b-table responsive class="mb-0 text-right table acceleration" hover :items="acceleration.items.stablecoin" :fields="acceleration.fields">
            <template v-slot:head(name)>
              <span class="white-space-nowrap">
                {{ $t('lock.poolName')}}
              </span>
            </template>
            <template v-slot:cell(name)="data">
              {{ data.item.name }}
            </template>
            <template v-slot:head(weighting)>
              <span class="white-space-nowrap">
                {{ $t('lock.rewardWeight') }}
              </span>
            </template>
            <template v-slot:cell(weighting)="data">
              <text-overlay-loading :show="data.item.weighting.loading">
                {{ data.item.weighting.percent }} %
              </text-overlay-loading>
            </template>
            <template v-slot:head(mortgage)>
              <span class="white-space-nowrap">
                {{ $t('lock.myMortgageAmount') }}
              </span>
            </template>
            <template v-slot:cell(mortgage)="data">
              <text-overlay-loading :show="data.item.mortgage.loading">
                {{ data.item.mortgage.cont }} {{ data.item.lptoken }}
              </text-overlay-loading>
            </template>
            <template v-slot:head(need)>
              <span class="d-flex align-items-center justify-content-end white-space-nowrap">
                {{ $t('lock.needLockAmount') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip-s1"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip-s1" boundary="viewport" variant="success">{{ $t('lock.needLockAmountTip') }}</b-tooltip>
              </span>
            </template>
            <template v-slot:cell(need)="data">
              <text-overlay-loading :show="data.item.need.loading">
                {{ data.item.need.cont }}  {{ store.tokens.sfg.name }}
              </text-overlay-loading>
              <!-- -------<br/> -->
              <!-- {{ store.gauges.usd5.mortgages.usd5.ratioStaking }} -->
            </template>
            <template v-slot:head(day)>
              <span class="d-flex align-items-center justify-content-end white-space-nowrap">
                {{ $t('lock.needLockDays') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip-s2"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip-s2" boundary="viewport" variant="success">{{ $t('lock.needLockDaysTip') }}</b-tooltip>
              </span>
            </template>
            <template v-slot:cell(day)="data">
              <text-overlay-loading :show="data.item.day.loading">
                {{ data.item.day.cont }}
              </text-overlay-loading>
            </template>
            <template v-slot:head(accelerated)>
              <span class="d-flex align-items-center justify-content-end white-space-nowrap">
                {{ $t('lock.actualAcceleration') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip-s3"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip-s3" boundary="viewport" variant="success">{{ $t('lock.actualAccelerationTip') }}</b-tooltip>
              </span>
            </template>
            <template v-slot:cell(accelerated)="data">
              <text-overlay-loading :show="data.item.accelerated.loading">
                {{ data.item.accelerated.cont }}
              </text-overlay-loading>
            </template>
            <template v-slot:head(baseApy)>
              <span class="d-flex align-items-center justify-content-end white-space-nowrap">
                {{ $t('lock.basicAPY') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip-s4"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip-s4" boundary="viewport" variant="success">{{ $t('lock.basicAPYTip') }}</b-tooltip>
              </span>
            </template>
            <template v-slot:cell(baseApy)="data">
              <text-overlay-loading :show="data.item.baseApy.loading">
                {{ data.item.baseApy.percent }} %
              </text-overlay-loading>
            </template>
            <template v-slot:head(myApy)>
              {{ $t('lock.myAPY') }}
            </template>
            <template v-slot:cell(myApy)="data">
              <text-overlay-loading :show="data.item.myApy.loading">
                {{ data.item.myApy.percent }} %
              </text-overlay-loading>
            </template>
          </b-table>
        </div>
        <div class="px-4 py-3">
          <h5>{{ $t('lock.sfgMiningPool') }}</h5>
          <b-table responsive class="mb-0 text-right table acceleration" hover :items="acceleration.items.sfg" :fields="acceleration.fields">
            <template v-slot:head(name)>
              <span class="white-space-nowrap">
                {{ $t('lock.poolName')}}
              </span>
            </template>
            <template v-slot:cell(name)="data">
              {{ data.item.name }}
            </template>
            <template v-slot:head(weighting)>
              <span class="white-space-nowrap">
                {{ $t('lock.rewardWeight') }}
              </span>
            </template>
            <template v-slot:cell(weighting)="data">
              <text-overlay-loading :show="data.item.weighting.loading">
                {{ data.item.weighting.percent }} %
              </text-overlay-loading>
            </template>
            <template v-slot:head(mortgage)>
              <span class="white-space-nowrap">
                {{ $t('lock.myMortgageAmount') }}
              </span>
            </template>
            <template v-slot:cell(mortgage)="data">
              <text-overlay-loading :show="data.item.mortgage.loading">
                {{ data.item.mortgage.cont }} {{ data.item.lptoken }}
              </text-overlay-loading>
            </template>
            <template v-slot:head(need)>
              <span class="d-flex align-items-center justify-content-end white-space-nowrap">
                {{ $t('lock.needLockAmount') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip-t1"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip-t1" boundary="viewport" variant="success">{{ $t('lock.needLockAmountTip') }}</b-tooltip>
              </span>
            </template>
            <template v-slot:cell(need)="data">
              <text-overlay-loading :show="data.item.need.loading">
                {{ data.item.need.cont }}  {{ store.tokens.sfg.name }}
              </text-overlay-loading>
              <!-- -------<br/> -->
              <!-- {{ store.gauges.usd5.mortgages.usd5.ratioStaking }} -->
            </template>
            <template v-slot:head(day)>
              <span class="d-flex align-items-center justify-content-end white-space-nowrap">
                {{ $t('lock.needLockDays') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip-t2"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip-t2" boundary="viewport" variant="success">{{ $t('lock.needLockDaysTip') }}</b-tooltip>
              </span>
            </template>
            <template v-slot:cell(day)="data">
              <text-overlay-loading :show="data.item.day.loading">
                {{ data.item.day.cont }}
              </text-overlay-loading>
            </template>
            <template v-slot:head(accelerated)>
              <span class="d-flex align-items-center justify-content-end white-space-nowrap">
                {{ $t('lock.actualAcceleration') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip-t3"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip-t3" boundary="viewport" variant="success">{{ $t('lock.actualAccelerationTip') }}</b-tooltip>
              </span>
            </template>
            <template v-slot:cell(accelerated)="data">
              <text-overlay-loading :show="data.item.accelerated.loading">
                {{ data.item.accelerated.cont }}
              </text-overlay-loading>
            </template>
            <template v-slot:head(baseApy)>
              <span class="d-flex align-items-center justify-content-end white-space-nowrap">
                {{ $t('lock.basicAPY') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-1" id="tooltip-tip-t4"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip-t4" boundary="viewport" variant="success">{{ $t('lock.basicAPYTip') }}</b-tooltip>
              </span>
            </template>
            <template v-slot:cell(baseApy)="data">
              <text-overlay-loading :show="data.item.baseApy.loading">
                {{ data.item.baseApy.percent }} %
              </text-overlay-loading>
            </template>
            <template v-slot:head(myApy)>
              {{ $t('lock.myAPY') }}
            </template>
            <template v-slot:cell(myApy)="data">
              <text-overlay-loading :show="data.item.myApy.loading">
                {{ data.item.myApy.percent }} %
              </text-overlay-loading>
            </template>
          </b-table>
        </div>
      </div>

      <!-- <h4 class="mb-2 d-flex flex-wrap align-items-end">
        <span class="mr-3">{{ $t('lock.dividends') }}</span>
        <small class="mr-auto">{{ $t('lock.dividendsTip') }}</small>
      </h4>
      <div class="box mb-4">
        <div class="px-4 py-3 line-bottom">
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
      </div> -->

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
        acceleration () {
          const { gauges, tokens } = store

          const result = {
            usd5: {
              _gauges: gauges.usd5,
              _mortgage: gauges.usd5.mortgages.usd5,
            },
            bpt: {
              _gauges: gauges.bpt,
              _mortgage: gauges.bpt.mortgages.bpt,
            },
          }

          for (let key in result) {
            let val = result[key]

            val.name = val._gauges.propagateMark,
            val.lptoken = val._gauges.name,
            val.weighting = val._gauges.rewards.sfg.weighting,
            val.mortgage = val._mortgage.userStaking,
            val.need = val._mortgage.needLockAmount,
            val.day = val._mortgage.needLockDay,
            val.accelerated = val._mortgage.factorOf,
            val.baseApy = val._gauges.apy,
            val.myApy = val._gauges.myApy
          }

          return {
            fields: [
              { key: 'name', stickyColumn: true, isRowHeader: true },
              'weighting',
              'mortgage',
              'need',
              'day',
              'accelerated',
              'baseApy',
              'myApy'
            ],
            items: {
              stablecoin: [
                result.usd5
              ],
              sfg: [
                result.bpt
              ]
            }
          }
        }
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

            const { lock, tokens, gauges } = store
            const walletAddress = currentContract.default_account

            // sfg
            tokens.sfg.getSupplied()
            tokens.sfg.getDailyYield()
            tokens.sfg.getCirculation(
              lock.SFG.getTotalSupply()
            )

            const sfgBalanceOf = lock.SFG.getBalanceOf(lock.SFG.mortgages.SFG.userStaking, walletAddress)

            lock.SFG.getShare(
              lock.SFG.mortgages.SFG.share,
              sfgBalanceOf,
              lock.SFG.getFactorOf(lock.SFG.mortgages.SFG.factorOf, walletAddress)
            )

            const stakeTimeOfEther = lock.SFG.getStakeTimeOf(lock.SFG.mortgages.SFG.stakeTimeOf, walletAddress)
            const sfgFactorOf = lock.SFG.getFactorOf(lock.SFG.mortgages.SFG.factorOf, walletAddress)
            const sfgStakingPerLPT = lock.SFG.getStakingPerLPT(gauges.usd5.address)

            const sfgPrice = tokens.sfg.getPrice()
            const sfgDailyYield = tokens.sfg.getDailyYield()

            tokens.sfg.getBalanceOf(lock.SFG.mortgages.SFG.userBalanceOf, walletAddress)

            // usd5
            await lock.SFG.getWeightOfGauge(gauges.usd5.rewards.sfg.weighting, gauges.usd5.address)

            gauges.usd5.getMyApy(
              gauges.usd5.getAPY(
                sfgPrice,
                sfgDailyYield,
                gauges.usd5.getVirtualTotalSupply(), // gauges.usd5.getTotalStaking(gauges.usd5.mortgages.usd5.totalStaking),
                tokens.usd5.getPrice(),
              ),
              sfgFactorOf
            )

            gauges.usd5.getFactorOf(gauges.usd5.mortgages.usd5.factorOf, walletAddress)

            gauges.usd5.getNeedLockAmount(
              gauges.usd5.mortgages.usd5.needLockAmount,
              sfgStakingPerLPT,
              gauges.usd5.getBalanceOf(gauges.usd5.mortgages.usd5.userStaking, walletAddress),
              sfgBalanceOf,
            )

            gauges.usd5.getNeedLockDay(gauges.usd5.mortgages.usd5.needLockDay, stakeTimeOfEther)

            // bpt
            await lock.SFG.getWeightOfGauge(gauges.bpt.rewards.sfg.weighting, gauges.bpt.address)

            gauges.bpt.getMyApy(
              gauges.bpt.getAPY(
                sfgPrice,
                sfgDailyYield,
                gauges.bpt.getVirtualTotalSupply(), // gauges.usd5.getTotalStaking(gauges.usd5.mortgages.usd5.totalStaking),
                tokens.bpt.getPrice(),
              ),
              sfgFactorOf
            )

            gauges.bpt.getFactorOf(gauges.bpt.mortgages.bpt.factorOf, walletAddress)

            gauges.bpt.getNeedLockAmount(
              gauges.bpt.mortgages.bpt.needLockAmount,
              sfgStakingPerLPT,
              gauges.bpt.getBalanceOf(gauges.bpt.mortgages.bpt.userStaking, walletAddress),
              sfgBalanceOf,
            )

            gauges.bpt.getNeedLockDay(gauges.bpt.mortgages.bpt.needLockDay, stakeTimeOfEther)
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
  .acceleration {
    
  }
  .acceleration thead {
    padding: 0 10px;
  }
  .acceleration td {
    padding: 8px 0 8px 20px;
  }
  .acceleration thead th{
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    padding: 8px 0 8px 20px;
    background: #e8f6f1 !important;
    border: 0;
  }
  .acceleration th:first-child {
    text-align: left;
    padding: 8px 0 8px 10px;
  }
  .acceleration th:last-child {
    padding-right: 10px;
  }
  .acceleration th:last-child,
  .acceleration td:last-child {
    padding-right: 10px;
  }
  .acceleration tbody tr {
    box-shadow: 0px -1px 0px 0px rgba(0,0,0,0.08) inset;
  }
</style>
