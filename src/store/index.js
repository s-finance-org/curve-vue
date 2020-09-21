/**
 *  NOtE:
 *  Store
 */

import Vue from 'vue'

import I18nLanguages from '../i18n/languages'

const __store__ = {
  create () {
    return {
      i18n: {
        locale: ''
      }
    }
  }
}


const store = {
  metaInfo: {
    template: {
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
        {'name': 'twitter:image', 'content': '/sfinance.png'},
      ]
    },
    getData() {
      return this.template
    }
  },
  i18n: {
    $i18n: null,

    cacheKeyLocaleCacheKey: '__Global_I18n_locale',
    get defaultLocale () {
      const { cacheKeyLocaleCacheKey } = this

      return localStorage.getItem(cacheKeyLocaleCacheKey) || process.env.VUE_APP_I18N_LOCALE
    },

    // TODO:
    // get locale () {
    //   return this.$i18n.locale
    // },
    set locale (val) {
      const { cacheKeyLocaleCacheKey } = this

      localStorage.setItem(cacheKeyLocaleCacheKey, val)
    },

    supportLanguage: ['zh-CN', 'en-US'],
    // TODO:
    // isSupportLanguage () {
    // },
    languages: I18nLanguages
  }
}

export default Vue.observable(store)
