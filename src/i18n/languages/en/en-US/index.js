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
    voting: 'Voting',
    announcements: 'Announcements',
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
    totalPoolsDeposits: 'Total pools deposits'
  },
  beta: {
    slogan: 'The project is still in testing stage, please pay attention to the risks and stay tuned for more functions~',
    followMe: 'Follow me'
  },
  statement: {
    more: 'more',
    ok: 'Ok',
    toMore: 'More',
    noticeTitleHtml: 'dfi (yfii) pool has launched',
    noticeDateHtml: '2020/10/10 23:00',
    noticeContHtml: `S.Finance has launched dfi (yfii) pool at 2020-10-10 23:00 SGT. 2020-10-11 01:00 Open liquidity mining. Users could get iUSD LP tokens by depositing stable coins (DAI, USDC, USDT) or i token of yfii vault (iDAI, iUSDC, iUSDT). Users could get SFG reward by staking iUSD LP tokens.<br/>
    Users can obtain triple rewards by providing liquidity in the DFI pool:<br/>
    YFII vault reward<br/>
    SFG reward by staking<br/>
    Fee of DFI pool<br/>
    DFI pool rewarding weight will be up to 30%.`
  },
  wallet: {
    notConnected: "You haven't connected wallet",
    connect: 'Connect wallet'
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
    aboutTitle: 'About S.Finance',
    aboutContHtml: `S.Finance is the first DeFi project which achieved 3 mint rewarding. Starting with the stable coins swapping, it links various valuable DeFi projects to support their underlying assets.<br/>
    SFG is the governance token of S.Finance platform, with a total circulation of 21 million. It follows rules of 100% contribution-based distribution, with neither private placement nor pre-dig. It is expected to mint by 0.2% of remaining SFG perday and the amount of SFG will half once a year. Users can get SFG rewards and participate in community governance by making contributions to the liquidity pool.`,
    auditTitle: 'Audits',
    auditContHtml: `S.Finance smart contracts were Audited by KNOWNSEC.<a href="https://etherscan.io/token/${process.env.VUE_APP_SFG_TOKEN}" target="_blank">Contract Address<a>.<br/>However, security audits don't eliminate risks completely. Please don’t supply your life savings, or assets you can’t afford to lose, to S.Finance, especially as a liquidity provider.<br/>Using S.Finance as an exchange user should be significantly less risky, but this is not advice.`,
    adminKeyTitle: 'Admin keys',
    adminKeyContHtml: `Admin key allows to pause the contract in an emergency, but only during first stage of the project. Also it allows to change amplification coefficient (S.Finance parameter), admin fee (not more than half of fee which LPs take) and the fee. The function of timelock and muti signatures will be launched after stable running of the project.<br/>S.Finance will be transitioning to a DAO to be fully decentralized.`,
    lossTitle: 'Permanent loss of a peg',
    lossContHtml: 'If one of the stablecoins in the pool goes significantly down below the peg of 1.0 and never returns to the peg, it\'ll effectively mean that pool liquidity providers hold almost all their liquidity in that currency.',
    stakingTitle: 'Staking risks',
    stakingContHtml: 'When staking you use multiple smart contract products each of which has its own risks',
    inform: 'S.Finance community will take 5% mint SFG as ecosystem fund to offer initial liquidity and support the project. The DAI of initial liquidity will be offered by DAO of initial volunteers.',
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
    withdrawWrapped: 'Withdraw wrapped ',
    withdrawRedemptionTip: 'LP token redemption',
    dailyProfit: 'Daily profit',
    approveStakingTokens: 'Please approve staking {0} of your tokens',
    approveLptokenWithdrawal: 'Please approve {0} {1} for withdrawal',
    confirmWithdrawalTransaction: 'Please confirm withdrawal transaction',
  },
  dao: {
    standTitle: 'Stablecoin liquidity pool',
    tokenTitle: '{0} Liquidity gauge',
    rewardWeight: '{0} reward weight',
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
    miningPaidRewardTip: 'Each deposit or withdraw of LP tokens will trigger the settlement of SFG rewards. The settled reward here does not represent the actual reward you received. Click the "Claim" button to send the SFG token into your wallet.(This feature is the Gas optimized plan, which witnesses the lowest Gas rate of the same type currently)',
    miningTotalReward: 'Total rewards',
    miningClaimConfirm: 'Claim',
    totalStaking: 'Total staking',
    myStaking: 'My staking',
    virtualPrice: 'Virtual price',
  },
  notice: {
    approveSpending: 'Please approve spending your coins',
    confirmDepositTransaction: 'Pleaes confirm deposit transaction',
    // syntetixAnomalous: 'Withdrawals may be temporarily disabled due to Syntetix contract upgrades. Will be enabled back shortly.',
    approveOperationWarning: 'If you encounter a gas fee exceeding 0.2 ETH during mortgage, please click Reject and wait for a while and try again'
  },
  social: {
    twitter: 'Twitter',
    telegram: 'Telegram',
    discord: 'Discord',
    medium: 'Medium',
    github: 'Github',
    wechat: 'WeChat',
    tutorial: 'Tutorial',
    communitySupport: 'Support',
  },
  model: {
    valueOutValidRange: 'Value is out of valid range',
    incorrectValue: 'Incorrect value',
    approveOperation: 'Please authorize first, and then continue after authorization is completed'
  },
  statemented: {
    notice1: {
      titleHtml: 'S.Finance liquidity pool is coming ！',
      dateHtml: '2020/09/22 22:22:22',
      contHtml: `S.Finance liquidity pool is going to start at 00:00:00 (SGT) 23th September, 2020. Staking susdv2 LP tokens could get 3 kinds of token for reward，including SFG (governance token of S.finance) 、CRV （governance token of Curve) and SNX (governance token of Synthetix).<br/>
      Total amount of SFG is 21 million, with 100% contribution-based distribution, no private placement, no pre-dig. Minted SFG per day is 0.2% of the remaining, and the output rate of SFG is 10% in the first 24 hours (0.02% minted SFG on the first day, while the rate of minted CRV and SNX is unaffected), and the mining rate will return to normal 24 hours later. SFG liquidity pool will start on the third day after the opening of S.Finance, and the rewarding weight of SFG liquidity pool will be three times that of the stable coin pool.<br/>
      The S.finance smart contract has been scrutinized by KNOWNSEC. However, it cannot completely eliminate the risk, the price of SFG possibly get 0. Please invest within your capacity. `
    },
    notice2: {
      titleHtml: 'S. Finance has started liquidity mining！',
      dateHtml: '2020/09/25 20:00',
      contHtml: `S.finance will open the SFG liquidity pool at 2020-09-25 20:00 Singapore time. Mortgaging BPT will obtain the S.Finance governance token SFG award. SFG exchange and deposit/withdrawal services are provided by Balancer:<br/>
      * Exchange Address: <a href="https://legacy.balancer.exchange/#/swap/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0" target="_blank">https://legacy.balancer.exchange/#/swap/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0</a><br/>
      * Liquidity Pool Address：<a href="https://pools.balancer.exchange/#/pool/0x2f49eea1efc1b04e9ecd3b81321060e29db26a19/" target="_blank">https://pools.balancer.exchange/#/pool/0x2f49eea1efc1b04e9ecd3b81321060e29db26a19/</a><br/>
      * SFG smart contract （please make sure the contract address is right before trading）：<a href="https://etherscan.io/token/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0" target="_blank">https://etherscan.io/token/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0</a><br/>
      After SFG liquidity pool opening, the reward weight of SFG liquidity pool is 30% .<br/>
      S. Finance has been opened for 3 days. According to the SFG mint rules. In view of the small amount of current circulation, the price fluctuation could be quite violent, please pay attention to the risks.<br/>
      S.Finance will soon launch Y (YFI) liquidity pool in the stable currency liquidity pool area, users could obtain SFG and CRV rewards by mining iearn LP tokens.<br/>
      S. Finance will soon launch iusd (YFII) liquidity pool in the stable currency liquidity pool area, users could obtain SFG and iusd rewards for mining iearn LP tokens.`,
    },
    notice3: {
      titleHtml: 'Announcement of adjusting the rewarding weight of SFG liquidity pool ',
      dateHtml: '2020/09/29 00:00',
      contHtml: `S.finance will increase the rewarding  weight of SFG liquidity pool to 40% at 2020-09-29 00:00 Singapore time.<br/>
      S.Finance will launch a unique DeFi stable coin liquidity pool，cooperating with YFII community. In this liquidity pool，50% of the fee will be given to liquidity providers and SFG holders could share another 50% of the fee. At the same time，users can gain SFG rewarding by staking iUSD (LP Token of DeFi liquidity pool ).<br/>
      S.Finance voting function will be launched as soon as possible. The plan of halving SFG mint rate will be decided by the community.`
    }
  },
  temp: '* If you only want to withdraw a single currency, you can modify the number of other currencies to 0'
}