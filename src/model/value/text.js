const ModelValueText = {
  /**
   */
  create () {
    const __store__ = {
      value: '',
      cont: '-'
    }

    return {
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
      get value () {
        return __store__.value
      },
      set value (val) {
        __store__.value = val

        this._update()
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
