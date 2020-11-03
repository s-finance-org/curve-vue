import Vue from 'vue'

export let state = Vue.observable({

	gaugesNames: {
	  [process.env.VUE_APP_COMPOUND]: 'compound',
    [process.env.VUE_APP_USDT]: 'usdt',
    [process.env.VUE_APP_PAX]: 'pax',
    [process.env.VUE_APP_Y]: 'y',
    [process.env.VUE_APP_BUSD]: 'busd',
    [process.env.VUE_APP_PSS_GAUGE]: 'susdv2',
    [process.env.VUE_APP_REN]: 'ren',
    [process.env.VUE_APP_SBTC]: 'sbtc',
    [process.env.VUE_APP_DFI_TOKEN]: 'dfi',
    [process.env.VUE_APP_DUSD_TOKEN]: 'dusd',
    [process.env.VUE_APP_OKUU_TOKEN]: 'okuu',
    [process.env.VUE_APP_USD5_TOKEN]: 'usd5',
    [process.env.VUE_APP_QUSD5_TOKEN]: 'qusd5',
	},

	gaugesWeights: {
	  [process.env.VUE_APP_COMPOUND]: 0,
	  [process.env.VUE_APP_USDT]: 0,
	  [process.env.VUE_APP_PAX]: 0,
	  [process.env.VUE_APP_Y]: 0,
	  [process.env.VUE_APP_BUSD]: 0,
	  [process.env.VUE_APP_PSS_GAUGE]: 0,
	  [process.env.VUE_APP_REN]: 0,
    [process.env.VUE_APP_SBTC]: 0,
    [process.env.VUE_APP_DFI_TOKEN]: 0,
    [process.env.VUE_APP_DUSD_TOKEN]: 0,
	},

	pieGaugeWeights: {
	  [process.env.VUE_APP_COMPOUND]: 0,
	  [process.env.VUE_APP_USDT]: 0,
	  [process.env.VUE_APP_PAX]: 0,
	  [process.env.VUE_APP_Y]: 0,
	  [process.env.VUE_APP_BUSD]: 0,
	  [process.env.VUE_APP_PSS_GAUGE]: 0,
	  [process.env.VUE_APP_REN]: 0,
    [process.env.VUE_APP_SBTC]: 0,
    [process.env.VUE_APP_DFI_TOKEN]: 0,
    [process.env.VUE_APP_DUSD_TOKEN]: 0,
	},

	calculatedWeights: {
    [process.env.VUE_APP_COMPOUND]: 0,
	  [process.env.VUE_APP_USDT]: 0,
	  [process.env.VUE_APP_PAX]: 0,
	  [process.env.VUE_APP_Y]: 0,
	  [process.env.VUE_APP_BUSD]: 0,
	  [process.env.VUE_APP_PSS_GAUGE]: 0,
	  [process.env.VUE_APP_REN]: 0,
    [process.env.VUE_APP_SBTC]: 0,
    [process.env.VUE_APP_DFI_TOKEN]: 0,
    [process.env.VUE_APP_DUSD_TOKEN]: 0,
	},

	currentCRVAPYs: {
	  [process.env.VUE_APP_COMPOUND]: 0,
	  [process.env.VUE_APP_USDT]: 0,
	  [process.env.VUE_APP_PAX]: 0,
	  [process.env.VUE_APP_Y]: 0,
	  [process.env.VUE_APP_BUSD]: 0,
	  [process.env.VUE_APP_PSS_GAUGE]: 0,
	  [process.env.VUE_APP_REN]: 0,
    [process.env.VUE_APP_SBTC]: 0,
    [process.env.VUE_APP_DFI_TOKEN]: 0,
    [process.env.VUE_APP_DUSD_TOKEN]: 0,
	},

})