import ModelSwap from '../../../model/swap'
import abi from './abi'
import web3 from '../../../model/web3'

export default ModelSwap.create({
  code: 'multicall',
  address: process.env.VUE_APP_MULTICALL_SWAP,
  abi
}).extend(function (__root__) {
  /**
   * @param {Array} calls tuple[]
   * @return {Array}
   */
  this.aggregate = async calls => {
    const { contract } = this
    let result = null

    try {
      /* res
        {
          0: number, // blockNumber
          1: Array, // returnData
          blockNumber: number, // blockNumber
          returnData: Array, // returnData
        }
       */
      console.log('mulit calls ->', calls)
      result = await contract.methods.aggregate(calls).call()
      console.log('mulit result <-', result)
    } catch (err) {
      console.error('multicall aggregate()', err)
    }

    return result
  }

  /**
   * @param {Array} targetQueues [
   * {  decodeType: '', 不存在时，则使用 target.type
   *    call: [],
   *    [target: Object,] Modal 的数据
   *    [result: null]
   * }, ...]
   * @return {Object} { successful, targetQueues }
   */
  this.batcher = async targetQueues => {
    const result = {
      successful: false,
      targetQueues
    }
    const multiData = await this.aggregate(targetQueues.map(item => item.call))

    // aggregate 要有返回值，否则没有 forEach 意义
    if (multiData) {
      result.successful = true
      targetQueues.forEach((item, idx) => {
        // 解码值后更新目标
        item.result = web3.eth.abi.decodeParameter(item.decodeType || item.target.type, multiData.returnData[idx])

        if (item.target) {
          // 通用 IO
          // TODO: 要让每个 value 都支持
          item.target.setValue
            ? item.target.setValue(item.result)
            : (item.target.value = item.result)
        }
      })
    }

    return result
  }

  /**
   * 装载
   * - 触发后在等待时间内合并数据，再一次性 multicall
   * @param {Array} arr
   */
  this.series = async arr => {
    const { seriesWaitingTime } = this

    // 合并更新
    this.serieData = this.serieData.concat(arr)

    if (!this.seriesReady) {
      this.seriesReady = true
      setTimeout(() => {
        const temp = this.serieData.concat()
        this.serieData = []
        this.seriesReady = false

        this.batcher(temp)
      }, seriesWaitingTime)
    }
  }

  /**
   * series 已准备就绪
   * @type {boolean}
   */
  this.seriesReady = false
  /**
   * series 等待时间（毫秒）
   * @type {number}
   */
  this.seriesWaitingTime = 1000
  /**
   * series 已装载的数据
   * @type {Array}
   */
  this.serieData = []
})
