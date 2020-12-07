import web3 from '../web3'

import { ModelSwap } from '../../model/index1'

const abi = [
  {
    'constant': true,
    'inputs': [],
    'name': 'getCurrentBlockTimestamp',
    'outputs': [{ 'name': 'timestamp', 'type': 'uint256' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'components': [
          { 'name': 'target', 'type': 'address' },
          { 'name': 'callData', 'type': 'bytes' }
        ],
        'name': 'calls',
        'type': 'tuple[]'
      }
    ],
    'name': 'aggregate',
    'outputs': [
      { 'name': 'blockNumber', 'type': 'uint256' },
      { 'name': 'returnData', 'type': 'bytes[]' }
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'getLastBlockHash',
    'outputs': [{ 'name': 'blockHash', 'type': 'bytes32' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [{ 'name': 'addr', 'type': 'address' }],
    'name': 'getEthBalance',
    'outputs': [{ 'name': 'balance', 'type': 'uint256' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'getCurrentBlockDifficulty',
    'outputs': [{ 'name': 'difficulty', 'type': 'uint256' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'getCurrentBlockGasLimit',
    'outputs': [{ 'name': 'gaslimit', 'type': 'uint256' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'getCurrentBlockCoinbase',
    'outputs': [{ 'name': 'coinbase', 'type': 'address' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [{ 'name': 'blockNumber', 'type': 'uint256' }],
    'name': 'getBlockHash',
    'outputs': [{ 'name': 'blockHash', 'type': 'bytes32' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }
]

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
console.log('multicall aggregate', calls)
        result = await contract.methods.aggregate(calls).call()
      } catch (err) {
        console.error('Multicall aggregate()', err)
      }

      return result
    },
    /**
     *  @param {Array} targetQueues [
     *    { call: [
     *        address,
     *        methods.a().encodeABI()
     *      ],
     *      [decodeType: '',] // 缺省来自 target.type
     *      [target: Object,] // 目标数据对象(ModelValue类型，需要有 value key)
     *      [result: null] // 返回的原始值
     *      [handler: Function] // 原始值处理
     *      [isMultiResult: false] // 是否为多个结果输出（针对数组、对象的结果）
     *    },
     *    ...]
     *  @return {Array}
     */
    async batcher (targetQueues) {
      const result = await this.aggregate(targetQueues.map(item => item.call))
console.log('targetQueues', targetQueues, result)
      try {
        targetQueues.forEach((item, idx) => {
          const decodeType = item.decodeType || item.target.type
console.log('item.isMultiResult', item.isMultiResult)
          // const decodeMethod = item.isMultiResult ? web3.eth.abi.decodeParameter : web3.eth.abi.decodeParameter
if (item.isMultiResult) {
  console.log('isMultiResult', decodeType, result.returnData[idx])
  item.result = web3.eth.abi.decodeParameters(decodeType, result.returnData[idx]) || null
} else {
  item.result = web3.eth.abi.decodeParameter(decodeType, result.returnData[idx]) || null
}

          // FIXME: 
          if (item.target) {
            item.target.value = item.result
          }
        })
      } catch (err) {
        console.error('Multicall batcher()', err)
      }

      return targetQueues
    }
  }
})
