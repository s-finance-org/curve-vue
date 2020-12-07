import { ModelToken } from '../../model/index1'
import ABI from './helpers/abi'

export default ModelToken.create({
  code: 'KUN',
  address: process.env.VUE_APP_KUN_TOKEN,
  abi: ABI.ERC20,
})
