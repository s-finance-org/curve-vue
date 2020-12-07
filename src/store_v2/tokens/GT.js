import { ModelToken } from '../../model/index1'
import ABI from './helpers/abi'

export default ModelToken.create({
  code: 'GT',
  address: process.env.VUE_APP_GT_TOKEN,
  abi: ABI.ERC20,
})
