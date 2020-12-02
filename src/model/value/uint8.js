export default {
  /**
   *  @param {string=} contDefault
   *  @return {!Object}
   */
  create ({
    contDefault = '-'
  } = {}) {
    const __store__ = {
      loading: true,
      handled: '0',
      contDefault,
    }

    const beforeUpdate = () => {
      __store__.loading = true
    }

    const afterUpdate = () => {
      __store__.loading = false
    }

    return {
      type: 'uint8',

      /** @type {boolean} */
      get loading () {
        return __store__.loading
      },
      beforeUpdate,
      afterUpdate,

      /** @type {number} */
      min: 0,
      /** @type {number} */
      max: 255,

      /**
       *  IO
       *  @type {string}
       */
      get value () {
        return this.handled
      },
      set value (val) {
        this.handled = val
      },

      /** @type {string} */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        const { min, max } = this
        const result = +val

        if (min <= result && result <= max) {
          __store__.handled = val

          afterUpdate()
        } else {
          beforeUpdate()
        }
      },

      /** @type {string} */
      get cont () {
        const { contDefault } = __store__
        const { handled, loading } = this

        return loading
          ? contDefault
          : handled
      }
    }
  }
}
