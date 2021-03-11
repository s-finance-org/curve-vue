<template>
  <div>
    <div class="statement-banner p-2" v-show="statementTitle">
      {{ statementTitle }}
      <a @click="onStatement" href="javascript:void(0);">{{ $t('statement.more') }}</a>
    </div>
    <b-container>
      <b-navbar class="no-gutters align-items-center p-0">
        <div class="col py-2 d-flex align-items-center">
          <img class="logo-sm mr-2" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
          <div class="tip">
            <img :src="publicPath + 'res/icons/logo/ethereum.png'">
            Ethereum
          </div>
          <div class="tip okexc">
            <img :src="publicPath + 'res/icons/logo/okex_chain.png'">
            {{ $t('chains.coming', ['OKEXChain']) }}
          </div>
        </div>
        <div class="d-none d-lg-flex align-items-center">
          <b-navbar-nav>
            <b-nav-item v-for="item in headerNav.navs"
              :key="'nav_'+item.name"
              :to=item.to
              :href=item.href
              :target=item.target
              :active=item.active
              >{{ $t(item.i18n) }}</b-nav-item>
            <b-nav-item-dropdown :text="$t('global.more')" right>
              <b-dropdown-item
                v-for="item in headerNav.more"
                :key="'nav_'+item.name"
                :to=item.to
                :href=item.href
                :target=item.target
                :active=item.active
                v-show="item.href || item.to"
                >{{ $t(item.i18n) }}</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
          <sel-language class="ml-2" />
        </div>
        <img class="d-lg-none icon-w-20" v-b-toggle.sidebar-navbar :src="publicPath + 'res/icons/base/menu.svg'">
      </b-navbar>

      <b-sidebar id="sidebar-navbar" sidebar-class="w-240" backdrop shadow right>
        <b-navbar class="no-gutters p-0">
          <b-navbar-nav class="col flex-column">
            <b-nav-item v-for="item in headerNav.navs"
              :key="'nav_'+item.name"
              :to=item.to
              :href=item.href
              :target=item.target
              :active=item.active
              >{{ $t(item.i18n) }}</b-nav-item>
            <b-nav-item>{{ $t('global.more') }}</b-nav-item>
            <b-nav-item
              v-for="item in headerNav.more"
              :key="'nav_'+item.name"
              :to=item.to
              :href=item.href
              :target=item.target
              :active=item.active
              >
              <span v-show="item.href || item.to" class="pl-3">{{ $t(item.i18n) }}</span>
            </b-nav-item>
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

  import store from '../../store'

  export default {
    components: {
      SelLanguage
    },
    async mounted () {
      await store.request.getAllAnnouncements()
      await store.request.getAllInfo()
    },
    methods: {
      onStatement () {
        const { $i18n, $router, $createElement } = this
        const { statement } = store.announcement
        const { locale } = $i18n

        const messageVNode = $createElement('div', { class: [] }, [
          $createElement('p', { domProps: { innerHTML: statement[locale].content } }),
        ])

        this.$bvModal.msgBoxConfirm([messageVNode], {
            titleHtml: statement[locale].title,
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
            data === false &&
              $router.push({ name: 'Statemented', path: '/statemented' })
          })
      }
    },
    computed: {
      publicPath() {
        return process.env.BASE_URL
      },
      headerNav () {
        const { $route, $i18n } = this
        const { locale } = $i18n
        const navs = [
          { name: 'home', to: { name: 'RootIndex' }, i18n: 'global.home' },
          { name: 'swap', to: { name: 'Swap' }, i18n: 'global.swap', active: 'Swap' === $route.name },
          { name: 'liquidity', to: { name: 'Liquidity' }, i18n: 'global.liquidity', active: 'Liquidity' === $route.name },
          { name: 'dao', to: { name: 'Dao', path: '/dao' }, i18n: 'global.dao' },
          { name: 'lock', to: { name: 'Lock', path: '/sfg' }, i18n: 'global.lock' },
        ]

        const more = [
          { name: 'risks', to: { name: 'Risks', path: '/risks' }, i18n: 'global.risks' },
          { name: 'statemented', to: { name: 'Statemented', path: '/statemented' }, i18n: 'global.announcements' },
          { name: 'voting', href: 'https://signal.s.finance/', target: '_blank', i18n: 'global.voting' },
          { name: 'wiki', href: locale === 'zh-CN' ? 'https://wiki.s.finance/zh/home' : 'https://wiki.s.finance/en/home', target: '_blank', i18n: 'global.wiki' }
        ]

        return {
          navs,
          more
        }
      },
      statementTitle () {
        const { $i18n } = this
        const { statement } = store.announcement

        return statement &&
          statement[$i18n.locale] &&
          statement[$i18n.locale].title
      }
    }
  }
</script>

<style scoped>
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
.tip {
  padding: 6px 8px;
  background: #E0E4E6;
  border-radius: 12px;
  margin-left: 8px;
  font-size: 12px;
  line-height: 12px;
  display: flex;
}
.tip img {
  height: 12px;
  margin-right: 4px;
}
.tip.okexc {
  background: #205FEC;
  color: rgba(255, 255, 255, 0.85);
}
</style>