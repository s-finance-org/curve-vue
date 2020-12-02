import { ModelToken } from '../../model/index1'
import QUSD5 from './QUSD5'

export default ModelToken.create({
  code: 'USDG5',
  address: process.env.VUE_APP_USDG5_TOKEN,
  abi: QUSD5.abi,
  isLpToken: true,
  // async getPrice () {
  //   const { price, moneyOfAccount } = this

  //   const result = await swaps.uniswapV2Router2.getPrice(this, moneyOfAccount)

  //   return price.ether = result
  // }
})
