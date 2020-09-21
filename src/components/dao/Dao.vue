<template>
	<div>
    <div class="total-bg">
      <b-container class="d-flex py-4 total-cont align-items-center">
        <img class="logo_lg mr-4" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
        <h3 class="mb-0">{{ $t('global.sFinance') }}<br/>{{ $t('global.dao') }}</h3>
      </b-container>
    </div>

    <b-container>
      <root-sub />
      <h4 class="mt-4 mb-2">
        {{ $t('dao.title', [currentPool.nameCont]) }}
        <small class="pl-3">{{ $t('dao.describe', [currentPool.name, currentPool.describeTokensCont]) }}</small>
      </h4>
      <div class="box mb-4 px-4 py-3">
        <div class="row pb-3 mb-3 line-bottom no-gutters">
          <span class="col">
            <h6 class="mb-0 text-black-65">{{ $t('dao.totalStaking') }}</h6>
            <h4 class="mb-0 d-flex">
              <text-overlay-loading inline :show="currentPool.totalSupply.loading">
                {{ currentPool.totalSupply.cont }}
                <h6 class="inline-block text-black-65 mb-0">{{ currentPool.name }} LP tokens</h6>
              </text-overlay-loading>
            </h4>
          </span>
          <span class="col">
            <h6 class="mb-0 text-black-65">{{ $t('dao.myStaking') }}</h6>
            <h4 class="mb-0 d-flex">
              <text-overlay-loading inline :show="currentPool.gaugeBalance.loading">
                {{ currentPool.gaugeBalance.cont }}
                <h6 class="inline-block text-black-65 mb-0">{{ currentPool.name }} LP tokens</h6>
              </text-overlay-loading>
            </h4>
          </span>
          <span class="col">
            <h6 class="mb-0 text-black-65">{{ $t('dao.virtualPrice') }}</h6>
            <h4 class="mb-0 d-flex">
              <text-overlay-loading inline :show="loadingAction">
                1
                <h6 class="inline-block text-black-65 mb-0">{{ currentPool.name }} LP tokens = </h6>
                {{ (1 * virtual_price).toFixed(6) }}
                <h6 class="inline-block text-black-65 mb-0">USD</h6>
              </text-overlay-loading>
            </h4>
          </span>
        </div>

        <b-tabs pills nav-class="tabs-nav" class="mt-1">
          <b-tab :title="$t('dao.staking')" class="pt-3" active>
            <label class="text-black-65">{{ $t('dao.staking') }}</label>
            <div class="d-flex">
              <b-form-input class="col mr-4" v-model="depositAmountInput" :placeholder="$t('dao.stakingAmountPlaceholder')"></b-form-input>
              <b-form-radio-group
                class
                v-model="depositSliderSelectedRadio"
                :options="depositSliderOptions"
                buttons
                button-variant="outline-secondary"
              ></b-form-radio-group>
            </div>
            <small class="d-flex mb-3 align-items-center">
              {{ $t('dao.stakingBalance') }}： {{ currentPool.balance }} {{ currentPool.name }} LP tokens
              <b-button class="text-blue-1 ml-2" to="/susdv2/liquidity/" size="xsm" variant="light">{{ $t('dao.stakingConfirmTip') }}</b-button>
            </small>
            <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('dao.infiniteApproval') }}</b-form-checkbox>
            <div class="d-flex align-items-end mt-5 float-right">
              <text-overlay-loading :show="loadingAction">
                <b-button size="lg" variant="danger" @click=deposit>
                  {{ $t('dao.stakingConfirm') }}
                </b-button>
              </text-overlay-loading>
            </div>
          </b-tab>
          <b-tab :title="$t('dao.redemption')" class="pt-3">
            <label class="text-black-65">{{ $t('dao.redemption') }}</label>
            <div class="d-flex">
              <b-form-input class="col mr-4" v-model="withdrawAmountInput" :placeholder="$t('dao.redemptionAmountPlaceholder')"></b-form-input>
              <b-form-radio-group
                class
                v-model="withdrawSliderSelectedRadio"
                :options="withdrawSliderOptions"
                buttons
                button-variant="outline-secondary"
              ></b-form-radio-group>
            </div>
            <small class="d-flex">
              {{ $t('dao.redemptionBalance') }}：
              <text-overlay-loading :show="loadingAction || currentPool.gaugeBalance.loading">{{ currentPool.gaugeBalance.cont }} {{ currentPool.name }} LP tokens</text-overlay-loading>
            </small>
            <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('dao.infiniteApproval') }}</b-form-checkbox>
            <div class="d-flex align-items-end mt-5 float-right">
              <text-overlay-loading :show="loadingAction">
                <b-button size="lg" variant="danger" @click=withdraw>
                  {{ $t('dao.redemptionConfirm') }}
                </b-button>
              </text-overlay-loading>
            </div>
          </b-tab>
          <b-tab :title="$t('dao.miningReward')" class="pt-3">
            <div class="area" v-for="(token, idx) in currentPool.mining.relation" :key="'token-'+idx">
              <template v-if="Array.isArray(token)">
                <div class="row">
                  <div class="col" v-for="childToken in token" :key="'token-'+currentPool.tokens[childToken].name">
                    <h5 class="mb-3 d-flex align-items-center">
                      <img :src="getTokenIcon(currentPool.tokens[childToken].name)" class="mr-2 icon-w-20 icon token-icon" :class="[currentPool.tokens[childToken].name+'-icon']">
                      {{ currentPool.tokens[childToken].nameCont }}
                    </h5>
                    <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                    <h4 class="mb-1">
                      <text-overlay-loading inline :show="loadingAction || currentPool.tokens[childToken].pendingRewardLoading">
                        {{ currentPool.tokens[childToken].pendingRewardCont }} {{ currentPool.tokens[childToken].nameCont }}
                      </text-overlay-loading>
                    </h4>
                    <div class="d-flex no-gutters align-items-end mt-3">
                      <small class="col">
                        {{ $t('dao.miningPaidReward') }}：
                        <text-overlay-loading inline :show="currentPool.tokens[childToken].paidReward.loading">
                          {{ currentPool.tokens[childToken].paidReward.cont }} {{ currentPool.tokens[childToken].nameCont }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                        {{ $t('dao.miningTotalReward') }}：
                        <!-- <text-overlay-loading inline :show="currentPool.tokens[token].totalReward.loading">
                          {{ currentPool.tokens[childToken].totalReward.cont }} {{ currentPool.tokens[childToken].nameCont }}
                        </text-overlay-loading> -->
                        <!-- <em class="px-3 text-black-15">/</em>
                        <text-overlay-loading inline :show="loadingAction">
                          1 {{ currentPool.tokens[childToken].nameCont }} = {{ currentPool.tokens[childToken].rateUsd }} USD
                        </text-overlay-loading> -->
                      </small>
                    </div>
                  </div>
                </div>
                <div class="d-flex mt-4 justify-content-end">
                  <text-overlay-loading :show="loadingAction">
                    <b-button variant="danger" @click=claimRewards>
                      {{ $t('dao.miningClaimConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </template>
              <template v-else>
                <h5 class="mb-3 d-flex align-items-center">
                  <img :src="getTokenIcon(currentPool.tokens[token].name)" class="mr-2 icon-w-20 icon token-icon" :class="[currentPool.tokens[token].name+'-icon']">
                  {{ currentPool.tokens[token].nameCont }}
                </h5>
                <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                <h4 class="mb-1">
                  <text-overlay-loading inline :show="currentPool.tokens[token].pendingReward.loading">
                    {{ currentPool.tokens[token].pendingReward.cont }} {{ currentPool.tokens[token].nameCont }}
                  </text-overlay-loading>
                </h4>
                <div class="d-flex no-gutters align-items-end">
                  <small class="col">
                    {{ $t('dao.miningPaidReward') }}：
                    <text-overlay-loading inline :show="currentPool.tokens[token].paidReward.loading">
                      {{ currentPool.tokens[token].paidReward.cont }} {{ currentPool.tokens[token].nameCont }}
                    </text-overlay-loading>
                    <em class="px-3 text-black-15">/</em>
                    {{ $t('dao.miningTotalReward') }}：
                    <text-overlay-loading inline :show="currentPool.tokens[token].totalReward.loading">
                      {{ currentPool.tokens[token].totalReward.cont }} {{ currentPool.tokens[token].nameCont }}
                    </text-overlay-loading>
                    <!-- <em class="px-3 text-black-15">/</em>
                    <text-overlay-loading inline :show="loadingAction">
                      1 {{ currentPool.tokens[token].nameCont }} = {{ currentPool.tokens[token].rateUsd }} USD
                    </text-overlay-loading> -->
                  </small>
                  <text-overlay-loading :show="loadingAction">
                    <b-button variant="danger" @click="currentPool.tokens[token].claimConfirm">
                      {{ $t('dao.miningClaimConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </template>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </b-container>


    <fieldset v-if=false>
      loading: {{ loadingAction }}
			<legend>
				_{ gauge.name }} _{ gauge.typeName }} gauge
				<b>CRV APY:</b> _{ CRVAPY.toFixed(2) }}%
			</legend>
			<!-- <div class='pool-info'>
				<button @click='applyBoost' class='applyBoost' v-show='canApplyBoost && claimableTokens == 0'>Apply boost</button>
				<span class='greentext' v-show='canApplyBoost && claimableTokens > 0'>You can apply boost by claiming CRV</span>
				<div class='gaugeRelativeWeight'>
					Gauge relative weight: {{ gaugeRelativeWeight.toFixed(2) }}%
				</div>
				<div class='mintedCRVFrom'>
					Minted CRV from this gauge: {{ mintedFormat }}
				</div>
				<div v-show="['susdv2', 'sbtc'].includes(gauge.name) && claimedRewards > 0" class='claimedRewards'>
					Claimed 
					<span v-show="gauge.name == 'susdv2'">SNX</span>
					<span v-show="gauge.name == 'sbtc'">BPT</span>: {{ claimedRewardsFormat }}
				</div>
				<div class='boost' v-show='boost !== null && !isNaN(boost)'>
					Boost: {{ boost && boost.toFixed(4) }}
				</div>
				<div class='boost' v-show='currentBoost !== null && !isNaN(currentBoost)'>
					Current boost: {{ currentBoost && currentBoost.toFixed(4) }}
				</div>
			</div> -->
			<div>
				<div class='flex-break'></div>
				<!-- <div class='simple-error' v-show="['susdv2', 'sbtc'].includes(gauge.name) && synthsUnavailable">
					Synthetix are upgrading their contract now and claiming SNX is not available
					{{ synthsUnavailable }}
				</div> -->
				<div class='pool'>
          LPT deposit:<br/>
					<div class='poolBalance'>Balance: <span class='hoverpointer'>_{ poolBalanceFormat }}</span> _{ gauge.name }} LP token</div>
					<div class='input'>
						<label for='deposit'>Amount:</label>
						<!-- <input id='deposit' type='text' v-model='depositAmount'> -->
					</div>
					<div class='range' v-show=false>
						<div class='label'>
							<label for='zoom'>{{ depositSlider }}%</label>
						</div>
						<div>
							<input type='range' min='0' max='100' step='1' id='zoom' :value='depositSlider' @input='onDepositSlider'/>
						</div>
					</div>
					<div>
						<p>
              <input id="'inf-approval-susdv2" type="checkbox" name="inf-approval" v-model='inf_approval'>
              <label for="'inf-approval-susdv2" class='inf-approval-label'>Infinite approval </label>
            </p>
						<div>
							<button @click='deposit'>
								Deposit and stake
							</button>
						</div>
					</div>
				</div>
        <div class='flex-break'></div>
        LPT withdraw:<br/>

				<div class='gauge'>
					<div class='gaugeBalance'>Balance: <span class='hoverpointer'>{{ currentPool.gaugeBalance.cont }}</span> in gauge</div>
					<div class='input'>
						<label for='withdraw'>Amount:</label>
						<input id='withdraw' type='text' v-model='currentPool.withdraw.amount'>
					</div>
					<div class='range' v-show=false>
						<div class='label'>
							<label for='zoom'>{{ withdrawSlider }}%</label>
						</div>
						<div>
							<input type='range' min='0' max='100' step='1' id='zoom' :value='withdrawSlider' @input='onWithdrawSlider'/>
						</div>
					</div>
					<button @click='withdraw'>Withdraw</button>
				</div>
				<div class='flex-break'></div>

        <!-- SFG claimableTokens: {{ currentPool.tokens.sfg.mining.pendingRewardTether }} -->
        <button @click='claim' class='claimtokens'>Claim </button>
        <div class='flex-break'></div>

        CRV claimableReward: {{ claimableReward }}
        <button @click='claimRewards' class='claimrewards'>
          Claim {{ claimableRewardFormat }}
          <span>SNX</span>
        </button>
			</div>
		</fieldset>
	</div>
</template>

<script>
	  import Vue from 'vue'
    import { notify, notifyHandler, notifyNotification } from '../../init'
    import * as common from '../../utils/common.js'
    import { getters, contract as currentContract, gas as contractGas } from '../../contract'
    import allabis, { ERC20_abi } from '../../allabis'
    const compound = allabis.compound
    import * as helpers from '../../utils/helpers'

    import * as gasPriceStore from '../common/gasPriceStore'
    import GasPrice from '../common/GasPrice.vue'
    import RootSub from '../root/RootSub.vue'
    import DaoLiquidityGaugereAbi_susdv2 from './abi/susdv2'

    import * as errorStore from '../common/errorStore'

    import TextOverlayLoading from '../../components/common/TextOverlayLoading.vue'

    import BN from 'bignumber.js'

    import Slippage from '../common/Slippage.vue'
    import * as gaugeStore from './gaugeStore'

    import { getBTCPrice } from '../common/priceStore'

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

    const valueModelStore = {
      create () {
        return {
          loading: true,
          tether: 0,
          handled: 0,
          cont: 0,
        }
      }
    }

    const valueModel = {
      create (name = '') {
        const __store__ = valueModelStore.create()
        // TODO:
        const keys = {
          loading: name + 'loading',
          tether: name + 'tether',
          handled: name + 'handled',
          cont: name + 'cont',
        }

        return {
          // TODO:
          priceDecimal: 4,

          get [keys.loading] () {
            return __store__.loading
          },
          set [keys.loading] (val) {
            __store__.loading = val
          },

          get [keys.tether] () {
            return __store__.tether
          },
          set [keys.tether] (val) {
            const result = __store__.tether = val

            this[keys.loading] &&
              (this[keys.loading] = false)

            this[keys.handled] = result / 1e18
          },

          get [keys.handled] () {
            return __store__.handled
          },
          set [keys.handled] (val) {
            // TODO:
            const { priceDecimal } = this
            const result = __store__.handled = val

            this[keys.cont] = helpers.formatNumber(result, priceDecimal)
          },

          [keys.cont]: '-',
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

          balance: 0,
          balanceCont: 0,
          gauge: '',

          gaugeBalance: valueModel.create(),
          swap: '',
          swap_token: '',
          type: 0,

          describeTokensCont: 'SFG + CRV + SNX',
          staking: {
            in: -1,
            balance: -1
          },
          deposit: {
            gas: 750000
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

        depositAmount: 0,
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
          virtual_price() {
            return currentContract.virtual_price
          },
          gasPrice() {
            console.log('gasPrice', gasPriceStore.state.gasPrice)
            return gasPriceStore.state.gasPrice
          },
          gasPriceWei() {
            return gasPriceStore.gasPriceWei
          },
          claimableRewardFormat() {
            return this.toFixed(this.claimableReward / 1e18)
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
              const { currentPool: { deposit, priceDecimal, gaugeBalance } } = this
  // FIXME: 
              // deposit.amount = BN(val).times(gaugeBalance.handled).toFixed(priceDecimal)
              this.depositSliderSelected = val
            }
          },

          withdrawSliderSelectedRadio: {
            get () {
              return this.withdrawSliderSelected
            },
            set (val) {
              const { currentPool: { withdraw, priceDecimal, gaugeBalance } } = this

              withdraw.amount = BN(val).times(gaugeBalance.handled).toFixed(priceDecimal)
              this.withdrawSliderSelected = val
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
          async mounted() {
            // Set currentPool confirm
            this.currentPool.tokens.sfg.claimConfirm = this.claim
            // FIXME: 
            // this.currentPool.tokens.crv.claimConfirm = this.claimRewards
            // this.currentPool.tokens.snx.claimConfirm = this.claimRewards

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


          this.gaugeContract = new currentContract.web3.eth.Contract(DaoLiquidityGaugereAbi_susdv2, this.currentPool.gauge)

          // balanceOf
          this.currentPool.gaugeBalance.tether = await this.gaugeContract.methods.balanceOf(currentContract.default_account).call()

          // claimable_tokens
          this.currentPool.tokens.sfg.pendingReward.tether = await this.gaugeContract.methods.claimable_tokens(currentContract.default_account).call()

          // integrate_fraction ???
          this.currentPool.tokens.sfg.paidReward.tether = await this.gaugeContract.methods.integrate_fraction(currentContract.default_account).call()

          this.currentPool.tokens.sfg.totalReward.tether = BN(this.currentPool.tokens.sfg.pendingReward.tether).plus(this.currentPool.tokens.sfg.paidReward.tether).toString()

          try {
            // claimable_reward
            this.currentPool.tokens.crv.pendingReward.tether = await this.gaugeContract.methods.claimable_reward(currentContract.default_account).call()
          } catch (e) { console.log(e) }

          // claimable_reward2
          this.currentPool.tokens.snx.pendingReward.tether = await this.gaugeContract.methods.claimable_reward2(currentContract.default_account).call()

          // claimed_rewards_for
          this.currentPool.tokens.crv.paidReward.tether = await this.gaugeContract.methods.claimed_rewards_for(currentContract.default_account).call()

          // totalSupply
          this.currentPool.totalSupply.tether = await this.gaugeContract.methods.totalSupply().call()

          // this.gaugeContract.mounted


console.log('---')
console.log(this.gaugeContract.methods)
console.log('default_account', currentContract.default_account)




          },
        	getTokenIcon(token) {
            return helpers.getTokenIcon(token, false, '')
          },
          toFixed(num) {
            if(num == '' || num == undefined || +num == 0) return '0.00'
            if(!BN.isBigNumber(num)) num = +num
            return num.toFixed(2)
          },
          onDepositSlider(event) {
            let val = event.target.value
            this.depositSlider = val
            // FIXME:
            // this.depositAmount = this.toFixed((this.gauge.balance / 1e18) * val/100)
          },
          onWithdrawSlider(event) {
            let val = event.target.value
            this.withdrawSlider = val
            // FIXME:
            // this.withdrawAmount = this.toFixed((this.gauge.gaugeBalance / 1e18) * val/100)
          },

          async deposit () {
            let deposit = BN(this.depositAmount).times(1e18)
            const gauge_swap_token = process.env.VUE_APP_LPT
            const swap_token = new currentContract.web3.eth.Contract(ERC20_abi, gauge_swap_token)

            await common.approveAmount(swap_token, deposit, currentContract.default_account, this.currentPool.gauge, this.inf_approval)

            var { dismiss } = notifyNotification(`Please confirm depositing into ${this.currentPool.name} gauge`)

            await this.gaugeContract.methods.deposit(deposit.toFixed(0,1)).send({
              from: currentContract.default_account,
              gasPrice: this.gasPriceWei,
              gas: this.currentPool.deposit.gas,
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })

          },

          async withdraw () {
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
              gasPrice: this.gasPriceWei,
              gas: gas * 1.5 | 0,
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
          },

          async claim () {
            const mint = await gaugeStore.state.minter.methods.mint(this.currentPool.gauge)

            let gas = await mint.estimateGas()

            var { dismiss } = notifyNotification(`Please confirm claiming ${this.currentPool.tokens.sfg.name} from ${this.currentPool.name} gauge`)

            await mint.send({
              from: currentContract.default_account,
              gasPrice: this.gasPriceWei,
              // gas: gas * 1.5 | 0,
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
          },

          async claimRewards () {
            let gas = await this.gaugeContract.methods.claim_rewards(currentContract.default_account).estimateGas()

            var { dismiss } = notifyNotification(`Please confirm claiming ${this.currentPool.tokens.crv.name + ' ' + this.currentPool.tokens.snx.name}`)

            await this.gaugeContract.methods.claim_rewards(currentContract.default_account).send({
              from: currentContract.default_account,
              gasPrice: this.gasPriceWei,
              // gas: gas * 1.2 | 0,
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
