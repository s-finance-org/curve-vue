<template>
	<div>
    <!-- FIXME: common -->
    <div class="total-bg">
      <b-container class="d-flex py-4 px-md-5">
        <b-navbar-nav class="navbar-tabs flex-row flex-wrap px-md-5">
          <b-nav-item :to="{ name: 'Swap', params: { pool: 'usdg5' } }">usdg</b-nav-item>
          <b-nav-item :to="{ name: 'Swap', params: { pool: 'qusd5' } }">qian</b-nav-item>
          <b-nav-item :to="{ name: 'Swap', params: { pool: 'usd5' } }">5pool</b-nav-item>
          <b-nav-item :to="{ name: 'Swap', params: { pool: 'dusd' } }">dForce</b-nav-item>
          <b-nav-item :to="{ name: 'Swap', params: { pool: 'dfi' } }">dfi</b-nav-item>
        </b-navbar-nav>
      </b-container>
      <b-container class="py-4 px-md-5">
        <div class="d-flex align-items-center px-md-5 flex-wrap">
          <div class="total-box p-2 mr-4 d-none d-lg-flex box-98 flex-wrap my-2" :class="[`icons-box-${Object.keys(currencies).length}`]">
            <img v-for='(currency, i) in Object.keys(currencies)' :key="'icon-'+currency" class="icon-w-40"
              :class="{'token-icon': true, [currency+'-icon']: true, 'y': depositc && !isPlain}"
              :src='getTokenIcon(currency)'>
          </div>
          <h3 class="mb-0 col py-3">{{ currentPoolName }}<br/>{{ $t('liquidity.name') }}</h3>
          <div class="col-12 col-md d-flex px-0">
            <div class="total-box col px-4 py-3 mr-4">
              <h6 class="text-black-65">{{ $t('global.totalBalances') }}</h6>
              <text-overlay-loading :show="totalBalances === null">
                <h4 class="mb-0">${{ totalBalances | formatNumber(2) }}</h4>
              </text-overlay-loading>
            </div>
            <div class="total-box col px-4 py-3" v-if="poolDailyVolUSD !== ''">
              <h6 class="text-black-65">{{ $t('global.dailyVol') }}</h6>
              <text-overlay-loading :show="poolDailyVolUSD.loading">
                <h4 class="mb-0">${{ poolDailyVolUSD.cont }}</h4>
              </text-overlay-loading>
            </div>
          </div>
        </div>
      </b-container>
    </div>

    <b-container>
      <root-sub />
      <h4 class="mt-4 mb-2">
        {{ $t('instantSwap.name') }}
      </h4>
      <div class="box">
        <div class="m-4">
          <div class="row justify-content-center">
            <div class="d-flex-column col-12 col-md">
              <div role="group" class="mb-2">
                <label for="from-val" class="text-black-65">{{ $t('instantSwap.from') }}</label>
                <div class="currentInput d-flex">
                  <span class="coin d-flex align-items-center">
                    <img class="icon-w-20 mr-2" :class="{'icon token-icon': true, [getCurrFrom+'-icon']: true}" :src='getTokenIcon(getCurrFrom)'>
                    <span v-show='!swapwrapped'> {{getCurrFrom | capitalize}} </span>
                    <span v-show='swapwrapped'> {{currencie_coins[getCurrFrom]}} </span>
                  </span>
                  <!-- <b-form-input
                    id="from-val"
                    id="from-val"
                    v-model="fromInput"
                    aria-describedby="from-val-help"
                    :placeholder="$t('instantSwap.sizePlaceholder')"
                    @input='set_to_amount'
                    type="number"
                    debounce="200"
                    name="from_currency"
                    :disabled='disabled || selldisabled'
                  ></b-form-input> -->
                  <input class="form-control" type="text" id="from_currency"
                    :disabled='disabled'
                    name="from_currency" value='0.00'
                    :placeholder="$t('instantSwap.sizePlaceholder')"
                    @input='set_to_amount'
                    v-model='fromInput'>
                </div>
                <b-form-text class="text-black-65 mt-0 pointer" @click=set_max_balance>
                  {{ $t('instantSwap.max') }}:
                  <span v-show="(currentPool == 'susdv2' && from_currency == 3 || currentPool == 'sbtc' && from_currency == 2)
                    && maxBalanceText != '0.00'"
                    >
                    {{ maxSynthText }} /
                  </span>
                  <span>{{ maxBalanceText }}</span>
                  <span v-show='susdWaitingPeriod' class='susd-waiting-period'>
                    <span class='tooltip'>
                        <img src='@/assets/clock-regular.svg' class='icon small'>
                        <span class='tooltiptext'>
                            Cannot transfer during waiting period. {{ (susdWaitingPeriodTime).toFixed(0) }} secs left.
                        </span>
                    </span>
                  </span>
                  <span v-show="(currentPool == 'susdv2' && from_currency == 3 || currentPool == 'sbtc' && from_currency == 2)
                    && maxBalanceText != '0.00'"
                      class='tooltip'> [?]
                      <span class='tooltiptext long'>
                        Max transferrable amount is {{ maxSynthText }}. You can free the remaining balance by settling.
                      </span>
                  </span>
                  <span class="float-right" v-show='swapwrapped'>
                    ≈ {{toFixed(actualFromValue)}} {{Object.keys(currencie_coins)[this.from_currency] | capitalize}}
                  </span>
                  <span class="float-right" v-show="['sbtc', 'ren'].includes(currentPool)">
                    ≈ {{ actualFromValue }}$
                  </span>
                </b-form-text>
              </div>
              <div class="lists lists-select">
                <ul>
                  <li class="d-flex align-items-center" :class="{'coins': true, [currency]: true}" v-for='(currency, i) in Object.keys(currencie_coins)'>
                    <b-form-radio class="radio-danger" v-model="from_currency" :id="'from_cur_'+i"  name="from_cur" :value='i'></b-form-radio>
                    <label :for="'from_cur_'+i" class="d-flex align-items-center mb-0">
                      <img class="mr-2 icon-w-20" :class="{'icon token-icon': true, [currency+'-icon']: true}" :src='getTokenIcon(currency)'>
                      <span v-show="!swapwrapped && !['tbtc', 'ren', 'sbtc'].includes(currentPool)"> {{currency | capitalize}} </span>
                      <span v-show="swapwrapped || ['tbtc', 'ren', 'sbtc'].includes(currentPool)"> {{currencie_coins[currency]}} </span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            <div class='col-1 my-3 d-flex justify-content-center align-items-center'>
              <b-button class="iconcontainer" @click='swapInputs' variant="light"><img :src="publicPath + 'res/icons/base/exchange.svg'" id='exchangeicon'/></b-button>
            </div>

            <div class="d-flex-column col-12 col-md">
              <div role="group" class="mb-2">
                <label for="to-val" class="text-black-65">{{ $t('instantSwap.to') }}</label>
                <div class="currentInput d-flex">
                  <span class="coin d-flex align-items-center">
                    <img class="icon-w-20 mr-2" :class="{'icon token-icon': true, [getCurrTo+'-icon']: true}" :src='getTokenIcon(getCurrTo)'>
                    <span v-show='!swapwrapped'> {{getCurrTo | capitalize}} </span>
                    <span v-show='swapwrapped'> {{currencie_coins[getCurrTo]}} </span>
                  </span>
                  <!-- <b-form-input
                    id="to-val"
                    v-model="toInput"
                    aria-describedby="to-val-help"
                    :placeholder="$t('instantSwap.sizePlaceholder')"
                    @input='set_to_amount'
                    type="number"
                    debounce="200"
                    name="to_currency"
                    disabled
                  ></b-form-input> -->
                  <input class="form-control" type="text" id="to-val" disabled name="to_currency" value='0.00'
                    :placeholder="$t('instantSwap.sizePlaceholder')"
                    v-model='toInput'>
                </div>
                <b-form-text id="to-val-help" class="text-black-65 mt-0">
                  {{ $t('instantSwap.max') }}: -
                  <span class="float-right" v-show='swapwrapped'>
                    ≈ {{toFixed(actualToValue)}} {{Object.keys(currencie_coins)[this.to_currency] | capitalize}}
                  </span>
                  <span class="float-right" v-show="['ren', 'sbtc'].includes(currentPool)">
                    ≈ {{ actualToValue }}$
                  </span>
                </b-form-text>
              </div>
              <div class="lists lists-select">
                <ul>
                  <li class="d-flex align-items-center" :class="{'coins': true, [currency]: true}" v-for='(currency, i) in Object.keys(currencie_coins)'>
                    <b-form-radio class="radio-danger" v-model="to_currency" :id="'to_cur_'+i"  name="to_cur" :value='i'></b-form-radio>
                    <label :for="'to_cur_'+i" class="d-flex align-items-center mb-0">
                        <img class="mr-2 icon-w-20" :class="{'icon token-icon': true, [currency+'-icon']: true}" :src='getTokenIcon(currency)'>
                        <span v-show="!swapwrapped && !['tbtc', 'ren'].includes(currentPool)"> {{currency | capitalize}} </span>
                        <span v-show="swapwrapped || ['tbtc', 'ren'].includes(currentPool)"> {{currencie_coins[currency]}} </span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div v-show="showadvancedoptions">
            <div id='max_slippage' class="lists lists-select mt-3 d-flex flex-wrap no-gutters">
              <b-form-group class="mb-0 col-12 col-md">
                <ul>
                  <li>
                    <h6 class="text-black-65 mb-0">{{ $t('global.maxSlippage') }}</h6>
                  </li>
                  <li>
                    <b-form-radio
                      v-model="selectMaxSlippageMode"
                      value=1
                    >0.5%</b-form-radio>
                  </li>
                  <li>
                    <b-form-radio
                      v-model="selectMaxSlippageMode"
                      value=2
                    >1.0%</b-form-radio>
                  </li>
                  <li>
                    <b-form-radio
                      v-model="selectMaxSlippageMode"
                      value=3
                    >2.0%</b-form-radio>
                  </li>
                  <li>
                    <b-form-radio
                      v-model="selectMaxSlippageMode"
                      value=4
                    >{{ $t('global.customize') }}</b-form-radio>
                    <span class="d-flex align-items-center ml-4 mt-1">
                      <b-form-input class="input-append-percentage" id="custom_slippage_input" :disabled="maxSlippageMode != 4" v-model="customMaxSlippageInput" :placeholder="$t('instantSwap.valuePlaceholder')"></b-form-input>
                      <span class="offset-ml-4 text-black-65">%</span>
                    </span>
                  </li>
                  <li v-show='showSlippageTooLow'>
                    <span class='tooltip'>
                      <img class='icon small hoverpointer warning' :src="publicPath + 'exclamation-circle-solid.svg'">
                      <span class='tooltiptext'>
                        Max slippage value is likely too low and the transaction may fail
                      </span>
                    </span>
                  </li>
                </ul>
              </b-form-group>
              <div class="col-none col-md-1"></div>
              <gas-price class="col-12 col-md"></gas-price>
            </div>
          </div>
          <b-alert class="mt-3" v-for="(item, idx) in messages" :key="idx" :show="item.msg" variant="dark" v-html='item.msg'></b-alert>
          <b-alert class="mt-3" :show="!!waitingMessage" variant="dark" v-html='waitingMessage'></b-alert>

          <div class="mt-4">
            <b-form-checkbox v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
            <b-form-checkbox v-model="swapwrapped" name="swapw" v-show = "!['susdv2', 'tbtc', 'ren', 'sbtc', 'okuu', 'usd5'].includes(currentPool)">{{ $t('instantSwap.swapWrapped', [currentPoolTokenCoinMark]) }}</b-form-checkbox>
          </div>

          <div class="row mt-3 align-items-end text-black-65 flex-wrap">
            <span class="col-12 col-md mb-2">
              <h6 class="mb-1">{{ $t('instantSwap.exchangeRate') }}</h6>
              <text-overlay-loading :show="!checkExchangeRate">
                <span @click='swapExchangeRate'>{{ exchangeRateSwapped }}</span>
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-2">
              <h6 class="mb-1">{{ $t('instantSwap.txCost') }}</h6>
              <text-overlay-loading :show="!estimateGas">
                ${{ (estimateGas * gasPrice / 1e9 * ethPrice).toFixed(2) }}
              </text-overlay-loading>
            </span>
            <span class="col-12 col-md mb-2">
              <h6 class="mb-1">{{ $t('instantSwap.routedThrough') }}</h6>
              <div>
                {{ currentPoolName }}
              </div>
            </span>
            <span class="col text-right">
              <b-button size="sm" @click='showadvancedoptions = !showadvancedoptions' variant="light">
                <template v-if="showadvancedoptions">
                  {{ $t('global.packUp') }}
                </template>
                <template v-else>
                  {{ $t('global.advancedOptions') }}
                </template>
              </b-button>
            </span>
            <text-overlay-loading class="col-auto" :show="loadingAction">
              <b-button id="trade" size="lg" variant="danger" @click='handle_trade' :disabled='selldisabled'>
                {{ $t('instantSwap.confirm') }}
              </b-button>
            </text-overlay-loading>
          </div>
        </div>
      </div>
    </b-container>

    <balances-info
      :class = '{[$route.name]: true}'
      :bal_info = 'bal_info'
      :total = 'balTotal'
      :l_info = 'l_info'
      :totalShare = 'totalShare'
      :staked_info = 'staked_info'
      :totalStake = 'totalStake'
      :fee = 'fee'
      :admin_fee = 'admin_fee'
      :currencies = 'currencies'
      />

      <div class='exchange' v-if=false>
          <div class='exchangefields'>
              <fieldset class='item'>
                  <legend>From:</legend>
                  <div class='maxbalance' @click='set_max_balance'>
                      Max:
                      <span
                          v-show="(currentPool == 'susdv2' && from_currency == 3 || currentPool == 'sbtc' && from_currency == 2)
                                    && maxBalanceText != '0.00'"
                      >
                          {{maxSynthText}}/
                      </span>
                      <span>{{maxBalanceText}}</span>
                      <span v-show='susdWaitingPeriod' class='susd-waiting-period'>
                          <span class='tooltip'>
                              <img src='@/assets/clock-regular.svg' class='icon small'>
                              <span class='tooltiptext'>
                                  Cannot transfer during waiting period. {{ (susdWaitingPeriodTime).toFixed(0) }} secs left.
                              </span>
                          </span>
                      </span>
                      <span v-show="(currentPool == 'susdv2' && from_currency == 3 || currentPool == 'sbtc' && from_currency == 2)
                                      && maxBalanceText != '0.00'" 
                          class='tooltip'> [?]
                          <span class='tooltiptext long'>
                              Max transferrable amount is {{ maxSynthText }}. You can free the remaining balance by settling.
                          </span>
                      </span>
                  </div>
                  <ul>
                      <li>
                          <input type="text" id="from_currency" :disabled='disabled' name="from_currency" value='0.00'
                          :style = "{backgroundColor: fromBgColor}"
                          @input='set_to_amount'
                          v-model='fromInput'>
                          <p class='actualvalue' v-show='swapwrapped'>
                              ≈ {{toFixed(actualFromValue)}} {{Object.keys(currencies)[this.from_currency] | capitalize}}
                          </p>
                          <p class='actualvalue' v-show="['sbtc', 'ren'].includes(currentPool)">
                              ≈ {{ actualFromValue }}$
                          </p>
                      </li>
                      <li class='coins' v-for='(currency, i) in Object.keys(currencies)'>
                          <input type="radio" :id="'from_cur_'+i" name="from_cur" :value='i' v-model='from_currency'>
                          <label :for="'from_cur_'+i">
                              <img 
                                  :class="{'token-icon': true, [currency+'-icon']: true, 'y': swapwrapped}" 
                                  :src='getTokenIcon(currency)'>
                              <span v-show="!swapwrapped && !['tbtc', 'ren', 'sbtc'].includes(currentPool)">{{currency | capitalize}}</span>
                              <span v-show="swapwrapped || ['tbtc', 'ren', 'sbtc'].includes(currentPool)">{{currencies[currency]}}</span>
                          </label>
                      </label>
                      </li>
                  </ul>
              </fieldset>
              <fieldset class='item iconcontainer' @click='swapInputs'>
                  <img :src="publicPath + 'exchange-alt-solid.svg'" id='exchangeicon'/>
              </fieldset>
              <fieldset class='item'>
                  <legend>To:</legend>
                  <div class='maxbalance2'>Max: <span></span> </div>
                  <ul>
                      <li>
                          <input type="text" 
                          id="to_currency" 
                          name="to_currency" 
                          value="0.00" 
                          disabled
                          :style = "{backgroundColor: bgColor}"
                          v-model='toInput'>
                          <p class='actualvalue' v-show='swapwrapped'>
                              ≈ {{toFixed(actualToValue)}} {{Object.keys(currencies)[this.to_currency] | capitalize}}
                          </p>
                          <p class='actualvalue' v-show="['ren', 'sbtc'].includes(currentPool)">
                              ≈ {{ actualToValue }}$
                          </p>
                      </li>
                      <li class='coins' v-for='(currency, i) in Object.keys(currencies)'>
                          <input type="radio" :id="'to_cur_'+i" name="to_cur" :value='i' v-model='to_currency'>
                          <label :for="'to_cur_'+i">
                              <img 
                                  :class="{'token-icon': true, [currency+'-icon']: true, 'y': swapwrapped}" 
                                  :src='getTokenIcon(currency)'>
                              <span v-show="!swapwrapped && !['tbtc', 'ren'].includes(currentPool)">{{currency | capitalize}}</span>
                              <span v-show="swapwrapped || ['tbtc', 'ren'].includes(currentPool)">{{currencies[currency]}}</span>
                          </label>
                      </label>
                      </li>
                  </ul>
              </fieldset>
          </div>
          <p class='exchange-rate'>
              Exchange rate
              <span @click='swapExchangeRate' class='clickable underline'>
                  {{getPair(swaprate)}}
                  <img src='@/assets/sync-solid.svg' class='swaprates-icon'>
              </span> (including fees): 
              <span id="exchange-rate" @click='swapExchangeRate' class='clickable'>
                  {{exchangeRateSwapped}}
              </span>
          </p>
          <ul>
              <li>
                  <input id="inf-approval" type="checkbox" name="inf-approval" v-model='inf_approval'>
                  <label for="inf-approval">Infinite approval - trust this contract forever
                      <span class='tooltip'>[?]
                          <span class='tooltiptext long'>
                              Preapprove the contract to to be able to spend any amount of your coins. You will not need to approve again.
                          </span>
                      </span>
                  </label>
              </li>
              <li>
                  <input id='swapw' type='checkbox' name='swapw' v-model = 'swapwrapped'>
                  <label for='swapw' v-show = "!['susdv2', 'tbtc', 'ren', 'sbtc'].includes(currentPool)">Swap wrapped</label>
              </li>
          </ul>
          <div>
              <button class='simplebutton advancedoptions' @click='showadvancedoptions = !showadvancedoptions'>
                  Advanced options
                  <span v-show='!showadvancedoptions'>▼</span>
                  <span v-show='showadvancedoptions'>▲</span>
              </button>
              <div v-show='showadvancedoptions'>
                  <fieldset>
                      <legend>Advanced options:</legend>
                      <div id='max_slippage'><span>Max slippage:</span> 
                          <input id="slippage05" type="radio" name="slippage" value='0.005' @click='maxSlippage = 0.5; customSlippageDisabled = true'>
                          <label for="slippage05">0.5%</label>

                          <input id="slippage1" type="radio" name="slippage" checked value='0.01' @click='maxSlippage = 1; customSlippageDisabled = true'>
                          <label for="slippage1">1%</label>

                          <input id="custom_slippage" type="radio" name="slippage" value='-' @click='customSlippageDisabled = false'>
                          <label for="custom_slippage" @click='customSlippageDisabled = false'>
                              <input type="text" id="custom_slippage_input" :disabled='customSlippageDisabled' name="custom_slippage_input" v-model='maxInputSlippage'> %
                          </label>
                          <span class='tooltip' v-show='showSlippageTooLow'>
                              <img class='icon small hoverpointer warning' :src="publicPath + 'exclamation-circle-solid.svg'">
                              <span class='tooltiptext'>
                                  Max slippage value is likely too low and the transaction may fail
                              </span>
                          </span>
                      </div>
                      <gas-price></gas-price>
                  </fieldset>
              </div>
          </div>
          <p class='simple-error' v-show="exchangeRate<=0.98 && (to_currency > 0 && !['ren', 'sbtc'].includes(currentPool))">
              Warning! Exchange rate is too low!
          </p>
          <p class='simple-error' v-show="exchangeRate<=0.98 && ['ren', 'sbtc'].includes(currentPool)">
              Warning! Exchange rate is too low!
          </p>
          <p class='simple-error' v-show="exchangeRate<=0.95 && (to_currency == 0 && !['ren', 'sbtc'].includes(currentPool))">
              Warning! Exchange rate is too low!
          </p>
          <p class='trade-buttons' v-show="['ren', 'sbtc'].includes(currentPool)">
              <a href='https://bridge.renproject.io/'>Mint/redeem renBTC</a>
          </p>
          <!-- <p class='simple-error' id='no-balance-synth' v-show='notEnoughBalanceSynth'>
              Max balance you can use is {{ (+maxSynthBalance).toFixed(2) }}
          </p> -->
          <p class='trade-buttons'>
              <button id="trade" @click='handle_trade'>
                  Sell <span class='loading line' v-show='loadingAction'></span>
              </button>
          </p>
          <div class='info-message gentle-message waiting-message' v-show='show_loading'>
              <span v-html='waitingMessage'></span>
              <span class='loading line'></span>
          </div>
          <p class='simple-error' id='no-balance' v-show='selldisabled'>
              Not enough balance for 
              <span v-show='!swapwrapped'>{{Object.keys(currencies)[from_currency] | capitalize}}</span>
              <span v-show='swapwrapped'>{{Object.values(currencies)[from_currency]}}</span>. <span>Swap is not available.</span>
          </p>
          <div class='simple-error pulse' v-show="susdWaitingPeriod">
              Cannot transfer {{ currentPool == 'susdv2' ? 'sUSD' : 'sBTC' }} during waiting period. {{ (susdWaitingPeriodTime).toFixed(0) }} secs left.
          </div>
          <div class='info-message gentle-message' v-show='estimateGas'>
              Estimated tx cost: {{ (estimateGas * gasPrice / 1e9 * ethPrice).toFixed(2) }}$
          </div>

      </div>
</div>
</template>

<script>
    import * as common from '../../utils/common.js'
    import { notify, notifyHandler, notifyNotification } from '../../init'
    import { getters, contract as currentContract, gas as contractGas} from '../../contract'
    import * as helpers from '../../utils/helpers'
    import allabis from '../../allabis'
    import * as priceStore from '../common/priceStore'

    import * as gasPriceStore from '../common/gasPriceStore'
    import GasPrice from '../common/GasPrice.vue'

    import * as errorStore from '../common/errorStore'

    import BigNumber from 'bignumber.js'
    import OneSplit from '../graphs/OneSplit'
    import RootSub from '../root/RootSub.vue'
    import TextOverlayLoading from '../../components/common/TextOverlayLoading'
    import * as volumeStore from '../common/volumeStore'
    import { floor } from '../../utils/math/round'
    import store from '../../store'
    import { ModelValueEther } from '../../model/index1'

    import BalancesInfo from '../BalancesInfo'

    let { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic')

    var cBN = (val) => new BigNumber(val);

	export default {

        components: {
            GasPrice,
            BalancesInfo,
            OneSplit,
            TextOverlayLoading,
            RootSub
        },

        data: () => ({
            disabled: true,
            from_currency: 0,
            to_currency: 1,
            inf_approval: true,
            fromInput: '1.00',
            toInput: 0,
            updateTimer: null,
            btcPrice: null,
            maxBalance: -1,
            maxSynthBalance: -1,
            susdWaitingPeriod: false,
            susdWaitingPeriodTime: 0,
            maxBalanceText: 0,
            maxSynthText: 0,
            promise: helpers.makeCancelable(Promise.resolve()),
            exchangeRate: 'Not available',
            swaprate: false,
            bgColor: '#505070',
            fromBgColor: 'blue',
            maxSlippage: 1,
            maxInputSlippage: '',
            customSlippageDisabled: true,
            swapwrapped: false,
            coins: [],
            get showadvancedoptions() {
                return localStorage.getItem('advancedoptions') === 'true' 
                    || +this.fromInput > 5000 || (['ren', 'sbtc'].includes(currentContract.currentContract) && +this.fromInput > 0.5)
            },
            set showadvancedoptions(val) {
                console.log(val, "VAL TO SET")
                localStorage.setItem('advancedoptions', val)
            },
            show_loading: false,
            waitingMessage: '',
            userInteracted: false,

            estimateGas: 0,
            ethPrice: 0,
            icontype: '',
            loadingAction: false,

            interval: null,
            depositc: false,
            maxSlippageMode: 2,
            bestPool: null,

            c_rates: []
        }),
        async created() {
            this.$watch(()=>currentContract.default_account, (val, oldval) => {
                if(!val || !oldval) return;
                if(val.toLowerCase() != oldval.toLowerCase()) this.mounted();
            })
            this.$watch(()=>currentContract.initializedContracts, val => {
                if(val) this.mounted();
                console.timeEnd('initswap')
            })
        },
        watch: {
          from_currency(val, oldval) {
              if(val == this.to_currency) {
                  this.to_currency = oldval;
              }
              //this.swapExchangeRate()
              this.from_cur_handler()
          },
          to_currency(val, oldval) {
              //this.swapExchangeRate()
              this.to_cur_handler()
          },
          swapwrapped() {
            this.mounted()
          },
          maxBalance(val) {
            let amount = val / this.precisions[this.from_currency]

            this.maxBalanceText = currentContract.default_account ? this.toFixed(amount) : 0;
          },
          maxSynthBalance(val) {
              if(isNaN(val)) return '0.00';
              this.maxSynthText = this.toFixed(val)
          },
          triggerEstimateGas: {
              handler: async function triggerEstimateGas() {
                  let i = this.from_currency
                  let j = this.to_currency
                  let promises = await Promise.all([helpers.getETHPrice()])
                  this.ethPrice = promises[0]
                  this.estimateGas = (this.swapwrapped || ['okuu', 'usd5', 'qusd5', 'usdg5'].includes(this.currentPool))
                    ? contractGas.swap[this.currentPool].exchange(i, j) / 2
                    : contractGas.swap[this.currentPool].exchange_underlying(i, j) / 2
              },
              immediate: true
          },
          fromInput() {
              this.userInteracted = true
          },
        },
        computed: {
          ...getters,
          currentPoolName () {
            const poolName = {
              dusd: 'dForce',
              okuu: 'oku',
              usd5: '5pool',
              qusd5: 'qian',
              usdg5: 'usdg',
            }

            return poolName[this.currentPool] || this.currentPool
          },
          currentPoolTokenCoinMark () {
            const conversions = {
              'dfi': 'i',
              'dusd': 'd',
              'qusd5': 'usd5',
              'usdg5': 'usd5',
            }

            return conversions[this.currentPool] || ''
          },
          customMaxSlippageInput: {
            get () {
              return this.maxInputSlippage
            },
            set (val) {
              this.maxSlippage = this.maxInputSlippage = val
            }
          },
          selectMaxSlippageMode: {
            get () {
              return this.maxSlippageMode
            },
            set (val) {
              const { maxInputSlippage } = this
              const modes = {
                1: 0.5,
                2: 1,
                3: 2,
                4: maxInputSlippage
              }

              this.maxSlippageMode = val
              this.maxSlippage = modes[val]
            }
          },
          currencie_coins () {
            let result = []

            if (['qusd5', 'usdg5'].includes(currentContract.currentContract)) {
              if (this.swapwrapped) {
                result = this.currencies
              } else {
                result = this.allCurrencies[currentContract.currentContract + '_base']
              }
            } else {
              result = this.currencies
            }

            return result
          },
          messages () {
            const { $i18n, selldisabled, susdWaitingPeriod, susdWaitingPeriodTime, maxSynthBalanceText, notEnoughBalanceSynth, exchangeRate, swapwrapped, currencie_coins, from_currency, to_currency, showNoBalanceWarning, warningNoPool, currentPool } = this
            const result = []
            const from = swapwrapped
              ? Object.values(currencie_coins)[from_currency]
              : Object.keys(currencie_coins)[from_currency]
            const to = swapwrapped
              ? Object.values(currencie_coins)[to_currency]
              : Object.keys(currencie_coins)[to_currency]

            if (exchangeRate<=0.98 && (to_currency > 0 && !['ren', 'sbtc'].includes(currentPool) || ['ren', 'sbtc'].includes(currentPool)) ||
              exchangeRate<=0.95 && (to_currency == 0 && !['ren', 'sbtc'].includes(currentPool))) {
              result.push({
                type: 'error',
                msg: $i18n.t('instantSwap.exchangeEateLowWarning')
              })
            }

            notEnoughBalanceSynth && !susdWaitingPeriod && +maxSynthBalanceText > 0 &&
              result.push({
                  type: 'error',
                  msg: $i18n.t('instantSwap.maxSynthBalance')
              })

            susdWaitingPeriod &&
              result.push({
                type: 'error',
                msg: $i18n.t('instantSwap.susdWaitingPeriod', [
                  from_currency == 5 ? 'sUSD' : 'sBTC',
                  (susdWaitingPeriodTime).toFixed(0)
                ])
              })

            // showNoBalanceWarning
            selldisabled &&
              result.push({
                type: 'error',
                msg: $i18n.t('instantSwap.noBalanceWarning', [
                  swapwrapped
                    ? from
                    : helpers.capitalize(from)
                ])
              })

            warningNoPool &&
              result.push({
                type: 'info',
                msg: $i18n.t('instantSwap.warningNoPool', [warningNoPool])
              })

            return result
          },
          poolVolumeUSD() {
            return volumeStore.state.volumes[this.currentPool == 'iearn' ? 'y' : this.currentPool == 'susdv2' ? 'susd' : this.currentPool][0]
          },
          poolDailyVolUSD () {
            let result = ''

            const transforms = {
              'usdg5': 'USDG5',
              'qusd5': 'QUSD5',
              'usd5': 'USD5',
              'dusd': 'dUSD',
              'dfi': 'iUSD',
            }
            if (transforms[this.currentPool]) {
              result = store.pool[transforms[this.currentPool]].dailyVol
            }

            return result
          },
          totalBalances() {
            return this.bal_info && this.bal_info.reduce((a, b) => a + b, 0) || null
          },
          precisions() {
            let coin_precisions = allabis[currentContract.currentContract].coin_precisions

            if (['qusd5', 'usdg5'].includes(this.currentPool)) {
              coin_precisions = allabis[currentContract.currentContract].base_precisions
            }
            return this.swapwrapped
              ? allabis[currentContract.currentContract].wrapped_precisions
              : coin_precisions
          },
            actualFromValue() {
                if(!this.swapwrapped && !['ren','sbtc'].includes(this.currentPool)) return;
                if(['ren', 'sbtc'].includes(this.currentPool)) return (this.fromInput * this.btcPrice).toFixed(2)
                return (this.fromInput * this.c_rates[this.from_currency] * this.toFixed(this.precisions[this.from_currency]))
            },
            actualToValue() {
                if(!this.swapwrapped && !['ren', 'sbtc'].includes(this.currentPool)) return;
                if(['ren', 'sbtc'].includes(this.currentPool)) return (this.toInput * this.btcPrice).toFixed(2)
                return (this.toInput * this.c_rates[this.to_currency] * this.toFixed(this.precisions[this.to_currency]))
            },
            minAmount() {
                if(['tbtc', 'ren', 'sbtc'].includes(currentContract.currentContract)) return 1e-8
                return 0.01
            },
            selldisabled() {
              return this.maxBalance != -1 && +this.fromInput > +this.maxBalance / this.precisions[this.from_currency] && this.userInteracted
            },
            notEnoughBalanceSynth() {
              return this.currentPool == 'susdv2' && this.from_currency == 3 && cBN(this.fromInput).gt(cBN(this.maxSynthBalance))
            },
            exchangeRateSwapped() {
              let from = !this.swapwrapped ? helpers.capitalize(Object.keys(this.currencie_coins)[this.from_currency]) : Object.values(this.currencie_coins)[this.from_currency]
              let to = !this.swapwrapped ? helpers.capitalize(Object.keys(this.currencie_coins)[this.to_currency]) : Object.values(this.currencie_coins)[this.to_currency]

              return this.swaprate
                ? `1 ${to} = ${(1 / this.exchangeRate).toFixed(4)} ${from}`
                : `1 ${from} = ${this.exchangeRate} ${to}`
            },
            publicPath() {
                return process.env.BASE_URL
            },
            getCurrFrom() {
              return Object.keys(this.currencie_coins)[this.from_currency]
            },
            getCurrTo() {
              return Object.keys(this.currencie_coins)[this.to_currency]
            },
            checkExchangeRate () {
              return !isNaN(this.exchangeRate)
            },
            gasPrice() {
                return gasPriceStore.state.gasPrice
            },
            gasPriceWei() {
                return gasPriceStore.state.gasPriceWei
            },
            triggerEstimateGas() {
                console.log("TRIGGER ESTIMATE GAS")
                return this.swapwrapped, this.from_currency, this.to_currency, Date.now()
            },
            showSlippageTooLow() {
                return this.maxInputSlippage != '' && +this.maxInputSlippage < 0.2
            },
            // bestPoolText() {
            //   return this.currentPool
            //     // if(this.bestPool === null) return 'Not available'
            //     // return ['compound', 'y', 'busd', 'susd', 'pax', 'ren', 'sbtc', '1split', 'dfi', 'dusd'][this.bestPool]
            // },
        },
        mounted () {
            if(currentContract.initializedContracts) {
              this.mounted();
            }
        },
        methods: { 
            async mounted() {
              if(['susd', 'susdv2', 'tbtc', 'ren', 'sbtc'].includes(currentContract.currentContract)) this.depositc = true;
                else this.depositc = false;

              if(['ren', 'sbtc'].includes(currentContract.currentContract)) this.btcPrice = await priceStore.getBTCPrice()
              if(['tbtc', 'ren', 'sbtc'].includes(currentContract.currentContract)) this.fromInput = '0.0001'

              if (['qusd5', 'usdg5'].includes(currentContract.currentContract)) {
                let underlying_coins_len = currentContract.underlying_coins.length

                this.c_rates = this.swapwrapped
                  ? currentContract.c_rates.slice(0, underlying_coins_len)
                  : currentContract.c_rates.slice(underlying_coins_len)

                this.coins = this.swapwrapped
                  ? currentContract.underlying_coins
                  : currentContract.base_coins
              } else {
                this.c_rates = currentContract.c_rates
                this.coins = this.swapwrapped
                  ? currentContract.coins
                  : currentContract.underlying_coins
              }

              this.disabled = false;

              this.from_currency = 0
              this.to_currency = 1

              this.from_cur_handler()
            },
            getTokenIcon(token) {
                return helpers.getTokenIcon(token, this.swapwrapped, this.currentPool)
            },
            getPair(inverse = false) {
                let from = !this.swapwrapped ? Object.keys(this.currencie_coins)[this.from_currency] : Object.values(this.currencie_coins)[this.from_currency]
                let to = !this.swapwrapped ? Object.keys(this.currencie_coins)[this.to_currency] : Object.values(this.currencie_coins)[this.to_currency]
                from = helpers.capitalize(from)
                to = helpers.capitalize(to)
                if(!inverse) return from + '/' + to
                if(inverse) return to + '/' + from
            },
            toFixed(num) {
                if(num == '' || num == undefined || +num == 0) return '0.00'
                if(!BigNumber.isBigNumber(num)) num = +num
                if(['tbtc', 'ren', 'sbtc'].includes(currentContract.currentContract)) return floor(num, 8).toFixed(8)
                return floor(num, 2).toFixed(2)
            },
            getCurrency(i) {
                if(!this.swapwrapped && !['susdv2', 'tbtc', 'ren', 'sbtc'].includes(this.currentPool)) return (Object.keys(this.currencie_coins)[i]).toUpperCase()
                return Object.values(this.currencie_coins)[i] 
            },
            swapInputs() {
                //look no temp variable! :D
                [this.fromInput, this.toInput] = [this.toInput, this.fromInput]
                this.from_currency = this.to_currency
                this.from_cur_handler()
            },
            swapExchangeRate() {
                if(isNaN(this.exchangeRate)) return;
                this.swaprate = !this.swaprate
            },
            async set_to_amount() {
                this.promise.cancel()
                let promise = this.setAmountPromise()
                this.interval && !this.interval.stopped && clearIntervalAsync(this.interval)

                if (typeof (+this.fromInput) === 'number' && !isNaN(+this.fromInput)) {
                  this.interval = setIntervalAsync(this.set_to_amount, 3000)
                }

                try {
                    let [dy, dy_, dx_, balance] = await promise
                    this.toInput = dy;
                    this.exchangeRate = (dy_ / dx_).toFixed(4);
                    if(this.swapwrapped) {
                        let cdy_ = (dy_ * this.c_rates[this.to_currency] * allabis[currentContract.currentContract].wrapped_precisions[this.to_currency])
                        let cdx_ = (dx_ * this.c_rates[this.from_currency] * allabis[currentContract.currentContract].wrapped_precisions[this.from_currency])
                        this.exchangeRate = (cdy_ / cdx_).toFixed(4)
                    }
                    if(this.exchangeRate <= 0.98) this.bgColor = 'red'
                    else this.bgColor= '#505070'
                    if(isNaN(this.exchangeRate)) this.exchangeRate = "Not available"
                    let amount = Math.floor(
                        100 * parseFloat(balance) / this.precisions[this.to_currency]
                      ) / 100

                    this.disabled = false;
                }
                catch(err) {
                    console.error(err)
                    this.disabled = true
                }
                finally {
                    this.set_from_amount(this.from_currency);
                }
                this.promise = helpers.makeCancelable(promise)
            },
            async from_cur_handler() {
              if (this.from_currency > this.precisions.length) {
                  this.from_currency = 0
                }
                if (this.to_currency > this.precisions.length) {
                  this.to_currency = 1
                }

              // console.log('coins', this.coins)
                let currentAllowance = cBN(await this.coins[this.from_currency].methods.allowance(currentContract.default_account, currentContract.swap_address).call())
                let maxAllowance = currentContract.max_allowance.div(cBN(2))
                if (currentAllowance.gt(maxAllowance))
                    this.inf_approval = true;
                else
                    this.inf_approval = false;

                await this.set_from_amount(this.from_currency);
                await this.set_to_amount();
            },
            async to_cur_handler() {
                if (this.to_currency == this.from_currency) {
                    if (this.to_currency == 0) {
                        this.from_currency = 1;
                    }
                    await this.set_from_amount(this.from_currency);
                }
                await this.set_to_amount();
            },
            async set_max_balance() {
              let balance
              if(this.currentPool == 'susdv2' && this.from_currency == 3 ||
                  this.currentPool == 'sbtc' && this.from_currency == 2) {
                balance = await this.coins[this.from_currency].methods.transferableSynths(this.default_account).call();
                if(this.susdWaitingPeriod) balance = 0
              }
              else
                  balance = await this.coins[this.from_currency].methods.balanceOf(currentContract.default_account).call();
              let amount = cBN(balance).div(this.precisions[this.from_currency]).toString()
              this.fromInput = currentContract.default_account ? this.toFixed(amount) : 0
              await this.set_to_amount();
            },
            async highlight_input() {
                let balanceCall = this.coins[this.from_currency].methods.balanceOf(this.default_account).call()
                let balance = parseFloat(await this.coins[this.from_currency].methods.balanceOf(this.default_account).call()) /
                        this.precisions[this.from_currency];
                if (this.fromInput > balance)
                    this.fromBgColor = 'red'
                else
                    this.fromBgColor = 'blue'
            },
            async set_from_amount(i) {
              // console.log('this.coins[i]', i, this.coins[i])
                let balanceCalls = [[this.coins[i]._address, this.coins[i].methods.balanceOf(this.default_account).encodeABI()]]
                if(this.currentPool == 'susdv2' && i == 3 || this.currentPool == 'sbtc' && i == 2) {
                    balanceCalls.push([this.coins[i]._address, this.coins[i].methods.transferableSynths(this.default_account).encodeABI()])
                    let currencyKey = '0x7355534400000000000000000000000000000000000000000000000000000000'
                    if(this.currentPool == 'sbtc') 
                        currencyKey = '0x7342544300000000000000000000000000000000000000000000000000000000'
                    balanceCalls.push([
                        currentContract.snxExchanger._address, 
                        currentContract.snxExchanger.methods
                        .maxSecsLeftInWaitingPeriod(currentContract.default_account, currencyKey)
                        .encodeABI()
                    ])
                }
                let aggcalls = await currentContract.multicall.methods.aggregate(balanceCalls).call()
                let balances = aggcalls[1].map(hex => web3.eth.abi.decodeParameter('uint256', hex))
                let amounts = balances.map(balance => currentContract.default_account ? balance : 0)
                this.maxBalance = amounts[0]
                let highlight_red = this.fromInput > this.maxBalance / this.precisions[this.from_currency]
                if(this.currentPool == 'susdv2' && i == 3 || this.currentPool == 'sbtc' && i == 2) {
                    this.maxSynthBalance = cBN(amounts[1]).div(1e18).toFixed()
                    this.susdWaitingPeriod = (+amounts[2] != 0)
                    this.susdWaitingPeriodTime = +amounts[2]
                    console.log(this.maxSynthBalance, "MAX SYNTH BALANCE", this.susdWaitingPeriod, "SUSD WAITING PERIOD")
                    highlight_red = this.fromInput > this.maxSynthBalance
                    if(this.susdWaitingPeriod) highlight_red = true
                }
                if(highlight_red) 
                    this.fromBgColor = 'red'
                else 
                    this.fromBgColor = 'blue'
            },
            setAmountPromise() {
              let promise = new Promise(async (resolve, reject) => {
                if (this.from_currency > this.precisions.length) {
                  this.from_currency = 0
                }
                if (this.to_currency > this.precisions.length) {
                  this.to_currency = 1
                }

                var i = this.from_currency;
                var j = this.to_currency;
                var dx_ = this.fromInput;

                  var dx = cBN(Math.round(dx_ * this.precisions[i])).toFixed(0,1);
                  let calls = []

                  if (!this.swapwrapped && ['qusd5', 'usdg5'].includes(this.currentPool) && currentContract.base_coins_idx[i] != null ) {
                    calls.push([currentContract.base_pool._address, currentContract.base_pool.methods.balances(currentContract.base_coins_idx[i]).encodeABI()])
              // console.log('-- base_pool', i, await currentContract.base_pool.methods.balances(currentContract.base_coins_idx[i]).call() )
                  } else {
                    calls.push([currentContract.swap._address, currentContract.swap.methods.balances(i).encodeABI()])
            //  console.log('-- swap', i, await currentContract.swap.methods.balances(i).call() )
                  }

                  if(!this.swapwrapped && !['susdv2', 'tbtc', 'ren', 'okuu', 'usd5'].includes(this.currentPool)) {
          // console.log('get_dy_underlying', i, j, dx)
                    calls.push([currentContract.swap._address, currentContract.swap.methods.get_dy_underlying(i, j, dx).encodeABI()])
          // console.log(await currentContract.swap.methods.get_dy_underlying(i, j, dx).call() )
                  } else {
          // console.log('get_dy', i, j, dx)
                    //dx = cBN(dx).times(currentContract.c_rates[i])
                    calls.push([currentContract.swap._address, currentContract.swap.methods.get_dy(i, j, dx).encodeABI()])
                  }

                  calls.push([this.coins[this.to_currency]._address , this.coins[this.to_currency].methods.balanceOf(currentContract.default_account).encodeABI()])

                  let aggcalls = await currentContract.multicall.methods.aggregate(calls).call(undefined, 'pending')
                  let decoded = aggcalls[1].map(hex => currentContract.web3.eth.abi.decodeParameter('uint256', hex))
                  let [b, get_dy_underlying, balance] = decoded

                  b = +b * this.c_rates[i];
                  // In c-units
                  var dy_ = +get_dy_underlying / this.precisions[j];
                  var dy = this.toFixed(dy_);
// console.log('------', dy, dy_, dx_, balance, this.c_rates)
                  resolve([dy, dy_, dx_, balance])
              })
              return helpers.makeCancelable(promise);
            },
            setLoadingAction() {
                this.loadingAction = true
                setTimeout(() => this.loadingAction = false, 500)
            },

            async handle_trade() {
                if(this.loadingAction) return false

                this.userInteracted = true
                // this.setLoadingAction();
                this.loadingAction = true

                this.show_loading = true;
                var i = this.from_currency
                var j = this.to_currency;

                var b = 0;

                if (!this.swapwrapped && ['qusd5', 'usdg5'].includes(this.currentPool) && currentContract.base_coins_idx[i] != null ) {
                  b = parseInt(await currentContract.base_pool.methods.balances(currentContract.base_coins_idx[i]).call()) / this.c_rates[i]
                } else {
                  b = parseInt(await currentContract.swap.methods.balances(i).call()) / this.c_rates[i]
                }

                let maxSlippage = this.maxSlippage / 100;
                let currency = (Object.keys(this.currencie_coins)[this.from_currency]).toUpperCase()
                if(this.swapwrapped) currency = Object.values(this.currencie_coins)[this.from_currency]
                if(this.maxInputSlippage) maxSlippage = this.maxInputSlippage / 100;
                var dx = Math.floor(this.fromInput * this.precisions[i]);
                if(BN(this.maxBalance).gt(0) && BN(this.maxBalance).div(this.precisions[i]).minus(BN(this.fromInput)).lt(BN(this.minAmount))) {
                    dx = this.maxBalance
                }
                if(
                    (this.currentPool == 'susdv2' && this.from_currency == 3 ||
                        this.currentPool == 'sbtc' && this.from_currency == 2) &&
                    BN(this.maxSynthBalance).gt(0) && 
                    BN(this.maxSynthBalance).minus(BN(this.fromInput)).lt(BN(this.minAmount))
                ) {
                  dx = BN(this.maxSynthBalance).times(1e18).toFixed(0,1)
                }
                let min_dy_method = 'get_dy_underlying'
                if(this.swapwrapped || ['susdv2', 'tbtc', 'ren', 'sbtc', 'okuu', 'usd5'].includes(this.currentPool)) {
                    min_dy_method = 'get_dy'
                }

                var min_dy = BN(await currentContract.swap.methods[min_dy_method](i, j, BN(dx).toFixed(0,1)).call())

// console.log('min_dy', min_dy, '=', i, j, BN(dx).toFixed(0,1))
                min_dy = min_dy.times(1-maxSlippage)
                dx = cBN(dx.toString()).toFixed(0,1);
                this.waitingMessage = this.$i18n.t('instantSwap.approveExchange', [this.fromInput, this.getCurrency(this.from_currency)])
                var { dismiss } = notifyNotification(this.waitingMessage)


                const maxAllowanceQuantity = this.inf_approval
                  ? currentContract.max_allowance
                  : dx
                try {
                  let req = await common.ensure_underlying_allowance(i, maxAllowanceQuantity, [], undefined, this.swapwrapped, null, this)
                  if (req !== false) return false
                } catch(err) {
                  console.error(err)
                  dismiss()
                  this.waitingMessage = '',
                  this.show_loading = false
                  this.loadingAction = false
                  throw err;
                }

                dismiss()
                this.waitingMessage = this.$i18n.t('instantSwap.confirmSwapFromFor',
                  [`${this.fromInput} ${this.getCurrency(this.from_currency)}`, `${this.toFixed(BN(min_dy).div(this.precisions[j]).toString())} ${this.getCurrency(this.to_currency)}`])

                var { dismiss } = notifyNotification(this.waitingMessage)
                min_dy = cBN(min_dy).toFixed(0);
                let exchangeMethod = currentContract.swap.methods[
                  ['okuu', 'usd5'].includes(this.currentPool)
                    ? 'exchange'
                    : 'exchange_underlying'
                ]
                if(this.swapwrapped || ['susdv2', 'tbtc', 'ren', 'sbtc'].includes(this.currentPool)) exchangeMethod = currentContract.swap.methods.exchange
                try {
                  await helpers.setTimeoutPromise(100)
                  await exchangeMethod(i, j, dx, BN(min_dy).toFixed(0,1))
                    .send({
                        from: currentContract.default_account,
                        gasPrice: this.gasPriceWei,
                        // gas: this.swapwrapped
                        //   ? contractGas.swap[this.currentPool].exchange(i, j)
                        //   : contractGas.swap[this.currentPool].exchange_underlying(i, j),
                    })
                    .once('transactionHash', hash => {
                      dismiss()
                      notifyHandler(hash)
                      this.waitingMessage = this.$i18n.t('instantSwap.waitingSwapTransactionNoFurther', [hash])
                    })
                } catch(err) {
                    console.error(err)
                    dismiss()
                    errorStore.handleError(err)
                    this.waitingMessage = '';
                    this.show_loading = '';
                    this.loadingAction = false
                    throw err;
                }
                this.waitingMessage = ''
                this.show_loading = false;
                this.estimateGas = 0;
                await common.update_fee_info();
                this.from_cur_handler();
                let balance = await this.coins[i].methods.balanceOf(currentContract.default_account).call();
                this.maxBalance = balance;
                this.loadingAction = false
            }
        },

        beforeDestroy() {
            this.interval && clearIntervalAsync(this.interval)
        },
    }
</script>

<style scoped>
	/* .actualvalue {
        margin: 0.5em 0 0 0;
        text-align: right;
        font-size: 0.9em;
    }
    #no-balance {
        text-align: center;
    }
    .swapBTC-container {
        margin-top: 1em;
    }
    .pulse {
        animation: pulse 1s 3;
        margin-bottom: 8px;
    }
    .advancedoptions {
        margin-top: 1em;
    }
    .advancedoptions + div legend {
        text-align: center;
    } */
</style>