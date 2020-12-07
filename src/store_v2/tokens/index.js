import swaps from '../swaps'

import DAI from './DAI'
import USDT from './USDT'
import DF from './DF'
import USDG from './USDG'
import GT from './GT'
import KUN from './KUN'
import SFG from './SFG'
import SNX from './SNX'
import CRV from './CRV'

import QUSD5 from './QUSD5'
import iUSD from './iUSD'
import dUSD from './dUSD'
import USDG5 from './USDG5'
import USD5 from './USD5'
import sUSDv2 from './sUSDv2'
import BPT_DAI$SFG from './BPT_DAI$SFG'

const tokens = {
  DAI,
  USDT,
  DF,
  USDG,
  GT,
  KUN,
  SFG,
  SNX,
  CRV,

  /* LP token */
  QUSD5,
  iUSD,
  dUSD,
  USDG5,
  USD5,
  sUSDv2,
  BPT_DAI$SFG
}

// FIXME:
let aaa = []
Object.values(tokens).forEach(item => {
  aaa = aaa.concat(item.series.initiate)
})

swaps.multicall.batcher(aaa)

export default tokens
