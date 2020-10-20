import web3 from '../web3'

import ModelValueError from '../value/error'

export default {
  /**
   *  @param {Object} opts
   *  @param {string} opts.address
   *  @param {Array} opts.abi
   *  @param {string} opts.code
   *  @param {string} opts.name
   *  @param {number} [opts.decimal=]
   *  @return {!Object}
   */
  create ({
    address = '',
    abi = [],
    code = '',
    name = '',
    methods = {}
  } = {}) {
    const __store__ = {
      contract: null
    }

    return {
      address,
      abi,

      get contract () {
        const { contract } = __store__
        const { abi, address } = this

        return contract ||
          (__store__.contract = new web3.eth.Contract(abi, address))
      },

      code,
      name,

      error: ModelValueError.create(),

      ...methods
    }
  }
}
