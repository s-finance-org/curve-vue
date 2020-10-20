import * as helpers from '../../utils/helpers'
import { floor } from '../../utils/math/round'

const ModelValueTether = {
  /**

   *  @return {!Object}
   */
  create ({
    decimal = 18,
    wrappedDecimal = 6,
    wrappedMethod = floor
  } = {}) {
    const __store__ = {
      tether: '000000000000000000',
      handled: '',
      wrapped: '-'
    }

    return {
      /** @type {number} */
      decimal,
      /** @type {number} */
      get precision () {
        const { decimal } = this

        return Math.pow(10, decimal)
      },

      /** @type {boolean} */
      loading: true,
      _update () {
        const { loading } = this

        // init
        if (loading) {
          this.loading = false
        }
      },

      /** @type {string} */
      get tether () {
        return __store__.tether
      },
      set tether (val) {
        const { precision } = this
        const result = __store__.tether = val

        this.handled = result / precision
      },

      /** @type {string|number} */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        __store__.handled = val

        this._update()
      },

      wrappedDecimal,
      /** @type {string} */
      get wrapped () {
        const { handled, wrappedDecimal } = this

        // FIXME: formatNumber toFixed -> round()
        // FIXME: >= 0 ?
        return handled >= 0
          ? helpers.formatNumber(wrappedMethod(handled, wrappedDecimal), wrappedDecimal)
          : '-'
      },
      set wrapped (val) {
        __store__.wrapped = val
      }
    }
  }
}

export default ModelValueTether
