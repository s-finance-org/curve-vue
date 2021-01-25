import BN from 'bignumber.js'

import store from '../../store'
import requests from '../../utils/requests'

export default {
  async getAllAnnouncements () {
    const res = await requests.get('https://api.s.finance/f/a/all')

    // sync
    const { announcement } = store
    res.data.forEach((item, idx) => {
      const result = {
        'en-US': {
          id: item.content.id,
          title: item.content['en'].title,
          content: item.content['en'].content,
          createAt: item.content.createAt
        },
        'zh-CN': {
          id: item.id,
          title: item.content['zh-cn'].title,
          content: item.content['zh-cn'].content,
          createAt: item.createAt
        },
      }

      announcement.notices.push(result)

      // First item
      !idx && (announcement.statement = result)
    })
  },
  async getAllInfo () {
    const res = await requests.get('https://api.s.finance/v1/sfinance')

    if (res.code !== '10000') return false

    const { pool, sFinance } = store
    const transforms = {
      'USDG-USD5': pool.USDG5,
      'QUSD-USD5': pool.QUSD5,
      'DAI-USDC-USDT-TUSD-PAX': pool.USD5,
      '(d)DAI-(d)USDC-(d)USDT-(d)USDx': pool.dUSD,
      '(i)DAI-(i)USDC-(i)USDT': pool.iUSD,
      'BUSD-USD5': pool.BUSD5,
      'BAC-DAI': pool.BASU,
      // 'DAI-USDT-USDC-sUSD': pool.sUSDv2,
      // 'SFG-DAI': pool.SFG_DAI_BPT,
    }

    if (res.data) {
      res.data.pools.forEach(item => {
        if (transforms[item.pair]) {
          transforms[item.pair].dailyVol.USD.handled = item.vol.vol_24h
        }
      })

      sFinance.dailyVol.USD.handled = res.data.total_daily_swap
      sFinance.totalValueStaked.USD.handled = res.data.total_lptoken_value_staked
    }
  },
  async getDforceApy () {
    const res = await requests.get('https://markets.dforce.network/api/v2/getApy/')

    return res
  },
  async getDfiApy () {
    const res = await requests.get('https://api.dfi.money/apy.json')

    // TODO:
    const $BN_DAI_totalApy = BN(res.dai.replace('%','')).dividedBy(100)
    const $BN_USDC_totalApy = BN(res.usdc.replace('%','')).dividedBy(100)
    const $BN_USDT_totalApy = BN(res.usdt.replace('%','')).dividedBy(100)

    return {
      DAI: {
        apy: {
          daily: $BN_DAI_totalApy.dividedBy(365).toString(),
          total: $BN_DAI_totalApy.toString()
        }
      },
      USDC: {
        apy: {
          daily: $BN_USDC_totalApy.dividedBy(365).toString(),
          total: $BN_USDC_totalApy.toString()
        }
      },
      USDT: {
        apy: {
          daily: $BN_USDT_totalApy.dividedBy(365).toString(),
          total: $BN_USDT_totalApy.toString()
        }
      }
    }
  },
  async getTokenBNB () {
    const tokenGT = 'binancecoin'
    const res = await requests.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ tokenGT }&vs_currencies=usd`)

    return {
      USD: res[tokenGT].usd
    }
  },
  async getTokenGt () {
    // const res = await requests.get('https://data.gateapi.io/api2/1/ticker/gt_usdt')
    // const res = await requests.get('https://api.s.finance/v1/sfinance')
    const tokenGT = 'gatechain-token'
    const res = await requests.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ tokenGT }&vs_currencies=usd`)

    const rates = {
      USDT: '0',
      USD: res[tokenGT].usd
    }

    // if (res.code !== '10000') return rates

    // const { pool } = store
    // const transforms = {
    //   'USDG-USD5': pool.USDG5
    // }

    // res.data
    //   && res.data.pools.some(item => {
    //     const bool = !!transforms[item.pair]
    //     if (bool) {
    //       rates.USDT = item.gt_last_price
    //     }

    //     return bool
    //   })

    return rates
  }
}