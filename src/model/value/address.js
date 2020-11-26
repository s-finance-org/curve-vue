export default {
  /**
   */
  create ({
    contDefault = '-'
  } = {}) {
    const __store__ = {
      value: '',
      handled: '0x0000000000000000000000000000000000000000',
      cont: contDefault,
      contDefault
    }

    return {
      /** @type {boolean} */
      loading: true,
      beforeUpdate () {
        this.loading = true
      },
      afterUpdate () {
        this.loading = false
      },

      /** @type {string} */
      get value () {
        return __store__.value
      },
      set value (val) {
        this.handled = __store__.value = val
      },

      /** @type {string|number} */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        __store__.handled = val

        this.afterUpdate()
      },

      /** @type {string} */
      get cont () {
        const { handled, loading } = this
        const { contDefault } = __store__
        let result = contDefault

        if (!loading) {
          result = __store__.cont = handled
        }

        return result
      }
    }
  }
}