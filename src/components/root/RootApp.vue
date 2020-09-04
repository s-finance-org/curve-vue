<template>
  <b-container fluid id="app" class="px-0" :class="{'root': true, [$route.name]: true}">
    <div class="beta-banner py-2">
      {{ $t('beta.slogan') }}<br/>{{ $t('beta.followMe') }}: 
      <a href="https://twitter.com/SFinanceEx" target="_blank">Twitter</a>
      <a href="https://discord.gg/rc49Dzu" target="_blank">Discord</a>
      <template v-if="$i18n.locale === 'zh-CN'">
        <a href="https://t.me/SFinanceCN" target="_blank">Telegram CN</a>
      </template>
      <template v-else>
        <a href="https://t.me/SFinanceEN" target="_blank">Telegram</a>
      </template>
    </div>
    <div class="statement-banner py-2">
      {{ $t('statement.slogan') }} <a @click="onStatement" href="javascript:void(0);">{{ $t('statement.more') }}</a>
    </div>
    <b-container>
      <b-navbar class="no-gutters align-items-center p-0">
        <div class="col py-2 d-flex align-items-start">
          <img class="logo-sm" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
          <div class="beta-tag">BETA</div>
        </div>
        <b-navbar-nav>
          <b-nav-item active href="###">{{ $t('global.home') }}</b-nav-item>
          <b-nav-item href="###">{{ $t('global.swap') }}</b-nav-item>
          <b-nav-item href="###">{{ $t('global.liquidity') }}</b-nav-item>
          <b-nav-item href="###">{{ $t('global.stats') }}</b-nav-item>
        </b-navbar-nav>
        <sel-language class="ml-2" />
      </b-navbar>
    </b-container>

    <total-balances :total-volume='totalVolume'/>

    <!-- <div class='screencontainer'>
    <div class="top-menu-bar">
      <label for="hamburger" class='border-menu'></label>
      <input type="checkbox" id="hamburger"/>

      <div class='poolsdropdown'>
        <button class='simplebutton'>☰</button>
        <div class='dropdown'>
            <router-link :to="'/compound/' + ($route.path.split('/')[2] || '')  ">Compound</router-link>
            <router-link :to="'/pax/' + ($route.path.split('/')[2] || '')">PAX</router-link>
            <router-link :to="'/iearn/' + ($route.path.split('/')[2] || '') ">Y</router-link>
            <router-link :to="'/busd/' + ($route.path.split('/')[2] || '')  ">bUSD</router-link>
            <router-link :to="'/susdv2/' + ($route.path.split('/')[2] || '')">sUSD</router-link>
            <router-link :to="'/ren/' + ($route.path.split('/')[2] || '')">renBTC</router-link>
            <router-link :to="'/sbtc/' + ($route.path.split('/')[2] || '')">sBTC</router-link>
            <p>____________</p>
            <button class='simplebutton' @click = 'changeWallets'>Change wallet</button>
            <button id='changeAccounts' class='simplebutton' 
              @click = 'changeAccounts'>Change accounts</button>
        </div>
      </div>

      <router-link to="/">Home</router-link>
      <a href="https://dao.curve.fi">DAO</a>
      <router-link to='/earlyCRV'>Community CRV pre-allocation</router-link>
      <router-link to="/trade">Trade</router-link>
      <div class='poolsdropdown'>
        <router-link to="/combinedstats">Stats</router-link>
        <div class='dropdown'>
          <router-link to="/combinedstats">Stats</router-link>
          <router-link to="/dailystats">Daily stats</router-link>
          <router-link to="/volumepercoin">Coin volumes</router-link>
          <router-link to="/volumeperpair">Pair volumes</router-link>
          <router-link to="/totaldeposits">Total deposits</router-link>
        </div>
      </div>
      <router-link to="/curvepay">Pay</router-link>
      <router-link to="/risks">Risks</router-link>
      <div class='poolsdropdown right'>
        <span>?</span>
        <div class='dropdown'>
          <router-link to="/audits">Audits</router-link>
          <router-link to="/events">Events</router-link>
          <router-link to="/contracts">Contracts</router-link>
          <router-link to="/bugbounty">Bug Bounty</router-link>
          <router-link to="/rootfaq">FAQ</router-link>
          <router-link to="/integrations">Integrations</router-link>
          <router-link to="/donate">Donate</router-link>
          <router-link to="/devdocs">Developer Docs</router-link>
          <a href='https://guides.curve.fi' rel='noopener noreferrer'>Guides</a>
          <p>____________</p>
          <a href="https://twitter.com/CurveFinance" rel='noopener noreferrer'>#Twitter</a>
          <a href="https://t.me/curvefi" rel='noopener noreferrer'>@Telegram</a>
          <a href="https://t.me/curveficn" rel='noopener noreferrer'>@Telegram CN</a>
          <a href="https://discord.gg/9uEHakc" rel='noopener noreferrer'>@Discord</a>
          <a href="https://explore.duneanalytics.com/public/dashboards/RTH47mNjQcoLv5oG0HMDdI0iDq7BHxk1PzCRdwQB" rel='noopener noreferrer'>Dune Analytics</a>
          <p>____________</p>
          <a href="https://github.com/curvefi/curve-contract">git@</a>
          <a href="https://github.com/curvefi/curve-vue">git@UI</a>
        </div>
      </div>
      <a href="https://dao.curve.fi" class='showmobile'>DAO</a>
      <router-link to="/combinedstats" class='showmobile'>Stats</router-link>
      <router-link to="/dailystats" class='showmobile'>Daily stats</router-link>
      <router-link to="/volumepercoin" class='showmobile'>Coin volumes</router-link>
      <router-link to="/volumeperpair" class='showmobile'>Pair volumes</router-link>
      <router-link to="/totaldeposits" class='showmobile'>Total deposits</router-link>
      <router-link to="/audits" class='showmobile'>Audits</router-link>
      <router-link to="/events" class='showmobile'>Events</router-link>
      <router-link to="/bugbounty" class='showmobile'>Bug Bounty</router-link>
      <router-link to="/rootfaq" class='showmobile'>FAQ</router-link>
      <router-link to="/integrations" class='showmobile'>Integrations</router-link>
      <router-link to="/donate" class='showmobile'>Donate</router-link>
      <router-link to="/devdocs" class='showmobile'>Developer Docs</router-link>
      <a href='https://guides.curve.fi' rel='noopener noreferrer' class='showmobile'>Guides</a>
      <a href="https://twitter.com/CurveFinance" class='showmobile' rel='noopener noreferrer'>#Twitter</a>
      <a href="https://t.me/curvefi" class='showmobile' rel='noopener noreferrer'>@Telegram</a>
      <a href="https://discord.gg/9uEHakc" class='showmobile' rel='noopener noreferrer'>@Discord</a>
      <a href="https://explore.duneanalytics.com/public/dashboards/RTH47mNjQcoLv5oG0HMDdI0iDq7BHxk1PzCRdwQB" class='showmobile' rel='noopener noreferrer'>Dune Analytics</a>
      <a href="https://github.com/curvefi/curve-contract" class='showmobile'>git@</a>
      <a href="https://github.com/curvefi/curve-vue" class='showmobile'>git@UI</a>
      <button class='simplebutton showmobile' @click = 'changeWallets'>Change wallet</button>
      <button id='changeAccounts' class='simplebutton showmobile' 
        v-show="['ledger', 'trezor'].includes(walletName)" 
        @click = 'changeAccounts'>Change accounts</button>
    </div> -->

    <div id="screen">
        <!-- <div :class="'blue window ' + $route.name">
            <h1><img :src="logoSrc" alt="🌀 Curve"></h1>
        </div> -->
        <b-container class="mt-4">
          <div class='info-message gentle-message window half-width gentle-message' v-if='hasConnectedWallet'>
            {{ $t('wallet.notConnected') }}<button class="ml-2" @click='changeWallets'>{{ $t('wallet.connect') }}</button>
          </div>
        </b-container>
        <!-- <div class='info-message gentle-message window half-width gentle-message CRV'>
          <div>
            <a href='https://etherscan.io/address/0xD533a949740bb3306d119CC777fa900bA034cd52'>CRV: 0xD533a949740bb3306d119CC777fa900bA034cd52</a>
          </div>
        </div>
        <div class='simple-error window' v-show='plsReturn'>
          Your recent withdrawal from Curve resulted in getting 1000 more USDT because of another user mistakenly transferring funds to the contract.
          If you wish to return them - please contact us on <a href='https://twitter.com/CurveFinance'>Twitter</a>/<a href='https://t.me/curvefi'>Telegram</a>/<a href="https://discord.gg/9uEHakc" rel='noopener noreferrer'>@Discord</a>. Thank you! 
        </div> -->
        <router-view/>
    </div>
    <b-container>
      <footer>
        <a href="https://twitter.com/SFinanceEx">Twitter</a>
        <a href="https://t.me/SFinanceEN" target="_blank">Telegram</a>
        <a href="https://t.me/SFinanceCN" target="_blank">Telegram CN</a>
        <a href="https://discord.gg/rc49Dzu" target="_blank">Discord</a>
        <a href="https://medium.com/s-finance" target="_blank">Mdeium</a>
        <a href="https://github.com/s-finance-org/curve-vue" target="_blank">git</a>
        <!-- <a href="###">git-UI</a>
        <a href="###">Developer Document</a> -->
      </footer>
    </b-container>
  </b-container>
</template>

<script>
  import { getters, contract as currentContract, changeContract, poolMenu } from '../../contract'
  import init, { onboard, changeWallets } from '../../init'
  import * as volumeStore from '@/components/common/volumeStore'
  import constantPlatform from '../../constant/platform'

  import SelLanguage from '../common/selLanguage'

  import TotalBalances from './TotalBalances.vue'

  export default {
    metaInfo: {
      title: 'S.finance',
      meta: [
        {'property': 'og:title', 'content': 's.finance'},
        {'property': 'og:url', 'content': 'https://s.finance'},
        {'property': 'og:type', 'content': 'website'},
        {'property': 'og:description', 'content': ''},
        {'property': 'og:image', 'content': '/curve.png'},
        {'name': 'twitter:card', 'content': 'summary_large_image'},
        {'name': 'twitter:title', 'content': 's.finance'},
        {'name': 'twitter:site', 'content': ''},
        {'name': 'twitter:creator', 'content': ''},
        {'name': 'twitter:description', 'content': ''},
        {'name': 'twitter:url', 'content': 'https://s.finance'},
        {'name': 'twitter:image', 'content': '/curve.png'},
      ]
    },
    components: {
      TotalBalances,
      SelLanguage
    },
    computed: {
      ...getters,
      poolMenu() {
        return poolMenu;
      },
      publicPath() {
        return process.env.BASE_URL
      },
      logoSrc() {
        if(!currentContract.swapbtc) return this.publicPath + 'logo_optimized.svg'
        else return this.publicPath + 'logo_ren_beta_optimized.svg'
      },
      hasConnectedWallet() {
        return this.default_account == '0x0000000000000000000000000000000000000000' 
                && !['Donate', 'StatsDaily', 'Audits', 'Stats', 'Contracts', 'FAQ', 'RootFAQ'].includes(this.$route.name)
      },
      plsReturn() {
        return currentContract.currentContract.toLowerCase() == '0x72c20f89008729c91b6bb85f3104fda942494cef'.toLowerCase()
      },
      totalVolume() {
				return volumeStore.totalVolume()
      }
    },
    methods: {
      changePools(pool) {
        changeContract(pool)
      },
      async changeWallets() {
        changeWallets()
      },
      async changeAccounts() {
        return onboard.accountSelect();
      },
      onStatement () {
        const { $i18n } = this

        this.$bvModal.msgBoxOk($i18n.t('statement.cont'), {
            title: $i18n.t('statement.slogan'),
            hideBackdrop: true,
            size: 'lg',
            okTitle: $i18n.t('statement.ok'),
            okVariant: 'danger',
            buttonSize: 'lg',
            contentClass: 'statement-modal',
            centered: true
          })
      }
    },
  }
</script>

<style scoped>
  .logo-sm {
    width: 34px;
    height: 40px;
  }
  .beta-tag {
    background-color: #1ba57b;
    color: rgba(255,255,255,0.85);
    border-radius: 2px;
    line-height: 18px;
    font-size: 10px;
    text-align: center;
    padding: 0 4px;
    margin-left: -4px;
  }
  .beta-banner {
    background-color: #1BA57B;
    color: rgba(255,255,255,0.85);
    text-align: center;
    line-height: 20px;
    font-size: 12px;
  }
  .beta-banner a {
    color: #fff;
    padding-right: 8px;
    text-decoration: underline;
  }
  .statement-banner {
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    background-color: #F7CA00;
  }
  .statement-banner a,
  .statement-banner a:hover {
    color: #1ba57b;
    /* text-decoration: underline; */
  }
  /* #changeAccounts {
    margin-top: 0.3em;
  }
  @media only screen and (min-device-width : 320px) and (max-device-width : 730px) {
    .top-menu-bar > .poolsdropdown {
      display: none;
    }
    .blue.window.half-width, .info-message.window.half-width {
      width: 90%;
    }
  }
  h1 > img {
    height: 52.125px;
  }
  .simple-error.window {
    box-shadow: none;
  }
  .blue.window.Events + .info-message.gentle-message {
    width: 730px;
    max-width: 730px;
  }
  .blue.window.Trade + .info-message.gentle-message {
    width: 1000px;
    max-width: 1000px;
  }
  .CRV a:hover, .CRV a:visited {
    color: white;
  } */
</style>