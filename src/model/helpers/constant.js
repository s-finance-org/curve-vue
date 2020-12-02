import BN from 'bignumber.js'

/** @type {string} */
export const TOKEN_MIN_AMOUNT_ETHER = '1'
/** @type {string} */
export const TOKEN_MAX_AMOUNT_ETHER = BN(2).pow(256).minus(1).div(2).toString()
