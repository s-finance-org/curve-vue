import web3 from '../web3'

const ModelToken = {
  /**
   *  @param {Object} opts
   *  @param {string} opts.address
   *  @param {Array} opts.abi
   *  @param {string} opts.code
   *  @param {string} opts.name
   *  @param {string} opts.symbol
   *  @param {number} [opts.decimal=]


   *  @return {!Object}
   */
  create ({
    address = '',
    abi = [],
    code = '',
    name = '',
    symbol = '',
    decimal = 18
  } = {}) {
    const __store__ = {
      contract: null,

      precision: 0
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
      symbol,
      decimal,

      /**
       *  @type {number}
       */
      get precision () {
        const { decimal } = this

        return Math.pow(10, decimal)
      },

      /**
       *  @param {Object!} target
       *  @param {string} address
       *  @return {Promise}
       */
      async getBalanceOf (target, address) {
        const { contract } = this

        const result = target.tether = await contract.methods.balanceOf(address).call()
        console.log('target.tether', target.tether)

        return result
      }
    }
  }
}

export default ModelToken
