import Web3 from "web3";
/*import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import Authereum from "authereum";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
*/
import Onboard from 'bnc-onboard'
import TransportU2F from "@ledgerhq/hw-transport-u2f";

import Notify from "bnc-notify"

import * as common from './utils/common.js'
import * as state from './contract.js'
import { infura_url } from './allabis.js'
import { multicall_address, multicall_abi } from './allabis'

/*const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "e96fe629996f48e2ae907a30feeefa09" // required
        }
    },
    authereum: {
        package: Authereum, // required
        options: {}
    },
    burnerconnect: {
        package: BurnerConnectProvider, // required
        options: {}
    },
    fortmatic: {
        package: Fortmatic, // required
        options: {
          key: "pk_live_190B10CE18F47DCD" // required
        }
    }
};*/

/*const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});*/

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

export function notifyNotification(message) {
  let notificationObject = {
    eventCode: 'notification',
    type: 'pending',
    message: message,
  }

  return notify.notification(notificationObject)
}

const wallets = [
  { walletName: "metamask" },
  {
    walletName: "trezor",
    appUrl: "https://curve.fi",
    email: "info@curve.fi",
    rpcUrl:
      `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`
  },
  {
    walletName: "ledger",
    rpcUrl:
      `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`,
    LedgerTransport: TransportU2F,
  },
  { walletName: "dapper" },
  { walletName: "coinbase" },
  { walletName: "status" },
  { walletName: "fortmatic", apiKey: "pk_live_190B10CE18F47DCD" },
  { walletName: "authereum", apiKey: "_BTsipRcEmPeuVteLOGdoh1CXt733YLZ7u3ipbe_dAk" },
  { 
    walletName: "trust",
    rpcUrl: `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`,
  },
  {
    walletName: "walletConnect",
    infuraKey: process.env.VUE_APP_INFURA_KEY
  },
  { 
    walletName: "walletLink",
    appName: 'Curve Finance',
    appLogoUrl: 'https://www.curve.fi/logo.png',
    rpcUrl:
    `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`,
  },
  {
    walletName: "portis",
    apiKey: "a3bb2525-5101-4a9c-b300-febc6319c3b4"
  },
  { walletName: "torus" },
  { walletName: "squarelink", apiKey: "db2074f87c34f247593c" },
  { walletName: "opera" },
  { walletName: "operaTouch" },
  { walletName: "unilogin" },
  { walletName: "imToken", rpcUrl: `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}` },
  { walletName: "meetone" },
  { walletName: "mykey", rpcUrl: `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}` },
  { walletName: "huobiwallet", rpcUrl: `https://${process.env.VUE_APP_INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}` },
]

if(window.web3 && window.web3.currentProvider.isTrust) {
  wallets.find(wallet => wallet.walletName == 'trust').preferred = true
}

if(window.web3 && window.web3.currentProvider.isImToken) {
  wallets.find(wallet => wallet.walletName == 'imToken').preferred = true
}

if(window.web3 && window.web3.currentProvider.isStatus) {
  wallets.find(wallet => wallet.walletName == 'status').preferred = true
}

if(window.web3 && window.web3.currentProvider.wallet == "MEETONE") {
  wallets.find(wallet => wallet.walletName == 'meetone').preferred = true
}

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
      if(network != 1) {
        state.contract.error = 'Error: wrong network type. Please switch to mainnet';
        state.contract.showShares = false
        window.web3 = new Web3(infura_url)
      }
      else {
        state.contract.error = ''
        state.contract.showShares = true;
      }
    },
    address: account => {
      if(state.contract.default_account && state.contract.initializedContracts)
        common.update_fee_info()
      state.contract.default_account = account;
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
  state.contract.web3 = new Web3(infura_url)
  console.time('initswap')
	//try catch for checking cancel dialog
	//const provider = await web3Modal.connect();

	/*const web3 = new Web3(provider);
	window.web3 = web3;
  window.web3provider = web3;*/
  try {
    state.contract.initializedContracts = false;
    let userSelectedWallet = await onboard.walletSelect(localStorage.getItem('selectedWallet') || window.web3 && window.web3.currentProvider.isTrust && 'Trust');
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

export default init;
