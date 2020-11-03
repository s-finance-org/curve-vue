<template>
  <div class="total-bg">
    <b-container class="d-flex py-4  justify-content-center">
      <img class="logo_orgin" :src="publicPath + 'res/icons/logo/logo_orgin.svg'">
      <!-- <div class="total-box px-4 py-3 w-270 mr-4 ml-auto">
        <h6 class="text-black-65">{{ $t('global.totalPoolsDeposits') }}</h6>
        <text-overlay-loading :show="!(totalBalances1 || total)">
          <h4 class="mb-0">{{totalBalances1 || total | formatNumber}}$</h4>
        </text-overlay-loading>
      </div>
      <div class="total-box px-4 py-3 w-270">
        <h6 class="text-black-65">{{ $t('global.dailyVol') }}</h6>
        <text-overlay-loading :show="!(volume >= 0)">
          <h4 class="mb-0">{{(volume | 0) | formatNumber(0)}}$</h4>
        </text-overlay-loading>
      </div> -->
    </b-container>
  </div>
</template>

<script>
	import Web3 from 'web3'
	import allabis, { infura_url, multicall_address, multicall_abi, ERC20_abi, yERC20_abi } from '../../allabis'
	import { chunkArr } from '../../utils/helpers'
	import BN from 'bignumber.js'
	import * as volumeStore from '@/components/common/volumeStore'
  import { contract } from '../../contract'
  import * as priceStore from '../common/priceStore'

  import TextOverlayLoading from '../../components/common/TextOverlayLoading'

	export default {
		props: ['totalVolume', 'bal_info'],
		data: () => ({
			total: '',
    }),
    components: {
      TextOverlayLoading
    },
		computed: {
      publicPath() {
        return process.env.BASE_URL
      },
			volume() {
				return this.totalVolume || volumeStore.totalVolume()
      },
      // FIXME: temp
      totalBalances1() {
        return this.bal_info && this.bal_info.reduce((a, b) => a + b, 0) || null
      },
      poolVolumeUSD() {
        const converts = {
          'iearn': 'y',
          'dfi': 'dfi',
          'dusd': 'dusd',
          'okuu': 'okuu',
          'susdv2': 'susd',
          'usd5': 'usd5',
          'qusd5': 'qusd5'
        }

        return volumeStore.state.volumes[
          converts[this.currentPool] || this.currentPool
        ][0]
      },
		},
		async created() {
      await this.totalBalances()

			if(this.totalVolume === undefined)
				this.dailyVolume()
		},
		methods: {
			async totalBalances() {
				if(!priceStore.state.btcPrice) await priceStore.getBTCPrice()
			    let total = BN(0);
			    let tokenContracts = {}
			    let swapContracts = {}
			    let promises = []
			    let web3 = contract.web3 || new Web3(infura_url)
			    let multicall = new web3.eth.Contract(multicall_abi, multicall_address)
			    let calls = []
			    let pools = Object.assign({},allabis)
			    delete pools.susd
			    delete pools.tbtc
			    delete pools.y
			    for(let [key, contract] of Object.entries(pools)) {
			    	console.log(key, "THE KEY")
			        tokenContracts[key] = new web3.eth.Contract(ERC20_abi, contract.token_address);
			        swapContracts[key] = new web3.eth.Contract(contract.swap_abi, contract.swap_address);
			        calls.push([tokenContracts[key]._address, tokenContracts[key].methods.totalSupply().encodeABI()])
			        calls.push([swapContracts[key]._address, swapContracts[key].methods.get_virtual_price().encodeABI()])
			    }
			    let susd_swap_token = new web3.eth.Contract(ERC20_abi, allabis.susd.token_address)
			    let susd_swap = new web3.eth.Contract(allabis.susd.swap_abi, allabis.susd.swap_address)
			    let ySUSD = new web3.eth.Contract(yERC20_abi, allabis.susd.coins[0])
			    calls.push(
			    	[ySUSD._address, ySUSD.methods.getPricePerFullShare().encodeABI()],
			    	[susd_swap._address, susd_swap.methods.balances(0).encodeABI()]
			    )
			    let aggcalls = await multicall.methods.aggregate(calls).call()
			    let decoded = aggcalls[1].map(hex => web3.eth.abi.decodeParameter('uint256', hex))
			    chunkArr(decoded, 2).map((v, i, arr) => {
			    	let balance = BN(v[0]).times(BN(v[1])).div(1e36)

			    	//renBTC
			    	if([6,7].includes(i)) balance = balance.times(BN(priceStore.state.btcPrice))
			    	total = total.plus(balance)
			    })
			    this.total = total.toFixed(0);
			},
			async dailyVolume() {
				var pools = ['compound', 'usdt', 'y', 'busd', 'susd', 'pax', 'tbtc', 'ren', 'sbtc']
	            await volumeStore.getVolumes(pools);
			}
		}

	}
</script>

<style scoped>
  
</style>