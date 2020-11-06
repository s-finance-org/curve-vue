<template>
	<div>
    <!-- FIXME: common -->
    <div class="total-bg">
      <b-container class="d-flex py-4 px-md-5">
        <b-navbar-nav class="navbar-tabs flex-row flex-wrap px-md-5">
          <b-nav-item :to="{ name: 'Liquidity', params: { pool: 'qusd5' } }">qian</b-nav-item>
          <b-nav-item :to="{ name: 'Liquidity', params: { pool: 'usd5' } }">5pool</b-nav-item>
          <b-nav-item :to="{ name: 'Liquidity', params: { pool: 'dusd' } }">dForce</b-nav-item>
          <b-nav-item :to="{ name: 'Liquidity', params: { pool: 'dfi' } }">dfi</b-nav-item>
          <b-nav-item :to="{ name: 'Liquidity', params: { pool: 'susdv2' } }">sUSD</b-nav-item>
        </b-navbar-nav>
      </b-container>
      <b-container class="py-4 px-md-5">
        <div class="d-flex align-items-center px-md-5 flex-wrap">
          <div class="total-box p-2 mr-4 d-none d-lg-flex box-98 flex-wrap" :class="{ 'icons-box-2': Object.keys(currencies).length === 2 }">
            <img v-for='(currency, i) in Object.keys(currencies)' :key="'icon-'+currency" class="icon-w-40"
              :class="{'token-icon': true, [currency+'-icon']: true, 'y': depositc && !isPlain}"
              :src='getTokenIcon(currency)'>
          </div>
          <h3 class="mb-0 col-4 py-3">{{ currentPoolName }}<br/>{{ $t('liquidity.name') }}</h3>
          <div class="col-12 col-md d-flex px-0">
            <div class="total-box col px-4 py-3 mr-4">
              <h6 class="text-black-65">{{ $t('global.totalBalances') }}</h6>
              <text-overlay-loading :show="totalBalances === null">
                <h4 class="mb-0">${{ totalBalances | formatNumber(2) }}</h4>
              </text-overlay-loading>
            </div>
            <!-- <div class="total-box col px-4 py-3">
              <h6 class="text-black-65">{{ $t('global.dailyVol') }}</h6>
              <text-overlay-loading :show="poolVolumeUSD == -1">
                <h4 class="mb-0">${{ poolVolumeUSD && poolVolumeUSD | formatNumber(2) }}</h4>
              </text-overlay-loading>
            </div> -->
          </div>
        </div>
      </b-container>
    </div>

        <b-container>
          <root-sub />
          <h4 class="mt-4 mb-2">
            {{ $t('liquidity.reservesTitle') }}
          </h4>

          <div class="box mb-5">
            <div class="px-4 pt-4">
              <div class="row">
                <span class="col-12 col-md mb-4" v-for='(currency, i) in Object.keys(currencies)' :key="'currency-'+currency">
                  <h6 class="mb-1 text-black-65">{{currency | capitalize}}</h6>
                  <text-overlay-loading inline :show="!(bal_info && bal_info[i])">
                    {{bal_info && bal_info[i] | formatNumber(2) }} ({{((bal_info && bal_info[i] * 100) / totalBalances) | toFixed2}}%)
                  </text-overlay-loading>
                </span>
              </div>
            </div>
          </div>

          <div class="box mb-4 px-4 py-3">
            <b-tabs pills nav-class="tabs-nav" class="mt-1">
              <b-tab :title="$t('global.deposit')" class="pt-3" active>
                <small class="d-flex mb-3">{{ $t('liquidity.depositTip') }}</small>

                <div class="row">
                  <div class="col-12 col-lg mb-2 line-right">
                    <div role="group" class="mb-3" v-for='(currency, i) in Object.keys(currencie_coins)' :key="'icon-'+currency">
                      <div class="currentInput d-flex">
                        <span class="coin d-flex align-items-center">
                          <img class="icon-w-20 mr-2"
                            :class="{'token-icon': true, [currency+'-icon']: true, 'y': depositc && !isPlain}" 
                            :src='getTokenIcon(currency, depositc)'>
                          <span v-show='depositc'>{{currencie_coins[currency]}}
                            <!-- <span v-show="!(currency == 'usdt' && currentPool == 'usdt' || currency == 'pax') 
                                    && !['susdv2', 'tbtc', 'ren', 'sbtc'].includes(currentPool)"> 
                              (in {{currency | capitalize}}) 
                            </span> -->
                          </span>
                          <span v-show='!depositc'>{{currency | capitalize}}</span>
                        </span>
                        <input class="form-control" type="text"
                          :id="'currency_'+i"
                          :disabled='disabled'
                          name="from_cur"
                          value='0.00'
                          :placeholder="$t('liquidity.depositWrappedPlaceholder')"
                          @input='change_currency(i, true)'
                          v-model = 'deposit_inputs[i]'>
                      </div>
                      <b-form-text id="from-val-help" class="text-black-65 mt-0">
                        {{ $t('instantSwap.max') }}:
                        <span v-show="(currentPool == 'susdv2' && i == 3 || currentPool == 'sbtc' && i == 2)
                                                        && maxBalanceCoin(i) != '0.00'">{{transferableBalanceText}}/</span>
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
                      </b-form-text>
                    </div>
                    <div class="mt-4">
                      <b-form-checkbox v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                      <b-form-checkbox @change='handle_sync_balances_proportion' :disabled='disabledButtons' checked v-model='sync_balances' name="sync-balances">{{ $t('liquidity.depositBalancedProportion') }}</b-form-checkbox>
                      <b-form-checkbox @change='handle_sync_balances' :disabled='disabledButtons' checked v-model='max_balances' name="max-balances">{{ $t('liquidity.depositUseMaximumAvailable') }}</b-form-checkbox>
                      <b-form-checkbox v-show = "!['susd','susdv2','tbtc', 'ren', 'sbtc', 'okuu', 'usd5'].includes(currentPool)" checked v-model='depositc' name="inf-approval" >{{ $t('liquidity.depositWrapped', [currentPoolTokenCoinMark]) }}</b-form-checkbox>
                    </div>
                  </div>

                  <div class="col-12 col-lg mb-2 d-flex flex-column text-black-65">
                    <label class="mb-3" v-show="estimateGas">
                      {{ $t('instantSwap.txCost') }}
                      <span class="float-right">{{ (estimateGas * gasPrice / 1e9 * ethPrice).toFixed(2) }} USD</span>
                    </label>
                    <label class="mb-3">
                      {{ $t('global.maxSlippage') }}
                      <span class="float-right">{{ ((1 - getDepositMaxSlippage) * 100).toFixed(2) }}%</span>
                    </label>
                    <label class="mb-3" v-show='showSlippage && slippage < -0.005'>
                      {{ $t('liquidity.highSlippage') }}
                      <span class="float-right">{{ (-slippage*100).toFixed(3) }}%</span>
                    </label>
                    <label class="mb-3" v-show='showSlippage && slippage <= 0 && slippage >= -0.005'>
                      {{ $t('liquidity.slippage') }}
                      <span class="float-right">{{ (-slippage*100).toFixed(3) }}%</span>
                    </label>
                    <label class="mb-3" v-show='showSlippage && slippage > 0'>
                      {{ $t('liquidity.bonus') }}
                      <span class="float-right">{{ (slippage*100).toFixed(3) }}%</span>
                    </label>
                    <label class="mb-3">
                      <span class="text-danger-1">{{ $t('liquidity.willLeastReceive') }}</span>
                      <span class="float-right">
                        <span class="text-danger-1 text-18">{{ lpCrvReceivedText }}</span> {{ currentPoolTokenName }}
                      </span>
                    </label>
                  </div>
                </div>

                <div class="mt-3">
                  <button id="migrate-new" @click='handle_migrate_new' v-show="currentPool == 'compound' && oldBalance > 0">Migrate from old</button>
                  <b-alert :show='show_loading' variant="dark" v-html='waitingMessage'></b-alert>
                  <b-alert :show='compareInputsWarning.length && !max_balances' variant="dark">
                    Not enough balance for currencies {{ compareInputsWarning.toString() }}
                      <p v-show='compareInputsWarning.length == currencie_coins_n - 1'> 
                          Maybe you forgot to uncheck the first 
                          "Add all coins in a balanced proportion" checkbox?
                      </p>
                  </b-alert>
                  <b-alert :show='depositingZeroWarning && !max_balances' variant="dark">
                    You're depositing 0 coins.
                    <p>
                      Maybe you forgot to uncheck the first 
                      "Add all coins in a balanced proportion" checkbox?
                    </p>
                  </b-alert>
                  <b-alert :show="txErrorMessage != null" variant="error">{{ txErrorMessage }}</b-alert>
                </div>

                <div v-show='showadvancedoptions'>
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

                <div class="d-flex mt-4 justify-content-end">
                  <span class="col text-right pt-4">
                    <b-button size="sm" @click='showadvancedoptions = !showadvancedoptions' variant="light">
                      <template v-if="showadvancedoptions">
                        {{ $t('global.packUp') }}
                      </template>
                      <template v-else>
                        {{ $t('global.advancedOptions') }}
                      </template>
                    </b-button>
                  </span>
                  <text-overlay-loading :show="loadingAction == 1">
                    <b-button size="lg" variant="danger"
                      id="add-liquidity"
                      @click='justDeposit = true; handle_add_liquidity()'
                      :disabled="currentPool == 'susdv2' && slippage < -0.03 || depositingZeroWarning || isZeroSlippage">
                      {{ $t('global.deposit') }}
                    </b-button>
                  </text-overlay-loading>
                  <!-- <text-overlay-loading :show="loadingAction == 2">
                    <b-button size="lg" variant="outline-secondary"
                      id='add-liquidity-stake'
                      @click='justDeposit = false; deposit_stake()'
                      :disabled = 'slippage < -0.03 || depositingZeroWarning || isZeroSlippage'
                      >
                      {{ $t('liquidity.depositStakeGauge') }}
                    </b-button>
                  </text-overlay-loading> -->
                </div>
              </b-tab>
              <b-tab :title="$t('global.withdraw')" class="pt-3">
                <small class="d-flex mb-3">{{ $t('liquidity.withdrawAvailableAmount') }}：
                  <text-overlay-loading :show="gauges.balanceOf.loading">
                    {{ gauges.balanceOf.cont }} {{ currentPoolTokenName }}
                  </text-overlay-loading>
                </small>

                <div class="row">
                  <div class="col-12 col-lg mb-2 line-right">
                    <small class="mb-2">{{ $t('temp') }}</small>
                    <div role="group" class="mb-3" v-for='(currency, i) in Object.keys(currencie_coins_withdrawc)' :key="'icon-'+currency">
                        <div class="currentInput d-flex">
                          <span class="coin d-flex align-items-center" @click='handleCheck(i)'>
                            <input class="mr-2" type="radio" :id="'to_cur_'+i" name="to_cur" :value='i' :checked='to_currency === i'>
                            <!-- <b-form-radio :id="'to_cur_'+i" name="withdraw_all" :value='i' @click='handleCheck(i)'> -->
                              <img class="icon-w-20 mr-2"
                                :class="{'token-icon': true, [currency+'-icon']: true, 'y': depositc && !isPlain}" 
                                :src='getTokenIcon(currency, withdrawc)'>
                              <span v-show='withdrawc'>{{currencie_coins_withdrawc[currency]}}
                                <!-- <span v-show="!(currency == 'usdt' && currentPool == 'usdt') && !['susdv2', 'ren', 'sbtc'].includes(currentPool)">(in {{currency | capitalize}})</span> -->
                              </span>
                              <span v-show="!withdrawc && !['susdv2', 'tbtc', 'ren', 'sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentPool)">{{currency | capitalize}}</span>
                              <span v-show="!withdrawc && ['susdv2', 'tbtc', 'ren', 'sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentPool)">{{currencie_coins_withdrawc[currency]}}</span>
                            <!-- </b-form-radio> -->
                          </span>
                          <input class="form-control" type="text"
                            :id="'currency_'+i"
                            name="from_cur"
                            v-model = 'withdraw_inputs[i]'
                            :disabled = "currentPool == 'susd'"
                            :ref="`withdraw_inputs${i}`"
                            @input='handle_change_amounts(i)'
                            >
                        </div>
                      <!-- <b-form-text class="text-black-65 mt-0">
                        {{ $t('instantSwap.max') }}: {{ withdraw_maxs[i] }}
                      </b-form-text> -->
                    </div>

                    <div class="mt-4">
                      <b-form-checkbox v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                      <b-form-checkbox @change='handle_sync_withdraw_avg_balances' :disabled='disabledButtons' v-model='sync_withdraw_avg_balances' name="sync-withdraw-avg-balances">{{ $t('liquidity.withdrawBalancedProportion') }}</b-form-checkbox>
                      <b-form-checkbox v-show = "!['susd', 'susdv2', 'tbtc', 'ren', 'sbtc', 'okuu', 'usd5'].includes(currentPool)" v-model='withdrawc' name="inf-approval" >{{ $t('liquidity.withdrawWrapped', [currentPoolTokenCoinMark]) }}</b-form-checkbox>
                    </div>
                  </div>

                  <div class="col-12 col-lg mb-2 d-flex flex-column text-black-65">
                    <label class="mb-3" v-show="estimateGas">
                      {{ $t('instantSwap.txCost') }}
                      <span class="float-right">{{ (estimateGas * gasPrice / 1e9 * ethPrice).toFixed(2) }} USD</span>
                    </label>
                    <label class="mb-3">
                      {{ $t('global.maxSlippage') }}
                      <span class="float-right">{{ ((getWithdrawMaxSlippage - 1) * 100).toFixed(2) }}%</span>
                    </label>
                    <label class="mb-3" v-show='showSlippage && slippage < -0.005'>
                      {{ $t('liquidity.highSlippage') }}
                      <span class="float-right">{{ (-slippage*100).toFixed(3) }}%</span>
                    </label>
                    <label class="mb-3" v-show='showSlippage && slippage <= 0 && slippage >= -0.005'>
                      {{ $t('liquidity.slippage') }}
                      <span class="float-right">{{ (-slippage*100).toFixed(3) }}%</span>
                    </label>
                    <label class="mb-3" v-show='showSlippage && slippage > 0'>
                      {{ $t('liquidity.bonus') }}
                      <span class="float-right">{{ (slippage*100).toFixed(3) }}%</span>
                    </label>
                    <!-- <label class="mb-3">
                      <span class="text-danger-1">{{ $t('liquidity.willReceive') }}</span>
                      <span class="float-right">
                        <span class="text-danger-1 text-18">{{ lpCrvReceivedText }}</span>
                      </span>
                    </label> -->
                  </div>
                </div>

                <div class="mt-3">
                  <button id="migrate-new" @click='handle_migrate_new' v-show="currentPool == 'compound' && oldBalance > 0">Migrate from old</button>
                  <b-alert :show='show_loading' variant="dark" v-html='waitingMessage'></b-alert>
                  <b-alert :show='compareInputsWarning.length && !max_balances' variant="dark">
                    Not enough balance for currencie_coins {{ compareInputsWarning.toString() }}
                      <p v-show='compareInputsWarning.length == currencie_coins_n_withdrawc - 1'>
                          Maybe you forgot to uncheck the first 
                          "Add all coins in a balanced proportion" checkbox?
                      </p>
                  </b-alert>
                  <b-alert :show='depositingZeroWarning && !max_balances' variant="dark">
                    You're depositing 0 coins.
                    <p>
                      Maybe you forgot to uncheck the first 
                      "Add all coins in a balanced proportion" checkbox?
                    </p>
                  </b-alert>
                  <b-alert :show="txErrorMessage != null" variant="error">{{ txErrorMessage }}</b-alert>
                </div>

                <div v-show='showadvancedoptions'>
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

                <div class="d-flex mt-4 justify-content-end">
                  <span class="col text-right pt-4">
                    <b-button size="sm" @click='showadvancedoptions = !showadvancedoptions' variant="light">
                      <template v-if="showadvancedoptions">
                        {{ $t('global.packUp') }}
                      </template>
                      <template v-else>
                        {{ $t('global.advancedOptions') }}
                      </template>
                    </b-button>
                  </span>
                  <text-overlay-loading :show="loadingAction == 1">
                    <b-button size="lg" variant="danger"
                      id="remove-liquidity"
                      @click='handle_remove_liquidity()'
                      v-show="currentPool != 'susd'"
                      :disabled="['susdv2', 'sbtc'].includes(currentPool) && slippage < -0.03 && !warninglow || show_nobalance == true"
                      >
                      {{ $t('global.withdraw') }}
                    </b-button>
                  </text-overlay-loading>
                  <text-overlay-loading :show="loadingAction == 1">
                    <b-button size="lg" variant="danger"
                      id='remove-liquidity-unstake'
                      v-show = "['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool) && staked_balance > 0 "
                      :disabled = 'slippage < -0.03'
                      @click='handle_remove_liquidity(true, false, true)'
                      >
                      Withdraw & claim 
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <!-- <b-tab :title="$t('global.poolProfit')" class="pt-3">
                <h6 class="text-black-65 mb-2">{{ $t('liquidity.dailyProfit') }}</h6>
                <h4 class="mb-0">?? USD</h4>

                {{ available != -1 }}

                {{ showProfit }}
                  <span v-show='available != -1 '> {{ toFixed(showProfit) }}</span>

                <h4 class="mb-0" v-show='available != -1 '> {{ toFixed(showProfit) }} USD</h4>

              </b-tab> -->
            </b-tabs>
          </div>

        </b-container>

        <!-- deposit -->
        <div class="add-liquidity" v-if=false>
                <fieldset class="currencies">
                    <legend>Currencies:</legend>
                    <ul>
                        <li v-for='(currency, i) in Object.keys(currencies)'>
                            <label :for="'currency_'+i">
                              <span class='currency_label'>
                                    <img 
                                        :class="{'token-icon': true, [currency+'-icon']: true, 'y': depositc && !isPlain}" 
                                        :src='getTokenIcon(currency, depositc)'>
                                    <span v-show='depositc'>{{currencies[currency]}}
                                      <span v-show="!(currency == 'usdt' && currentPool == 'usdt' || currency == 'pax') 
                                              && !['susdv2', 'tbtc', 'ren', 'sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentPool)"> 
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
                              v-model = 'deposit_inputs[i]'
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
                    <li v-show = "!['susd','susdv2','tbtc','ren','sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentPool)">
                        <input id="depositc" type="checkbox" name="inf-approval" checked v-model='depositc'>
                        <label for="depositc">Deposit wrapped</label>
                    </li>
                </ul>
                <div class='simple-error pulse' v-show="susdWaitingPeriod">
                    Cannot transfer {{ currentPool == 'susdv2' ? 'sUSD' : 'sBTC' }} during waiting period. {{ (susdWaitingPeriodTime).toFixed(0) }} secs left.
                </div>
                <p style="text-align: center" class='buttons'>
                  slippage: {{ slippage }} {{ slippage < -0.03 }} | 
                  depositingZeroWarning: {{ depositingZeroWarning }} | 
                  isZeroSlippage: {{ isZeroSlippage }} | 
                    <button id="add-liquidity" 
                        :disabled="currentPool == 'susdv2' && slippage < -0.03 || depositingZeroWarning || isZeroSlippage"
                        @click='justDeposit = true; handle_add_liquidity()' 
                        >
                            Deposit <span class='loading line' v-show='loadingAction == 1'></span>
                    </button>

                    <button 
                        id='add-liquidity-stake' 
                        v-show="['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool) && hasRewards" 
                        :disabled = 'slippage < -0.03 || depositingZeroWarning || isZeroSlippage'
                        @click = 'justDeposit = false; deposit_stake()'>
                        Deposit and stake <span class='loading line' v-show='loadingAction == 2'></span>
                    </button>
                    <button id='stakeunstaked' 
                        v-show="totalShare > 0 && ['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool) && hasRewards"
                        :disabled='stakePercentageInvalid' 
                        @click='stakeTokens()'
                        >
                        Stake unstaked <span class='loading line' v-show='loadingAction == 3'></span>
                    </button>
                    <p class='info-message gentle-message' v-show="lpCrvReceived > 0">
                        You'll receive minimum {{ lpCrvReceivedText }} {{ currentPoolTokenName }}<sub>{{ ((1 - getDepositMaxSlippage) * 100).toFixed(2)}}% max slippage</sub>

                        <span class='curvelpusd'> 
                            1 {{ currentPoolTokenName }} = {{ (1 * virtual_price).toFixed(6) }} 
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
                                <div v-show="hasRewards && totalShare > 0 && ['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool)">
                                    <label for='stakepercentage'>Stake %</label>
                                    <input id='stakepercentage' v-model='stakepercentage' :class="{'invalid': stakePercentageInvalid}">
                                    <button id='stakeunstaked' 
                                        v-show="totalShare > 0 && ['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool)"
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

                    <Slippage/>
                </p>
        </div>

        <!-- withdraw -->
        <div class="add-liquidity" v-if=false>
            <fieldset class="percentage">
                <legend>
                  Share of liquidity (%)
                <input id='showstaked' type='checkbox' name='showstaked' v-model = 'showstaked'>
                <label for='showstaked' v-show="['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool)"> Show staked </label>
                </legend>
                <ul>
                    <li>
                        <input type="text" 
                        id="liquidity-share" 
                        name="liquidity-share" 
                        v-model='share'
                        @input='handle_change_share'
                        @focus='handle_change_share'
                        :style='shareStyles'>
                    </li>
                </ul>
            </fieldset>
            <fieldset class="currencies">
                <legend>Currencies:</legend>
                <ul>
                    <li v-for='(currency, i) in Object.keys(currencies)'>
                        <label :for="'currency_'+i" class='currency_label'>
                            <img 
                                :class="{'token-icon': true, [currency+'-icon']: true, 'y': withdrawc, [currentPool]: true}" 
                                :src='getTokenIcon(currency, withdrawc)'>
                          <span v-show='withdrawc'>{{currencies[currency]}}
                            <span v-show="!(currency == 'usdt' && currentPool == 'usdt') && !['susdv2', 'ren', 'sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentPool)">(in {{currency | capitalize}})</span>
                          </span>
                          <span v-show="!withdrawc && !['susdv2', 'tbtc', 'ren', 'sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentPool)">{{currency | capitalize}}</span>
                          <span v-show="!withdrawc && ['susdv2', 'tbtc', 'ren', 'sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentPool)">{{currencies[currency]}}</span>
                        </label>
                        <input type="text" 
                          :id="'currency_'+i" 
                          name="from_cur" 
                          v-model = 'withdraw_inputs[i]'
                          :style = "inputStyles[i]"
                          :disabled = "currentPool == 'susd'"
                          :ref="`withdraw_inputs${i}`"
                          @input='handle_change_amounts(i)'
                          @focus='handle_change_amounts(i)'>
                    </li>
                    <li v-show = "!['susd','susdv2','tbtc','ren', 'sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentPool)">
                        <input id="withdrawc" type="checkbox" name="withdrawc" v-model='withdrawc'>
                        <label for="withdrawc">Withdraw wrapped</label>
                    </li>
                </ul>
            </fieldset>
            <fieldset v-show = "currentPool != 'susd'">
              <legend>
                    Withdraw % in:
                    <span class='tooltip'> [?]
                        <span class='tooltiptext long'>
                            You can also withdraw in one coin by typing in a currency field
                        </span>
                    </span>
                </legend>
              <ul>
                <li v-show = "!['susdv2','tbtc','ren', 'sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentPool)">
                  <input type='radio' id='to_cur_comb' name="to_cur" :value='10' :checked='to_currency === 10' @click='handleCheck(10)'>
                  <label for='to_cur_comb'>
                    Combination of all coins
                    <span v-for='(currency, i) in Object.keys(currencies)'>
                      <span v-show='i > 0'>+</span>
                      <img 
                        :class="{'token-icon': true, [currency+'-icon']: true, 'y': withdrawc, [currentPool]: true}" 
                        :src='getTokenIcon(currency, withdrawc)'>
                    </span>
                  </label>
                </li>
                <li v-for='(currency, i) in Object.keys(currencies)' class='withdrawin'>
                      <input type="radio" :id="'to_cur_'+i" name="to_cur" :value='i' :checked='to_currency === i' @click='handleCheck(i)'>
                      <label :for="'to_cur_'+i">
                            <img 
                                :class="{'token-icon': true, [currency+'-icon']: true, 'y': withdrawc, [currentPool]: true}" 
                                :src='getTokenIcon(currency, withdrawc)'> 
                                <span v-show='!withdrawc'> {{ currency | capitalize }} </span>
                                <span v-show='withdrawc'> {{ currencies[currency] }} </span>
                        </label>
                  </li>
                  <li>
                    <input type='checkbox' id='donate_dust' name='donate_dust' v-model='donate_dust'>
                    <label 
                            for='donate_dust' 
                            v-show="!['tbtc', 'ren', 'sbtc'].includes(currentPool)">Donate dust
                                <span class='tooltip'>[?]<span class='tooltiptext'>(may use less gas)</span>
                            </span>
                    </label>
                  </li>
              </ul>
            </fieldset>
            <div id='max_slippage' v-show='showWithdrawSlippage'><span>Max slippage:</span>
                <input id="slippage02" type="radio" name="slippage" value='0.2' v-model='maxSlippage'>
                <label for="slippage02">0.2%</label>

                <input id="slippage1" type="radio" name="slippage" checked value='3' v-model='maxSlippage'>
                <label for="slippage1">3%</label>

                <input id="custom_slippage" type="radio" name="slippage" value='-' @click='customippageDisabled = false'>
                <label for="custom_slippage" @click='customSlippageDisabled = false'>
                    <input type="text" id="custom_slippage_input" :disabled='customSlippageDisabled' name="custom_slippage_input" v-model='maxInputSlippage'> %
                </label>
            </div>

            <gas-price></gas-price>

            <p v-show='showInfApprovalZap'>
                <input id='inf_approval' type='checkbox' v-model='inf_approval'>
                <label for='inf_approval'>Infinite approval - trust zap contract forever</label>
            </p>

            <div id='withdraw_buttons' class='buttons'>
                <div class='info-message gentle-message' id='amount-warning' v-show = 'nobalance'>
                You don't have any available amount to withdraw
                <!-- <div v-show="currentPool == 'susdv2'">
                  (You have {{(staked_balance / 1e18) | toFixed2}} staked)
                </div> -->
              </div>
                <button id="remove-liquidity"
                    :disabled="['susdv2', 'sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentPool) && slippage < -0.03 && !warninglow || show_nobalance == true"
                    @click='handle_remove_liquidity()' v-show="currentPool != 'susd'">
                    Withdraw <span class='loading line' v-show='loadingAction == 1'></span>
                </button>
                <button 
                    id='remove-liquidity-unstake'
                    v-show = "['susdv2', 'sbtc','y','iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool) && staked_balance > 0 "
                    :disabled = 'slippage < -0.03'
                    @click='handle_remove_liquidity(true, false, true)'>
                    Withdraw & claim <span class='loading line' v-show='loadingAction == 2'></span>
                </button>
                <button id='claim-snx'
                    @click='claim_SNX(false)'
                    v-show="['susdv2', 'sbtc','y','iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool) && pendingSNXRewards > 0"
                >
                    Claim {{(pendingSNXRewards / 1e18).toFixed(2)}} {{ ['y','iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool) ? 'YFI' : 'SNX' }}
                    <span v-show="currentPool == 'sbtc'"> + {{(pendingRENRewards / 1e18).toFixed(2)}} REN</span>
                </button>
                <button id='claim-bpt'
                    @click='claim_SNX(true)'
                    v-show="['sbtc'].includes(currentPool) && pendingBALRewards > 0"
                >
                    Claim {{(pendingBALRewards / 1e18).toFixed(6)}} BPT
                </button>
                <button id='claim-snxbpt' 
                    @click='claim_SNX(true, false)'
                    v-show="['sbtc'].includes(currentPool) && withdrawBALPool > 0"
                >
                    Withdraw {{(withdrawSNXPool / 1e18).toFixed(0)}} SNX + {{(withdrawRENPool / 1e18).toFixed(0)}} REN
                </button>
                <!-- <button id='claim-adai' 
                    @click='showModal = true'
                    v-show="['y', 'iearn', 'dfi', 'dusd'].includes(currentPool) && withdrawADAI > 0"
                >
                    {{(pendingSNXRewards / 1e18).toFixed(2)}} YFI -> {{(withdrawADAI / 1e18).toFixed(2)}} aDAI
                    <span class='tooltip'> [?]
                        <span class='tooltiptext long'>
                            Burn your YFI tokens to receive aDAI tokens
                        </span>
                    </span>
                </button> -->
                <button id='unstake-snx'
                    @click='handle_remove_liquidity(true, true)'
                    v-show="['susdv2', 'sbtc','y','iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool) && staked_balance > 0"
                  >Unstake
                </button>
                <router-link v-show="['susdv2'].includes(currentPool) && oldBalance > 0" class='button' to='/susd/withdraw' id='withdrawold'>Withdraw old</router-link>
                <button @click='migrateUSDT' v-show="currentPool == 'usdt'">Migrate to PAX</button>
                <button id="remove-liquidity" @click='handle_remove_liquidity' v-show="currentPool == 'susd'">Withdraw old</button>
                <p v-show="['ren', 'sbtc'].includes(currentPool)">
                    <a href='https://bridge.renproject.io/'> Mint/redeem renBTC </a>
                </p>
                <div id='mintr' v-show="['susdv2', 'sbtc'].includes(currentPool)">
                    <a href = 'https://mintr.synthetix.io/' v-show="['susdv2', 'sbtc'].includes(currentPool)" target='_blank' rel="noopener noreferrer">Manage staking in Mintr</a>
                    <a href = 'https://ygov.finance/' v-show="['y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool)" target='_blank' rel="noopener noreferrer"> yGov. </a>
                </div>
                <div class='info-message gentle-message' v-show='show_loading'>
                    <span v-html='waitingMessage'></span> <span class='loading line'></span>
                </div>
                <div class='info-message gentle-message' v-show='estimateGas'>
                    Estimated tx cost: {{ (estimateGas * gasPrice / 1e9 * ethPrice).toFixed(2) }}$
                </div>
                <div class='simple-error' v-show='warninglow'>
                    You're withdrawing too little amount in one coin
                </div>
                <Slippage v-bind="{show_nobalance, show_nobalance_i}"/>
            </div>

            <div v-show="staked_balance > 0 && ['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool)">
                <button class='simplebutton advancedoptions' @click='showadvancedoptions = !showadvancedoptions'>
                    Advanced unstaking options
                    <span v-show='!showadvancedoptions'>▼</span>
                    <span v-show='showadvancedoptions'>▲</span>
                </button>
                <div v-show='showadvancedoptions'>
                    <fieldset>
                        <legend>Advanced unstaking options:</legend>
                        <div>
                            <div id='stakedbalance'>
                                Staked tokens: <span @click='unstakepercentage = staked_balance / 1e18'>{{ (staked_balance / 1e18).toFixed(2) }}</span>
                            </div>
                            <div>
                                <label for='unstakepercentage'>Unstake:</label>
                                <input id='unstakepercentage' v-model='unstakepercentage' :class="{'invalid': unstakePercentageInvalid}">
                                <button id='unstakestaked' 
                                    v-show="staked_balance > 0 && ['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(currentPool)"
                                    :disabled='unstakePercentageInvalid' 
                                    @click='unstakeStaked()'
                                >
                                    Unstake staked
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

        </div>


	</div>
</template>

<script>
	  import Vue from 'vue'
    import { notify, notifyHandler, notifyNotification } from '../../init'
    import * as common from '../../utils/common.js'
    import { getters, contract as currentContract, gas as contractGas } from '../../contract'
    import allabis from '../../allabis'
    // const susdv2 = allabis.susdv2
    import * as helpers from '../../utils/helpers'
    import * as volumeStore from '../common/volumeStore'

    import * as gasPriceStore from '../common/gasPriceStore'
    import GasPrice from '../common/GasPrice.vue'
    import RootSub from '../root/RootSub.vue'

    import * as errorStore from '../common/errorStore'

    import BN from 'bignumber.js'
    import store from '../../store'
    import { valueModel } from '../../model'
    import { ModelValueEther } from '../../model/index1'

    import Slippage from '../common/Slippage.vue'
    import TextOverlayLoading from '../../components/common/TextOverlayLoading'
    import { floor } from '../../utils/math/round'

    export default {
    	components: {
    		Slippage, GasPrice, TextOverlayLoading, RootSub
    	},
    	data: () => ({
    		disabled: true,
    		disabledButtons: true,
    		sync_balances: false,
    		max_balances: true,
        inf_approval: true,
        // 
    		wallet_balances: [],
    		wallet_balances_withdraw: [],
        transferableBalance: null,
        susdWaitingPeriod: false,
        susdWaitingPeriodTime: 0,
    		balances: [],
    		deposit_inputs: [],
        withdraw_inputs: [],
        withdraw_maxs: [],
    		amounts: [],
    		bgColors: [],
    		depositc: false,
    		coins: [],
    		rates: [],
    		swap_address: currentContract.swap_address,
        lpCrvReceived: null,
    		show_loading: false,
    		waitingMessage: '',
    		estimateGas: 0,
    		ethPrice: 0,
        justDeposit: false,
        stakepercentage: 100,
        get showadvancedoptions() {
            return localStorage.getItem('advancedoptions') === 'true' 
        },
        set showadvancedoptions(val) {
            localStorage.setItem('advancedoptions', val)
        },
        maxSlippage: 1,
        maxInputSlippage: '',
        customSlippageDisabled: true,
        loadingAction: false,
        errorStaking: false,
    		slippagePromise: helpers.makeCancelable(Promise.resolve()),

        hasRewards: true,

        // withdraw
        sync_withdraw_avg_balances: false,
        share: '100.00',
    		shareStyles: {
    			backgroundColor: '#707070',
    			color: '#d0d0d0',
    		},
    		inputStyles: [],
    		calc_balances: [],
    		staked_balance: BN(0),
    		token_balance: BN(0),
    		token_supply: 0,
    		show_nobalance: false,
    		show_nobalance_i: 0,
    		bgColor: [],
    		to_currency: 10,
    		test: null,
    		withdrawc: false,
    		donate_dust: true,
    		showstaked: false,
        pendingSNXRewards: 0,
        pendingRENRewards: 0,
        pendingBALRewards: 0,
        balancerPool: null,
        withdrawBALPool: 0,
        withdrawSNXPool: 0,
        withdrawRENPool: 0,
        // withdrawADAI: 0,
        show_loading: false,
        showWithdrawSlippage: false,
// maxSlippage: 0.2,
        setSlippage: false,
        unstakepercentage: 0,
        warninglow: false,
        showModal: false,

        maxSlippageMode: 2
      }),
      async created() {
          this.$watch(()=>currentContract.default_account, (val, oldval) => {
              if(!val || !oldval) return;
              if(val.toLowerCase() == oldval.toLowerCase()) return;
              this.mounted();
          })
          this.$watch(()=>currentContract.initializedContracts, val => {
              if(val) this.mounted();
          })
          this.$watch(()=>currentContract.currentContract, (val, oldval) => {
              this.setInputStyles(false, val, oldval)
              if(currentContract.initializedContracts) this.mounted();
          })

          let key = this.currentPool == 'iearn'
            ? 'y'
            : this.currentPool == 'susdv2'
              ? 'susd'
              : this.currentPool

          let volume = volumeStore.state.volumes[key][0] || 0
          if(this.isBTC) {
            this.btcPrice = await priceStore.getBTCPrice()
          }
          if(volume == -1) {
            let stats = await fetch(`${window.domain}/raw-stats/apys.json`)
            stats = await stats.json()
            for(let [key, value] of Object.entries(volumeStore.state.volumes)) {
              if(volumeStore.state.volumes[key][0] == -1) {
                let volume = key == 'ren' ? stats.volume.ren2 : key == 'sbtc' ? stats.volume.rens : stats.volume[key]
                Vue.set(volumeStore.state.volumes[key], 0,  volume || 0)
                if(['tbtc', 'ren', 'sbtc'].includes(key)) {
                  Vue.set(volumeStore.state.volumes[key], 0,  volume * this.btcPrice || 0)
                  Vue.set(volumeStore.state.volumes[key], 1,  volume || 0)
                }
              }
            }
          }
          this.hasLoadedInfo && this.updateShares()
        },
      watch: {
        async depositc(val, oldval) {
          this.changeSwapInfo(val)
          await this.handle_sync_balances()
          !this.max_balances && this.highlightAllInputs();
          //await Promise.all([...Array(currentContract.N_COINS).keys()].map(i=>this.change_currency(i, false)))
          await this.calcSlippage(this.deposit_inputs, true)
          await this.getLPCrvReceived()
        },
        getDepositMaxSlippage() {
          this.getLPCrvReceived()
        },

        // withdraw
        to_currency(val) {
          if(this.share == 0 || this.share == '---') this.share = 100
          this.setInputStyles()
          if(val !== null) this.handle_change_share();
        },
        withdrawc (val) {
          if(this.share == '---' ) return;

          if (this.withdraw_inputs.length > this.currencie_coins_n_withdrawc) {
            this.withdraw_inputs = this.withdraw_inputs.slice(0, this.currencie_coins_n_withdrawc)
          } else if (this.withdraw_inputs.length < this.currencie_coins_n_withdrawc) {
            Array(this.currencie_coins_n_withdrawc).fill(0).forEach((item, idx) => {
              !this.withdraw_inputs[idx] && Vue.set(this.withdraw_inputs, idx, 0)
            })
          }

          if(!val && this.to_currency === null) {
            this.to_currency = 10
          }

          if (this.sync_withdraw_avg_balances) {
            this.handle_change_share()
          } else {
            this.to_currency = 0
          }
          // if(val && this.to_currency !== null) this.to_currency = null
        },
        maxSlippage() {
            this.setSlippage = true
        },
        maxInputSlippage(val) {
            if(val) this.setSlippage = true
        },
      },
      computed: {
        ...getters,
        precisions () {
          let coin_precisions = allabis[currentContract.currentContract].coin_precisions

          if (['qusd5'].includes(this.currentPool)) {
            coin_precisions = allabis[currentContract.currentContract].base_precisions
          }
          return this.depositc
            ? allabis[currentContract.currentContract].wrapped_precisions
            : coin_precisions
        },
        precisions_withdrawc () {
          let coin_precisions = allabis[currentContract.currentContract].coin_precisions

          if (['qusd5'].includes(this.currentPool)) {
            coin_precisions = allabis[currentContract.currentContract].base_precisions
          }
          return this.withdrawc
            ? allabis[currentContract.currentContract].wrapped_precisions
            : coin_precisions
        },
        // 6
        p_rates () {
          return this.precisions.map(item => 1 / item)
        },
        p_rates_withdrawc () {
          return this.precisions_withdrawc.map(item => 1 / item)
        },
        // 5
        c_rates () {
          let result = []

          if (['qusd5'].includes(currentContract.currentContract)) {
            let underlying_coins_len = currentContract.underlying_coins.length

            result = this.depositc
              ? currentContract.c_rates.slice(0, underlying_coins_len)
              : currentContract.c_rates.slice(underlying_coins_len)
          } else {
            result = currentContract.c_rates
          }

          return result
        },
        // c_rates_withdrawc () {
        //   let result = []

        //   if (['qusd5'].includes(currentContract.currentContract)) {
        //     let underlying_coins_len = currentContract.underlying_coins.length

        //     result = this.withdrawc
        //       ? currentContract.c_rates.slice(0, underlying_coins_len)
        //       : currentContract.c_rates.slice(underlying_coins_len)
        //   } else {
        //     result = currentContract.c_rates
        //   }

        //   return result
        // },
        currencie_contract () {
          let result = currentContract.swap
          if (['qusd5'].includes(currentContract.currentContract)) {
            result = this.depositc
              ? currentContract.swap
              : currentContract.deposit_zap
          }

          return result
        },
        currencie_contract_withdrawc () {
          let result = currentContract.swap
          if (['qusd5'].includes(currentContract.currentContract)) {
            result = this.withdrawc
              ? currentContract.swap
              : currentContract.deposit_zap
          }

          return result
        },
        currencie_coins () {
          let result = {}

          if (['qusd5'].includes(currentContract.currentContract)) {
            if (this.depositc) {
              result = this.currencies
            } else {
              result = this.allCurrencies[currentContract.currentContract + '_base']
            }
          } else {
            result = this.currencies
          }

          return result
        },
        currencie_coins_withdrawc () {
          let result = {}

          if (['qusd5'].includes(currentContract.currentContract)) {
            if (this.withdrawc) {
              result = this.currencies
            } else {
              result = this.allCurrencies[currentContract.currentContract + '_base']
            }
          } else {
            result = this.currencies
          }

          return result
        },
        currencie_coins_n () {
          return Object.keys(this.currencie_coins).length
        },
        currencie_coins_n_withdrawc () {
          return Object.keys(this.currencie_coins_withdrawc).length
        },


        currentContract () {
          return currentContract
        },
        currentPoolName () {
          const poolName = {
            dusd: 'dForce',
            okuu: 'oku',
            usd5: '5pool',
            qusd5: 'qian',
          }

          return poolName[this.currentPool] || this.currentPool
        },
        currentPoolTokenName () {
          const conversions = {
            'dfi': 'iUSD',
            'dusd': 'dUSD',
            'okuu': 'OKUU',
          }
          const result = conversions[this.currentPool] || this.currentPool

          return `${result} LP token`
        },
        currentPoolTokenCoinMark () {
          const conversions = {
            'dfi': 'i',
            'dusd': 'd',
            'qusd5': 'usd5',
          }

          return conversions[this.currentPool] || ''
        },
        gauges () {
          const { currentPool } = this

          const result = {
            balanceOf: ModelValueEther.create()
          }

          const tokenKeys = {
            susdv2: 'susdv2LpToken',
            dfi: 'iUSD_LPT',
            dusd: 'dusd',
            okuu: 'okuu',
            usd5: 'usd5',
            qusd5: 'qusd5',
          }

          if (tokenKeys[currentPool]) {
            store.tokens[tokenKeys[currentPool]].getBalanceOf(result.balanceOf, currentContract.default_account)
          } else {
            currentContract.swap_token.methods.balanceOf(currentContract.default_account).call()
              .then(data => {
                result.balanceOf.ether = data
              })
          }

          return result
        },
        poolVolumeUSD() {
          return volumeStore.state.volumes[
            this.currentPool == 'iearn'
              ? 'y'
              : this.currentPool == 'susdv2'
                ? 'susd' : this.currentPool
              ][0]
        },
        totalBalances() {
          return this.bal_info && this.bal_info.reduce((a, b) => a + b, 0) || null
        },
        minAmount() {
          if(['tbtc', 'ren', 'sbtc'].includes(currentContract.currentContract)) return 1e-8
          return 0.01
        },
        calcFee() {
          return this.fee / 100 * this.currencie_coins_n / (4 * (this.currencie_coins_n -1))
        },
        compareInputsWarning() {
          let currencies = []

          for(let [i, currency] of Object.keys(this.currencies).entries()) {
              let balance = this.wallet_balances[i]
              if(this.currentPool == 'susdv2' && i == 3) {
                  balance = this.susdWaitingPeriod ? 0 : this.transferableBalance
              }
              let diff3 = BN(BN(balance).times(this.rates[i])).minus(this.deposit_inputs[i])
              if(diff3.lt(BN(-0.01))) currencies.push(this.depositc ? this.currencies[currency] : currency.toUpperCase())
          }
          return currencies
        },
        depositingZeroWarning() {
          return this.deposit_inputs.filter(v=>+v==0).length == this.currencie_coins_n && !this.disabledButtons
        },
        isPlain() {
          return ['susdv2', 'tbtc', 'ren', 'sbtc', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool)
        },
        transferableBalanceText() {
          return this.toFixed((this.transferableBalance / 1e18))
        },
        virtual_price() {
          return currentContract.virtual_price
        },
        lpCrvReceivedText() {
          return this.toFixed(this.lpCrvReceived)
        },
        gasPrice() {
          return gasPriceStore.state.gasPrice
        },
        gasPriceWei() {
          return gasPriceStore.state.gasPriceWei
        },
        stakePercentageInvalid() {
          return this.stakepercentage < 0 || this.stakepercentage > 100
        },
        getDepositMaxSlippage() {
          return (100 - +this.maxSlippage)/100
        },
        warningInputSlippage() {
          if(!this.maxInputSlippage) return false
          return +this.maxInputSlippage < 0.5
        },
        isZeroSlippage() {
          return this.maxInputSlippage !== '' && (+this.maxInputSlippage == 0 || isNaN(this.maxInputSlippage))
        },

        showSlippageTooLow() {
          return this.maxInputSlippage != '' && +this.maxInputSlippage < 0.2
        },


        // withdraw
        showMigrateNew() {
          return (this.currentPool == 'compound' && this.oldBalance > 0) || this.currentPool == 'susd'
        },
        nobalance() {
          return this.staked_balance && this.token_balance.plus(this.staked_balance).eq(BN(0))
        },
        getWithdrawMaxSlippage() {
            let maxSlippage = +this.maxSlippage;
            if(this.maxInputSlippage) maxSlippage = +this.maxInputSlippage;
            return (100 + maxSlippage)/100
        },
        minAmount() {
        if(['tbtc', 'ren', 'sbtc'].includes(currentContract.currentContract)) return 1e-8
            return 0.01
        },
        calcFee() {
            return this.fee / 100 * this.currencie_coins_n / (4 * (this.currencie_coins_n -1))
        },
        gasPrice() {
            return gasPriceStore.state.gasPrice
        },
        gasPriceWei() {
            return gasPriceStore.state.gasPriceWei
        },
        unstakePercentageInvalid() {
            return BN(this.unstakepercentage).times(1e18).gt(BN(this.staked_balance).times(1.01))
        },
        unstakeAmount() {
            return this.toFixed(BN(this.unstakepercentage / 100).times(this.staked_balance / 1e18))
        },
        showInfApprovalZap() {
          if(!this.withdrawc && this.currentPool != 'susdv2')
              return true
          if(this.share != '---' && ((this.to_currency !== null && this.to_currency < 10) || this.to_currency == 10)) {
              return true
          }
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
      },
      mounted() {
        // withdraw
        if(['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool)) {
          this.showstaked = true
        }
        this.$watch(() => this.showstaked, this.handle_change_share)

        this.setInputStyles(true)
        if(currentContract.initializedContracts) this.mounted();
      },
        methods: {
          pushBalances (i) {
            let result = []
            if (!this.depositc && ['qusd5'].includes(this.currentPool) && currentContract.base_coins_idx[i] != null ) {
              result = [currentContract.base_pool._address, currentContract.base_pool.methods.balances(currentContract.base_coins_idx[i]).encodeABI()]
            } else {
              result = [currentContract.swap._address, currentContract.swap.methods.balances(i).encodeABI()]
            }
            return result
          },
          pushBalances_withdrawc (i) {
            let result = []
            if (!this.withdrawc && ['qusd5'].includes(this.currentPool) && currentContract.base_coins_idx[i] != null ) {
              result = [currentContract.base_pool._address, currentContract.base_pool.methods.balances(currentContract.base_coins_idx[i]).encodeABI()]
            } else {
              result = [currentContract.swap._address, currentContract.swap.methods.balances(i).encodeABI()]
            }
            return result
          },
        	async stakeTokens(tokens, deposit_and_stake = false) {
                if(this.loadingAction == 3) return;
                this.setLoadingAction(3);
                if(!tokens) {
                    tokens = BN(await currentContract.swap_token.methods.balanceOf(currentContract.default_account).call());
                    tokens = BN(this.stakepercentage / 100).times(tokens)
                }
                this.waitingMessage = this.$i18n.t('liquidity.approveStakingTokens', [this.toFixed(tokens.div(BN(1e18)))])
                var { dismiss } = notifyNotification(this.waitingMessage)
                await common.ensure_stake_allowance(tokens, currentContract.curveRewards, this.inf_approval);
                dismiss()
                this.waitingMessage = `Please confirm stake transaction ${deposit_and_stake ? '(2/2)' : ''}`
                var { dismiss } = notifyNotification(this.waitingMessage)
                let promises = await Promise.all([helpers.getETHPrice()])
                this.ethPrice = promises[0]
                this.estimateGas = 200000
                try {
                  currentContract.curveRewards.methods.stake &&
                    await currentContract.curveRewards.methods.stake(tokens.toFixed(0,1)).send({
                        from: currentContract.default_account,
                        gasPrice: this.gasPriceWei,
                        gas: 400000,
                    })
                    .once('transactionHash', hash => {
				        this.waitingMessage = `Waiting for stake transaction to confirm 
                            ${deposit_and_stake ? '(2/2)' : ''}: no further action needed`
                        dismiss()
                        notifyHandler(hash)
                    })
				            currentContract.totalShare -= tokens
                    common.update_fee_info()
                }
                catch(err) {
                    console.error(err)
                    dismiss()
                    errorStore.handleError(err)
                }
            this.waitingMessage = ''
            this.show_loading = false;
          },

          async mounted(oldContract) {
            this.depositc = ['susd', 'susdv2', 'tbtc', 'ren', 'sbtc'].includes(currentContract.currentContract);
            this.changeSwapInfo(this.depositc)
            currentContract.showSlippage = false;
            currentContract.slippage = 0;
            await this.handle_sync_balances();
            await this.getLPCrvReceived()
            await this.calcSlippage(this.deposit_inputs, true)
            let calls = [...Array(this.currencie_coins_n).keys()].map(i=>[this.coins[i]._address, 
              this.coins[i].methods.allowance(currentContract.default_account || '0x0000000000000000000000000000000000000000', this.swap_address).encodeABI()])
            if(['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool))
                calls.push([currentContract.curveRewards._address, currentContract.curveRewards.methods.periodFinish().encodeABI()])
            let aggcalls = await currentContract.multicall.methods.aggregate(calls).call()
            let decoded = aggcalls[1].map(hex => currentContract.web3.eth.abi.decodeParameter('uint256', hex))
            if(decoded.slice(0,decoded.length-1).some(v=>BN(v).lte(currentContract.max_allowance.div(BN(2))) > 0))
              this.inf_approval = false
            let now = Date.now() / 1000
            if(['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool) && +decoded[decoded.length-1] < now)
                this.hasRewards = false

            this.disabledButtons = false;



            // withdraw
            if(['susdv2', 'tbtc', 'ren', 'sbtc'].includes(this.currentPool)) {
              this.withdrawc = true;
              this.to_currency = null
            } else {
              this.withdrawc = false
            }
            this.to_currency = 0
            this.sync_withdraw_avg_balances = false

            currentContract.showSlippage = false;
            currentContract.slippage = 0;
            let curveRewards = currentContract.curveRewards
            let allowance = BN(await currentContract.swap_token.methods.allowance(currentContract.default_account || '0x0000000000000000000000000000000000000000', currentContract.deposit_zap._address).call())
            if(allowance.lte(currentContract.max_allowance.div(BN(2))))
                this.inf_approval = false
            if(['susdv2', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool)) {
                this.pendingSNXRewards = await curveRewards.methods.earned(this.default_account).call()
                console.log(this.pendingSNXRewards, "PENDING SNX REWARDS")
            }
            if(['sbtc'].includes(this.currentPool)) {
                this.balancerPool = new currentContract.web3.eth.Contract(balancer_ABI, balancer_address)
                window.balancerPool = this.balancerPool
                let calls = [
                    [curveRewards._address, curveRewards.methods.earned(this.default_account).encodeABI()],
                    [this.balancerPool._address, this.balancerPool.methods.totalSupply().encodeABI()],
                    [this.balancerPool._address, this.balancerPool.methods.getBalance(process.env.VUE_APP_SNX_TOKEN).encodeABI()],
                    [this.balancerPool._address, this.balancerPool.methods.getBalance('0x408e41876cccdc0f92210600ef50372656052a38').encodeABI()],
                    [this.balancerPool._address, this.balancerPool.methods.balanceOf(currentContract.default_account).encodeABI()],
                ]
                let aggcalls = await currentContract.multicall.methods.aggregate(calls).call()
                let decoded = aggcalls[1].map(hex => currentContract.web3.eth.abi.decodeParameter('uint256', hex))

                this.pendingBALRewards = decoded[0]
                this.pendingSNXRewards = decoded[0] * decoded[2] / decoded[1]
                this.pendingRENRewards = decoded[0] * decoded[3] / decoded[1]

                this.withdrawBALPool = decoded[4]
                this.withdrawSNXPool = decoded[4] * decoded[2] / decoded[1]
                this.withdrawRENPool = decoded[4] * decoded[3] / decoded[1]

            }
            // if(['y','iearn', 'dfi', 'dusd'].includes(this.currentPool)) {
            //     this.withdrawADAI = await currentContract.aRewards.methods.claimable(currentContract.default_account).call()
            // }

            await common.update_fee_info();
            await this.update_balances();
            this.setCalcBalances()
            this.handle_change_share();
          },
          getTokenIcon(token, type = false) {
              return helpers.getTokenIcon(token, type, this.currentPool)
          },
          toFixed(num, precisions = 2, round = 4) {
              if(+num == 0 && ['ren', 'sbtc'].includes(currentContract.currentContract)) return '0.00'
              if(precisions == 2 && ['tbtc', 'ren', 'sbtc'].includes(currentContract.currentContract)) precisions = 8
              let rounded = floor(+num, precisions).toFixed(precisions)
              return isNaN(rounded) ? '0.00' : rounded
          },
          maxBalanceCoin(i) {
            return this.toFixed(this.wallet_balances[i] / this.precisions[i])
          },
          setMaxBalanceCoin(i) {
            Vue.set(this.deposit_inputs, i, this.maxBalanceCoin(i))
            if(this.currentPool == 'susdv2' && i == 3 || this.currentPool == 'sbtc' && i == 2) {
                let maxbalance_susd = this.susdWaitingPeriod ? 0 : BN(this.transferableBalance).times(this.rates[i]).toString()
                Vue.set(this.deposit_inputs, i, maxbalance_susd)
            }
          },
        	inputsFormat(i) {
        		if(this.deposit_inputs[i]) {
        			return this.toFixed(+this.deposit_inputs[i])
        		}
        		return '0.00'
        	},
          changeSwapInfo(val) {
            if(val) {
              if (['qusd5'].includes(currentContract.currentContract)) {
                this.coins = currentContract.underlying_coins
                this.rates = this.c_rates
                this.swap_address = currentContract.swap_address
              } else {
                this.coins = currentContract.coins
                if(this.currentPool == 'susdv2') Vue.set(this.coins, 3, currentContract.underlying_coins[3])
                if(this.currentPool == 'sbtc') Vue.set(this.coins, 2, currentContract.underlying_coins[2])
                this.rates = this.precisions.map(cp=>1/cp)
                this.swap_address = currentContract.swap_address
              }
            } else {
              if (['qusd5'].includes(currentContract.currentContract)) {
                this.coins = currentContract.base_coins
                this.rates = this.c_rates
                this.swap_address = currentContract.deposit_zap._address
              } else {
                this.coins = currentContract.underlying_coins
                // FIXME: ???
                this.rates = this.precisions.map(cp=>1/cp)
                this.swap_address = currentContract.deposit_zap._address
              }
            }

            if (this.deposit_inputs.length > this.coins.length) {
              this.deposit_inputs = this.deposit_inputs.slice(0, this.coins.length)
            }
          },
          setInputStyles(newInputs = false, newContract, oldContract) {
            if(oldContract) {
              for(let i = 0; i < allabis[newContract].N_COINS - allabis[oldContract].N_COINS; i++) {
                this.deposit_inputs.push('0.00')
              }
              if(allabis[oldContract].N_COINS - allabis[newContract].N_COINS > 0) {
                this.deposit_inputs = this.deposit_inputs.filter((_, i) => i < allabis[newContract].N_COINS)
              }
            }
            else if(newInputs) {
              this.deposit_inputs = new Array(Object.keys(this.currencies).length).fill('0.00')
            }
            this.bgColors = Array(this.currencie_coins_n).fill({
              backgroundColor: '#707070',
              color: '#d0d0d0',
            })
          },
          async calcSlippage(...args) {
            try {
              this.slippagePromise.cancel();
              let calc_slippage = common.calc_slippage
              if (['qusd5'].includes(this.currentPool)) {
                calc_slippage = common.calc_slippage_base
              }
              this.slippagePromise = helpers.makeCancelable(calc_slippage(...args))
              await this.slippagePromise;
            }
            catch (err) {
              console.error('calcSlippage err', err)
            }
          },
          async handle_sync_balances() {
            await common.update_fee_info();
            let calls = []
            for (let i = 0; i < this.currencie_coins_n; i++) {
              calls.push([this.coins[i]._address, this.coins[i].methods.balanceOf(currentContract.default_account || '0x0000000000000000000000000000000000000000').encodeABI()])
              calls.push(this.pushBalances(i))
            }

            if(['susdv2', 'sbtc'].includes(this.currentPool)) {
              let idx = this.currentPool == 'susdv2' ? 3 : 2
              let currencyKey = '0x7355534400000000000000000000000000000000000000000000000000000000'
              if(this.currentPool == 'sbtc') 
                  currencyKey = '0x7342544300000000000000000000000000000000000000000000000000000000'
              calls.push([this.coins[idx]._address, this.coins[idx].methods.transferableSynths(currentContract.default_account || '0x0000000000000000000000000000000000000000').encodeABI()])
              calls.push([currentContract.snxExchanger._address, 
                  currentContract.snxExchanger.methods
                  .maxSecsLeftInWaitingPeriod(currentContract.default_account, currencyKey)
                  .encodeABI()])
            }
            let aggcalls = await currentContract.multicall.methods.aggregate(calls).call()
            let decoded = aggcalls[1].map(hex => currentContract.web3.eth.abi.decodeParameter('uint256', hex))
            let balances = decoded
            if(['susdv2', 'sbtc'].includes(this.currentPool)) balances = decoded.slice(0, -2)

            helpers.chunkArr(balances, 2).map((v, i) => {
              Vue.set(this.wallet_balances, i, currentContract.default_account
                ? v[0]
                : 0)
              Vue.set(this.balances, i, +v[1])
            })
            if(this.currentPool == 'susdv2' || this.currentPool == 'sbtc') {
                this.transferableBalance = decoded[decoded.length - 2]
                this.susdWaitingPeriod = (+decoded[decoded.length - 1] != 0)
                this.susdWaitingPeriodTime = +decoded[decoded.length - 1]
            }

			      if (this.max_balances) {
			        this.disabled = true;
			        for (let i = 0; i < this.currencie_coins_n; i++) {
			        	let amount = this.wallet_balances[i] * this.p_rates[i]
			        	if(!this.depositc) amount = this.wallet_balances[i] / this.precisions[i]
			            var val = amount
			            var val = this.toFixed(amount);
			            if(val == 0) val = '0.00'
                  Vue.set(this.deposit_inputs, i, this.toFixed(val))

                  if(this.currentPool == 'susdv2' && i == 3 || this.currentPool == 'sbtc' && i == 2) {
                      let precisions = 2
                      if(this.currentPool == 'sbtc' && i == 2) precisions = 18
                      let maxbalance_susd = this.susdWaitingPeriod ? 0 : this.transferableBalance
                      Vue.set(this.deposit_inputs, i, this.toFixed(BN(this.transferableBalance).div(1e18)))
                  }
			        }
			    } else {
            this.disabled = false;
          }

          // FIXME: temp
          this.disabled = false;
			},
          async handle_sync_balances_proportion() {
            await this.handle_sync_balances();
            //for(let i = 0; i < currentContract.N_COINS; i++) this.change_currency(i)
          },
          async handle_sync_withdraw_avg_balances() {
            if (this.sync_withdraw_avg_balances) {
              this.to_currency = null
            } else {
              this.to_currency = 10
            }
          },
          deposit_stake() {
            this.show_loading = true;
            this.handle_add_liquidity(true)
          },
          setLoadingAction(val) {
              this.loadingAction = val
              setTimeout(() => this.loadingAction = false, 500)
          },
          async handle_add_liquidity(stake = false) {
            let actionType = stake == false ? 1 : 2;
            if(this.loadingAction == actionType) return;
            this.setLoadingAction(actionType)
            let promises = await Promise.all([helpers.getETHPrice()])
            this.ethPrice = promises[0]

            this.show_loading = true
            console.log('this.coins', this.coins, this.currencie_coins)
            let calls = [...Array(this.currencie_coins_n).keys()].map(i=> {
                if(this.currentPool == 'susdv2' && i == 3 || this.currentPool == 'sbtc' && i == 2) {
                  return [this.coins[i]._address, this.coins[i].methods.transferableSynths(currentContract.default_account).encodeABI()]
                }
                return [this.coins[i]._address, this.coins[i].methods.balanceOf(currentContract.default_account).encodeABI()]
              }
            )

            let endOffset = 1
            calls.push([currentContract.swap_token._address, currentContract.swap_token.methods.totalSupply().encodeABI()])
            if(['susdv2', 'sbtc'].includes(this.currentPool)) {
              let currencyKey = '0x7355534400000000000000000000000000000000000000000000000000000000'
              if(this.currentPool == 'sbtc') 
                  currencyKey = '0x7342544300000000000000000000000000000000000000000000000000000000'
              calls.push([
                currentContract.snxExchanger._address,
                currentContract.snxExchanger.methods
                .maxSecsLeftInWaitingPeriod(currentContract.default_account, currencyKey)
                .encodeABI()
              ])
              endOffset = 2
            }

            let aggcalls = await currentContract.multicall.methods.aggregate(calls).call()
            let decoded = aggcalls[1].map(hex=>currentContract.web3.eth.abi.decodeParameter('uint256',hex))

            decoded.slice(0, decoded.length-endOffset).forEach((balance, i) => {
              let precisions = this.precisions[i]
              let bal = BN(balance)
              if(this.depositc) bal = BN(bal).times(this.p_rates[i])
              else bal = BN(bal).div(precisions)
              if((this.currentPool == 'susdv2' && i == 3 || this.currentPool == 'sbtc' && i == 2)
                  && +decoded[decoded.length - 1] != 0) bal = BN(0)
              let maxDiff = BN(bal).minus(BN(this.deposit_inputs[i]))
              if(!this.deposit_inputs[i]) {
                return Vue.set(this.amounts, i, 0)
              }
              if(BN(bal).gt(0) && maxDiff.lt(0) && BN(maxDiff).lt(BN(this.minAmount))) {
                if(!this.depositc) balance = BN(balance).div(precisions).div(this.p_rates[i])
                Vue.set(this.amounts, i, BN(balance).toFixed(0,1))
              }
              else {
                Vue.set(this.amounts, i, BN(this.deposit_inputs[i]).div(this.p_rates[i]).toFixed(0,1))
              }
            })

            this.amounts = this.amounts.map(v => v || 0)
            let total_supply = +decoded[decoded.length-endOffset];
            this.waitingMessage = this.$i18n.t('notice.approveSpending')
            let nonZeroInputs = this.deposit_inputs.filter(Number).length
            let amounts = this.deposit_inputs.map((v, i)=>{
                if(!v) return 0
                let maxDiff = (BN(this.wallet_balances[i]).div(this.precisions[i])).minus(v)
                let balance = this.wallet_balances[i]
                if(this.currentPool == 'susdv2' && i == 3 || this.currentPool == 'sbtc' && i == 2) balance = this.transferableBalance
                if((this.currentPool == 'susdv2' && i == 3 || this.currentPool == 'sbtc' && i == 2)
                    && +decoded[decoded.length - 1] != 0) balance = 0
                if(BN(balance).gt(0) && maxDiff.lt(0) && maxDiff.lt(BN(this.minAmount))) return BN(balance).toFixed(0, 1)

                return BN(v).times(this.precisions[i]).toFixed(0, 1)
            })
            var token_amount = 0;
            if(total_supply > 0) {
              let token_amounts = this.amounts
console.log('token_amount', token_amount, token_amounts)
              token_amount = await this.currencie_contract.methods.calc_token_amount(token_amounts, true).call();
console.log('token_amount1', token_amount)
              token_amount = BN(token_amount).times(BN(1).minus(BN(this.calcFee)))
              token_amount = BN(token_amount).times(BN(this.getDepositMaxSlippage)).toFixed(0,1);
            }

            if(this.depositc)
              this.estimateGas = contractGas.deposit[this.currentPool] / 2
            else
              this.estimateGas = (contractGas.depositzap[this.currentPool].deposit(nonZeroInputs) | 0) / 1.5
console.log('this.amounts', this.amounts, amounts)
            let ensure_allowance = common.ensure_allowance
            if (['qusd5'].includes(this.currentPool)) {
              ensure_allowance = common.ensure_allowance_base
            }

            if (this.inf_approval)
              await ensure_allowance(this.amounts, !this.depositc, undefined, undefined, true)
            else if(this.depositc) {
              await ensure_allowance(this.amounts, false);
            } else {
              await ensure_allowance(amounts, true)
            }

            let receipt;
            let minted = 0;
            if(this.depositc) {
              this.waitingMessage = this.$i18n.t('notice.confirmDepositTransaction')

              var { dismiss } = notifyNotification(this.waitingMessage)
              await helpers.setTimeoutPromise(100)
console.log('add_liquidity', this.amounts, token_amount)
              let add_liquidity = currentContract.swap.methods.add_liquidity(this.amounts, token_amount).send({
                  from: currentContract.default_account,
                  gasPrice: this.gasPriceWei,
                  // gas: contractGas.deposit[this.currentPool],
              }).once('transactionHash', hash => {
                  dismiss()
                  notifyHandler(hash)
                  this.waitingMessage = this.$i18n.t(stake
                      ? 'liquidity.waitingDepositTransactionBeforeStaking'
                      : 'liquidity.waitingDepositTransactionNoFurther',
                      [hash])
              })
              try {
                receipt = await add_liquidity
              }
              catch(err) {
                          console.error(err)
                          dismiss()
                          errorStore.handleError(err)
                if(err.code == -32603) {
                  await common.setTimeout(300)
                  receipt = await add_liquidity
                }
              }
            } else {
                let gas = contractGas.depositzap[this.currentPool].deposit(nonZeroInputs) | 0
                // console.warn(this.deposit_inputs, 'inputs', amounts, 'uamounts', 
                //   this.amounts, 'amounts', currentContract.swap._address, 'swap address', this.precisions, 'coin precisions', 
                //   this.c_rates, 'c rates',
                //   currentContract.coins.map(c=>c._address), 'coins', this.coins.map(uc=>uc._address), 'underlying_coins',
                //   currentContract.virtual_price, 'virtual_price', token_amount, 'token_amount', Date.now())
                this.waitingMessage = this.$i18n.t('notice.confirmDepositTransaction')
                await helpers.setTimeoutPromise(100)
console.log('deposit_zap', amounts, token_amount)
                let add_liquidity = currentContract.deposit_zap.methods.add_liquidity(amounts, token_amount).send({
                  from: currentContract.default_account,
                  gasPrice: this.gasPriceWei,
                  // gas: gas,
                })
                .once('transactionHash', hash => {
                  notifyHandler(hash)
                  this.waitingMessage = `Waiting for deposit 
                                  <a href='http://etherscan.io/tx/${hash}'>transaction</a>
                                  to confirm ${stake ? 'before staking (1/2)' : 'no further action required'}`
                  console.warn(hash, 'tx hash')
                })
              try {
                  receipt = await add_liquidity
                }
                catch(err) {
                            console.error(err)
                            errorStore.handleError(err)
                  if(err.code == -32603) {
                    await common.setTimeout(300)
                    receipt = await add_liquidity
                  }
                }
            }
            this.waitingMessage = ''
            if(!stake ) this.show_loading = false
            if(stake && ['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool)) {
                        console.warn(receipt.events)
                        try {
                  minted = BN(
                    Object.values(receipt.events).filter(event => {
                      return (event.address.toLowerCase() == allabis.susdv2.token_address.toLowerCase()
                                                || event.address.toLowerCase() == allabis.sbtc.token_address.toLowerCase()
                                                || event.address.toLowerCase() == allabis.iearn.token_address.toLowerCase()
                                            )
                          && event.raw.topics[1] == "0x0000000000000000000000000000000000000000000000000000000000000000" 
                          && (
                                                event.raw.topics[2].toLowerCase() == '0x000000000000000000000000' + currentContract.default_account.slice(2).toLowerCase()
                                                || event.raw.topics[2].toLowerCase() == '0x000000000000000000000000' + allabis.iearn.deposit_address.slice(2).toLowerCase()
                                                )
                    })[0].raw.data)
                            await helpers.setTimeoutPromise(100)
                  await this.stakeTokens(minted, true)
                        }
                        catch(err) {
                            try {
                                minted = BN(
                                    Object.values(receipt.logs).filter(event => {
                                        return (event.address.toLowerCase() == allabis.susdv2.token_address.toLowerCase()
                                                    || event.address.toLowerCase() == allabis.sbtc.token_address.toLowerCase()
                                                    || event.address.toLowerCase() == allabis.iearn.token_address.toLowerCase()
                                                )
                                                && event.topics[1] == "0x0000000000000000000000000000000000000000000000000000000000000000" 
                                                && (
                                                    event.topics[2].toLowerCase() == '0x000000000000000000000000' + currentContract.default_account.slice(2).toLowerCase()
                                                    || event.raw.topics[2].toLowerCase() == '0x000000000000000000000000' + allabis.iearn.deposit_address.slice(2).toLowerCase()
                                                    )
                                    })[0].data)
                                await helpers.setTimeoutPromise(100)
                                await this.stakeTokens(minted, true)
                            }
                            catch(err) {
                                console.error(err)
                                this.errorStaking = true;
                            }
                        }
            }
                    this.estimateGas = 0
                    this.justDeposit = false

              await this.handle_sync_balances();
              common.update_fee_info();
          },
          highlightAllInputs() {
            for(let i = 0; i < this.currencie_coins_n; i++) this.highlightInputs(i)
          },
			highlightInputs(i) {
				let value = this.deposit_inputs[i]
                let balance = this.wallet_balances[i]
                if(this.currentPool == 'susdv2' && i == 3 || this.currentPool == 'sbtc' && i == 2) balance = this.transferableBalance
				if (value > balance * this.rates[i])
	                Vue.set(this.bgColors, i, 'red');
	            else
	                Vue.set(this.bgColors, i, 'blue');
			},
      async getLPCrvReceived() {
        let deposit_inputs = this.deposit_inputs.map(v => v || 0);
console.log('deposit_inputs', deposit_inputs)
console.log('deposit_inputs 1', deposit_inputs.map((v, i) => BN(v).div(this.p_rates[i]).toFixed(0,1)))
console.log('deposit_inputs 2', await this.currencie_contract.methods.calc_token_amount(
            deposit_inputs.map((v, i) => BN(v).div(this.p_rates[i]).toFixed(0,1)),
            true
          ).call() / 1e18)


        this.lpCrvReceived = (
          await this.currencie_contract.methods.calc_token_amount(
            deposit_inputs.map((v, i) => BN(v).div(this.p_rates[i]).toFixed(0,1)),
            true
          ).call() / 1e18) * this.getDepositMaxSlippage
      },
			async change_currency(i, setInputs = true, event) {
				if(event) {
					this.deposit_inputs[i] = event.target.value
				}
        var value = this.deposit_inputs[i]
        this.highlightInputs(i)

        if (this.sync_balances && !this.max_balances) {
            for (let j = 0; j < this.currencie_coins_n; j++)
                if (j != i) {
                    var value_j = this.deposit_inputs[j]

                    if (this.balances[i] * this.p_rates[i] > 1) {
                        // proportional
                        var newval = value / this.p_rates[i] * this.balances[j] / this.balances[i];
                        newval = Math.floor(newval * this.p_rates[j] * 100) / 100;
                        setInputs && Vue.set(this.deposit_inputs, j, newval);

                    } else {
                        // same value as we type
                        var newval = value;
                        setInputs && Vue.set(this.deposit_inputs, j, newval);
                    }

                    // Balance not enough highlight
                    if (newval > this.wallet_balances[j] * this.rates[j])
                        Vue.set(this.bgColors, j, 'red');
                    else
                        Vue.set(this.bgColors, j, 'blue');
                }
        }
        await this.getLPCrvReceived()
        await this.calcSlippage(this.deposit_inputs, true)
      },
      handle_migrate_new() {
        common.handle_migrate_new('new')
      },





          // withdraw
          handleCheck(idx) {
            // if(idx === this.to_currency) {
              // if(this.withdrawc == false) this.withdrawc = true
              // this.to_currency = null

              // currentContract.slippage = 0
              // currentContract.showSlippage = false
            // }
            // else {
              // this.withdrawc = false
              this.to_currency = idx
              this.sync_withdraw_avg_balances = false
            // }
          },
          setCalcBalances() {
            for (let i = 0; i < this.currencie_coins_n; i++) {
                let token_balance = this.showstaked ? this.token_balance.plus(this.staked_balance) : this.token_balance
                let value = BN(100 / 100 * this.balances[i] * this.p_rates_withdrawc[i] * token_balance / this.token_supply)
                Vue.set(this.calc_balances, i, value)
              // console.log('setCalcBalances', i, value.toString() )
            }
          },
          async update_balances() {
            let calls = []
            if (currentContract.default_account) {
console.log('update_balances', this.currencie_coins_n_withdrawc)
              for (let i = 0; i < this.currencie_coins_n_withdrawc; i++) {
                calls.push([this.coins[i]._address ,this.coins[i].methods.balanceOf(currentContract.default_account || '0x0000000000000000000000000000000000000000').encodeABI()])
              }
              calls.push([currentContract.swap_token._address ,currentContract.swap_token.methods.balanceOf(currentContract.default_account || '0x0000000000000000000000000000000000000000').encodeABI()])
            }

            for (let i = 0; i < this.currencie_coins_n_withdrawc; i++) {
              calls.push(this.pushBalances_withdrawc(i))
            }
            if(['susdv2', 'sbtc','y','iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool)) calls.push([currentContract.curveRewards._address, currentContract.curveRewards.methods.balanceOf(currentContract.default_account || '0x0000000000000000000000000000000000000000').encodeABI()])
            calls.push([currentContract.swap_token._address ,currentContract.swap_token.methods.totalSupply().encodeABI()])
            let aggcalls = await currentContract.multicall.methods.aggregate(calls).call()
            let decoded = aggcalls[1].map(hex => currentContract.web3.eth.abi.decodeParameter('uint256', hex))

            if(currentContract.default_account) {
              decoded.slice(0, this.currencie_coins_n_withdrawc).map((v, i) => {
// console.log('wallet_balances_withdraw', i, +v / this.precisions_withdrawc[i])
                Vue.set(this.wallet_balances_withdraw, i, +v / this.precisions_withdrawc[i])
              })
              this.token_balance = BN(decoded[this.currencie_coins_n_withdrawc])
              decoded = decoded.slice(this.currencie_coins_n_withdrawc+1)
            }

            decoded.slice(0, this.currencie_coins_n_withdrawc+1 + this.currencie_coins_n_withdrawc).map((v, i) => {
              Vue.set(this.balances, i, currentContract.default_account ? +v : 0)
            })

            if(['susdv2', 'sbtc','y','iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool)) {
              this.staked_balance = BN(decoded[decoded.length-2])
            } else {
              this.staked_balance = BN(0)
            }
            this.unstakepercentage = this.toFixed(this.staked_balance.div(1e18))
            this.token_supply = +decoded[decoded.length-1]
          },
        async handle_change_amounts(i, event) {
          // FIXME:
          this.showWithdrawSlippage = true;
          this.show_nobalance = false
          if(event) {
            this.withdraw_inputs[i] = event.target.value
            return;
          }
				  if(this.currentPool == 'susd') return;
				  this.to_currency = null
          var values = this.withdraw_inputs.map((x,i) => x / this.p_rates_withdrawc[i])
          values = values.map(v=>BN(Math.floor(v).toString()).toFixed(0))
          this.show_nobalance = false;
          this.show_nobalance_i = 0;
          let calls = [...Array(this.currencie_coins_n_withdrawc).keys()].map(i=>this.pushBalances_withdrawc(i))
      console.log('values', values, this.withdrawc)

          calls.push([this.currencie_contract_withdrawc._address ,this.currencie_contract_withdrawc.methods.calc_token_amount(values, false).encodeABI()])
          calls.push([currentContract.swap_token._address, currentContract.swap_token.methods.balanceOf(currentContract.default_account || '0x0000000000000000000000000000000000000000').encodeABI()])
          try {
            let aggcalls = await currentContract.multicall.methods.aggregate(calls).call()
            let decoded = aggcalls[1].map(hex => currentContract.web3.eth.abi.decodeParameter('uint256', hex))
            decoded.slice(0, this.currencie_coins_n_withdrawc).forEach((v, i) => {
              let coin_balance = +v * this.p_rates_withdrawc[i]
              if(coin_balance < this.withdraw_inputs[i]) {
                  this.show_nobalance |= true;
                  this.show_nobalance_i = i;
              } else {
                this.show_nobalance |= false;
              }
            })
            var availableAmount = BN(decoded[decoded.length-2])
            availableAmount = availableAmount.div(BN(1 - currentContract.fee * this.currencie_coins_n_withdrawc / (4 * (this.currencie_coins_n_withdrawc - 1))))
            var maxAvailableAmount = BN(decoded[decoded.length-1]);
            if(availableAmount.gt(maxAvailableAmount.plus(BN(this.staked_balance)))) {
                this.setAllInputBackground('red')
            }
            else {
                this.setAllInputBackground('blue')
            }
            this.calcSlippage(this.withdraw_inputs, false);

            this.share = '---';
            this.shareStyles = {
              backgroundColor: '#707070',
              color: '#d0d0d0'
            }
          } catch (err) {
            console.error(err)
            this.show_nobalance = true;
            this.show_nobalance_i = currentContract.bal_info.findIndex((balance, i) => {
                return +this.withdraw_inputs[i] > +balance
            });
            this.setAllInputBackground('red')
          }
        },
        async getMinAmounts() {
          //use update rates instead
          await common.update_fee_info();
          let min_amounts = []

          let token_balance = this.token_balance
          let toTokenSupply = 0
          let baseTotalTokenBalance = 0
          if(['qusd5'].includes(this.currentPool)) {
            let fromUnderlyingCoinBalances  = await currentContract.swap.methods.balances(currentContract.fromUnderlyingBaseCoinIdx).call()
            toTokenSupply = await currentContract.base_pool_token.methods.totalSupply().call()
            baseTotalTokenBalance = this.share / 100 * fromUnderlyingCoinBalances * token_balance / this.token_supply
          }

          let token_supply = this.token_supply

          for(let i = 0; i < this.currencie_coins_n_withdrawc; i++) {
            if(!this.withdrawc && ['qusd5'].includes(this.currentPool) && currentContract.toBaseCoinIdxs.includes(i)) {
              token_balance = baseTotalTokenBalance
              token_supply = toTokenSupply
            }

            min_amounts[i] = BN(0.98).times(this.share/100).times(BN(this.balances[i]))

            if(!this.withdrawc) {
              min_amounts[i] = min_amounts[i]
                .times(this.precisions_withdrawc[i])
                .times(this.p_rates_withdrawc[i])
            }
            min_amounts[i] = min_amounts[i].times(token_balance)
              .div(token_supply)
              .toFixed(0,1)
          }
          return min_amounts;
        },
            async claim_SNX(claim_bpt_only = false, unstake = true) {
                this.show_loading = true
                this.waitingMessage = `Please confirm claiming ${(this.pendingSNXRewards / 1e18).toFixed(2)} 
                    ${['y', 'iearn'].includes(this.currentPool) ? 'YFI' : 'SNX'}`
                if(this.currentPool == 'sbtc')
                    this.waitingMessage += ` and ${(this.pendingRENRewards / 1e18).toFixed(2)} REN`
                
                var { dismiss } = notifyNotification(this.waitingMessage)
                let promises = await Promise.all([helpers.getETHPrice()])
                this.ethPrice = promises[0]
                this.estimateGas = 200000

                let earned = await currentContract.curveRewards.methods.earned(currentContract.default_account).call()

                if(earned > 0 && unstake) {
                    await new Promise((resolve, reject) => {
                        currentContract.curveRewards.methods.getReward()
                            .send({
                                from: currentContract.default_account,
                                gasPrice: this.gasPriceWei,
                                // gas: 400000,
                            })
                            .once('transactionHash', hash => {
                                dismiss()
                                notifyHandler(hash)
                            })
                            .on('receipt', () => {
                                this.pendingSNXRewards = 0
                                resolve()
                            })
                            .catch(err => {
                                errorStore.handleError(err)
                                dismiss()
                                reject(err)
                            })
                    })
                }

                if(this.currentPool == 'sbtc' && (!claim_bpt_only || !unstake)) {
                    this.estimateGas = 300000

                    try {
                        let balancerBalance = BN(await this.balancerPool.methods.balanceOf(currentContract.default_account).call())
                        await this.balancerPool.methods.exitPool(balancerBalance.toFixed(0,1), ['0', '0'])
                        .send({
                            from: currentContract.default_account,
                            gasPrice: this.gasPriceWei,
                            // gas: 600000,
                        })
                        .once('transactionHash', hash => {
                            dismiss()
                            notifyHandler(hash)
                        })
                    }
                    catch(err) {
                        console.log(err)
                        dismiss()
                        errorStore.handleError(err)
                    }
                }

                this.show_loading = false

            },
            // async claimYFIaDAI() {
            //     this.estimateGas = 50000

            //     var { dismiss } = notifyNotification('Please confirm approval to burn YFI for aDAI')

            //     try {

            //         let balance = BN(await currentContract.aRewards.methods.claimable(currentContract.default_account).call())
            //         let yFI = new currentContract.web3.eth.Contract(ERC20_abi, '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e')
            //         await common.approveAmount(yFI, balance, currentContract.default_account, currentContract.aRewards._address)
            //         dismiss()

            //         var { dismiss1 } = notifyNotification('Please confirm burning YFI to aDAI transaction')

            //         await currentContract.aRewards.methods.claim(balance.toFixed(0,1))
            //         .send({
            //             from: currentContract.default_account,
            //             gasPrice: this.gasPriceWei,
            //             gas: 125000,
            //         })
            //         .once('transactionHash', hash => {
            //             dismiss1()
            //             notifyHandler(hash)
            //         })
            //         .on('error', err => {
            //             dismiss1()
            //             throw err
            //         })
            //     }
            //     catch(err) {
            //         console.log(err)
            //         dismiss()
            //         errorStore.handleError(err)
            //     }
            // },
            async unstakeStaked() {
                let amount = BN(this.unstakepercentage).times(1e18)
                this.unstake(amount, false, true)
            },
			async unstake(amount, exit = false, unstake_only = false) {
        this.waitingMessage = this.$i18n.t(unstake_only
            ? 'liquidity.confirmUnstakingToken'
            : 'liquidity.UnstakingTokenWithdrawal'
          , [this.toFixed(amount.div(BN(1e18)))]
        )

                var { dismiss } = notifyNotification(this.waitingMessage)

                let stakedAmount = BN(await currentContract.curveRewards.methods.balanceOf(currentContract.default_account).call())

                if(stakedAmount.lt(amount))
                    amount = stakedAmount

                try {
    				await new Promise((resolve, reject) => {
    					currentContract.curveRewards.methods.withdraw(amount.toFixed(0,1))
    						.send({
    							from: currentContract.default_account,
    							gasPrice: this.gasPriceWei,
                  // gas: 125000,
    						})
    						.once('transactionHash', hash => {
                                this.waitingMessage = 'Waiting for unstake transaction to confirm'
                                dismiss()
                                notifyHandler(hash)
                                resolve()
                            })
                            .on('receipt', receipt => {
                                this.staked_balance = this.staked_balance.minus(amount)
                                currentContract.curveStakedBalance -= amount
                                common.update_fee_info()
                            })
                            .catch(err => {
                                dismiss()
                                reject(err)
                            })
    				})
                    if(exit) {
        				this.claim_SNX()
                        //if(['y', 'iearn', 'dfi', 'dusd'].includes(this.currentPool))
                            //this.showModal = true
                    }
                }
                catch(err) {
                    console.log(err)
                    errorStore.handleError(err)
                    this.waitingMessage = ''
                    this.show_loading = false;
                    throw err
                }
                this.waitingMessage = ''
                this.show_loading = false
			},
      setLoadingAction(val) {
          this.loadingAction = val;
          setTimeout(() => this.loadingAction = false, 500)
      },
			async handle_remove_liquidity(unstake = false, unstake_only = false, exit = false) {
        await common.update_fee_info();
        await this.update_balances();

        let actionType = unstake == false ? 1 : 2
        if(this.loadingAction == actionType) return;
        this.setLoadingAction(actionType)
        let promises = await Promise.all([helpers.getETHPrice()])
        this.ethPrice = promises[0]
        this.estimateGas = 0;
        if(['susdv2', 'sbtc','y','iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool)) {
          if(unstake_only) {
            this.estimateGas = 125000
            if(this.currentPool == 'sbtc') this.estimateGas += 300000
          } else {
            let nonZeroInputs = this.withdraw_inputs.filter(Number).length
            if(this.share == '---') {
              this.estimateGas = contractGas.withdraw[this.currentPool].imbalance(nonZeroInputs) | 0
            }
            else if(this.to_currency !== null && this.to_currency < 10) {
              this.estimateGas = contractGas.depositzap[this.currentPool].withdraw / 2
            } else {
              this.estimateGas = contractGas.depositzap[this.currentPool].withdrawShare / 2
            }
          }
        }
        this.show_loading = true;
        let inOneCoin = currentContract.deposit_zap
        if(['tbtc','ren', 'sbtc'].includes(currentContract.currentContract)) inOneCoin = currentContract.swap
        if(['qusd5'].includes(currentContract.currentContract)) {
          inOneCoin = this.withdrawc
              ? currentContract.swap
              : currentContract.deposit_zap
        }

        let min_amounts = []

        for (let i = 0; i < this.currencie_coins_n_withdrawc; i++) {
          if(!this.withdraw_inputs[i]) {
              Vue.set(this.amounts, i, 0)
              continue
          }
          let maxDiff = BN(this.calc_balances[i]).minus(BN(this.withdraw_inputs[i]))
          let useMax = this.calc_balances[i] > 0 && maxDiff.lte(BN(this.minAmount)) && maxDiff > 0
          if(useMax) {
            Vue.set(this.amounts, i, BN(this.calc_balances[i]).div(this.p_rates_withdrawc[i]).toFixed(0,1))
          }
          else {
            Vue.set(this.amounts, i, BN(Math.floor(this.withdraw_inputs[i] / this.p_rates_withdrawc[i]).toString()).toFixed(0,1)); // -> c-tokens
          }
        }

        var txhash;
        this.amounts = this.amounts.map(amount => amount || 0)

          console.log('amounts', this.amounts)

			    if (this.share == '---') {
			    	var token_amount;
            try {
              token_amount = await this.currencie_contract_withdrawc.methods.calc_token_amount(this.amounts, false).call();
            }
            catch(err) {
              console.error(err)
              this.show_nobalance = true;
              this.show_nobalance_i = this.to_currency;
            }

            token_amount = BN(token_amount).times(BN(1).plus(this.calcFee))
            token_amount = BN(Math.floor(token_amount * this.getWithdrawMaxSlippage).toString()).toFixed(0,1)
            if((this.token_balance.lt(BN(token_amount)) || unstake) && ['susdv2', 'sbtc','y','iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool)) {
                let unstakeAmount = BN(token_amount).minus(BN(this.token_balance))
                if(unstake) unstakeAmount = BN(token_amount) 
                await this.unstake(unstakeAmount, unstake && !unstake_only, unstake_only)
            }
            if(unstake_only) return;

            let nonZeroInputs = this.withdraw_inputs.filter(Number).length

			        if(this.withdrawc || ['susdv2', 'sbtc'].includes(this.currentPool)) {
                let gas = contractGas.withdraw[this.currentPool].imbalance(nonZeroInputs) | 0

                try {
                  console.log(this.amounts, token_amount)
                  this.waitingMessage = this.$i18n.t('liquidity.confirmWithdrawalTransaction', [])
                  var { dismiss } = notifyNotification(this.waitingMessage)

                  try {
                    this.estimateGas = await currentContract.swap.methods
                      .remove_liquidity_imbalance(this.amounts, token_amount)
                      .estimateGas({
                          from: currentContract.default_account,
                          gasPrice: this.gasPriceWei,
                          // gas: gas,
                      })
                  }
                  catch(err) {
                    this.estimateGas = gas / 2;
                  }

                  await helpers.setTimeoutPromise(100)
                  await currentContract.swap.methods.remove_liquidity_imbalance(this.amounts, token_amount).send({
                    from: currentContract.default_account,
                    gasPrice: this.gasPriceWei,
                    // gas: gas,
                  }).once('transactionHash', hash => {
                    dismiss()
                    notifyHandler(hash)
                    this.waitingMessage = 'Waiting for withdrawal to confirm: no further action needed'
                  })
                }
                catch(err) {
                  console.error(err)
                  dismiss()
                  errorStore.handleError(err)
                  this.waitingMessage = ''
                  this.show_loading = false
                  throw err;
                }
			    	  } else {
			        	let withdraw_inputs = this.withdraw_inputs;
                withdraw_inputs = withdraw_inputs.map(v => v || 0)
			        	let amounts = this.withdraw_inputs.map((v, i) => {
                    if(!v) v = 0
                    let maxDiff = BN(this.calc_balances[i]).minus(BN(v))
                    return this.calc_balances[i] > 0 && maxDiff.lte(BN(this.minAmount)) && maxDiff > 0 ? this.calc_balances[i].times(this.precisions_withdrawc[i]).toFixed(0, 1) : BN(v).times(this.precisions_withdrawc[i]).toFixed(0, 1)
                  })
                        amounts = amounts.map(amount => amount || 0)
                        let gas = contractGas.depositzap[this.currentPool].withdrawImbalance(nonZeroInputs) | 0
                        this.waitingMessage = this.$i18n.t('liquidity.approveLptokenWithdrawal', [floor(token_amount / 1e18, 6), 'LP token'])
                        var { dismiss } = notifyNotification(this.waitingMessage)
                        try {
                            this.estimateGas = gas / (['compound', 'usdt'].includes(currentContract.currentContract) ? 1.5 : 2.5)
                            if(!['tbtc','ren','sbtc'].includes(currentContract.currentContract)) await common.ensure_allowance_zap_out(token_amount, undefined, undefined, this.inf_approvalamount)
                            dismiss()
                            this.waitingMessage = this.$i18n.t('liquidity.confirmWithdrawalTransaction')
                            var { dismiss } = notifyNotification(this.waitingMessage)
                            await helpers.setTimeoutPromise(100)
    			        	await inOneCoin.methods.remove_liquidity_imbalance(amounts, token_amount).send({
    				        	from: currentContract.default_account, 
                      gasPrice: this.gasPriceWei,
                      // gas: gas,
    				        }).once('transactionHash', hash => {
                                dismiss()
                                notifyHandler(hash)
                                this.waitingMessage = 'Waiting for withdrawal to confirm: no further action needed'
                            })
                        }
                        catch(err) {
                          console.error(err)
                          dismiss()
                          errorStore.handleError(err)
                          this.waitingMessage = ''
                          this.show_loading = false;
                          throw err;
                        }
			        }
			    }
			    else {
            let balance = BN(this.token_balance)
console.log('balance1', balance.toString())
            if(this.share == 100) balance = BN(await currentContract.swap_token.methods.balanceOf(currentContract.default_account).call());
console.log('balance2', balance.toString())
            if(this.showstaked) balance = balance.plus(this.staked_balance)
console.log('balance3', balance.toString())
            var amount = BN(this.share).div(BN(100)).times(balance)
console.log('share', this.share, balance)
            if((this.token_balance.lt(amount) || unstake) && ['susdv2', 'sbtc', 'y', 'iearn', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(this.currentPool)) {
                let unstakeAmount = BN(amount).minus(BN(this.token_balance))
                if(unstake) unstakeAmount = BN(amount)
                await this.unstake(unstakeAmount, unstake && !unstake_only, unstake_only)
            }
            if(unstake_only) return;
      console.log('amount', amount.toString(), amount.toFixed(0,1))
            amount = amount.toFixed(0,1)
console.log('handle_remove_liquidity', this.sync_withdraw_avg_balances, this.to_currency, this.to_currency !== null && this.to_currency < 10)
            if(this.to_currency !== null && this.to_currency < 10) {
              this.waitingMessage = this.$i18n.t('liquidity.approveLptokenWithdrawal', [floor(amount / 1e18, 6), 'LP token'])
              var { dismiss } = notifyNotification(this.waitingMessage)
              this.estimateGas = contractGas.depositzap[this.currentPool].withdraw / 2
              if(!['tbtc','ren','sbtc'].includes(currentContract.currentContract)) await common.ensure_allowance_zap_out(amount, undefined, undefined, this.inf_approval)
              dismiss()
              let min_amount;
              try {
                min_amount = await inOneCoin.methods.calc_withdraw_one_coin(amount, this.to_currency).call();
                min_amount = BN(min_amount).times(BN(1).minus(this.calcFee))
              }
              catch(err) {
                console.error(err)
                this.show_nobalance = true;
                this.show_nobalance_i = this.to_currency;
              }
              this.waitingMessage = this.$i18n.t('liquidity.confirmWithdrawalTransaction')
              var { dismiss } = notifyNotification(this.waitingMessage)
              let args = [BN(amount).toFixed(0,1), this.to_currency, BN(min_amount).times(BN(1).div(BN(this.getWithdrawMaxSlippage))).toFixed(0, 1)]

              if(!['tbtc','ren','sbtc', 'okuu', 'usd5', 'qusd5'].includes(currentContract.currentContract)) args.push(this.donate_dust)
              await helpers.setTimeoutPromise(100)
              try {
                await inOneCoin.methods
                  .remove_liquidity_one_coin(...args)
                  .send({
                    from: currentContract.default_account,
                    gasPrice: this.gasPriceWei,
                    // gas: contractGas.depositzap[this.currentPool].withdraw | 0,
                  })
                  .once('transactionHash', hash => {
                    dismiss()
                    notifyHandler(hash)
                    this.waitingMessage = `Waiting for withdrawal 
                    <a href='https://etherscan.io/tx/${hash}'>transaction</a>
                    to confirm: no further action needed`
                  })
              } catch (err) {
                console.error(err)
                dismiss()
                errorStore.handleError(err)
              }
            } else if(this.to_currency == 10) {
              this.waitingMessage = this.$i18n.t('liquidity.approveLptokenWithdrawal', [this.toFixed(amount / 1e18), 'LP token'])
              var { dismiss } = notifyNotification(this.waitingMessage)
              try {
                this.estimateGas = contractGas.depositzap[this.currentPool].withdrawShare / 2
                if(!['tbtc','ren','sbtc'].includes(currentContract.currentContract)) await common.ensure_allowance_zap_out(amount, undefined, undefined, this.inf_approval)
                dismiss()
                this.waitingMessage = this.$i18n.t('liquidity.confirmWithdrawalTransaction')
                var { dismiss } = notifyNotification(this.waitingMessage)
                let min_amounts = await this.getMinAmounts();
                await helpers.setTimeoutPromise(100)
          console.log('amount, min_amounts', amount, min_amounts)
                await inOneCoin.methods.remove_liquidity(amount, min_amounts)
                  .send({
                    from: currentContract.default_account, 
                    gasPrice: this.gasPriceWei,
                    // gas: contractGas.depositzap[this.currentPool].withdrawShare,
                  })
                  .once('transactionHash', hash => {
                      dismiss()
                      notifyHandler(hash)
                      this.waitingMessage = `Waiting for withdrawal 
                      <a href='https://etherscan.io/tx/${hash}'>transaction</a>
                      to confirm: no further action needed`
                  });
              } catch(err) {
                console.error(err)
                dismiss()
                errorStore.handleError(err)
                this.waitingMessage = ''
                this.show_loading = false
                throw err;
              }
            } else {
                try {
    			        	let min_amounts = await this.getMinAmounts();
                            this.waitingMessage = this.$i18n.t('liquidity.confirmWithdrawalTransaction')
                            var { dismiss } = notifyNotification(this.waitingMessage)
                            try {
                                this.estimateGas = await currentContract.swap.methods.remove_liquidity(amount, min_amounts)
                                                    .estimateGas({
                                                        from: currentContract.default_account,
                                                        gasPrice: this.gasPriceWei,
                                                        // gas: 600000,
                                                    })
                            }
                            catch(err) {
                                this.estimateGas = 600000
                            }
                            await helpers.setTimeoutPromise(100)
    			        	await currentContract.swap.methods.remove_liquidity(amount, min_amounts).send({
                                from: currentContract.default_account, 
                                gasPrice: this.gasPriceWei,
                                // gas: 600000,
                            })
                            .once('transactionHash', hash => {
                                dismiss()
                                notifyHandler(hash)
                                this.waitingMessage = `Waiting for withdrawal 
                                <a href='https://etherscan.io/tx/${hash}'>transaction</a>
                                to confirm: no further action needed`
                            });
                        }
                        catch(err) {
                            console.error(err)
                            dismiss()
                            errorStore.handleError(err)
                            this.waitingMessage = ''
                            this.show_loading = false
                            throw err;
                        }
			        }
			    }
        if(this.share == '---') {
          for (let i = 0; i < this.currencie_coins_n_withdrawc; i++) {
            this.handle_change_amounts(i);
          }
        }

        this.show_loading = false;
        this.waitingMessage = ''
        this.estimateGas = 0

        await this.update_balances();
        await common.update_fee_info();
			},
			async handle_change_share() {
        await this.update_balances()

        let inOneCoin = currentContract.deposit_zap
        if(['tbtc','ren','sbtc'].includes(currentContract.currentContract)) inOneCoin = currentContract.swap

        this.warninglow = false;
        this.showWithdrawSlippage = false
        this.show_nobalance = false
        if(this.to_currency == null && this.withdrawc == false && this.share == '---') this.to_currency = 10
        if(this.share != '---' && this.to_currency != null && this.to_currency != 10) this.showWithdrawSlippage = true
        let token_balance = this.showstaked ? this.token_balance.plus(this.staked_balance) : this.token_balance
        currentContract.showSlippage = false;
        currentContract.slippage = 0;
        if(this.to_currency !== null && this.to_currency < 10) {
          var amount = BN(this.share).div(BN(100)).times(token_balance).toFixed(0,1);

          if (this.share == 100) {
            amount = await currentContract.swap_token.methods.balanceOf(currentContract.default_account || '0x0000000000000000000000000000000000000000').call();
            if(this.showstaked) {
              amount = BN(amount).plus(BN(this.staked_balance)).toFixed(0,1)
            }
          }

          let precision = this.precisions_withdrawc[this.to_currency]
          let zap_values = Array(this.currencie_coins_n_withdrawc).fill(0)
          // FIXME: to [].div()
          zap_values[this.to_currency] = BN(0)
          // FIXME: amount === 0 ERROR
          try {
            this.warninglow = false
						zap_values[this.to_currency] = BN(await inOneCoin.methods.calc_withdraw_one_coin(amount, this.to_currency).call())
            if(zap_values[this.to_currency].eq(BN(0))) this.warninglow = true
					}
					catch(err) {
						console.error(err)
            if(this.share != '') {
              this.show_nobalance = true;
              this.show_nobalance_i = this.to_currency;
            }
          }

          let real_values = Array(this.currencie_coins_n_withdrawc).fill(0)
console.log('zap_values', zap_values, this.to_currency)
          real_values[this.to_currency] = zap_values[this.to_currency].div(precision)

          this.withdraw_inputs = real_values.map(v=>0)

          // fix toFixed
          this.withdraw_inputs[this.to_currency] = this.toFixed(BN(real_values[this.to_currency]), 2, 1)
console.log('this.withdraw_inputs', this.withdraw_inputs)
          await this.calcSlippage([], false, zap_values, this.to_currency)
        }

				this.shareStyles.backgroundColor = 'blue'
				this.shareStyles.color = 'aqua'
        if (this.share == '---') {
            this.share = 0;
        } else if ((this.share > 100) | (this.share < 0)) {
          this.shareStyles.backgroundColor = 'red'
        }
console.log('handle_change_share', this.to_currency)
        if(this.to_currency !== null && this.to_currency < 10) return;

        let toTokenSupply = 0
        let baseTotalTokenBalance = 0
        if(['qusd5'].includes(this.currentPool)) {
          let fromUnderlyingCoinBalances  = await currentContract.swap.methods.balances(currentContract.fromUnderlyingBaseCoinIdx).call()
          toTokenSupply = await currentContract.base_pool_token.methods.totalSupply().call()
          baseTotalTokenBalance = this.share / 100 * fromUnderlyingCoinBalances * token_balance / this.token_supply
        }

        let token_supply = this.token_supply

        for (let i = 0; i < this.currencie_coins_n_withdrawc; i++) {
          if ((this.share >=0) & (this.share <= 100)) {
            if(!this.withdrawc && ['qusd5'].includes(this.currentPool) && currentContract.toBaseCoinIdxs.includes(i)) {
              token_balance = baseTotalTokenBalance
              token_supply = toTokenSupply
            }

            let value = BN(this.share / 100 * this.balances[i] * this.p_rates_withdrawc[i] * token_balance / token_supply )
// console.log('withdraw_inputs', i, this.share, this.toFixed(value, 2, 1), this.balances[i], this.p_rates_withdrawc[i], token_balance.toString(), token_supply)
            Vue.set(this.withdraw_inputs, i, this.toFixed(value, 2, 1))
            Vue.set(this.withdraw_maxs, i, this.toFixed(value, 2, 1))
          } else {
            Vue.set(this.withdraw_inputs, i, 0)
            Vue.set(this.withdraw_maxs, i, 0)
          }

          Vue.set(this.inputStyles, i, {
            backgroundColor: '#707070',
            color: '#d0d0d0'
          })
        }
      },
      setAllInputBackground(bgcolor) {
				for(let i = 0; i < this.currencie_coins_n_withdrawc; i++) {
					Vue.set(this.inputStyles, i, Object.assign(this.inputStyles[i] || {}, {backgroundColor: bgcolor}))
				}
      },
      async handle_migrate_new() {
        if(this.currentPool == 'compound')
          return common.handle_migrate_new('new')
        this.share = 100
        await this.handle_remove_liquidity();
      },
      async migrateUSDT() {
          this.withdrawc = false;
          let amounts = this.withdraw_inputs;
          amounts.push(0);
          this.handle_remove_liquidity()
          await init(currentContract.contracts.pax)

          amounts = amounts.map((v, i)=>BN(v).times(allabis.pax.precisions[i]).toFixed(0))
          this.waitingMessage = this.$i18n.t('notice.approveSpending')
          var { dismiss } = notifyNotification(this.waitingMessage)
          await common.ensure_allowance(amounts, true, 'pax', 3)
          dismiss()
          let pax_deposit_zap = new currentContract.web3.eth.Contract(allabis.pax.deposit_abi, allabis.pax.deposit_address)
          let token_amount = await currentContract.contracts.pax.swap.methods.calc_token_amount(amounts, true).call();
          token_amount = BN(Math.floor(token_amount * 0.99).toString()).toFixed(0,1);
          this.waitingMessage = 'Please confirm deposit to PAX pool transaction'
          var { dismiss } = notifyNotification(this.waitingMessage)
          let nonZeroInputs = amounts.filter(Number).length
          let gas = contractGas.depositzap.pax.deposit(nonZeroInputs) | 0
          await helpers.setTimeoutPromise(100)
          try {
              let add_liquidity = pax_deposit_zap.methods.add_liquidity(amounts, token_amount).send({
                  from: currentContract.default_account,
                  gas: gas,
              })
              .once('transactionHash', hash => {
                  dismiss()
                  notifyHandler(hash)
                  this.waitingMessage = `Waiting for deposit to PAX transaction to confirm no further action required`
              })
          }
          catch(err) {
              console.error(err)
              errorStore.handleError(err)
          }
      },
    }
  }

</script>

<style>
  .currentInput .coin {
    min-width: 124px;
  }
	/* #add-liquidity {
		margin-right: 1em;
	}
	#mintr {
        margin-top: 1em;
		margin-left: 1em;
		text-align: center;
	}
 	#stakeunstaked {
 		margin-left: 1em;
    }
    .pulse {
        background: red;
        animation: pulse 1s 3;
        margin: 0;
        margin-bottom: 8px;
    }
    .pulseinfo {
        animation: pulse 1s 3;
    }
    .maxBalanceCoin {
        cursor: pointer;
    }
    .maxBalanceCoin:hover {
        text-decoration: underline;
    }
    .maxBalanceCoin > span {
        font-size: 0.7em;
    }
    .pulse p {
        margin-bottom: 0;
    }
    .currency_label {
        display: block;
        margin-bottom: 0.3em;
    }
    .currency_label .token-icon {
        margin-right: 0.6em;
    }
    .curvelpusd {
        display: inline-block;
        padding-top: 1em;
    }
    .advancedoptions {
        margin-top: 1em;
    }
    .advancedoptions + div fieldset {
        margin-top: 1em;
    }
    .advancedoptions + div legend {
        text-align: center;
    }
    #stakepercentage {
        width: 2.6em;
    }
    label[for='stakepercentage'] {
        margin-right: 1em;
    }
    #stakepercentage.invalid, #max_slippage .invalid {
        background-color: red;
    }
    #max_slippage {
        margin-top: 0.4em;
    } */
</style>
