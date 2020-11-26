import web3 from '../../../model/web3'

import ModelSwap from '../../../model/swap'
import abi from './abi'

export default ModelSwap.create({
  address: process.env.VUE_APP_MULTICALL_SWAP,
  abi,
  methods: {
    /**
     *  @param {Array} calls tuple[]
     *  @return {Array}
     */
    async aggregate (calls) {
      const { contract } = this

      let result = []

      try {
        /* res
          {
            0: number, // blockNumber
            1: Array, // returnData
            blockNumber: number, // blockNumber
            returnData: Array, // returnData
          }
         */
        result = await contract.methods.aggregate(calls).call()
      } catch (err) {
        console.error('nulticall aggregate()', err)
      }

      return result
    },
    /**
     *  @param {Array} targetQueues [{ decodeType: '', call: [], [target: Object,] [result: null] }, ...]
     *  @return {Array}
     */
    async batcher (targetQueues) {
      const result = await this.aggregate(targetQueues.map(item => item.call))

      targetQueues.forEach((item, idx) => {
        item.result = web3.eth.abi.decodeParameter(item.decodeType, result.returnData[idx])

        if (item.target) {
          item.target.value = item.result
        }
      })

      return targetQueues
    }
  }
})
