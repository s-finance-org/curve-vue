import { ModelToken } from '../../model/index1'
import ABI from './helpers/abi'

export default ModelToken.create({
  code: 'SFG',
  address: process.env.VUE_APP_SFG_TOKEN,
  abi: ABI.ERC20,
})
