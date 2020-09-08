<template>
  <div>
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
          <b-nav-item :to="{name: 'RootIndex'}" href="###">{{ $t('global.home') }}</b-nav-item>
          <b-nav-item :to="{name: 'Index'}">{{ $t('global.swap') }}</b-nav-item>
          <b-nav-item href="###">{{ $t('global.liquidity') }}</b-nav-item>
          <b-nav-item href="###">{{ $t('global.stats') }}</b-nav-item>
        </b-navbar-nav>
        <sel-language class="ml-2" />
      </b-navbar>
    </b-container>
  </div>
</template>

<script>
  import { contract as currentContract } from '../../contract'

  import SelLanguage from '../common/selLanguage'

  export default {
    components: {
      SelLanguage
    },
    methods: {
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
    computed: {
      publicPath() {
        return process.env.BASE_URL
      },
      logoSrc() {
        if(!currentContract.swapbtc) return this.publicPath + 'logo_optimized.svg'
        else return this.publicPath + 'logo_ren_beta_optimized.svg'
      },
      header_nav () {
        const { $i18n } = this
        const result = [
          { name: 'RootIndex', to: '', i18n: $i18n.t('global.home'), active: false },
        ]

        return result
      }
    }
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
</style>