import baseRound from './baseRound'

/**
 *  @param {string|number} num
 *  @param {number=} [precision=0]
 *  @return {number}
 */
export const ceil = baseRound('ceil')

/**
 *  @param {string|number} num
 *  @param {number=} [precision]
 *  @return {number}
 */
export const floor = baseRound('floor')

/**
 *  @param {string|number} num
 *  @param {number=} [precision=0]
 *  @return {number}
 */
export const round = baseRound('round')
