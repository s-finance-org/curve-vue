import { ModelPool } from '../../model/index1'

import tokens from '../tokens'
// XXX:
import ModelMetapool from '../../model/pool/meta'
// XXX:
import metapoolAbi from '../../components/dao/abi/swapAbi_iUSD_LPT'

/**
 *  USDG5
 *  - (USDG/USD5)
 *  - (USDG/DAI/USDC/USDT/TUSD/PAX)
 */
export default ModelPool.create({
  code: 'USDG5',
  lpt: tokens.USDG5,
  meta: ModelMetapool.create({
    address: process.env.VUE_APP_USDG5_SWAP,
    abi: metapoolAbi,
    underlyingCoins: [
      tokens.USDG,
      tokens.USD5
    ]
  })
})
