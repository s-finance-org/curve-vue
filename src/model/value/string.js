const ModelValueText = {
  /**
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

export default ModelValueText
