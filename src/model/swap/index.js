import web3 from '../web3'

import ModelValueError from '../value/error'

export default {
  /**
   * @param {Object} opts
   * @param {string} opts.code
   * @param {string=} opts.address 地址，address 选其一
   * @param {Array=} opts.abi
   * @return {!Object}
   */
  create ({
    code = '',
    address = '',
    abi = []
  } = {}) {
    const __store__ = {
      contract: null
    }

    // TODO: address 不存在则不应该创建 contract
    return {
      /**
       * 链式方法扩展
       * - this 指为根
       * @param {Function} callback(this)
       * @return {!Object}
       */
      extend (callback) {
        callback.apply(this, [this])

        return this
      },

      /**
       * Base
       */
      code,
      address,
      abi,

      /**
       * 合约
       * - 被动式连接
       * @type {Object}
       */
      get contract () {
        const { contract } = __store__
        const { address, abi } = this

        return __store__.contract
          || (__store__.contract = new web3.eth.Contract(abi, address))
      },
      web3,

      error: ModelValueError.create()
    }
  }
}
