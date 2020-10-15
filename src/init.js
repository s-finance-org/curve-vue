import Web3 from "web3";
/*import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import Authereum from "authereum";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
*/
import Onboard from 'bnc-onboard'
//import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import Notify from "bnc-notify"

import * as common from './utils/common.js'
import * as state from './contract.js'
import { infura_url } from './allabis.js'
import { multicall_address, multicall_abi } from './allabis'

export const notify = Notify({
  dappId: process.env.VUE_APP_BLOCKNATIVE_KEY,
  networkId: +process.env.VUE_APP_BLOCKNATIVE_NETWORK_ID,
  desktopPosition: 'topRight',
})

export function notifyHandler(hash) {
  let { emitter } = notify.hash(hash)
  emitter.on('all', transaction => ({
      onclick: () => window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank', 'noopener, norefferer')
    })
  )
}

export function notifyNotification(message, type = 'pending') {
  let notificationObject = {
    eventCode: 'notification',
    type: type,
    message: message,
  }

  return notify.notification(notificationObject)
}

/**
 *  @see <https://docs.blocknative.com/onboard#wallet-modules>
 */
let wallets = [
  {
    walletName: "metamask",
    preferred: true,
  },
  {
    walletName: "walletConnect",
    infuraKey: "6121e453b77a4855afa627a732bb7e4a",
    preferred: true,
  },
  {
    walletName: "trezor",
    appUrl: "https://s.finance",
    email: "robert@s.finance",
    rpcUrl: `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`,
    preferred: true,
  },
  {
    walletName: "ledger",
    rpcUrl: `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`,
    //LedgerTransport: TransportWebUSB,
    preferred: true,
  },
  // { walletName: "dapper" },
  { walletName: "coinbase" },
  { walletName: "status" },
  // { 
  //   walletName: "fortmatic",
  //   apiKey: "pk_live_190B10CE18F47DCD" // FORTMATIC_KEY
  // },
  // { walletName: "authereum" },
  {
    walletName: "trust",
    rpcUrl: `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`
  },
  // {
  //   walletName: "walletLink",
  //   appName: 'Curve Finance',
  //   appLogoUrl: 'https://s.finance/logo.png',
  //   rpcUrl: `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`
  // },
  // {
  //   walletName: "portis",
  //   apiKey: "" // PORTIS_KEY
  // },
  // { walletName: "torus" },
  // { walletName: "squarelink", apiKey: "" // SQUARELINK_KEY },
  // { walletName: "opera" },
  // { walletName: "operaTouch" },
  // { walletName: "unilogin" },
  { walletName: "imToken", rpcUrl: `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}` },
  { walletName: "meetone" },
]

let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

const _Web3 = window.web3

const walletsEnvFactor = {
  trust: {
    provider: _Web3 && _Web3.currentProvider.isTrust
  },
  imToken: {
    provider: _Web3 && _Web3.currentProvider.isImToken
  },
  status: {
    provider: _Web3 && _Web3.currentProvider.isStatus
  },
  coinbase: {
    provider: _Web3 && _Web3.currentProvider.isCoinbaseWallet
  },
  meetone: {
    provider: _Web3 && _Web3.currentProvider.wallet === "MEETONE"
  }
}

wallets = wallets.filter(wallet => {
  const factor = walletsEnvFactor[wallet.walletName]

  return !factor ||
    // TODO: only mobile env?
    (isMobile
      ? window.web3
        ? factor.provider
        : false
      : true)
})

export const onboard = Onboard({
  dappId: process.env.VUE_APP_BLOCKNATIVE_KEY,       // [String] The API key created by step one above
  networkId: +process.env.VUE_APP_BLOCKNATIVE_NETWORK_ID,  // [Integer] The Ethereum network ID your Dapp uses.
  subscriptions: {
    wallet: wallet => {
      state.contract.web3 = window.web3 = new Web3(wallet.provider)
      state.contract.walletName = wallet.name;
      localStorage.setItem('selectedWallet', wallet.name)
    },
    network: network => {
      if(process.env.VUE_APP_ONLY_MAINNETWORK === 'true' && network != 1) {
        state.contract.error = 'Error: wrong network type. Please switch to mainnet';
        state.contract.showShares = false
        window.web3 = new Web3(infura_url)
      } else {
        state.contract.error = ''
        state.contract.showShares = true;
      }
    },
    address: account => {
      if(account === undefined) {
        if(localStorage.getItem('-walletlink:https://www.walletlink.org:session:id') === null)
        changeWallets()
      }
      else {
        if(state.contract.default_account && state.contract.initializedContracts)
          common.update_fee_info()
        state.contract.default_account = account;
      }
    }
  },
  walletSelect: {
    wallets: wallets,
  },
  walletCheck: [
    { checkName: 'derivationPath' },
    { checkName: 'connect' },
    { checkName: 'accounts' },
    { checkName: 'network' },
  ],

});

async function init(init = true, name, walletlink = false) {
  console.time('initswap')
	//try catch for checking cancel dialog
	//const provider = await web3Modal.connect();

	/*const web3 = new Web3(provider);
	window.web3 = web3;
  window.web3provider = web3;*/
  try {
    state.contract.initializedContracts = false;
    let userSelectedWallet = await onboard.walletSelect(localStorage.getItem('selectedWallet')
      || window.web3 && window.web3.currentProvider.isTrust && 'Trust'
      || window.web3 && window.web3.currentProvider.isCoinbaseWallet && 'Coinbase');
    if(userSelectedWallet) await onboard.walletCheck();
    else window.web3 = new Web3(infura_url)
    state.contract.web3 = window.web3
    state.contract.multicall = new state.contract.web3.eth.Contract(multicall_abi, multicall_address)

    var default_account = (await state.contract.web3.eth.getAccounts())[0];
    state.contract.default_account = default_account;
    if(init) await state.init(name);
    state.contract.initializedContracts = true;
    console.timeEnd('initswap')
  }
  catch(err) {
    console.error(err)
  }

}

export async function changeWallets() {
  state.contract.default_account = ''
  onboard.walletReset()
  localStorage.removeItem('selectedWallet')
  state.contract.totalShare = 0

  await onboard.walletSelect()
  await onboard.walletCheck()
}

export default init;
