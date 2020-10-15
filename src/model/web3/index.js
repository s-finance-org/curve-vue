import Web3 from 'web3'

const INFURA_URL = `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`
const web3 = new Web3(INFURA_URL)

export default web3
