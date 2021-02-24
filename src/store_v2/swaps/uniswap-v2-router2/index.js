import BN from 'bignumber.js'

import abi from './abi'
import ModelSwap from '../../../model/swap'

export default ModelSwap.create({
  code: 'uniswapV2Router2',
  address: process.env.VUE_APP_UNISWAP_V2_ROUTER2_SWAP,
  abi
}).extend(function (__root__) {
  /**
   * @param {number} amountIn unit256
   * @param {Array} path address[]
   * @return {Array} [amountIn, totalPrice]
   */
  this.getAmountsOut = async (amountIn, path) => {
    const { contract } = this
    let result = []

    try {
      result = await contract.methods.getAmountsOut(amountIn, path).call()
    } catch (err) {
      console.error('uniswapV2Router2 getAmountsOut()', err)
    }

    return result
  }

  /**
   * @param {Object} targetTokenObj
   * @param {Object} unitTokenObj
   * @param {string=} amount
   * @return {string}
   */
  this.getPrice = async (targetTokenObj, unitTokenObj, amount = 1) => {
    const amountIn = BN(amount).times(targetTokenObj.precision).toString()
    const amounts = await this.getAmountsOut(
      amountIn,
      [targetTokenObj.address, unitTokenObj.address]
    )

    let result = '0'
    try {
      result = BN(amounts[1]).dividedBy(amount).dividedBy(unitTokenObj.precision).toString()
    } catch (err) {
      console.error('uniswapV2Router2 getPrice()', err)
    }

    return result
  }
})
