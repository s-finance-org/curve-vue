import BN from 'bignumber.js'

import ModelSwap from '../../model/swap'
import abi from './uniswapV2Router2_abi'

export default ModelSwap.create({
  address: process.env.VUE_APP_UNISWAP_V2_ROUTER2_SWAP,
  abi,
  methods: {
    /**
     *  @param {number} amountIn
     *  @param {Array} path
     */
    async getAmountsOut (amountIn, path) {
      const { contract } = this
console.log('amountIn, path', amountIn, path)
      return contract.methods.getAmountsOut(amountIn, path).call()
    },
    async getPrice (targetTokenObj, unitTokenObj, amount = 1) {
      console.log('asdfasdf', BN(amount).times(targetTokenObj.precision).toString())
      const arr = await this.getAmountsOut(
        BN(amount).times(targetTokenObj.precision).toString(),
        [targetTokenObj.address, unitTokenObj.address]
      )

      let result = '0'
      if (Array.isArray(arr)) {
        result = BN(arr[1]).dividedBy(amount).dividedBy(unitTokenObj.precision).toString()
      }

      return result
    }
  }
})
