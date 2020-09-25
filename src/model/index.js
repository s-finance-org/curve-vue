import * as helpers from '../utils/helpers'
import { floor } from '../utils/math/round'

const valueModelStore = {
  create () {
    return {
      loading: true,
      tether: -1,
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
    notationDecimal = 1e18,
    contMethod = floor,
  } = {}) {
    const __store__ = valueModelStore.create()
    const keys = {
      loading: name + 'loading',
      tether: name + 'tether',
      revised: name + 'revised',
      handled: name + 'handled',
      cont: name + 'cont',
    }

    return {
      /**
       *  @type {number}
       */
      priceDecimal,

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
      get [keys.tether] () {
        return __store__.tether
      },
      set [keys.tether] (val) {
        const result = __store__.tether = val

        this[keys.loading] &&
          (this[keys.loading] = false)

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

      /**
       *  TODO: typeNumber?
       *  @type {number}
       */
      get [keys.handled] () {
        return __store__.handled
      },
      set [keys.handled] (val) {
        __store__.handled = val
      },

      /**
       *  @type {string}
       */
      get [keys.cont] () {
        const { handled } = __store__
        const { priceDecimal } = this

        // TODO: formatNumber toFixed -> round()
        return helpers.formatNumber(contMethod(handled, priceDecimal), priceDecimal)
      }
    }
  }
}