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
