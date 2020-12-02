import swaps from '../swaps'

import DAI from './DAI'
import USDT from './USDT'
import DF from './DF'
import USDG from './USDG'

import QUSD5 from './QUSD5'
import iUSD from './iUSD'
import dUSD from './dUSD'
import USDG5 from './USDG5'

console.log('multicall', swaps.multicall)

const tokens = {
  DAI,
  USDT,
  DF,
  USDG,

  /* LP token */
  QUSD5,
  iUSD,
  dUSD,
  USDG5
}

let aaa = []
Object.values(tokens).forEach(item => {
  aaa = aaa.concat(item.initiate())
  console.log(aaa)
})

swaps.multicall.batcher(aaa)

export default tokens
