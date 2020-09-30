<template>
  <div>
    <div class="statement-banner p-2">
      {{ $t('statement.noticeTitleHtml') }}
      <a @click="onStatement" href="javascript:void(0);">{{ $t('statement.more') }}</a>
    </div>
    <b-container>
      <b-navbar class="no-gutters align-items-center p-0">
        <div class="col py-2 d-flex align-items-start">
          <img class="logo-sm" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
          <div class="beta-tag">BETA</div>
        </div>
        <div class="d-none d-md-flex align-items-center">
          <b-navbar-nav>
            <b-nav-item v-for="item in headerNav" :key="'nav_'+item.name" :to=item.to :href=item.href :target=item.target>{{ $t(item.i18n) }}</b-nav-item>
          </b-navbar-nav>
          <sel-language class="ml-2" />
        </div>
        <img class="d-md-none icon-w-20" v-b-toggle.sidebar-navbar :src="publicPath + 'res/icons/base/menu.svg'">
      </b-navbar>

      <b-sidebar id="sidebar-navbar" sidebar-class="w-240" backdrop shadow right>
        <b-navbar class="no-gutters p-0">
          <b-navbar-nav class="col flex-column">
            <b-nav-item v-for="item in headerNav" :key="'nav_'+item.name" :to=item.to :href=item.href :target=item.target>{{ $t(item.i18n) }}</b-nav-item>
          </b-navbar-nav>
        </b-navbar>
        <sel-language class="ml-3 mt-3" />
      </b-sidebar>
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
        const { $i18n, $router, $createElement } = this

        const messageVNode = $createElement('div', { class: [] }, [
          $createElement('p', { domProps: { innerHTML: $i18n.t('statement.noticeContHtml') } }),
        ])

        this.$bvModal.msgBoxConfirm([messageVNode], {
            titleHtml: $i18n.t('statement.noticeTitleHtml'),
            hideBackdrop: true,
            size: 'lg',
            okTitle: $i18n.t('statement.ok'),
            okVariant: 'danger',
            buttonSize: 'lg',
            centered: true,
            cancelTitle: $i18n.t('statement.toMore'),
            cancelVariant: 'outline-secondary',
            // statement-modal
            contentClass: 'normal-modal',
          })
          .then(data => {
            !data &&
              $router.push({ name: 'Statemented', path: '/statemented' })
          })
      }
    },
    computed: {
      publicPath() {
        return process.env.BASE_URL
      },
      headerNav () {
        const { $i18n } = this
        const result = [
          { name: 'home', to: { name: 'RootIndex'}, i18n: 'global.home' },
          // { name: 'swap', to: {name: 'Swap', path: '/susdv2/swap'}, i18n: 'global.swap' },
          { name: 'liquidity', to: '/susdv2/liquidity/', i18n: 'global.liquidity' },
          { name: 'dao', to: { name: 'Dao', path: '/dao' }, i18n: 'global.dao' },
          { name: 'risks', to: { name: 'Risks', path: '/risks' }, i18n: 'global.risks' },
          // { name: 'stats', to: {}, i18n: 'global.stats' }
          { name: 'statemented', to: { name: 'Statemented', path: '/statemented' }, i18n: 'global.announcements' },
          { name: 'voting', href: 'https://signal.s.finance/', target: '_blank', i18n: 'global.voting' }
        ]

        return result
      }
    }
  }
</script>

<style scoped>
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
  .statement-banner {
    background-color: #1BA57B;
    color: rgba(255,255,255,0.85);
    text-align: center;
    line-height: 20px;
    font-size: 12px;
  }
  .statement-banner a {
    color: #fff;
    padding-right: 8px;
    text-decoration: underline;
  }
</style>