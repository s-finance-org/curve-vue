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
      // 'DAI-USDT-USDC-sUSD': pool.sUSDv2,
      // 'SFG-DAI': pool.SFG_DAI_BPT,
    }

    res.data.pools.forEach((item, idx) => {
      if (transforms[item.pair]) {
        transforms[item.pair].dailyVol.USD.handled = item.vol.vol_24h
      }
    })

    store.sFinance.dailyVol.USD.handled = res.data.total_daily_swap
    store.sFinance.totalValueStaked.USD.handled = res.data.total_lptoken_value_staked
  },
  async getDforceApy () {
    const res = await requests.get('https://markets.dforce.network/api/v2/getApy/')

    return res
  },
  async getTokenGt () {
    // const res = await requests.get('https://data.gateapi.io/api2/1/ticker/gt_usdt')

    return {
      rates: {
        // USDT: res.last
        USDT: '0.4740'
      }
    }
  }
}