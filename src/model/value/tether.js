import * as helpers from '../../utils/helpers'
import { floor } from '../../utils/math/round'

const ModelValueTether = {
  /**

   *  @return {!Object}
   */
  create ({
    decimal = 18,
    contDecimal = 6,
    contMethod = floor
  } = {}) {
    const __store__ = {
      tether: '000000000000000000',
      handled: '',
      cont: '-'
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

      contDecimal,
      /** @type {string} */
      get cont () {
        const { handled, contDecimal, loading } = this

        // FIXME: formatNumber toFixed -> round()
        return !loading
          ? helpers.formatNumber(contMethod(handled, contDecimal), contDecimal)
          : __store__.cont
      }
    }
  }
}

export default ModelValueTether
