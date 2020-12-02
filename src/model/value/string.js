export default {
  /**
   *  @return {!Object}
   */
  create () {
    const __store__ = {
      value: '',
      cont: '-'
    }

    return {
      type: 'string',

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
        __store__.value = val

        this.afterUpdate()
      },

      /**
       *  赋值 value
       *  - 链式
       *  @param {*} val
       *  @return {!Object}
       */
      setValue (val) {
        this.value = val

        return this
      },

      /** @type {string} */
      get cont () {
        const { value, loading } = this

        if (!loading) {
          __store__.cont = value
        }

        return __store__.cont
      }
    }
  }
}
