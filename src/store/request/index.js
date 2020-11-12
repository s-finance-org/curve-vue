import store from '../../store'

import requests from '../../utils/requests'

export default {
  getAllAnnouncements: async () => {
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
  getAllInfo: async () => {
    const res = await requests.get('https://api.s.finance/v1/sfinance')

    const { pool, sFinance } = store
    const transforms = {
      '0': pool.QUSD5,
      '1': pool.USD5,
      '2': pool.dUSD,
      '3': pool.iUSD,
    }

    res.data.pools.forEach((item, idx) => {
      if (transforms[idx]) {
        transforms[idx].dailyVol.handled = item.vol.vol_24h
      }
    })

    store.sFinance.dailyVol.handled = res.data.total_daily_swap
    store.sFinance.totalValueStaked.handled = res.data.total_lptoken_value_staked
  },
  getDforceApy: async () => {
    const res = await requests.get('https://markets.dforce.network/api/v2/getApy/')

    return res
  }
}