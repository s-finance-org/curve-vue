<template>
	<div>
    <fieldset>
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
          Gas: 
          <input id='deposit' type='text' v-model='deposit_gas'>
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
        Gas:  
          <input id='deposit' type='text' v-model='gas'>
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




		<div class='window white' v-if='showChart'>
			<highcharts :options="piechartdata" ref='piecharts'></highcharts>
		</div>
		<div class='window white' v-if='showChart'>
			<highcharts :options="piegaugechartdata" ref='piegaugecharts'></highcharts>
		</div>
		<div class='window white'>
			<voting-escrow :showchart='false'></voting-escrow>
		</div>
		<div class='window white' v-show='loading'>
			<span class='loading matrix'></span>
		</div>
		<div class='window white' v-show='totalClaimableCRV > 0 || totalMintedCRV > 0'>
			<div v-show='totalMintedCRV > 0'>
				Total minted CRV from gauges: {{ totalMintedCRVFormat }}
			</div>

			<div v-show='totalClaimableCRV > 0' class='totalClaimableCRV'>
				All claimable CRV from gauges: {{ totalClaimableCRVFormat }}

				<p>
					Choose gauges to claim from: <span v-for='gauge in myGauges' class='claimGaugeSelect'>
						<input :id="'gauge' + gauge.name" type='checkbox' v-model='claimFromGauges' :value='gauge'>
						<label :for="'gauge' + gauge.name">{{ gauge.name }}</label>
					</span>

					<p class='info-message gentle-message claimAllWarning'>
						Claiming from a gauge will update your boost
					</p>

					<p>
						<button @click='claim'>Claim {{ claimFromGauges.length == myGauges.length ? 'all' : '' }}</button>
					</p>
				</p>
			</div>

			<div class='applyBoostAll' v-show='showApplyBoostAll'>
				Apply boost to {{ gaugesNeedApplyNames.join(', ') }} gauges
				<button @click='applyBoostAll'>Apply all</button>
			</div>
		</div>
		<div class='window white' v-show='totalBalance == 0 && totalGaugeBalance == 0'>
			<div class='info-message gentle-message'>
				You don't have any Curve pool LP tokens
			</div>
		</div>
		<div class='window white'>
			<gas-price></gas-price>
		</div>
    mypools: {{ mypools }}
		<gauge v-for='(pool, i) in mypools' :key = 'i' :i = 'i'></gauge>
	</div>
</template>

<script>
	import { contract, getters } from '../../contract'
    import { notify, notifyHandler, notifyNotification } from '../../init'

	// import allabis from '../../allabis'
	import daoabis from '../dao/allabis'

	import Highcharts from 'highcharts'
	import HC_exporting from 'highcharts/modules/exporting';
	import HC_exporting_data from 'highcharts/modules/export-data';
	HC_exporting(Highcharts);
	HC_exporting_data(Highcharts)

	import {Chart} from 'highcharts-vue'
	Highcharts.setOptions({
		lang: {
			loading: '',
		}
	})

	import * as gaugeStore from './gaugeStore'

	import Gauge from './Gauge'
	import GaugeTemp from './Gauge_Temp'

	import VotingEscrow from './VotingEscrow'

	import * as gasPriceStore from '../common/gasPriceStore'
  import GasPrice from '../common/GasPrice.vue'

  import { getBTCPrice } from '../common/priceStore'

	import allabis, { ERC20_abi } from '../../allabis'
	import * as common from '../../utils/common'

	export default {
		components: {
      Gauge,
      GaugeTemp,
			VotingEscrow,
			Highcharts: Chart,
			GasPrice,
		},

		data: () => ({
			pools: [],
			mypools: [],

			piechartdata: {
				chart: {
			        plotBackgroundColor: null,
			        plotBorderWidth: null,
			        plotShadow: false,
			        type: 'pie'
			    },
			    title: {
			        text: 'Gauge allocation'
			    },
			    tooltip: {
			        pointFormat: '{series.name}: <b>{point.percentage:.3f}%</b>'
			    },
			    accessibility: {
			        point: {
			            valueSuffix: '%'
			        }
			    },
			    plotOptions: {
			        pie: {
			            allowPointSelect: true,
			            cursor: 'pointer',
			            dataLabels: {
			                enabled: true,
			                // formatter: (function(self) {
			                // 	return function(point) { 
			                // 		return `<b>${this.key}</b>: 
			                // 		${helpers.formatNumber(self.allPools[this.key], 0)}$
			                // 		(${this.percentage.toFixed(2)}%)`
			                // 	}
			                // })(this),
			            }
			        }
			    },
			    series: [],
			},

			piegaugechartdata: {
				chart: {
			        plotBackgroundColor: null,
			        plotBorderWidth: null,
			        plotShadow: false,
			        type: 'pie'
			    },
			    title: {
			        text: 'Gauge relative weight'
			    },
			    tooltip: {
			        pointFormat: '{series.name}: <b>{point.percentage:.3f}%</b>'
			    },
			    accessibility: {
			        point: {
			            valueSuffix: '%'
			        }
			    },
			    plotOptions: {
			        pie: {
			            allowPointSelect: true,
			            cursor: 'pointer',
			            dataLabels: {
			                enabled: true,
			                // formatter: (function(self) {
			                // 	return function(point) { 
			                // 		return `<b>${this.key}</b>: 
			                // 		${helpers.formatNumber(self.allPools[this.key], 0)}$
			                // 		(${this.percentage.toFixed(2)}%)`
			                // 	}
			                // })(this),
			            }
			        }
			    },
			    series: [],
			},

			piechart: null,

			piegaugechart: null,

			showChart: true,

			loading: true,

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
      claimableReward: 0,
      gaugeContract: null,
      gauge: '',
      name: 'susdv2',

      gaugeBalance: 0
		}),

		async created() {
			this.$watch(() => contract.default_account && contract.multicall, (val, oldval) => {
				//if(val != null && oldval != null)
					this.mounted()
			})
		},

		async mounted() {
			if(contract.default_account && contract.multicall)
        this.mounted()

      // FIXME: 
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
      this.gaugeContract = new contract.web3.eth.Contract(daoabis_liquiditygaugerewards_abi, this.gauge)

      // 值不准，因此源码也是注释
      // this.claimableTokens = await this.gaugeContract.methods.claimable_tokens(contract.default_account).call()
      // this.claimableTokens = +this.gauge.claimable_tokens

      this.claimableReward = await this.gaugeContract.methods.claimable_reward(contract.default_account).call()

      this.gaugeBalance = BN(await this.gaugeContract.methods.balanceOf(contract.default_account).call()).toFixed(0,1)


		},

		computed: {
			totalClaimableCRV() {
				return gaugeStore.state.totalClaimableCRV
			},
			totalClaimableCRVFormat() {
				return (this.totalClaimableCRV / 1e18).toFixed(2)
			},

			totalMintedCRV() {
				return gaugeStore.state.totalMintedCRV
			},
			totalMintedCRVFormat() {
				return (this.totalMintedCRV / 1e18).toFixed(2)
			},

			totalBalance() {
				return gaugeStore.state.totalBalance
			},
			totalGaugeBalance() {
				return gaugeStore.state.totalGaugeBalance
			},
			gasPrice() {
          return gasPriceStore.state.gasPrice
      },
      gasPriceWei() {
          return gasPriceStore.state.gasPriceWei
      },
      showApplyBoostAll() {
        return gaugeStore.state.gaugesNeedApply.length > 0
      },
      gaugesNeedApplyNames() {
        return gaugeStore.state.gaugesNeedApply.map(gauge => gaugeStore.state.mypools.find(v => v.gauge == gauge).name)
      },
      myGauges() {
        return gaugeStore.state.mypools.filter(pool => +pool.claimable_tokens > 0)
      },



      gaugeStore () {
        return gaugeStore
      },
      claimableTokensFormat() {
				return (this.claimableTokens / 1e0).toFixed(2)
      },
      claimableRewardFormat() {
				return this.toFixed(this.claimableReward / 1e0)
			},
		},

		methods: {
			async mounted() {
				gaugeStore.state.totalClaimableCRV = null
				gaugeStore.state.totalMintedCRV = null
				this.piechart = this.$refs.piecharts.chart
				this.piegaugechart = this.$refs.piegaugecharts.chart

				this.piechart.showLoading()

				this.piegaugechart.showLoading()

        await gaugeStore.getState()

				this.loading = false

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

				if(total == 0) {
					this.showChart = false
					return;
				}

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

				this.piechart.addSeries({
					name: 'Gauge Allocation',
					data: piedata,
				})


				this.piechart.hideLoading()

				let gaugeSum = Object.values(gaugeStore.state.pools).reduce((a,b) => +a + +b.gauge_relative_weight, 0)
				let piegauges = Object.values(gaugeStore.state.pools).map(v => ({ name: v.name, y: v.gauge_relative_weight / gaugeSum}))

				let highest = piegauges.map(data=>data.y).indexOf(Math.max(...piegauges.map(data => data.y)))
				piegauges[highest].sliced = true;
				piegauges[highest].selected = true;

				this.piegaugechart.addSeries({
					name: 'Gauge relative weights',
					data: piegauges,
				})


				this.piegaugechart.hideLoading()

			},

			async claim() {
				console.log(gaugeStore.state.mypools, "MY POOLS")
				let gauges = this.claimFromGauges.map(gauge => gauge.gauge)
				let fillarray = new Array(8-gauges.length).fill('0x0000000000000000000000000000000000000000')
				gauges.push(...fillarray)
				console.log(gauges, "ALL GAUGES")
				let mintMethod = gaugeStore.state.minter.methods.mint_many(gauges)
				if(gauges.filter(address => +address > 0).length == 1)
					mintMethod = gaugeStore.state.minter.methods.mint(gauges.find(address => +address > 0))
				let gas = await mintMethod.estimateGas()

				var { dismiss } = notifyNotification(`Please confirm claiming CRV from all gauges you've deposited to`)

				await mintMethod.send({
					from: contract.default_account,
					gasPrice: this.gasPriceWei,
					gas: gas * 1.5 | 0,
				})
				.once('transactionHash', hash => {
					dismiss()
					notifyHandler(hash)
				})
			},

			async applyBoostAll() {
				gaugeStore.applyBoostAll()
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
				// this.withdrawAmount = this.toFixed((this.gauge.gaugeBalance / 1e0) * val/100)
      },

      async deposit () {
        let deposit = BN(this.depositAmount).times(1e0)
        const gauge_swap_token = process.env.VUE_APP_LPT
        const swap_token = new contract.web3.eth.Contract(ERC20_abi, gauge_swap_token)



          await common.approveAmount(swap_token, deposit, contract.default_account, this.gauge, this.inf_approval)

          var { dismiss } = notifyNotification(`Please confirm depositing into ${this.name} gauge`)

          await this.gaugeContract.methods.deposit(deposit.toFixed(0,1)).send({
            from: contract.default_account,
            gasPrice: this.gasPriceWei,
            gas: this.deposit_gas,
          })
          .once('transactionHash', hash => {
            dismiss()
            notifyHandler(hash)
          })

      },

      async withdraw () {
        let withdraw = BN(this.withdrawAmount).times(1e0)
        let balance = BN(await this.gaugeContract.methods.balanceOf(contract.default_account).call())

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
        console.log('gas', gas)
    console.log(this.name)
        var { dismiss } = notifyNotification(`Please confirm withdrawing from ${this.name} gauge`)

        await withdrawMethod.send({
          from: contract.default_account,
          gasPrice: this.gasPriceWei,
          gas: gas * 1.5 | 0,
        })
        .once('transactionHash', hash => {
          dismiss()
          notifyHandler(hash)
        })
      },

      async claim1 () {
        let gas = await gaugeStore.state.minter.methods.mint(this.gauge).estimateGas()

				var { dismiss } = notifyNotification(`Please confirm claiming CRV from ${this.name} gauge`)

				await this.gaugeStore.state.minter.methods.mint(this.gauge).send({
					from: contract.default_account,
					gasPrice: this.gasPriceWei,
					gas: gas * 1.5 | 0,
				})
				.once('transactionHash', hash => {
					dismiss()
					notifyHandler(hash)
        })
      },

      async claimRewards () {
        let gas = await this.gaugeContract.methods.claim_rewards(contract.default_account).estimateGas()

				var { dismiss } = notifyNotification(`Please confirm claiming SNX`)

				await this.gaugeContract.methods.claim_rewards(contract.default_account).send({
					from: contract.default_account,
					gasPrice: this.gasPriceWei,
					gas: gas,
				})
				.once('transactionHash', hash => {
					dismiss()
					notifyHandler(hash)
				})
      },
    },
	}
</script>

<style scoped>
	.totalClaimableCRV {
		margin-top: 1em;
	}
	.info-message.gentle-message {
		margin-top: 0;
	}
	.applyBoostAll {
		margin-top: 1em;
	}
	.claimGaugeSelect {
		display: inline;
	}
	.claimGaugeSelect:nth-of-type(1) label {
		margin-left: 0;
	}
	.claimGaugeSelect label {
		margin-left: 0.4em;
	}
	.claimAllWarning.claimAllWarning {
		margin-top: 1em;
	}
	input[type='checkbox'] + label {
		cursor: pointer;
	}







  legend {
		text-align: center;
	}
	.pools {
		display: flex;
		flex-wrap: wrap;
		width: 80%;
		margin: 0 auto;
	}
	.pools.justifySpaceAround {
		width: 100%;
		margin: 0;
		justify-content: space-around;
	}
	.pools .hoverpointer {
		cursor: pointer;
		border-bottom: 1px solid black;
		border-bottom-style: dotted;
	}
	.pools .hoverpointer:hover {
		border-bottom-style: solid;
	}
	.pools button {
		margin-top: 1em;
	}
	.pools input {
		width: 6em;
	}
	.pools .input {
		margin-top: 1em;
	}
	.range {
		margin-top: 1em;
	}
	.range label {
		margin-right: 1em;
	}
	.range div {
		display: inline-block;
	}
	.range div.label {
		width: 3em;
	}
	.claimtokens {
		margin-right: 1em;
	}
	.pool-info {
		text-align: center;
	}
	.pool-info .boost {
		margin-top: 1em;
	}
	.claimButtons {
		/*width: 100%;*/
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	.poolBalance, .gaugeBalance {
		margin-top: 1em;
	}
	.inf-approval-label {
		margin-top: 1em;
	}
	.gauge .unstake {
		visibility: hidden;
	}
	.mintedCRVFrom, .gaugeRelativeWeight, .claimedRewards {
		margin-top: 0.4em;
	}
	.gaugeRelativeWeight {
		margin-top: 1em;
	}
	.greentext {
		color: green;
	}
	@media only screen and (max-device-width: 730px) {
		.gauge .unstake {
			display: none;
		}
	}
</style>