/**
 *  NOTE:
 */

export default {
  global: {
    sFinance: 'S.Finance',
    home: 'Home',
    swap: 'Swap',
    liquidity: 'Liquidity',
    stats: 'Stats',
    operating: 'Actions',
    deposits: 'Deposits',
    totalBalances: 'Total balances',
    dailyVol: 'Daily volume',
    apr: 'APY',
    poolName: 'Pool name',
    assests: 'Assests',
    addLiquidity: 'Add liquidity',
    advancedOptions: 'Advanced options',
    packUp: 'Pack up',
    maxSlippage: 'Max slippage',
    gasPrice: 'Gas price',
    customize: 'Customize',
    standard: 'Standard',
    fast: 'Fast',
    instant: 'Instant',
    slow: 'Slow',
    low: 'Low',
    notAvailable: 'Not available',
    fee: 'Fee',
    norm: 'Norm',
    risks: 'Risks',
    dao: 'DAO',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    all: 'All',
    poolProfit: 'Pool profit',
  },
  beta: {
    slogan: 'The project is still in testing stage, please pay attention to the risks and stay tuned for more functions~',
    followMe: 'Follow me'
  },
  statement: {
    slogan: 'Statement: S.finance have not issued any tokens currently',
    cont: 'Token of S.finance will follow the method of 100% contribution based distribution, with neither private placement, no pre-dig, nor team distribution. The official name of the token is still being collected. Information about S.finance on Trx-chain is totally fraud, please log on official website to get the latest news about S.finance!',
    more: 'more',
    ok: 'Ok',
    coming: 'S. Finance has started liquidity mining！',
    comingCont: `S.fintance will open the SFG liquidity pool at 2020-09-25 20:00 Singapore time. Mortgaging BPT will obtain the S.Finance governance token SFG award. SFG exchange and deposit/withdrawal services are provided by Balancer:<br/>
    * Exchange Address: <a href="https://legacy.balancer.exchange/#/swap/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0" target="_blank">https://legacy.balancer.exchange/#/swap/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0</a><br/>
    * Liquidity Pool Address：<a href="https://pools.balancer.exchange/#/pool/0x2f49eea1efc1b04e9ecd3b81321060e29db26a19/" target="_blank">https://pools.balancer.exchange/#/pool/0x2f49eea1efc1b04e9ecd3b81321060e29db26a19/</a><br/>
    * SFG smart contract （please make sure the contract address is right before trading）：<a href="https://etherscan.io/token/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0" target="_blank">https://etherscan.io/token/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0</a><br/>
    After SFG liquidity pool opening, the reward weight of SFG liquidity pool is 30% on the first day.<br/>
    S. Finance has been opened for 3 days. According to the SFG mint rules, the number of SFG in circulation is less than 80,000. In view of the small amount of current circulation, the price fluctuation could be quite violent, please pay attention to the risks.<br/>
    S.Finance will soon launch Y (YFI) liquidity pool in the stable currency liquidity pool area, users could obtain SFG and CRV rewards by mining iearn LP tokens.<br/>
    S. Finance will soon launch iusd (YFII) liquidity pool in the stable currency liquidity pool area, users could obtain SFG and iusd rewards for mining iearn LP tokens.`
  },
  wallet: {
    notConnected: "You haven't connected wallet",
    connect: 'Connect wallet'
  },
  total: {
    deposits: 'Deposits'
  },
  stablePools: {
    name: 'Stable pools'
  },
  instantSwap: {
    name: 'Instant swap ',
    tip: 'Swap using all Stable pools',
    from: 'From',
    to: 'To',
    valuePlaceholder: 'Value',
    sizePlaceholder: 'Size',
    gasPlaceholder: 'Enter gasoline cost',
    max: 'Max',
    exchangeRate: 'Exchange rate (including fees)',
    confirm: 'Confirm',
    txCost: 'Estimated tx cost',
    routedThrough: 'Trade routed through',
    warnLowGasPrice: 'Too low gas price. Your transaction may be dropped.',
    noBalanceWarning: 'Not enough balance for {0}. Swap is not available.',
    selldisabled: 'Swapping between {0} and {1} is not available currently.',
    exchangeEateLowWarning: 'Warning! Exchange rate is too low!',
    maxSynthBalance: 'Max balance you can use is {0}',
    susdWaitingPeriod: 'Cannot transfer {0} during waiting period {1} secs left',
    warningNoPool: 'Swap not available. Please select {0} in pool select'
  },
  balancesInfo: {
    name: 'Currency reserves',
    assetDistribution: 'Asset distribution',
    swapFeeRate: 'Swap fee',
    depositFeeRate: 'Deposit fee',
    withdrawalFeeRate: 'Withdrawal fee',
    adminFeeRate: 'Admin fee',
    avgAssetPrice: 'Average asset price',
    amplificationCoefficient: 'AmplificationCoefficient',
    fundingFeeRate: 'FundingFeeRate'
  },
  risk: {
    title: 'Risks Warning',
    auditTitle: 'Audits',
    auditContHtml: `S.Finance smart contracts were Audited by KNOWNSEC.<a href="https://etherscan.io/token/${process.env.VUE_APP_SFG_TOKEN}" target="_blank">Contract Address<a>.<br/>However, security audits don't eliminate risks completely. Please don’t supply your life savings, or assets you can’t afford to lose, to S.Finance, especially as a liquidity provider.<br/>Using S.Finance as an exchange user should be significantly less risky, but this is not advice.`,
    adminKeyTitle: 'Admin keys',
    adminKeyContHtml: `Admin key allows to pause the contract in an emergency, but only during first 2 months in existence. Also it allows to change amplification coefficient (S.Finance parameter), admin fee (not more than half of fee which LPs take) and the fee. The function of timelock will be launched after 1 week stable running of the project.<br/>S.Finance will be transitioning to a DAO to be fully decentralized.`,
    lossTitle: 'Permanent loss of a peg',
    lossContHtml: 'If one of the stablecoins in the pool goes significantly down below the peg of 1.0 and never returns to the peg, it\'ll effectively mean that pool liquidity providers hold almost all their liquidity in that currency.',
    stakingTitle: 'Staking risks',
    stakingContHtml: 'When staking you use multiple smart contract products each of which has its own risks',
  },
  liquidity: {
    name: 'Liquidity gauge',
    reservesTitle: 'Currency Reserves',
    depositTip: 'You can deposit one or more kind of the stable coins below, and the smart contract will automatically balance the deposited assets proportionally',
    depositBalancedProportion: 'Add all coins in a balanced proportion',
    depositUseMaximumAvailable: 'Use maximum amount of coins available',
    depositWrapped: 'Deposit wrapped',
    depositWrappedPlaceholder: 'Deposit wrapped',
    willLeastReceive: 'You will receive at least',
    willReceive: 'You will receive',
    bonus: 'Bonus(plus pricing)',
    slippage: 'Slippage(plus pricing)',
    highSlippage: 'Warning! High slippage(plus pricing)',
    depositStakeGauge: 'Deposit & stake in gauge',
    withdrawAvailableAmount: 'available amount',
    withdrawAmountPlaceholder: 'amount',
    withdrawRedemptionTip: 'LP token redemption',
    dailyProfit: 'Daily profit'
  },
  dao: {
    standTitle: 'Stablecoin liquidity pool',
    tokenTitle: '{0} Liquidity gauge',
    describe: 'Staking {0} Reward {1}',
    staking: 'Deposit',
    redemption: 'Withdraw',
    miningReward: 'Minted',
    stakingAmountPlaceholder: 'Amount',
    stakingBalance: 'Available',
    infiniteApproval: 'Infinite approval',
    stakingConfirmTip: 'Deposit to get {0}',
    stakingConfirm: 'Deposit',
    redemptionBalance: 'Available',
    redemptionAmountPlaceholder: 'Amount',
    redemptionConfirm: 'Withdraw',
    miningPendingReward: 'Pending rewards',
    miningPaidReward: 'Paid rewards',
    miningTotalReward: 'Total rewards',
    miningClaimConfirm: 'Claim',
    totalStaking: 'Total staking',
    myStaking: 'My staking',
    virtualPrice: 'Virtual price',
  },
  notice: {
    approveSpending: 'Please approve spending your coins',
    confirmDepositTransaction: 'Pleaes confirm deposit transaction',
    // syntetixAnomalous: 'Withdrawals may be temporarily disabled due to Syntetix contract upgrades. Will be enabled back shortly.'
  },
  social: {
    twitter: 'Twitter',
    telegram: 'Telegram',
    discord: 'Discord',
    medium: 'Medium',
    github: 'Github',
    wechat: 'WeChat',
    tutorial: 'Tutorial',
    communitySupport: 'Community support',
  },
  temp: '* If you only want to withdraw a single currency, you can modify the number of other currencies to 0'
}