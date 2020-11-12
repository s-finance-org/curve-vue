import Vue from "vue";
import BigNumber from 'bignumber.js'
window.BN = BigNumber
import { contract as currentContract, infura_url } from '../contract.js'
import { chunkArr } from './helpers'
import allabis, { multicall_address, multicall_abi, ERC20_abi, cERC20_abi, yERC20_abi, synthERC20_abi } from '../allabis'
import * as gasPriceStore from '../components/common/gasPriceStore'
import Web3 from "web3";

import * as errorStore from '../components/common/errorStore'
import { notify, notifyHandler, notifyNotification } from '../init'
import { valueModel } from "../model/index.js";

var cBN = (val) => new BigNumber(val);

let requiresResetAllowance = [
  process.env.VUE_APP_USDT_TOKEN, // USDT
  '0xC25a3A3b969415c80451098fa907EC722572917F', // Curve.fi DAI/USDC/USDT/sUSD
  '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3', // Curve.fi renBTC/wBTC/sBTC
  '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8', // Curve.fi yDAI/yUSDC/yUSDT/yTUSD
  process.env.VUE_APP_DFI_TOKEN, // s.finance iUSDT/iDAI/iUSDC
  process.env.VUE_APP_DUSD_TOKEN, // s.finance dDAI/dUSDC/dUSDT/dUSDx
  process.env.VUE_APP_OKUU_TOKEN, // s.finance OKU/USDT
  process.env.VUE_APP_USD5_TOKEN, // s.finance DAI/USDC/USDT/TUSD/PAX
  process.env.VUE_APP_QUSD5_TOKEN, // s.finance QUSD/DAI/USDC/USDT/TUSD/PAX
]

export function approve (contract, amount, account, toContract) {
  if (!toContract) toContract = currentContract.swap_address

  return new Promise((resolve, reject) => {
    contract.methods.approve(toContract, cBN(amount).toFixed(0,1))
      .send({
        from: account,
        gasPrice: gasPriceStore.state.gasPriceWei,
        gas: 100000,
      })
      .once('transactionHash', function (hash) {
        notifyHandler(hash)
        resolve(true)
      })
      .on('error', err => {
        errorStore.handleError(err)
        reject(err)
      })
      .catch(err => {
        errorStore.handleError(err)
        reject(err)
      })
  });
}

export function approveEvent (contract, amount, account, toContract, that) {
  if (!toContract) toContract = currentContract.swap_address
  // var { dismiss } = notifyNotification('11111111')

  contract.methods.approve(toContract, cBN(amount).toFixed(0,1))
    .send({
      from: account,
      gasPrice: gasPriceStore.state.gasPriceWei,
      gas: 100000,
    })
    .once('transactionHash', function (hash) {
      // dismiss()
      notifyHandler(hash)
      // TEMP: Avoid not triggering events.Approval
      that
        && window.setTimeout(() => that.loadingAction = false, 5000)
    })
    .on('error', err => {
      if (that) {
        that.waitingMessage = '',
        that.show_loading = false
        that.loadingAction = false
      }
      errorStore.handleError(err)
    })
    .catch(err => {
      errorStore.handleError(err)
    })

  return new Promise((resolve, reject) => {
    let onceLock = false

    contract.events.Approval()
      .on('data', function (data) {
        /* data
          {
            returnValues: {
              owner: '0x'
              spender: '0x'
              value: '0'
            }
          }
         */
        const filter = !onceLock
          && data.returnValues.value === amount
          && data.returnValues.owner === account
          && data.returnValues.spender === toContract

        console.log('events.Approval', filter, data)
        if (filter) {
          // TODO: double event
          onceLock = true
          window.setTimeout(() => onceLock = false, 3000)
          resolve(data)
        }
      })
      .on('error', err => {
        errorStore.handleError(err)
        reject(err)
      })
  })
}


export function approve_to_migrate(amount, account) {
    return new Promise(resolve => {
                currentContract.old_swap_token.methods.approve(currentContract.migration_address, amount)
                .send({
                    from: account, 
                    gasPrice: gasPriceStore.state.gasPriceWei,
                    gas: 100000,
                })
                .once('transactionHash', function(hash) {
                    notifyHandler(hash)
                    resolve(true);
                })
                .catch(err => {
                    errorStore.handleError(err)
                    reject(err)
                });
            });
}

export async function ensure_allowance_zap_out(amount, fromContract, toContract, infinite = false, that) {
  var default_account = currentContract.default_account
  if(!fromContract) fromContract = currentContract.swap_token;
  if(!toContract) toContract = allabis[currentContract.currentContract].deposit_address
  let allowance = cBN(await currentContract.swap_token.methods.allowance(default_account, toContract).call())
console.log('allowance', allowance.toString(), 'amount', amount)
  if(!infinite) {
    if(allowance.lt(cBN(amount))) {
      if(allowance > 0) await approveEvent(fromContract, 0, default_account, toContract, that)
      return await approveEvent(fromContract, amount, default_account, toContract, that)
    }
  }
  else {
    if(allowance.lt(currentContract.max_allowance.div(cBN(2))) && cBN(amount).gt(0)) {
      if(allowance > 0 && requiresResetAllowance.includes(fromContract._address))
        await approveEvent(fromContract, 0, default_account, toContract, that)
      return await approveEvent(fromContract, currentContract.max_allowance, default_account, toContract, that)
    }
  }
  return false
}


export async function ensure_allowance(amounts, plain = false, contractName, N_COINS, infinite = false, that = null) {
  var default_account = currentContract.default_account
  let cont = currentContract
  if(N_COINS === undefined) {
      N_COINS = currentContract.N_COINS
  }
  if(contractName !== undefined) {
      cont = currentContract.contracts[contractName]
  }
  var allowances = new Array(N_COINS);
  let coins = currentContract.coins;
  let swap = cont.swap_address;
  if(plain) {
      coins = cont.underlying_coins;
      swap = allabis[cont.currentContract].deposit_address;
  }
  let fromContract = coins
  let calls = []
  for (let i=0; i < N_COINS; i++) {
      calls.push([coins[i]._address, coins[i].methods.allowance(default_account, swap).encodeABI()])
// console.log(i, swap, await coins[i].methods.allowance(default_account, swap).call() )
  }
  let aggcalls = await currentContract.multicall.methods.aggregate(calls).call();
  allowances = aggcalls[1].map(hex => currentContract.web3.eth.abi.decodeParameter('uint256', hex));

  console.log('allowances', allowances, 'amounts', amounts)

  if (!infinite) {
    // Non-infinite
    for (let i=0; i < N_COINS; i++) {
      if (cBN(allowances[i]).isLessThan(cBN(amounts[i])) && cBN(amounts[i]).gt(0)) {
        if (allowances[i] > 0 && requiresResetAllowance.includes(coins[i]._address)) {
          await approveEvent(coins[i], 0, default_account, swap, that)
        }
        return await approveEvent(coins[i], amounts[i], default_account, swap, that);
      }
    }
  } else {
    // Infinite
    for (let i=0; i < N_COINS; i++) {
        if (cBN(allowances[i]).isLessThan(cont.max_allowance.div(cBN(2))) && cBN(amounts[i]).gt(0)) {
            if (allowances[i] > 0 && requiresResetAllowance.includes(coins[i]._address)) {
              await approveEvent(coins[i], 0, default_account, swap, that);
            }
            return await approveEvent(coins[i], cont.max_allowance, default_account, swap, that);
        }
    }
  }

  return false
}

// qusd5
export async function ensure_allowance_base(amounts, plain = false, contractName, N_COINS, infinite = false, that = null) {
  var default_account = currentContract.default_account
  let cont = currentContract
  if(N_COINS === undefined) {
    N_COINS = amounts.length
  }
  if(contractName !== undefined) {
    cont = currentContract.contracts[contractName]
  }
  var allowances = new Array(N_COINS);
  let coins = currentContract.underlying_coins;
  let swap = cont.swap_address;

  let fromContract = coins

  if(['qusd5'].includes(currentContract.currentContract)) {
    if (Object.keys(currentContract.base_coins).length === N_COINS) {
      coins = currentContract.base_coins
      swap = currentContract.deposit_address
      fromContract = coins
    }
  }

  let calls = []
  for (let i=0; i < N_COINS; i++) {
    calls.push([coins[i]._address, coins[i].methods.allowance(default_account, swap).encodeABI()])
// console.log(i, coins[i]._address, swap, await coins[i].methods.allowance(default_account, swap).call() )
  }
  let aggcalls = await currentContract.multicall.methods.aggregate(calls).call();
  allowances = aggcalls[1].map(hex => currentContract.web3.eth.abi.decodeParameter('uint256', hex));

  console.log('allowances', allowances, 'amounts', amounts)

  if (!infinite) {
    // Non-infinite
    for (let i=0; i < N_COINS; i++) {
      if (cBN(allowances[i]).isLessThan(cBN(amounts[i])) && cBN(amounts[i]).gt(0)) {
        if (allowances[i] > 0 && requiresResetAllowance.includes(coins[i]._address)) {
          await approveEvent(coins[i], 0, default_account, swap, that);
        }
        return await approveEvent(coins[i], amounts[i], default_account, swap, that);
      }
    }
  }
  else {
    // Infinite
    for (let i=0; i < N_COINS; i++) {
      if (cBN(allowances[i]).isLessThan(cont.max_allowance.div(cBN(2))) && cBN(amounts[i]).gt(0)) {
        if (allowances[i] > 0 && requiresResetAllowance.includes(coins[i]._address))
          await approveEvent(coins[i], 0, default_account, swap, that);
        return await approveEvent(coins[i], cont.max_allowance, default_account, swap, that);
      }
    }
  }

  return false
}

export async function ensure_underlying_allowance(i, _amount, underlying_coins = [], toContract, wrapped = false, contract, that) {
    if(!contract) contract = currentContract

    if(!underlying_coins.length) underlying_coins = contract.underlying_coins;
    let coins = underlying_coins
    if(wrapped) coins = contract.coins

    if (['qusd5'].includes(contract.currentContract)) {
      if (wrapped) {
        coins = currentContract.underlying_coins
      } else {
        coins = currentContract.base_coins
      }
    }

    var default_account = currentContract.default_account
    var amount = cBN(_amount);
// console.log('allowance coins i', i, coins[i]._address, coins)
    var current_allowance = cBN(await coins[i].methods.allowance(default_account, contract.swap._address).call());
// console.log('current_allowance', current_allowance.toString(), 'amount', amount)

    if (current_allowance.gte(amount)) return false;

    if ((cBN(_amount).isEqualTo(currentContract.max_allowance)) & (current_allowance.isGreaterThan(currentContract.max_allowance.div(cBN(2)))))
        return false;  // It does get spent slowly, but that's ok
    if ((current_allowance.isGreaterThan(cBN(0))) & (current_allowance.isLessThan(amount)) && requiresResetAllowance.includes(coins[i]._address))
        await approveEvent(coins[i], 0, default_account, toContract, that);
    return await approveEvent(coins[i], cBN(amount).toFixed(0,1), default_account, toContract, that);
}

export async function approveAmount(contract, amount, account, toContract, infinite = false) {
    let current_allowance = cBN(await contract.methods.allowance(account, toContract).call())
    console.log(currentContract.max_allowance)
    console.log(current_allowance.toString(), amount.toString(), current_allowance.lt(amount))
    if(!infinite) {
        if(current_allowance.lt(amount) && amount.gt(0)) {
            if(current_allowance > 0 && requiresResetAllowance.includes(contract._address)) {
              await approve(contract, 0, account, toContract)
            }
            await approve(contract, amount, account, toContract)
        }
    }
    else {
        if(current_allowance.lt(currentContract.max_allowance.div(cBN(2))) && cBN(amount).gt(0)) {
            if(current_allowance > 0 && requiresResetAllowance.includes(contract._address))
                await approve(contract, 0, account, toContract)
            await approve(contract, currentContract.max_allowance, account, toContract)
        }
    }
}

// XXX not needed anymore
// Keeping for old withdraw, to be removed whenever the chance is
export async function ensure_token_allowance() {
    var default_account = currentContract.default_account
    if (parseInt(await currentContract.swap_token.methods.allowance(default_account, currentContract.swap_address).call()) == 0)
        return new Promise(resolve => {
            currentContract.swap_token.methods.approve(currentContract.swap_address, cBN(currentContract.max_allowance).toFixed(0))
            .send({from: default_account})
            .once('transactionHash', function(hash) {
                notifyHandler(hash)
                resolve(true);
            })
            .catch(err => {
                errorStore.handleError(err)
            });
        })
    else
        return false;
}

export function init_menu() {
    $("div.top-menu-bar a").toArray().forEach(function(el) {
        if (el.href == window.location.href)
            el.classList.add('selected')
    })
    $('.poolsdropdown .dropdown a').toArray().forEach(function(el) {
        if(el.href.slice(0,-1) == window.location.origin)
            el.classList.add('selected')
    })
}

export async function ensure_stake_allowance(amount, stakeContract, infinite = false) {
    var default_account = currentContract.default_account;
    if(!stakeContract) stakeContract = currentContract.curveRewards
    let allowance = cBN(await currentContract.swap_token.methods.allowance(default_account, stakeContract._address).call());
    
console.log('allowance', allowance.toString(), 'amount', amount)
    if(!infinite) {
        if(allowance.lt(amount)) {
            if(allowance.gt(0))
                await approve(currentContract.swap_token, 0, default_account, stakeContract._address)
            await approve(currentContract.swap_token, amount, default_account, stakeContract._address)
        }
    }
    else {
        if(allowance.lt(currentContract.max_allowance.div(cBN(2))) && cBN(amount).gt(0)) {
            if(allowance > 0 && requiresResetAllowance.includes(currentContract.swap_token._address))
                await approve(currentContract.swap_token, 0, default_account, stakeContract._address)
            await approve(currentContract.swap_token, amount, default_account, stakeContract._address)
        }
    }
}


export function update_rates(version = 'new', contract) {
    if(!contract) contract = currentContract
    let calls = [];
    let callscoins = []

    if (['qusd5'].includes(contract.currentContract)) {
      let i = 0
      for (i; i < allabis[contract.currentContract].underlying_coins.length; i++) {
        let address = allabis[contract.currentContract].underlying_coins[i]

        if(checkTethered(contract, i)) {
          Vue.set(contract.c_rates, i, 1 / allabis[contract.currentContract].coin_precisions[i]);
        }
      }

      for (let j = 0; j < allabis[contract.currentContract].coins.length; j++) {
        let address = allabis[contract.currentContract].coins[j]

        if(checkBaseTethered(contract, j)) {
          Vue.set(contract.c_rates, j + i, 1 / allabis[contract.currentContract].coins_precisions[j]);
        }
      }

    } else {
      for (let i = 0; i < allabis[contract.currentContract].coins.length; i++) {
        let address = allabis[contract.currentContract].coins[i]
        /*
          rate: uint256 = cERC20(self.coins[i]).exchangeRateStored()
          supply_rate: uint256 = cERC20(self.coins[i]).supplyRatePerBlock()
          old_block: uint256 = cERC20(self.coins[i]).accrualBlockNumber()
          rate += rate * supply_rate * (block.number - old_block) / 10 ** 18
        */
        //for usdt pool
        if(checkTethered(contract, i)) {
          Vue.set(contract.c_rates, i, 1 / allabis[contract.currentContract].coin_precisions[i]);
        } else if(['iearn', 'busd', 'susd', 'pax', 'dfi', 'dusd', 'okuu'].includes(contract.currentContract)) {
            if(contract.currentContract == 'susd' && i == 1) {
                calls.push(['0xeDf54bC005bc2Df0Cc6A675596e843D28b16A966', '0xbb7b8b80'])
            } else {
              //getPricePerFullShare
              calls.push([address, '0x77c7b8fc'])
            }
  
            callscoins.push({pool: 'ys', i: i})
        } else {
            calls.push(
                //exchangeRateStored
                [address, '0x182df0f5'],
                //supplyRatePerBlock
                [address, '0xae9d70b0'],
                //accrualBlockNumber
                [address, '0x6c540baf'],
            )
            callscoins.push({pool: 'compounds', i: i})
        }
      }
    }

    return calls;
}

export async function update_fee_info(version = 'new', contract, update = true) {
    console.time('updatefeeinfo')
    let web3 = currentContract.web3 || new Web3(infura_url)
    if(!contract) contract = currentContract
    var swap_abi_stats = allabis[contract.currentContract].swap_abi;
    var swap_address_stats = allabis[contract.currentContract].swap_address;
    var swap_token_stats = allabis[contract.currentContract].swap_token
    var swap_token_address = allabis[contract.currentContract].token_address
    var swap_stats = contract.swap;
    var swap_token_stats = contract.swap_token;

    if(version == 'old') {
        swap_abi_stats = allabis[contract.currentContract].old_swap_abi;
        swap_address_stats = allabis[contract.currentContract].old_swap_address;
        swap_stats = contract.old_swap;
        swap_token_stats = contract.old_swap_token;
        swap_token_address = allabis[contract.currentContract].token_address
    }

    var default_account = contract.default_account || '0x0000000000000000000000000000000000000000';
    let calls = [
      //.fee()
      [swap_address_stats, swap_stats.methods.fee().encodeABI()],
      //.admin_fee()
      [swap_address_stats, swap_stats.methods.admin_fee().encodeABI()],
      //balanceOf(default_account)
      [swap_token_address, swap_token_stats.methods.balanceOf(default_account).encodeABI()],
      //token_supply()
      [swap_token_address, swap_token_stats.methods.totalSupply().encodeABI()],
    ]


    let swap = new web3.eth.Contract(swap_abi_stats, swap_address_stats);
    for (let i = 0; i < allabis[contract.currentContract].underlying_coins.length; i++) {
      calls.push([swap_address_stats, swap.methods.balances(i).encodeABI()])
    }

    // let swap_token_ = new web3.eth.Contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"nominateNewOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nominatedOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_target","type":"address"}],"name":"setTarget","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"callData","type":"bytes"},{"name":"numTopics","type":"uint256"},{"name":"topic1","type":"bytes32"},{"name":"topic2","type":"bytes32"},{"name":"topic3","type":"bytes32"},{"name":"topic4","type":"bytes32"}],"name":"_emit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"useDELEGATECALL","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"bool"}],"name":"setUseDELEGATECALL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"target","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newTarget","type":"address"}],"name":"TargetUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnerNominated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldOwner","type":"address"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"}], swap_token_address);
    // console.log('fee', await swap.methods.fee().call())
    // console.log('admin_fee', await swap.methods.admin_fee().call())
    // console.log('balanceOf', await swap_token_.methods.balanceOf(default_account).call())
    // console.log('totalSupply', await swap_token_.methods.totalSupply().call())

    let rates_calls = update_rates(version, contract);
    calls.push(...rates_calls)
    if(['susdv2','sbtc', 'iearn', 'y', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(contract.currentContract) && update)
        calls.push([allabis[contract.currentContract].sCurveRewards_address, contract.curveRewards.methods.balanceOf(default_account).encodeABI()])
    if(update) {
      console.log('multiInitState--' )
      await multiInitState(calls, contract)
    }
    return calls

    console.timeEnd('updatefeeinfo')
}

function checkTethered(contract, i) {
  return allabis[contract.currentContract].tethered
    && allabis[contract.currentContract].tethered[i]
    && allabis[contract.currentContract].use_lending
    && !allabis[contract.currentContract].use_lending[i]
    || allabis[contract.currentContract].is_plain[i]
    || contract.currentContract == 'susdv2';
}

function checkBaseTethered(contract, i) {
  return allabis[contract.currentContract].base_tethered
    && allabis[contract.currentContract].base_tethered[i]
    && allabis[contract.currentContract].base_use_lending
    && !allabis[contract.currentContract].base_use_lending[i]
    || allabis[contract.currentContract].base_is_plain[i];
}

export async function multiInitState(calls, contract, initContracts = false) {
    let web3 = currentContract.web3 || new Web3(infura_url)
    let multicall = new web3.eth.Contract(multicall_abi, multicall_address)
    var default_account = currentContract.default_account;
    let aggcalls;
    // console.log('calls', calls)
    try {
        aggcalls = await multicall.methods.aggregate(calls).call()
    }
    catch(err) {
      console.error(err)
      aggcalls = await multicall.methods.aggregate(calls.slice(1)).call()
      aggcalls[1] = [web3.eth.abi.encodeParameter('uint256', cBN(1e18).toFixed(0)), ...aggcalls[1]] 
    }
// console.log('calls ok')
    var block = +aggcalls[0]
    //initContracts && contract.currentContract == 'compound' && i == 0 || 
    let decoded = aggcalls[1].map((hex, i) =>
        (i >= aggcalls[1].length-(allabis[contract.currentContract].underlying_coins.length + allabis[contract.currentContract].coins.length))
          ? web3.eth.abi.decodeParameter('address', hex)
          : web3.eth.abi.decodeParameter('uint256', hex)
    )

    contract.oldBalance = 0
    if(initContracts) {
        contract.virtual_price = decoded[0] / 1e18;
        contract.A = decoded[1] / 1e18;
        contract.future_A = +decoded[2];
        contract.admin_actions_deadline = +decoded[3];
        decoded = decoded.slice(4);
    }
    if(initContracts && contract.currentContract == 'compound') {
        contract.oldBalance = decoded[0];
        decoded = decoded.slice(1);
    }
    if(initContracts && contract.currentContract == 'susdv2') {
        contract.oldBalance = decoded[0];
        contract.curveStakedBalance = decoded[1]
        decoded = decoded.slice(2);
    }
    if(initContracts && ['sbtc', 'iearn', 'y', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(contract.currentContract)) {
        contract.curveStakedBalance = decoded[0]
        decoded = decoded.slice(1);
    }
    if(initContracts && ['tbtc', 'ren', 'sbtc'].includes(contract.currentContract)) {
        contract.initial_A = +decoded[0];
        contract.initial_A_time = +decoded[1];
        contract.future_A_time = +decoded[2];
        decoded = decoded.slice(3)
    }
    contract.fee = decoded[0] / 1e10;
    contract.admin_fee = decoded[1] / 1e10;
    var token_balance = decoded[2]
    var token_supply = decoded[3]
    contract.totalBalance = token_balance
    contract.totalSupply = token_supply
    // let ratesDecoded = decoded.slice(4+allabis[contract.currentContract].N_COINS)
    let ratesDecoded = decoded.slice(4+allabis[contract.currentContract].underlying_coins.length)
    if(initContracts) {
      // let contractsDecoded = decoded.slice(-allabis[contract.currentContract].N_COINS*2)
      let contractsDecoded = decoded.slice(-(allabis[contract.currentContract].underlying_coins.length + allabis[contract.currentContract].coins.length))
      // chunkArr(contractsDecoded, 2).map((v, i) => {
      //     var addr = v[0];
      //     let coin_abi = cERC20_abi
      //     var underlying_addr = v[1];
      //     let underlying_abi = ERC20_abi
      //     if(contract.currentContract == 'susdv2' && i == 3 || contract.currentContract == 'sbtc' && i == 2) {
      //         coin_abi = synthERC20_abi
      //         underlying_abi = synthERC20_abi
      //     }
      //     if(['iearn', 'busd', 'susd', 'pax', 'dfi', 'okuu', 'usd5', 'qusd5'].includes(contract.currentContract)) coin_abi = yERC20_abi
      //     contract.coins.push(new web3.eth.Contract(coin_abi, addr));
      //     contract.underlying_coins.push(new web3.eth.Contract(underlying_abi, underlying_addr));
      // })

      contractsDecoded.forEach((v, i) => {
        var addr = v;
        let coin_abi = cERC20_abi
        let abi = ERC20_abi
        if (contract.currentContract == 'susdv2' && i == 3 || contract.currentContract == 'sbtc' && i == 2) {
          abi = synthERC20_abi
        }
        if(['iearn', 'busd', 'susd', 'pax', 'dfi', 'okuu', 'usd5', 'qusd5'].includes(contract.currentContract)) coin_abi = yERC20_abi

        if (allabis[contract.currentContract].underlying_coins.length > i) {
          contract.underlying_coins.push(new web3.eth.Contract(abi, addr));
        } else {
          contract.coins.push(new web3.eth.Contract(abi, addr));
        }
      })

      if (['qusd5'].includes(contract.currentContract)) {
        let abi = ERC20_abi
        allabis[contract.currentContract].base_coins.forEach(item => {
          contract.base_coins.push(new web3.eth.Contract(abi, item));
        })

        window[contract.currentContract].base_coins = contract.base_coins
      }

      window[contract.currentContract].coins = contract.coins
      window[contract.currentContract].underlying_coins = contract.underlying_coins
      // ratesDecoded = decoded.slice(4+allabis[contract.currentContract].N_COINS, decoded.length-allabis[contract.currentContract].N_COINS*2)
      ratesDecoded = decoded.slice(4+allabis[contract.currentContract].underlying_coins.length, decoded.length-(allabis[contract.currentContract].underlying_coins.length + allabis[contract.currentContract].coins.length))
    }

    if(['iearn', 'busd', 'susd', 'pax', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(contract.currentContract)) {
      // ratesDecoded.map((v, i) => {
      //   if(checkTethered(contract, i)) {
      //     Vue.set(contract.c_rates, i, 1 / allabis[contract.currentContract].coin_precisions[i]);
      //   } else {
      //     let rate = v / 1e18 / allabis[contract.currentContract].coin_precisions[i]
      //     if(contract.currentContract == 'susd' && i == 1) rate =  v / 1e36
      //     Vue.set(contract.c_rates, i, rate)
      //   }
      // })
      const underlying_coins_len = allabis[contract.currentContract].underlying_coins.length
      ratesDecoded.map((v, i) => {
        if (['qusd5'].includes(contract.currentContract)) {
          if (underlying_coins_len > i) {
            if(checkTethered(contract, i)) {
              Vue.set(contract.c_rates, i, 1 / allabis[contract.currentContract].coin_precisions[i]);
            } else {
              let rate = v / 1e18 / allabis[contract.currentContract].coin_precisions[i]
              if(contract.currentContract == 'susd' && i == 1) rate =  v / 1e36
              Vue.set(contract.c_rates, i, rate)
            }
          } else {
            if(checkBaseTethered(contract, i - underlying_coins_len)) {
              Vue.set(contract.c_rates, i, 1 / allabis[contract.currentContract].coins_precisions[i]);
            } else {
              let rate = v / 1e18 / allabis[contract.currentContract].coins_precisions[i]
              if(contract.currentContract == 'susd' && i == 1) rate =  v / 1e36
              Vue.set(contract.c_rates, i, rate)
            }
          }
        } else {
          if(checkTethered(contract, i)) {
            Vue.set(contract.c_rates, i, 1 / allabis[contract.currentContract].coin_precisions[i]);
          } else {
            let rate = v / 1e18 / allabis[contract.currentContract].coin_precisions[i]
            if(contract.currentContract == 'susd' && i == 1) rate =  v / 1e36
            Vue.set(contract.c_rates, i, rate)
          }
        }
      })
    } else {
      // TODO:
      chunkArr(ratesDecoded, 3).map((v, i) => {
          if(checkTethered(contract, i) || contract.currentContract == 'susdv2') {
              Vue.set(contract.c_rates, i, 1 / allabis[contract.currentContract].coin_precisions[i]);
          }
          else {
              let rate = +v[0] / 1e18 / allabis[contract.currentContract].coin_precisions[i]
              let supply_rate = +v[1]
              let old_block = +v[2]
              Vue.set(contract.c_rates, i, rate * (1 + supply_rate * (block - old_block) / 1e18))
          }
      })
    }

    let balances = []
    currentContract.total = 0;

    let balancesDecoded = decoded.slice(4, 4+allabis[contract.currentContract].underlying_coins.length)
    balancesDecoded.forEach((balance, i) => {
        Vue.set(contract.balances, i, +balance)
        balances[i] = +balance;
        Vue.set(contract.bal_info, i, balances[i] * contract.c_rates[i]);
        contract.total += balances[i] * contract.c_rates[i];
    })

    if(!initContracts && ['susdv2', 'sbtc', 'iearn', 'y', 'dfi', 'dusd', 'okuu', 'usd5', 'qusd5'].includes(contract.currentContract))
        contract.curveStakedBalance = decoded[decoded.length-1]

    if (default_account) {
        if (token_balance > 0) {
            contract.totalShare = 0;
            for (let i=0; i < contract.N_COINS; i++) {
                var val = balances[i] * contract.c_rates[i] * token_balance / token_supply;
                contract.totalShare += val;
                Vue.set(contract.l_info, i, val)
            }
            contract.usdShare = token_balance * contract.virtual_price / 1e18;
            contract.showShares = true;
        }
        else {
            contract.totalShare = 0;
            contract.usdShare = 0
            contract.showShares = false;
            //no need to set other values as v-show check is done based on totalShare
        }

        contract.totalStake = 0;
        if(contract.curveStakedBalance > 0) {
            for (let i=0; i < contract.N_COINS; i++) {
                var val = balances[i] * contract.c_rates[i] * contract.curveStakedBalance / token_supply;
                Vue.set(contract.staked_info, i, val)
                contract.totalStake += val;
            }
            contract.usdStake = contract.curveStakedBalance * contract.virtual_price / 1e18;
        }
    }
}

export async function handle_migrate_new(page) {
    var default_account = currentContract.default_account
    let migration = new web3.eth.Contract(allabis.compound.migration_abi, currentContract.migration_address);
    let old_balance = await currentContract.old_swap_token.methods.balanceOf(default_account).call();
    var allowance = parseInt(await currentContract.old_swap_token.methods.allowance(default_account, currentContract.migration_address).call());
    if(allowance < old_balance) {
        if (allowance > 0)
            await approve_to_migrate(0, default_account);
        await approve_to_migrate(old_balance, default_account);
    }
    await migration.methods.migrate().send({
        from: default_account,
        gasPrice: gasPriceStore.state.gasPriceWei,
        // gas: 1500000,
    })
    .once('transactionHash', hash => {
        notifyHandler(hash)
    })
    .catch(err => {
        errorStore.handleError(err)
    });

    await update_balances();
    update_fee_info(page);
}


export async function calc_slippage(values, deposit, zap_values, to_currency) {
  //var real_values = [...$("[id^=currency_]")].map((x,i) => +($(x).val()));
  values = values.map(v => v || 0)
  let slippage = 0;
  var real_values = Array(currentContract.N_COINS).fill(0)
  let calls = [
      [currentContract.swap._address ,currentContract.swap.methods.get_virtual_price().encodeABI()],
  ]
  if(to_currency !== undefined) {
      let precision = allabis[currentContract.currentContract].coin_precisions[to_currency]
      real_values[to_currency] = zap_values[to_currency].div(precision)
      zap_values[to_currency] = zap_values[to_currency].times(1e18/precision)
      var Sr = zap_values[to_currency]
      zap_values[to_currency] = zap_values[to_currency].div(1e18).div(currentContract.c_rates[to_currency]).toFixed(0);
      calls.push([currentContract.swap._address, currentContract.swap.methods.calc_token_amount(zap_values, to_currency).encodeABI()])
  } else {
      real_values = values.map(v=>+v);
      var Sr = real_values.reduce((a,b) => a+b, 0);

      var values = real_values.map((x,i) => cBN(Math.floor(x / currentContract.c_rates[i]).toString()).toFixed(0,1));
      calls.push([currentContract.swap._address, currentContract.swap.methods.calc_token_amount(values, deposit).encodeABI()])
  }
  calls.push(...[...Array(currentContract.N_COINS).keys()].map(i => [currentContract.swap._address, currentContract.swap.methods.balances(i).encodeABI()]))
  let aggcalls = await currentContract.multicall.methods.aggregate(calls).call();
  let decoded = aggcalls[1].map(hex => currentContract.web3.eth.abi.decodeParameter('uint256', hex))
  let [virtual_price, token_amount, ...balances] = decoded
  let Sv = +virtual_price * (+token_amount) / 1e36;
// console.log('virtual_price', virtual_price, 'token_amount', token_amount)
  for(let i = 0; i < currentContract.N_COINS; i++) {
    let coin_balance = +balances[i] * currentContract.c_rates[i];
    if(!deposit) {
      if(coin_balance < real_values[i]) {
          currentContract.showNoBalance = true;
          currentContract.noBalanceCoin = i;
      }
      else {
        currentContract.showNoBalance = false;
      }
    }
  }
// console.log(values, deposit)
// console.log(await currentContract.swap.methods.calc_token_amount(values, deposit).call())
// console.log('Sr', Sr, 'Sv', Sv)
  if (deposit) {
    slippage = Sv / Sr
  } else if(to_currency === undefined) {
    slippage = Sr / Sv;
  } else {
    slippage = Sr / (Sv * 1e18)
  }

  slippage = slippage - 1;
  slippage = slippage || 0
  currentContract.slippage = slippage;
  currentContract.showSlippage = true;
}

export async function calc_slippage_base(values, deposit, zap_values, to_currency) {
    //var real_values = [...$("[id^=currency_]")].map((x,i) => +($(x).val()));
    let N_COINS = values.length || (zap_values && zap_values.length) || 0
// console.log('calc_slippage', N_COINS, values, values.length, deposit, zap_values, to_currency)
    values = values.map(v => v || 0)
    let slippage = 0;
    var real_values = Array(N_COINS).fill(0)
    let calls = [
      [currentContract.swap._address ,currentContract.swap.methods.get_virtual_price().encodeABI()],
    ]
    let calc_token_amount_method = null
    let precisions = []
    let swapAddress = ''
    let c_rates = []
    if(['qusd5'].includes(currentContract.currentContract)) {
      if (currentContract.base_coins.length === N_COINS) {
        calc_token_amount_method = currentContract.deposit_zap.methods.calc_token_amount
        precisions = allabis[currentContract.currentContract].base_precisions
        swapAddress = currentContract.deposit_zap._address
        c_rates = currentContract.base_precisions.map(item => 1/item)
      } else {
        calc_token_amount_method = currentContract.swap.methods.calc_token_amount
        precisions = currentContract.coin_precisions
        swapAddress = currentContract.swap._address
        c_rates = currentContract.coin_precisions.map(item => 1/item)
      }
    } else {
      calc_token_amount_method = currentContract.swap.methods.calc_token_amount
      precisions = currentContract.coin_precisions
      swapAddress = currentContract.swap._address
      c_rates = currentContract.c_rates
    }


    if(to_currency !== undefined) {
        let precision = precisions[to_currency]
        real_values[to_currency] = zap_values[to_currency].div(precision)
        zap_values[to_currency] = zap_values[to_currency].times(1e18/precision)
        var Sr = zap_values[to_currency]
        zap_values[to_currency] = zap_values[to_currency].div(1e18).div(c_rates[to_currency]).toFixed(0);
        calls.push([swapAddress, calc_token_amount_method(zap_values, to_currency).encodeABI()])
    } else {
        real_values = values.map(v=>+v);
        var Sr = real_values.reduce((a,b) => a+b, 0);

        var values = real_values.map((x,i) => cBN(Math.floor(x / c_rates[i]).toString()).toFixed(0,1));
        calls.push([swapAddress, calc_token_amount_method(values, deposit).encodeABI()])
    }

    calls.push(...[...Array(N_COINS).keys()].map(i => {
      let result = []
      if (currentContract.base_coins.length === N_COINS && ['qusd5'].includes(currentContract.currentContract) && currentContract.base_coins_idx[i] != null ) {
        result = [currentContract.base_pool._address, currentContract.base_pool.methods.balances(currentContract.base_coins_idx[i]).encodeABI()]
      } else {
        result = [currentContract.swap._address, currentContract.swap.methods.balances(i).encodeABI()]
      }

      return result
    }))
    let aggcalls = await currentContract.multicall.methods.aggregate(calls).call();
    let decoded = aggcalls[1].map(hex => currentContract.web3.eth.abi.decodeParameter('uint256', hex))
    let [virtual_price, token_amount, ...balances] = decoded
    let Sv = +virtual_price * (+token_amount) / 1e36;
// console.log('virtual_price', virtual_price, 'token_amount', token_amount)
    for(let i = 0; i < N_COINS; i++) {
      let coin_balance = +balances[i] * c_rates[i];
      if(!deposit) {
        if(coin_balance < real_values[i]) {
            currentContract.showNoBalance = true;
            currentContract.noBalanceCoin = i;
        }
        else {
          currentContract.showNoBalance = false;
        }
      }
    }
// console.log(values, deposit)
// console.log(await currentContract.swap.methods.calc_token_amount(values, deposit).call())
// console.log('Sr', Sr, 'Sv', Sv)
    if (deposit) {
      slippage = Sv / Sr
    } else if(to_currency === undefined) {
      slippage = Sr / Sv;
    } else {
      slippage = Sr / (Sv * 1e18)
    }

    slippage = slippage - 1;
    slippage = slippage || 0
    currentContract.slippage = slippage;
    currentContract.showSlippage = true;
}

export async function setTimeout(timeout) {
  return new Promise(resolve => window.setTimeout(resolve, timeout))
}

/**
 *  @param {string} src
 *  @param {Object=} [attrs]
 *  @param {Element=} [parentNode]
 *  @return {Promise}
 */
export async function asyncLoadScript(src, attrs = {}, parentNode = document.head) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.src = src

    for (const key in attrs) {
      script.setAttribute(key, attrs[key])
    }

    script.onload = () => {
      script.onerror = script.onload = null
      resolve(script)
    }

    script.onerror = () => {
      script.onerror = script.onload = null
      reject(warn(`${src}: Failed to load.`))
    }

    parentNode.appendChild(script)
  })
}