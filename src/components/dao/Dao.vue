<template>
	<div>
    <div class="total-bg">
      <b-container class="d-flex py-4 total-cont align-items-center">
        <img class="logo_lg mr-4" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
        <h3 class="mb-0">{{ $t('global.sFinance') }}<br/>{{ $t('global.dao') }}</h3>
      </b-container>
    </div>

    <b-container>
      <h4 class="mt-4 mb-2">
        {{ $t('dao.title', [currentPool.nameCont]) }}
        <small class="pl-3">{{ $t('dao.describe', [currentPool.name, currentPool.describeTokensCont]) }}</small>
      </h4>
      <div class="box mb-4 px-4 py-3">
        <b-tabs pills nav-class="tabs-nav" class="mt-1">
          <b-tab :title="$t('dao.staking')" class="pt-3" active>
            <small class="d-flex mb-3">{{ $t('dao.assetInStaking') }}：{{ gaugeBalance }} {{ currentPool.name }} LP tokens</small>
            <label class="text-black-65">{{ $t('dao.staking') }}</label>
            <template v-show=true>
              Gas: 
              <input id='deposit' type='text' v-model='deposit_gas'>
            </template>
            <div class="d-flex">
              <b-form-input class="col mr-4" v-model="depositAmountInput" :placeholder="$t('dao.stakingAmountPlaceholder')"></b-form-input>
              <b-form-radio-group
                class
                v-model="depositSliderSelected"
                :options="depositSliderOptions"
                buttons
                button-variant="outline-secondary"
              ></b-form-radio-group>
            </div>
            <small>{{ $t('dao.stakingBalance') }}： {{ currentPool.balance }} {{ currentPool.name }} LP tokens</small>
            <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('dao.infiniteApproval') }}</b-form-checkbox>
            <div class="d-flex align-items-end mt-5 float-right">
              <h6 class="text-blue-1 mb-0 mr-4">{{ $t('dao.stakingConfirmTip') }}</h6>
              <text-overlay-loading :show="loadingAction">
                <b-button size="lg" variant="danger" @click=deposit>
                  {{ $t('dao.stakingConfirm') }}
                </b-button>
              </text-overlay-loading>
            </div>
          </b-tab>
          <b-tab :title="$t('dao.redemption')" class="pt-3">
            <label class="text-black-65">{{ $t('dao.redemption') }}</label>
            <template v-show=true>
              Gas:
              <input id='deposit' type='text' v-model='gas'>
            </template>
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
            <small>{{ $t('dao.redemptionBalance') }}：{{ gaugeBalance }} {{ currentPool.name }} LP tokens</small>
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
            <div class="area" v-for="token in currentPool.tokens" :key="'token-'+token.name">
              <template v-if="token.child">
                <div class="row">
                  <div class="col" v-for="childToken in token.child" :key="'token-'+childToken.name">
                    <h5 class="mb-3 d-flex align-items-center">
                      <img :src="getTokenIcon(childToken.name)" class="mr-2 icon-w-20 icon token-icon" :class="[childToken.name+'-icon']">
                      {{ childToken.nameCont }}
                    </h5>
                    <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                    <h4 class="mb-1">{{ childToken.mining.pendingReward }} {{ childToken.nameCont }}</h4>
                    <div class="d-flex no-gutters align-items-end mt-3">
                      <small class="col">
                        {{ $t('dao.miningPaidReward') }}：{{ childToken.mining.paidReward }} {{ childToken.nameCont }}
                        <em class="px-3 text-black-15">/</em>
                        {{ $t('dao.miningTotalReward') }}：{{ childToken.mining.totalReward }} {{ childToken.nameCont }}
                        <em class="px-3 text-black-15">/</em>
                        1 {{ childToken.nameCont }} = {{ childToken.rateUsd }} USD
                      </small>
                    </div>
                  </div>
                </div>
                <div class="d-flex mt-4 justify-content-end">
                  <text-overlay-loading :show="loadingAction">
                    <b-button variant="danger" @click=token.claimConfirm>
                      {{ $t('dao.miningClaimConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </template>
              <template v-else>
                <h5 class="mb-3 d-flex align-items-center">
                  <img :src="getTokenIcon(token.name)" class="mr-2 icon-w-20 icon token-icon" :class="[token.name+'-icon']">
                  {{ token.nameCont }}
                </h5>
                <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                <h4 class="mb-1">{{ token.mining.pendingReward }} {{ token.nameCont }}</h4>
                <div class="d-flex no-gutters align-items-end">
                  <small class="col">
                    {{ $t('dao.miningPaidReward') }}：{{ token.mining.paidReward }} {{ token.nameCont }}
                    <em class="px-3 text-black-15">/</em>
                    {{ $t('dao.miningTotalReward') }}：{{ token.mining.totalReward }} {{ token.nameCont }}
                    <em class="px-3 text-black-15">/</em>
                    1 {{ token.nameCont }} = {{ token.rateUsd }} USD
                  </small>
                  <text-overlay-loading :show="loadingAction">
                    <b-button variant="danger" @click=token.mining.claimConfirm>
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


    <fieldset>
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
						<input id='deposit' type='text' v-model='depositAmount'>
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
					<div class='gaugeBalance'>Balance: <span class='hoverpointer'>{{ gaugeBalance }}</span> in gauge</div>
					<div class='input'>
						<label for='withdraw'>Amount:</label>
						<input id='withdraw' type='text' v-model='withdrawAmount'>
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

        SFG claimableTokens: {{ claimableTokens }}
        <button @click='claim1' class='claimtokens'>Claim _{ claimableTokensFormat }} CRV</button>
        <div class='flex-break'></div>

        CRV claimableReward: {{ claimableReward }}
        <button @click='claimRewards' v-show='claimableReward > 0' class='claimrewards'>
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

    import * as errorStore from '../common/errorStore'

    import TextOverlayLoading from '../../components/common/TextOverlayLoading'

    import BN from 'bignumber.js'

    import Slippage from '../common/Slippage.vue'
    import * as gaugeStore from './gaugeStore'

    export default {
    	components: {
        Slippage,
        GasPrice,
        TextOverlayLoading,
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
          priceDecimal: 2,
          typeName: 'Liquidity',
          describeTokensCont: 'SFG + CRV + SNX',
          staking: {
            in: -1,
            balance: -1
          },
          tokens: {
            sfg: {
              name: 'sfg',
              nameCont: 'SFG',
              rateUsd: -1,
              priceDecimal: 18,
              mining: {
                totalReward: -1,
                pendingReward: -1,
                paidReward: -1,
                claimConfirm: () => {
                  
                }
              }
            },
            crv_snx: {
              child: {
                crv: {
                  name: 'crv',
                  nameCont: 'CRV',
                  rateUsd: -1,
                  priceDecimal: 18,
                  mining: {
                    totalReward: -1,
                    pendingReward: -1,
                    paidReward: -1
                  }
                },
                snx: {
                  name: 'snx',
                  nameCont: 'SNX',
                  rateUsd: -1,
                  priceDecimal: 18,
                  mining: {
                    totalReward: -1,
                    pendingReward: -1,
                    paidReward: -1,
                  }
                }
              },
              claimConfirm: () => {
              }
            }
          }
        },
        pools: [],
        mypools: [],
        // FIXME: 
        loadingAction: false,

        claimFromGauges: [],


    		deposit_gas: 500000,
        gas: 1000000,
        inf_approval: true,

        depositAmount: 0,
        withdrawAmount: 0,
        gaugeContract: null,
        depositSlider: 100,
        withdrawSlider: 100,

        claimableTokens: 0,
        // FIXME:
        claimableReward: 0,
        gaugeContract: null,
        gauge: '',
        name: 'susdv2',

        gaugeBalance: 0,

        // FIXME: test
        gasPriceStore: {
          fetched: false,
          gasPriceInfo: {},
          gasPrice: 20,
          gasPriceWei: BN(2).times(1e9).toFixed(0,1),
          gasPriceInterval: null,
        },

        // thegauge: {
        //   balance: 0,
        //   gauge: '0xd13BBE09C4532CdbBC42bf9205CaED3587F25789',
        //   gaugeBalance: 0,
        //   name: 'curvepool1',
        //   swap: '0xbbe6874b45eFd4E44396F6aE619663067424b218',
        //   swap_token: '0x1796E153ce80fCf2015E19035DcecFb005bc017D',
        //   type: 0,
        //   typeName: 'Liquidity'
        // }
    	}),
        computed: {
          ...getters,
          // FIXME: 
          gasPrice() {
            console.log('gasPrice', gasPriceStore.state.gasPrice)
            // return this.gasPriceStore.gasPrice
            return gasPriceStore.state.gasPrice
          },
          gasPriceWei() {
            console.log('gasPriceWei', gasPriceStore.gasPriceWei)
            // return this.gasPriceStore.gasPriceWei
            return gasPriceStore.gasPriceWei
          },
          claimableTokensFormat() {
            return (this.claimableTokens / 1e18).toFixed(2)
          },
          claimableRewardFormat() {
            return this.toFixed(this.claimableReward / 1e18)
          },

          depositAmountInput: {
            get () {
              const { depositAmount } = this

              return depositAmount === 0 ? '' : this.depositAmount
            },
            set (val) {
              this.depositSliderSelected = 0
              // FIXME: 做格式校验
              this.depositAmount = val
            }
          },

          withdrawAmountInput: {
            get () {
              const { withdrawAmount } = this

              return withdrawAmount === 0 ? '' : this.withdrawAmount
            },
            set (val) {
              this.withdrawSliderSelected = 0
              // FIXME: 做格式校验
              this.withdrawAmount = val
            }
          },

          withdrawSliderSelectedRadio: {
            get () {
              return this.withdrawSliderSelected
            },
            set (val) {
              const { gaugeBalance, currentPool: { priceDecimal } } = this

              console.log(val)
              this.withdrawAmountInput = BN(val).times(gaugeBalance).toFixed(priceDecimal)

              this.withdrawSliderSelected = val
            }
          }
        },
        async mounted() {
          console.log('o gasPriceWei', gasPriceStore.gasPriceWei)
          // if(currentContract.initializedContracts) 
          // if(currentContract.default_account && currentContract.multicall)
              // this.mounted()

          /* Function */
          // user_checkpoint bool
          // claimable_tokens uint256
          // claimable_reward uint256
          // kick 
          // set_approve_deposit 
          // deposit 
          // withdraw
          // claim_rewards 
          // integrate_checkpoint uint256
          // minter address
          // crv_token address
          // lp_token address
          // controller address
          // voting_escrow address
          // balanceOf uint256
          // totalSupply uint256
          // future_epoch_time uint256
          // approved_to_deposit bool
          // working_balances uint256
          // working_supply uint256
          // period int128
          // period_timestamp uint256
          // integrate_inv_supply uint256
          // integrate_inv_supply_of uint256
          // integrate_checkpoint_of uint256
          // integrate_fraction uint256
          // inflation_rate uint256
          // claimed_rewards_for uint256
          const daoabis_liquiditygaugerewards_abi = [
        {
            "name":"Deposit",
            "inputs":[
                {
                    "type":"address",
                    "name":"provider",
                    "indexed":true
                },
                {
                    "type":"uint256",
                    "name":"value",
                    "indexed":false
                }
            ],
            "anonymous":false,
            "type":"event",
            "signature":"0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c"
        },
        {
            "name":"Withdraw",
            "inputs":[
                {
                    "type":"address",
                    "name":"provider",
                    "indexed":true
                },
                {
                    "type":"uint256",
                    "name":"value",
                    "indexed":false
                }
            ],
            "anonymous":false,
            "type":"event",
            "signature":"0x884e`dad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364"
        },
        {
            "name":"UpdateLiquidityLimit",
            "inputs":[
                {
                    "type":"address",
                    "name":"user",
                    "indexed":false
                },
                {
                    "type":"uint256",
                    "name":"original_balance",
                    "indexed":false
                },
                {
                    "type":"uint256",
                    "name":"original_supply",
                    "indexed":false
                },
                {
                    "type":"uint256",
                    "name":"working_balance",
                    "indexed":false
                },
                {
                    "type":"uint256",
                    "name":"working_supply",
                    "indexed":false
                }
            ],
            "anonymous":false,
            "type":"event",
            "signature":"0x7ecd84343f76a23d2227290e0288da3251b045541698e575a5515af4f04197a3"
        },
        {
            "outputs":[

            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"lp_addr"
                },
                {
                    "type":"address",
                    "name":"_minter"
                }
            ],
            "stateMutability":"nonpayable",
            "type":"constructor"
        },
        {
            "name":"user_checkpoint",
            "outputs":[
                {
                    "type":"bool",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"addr"
                }
            ],
            "stateMutability":"nonpayable",
            "type":"function",
            "gas":2079152,
            "signature":"0x4b820093"
        },
        {
            "name":"claimable_tokens",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"addr"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1998318,
            "constant":true,
            "signature":"0x33134583"
        },
        {
            "name":"claimable_reward",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"addr"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1998318,
            "constant":true,
            "signature":"0xd2797b59"
        },
        {
            "name":"kick",
            "outputs":[

            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"addr"
                }
            ],
            "stateMutability":"nonpayable",
            "type":"function",
            "gas":2084532,
            "signature":"0x96c55175"
        },
        {
            "name":"set_approve_deposit",
            "outputs":[

            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"addr"
                },
                {
                    "type":"bool",
                    "name":"can_deposit"
                }
            ],
            "stateMutability":"nonpayable",
            "type":"function",
            "gas":35766,
            "signature":"0x1d2747d4"
        },
        {
            "name":"deposit",
            "outputs":[

            ],
            "inputs":[
                {
                    "type":"uint256",
                    "name":"_value"
                }
            ],
            "stateMutability":"nonpayable",
            "type":"function",
            "signature":"0xb6b55f25"
        },
        {
            "name":"deposit",
            "outputs":[

            ],
            "inputs":[
                {
                    "type":"uint256",
                    "name":"_value"
                },
                {
                    "type":"address",
                    "name":"addr"
                }
            ],
            "stateMutability":"nonpayable",
            "type":"function",
            "signature":"0x6e553f65"
        },
        {
            "name":"withdraw",
            "outputs":[

            ],
            "inputs":[
                {
                    "type":"uint256",
                    "name":"_value"
                }
            ],
            "stateMutability":"nonpayable",
            "type":"function",
            "gas":2208318,
            "signature":"0x2e1a7d4d"
        },
        {
            "name":"claim_rewards",
            "outputs":[

            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"addr"
                }
            ],
            "stateMutability":"nonpayable",
            "type":"function",
            "signature":"0x84e9bd7e"
        },
        {
            "name":"integrate_checkpoint",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":2297,
            "constant":true,
            "signature":"0xd31f3f6d"
        },
        {
            "name":"minter",
            "outputs":[
                {
                    "type":"address",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1421,
            "constant":true,
            "signature":"0x07546172"
        },
        {
            "name":"crv_token",
            "outputs":[
                {
                    "type":"address",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1451,
            "constant":true,
            "signature":"0x76d8b117"
        },
        {
            "name":"lp_token",
            "outputs":[
                {
                    "type":"address",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1481,
            "constant":true,
            "signature":"0x82c63066"
        },
        {
            "name":"controller",
            "outputs":[
                {
                    "type":"address",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1511,
            "constant":true,
            "signature":"0xf77c4791"
        },
        {
            "name":"voting_escrow",
            "outputs":[
                {
                    "type":"address",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1541,
            "constant":true,
            "signature":"0xdfe05031"
        },
        {
            "name":"balanceOf",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"arg0"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1725,
            "constant":true,
            "signature":"0x70a08231"
        },
        {
            "name":"totalSupply",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1601,
            "constant":true,
            "signature":"0x18160ddd"
        },
        {
            "name":"future_epoch_time",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1631,
            "constant":true,
            "signature":"0xbe5d1be9"
        },
        {
            "name":"approved_to_deposit",
            "outputs":[
                {
                    "type":"bool",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"arg0"
                },
                {
                    "type":"address",
                    "name":"arg1"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1969,
            "constant":true,
            "signature":"0xe1522536"
        },
        {
            "name":"working_balances",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"arg0"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1845,
            "constant":true,
            "signature":"0x13ecb1ca"
        },
        {
            "name":"working_supply",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1721,
            "constant":true,
            "signature":"0x17e28089"
        },
        {
            "name":"period",
            "outputs":[
                {
                    "type":"int128",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1751,
            "constant":true,
            "signature":"0xef78d4fd"
        },
        {
            "name":"period_timestamp",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"uint256",
                    "name":"arg0"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1890,
            "constant":true,
            "signature":"0x7598108c"
        },
        {
            "name":"integrate_inv_supply",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"uint256",
                    "name":"arg0"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1920,
            "constant":true,
            "signature":"0xfec8ee0c"
        },
        {
            "name":"integrate_inv_supply_of",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"arg0"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1995,
            "constant":true,
            "signature":"0xde263bfa"
        },
        {
            "name":"integrate_checkpoint_of",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"arg0"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":2025,
            "constant":true,
            "signature":"0x9bd324f2"
        },
        {
            "name":"integrate_fraction",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"arg0"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":2055,
            "constant":true,
            "signature":"0x09400707"
        },
        {
            "name":"inflation_rate",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[

            ],
            "stateMutability":"view",
            "type":"function",
            "gas":1931,
            "constant":true,
            "signature":"0x180692d0"
        },
        {
            "name":"claimed_rewards_for",
            "outputs":[
                {
                    "type":"uint256",
                    "name":""
                }
            ],
            "inputs":[
                {
                    "type":"address",
                    "name":"arg0"
                }
            ],
            "stateMutability":"view",
            "type":"function",
            "gas":2355,
            "constant":true,
            "signature":"0xfd96044b"
        }
    ]
          this.gauge = process.env.VUE_APP_PSS_GAUGE
          this.gaugeContract = new currentContract.web3.eth.Contract(daoabis_liquiditygaugerewards_abi, this.gauge)

          // 值不准，因此源码也是注释
          // this.claimableTokens = await this.gaugeContract.methods.claimable_tokens(currentContract.default_account).call()
          // this.claimableTokens = +this.gauge.claimable_tokens

this.mounted();

          this.claimableReward = await this.gaugeContract.methods.claimable_reward(currentContract.default_account).call()
    
          this.currentPool.tokens.crv_snx.child.crv.mining.pendingReward = this.claimableReward

    

          this.gaugeBalance = BN(await this.gaugeContract.methods.balanceOf(currentContract.default_account).call()).toFixed(0,1)

// FIXME: temp
this.currentPool.tokens.sfg.mining.claimConfirm = this.claim1
this.currentPool.tokens.crv_snx.claimConfirm = this.claimRewards

          
        },
        watch: {
          depositAmount(val) {
            // let depositVal = (val * 100 / (this.gauge.balance / 1e18)) || 0
            // this.depositSlider = (Math.min(depositVal, 100)).toFixed(0)
          },

          withdrawAmount(val) {
            // let withdrawVal = (val * 100 / (this.gauge.gaugeBalance / 1e18)) || 0
            // this.withdrawSlider = (Math.min(withdrawVal, 100)).toFixed(0)
          },
        },
        methods: {
          async mounted() {
            console.log('mounted 1')
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
console.log('swap_token', swap_token)
console.log('gauge', this.gauge)
console.log('inf_approval', this.inf_approval)
            await common.approveAmount(swap_token, deposit, currentContract.default_account, this.gauge, this.inf_approval)
console.log(1)
            var { dismiss } = notifyNotification(`Please confirm depositing into ${this.name} gauge`)

            await this.gaugeContract.methods.deposit(deposit.toFixed(0,1)).send({
              from: currentContract.default_account,
              gasPrice: this.gasPriceWei,
              gas: this.deposit_gas,
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })

          },

          async withdraw () {
            let withdraw = BN(this.withdrawAmount).times(1e18)
            let balance = BN(await this.gaugeContract.methods.balanceOf(currentContract.default_account).call())

            console.log('withdraw', withdraw, 'balance', balance)

            if(withdraw.gt(balance))
              withdraw = balance

            let gas = this.gas
          const __synthsUnavailable = true
            let withdrawMethod = this.gaugeContract.methods.withdraw(withdraw.toFixed(0,1))
            // if(['susdv2', 'sbtc'].includes(this.gauge.name) && this.synthsUnavailable) {
              // let withdrawMethod = gaugeContract.methods.withdraw(withdraw.toFixed(0,1), !__synthsUnavailable)
            // }
            try {
              gas = await withdrawMethod.estimateGas()
            }
            catch(err) {
              console.error(err)
            }

            var { dismiss } = notifyNotification(`Please confirm withdrawing from ${this.name} gauge`)

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

          async claim1 () {
        console.log(gaugeStore.state.minter)
            let gas = await gaugeStore.state.minter.methods.mint(this.gauge).estimateGas()
console.log('gas', gas)
            var { dismiss } = notifyNotification(`Please confirm claiming CRV from ${this.name} gauge`)

            await gaugeStore.state.minter.methods.mint(this.gauge).send({
              from: currentContract.default_account,
              gasPrice: this.gasPriceWei,
              gas: gas * 1.5 | 0,
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
          },

          async claimRewards () {
            let gas = await this.gaugeContract.methods.claim_rewards(currentContract.default_account).estimateGas()

            var { dismiss } = notifyNotification(`Please confirm claiming SNX`)

            await this.gaugeContract.methods.claim_rewards(currentContract.default_account).send({
              from: currentContract.default_account,
              gasPrice: this.gasPriceWei,
              gas: gas * 1.2 | 0,
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
