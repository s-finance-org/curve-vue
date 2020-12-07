import { ModelToken } from '../../model/index1'
import ABI from './helpers/abi'

export default ModelToken.create({
  code: 'sUSDv2',
  address: process.env.VUE_APP_SUSDV2_LPT_TOKEN,
  abi: ABI.ERC20,
  isLpToken: true
})
