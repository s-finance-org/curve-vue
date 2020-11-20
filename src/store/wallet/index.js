// TEMP:
import { contract as currentContract } from '../../contract'

export default {
  get name () {
    return currentContract.walletName || '-'
  },
  get address () {
    return currentContract.default_account || '0x0000000000000000000000000000000000000000'
  }
}