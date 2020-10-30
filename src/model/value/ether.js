import BigNumber from 'bignumber.js'
import * as helpers from '../../utils/helpers'
import { floor } from '../../utils/math/round'

const ModelValueEther = {
  /**
   *  @return {!Object}
   */
  create ({
    decimal = 18,
    ether = null,
    contDecimal = 6,
    contDefault = '-',
    contMethod = floor
  } = {}) {
    const __store__ = {
      ether: '000000000000000000',
      handled: '',
      cont: contDefault
    }

    const model = {
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

      /**
       *  Universal data
       *  @type {(string|number)}
       */
      get value () {
        return this.ether
      },
      set value (val) {
        this.ether = val
      },

      /** @type {string} */
      get ether () {
        return __store__.ether
      },
      set ether (val) {
        const { precision } = this
        const result = __store__.ether = val

        this.handled = BigNumber(result).div(precision).toString()
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

        if (!loading) {
          // FIXME: formatNumber toFixed -> round()
          __store__.cont = helpers.formatNumber(contMethod(handled, contDecimal), contDecimal)
        }

        return __store__.cont
      }
    }

    ether != null
      && (model.ether = ether)

    return model
  }
}

export default ModelValueEther
