import * as helpers from '../../utils/helpers'
import { floor } from '../../utils/math/round'

export default {
  /**
   *  @return {!Object}
   */
  create ({
    handled = undefined,
    contDecimal = 2,
    contDefault = '-',
    contMethod = floor,
  } = {}) {
    const __store__ = {
      handled: '',
      cont: contDefault,
      contDefault
    }

    return {
      USD: {
        contDecimal,

        /** @type {boolean} */
        loading: true,
        beforeUpdate () {
          this.loading = true
        },
        afterUpdate () {
          this.loading = false
        },

        /** @type {string} */
        get handled () {
          return __store__.handled
        },
        set handled (val) {
          __store__.handled = val

          this.afterUpdate()
        },

        /** @type {string} */
        get cont () {
          const { contDefault } = __store__
          const { handled, contDecimal, loading } = this
          let result = contDefault

          if (!loading) {
            // FIXME: formatNumber toFixed -> round()
            result = __store__.cont = helpers.formatNumber(contMethod(handled, contDecimal), contDecimal)
          }

          return result
        }
      }
    }
  }
}
