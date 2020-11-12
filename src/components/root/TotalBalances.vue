<template>
  <div class="total-bg">
    <b-container class="d-flex py-4 justify-content-center px-md-5">
      <div class="d-flex align-items-center px-md-5 col flex-wrap">
        <div class="col">
          <img class="logo_orgin" :src="publicPath + 'res/icons/logo/logo_orgin.svg'">
        </div>
        <div class="col-12 col-md d-flex px-0">
          <div class="total-box col px-4 py-3 mr-4">
            <h6 class="text-black-65">{{ $t('global.totalPoolsDeposits') }}</h6>
            <text-overlay-loading :show="totals.totalValueStaked.loading">
              <h4 class="mb-0">${{ totals.totalValueStaked.cont }}</h4>
            </text-overlay-loading>
          </div>
          <div class="total-box col px-4 py-3">
            <h6 class="text-black-65">{{ $t('global.dailyVol') }}</h6>
            <text-overlay-loading :show="totals.dailyVol.loading">
              <h4 class="mb-0">${{ totals.dailyVol.cont }}</h4>
            </text-overlay-loading>
          </div>
        </div>
      </div>
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
  import store from '../../store'

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
      totals () {
        return store.sFinance
      }
      // FIXME: temp
      // totalBalances() {
      //   return this.bal_info && this.bal_info.reduce((a, b) => a + b, 0) || null
      // },
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