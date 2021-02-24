import { ModelToken } from '../../../model/index1'
import abi from './abi'

export default ModelToken.create({
  code: 'SFG-UU',
  address: process.env.VUE_APP_SFG_UU_TOKEN,
  abi,
})
