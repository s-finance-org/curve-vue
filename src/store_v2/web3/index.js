import Web3 from 'web3'

const INFURA_URL = `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`

export default new Web3(INFURA_URL)
