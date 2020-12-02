import { ModelToken } from '../../model/index1'
import ABI from './helpers/abi'

export default ModelToken.create({
  code: 'USDG',
  address: process.env.VUE_APP_USDG_TOKEN,
  abi: ABI.ERC20,
})
