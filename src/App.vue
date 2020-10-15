<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { getters, contract as currentContract } from './contract'
  import { capitalizeFirstLetter } from './utils/helpers'
  import { googleAnalytics } from './support'

  const descriptions = {
    compound: 'A s.finance portal for swapping cDAI/cUSDC',
    usdt: 'A s.finance Tethered portal for swapping cDAI/cUSDC/USDT',
    iearn: 'A s.finance yTokens portal for swapping DAI/USDC/USDT/TUSD',
    busd: 'A s.finance portal for swapping BUSD and other stablecoins',
  }

  const titles = {
    compound: 'Compounded',
    usdt: 'Tethered',
    iearn: 'Yield',
    busd: 'bUSD',
    susd: 'sUSD-yCurve old',
    susdv2: 'sUSD',
    pax: 'PAX',
    tbtc: 'TBTC',
    ren: 'renBTC',
    sbtc: 'sBTC',
    dfi: 'dfi',
    dusd: 'dUSD'
  }

	export default {
		metaInfo() {
			return {
        title: "S.finance",
				meta: [
					{'property': 'og:title', 'content': 's.finance/' + this.currentPool},
					{'property': 'og:url', 'content': 'https://s.finance/' + this.currentPool},
					{'property': 'og:type', 'content': 'website'},
					{'property': 'og:description', 'content': descriptions[this.currentPool]},
					{'property': 'og:image', 'content':  '/s_finance' + this.currentPool + '_preview.png'},
					{'name': 'twitter:card', 'content': 'summary_large_image'},
					{'name': 'twitter:title', 'content': 's.finance/' + this.currentPool},
					{'name': 'twitter:site', 'content': ''},
					{'name': 'twitter:creator', 'content': ''},
					{'name': 'twitter:description', 'content': descriptions[this.currentPool]},
					{'name': 'twitter:url', 'content': 'https://s.finance/' + this.currentPool},
					{'name': 'twitter:image', 'content': this.currentPool + '/s_finance_preview.png'},
				]
			}
    },
    created () {
      googleAnalytics()

      console.log('build_version:', process.env.npm_package_config_build_version)
    },
    computed: {
      ...getters,
    },
	}
</script>