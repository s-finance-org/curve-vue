<template>
  <div>
    <p v-show='errorMessage'>
      {{ errorMessage }}
    </p>
    <b-form-group class="mb-0 .lists-select">
      <ul v-show='gasPriceMedium'>
        <li>
          <h6 class="text-black-65 mb-0">{{ $t('global.gasPrice') }}</h6>
        </li>
        <li>
          <b-form-radio
            v-model="selectGasPriceMode"
            value=1
          >{{ $t('global.standard') }} ({{ Math.round(gasPriceMedium )}})</b-form-radio>
        </li>
        <li>
          <b-form-radio
            v-model="selectGasPriceMode"
            value=2
          >{{ $t('global.fast') }} ({{ Math.round(gasPriceFast) }})</b-form-radio>
        </li>
        <li>
          <b-form-radio
            v-model="selectGasPriceMode"
            value=3
          >{{ $t('global.instant') }} ({{ Math.round(gasPriceFastest) }})</b-form-radio>
        </li>
        <li>
          <b-form-radio
            v-model="selectGasPriceMode"
            value=4
          >{{ $t('global.customize') }}</b-form-radio>
          <span class="d-flex align-items-center ml-4 mt-1">
            <b-form-input id="custom_gas_input" :disabled="gasPriceMode != 4" v-model="customGasPriceInput" :placeholder="$t('instantSwap.gasPlaceholder')"></b-form-input>
            <span class="ml-2" v-show='gasPrice == gasPriceSlow'>{{ $t('global.slow') }}</span>
            <span class="ml-2" v-show='gasPrice < gasPriceSlow' id="custom-gas-price-state">{{ $t('global.low') }}</span>
          </span>
          <b-tooltip target="custom-gas-price-state">
            {{ $t('instantSwap.warnLowGasPrice') }}
          </b-tooltip>
        </li>
      </ul>
    </b-form-group>
    <!-- <p class='simple-error pulse' v-show='errorMessage'>
        {{errorMessage}}
    </p>
    <div id='gas_price' v-show='gasPriceMedium'><span>Gas price:</span>
      <input id="gasstandard" type="radio" name="gas" :value='gasPriceMedium' @click='customGasDisabled = true; gasPrice = gasPriceMedium'>
      <label for="gasstandard">{{Math.round(gasPriceMedium)}} Standard</label>

      <input id="gasfast" type="radio" name="gas" checked :value='gasPriceFast' @click='customGasDisabled = true; gasPrice = gasPriceFast'>
      <label for="gasfast">{{Math.round(gasPriceFast)}} Fast</label>

      <input id="gasinstant" type="radio" name="gas" :value='gasPriceFastest' @click='customGasDisabled = true; gasPrice = gasPriceFastest'>
      <label for="gasinstant">{{Math.round(gasPriceFastest)}} Instant</label>
      <input id="custom_gas" type="radio" name="gas" value='-' @click="customGasDisabled = false; gasPrice = gasPriceSlow">
      <label for="custom_gas" @click="customGasDisabled = false; gasPrice = gasPriceSlow">
          <input type="text" id="custom_gas_input" 
              :disabled='customGasDisabled'
              name="custom_gas_input"
              :value = 'customGasPriceInput'
              @input='setCustomGas($event)'>
          <span v-show='customGasPriceInput == gasPriceSlow'> Slow</span>
          <span v-show='customGasPriceInput && customGasPriceInput < gasPriceSlow' class='gastoolow'> 
              <span class='tooltip'>
                  Low
                  <span class='tooltiptext'>
                      Too low gas price. Your transaction may be dropped.
                  </span>
              </span>
          </span>
      </label>
    </div> -->
  </div>
</template>

<script>
	import { state } from './gasPriceStore'
  import { state as errorState } from './errorStore'
  import { retry } from '../../utils/helpers'

  import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async/dynamic'

  import BN from 'bignumber.js'

	export default {
		data: () => ({
      // customGasDisabled: true,
      gasPriceMode: 2
		}),
		computed: {
      selectGasPriceMode: {
        get () {
          return this.gasPriceMode
        },
        set (val) {
          const modes = {
            1: this.gasPriceMedium,
            2: this.gasPriceFast,
            3: this.gasPriceFastest,
            4: this.gasPriceSlow
          }

          this.gasPriceMode = val
          this.gasPrice = modes[val]
        }
      },
      gasPriceSlow() {
        return state.gasPriceInfo && state.gasPriceInfo.low || 15
      },
			gasPriceMedium() {
        return state.gasPriceInfo && state.gasPriceInfo.standard || 20
      },
      gasPriceFast() {
          return state.gasPriceInfo && state.gasPriceInfo.fast || 25
      },
      gasPriceFastest() {
          return state.gasPriceInfo && state.gasPriceInfo.instant || 30
      },
      gasPrice: {
        get() {
          return state.gasPrice
        },
        set(val) {
          state.gasPrice = val
        },
      },
      customGasPriceInput: {
        get () {
          const { gasPriceMode } = this

          return gasPriceMode === '4'
            ? this.gasPrice
            : this.gasPriceSlow
        },
        set (val) {
          const maxGasPrice = this.gasPriceFastest * 2

          val > maxGasPrice &&
            (val = maxGasPrice)

          this.gasPrice = val
        }
      },
      errorMessage() {
          setTimeout(() => errorState.txError = null, 2200)
          return errorState.txError
      },
		},

		async created() {
            !state.fetched && this.getGasPrice()
            state.gasPriceInterval && clearIntervalAsync(state.gasPriceInterval)
            if(!state.gasPriceInterval || state.gasPriceInterval.stopped) {
                state.gasPriceInterval = setIntervalAsync(() => this.getGasPrice(), 3000)
            }
			this.$watch(() => state.gasPrice, val => {
				state.gasPriceWei = BN(val).times(1e9).toFixed(0,1)
			}, {
				immediate: true,
			})
		},

        methods: {
            async getGasPrice() {
                try {
                    throw new Error('test')
                    let gasPriceInfo = await retry(fetch('https://pushservice.curve.fi/gasprice'))
                    gasPriceInfo = await gasPriceInfo.json()
                    state.gasPriceInfo = gasPriceInfo
                    if(state.gasPriceInfo.fast > 1000) throw new Error('too high!')
                }
                catch(err) {
                    try {
                        let gasPriceInfo = await retry(fetch('https://gasprice.poa.network/'))
                        gasPriceInfo = await gasPriceInfo.json()
                        state.gasPriceInfo = gasPriceInfo
                        state.gasPriceInfo.low = state.gasPriceInfo.slow
                        if(state.gasPriceInfo.fast > 1000) throw new Error('too high!')
                    }
                    catch(err) {
                        console.error(err)
                        let gasPrice = (await web3.eth.getGasPrice()) / 1e9;
                        state.gasPriceInfo = {
                            low: gasPrice -2,
                            standard: gasPrice,
                            fast: gasPrice + 2,
                            instant: gasPrice + 4,
                        }
                    }
                }
                if(!state.fetched) {
                    state.gasPrice = state.gasPriceInfo.fast
                    state.fetched = true
                }
            },

            async setCustomGas(event) {
                let value = event.target.value
                if(event.target.value > this.gasPriceFastest * 2)
                    value = this.gasPriceFastest * 2
                this.gasPrice = value
            },
        },

	}
</script>

<style scoped>
    /* .pulse {
        animation: pulse 1s 3;
        margin-bottom: 8px;
    }
    #custom_gas_wrapper {
        margin-top: 0.4em;
        margin-left: 6em;
        display: block;
    }
    .gastoolow {
        color: darkred;
    }
    @media only screen and (max-device-width: 730px) {
        #custom_gas_wrapper, #gas_price label {
            margin-top: 0;
            margin-left: 0;
        }
    } */
</style>
