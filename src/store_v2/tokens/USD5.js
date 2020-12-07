import { ModelToken } from '../../model/index1'
import ABI from './helpers/abi'

export default ModelToken.create({
  code: 'USD5',
  address: process.env.VUE_APP_USD5_TOKEN,
  abi: ABI.ERC20,
  isLpToken: true
})