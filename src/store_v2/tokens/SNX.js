import { ModelToken } from '../../model/index1'
import ABI from './helpers/abi'

export default ModelToken.create({
  code: 'SNX',
  address: process.env.VUE_APP_SNX_TOKEN,
  abi: ABI.ERC20,
})
