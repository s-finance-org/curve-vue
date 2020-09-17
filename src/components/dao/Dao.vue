<template>
	<div>
    <fieldset>
      loading: {{ loading }}
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

 
            <!-- <fieldset class="currencies">
                <legend>Currencies:</legend>
                <ul>
                    <li v-for='(currency, i) in Object.keys(currencies)'>
                        <label :for="'currency_'+i">
                        	<span class='currency_label'>
                                <img 
                                    :class="{'token-icon': true, [currency+'-icon']: true, 'y': depositc && !isPlain}" 
                                    :src='getTokenIcon(currency)'>
                                <span v-show='depositc'>{{currencies[currency]}}
    	                        	<span v-show="!(currency == 'usdt' && currentPool == 'usdt' || currency == 'pax') 
    	                        					&& !['susdv2', 'tbtc', 'ren', 'sbtc'].includes(currentPool)"> 
    	                        		(in {{currency | capitalize}}) 
    	                        	</span>
    	                        </span>
    	                        <span v-show='!depositc'>{{currency | capitalize}}
    	                        </span>
                                <span @click='setMaxBalanceCoin(i)' class='maxBalanceCoin'>
                                    Max: 
                                    <span 
                                        v-show="(currentPool == 'susdv2' && i == 3 || currentPool == 'sbtc' && i == 2)
                                                    && maxBalanceCoin(i) != '0.00'"
                                    >
                                        {{transferableBalanceText}}/
                                    </span>
                                    <span>{{ maxBalanceCoin(i) }} </span>
                                    <span v-show="susdWaitingPeriod">
                                        <span class='tooltip'>
                                            <img src='@/assets/clock-regular.svg' class='icon small'>
                                            <span class='tooltiptext normalFont'>
                                                Cannot transfer during waiting period. {{ (susdWaitingPeriodTime ).toFixed(0) }} secs left.
                                            </span>
                                        </span>
                                    </span>
                                    <span v-show="(currentPool == 'susdv2' && i == 3 || currentPool == 'sbtc' && i == 2)
                                                    && maxBalanceCoin(i) != '0.00'" 
                                        class='tooltip'> [?]
                                        <span class='tooltiptext long normalFont'>
                                            Max transferrable amount is {{ transferableBalanceText }}. You can free the remaining balance by settling.
                                        </span>
                                    </span>
                                </span>
                            </span>
                        </label>
                        <input 
	                        type="text" 
	                        :id="'currency_'+i" 
	                        :disabled='disabled' 
	                        name="from_cur" 
	                        v-model = 'inputs[i]'
	                        :style = "{backgroundColor: bgColors[i]}"
	                        @input='change_currency(i, true)'
	                    >

                    </li>
                </ul>
            </fieldset>
            <ul>
                <gas-price></gas-price>

                <li>
                    <input id="sync-balances" type="checkbox" name="sync-balances" @change='handle_sync_balances_proportion' :disabled='disabledButtons' checked v-model='sync_balances'>
                    <label for="sync-balances">Add all coins in a balanced proportion</label>
                </li>
                <li>
                    <input id="max-balances" type="checkbox" name="max-balances" @change='handle_sync_balances' :disabled='disabledButtons' checked v-model='max_balances'>
                    <label for="max-balances">Use maximum amount of coins available</label>
                </li>
                <li>
                    <input id="inf-approval" type="checkbox" name="inf-approval" checked v-model='inf_approval'>
                    <label for="inf-approval">Infinite approval - trust this contract forever 
                    	<span class='tooltip'>[?]
                    		<span class='tooltiptext long'>
                    			Preapprove the contract to to be able to spend any amount of your coins. You will not need to approve again.
                    		</span>
                    	</span>
                    </label>
                </li>
                <li v-show = "!['susd','susdv2','tbtc','ren','sbtc'].includes(currentPool)">
                    <input id="depositc" type="checkbox" name="inf-approval" checked v-model='depositc'>
                    <label for="depositc">Deposit wrapped</label>
                </li>
            </ul>
            <div class='simple-error pulse' v-show="susdWaitingPeriod">
                Cannot transfer {{ currentPool == 'susdv2' ? 'sUSD' : 'sBTC' }} during waiting period. {{ (susdWaitingPeriodTime).toFixed(0) }} secs left.
            </div>
            <p style="text-align: center" class='buttons'>
                <button id="add-liquidity" 
                    :disabled="currentPool == 'susdv2' && slippage < -0.03 || depositingZeroWarning || isZeroSlippage"
                    @click='justDeposit = true; handle_add_liquidity()' 
                    >
                        Deposit <span class='loading line' v-show='loadingAction == 1'></span>
                </button>
                <button 
                    id='add-liquidity-stake' 
                    v-show="['susdv2', 'sbtc', 'y', 'iearn'].includes(currentPool) && hasRewards" 
                    :disabled = 'slippage < -0.03 || depositingZeroWarning || isZeroSlippage'
                    @click = 'justDeposit = false; deposit_stake()'>
                    Deposit and stake <span class='loading line' v-show='loadingAction == 2'></span>
                </button>
                <button id='stakeunstaked' 
                    v-show="totalShare > 0 && ['susdv2', 'sbtc', 'y', 'iearn'].includes(currentPool) && hasRewards"
                    :disabled='stakePercentageInvalid' 
                    @click='stakeTokens()'
                    >
                    Stake unstaked <span class='loading line' v-show='loadingAction == 3'></span>
                </button>
                <p class='info-message gentle-message' v-show="lpCrvReceived > 0">
                    You'll receive minimum {{ lpCrvReceivedText }} Curve {{currentPool}} LP tokens <sub>{{ ((1 - getMaxSlippage) * 100).toFixed(2)}}% max slippage</sub>
                    
                    <span class='curvelpusd'> 
                        1 Curve {{currentPool}} LP token = {{ (1 * virtual_price).toFixed(6) }} 
                        {{ !['ren', 'sbtc'].includes(currentPool) ? 'USD' : 'BTC' }} 
                    </span>
                </p>
                <div>
                    <button class='simplebutton advancedoptions' @click='showadvancedoptions = !showadvancedoptions'>
                        Advanced options
                        <span v-show='!showadvancedoptions'>▼</span>
                        <span v-show='showadvancedoptions'>▲</span>
                    </button>
                    <div v-show='showadvancedoptions'>
                        <fieldset>
                            <legend>Advanced options:</legend>
                            <div v-show="hasRewards && totalShare > 0 && ['susdv2', 'sbtc', 'y', 'iearn'].includes(currentPool)">
                                <label for='stakepercentage'>Stake %</label>
                                <input id='stakepercentage' v-model='stakepercentage' :class="{'invalid': stakePercentageInvalid}">
                                <button id='stakeunstaked' 
                                    v-show="totalShare > 0 && ['susdv2', 'sbtc', 'y', 'iearn'].includes(currentPool)"
                                    :disabled='stakePercentageInvalid' 
                                    @click='stakeTokens()'
                                >
                                    Stake unstaked <span class='loading line' v-show='loadingAction == 3'></span>
                                </button>
                            </div>

                            <div id='max_slippage'>
                                <span class='tooltip'>
                                    Max slippage:
                                    <span class='tooltiptext long'>
                                        Customize the maximum slippage you can get when depositing
                                    </span>
                                </span>
                                <input id="slippage01" type="radio" name="slippage" value='0.1' v-model='maxSlippage'>
                                <label for="slippage01">0.1%</label>

                                <input id="slippage1" type="radio" name="slippage" checked value='1' v-model='maxSlippage'>
                                <label for="slippage1">1%</label>

                                <input id="custom_slippage" type="radio" name="slippage" value='-' @click='customippageDisabled = false'>
                                <label for="custom_slippage" @click='customSlippageDisabled = false'>
                                    <input type="text" id="custom_slippage_input" :disabled='customSlippageDisabled' :class="{'invalid': warningInputSlippage}" name="custom_slippage_input" v-model='maxInputSlippage'> %
                                </label>

                                <div class='simple-error' v-show='warningInputSlippage'>
                                    {{ maxInputSlippage }}% is too low of a slippage - your transaction may fail 
                                </div>
                            </div>
                        </fieldset>

                    </div>

                </div>
                <p class='trade-buttons' v-show="['ren', 'sbtc'].includes(currentPool)">
                    <a href='https://bridge.renproject.io/'>Mint/redeem renBTC</a>
                </p>
                <div id='mintr' v-show="['susdv2', 'sbtc'].includes(currentPool)">
                    <a href = 'https://mintr.synthetix.io/' target='_blank' rel="noopener noreferrer">Manage staking in Mintr</a>
                </div>
                <div id='mintr' v-show="['y', 'iearn'].includes(currentPool)">
                    <a href = 'https://ygov.finance/' target='_blank' rel="noopener noreferrer">Manage staking in yGov</a>
                </div>
                <button id="migrate-new" @click='handle_migrate_new' v-show="currentPool == 'compound' && oldBalance > 0">Migrate from old</button>
                <div class='info-message gentle-message' v-show='show_loading'>
                    <span v-html='waitingMessage'></span> <span class='loading line'></span>
                </div>
                <div class='info-message gentle-message' v-show='estimateGas'>
                    Estimated tx cost: {{ (estimateGas * gasPrice / 1e9 * ethPrice).toFixed(2) }}$
                </div>
                <div class='simple-error' v-show='errorStaking'>
                    There was an error in staking your tokens. You can manually stake them on 
                    <a href = 'https://mintr.synthetix.io/' v-show="['susdv2', 'sbtc'].includes(currentPool)" target='_blank' rel="noopener noreferrer"> Mintr. </a>
                    <a href = 'https://ygov.finance/' v-show="['y', 'iearn'].includes(currentPool)" target='_blank' rel="noopener noreferrer"> yGov. </a>
                </div>
                <div class='simple-error pulse' v-show='compareInputsWarning.length && !max_balances'>
                    Not enough balance for currencies {{ compareInputsWarning.toString() }}
                    <p v-show='compareInputsWarning.length == N_COINS - 1'> 
                        Maybe you forgot to uncheck the first 
                        "Add all coins in a balanced proportion" checkbox?
                    </p>
                </div>
                <div class='simple-error pulse' v-show='depositingZeroWarning && !max_balances'>
                    You're depositing 0 coins.
                    <p>
                        Maybe you forgot to uncheck the first 
                        "Add all coins in a balanced proportion" checkbox?
                    </p>
                </div>
                <Slippage/>
            </p> -->
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

    import BN from 'bignumber.js'

    import Slippage from '../common/Slippage.vue'
    import * as gaugeStore from './gaugeStore'

    export default {
    	components: {
    		Slippage, GasPrice,
    	},
    	data: () => ({
        pools: [],
			  mypools: [],
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
            // return gasPriceStore.state.gasPrice
            return this.gasPriceStore.gasPrice
          },
          gasPriceWei() {
            return this.gasPriceStore.gasPriceWei
          },
          claimableTokensFormat() {
            return (this.claimableTokens / 1e0).toFixed(2)
          },
          claimableRewardFormat() {
            return this.toFixed(this.claimableReward / 1e0)
          },
        },
        async mounted() {
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

          this.claimableReward = await this.gaugeContract.methods.claimable_reward(currentContract.default_account).call()

          this.gaugeBalance = BN(await this.gaugeContract.methods.balanceOf(currentContract.default_account).call()).toFixed(0,1)

          this.mounted();
        },
        watch: {
          depositAmount(val) {
            // let depositVal = (val * 100 / (this.gauge.balance / 1e0)) || 0
            // this.depositSlider = (Math.min(depositVal, 100)).toFixed(0)
          },

          withdrawAmount(val) {
            // let withdrawVal = (val * 100 / (this.gauge.gaugeBalance / 1e0)) || 0
            // this.withdrawSlider = (Math.min(withdrawVal, 100)).toFixed(0)
          },
        },
        methods: {
          async mounted() {
            gaugeStore.state.totalClaimableCRV = null
            gaugeStore.state.totalMintedCRV = null

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
            const swap_token = new currentContract.web3.eth.Contract(ERC20_abi, gauge_swap_token)



              await common.approveAmount(swap_token, deposit, currentContract.default_account, this.gauge, this.inf_approval)

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
            let withdraw = BN(this.withdrawAmount).times(1e0)
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
            console.log('gas', gas)
        console.log(this.name)
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
