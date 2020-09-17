<template>
	<div class="window white">
	        <fieldset class='contractsdialog'>
	            <legend>
	            	<button @click='showContracts = 1' class='buttoncontracts'>Contracts</button>
	            	<button @click='showContracts = 3'>DAO Contracts</button>
	            </legend>
	            <p class='simple-error'>
	            	Do <b>not</b> send funds directly to the Curve contracts. You need to deposit them! 
	            </p>
	            <div v-show='showContracts == 1'>
		            <fieldset>
		            	<legend>Curve Pool Registry</legend>
		                	<a href = "https://etherscan.io/address/0x7002B727Ef8F5571Cb5F9D70D13DBEEb4dFAe9d1">
		                		<img class='icon' :src="publicPath + 'curveIcons/curve-registry.svg'"> <span class='text'>Curve Registry address</span>
		                	</a>
		                	<a href = "https://etherscan.io/address/0xc1DB00a8E5Ef7bfa476395cdbcc98235477cDE4E">
		                		<img class='icon' :src="publicPath + 'curveIcons/curve-registry.svg'"> <span class='text'>Curve calc address</span>
		                	</a>
		                	<a href = "https://github.com/curvefi/curve-pool-registry/blob/b17/doc/notebook/playbook.ipynb">
		                		<img class='icon' :src="publicPath + 'curveIcons/curve-registry.svg'"> 
		                		<span class='text'>Curve Registry docs</span>
		                	</a>
		            </fieldset>
		            <fieldset>
		            	<legend>Insurance</legend>
		                	<a href = "https://app.nexusmutual.io/#/SmartContractCover">
		                		<img class='icon' :src="publicPath + 'curveIcons/nexusmutual.png'"> <span class='text'>Stablecoin pools - curvev2.nexusmutual.eth</span>
		                	</a>
		                	<a href = "https://etherscan.io/address/0xc1DB00a8E5Ef7bfa476395cdbcc98235477cDE4E">
		                		<img class='icon' :src="publicPath + 'curveIcons/nexusmutual.png'"> <span class='text'>BTC pools - curvebtc.nexusmutual.eth</span>
		                	</a>
		            </fieldset>
		            <fieldset v-for = '(addresses, i) in contractAddresses'>
		            	<legend>{{allPools[i]}}</legend>
		                	<a :href = "'https://etherscan.io/address/' + addresses.swap">
		                		<img class='icon' :src="getTokenUrl(i)"> <span class='text'>swap address</span>
		                	</a>
		                	<a :href = "'https://etherscan.io/address/' + addresses.token">
		                		<img class='icon' :src="getTokenUrl(i)"> 
		                		<span class='text'>[{{tokenNames[i].ticker}}] {{tokenNames[i].name}} token address</span>
		                	</a>
		                	<a :href = "'https://etherscan.io/address/' + depositZaps[i].deposit" v-show="!['ren', 'sbtc'].includes(allPools[i])">
		                		<img class='icon' :src="getTokenUrl(i)"> <span class='text'>deposit address</span>
		                	</a>
		                	<a :href= "'https://etherscan.io/address/' + rewardsAddresses[allPools[i]]" v-show="['susdv2', 'sbtc', 'y', 'iearn'].includes(allPools[i])">
		                		<img class='icon' :src="getTokenUrl(i)"> <span class='text'>staking rewards address</span>
		                	</a>
		                	<a href="https://etherscan.io/address/0x9fe350DfA5F66bC086243F21A8F0932514316627" v-show="['ren'].includes(allPools[i])">
		                		<img class='icon' :src="getTokenUrl(i)"> <span class='text'>old adapter address</span>
		                	</a>
		                	<a :href="'https://etherscan.io/address/' + adapterAddresses[allPools[i]]" v-show="['ren','sbtc'].includes(allPools[i])">
		                		<img class='icon' :src="getTokenUrl(i)"> <span class='text'>adapter address</span>
		                	</a>
		                	<a href='https://etherscan.io/token/0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e' v-show="['y', 'iearn'].includes(allPools[i])">
		                		<img class='icon' :src="publicPath + 'curveIcons/yfi.png'">
		                		YFI token
		                	</a>
		            </fieldset>
	        	</div>
	        	<div v-show='showContracts == 3'>
		            <fieldset>
		            	<legend>Curve DAO</legend>
		                	<a :href = CRV_toekn_href>
		                		<img class='icon' :src="publicPath + 'logo.png'"> <span class='text'>CRV token</span>
		                	</a>
		                	<a href = "https://etherscan.io/address/0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2">
		                		<span class='text'>Voting Escrow</span>
		                	</a>
		                	<a href = "https://etherscan.io/address/0x575ccd8e2d300e2377b43478339e364000318e2c">
		                		<span class='text'>Vesting Escrow</span>
		                	</a>
		                	<a href = "https://etherscan.io/address/0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB">
		                		<span class='text'>Gauge Controller</span>
		                	</a>
		                	<a :href = Minter_href>
		                		<span class='text'>Minter</span>
		                	</a>
		                	<a href = "https://etherscan.io/address/0x6e8f6D1DA6232d5E40b0B8758A0145D6C5123eB7">
		                		<span class='text'>Pool Proxy</span>
		                	</a>
		            </fieldset>
		            <fieldset>
		            	<legend>Aragon DAO</legend>
		                	<a href = "https://mainnet.aragon.org/#/dao.curvefi.eth">
		                		<img class='icon' :src="publicPath + 'curveIcons/aragon.png'"> <span class='text'>Aragon DAO</span>
		                	</a>
		                	<a href = "https://mainnet.aragon.org/#/curveemergency">
		                		<img class='icon' :src="publicPath + 'curveIcons/aragon.png'"> <span class='text'>Emergency DAO</span>
		                	</a>
		            </fieldset>
		            <fieldset v-for = '(addresses, i) in gaugeAddresses'>
		            	<legend>
		            		{{allPools[i]}} gauge
		            		<span v-show="allPools[i] == 'usdt'">(disabled)</span>
		            	</legend>
		                	<a :href = "'https://etherscan.io/address/' + addresses.address" :class="{'disabledGauge': allPools[i] == 'usdt'}">
		                		<img class='icon' :src="getTokenUrl(i)"> <span class='text'>{{allPools[i]}} Gauge address</span>
		                	</a>
		            </fieldset>
	        	</div>
	        </fieldset>
	    </div>
</template>

<script>
	import allabis from '../../allabis'

	export default {
		data: () => ({
			allPools: ['compound', 'usdt', 'y', 'busd', 'susdv2', 'pax', 'ren', 'sbtc'],
			tokenNames: [
				{ name: 'cCurve', ticker: 'cCrv' },
				{ name: 'tCurve', ticker: 'tCrv' },
				{ name: 'yCurve', ticker: 'yCrv' },
				{ name: 'bCurve', ticker: 'bCrv' },
				{ name: 'sCurve', ticker: 'sCrv' },
				{ name: 'pCurve', ticker: 'pCrv' },
				// { name: 'tbtcCurve', ticker: 'tbtcCrv' },
				{ name: 'renCurve', ticker: 'renCrv' },
				{ name: 'sbtcCurve', ticker: 'sbtcCrv' },
			],
      showContracts: 3,
      CRV_toekn_href: `https://etherscan.io/address/${process.env.VUE_APP_SFG}`,
      Minter_href: `https://etherscan.io/address/${process.env.VUE_APP_PS_MINTER}`
		}),
		computed: {
			contractAddresses() {
				return Object.keys(allabis).filter(pool => !['y', 'susd', 'tbtc'].includes(pool)).map(pool => 
					({swap: allabis[pool].swap_address, token: allabis[pool].token_address})
				)
			},
			depositZaps() {
				return Object.keys(allabis).filter(pool => !['y', 'susd', 'tbtc'].includes(pool)).map(pool => 
					({deposit: allabis[pool].deposit_address, token: allabis[pool].token_address})
				)
			},
			publicPath() {
				return process.env.BASE_URL
			},
			adapterAddresses() {
				return {
					ren: '0x73aB2Bd10aD10F7174a1AD5AFAe3ce3D991C5047',
					sbtc: '0xAEade605D01FE9a8e9C4B3AA0130A90d62167029',
				}
			},
			rewardsAddresses() {
				return {
					susdv2: '0xdcb6a51ea3ca5d3fd898fd6564757c7aaec3ca92',
					sbtc: '0x13C1542A468319688B89E323fe9A3Be3A90EBb27',
					y: '0x0001FB050Fe7312791bF6475b96569D83F695C9f',
				}
			},

			gaugeAddresses() {
				return [
					{
						name: "Compound",
						address: process.env.VUE_APP_COMPOUND,
					},
					{
					    name: "USDT",
					    address: process.env.VUE_APP_USDT,
					},
					{
					    name: "Y",
					    address: process.env.VUE_APP_Y,
					},
					{
					    name: "bUSD",
					    address: process.env.VUE_APP_BUSD,
					},
					{
						name: "susdv2",
						address: process.env.VUE_APP_PSS_GAUGE,
					},
					{
					    name: "PAX",
					    address: process.env.VUE_APP_PAX,
					},
					{
					    name: "RenBTC",
					    address: process.env.VUE_APP_REN,
					},
					{
						name: "sbtc",
						address: process.env.VUE_APP_SBTC,
					},
				]
			},
		},
		methods: {
			getTokenUrl(i) {
				let publicPath = process.env.BASE_URL
				return publicPath + 'curveIcons/' + this.tokenNames[i].ticker + '.png'
			},
		},
		metaInfo: {
	      title: 'Curve.fi :: Contracts',
	      meta: [
	        {'property': 'og:title', 'content': 'beta.curve.fi/contracts'},
	        {'property': 'og:url', 'content': 'https://curve.fi/contracts'},
	        {'property': 'og:type', 'content': 'website'},
	        {'property': 'og:description', 'content': 'Curve is an exchange liquidity pool on Ethereum designed for extremely efficient stablecoin trading'},
	        {'property': 'og:image', 'content': '/curve.png'},
	        {'name': 'twitter:card', 'content': 'summary_large_image'},
	        {'name': 'twitter:title', 'content': 'beta.curve.fi/contracts'},
	        {'name': 'twitter:site', 'content': '@CurveFinance'},
	        {'name': 'twitter:creator', 'content': '@CurveFinance'},
	        {'name': 'twitter:description', 'content': 'Curve is an exchange liquidity pool on Ethereum designed for extremely efficient stablecoin trading'},
	        {'name': 'twitter:url', 'content': 'https://curve.fi/contracts'},
	        {'name': 'twitter:image', 'content': '/curve.png'},
	      ]
	    },
	}
</script>

<style scoped>
	legend {
		text-align: center;
	}
	.contractsdialog a {
		display: flex;
		padding: 0.1em;
	}
	.contractsdialog a img {
		margin-right: 10px;
	}
	.contractsdialog div {
		display: block;
		margin-top: 10px;
	}
	.contractsdialog a:hover {
	    background-color: blue;
    	color: white;
	}
	.simple-error {
		margin-bottom: 1em;
	}
	.buttoncontracts {
		margin-right: 1em;
	}
	.disabledGauge {
		opacity: 0.5;
	}
</style>