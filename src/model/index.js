import * as helpers from '../utils/helpers'

const valueModelStore = {
  create () {
    return {
      loading: true,
      tether: -1,
      handled: -1,
      cont: -1,
    }
  }
}

export const valueModel = {
  create (name = '') {
    const __store__ = valueModelStore.create()
    // TODO:
    const keys = {
      loading: name + 'loading',
      tether: name + 'tether',
      handled: name + 'handled',
      cont: name + 'cont',
    }

    return {
      // TODO:
      priceDecimal: 4,

      get [keys.loading] () {
        return __store__.loading
      },
      set [keys.loading] (val) {
        __store__.loading = val
      },

      get [keys.tether] () {
        return __store__.tether
      },
      set [keys.tether] (val) {
        const result = __store__.tether = val

        this[keys.loading] &&
          (this[keys.loading] = false)

        this[keys.handled] = result / 1e18
      },

      get [keys.handled] () {
        return __store__.handled
      },
      set [keys.handled] (val) {
        // TODO:
        const { priceDecimal } = this
        const result = __store__.handled = val

        this[keys.cont] = helpers.formatNumber(result, priceDecimal)
      },

      [keys.cont]: '-',
    }
  }
}