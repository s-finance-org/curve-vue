import { ModelToken } from '../../../model/index1'
import abi from './abi'

// TODO:
export default ModelToken.create({
  code: 'UU',
  address: process.env.VUE_APP_UU_TOKEN,
  abi,
})
