import * as helpers from '../utils/helpers'
import { floor } from '../utils/math/round'

const valueModelStore = {
  create () {
    return {
      loading: true,
      ether: -1,
      revised: 0,
      defaultRevised: '',
      handled: -1,
      cont: -1,
    }
  }
}

export const valueModel = {
  /**
   *  @param {Object=} [opts]
   *  @param {string=} [name]
   *  @param {number=} [priceDecimal]
   *  @return {!Object}
   */
  create ({
    name = '',
    priceDecimal = 4,
    percentDecimal = 2,
    notationDecimal = 1e18,
    contMethod = floor,
  } = {}) {
    const __store__ = valueModelStore.create()
    const keys = {
      loading: name + 'loading',
      ether: name + 'ether',
      revised: name + 'revised',
      handled: name + 'handled',
      percent: name + 'percent',
      cont: name + 'cont',
    }

    return {
      /**
       *  @type {number}
       */
      priceDecimal,
      percentDecimal,

      /**
       *  @type {boolean}
       */
      get [keys.loading] () {
        return __store__.loading
      },
      set [keys.loading] (val) {
        __store__.loading = val
      },

      /**
       *  TODO: typeNumber?
       *  @type {number}
       */
      get [keys.ether] () {
        return __store__.ether
      },
      set [keys.ether] (val) {
        const result = __store__.ether = val

        this[keys.handled] = result / notationDecimal
      },

      /**
       *  @type {string}
       */
      get [keys.revised] () {
        return __store__.revised
      },
      set [keys.revised] (val) {
        __store__.revised = floor(val, priceDecimal)
      },
      // TODO:
      // get validRevised () {
      //   const { revised } = __store__

      //   return +revised >= 0
      // },

      /**
       *  TODO: typeNumber?
       *  @type {number}
       */
      get [keys.handled] () {
        return __store__.handled
      },
      set [keys.handled] (val) {
        __store__.handled = val

        this[keys.loading] &&
          (this[keys.loading] = false)
      },

      /**
       *  @type {number}
       */
      get [keys.percent] () {
        const { handled } = __store__
        const { percentDecimal } = this
        const val = handled * 100

        return val >= 0
          // TODO: formatNumber toFixed -> round()
          ? helpers.formatNumber(contMethod(val, percentDecimal), percentDecimal)
          : '-'
      },

      /**
       *  @type {string}
       */
      get [keys.cont] () {
        const { handled } = __store__
        const { priceDecimal } = this

        // TODO: formatNumber toFixed -> round()
        return handled >= 0
          ? helpers.formatNumber(contMethod(handled, priceDecimal), priceDecimal)
          : '-'
      }
    }
  }
}

