/**
 *  NOtE:
 *  Store
 */

import Vue from 'vue'

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
  }
}

export default Vue.observable(store)
