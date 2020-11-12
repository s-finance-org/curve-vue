<template>
	<div>
    <div class="total-bg">
      <b-container class="py-4 pl-5 d-flex align-items-center">
        <img class="logo_lg mr-4" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
        <h3 class="mb-0">
          {{ $t('lock.title') }}
          <small>{{ $t('lock.subtitle') }}</small>
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
              <h6 class="mb-1 text-black-65">
                {{ $t('lock.cumulativeCirculation') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-2" id="tooltip-tip1"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip1" variant="success">???</b-tooltip>
              </h6>
              <text-overlay-loading inline show="false">
                11111
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-4">
              <h6 class="mb-1 text-black-65">
                {{ $t('lock.expectedReleaseToday') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-2" id="tooltip-tip2"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip2" variant="success">???</b-tooltip>
              </h6>
              <text-overlay-loading inline show="false">
                11111
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-4">
              <h6 class="mb-1 text-black-65">
                {{ $t('lock.totalLockedPosition') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-2" id="tooltip-tip3"></b-avatar>
                <b-tooltip placement="topright" target="tooltip-tip3" variant="success">???</b-tooltip>
              </h6>
              <text-overlay-loading inline show="false">
                11111
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-4">
              <h6 class="mb-1 text-black-65">
                {{ $t('lock.circulation') }}
                <b-avatar text="!" class="iconTip iconTip-warning ml-2" id="tooltip-tip4"></b-avatar>
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
            <h6 class="mb-0 text-black-65">{{ $t('lock.myStaking') }}</h6>
            <text-overlay-loading inline :show="store.gauges.qusd5.mortgages.qusd5.userStaking.loading">
              <span class="h4 mr-2">{{ store.gauges.qusd5.mortgages.qusd5.userStaking.cont }}</span>
              <span class="inline-block text-black-65">{{ store.gauges.qusd5.mortgagesUnit }}</span>
            </text-overlay-loading>
          </span>
          <span class="col-12 col-md-6 pb-3">
            <h6 class="mb-0 text-black-65">{{ $t('lock.virtualPrice') }}</h6>
            <text-overlay-loading inline :show="store.tokens.qusd5.price.loading">
              <span class="h4">
                1 <span class="h6 text-black-65">{{ store.tokens.qusd5.name }} = </span>
              </span>
              <span class="h4">
                {{ store.tokens.qusd5.price.cont }}
                <span class="text-black-65 h6">USD</span>
              </span>
            </text-overlay-loading>
          </span>
          <!-- <span class="col-12 col-md-6 pb-3">
            <h6 class="mb-0 text-black-65">{{ $t('lock.rewardWeight', ['SFG']) }}</h6>
            <text-overlay-loading inline :show="store.gauges.qusd5.rewards.sfg.weighting.loading">
              <span class="h4">{{ store.gauges.qusd5.rewards.sfg.weighting.percent }}%</span>
            </text-overlay-loading>
          </span> -->
          <span class="col-12 col-md-6 pb-3">
            <h6 class="mb-0 text-black-65">{{ $t('lock.dailyYield', ['SFG']) }}</h6>
            <text-overlay-loading inline :show="store.gauges.qusd5.rewards.sfg.dailyYield.loading">
              <span class="h4">
                {{ store.gauges.qusd5.rewards.sfg.dailyYield.cont }}
                <span class="text-black-65 h6">{{ store.gauges.qusd5.rewards.sfg.name }}</span>
              </span>
              <!-- <b-avatar text="!" class="iconTip iconTip-warning ml-2" id="tooltip-mining-paid-reward-tip1"></b-avatar>
              <b-tooltip placement="topright" target="tooltip-mining-paid-reward-tip1" variant="success">{{ $t('lock.miningPoolOpeningNotice', [store.gauges.qusd5.propagateMark, store.gauges.qusd5.mortgagesUnit]) }}</b-tooltip> -->
            </text-overlay-loading>
          </span>
          <span class="col-12 col-md-6 pb-3">
            <h6 class="mb-0 text-black-65">{{ $t('lock.dailyYield', ['KUN']) }}</h6>
            <text-overlay-loading inline :show="store.gauges.qusd5.rewards.kun.dailyYield.loading">
              <span class="h4">
                {{ store.gauges.qusd5.rewards.kun.dailyYield.cont }}
                <span class="text-black-65 h6">{{ store.gauges.qusd5.rewards.kun.name }}</span>
              </span>
              <!-- <b-avatar text="!" class="iconTip iconTip-warning ml-2" id="tooltip-mining-paid-reward-tip2"></b-avatar>
              <b-tooltip placement="topright" target="tooltip-mining-paid-reward-tip2" variant="success">{{ $t('lock.miningPoolOpeningNotice', [store.gauges.qusd5.propagateMark, store.gauges.qusd5.mortgagesUnit]) }}</b-tooltip> -->
            </text-overlay-loading>
          </span>
        </div>

        <b-tabs pills nav-class="tabs-nav" class="mt-1">
          <b-tab :title="$t('lock.staking')" class="pt-3" active>
            <label class="text-black-65 mb-0">{{ $t('lock.staking') }}</label>
            <div class="row flex-wrap">
              <div class="col-12 col-lg mt-2">
                <b-form-input class="h-38" v-model="store.gauges.qusd5.mortgages.qusd5.stakeAmountInput" :placeholder="$t('lock.stakingAmountPlaceholder')"></b-form-input>
              </div>
              <b-form-radio-group
                class="mt-2 col"
                v-model="store.gauges.qusd5.mortgages.qusd5.stakeSliderSelectedRadio"
                :options="store.gauges.qusd5.mortgages.qusd5.stakeSliderOptions"
                buttons
                button-variant="outline-secondary"
              ></b-form-radio-group>
            </div>
            <small class="d-flex mt-1 flex-wrap">
              {{ $t('lock.stakingBalance') }}：
              <text-overlay-loading class="mr-2" :show="store.gauges.qusd5.mortgages.qusd5.userBalanceOf.loading">{{ store.gauges.qusd5.mortgages.qusd5.userBalanceOf.cont }} {{ store.gauges.qusd5.mortgages.qusd5.name }}</text-overlay-loading>
              <b-button class="text-blue-1" to='/liquidity/qusd5' size="xsm" variant="light">{{ $t('lock.stakingConfirmTip', [store.gauges.qusd5.mortgages.qusd5.name]) }}</b-button>
            </small>
            <!-- FIXME: inf_approval -->
            <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
            <b-alert class="mt-3" :show="dismissCountDown" variant="dark" dismissible fade
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged"
              v-html='waitingMessage'>
            </b-alert>
            <b-alert class="mt-3" :show="store.tokens.qusd5.error.dismissCountDown" variant="dark" dismissible fade
              @dismissed="store.tokens.qusd5.error.dismissCountDown=0"
              v-html='store.tokens.qusd5.error.message'>
            </b-alert>

            <div class="d-flex align-items-end mt-5 float-right">
              <text-overlay-loading :show="loadingAction">
                <b-button size="lg" variant="danger" @click=onQusd5Stake>
                  {{ $t('lock.stakingConfirm') }}
                </b-button>
              </text-overlay-loading>
            </div>
          </b-tab>
          <b-tab :title="$t('lock.redemption')" class="pt-3">
            <label class="text-black-65 mb-0 d-flex align-items-center">
              {{ $t('lock.redemption') }}
              <b-avatar text="!" class="iconTip iconTip-warning ml-2" id="tooltip-mining-paid-reward-tip-qian"></b-avatar>
              <b-tooltip placement="topright" target="tooltip-mining-paid-reward-tip-qian" variant="success">{{ $t('lock.rewardMayBeLost') }}</b-tooltip>
            </label>
            <div class="row flex-wrap">
              <div class="col-12 col-lg mt-2">
                <b-form-input class="h-38" v-model="store.gauges.qusd5.mortgages.qusd5.redemptionAmountInput" :placeholder="$t('lock.redemptionAmountPlaceholder')"></b-form-input>
              </div>
              <b-form-radio-group
                class="mt-2 col"
                v-model="store.gauges.qusd5.mortgages.qusd5.redemptionSliderSelectedRadio"
                :options="store.gauges.qusd5.mortgages.qusd5.redemptionSliderOptions"
                buttons
                button-variant="outline-secondary"
              ></b-form-radio-group>
            </div>
            <small class="d-flex mt-1">
              {{ $t('lock.redemptionBalance') }}：
              <text-overlay-loading :show="store.gauges.qusd5.mortgages.qusd5.userStaking.loading">{{ store.gauges.qusd5.mortgages.qusd5.userStaking.cont }} {{ store.gauges.qusd5.mortgages.qusd5.name }}</text-overlay-loading>
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
                <b-button size="lg" variant="danger" @click=onQusd5Redemption>
                  {{ $t('lock.redemptionConfirm') }}
                </b-button>
              </text-overlay-loading>
            </div>
          </b-tab>
          <b-tab :title="$t('lock.miningReward')" class="pt-3">
            <div class="area">
              <h5 class="mb-3 d-flex align-items-center">
                <img :src="getTokenIcon(store.gauges.qusd5.rewards.sfg.code)" class="mr-2 icon-w-20 icon token-icon" :class="[store.gauges.qusd5.rewards.sfg.code+'-icon']">
                {{ store.gauges.qusd5.rewards.sfg.name }}
              </h5>
              <h6 class="mb-0 text-black-65">{{ $t('lock.miningPendingReward') }}</h6>
              <h4 class="mb-1">
                <text-overlay-loading inline :show="store.gauges.qusd5.rewards.sfg.userPendingReward.loading">
                  {{ store.gauges.qusd5.rewards.sfg.userPendingReward.cont }} {{ store.gauges.qusd5.rewards.sfg.name }}
                </text-overlay-loading>
              </h4>
              <div class="d-flex no-gutters align-items-end">
                <small class="col row flex-wrap">
                  <span class="col-12 col-lg-auto">
                    {{ $t('lock.miningPaidReward') }}：
                    <text-overlay-loading inline :show="store.gauges.qusd5.rewards.sfg.userPaidReward.loading">
                      {{ store.gauges.qusd5.rewards.sfg.userPaidReward.cont }} {{ store.gauges.qusd5.rewards.sfg.name }}
                    </text-overlay-loading>
                    <em class="px-3 text-black-15">/</em>
                  </span>
                  <span class="col-12 col-lg-auto">
                    {{ $t('lock.miningTotalReward') }}：
                    <text-overlay-loading inline :show="store.gauges.qusd5.rewards.sfg.userTotalReward.loading">
                      {{ store.gauges.qusd5.rewards.sfg.userTotalReward.cont }} {{ store.gauges.qusd5.rewards.sfg.name }}
                    </text-overlay-loading>
                    <em class="px-3 text-black-15">/</em>
                  </span>
                  <text-overlay-loading class="col-12 col-lg-auto"  inline :show="store.tokens.sfg.price.loading">
                    1 {{ store.tokens.sfg.name }} = {{ store.tokens.sfg.price.cont }} {{ store.tokens.sfg.priceUnit }}
                  </text-overlay-loading>
                </small>
                <text-overlay-loading :show="loadingAction">
                  <b-button variant="danger" @click="onQusd5Harvest">
                    {{ $t('lock.miningClaimConfirm') }}
                  </b-button>
                </text-overlay-loading>
              </div>
            </div>
            <div class="area">
              <h5 class="mb-3 d-flex align-items-center">
                <img :src="getTokenIcon(store.gauges.qusd5.rewards.kun.code)" class="mr-2 icon-w-20 icon token-icon" :class="[store.gauges.qusd5.rewards.kun.code+'-icon']">
                {{ store.gauges.qusd5.rewards.kun.name }}
              </h5>
              <h6 class="mb-0 text-black-65">{{ $t('lock.miningPendingReward') }}</h6>
              <h4 class="mb-1">
                <text-overlay-loading inline :show="store.gauges.qusd5.rewards.kun.userPendingReward.loading">
                  {{ store.gauges.qusd5.rewards.kun.userPendingReward.cont }} {{ store.gauges.qusd5.rewards.kun.name }}
                </text-overlay-loading>
              </h4>
              <div class="d-flex no-gutters align-items-end">
                <small class="col row flex-wrap">
                  <span class="col-12 col-lg-auto">
                    {{ $t('lock.miningPaidReward') }}：
                    <text-overlay-loading inline :show="store.gauges.qusd5.rewards.kun.userPaidReward.loading">
                      {{ store.gauges.qusd5.rewards.kun.userPaidReward.cont }} {{ store.gauges.qusd5.rewards.kun.name }}
                    </text-overlay-loading>
                    <em class="px-3 text-black-15">/</em>
                  </span>
                  <span class="col-12 col-lg-auto">
                    {{ $t('lock.miningTotalReward') }}：
                    <text-overlay-loading inline :show="store.gauges.qusd5.rewards.kun.userTotalReward.loading">
                      {{ store.gauges.qusd5.rewards.kun.userTotalReward.cont }} {{ store.gauges.qusd5.rewards.kun.name }}
                    </text-overlay-loading>
                    <em class="px-3 text-black-15">/</em>
                  </span>
                  <text-overlay-loading class="col-12 col-lg-auto"  inline :show="store.tokens.kun.price.loading">
                    1 {{ store.tokens.kun.name }} = {{ store.tokens.kun.price.cont }} {{ store.tokens.kun.priceUnit }}
                  </text-overlay-loading>
                </small>
                <text-overlay-loading :show="loadingAction">
                  <b-button variant="danger" @click="onQusd5ClaimRewards">
                    {{ $t('lock.miningClaimConfirm') }}
                  </b-button>
                </text-overlay-loading>
              </div>
            </div>
          </b-tab>
        </b-tabs>
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

        depositSliderSelected: 0,
        depositSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        withdrawSliderSelected: 0,
        withdrawSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],

        supportGauges: [
          ''
        ],



        waitingMessage: '',
        waitingMessageTargetId: '',
        dismissSecs: 10,
        dismissCountDown: 0,

        // TODO: 
        pools: {
          stand: ['susdv2', 'dfi'],
          token: ['sfg']
        },

        currentPool: {
          swap: '',
          swap_token: '',
          id: '',
          name: 'susdv2',
          nameCont: 'sUSD',
          /**
           *  @type {number}
           */
          priceDecimal: 2,
          /**
           *  @type {number}
           */
          get notationDecimal () {
            return __store__.notationDecimal
          },
          typeName: 'Liquidity',

          totalSupply: valueModel.create(),

          gauge: '',
          gaugeBalance: valueModel.create(),
          balanceOf: valueModel.create(),
          swap: '',
          swap_token: '',
          type: 0,

          describeTokensCont: 'SFG + CRV + SNX',
          staking: {
            in: -1,
            balance: -1
          },
          deposit: {
            gas: 750000,
            amount: 0
          },
          withdraw: {
            gas: 1000000,
            amount: 0
          },
          mining: {
            relation: [
              'sfg',
              ['crv', 'snx']
            ]
          },
          tokens: {
            sfg: {
              name: 'sfg',
              nameCont: 'SFG',
              rateUsd: -1,
              get priceDecimal () {
                return __store__.tokens.sfg.priceDecimal
              },
              set priceDecimal (val) {
                __store__.tokens.sfg.priceDecimal = val
              },
              pendingReward: valueModel.create(),
              paidReward: valueModel.create(),
              totalReward: valueModel.create(),
              claimConfirm: null
            },
            crv: {
              name: 'crv',
              nameCont: 'CRV',
              rateUsd: -1,
              priceDecimal: 18,
              pendingReward: valueModel.create(),
              paidReward: valueModel.create(),
              totalReward: valueModel.create(),
              claimConfirm: null
            },
            snx: {
              name: 'snx',
              nameCont: 'SNX',
              rateUsd: -1,
              priceDecimal: 18,
              pendingReward: valueModel.create(),
              paidReward: valueModel.create(),
              totalReward: valueModel.create(),
              claimConfirm: null
            }
          }
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

          depositAmountInput: {
            get () {
              const { currentPool: { deposit }  } = this

              return deposit.amount || ''
            },
            set (val) {
              const { currentPool: { deposit }  } = this

              this.depositSliderSelected = 0
              deposit.amount = val
            }
          },

          withdrawAmountInput: {
            get () {
              const { currentPool: { withdraw }  } = this

              return withdraw.amount || ''
            },
            set (val) {
              const { currentPool: { withdraw }  } = this

              this.withdrawSliderSelected = 0
              withdraw.amount = val
            }
          },

          depositSliderSelectedRadio: {
            get () {
              return this.depositSliderSelected
            },
            set (val) {
              const { currentPool: { deposit, priceDecimal, balanceOf } } = this

              if (val === 0) return false

              deposit.amount = +balanceOf.handled > 0
                ? floor(BN(val).times(balanceOf.handled).toString(), priceDecimal)
                : 0
              this.depositSliderSelected = val
            }
          },

          withdrawSliderSelectedRadio: {
            get () {
              return this.withdrawSliderSelected
            },
            set (val) {
              const { currentPool: { withdraw, priceDecimal, gaugeBalance } } = this

              if (val === 0) return false

              withdraw.amount = +gaugeBalance.handled > 0
                ? floor(BN(val).times(gaugeBalance.handled).toString(), priceDecimal)
                : 0
              this.withdrawSliderSelected = val
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
          // Set currentPool confirm
          this.currentPool.tokens.sfg.claimConfirm = this.claim
          // FIXME: 
          this.currentPool.tokens.crv.claimConfirm = this.claimRewards
          this.currentPool.tokens.snx.claimConfirm = this.claimRewards
        },
        watch: {
          loadingAction (val) {
            console.log('watch ---- ', val)
          },
          // depositAmount(val) {
          //   // let depositVal = (val * 100 / (this.gauge.balance / 1e18)) || 0
          //   // this.depositSlider = (Math.min(depositVal, 100)).toFixed(0)
          // },

          // withdrawAmount(val) {
          //   // let withdrawVal = (val * 100 / (this.gauge.gaugeBalance / 1e18)) || 0
          //   // this.withdrawSlider = (Math.min(withdrawVal, 100)).toFixed(0)
          // },
        },
        methods: {
          // FIXME:
          async onQusd5Stake () {
            const { gauges, tokens } = store
            // this.alert('notice.approveOperationWarning', 'stake')

            if (!await tokens.qusd5.hasValidAmount(gauges.qusd5.mortgages.qusd5.userStake.revised)) return false

            if (await tokens.qusd5.hasApprove(gauges.qusd5.mortgages.qusd5.userStake.revised, currentContract.default_account, gauges.qusd5.address)) {
              gauges.qusd5.onStake(currentContract.default_account, this.inf_approval)
            } else {
              tokens.qusd5.onApproveAmount(gauges.qusd5.mortgages.qusd5.userStake.revised, currentContract.default_account, gauges.qusd5.address, this.inf_approval)
            }
          },
          async onQusd5Redemption () {
            store.gauges.qusd5.onRedemption(currentContract.default_account, this.inf_approval)
          },
          async onQusd5Harvest () {
            store.gauges.qusd5.onHarvest(currentContract.default_account)
          },
          async onQusd5ClaimRewards () {
            store.gauges.qusd5.onClaimRewards(currentContract.default_account)
          },

          async mounted() {
            this.currentPool.gauge = process.env.VUE_APP_PSS_GAUGE

            await gaugeStore.getState()

            this.loadingAction = false

            this.pools = gaugeStore.state.pools
            this.mypools = gaugeStore.state.mypools
            this.claimFromGauges = this.myGauges

            let btcPrice = await getBTCPrice()

            let total = this.mypools.reduce((a,b,i) => {
              let balance = +b.gaugeBalance
              if(['ren','sbtc'].includes(this.mypools[i].name))
                balance *= btcPrice
              return +a + balance
            }, 0)

            let piedata = this.mypools.map(pool => {
              let balance = pool.gaugeBalance
              if(['ren','sbtc'].includes(pool.name))
                balance = pool.gaugeBalance * btcPrice
              return {
                name: pool.name,
                y: total == 0 ? 0 : balance / total
              }
            })
            piedata = piedata.filter(pool => pool.y > 0)

            let gaugeSum = Object.values(gaugeStore.state.pools).reduce((a,b) => +a + +b.gauge_relative_weight, 0)
            let piegauges = Object.values(gaugeStore.state.pools).map(v => ({ name: v.name, y: v.gauge_relative_weight / gaugeSum}))

            let highest = piegauges.map(data=>data.y).indexOf(Math.max(...piegauges.map(data => data.y)))
            piegauges[highest].sliced = true;
            piegauges[highest].selected = true;

            // susdv2
            store.tokens.susdv2LpToken.getBalanceOf(this.currentPool.balanceOf, currentContract.default_account)

            const { crv, snx, sfg } = this.currentPool.tokens

            // qusd5
            store.gauges.qusd5.rewards.sfg.weighting.handled = 0.1

            store.gauges.qusd5.getAPY(
              store.tokens.sfg.getPrice(),
              store.tokens.sfg.getDailyYield(),
              qusd5.getTotalStaking(qusd5.mortgages.qusd5.totalStaking),
              store.tokens.qusd5.getPrice(),
              store.tokens.kun.getPrice(),
            )

            store.tokens.qusd5.getBalanceOf(qusd5.mortgages.qusd5.userBalanceOf, currentContract.default_account)

            qusd5.getBalanceOf(qusd5.mortgages.qusd5.userStaking, currentContract.default_account)

            qusd5.getUserTotalReward_SFG(
              qusd5.rewards.sfg.userTotalReward,
              qusd5.getUserPendingReward_SFG(qusd5.rewards.sfg.userPendingReward, currentContract.default_account),
              qusd5.getUserPaidReward_SFG(qusd5.rewards.sfg.userPaidReward, currentContract.default_account)
            )

            qusd5.getUserTotalReward_KUN(
              qusd5.rewards.kun.userTotalReward,
              qusd5.getUserPendingReward_KUN(qusd5.rewards.kun.userPendingReward, currentContract.default_account),
              qusd5.getUserPaidReward_KUN(qusd5.rewards.kun.userPaidReward, currentContract.default_account)
            )
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

          async deposit () {
            let deposit = BN(this.currentPool.deposit.amount).times(1e18)

            await common.approveAmount(
              store.tokens.susdv2LpToken.contract,
              deposit,
              currentContract.default_account,
              this.currentPool.gauge,
              this.inf_approval)

            var { dismiss } = notifyNotification(`Please confirm depositing into ${this.currentPool.name} gauge`)

            await this.gaugeContract.methods.deposit(deposit.toFixed(0,1)).send({
              from: currentContract.default_account,
              // gasPrice: this.gasPriceWei,
              // gas: this.currentPool.deposit.gas,
              gas: 1200000
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
          },

          async withdraw () {
            this.alert('notice.syntetixAnomalous', 'withdraw')

            let withdraw = BN(this.currentPool.withdraw.amount).times(1e18)
            let balance = BN(await this.gaugeContract.methods.balanceOf(currentContract.default_account).call())

            console.log('withdraw', withdraw, 'balance', balance)

            if(withdraw.gt(balance))
              withdraw = balance

            let gas = this.currentPool.deposit.gas
            let withdrawMethod = this.gaugeContract.methods.withdraw(withdraw.toFixed(0,1))

            try {
              // update
              gas = await withdrawMethod.estimateGas()
            }
            catch(err) { }

            var { dismiss } = notifyNotification(`Please confirm withdrawing from ${this.currentPool.name} gauge`)

            await withdrawMethod.send({
              from: currentContract.default_account,
              // gasPrice: this.gasPriceWei,
              // gas: gas * 1.5 | 0,
              gas: 1200000
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
          },

          async claim () {
            this.alert('notice.syntetixAnomalous' , 'claim')

            const mint = await gaugeStore.state.minter.methods.mint(this.currentPool.gauge)
            // let gas = await mint.estimateGas()

            var { dismiss } = notifyNotification(`Please confirm claiming ${this.currentPool.tokens.sfg.name} from ${this.currentPool.name} gauge`)

            await mint.send({
              from: currentContract.default_account,
              // gasPrice: this.gasPriceWei,
              // gas: gas * 1.5 | 0,
              gas: 1200000
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
          },

          async claimRewards () {
            this.alert('notice.syntetixAnomalous', 'claimRewards')

            // let gas = await this.gaugeContract.methods.claim_rewards(currentContract.default_account).estimateGas()

            var { dismiss } = notifyNotification(`Please confirm claiming ${this.currentPool.tokens.crv.name + ' ' + this.currentPool.tokens.snx.name}`)

            await this.gaugeContract.methods.claim_rewards(currentContract.default_account).send({
              from: currentContract.default_account,
              // gasPrice: this.gasPriceWei,
              // gas: gas * 1.5 | 0,
              gas: 1200000
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
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
