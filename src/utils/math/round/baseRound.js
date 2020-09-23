import { toInteger } from '../../number'

const
  MAX_SAFE_PRECISION_LENGTH = 292
/**
 *  baseClamp
 *  @param {number} num
 *  @param {number=} [lower]
 *  @param {number=} [upper]
 *  @return {number}
 */
function baseClamp (num, lower, upper) {
  if (num === num) {
    lower !== undefined &&
      num < lower &&
      (num = lower, 1) ||
      upper !== undefined &&
      num > upper &&
      (num = upper)
  }

  return num
}

/**
 *  @param {number} precision
 *  @return {number}
 */
function baseRevisePrecision (precision) {
  return baseClamp(precision, -MAX_SAFE_PRECISION_LENGTH, MAX_SAFE_PRECISION_LENGTH)
}

/**
 *  - lodash
 *  @see {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/round}
 *  @param {string} methodName ceil、floor、round
 *  @return {Function(number,number):number}
 */
export default function (methodName) {
  var func = Math[methodName]

  return (num, precision = 0) => {
    precision = baseRevisePrecision(toInteger(precision))
    if (precision) {
      let pair = `${num}e`.split('e')
      const val = func(`${pair[0]}e${+pair[1] + precision}`)

      pair = `${val}e`.split('e')
      return +`${pair[0]}e${+pair[1] - precision}`
    };

    return func(num)
  }
}
