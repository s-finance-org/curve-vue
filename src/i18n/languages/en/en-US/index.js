/**
 *  NOTE:
 */

export default {
  global: {
    sFinance: 'S.Finance',
    home: 'Home',
    more: 'More',
    swap: 'Swap',
    lock: 'SFG',
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
    wiki: 'Wiki',
    totalPoolsDeposits: 'Total pools deposits',
    infiniteApproval: 'Infinite approval',
  },
  beta: {
    slogan: 'The project is still in testing stage, please pay attention to the risks and stay tuned for more functions~',
    followMe: 'Follow me'
  },
  statement: {
    more: 'more',
    ok: 'Ok',
    toMore: 'More',
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
    warningNoPool: 'Swap not available. Please select {0} in pool select',
    swapWrapped: 'Swap wrapped',
    approveExchange: 'Please approve {0} {1} for exchange',
    confirmSwapFromFor: 'Please confirm swap from {0} for min {1}',
    waitingSwapTransactionNoFurther: `Waiting for swap <a href='https://etherscan.io/tx/{0}'>transaction</a>to confirm: no further action needed`
  },
  balancesInfo: {
    name: 'Pool overview',
    assetDistribution: 'Asset distribution',
    swapFeeRate: 'Swap fee',
    depositFeeRate: 'Deposit fee',
    withdrawalFeeRate: 'Withdrawal fee',
    adminFeeRate: 'Admin fee',
    avgAssetPrice: 'Average asset price',
    amplificationCoefficient: 'AmplificationCoefficient',
    fundingFeeRate: 'FundingFeeRate',
    liquidityAPY: 'Liquidity APY',
    lpTokenPrice: 'LP Token Price',
    reserveSwapFee: 'Reserve swap fee of {0}'
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
    withdrawBalancedProportion: 'Balance all tokens',
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
    confirmWithdrawalTransaction: 'Please confirm withdrawal transaction {0}',
    confirmUnstakingToken: 'Please confirm unstaking {0} tokens',
    UnstakingTokenWithdrawal: `Unstaking {0} tokens for withdrawal.<br />A bit more tokens are needed to unstake to ensure that withdrawal is successful.<br/>You'll see them in your unstaked balance afterwards.`,
    waitingDepositTransactionBeforeStaking: `Waiting for deposit <a href='http://etherscan.io/tx/{0}'>transaction</a> to confirm before staking`,
    waitingDepositTransactionNoFurther: `Waiting for deposit <a href='http://etherscan.io/tx/{0}'>transaction</a> to confirm no further action required`
  },
  dao: {
    standTitle: 'Stablecoin liquidity pool',
    tokenTitle: '{0} Liquidity gauge',
    rewardWeight: '{0} reward weight',
    dailyYield: '{0} daily reward',
    describe: 'Staking {0} Reward {1}',
    staking: 'Deposit',
    redemption: 'Withdraw',
    miningReward: 'Minted',
    stakingAmountPlaceholder: 'Amount',
    stakingBalance: 'Available',
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
    miningPoolOpeningNotice: '{0} liquidity gauge is about to open. Currently, deposits and withdrawals can be done normally, but no token reward is available.',
    rewardMayBeLost: 'Due to the optimization of the miner fee, please claim the mining reward before withdraw, otherwise the reward may be lost',
    total: 'Total',
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
    wechat: 'WeChat',
    tutorial: 'Tutorial',
    communitySupport: 'Support',
  },
  model: {
    valueOutValidRange: 'Value is out of valid range',
    approveOperation: 'Please authorize first, and then continue after authorization is completed'
  },
  lock: {
    title: 'Use SFG',
    subtitle: 'Stake SFG to get more profits',
    overview: 'SFG Overview',
    cumulativeCirculation: 'Total distribution',
    cumulativeCirculationTip: 'The total quantity of SFG rewards for liquid mining so far',
    expectedReleaseToday: 'Today distribution',
    expectedReleaseTodayTip: 'The estimated quantity of SFG rewards for liquidity mining today',
    totalLockedPosition: 'Total stake',
    totalLockedPositionTip: 'Staked quantity of all users',
    circulation: 'Circulation',
    circulationTip: 'Circulation = Total distribution - Total stake',
    lockUp: 'Stake',
    lockedTip: 'Stake SFG gets mining boost, up to 2.5 times',
    myLock: 'My stake',
    myShare: 'Virtual balance',
    myShareTip: 'Virtual balance = My stake * Boost multiple',
    myAccelerationFactor: 'Boost multiple',
    myAccelerationFactorTip: 'Time related, up to 2.5 times',
    currentLockablePosition: 'Avaliable',
    goBalancer: 'Buy on Balancer ',
    enterLockedPosition: 'Enter staking quantity',
    confirmLock: 'Confirm',
    unlock: 'Unstake',
    enterunLockPosition: 'Enter unstaking quantity',
    currentlyUnlockable: 'Avaliable',
    confirmUnlock: 'Confirm',
    miningAcceleration: 'Boost your rewards',
    miningAccelerationTip: 'Stake more SFG , Boost more LPT',
    stablecoinMiningPool: 'Stable coins liquidity pool',
    poolName: 'Liquidity gauge',
    rewardWeight: 'SFG reward weight',
    myMortgageAmount: 'My LPT mortgage amount',
    needLockAmount: 'Stake more quantity',
    needLockAmountTip: 'To boost all LPT, you still need to stake the SFG quantity',
    needLockDays: 'Stake for longer',
    needLockDaysTip: 'Increasing the boost multiple to 2.5 times requires additional staked days',
    sfgMiningPool: 'SFG liquidity pool',
    actualAcceleration: 'Settlement multiple',
    actualAccelerationTip: 'The settlement multiple needs to consider factors such as the number of staked SFG, time and other mining pool consumption',
    basicAPY: 'Base APY',
    basicAPYTip: 'APY for SFG mining without staked',
    myAPY: 'My APY',

    // dividends: '分红',
    // dividendsTip: '锁仓 SFG 数量越多，时间越久，分红越高',
    // cumulativePendingDividend: '我的累计待分红',
    // platformAccumulativePendingDividend: '平台累计待分红',
    // platformAddsDividendsToDistributedToday: '平台今日新增待分红',
  },
  temp: '* If you only want to withdraw a single currency, you can modify the number of other currencies to 0',
}