/**
 *  NOTE:
 */

export default {
  global: {
    sFinance: 'S.Finance',
    home: '首页',
    more: '更多',
    swap: '兑换',
    lock: 'SFG',
    liquidity: '存取款',
    stats: '统计',
    voting: '投票',
    announcements: '新鲜事',
    operating: '操作',
    deposits: '资金',
    totalBalances: '资金总额',
    dailyVol: '日交易额',
    apr: '年化收益率',
    poolName: '名称',
    assests: '资产',
    addLiquidity: '提供流动性（存币行为）',
    advancedOptions: '高级选项',
    packUp: '收起',
    maxSlippage: '最大滑点',
    gasPrice: 'Gas 费用',
    customize: '自定义',
    standard: '标准',
    fast: '快速',
    instant: '极速',
    slow: '慢',
    low: '低',
    notAvailable: '无法使用',
    fee: '费用',
    norm: '指标',
    risks: '风险',
    dao: '挖矿',
    deposit: '存款',
    withdraw: '取款',
    all: '全部',
    poolProfit: '流动性奖励',
    wiki: '指南',
    totalPoolsDeposits: '兑换池资金',
    infiniteApproval: '信任此合约使用最佳矿工费，后续将无需再次批准',
  },
  beta: {
    slogan: '项目还在测试阶段，请注意风险，更多功能敬请期待~',
    followMe: '抢先关注'
  },
  statement: {
    more: '查看详情',
    ok: '知道了',
    toMore: '了解更多',
  },
  wallet: {
    notConnected: '你还没有连接钱包',
    connect: '连接钱包'
  },
  stablePools: {
    name: 'Stable 兑换池'
  },
  instantSwap: {
    name: '极速兑换',
    tip: '在全部 Stable Pools 中匹配最优兑换价格',
    from: '兑换',
    to: '兑换为',
    valuePlaceholder: '输入数值',
    sizePlaceholder: '输入兑换数量',
    gasPlaceholder: '输入 Gas 费用',
    max: '最多',
    exchangeRate: '兑换比例 (包括费用)',
    confirm: '确认兑换',
    txCost: '预计矿工费',
    routedThrough: '兑换池',
    warnLowGasPrice: 'Gas 价格太低。您的交易可能被取消。',
    noBalanceWarning: '{0} 余额不足，不可兑换。',
    selldisabled: '{0} 与 {1} 目前不可兑换。',
    exchangeEateLowWarning: '警告！汇率太低！',
    maxSynthBalance: '您可以使用的最大余额是 {0}',
    susdWaitingPeriod: '在等待时间 {1} 秒内无法转移 {0}',
    warningNoPool: '兑换不可用。请在池中选择 {0}。',
    swapWrapped: '兑换 {0} 代币',
    approveExchange: '请批准兑换 {0} {1}',
    confirmSwapFromFor: '请确认将 {0} 兑换成至少 {1}',
    waitingSwapTransactionNoFurther: `等待兑换<a href='http://etherscan.io/tx/{0}'>交易</a>确认完毕，无需采取进一步措施`
  },
  balancesInfo: {
    name: '矿池概览',
    assetDistribution: '资产分布',
    swapFeeRate: '兑换费',
    depositFeeRate: '存款费',
    withdrawalFeeRate: '取款费',
    adminFeeRate: '管理员费',
    avgAssetPrice: '资产均价',
    amplificationCoefficient: '放大系数',
    fundingFeeRate: '资金费用率',
    liquidityAPY: '流动性年化',
    lpTokenPrice: 'LP Token 价格',
    reserveSwapFee: '预留兑换费 {0}'
  },
  risk: {
    title: '使用 S.Finance 的风险',
    aboutTitle: 'S.Finance 是什么',
    aboutContHtml: `S.Finance 是第一个实现三挖 DeFi 底层资产的连接器项目。以稳定币兑换为起点连接更多有价值的 DeFi 项目为其提供基础资产的支撑。<br/>
    SFG 是 S.Finance 平台治理代币，总发行量 2100 万， 100%基于贡献分配，无私募，无预挖。每日挖矿产出未挖出部分的 0.2%，预计每年会有一次减半。用户可以通过向流动性池做出贡献获得 SFG 奖励并参与平台治理。`,
    auditTitle: '审计',
    auditContHtml: `S.finance 智能合约通过了KNOWNSEC审计。<a href="https://etherscan.io/token/${process.env.VUE_APP_SFG_TOKEN}" target="_blank">合约地址<a><br/>然而，安全审计并不能完全消除风险。请在能力承受范围内投资，不要盲目投入全部资产，尤其是在提供流动性交易时。<br/>使用S.finance 做兑换交易时风险会相对降低，但这只是建议。`,
    adminKeyTitle: '管理密钥',
    adminKeyContHtml: '管理密钥在紧急情况下允许暂停合约，但仅在项目初期升级调整时使用。它还允许改变放大系数(S.Finance参数)，管理费用(不超过流动性凭证花费的一半)和费用，管理密钥将在近期项目稳定后加上 timelock 或多签机制。<br/>S.Finance将向去中心化的DAO过渡。',
    lossTitle: '资产损失',
    lossContHtml: '如果池子里的某个稳定币大幅低于1.0的固定汇率，并且再也不回到这个汇率，比如说某一稳定币归 0就可能造成流动性提供者将损失所有的流动性，但这件事发生的概率非常低。',
    stakingTitle: '抵押风险',
    stakingContHtml: '当使用抵押功能时，每一种智能合约都有他们相应的风险。',
    inform: '社区将提取 5% 生态基金及开发基金，提供项目初始流动性及未来发展。初始流动性中的 DAI 由社区的早期志愿者 DAO 提供。',
  },
  liquidity: {
    name: '流动性矿池',
    reservesTitle: '资产分布',
    depositTip: '你可以存入下方任意一种或多种稳定币，智能合约将按比例自动平衡存入的资产',
    depositBalancedProportion: '均衡添加所有代币',
    withdrawBalancedProportion: '均衡所有代币',
    depositUseMaximumAvailable: '使用最大数量的代币',
    depositWrapped: '存入 {0} 代币',
    depositWrappedPlaceholder: '存入抵押数量',
    willLeastReceive: '你将至少收到',
    willReceive: '你将收到',
    bonus: '额外奖励',
    slippage: '额外成本',
    highSlippage: '警告!高滑点',
    depositStakeGauge: '存款并抵押挖矿',
    withdrawAvailableAmount: '可取款数量',
    withdrawAmountPlaceholder: '输入取出数量',
    withdrawWrapped: '取出 {0} 代币',
    withdrawRedemptionTip: '赎回挖矿中的 LP token',
    dailyProfit: '今日存款收益',
    approveStakingTokens: '请批准您的 {0} 代币',
    approveLptokenWithdrawal: '请批准取出 {0} {1}',
    confirmWithdrawalTransaction: '请确认取出交易',
    confirmUnstakingToken: '请确认取消抵押 {0} 代币',
    UnstakingTokenWithdrawal: `还差 {0} LP token方可取款成功，请减少取款数额，否则可能造成交易异常`,
    waitingDepositTransactionBeforeStaking: `抵押前请等待当前<a href='http://etherscan.io/tx/{0}'>交易</a>完成`,
    waitingDepositTransactionNoFurther: `等待存款<a href='http://etherscan.io/tx/{0}'>交易</a>确认完毕，无需采取进一步措施`
  },
  dao: {
    standTitle: '稳定币流动性矿池',
    tokenTitle: '{0} 流动性矿池',
    rewardWeight: '{0} 奖励权重',
    dailyYield: '{0} 每日奖励数量',
    describe: '抵押 {0} 挖矿奖励 {1}',
    staking: '抵押',
    redemption: '赎回',
    miningReward: '挖矿奖励',
    stakingAmountPlaceholder: '输入抵押数量',
    stakingBalance: '当前可抵押',
    stakingConfirmTip: '存款获得 {0}',
    stakingConfirm: '确认抵押',
    redemptionBalance: '可赎回数量',
    redemptionAmountPlaceholder: '输入赎回数量',
    redemptionConfirm: '确认赎回',
    miningPendingReward: '待领取奖励',
    miningPaidReward: '已领取奖励',
    miningPaidRewardTip: '每次抵押或赎回 LP tokens 都会触发关于 SFG 奖励结算，这里的已结算奖励不代表实际领取的奖励，需要点击「领取奖励」按钮 SFG 代币才会进入你的钱包中。(该特征为Gas优化方案，目前为同类型最低Gas费率）',
    miningTotalReward: '合计奖励',
    miningClaimConfirm: '领取奖励',
    totalStaking: '总抵押量',
    myStaking: '我的抵押',
    virtualPrice: 'LP tokens 价格',
    miningPoolOpeningNotice: '{0} 池流动性挖矿即将开启。当前可正常抵押赎回 {1}，但是无法获得代币奖励',
    rewardMayBeLost: '由于进行了矿工费优化，赎回前请先领取挖矿奖励，否则可能会导致奖励丢失',
  },
  notice: {
    approveSpending: '请授权钱包进行扣款',
    confirmDepositTransaction: '请在钱包中确认存款转账',
    syntetixAnomalous: '由于Syntetix合约升级操作可能会失败，为避免矿工费损失可稍后再试。',
    approveOperationWarning: '抵押时如遇到 gas 费用超过 0.2ETH，请先点击拒绝等待一段时间后再试'
  },
  social: {
    twitter: '推特',
    telegram: '电报',
    discord: 'Discord',
    medium: 'Medium',
    github: 'Github',
    wechat: '微信',
    tutorial: '挖矿教程',
    communitySupport: '社区支持',
  },
  model: {
    valueOutValidRange: '值不在有效范围内',
    incorrectValue: '无效的数值',
    approveOperation: '请先授权，并在授权完成后再继续操作'
  },
  lock: {
    title: 'SFG 权益',
    subtitle: '锁仓 SFG 解锁更多收益',
    overview: 'SFG 概览',
    cumulativeCirculation: '累计发行量',
    cumulativeCirculationTip: '截止目前流动性挖矿 SFG 奖励总量',
    expectedReleaseToday: '今日预计发行',
    expectedReleaseTodayTip: '今日流动性挖矿预计 SFG 奖励数量',
    totalLockedPosition: '总锁仓量',
    totalLockedPositionTip: '所有用户锁仓数量之和',
    circulation: '流通量',
    circulationTip: '流通量=累计发行量 - 总锁仓量',
    lockUp: '锁仓',
    lockedTip: '锁仓 SFG 获得加速倍数，最高获得 2.5 倍',
    myLock: '我的锁仓',
    myShare: '我的份额',
    myShareTip: '我的份额 = 我的锁仓*我的加速倍数，用于统计锁仓的数量与时间',
    myAccelerationFactor: '我的加速倍数',
    myAccelerationFactorTip: '锁仓时间越久，加速倍数越大，最高 2.5 倍',
    currentLockablePosition: '当前可锁仓',
    goBalancer: '前往 Balancer 交易',
    enterLockedPosition: '输入锁仓数量',
    confirmLock: '确认锁仓',
    unlock: '解锁',
    enterunLockPosition: '输入解锁数量',
    currentlyUnlockable: '当前可解锁',
    confirmUnlock: '确认解锁',
    miningAcceleration: '挖矿加速',
    miningAccelerationTip: '锁仓 SFG 数量决定可加速金额，加速倍数决定 APY 上限',
    stablecoinMiningPool: '稳定币流动性矿池',
    poolName: '流动性池',
    rewardWeight: 'SFG 奖励权重',
    myMortgageAmount: '我的 LPT 抵押数量',
    needLockAmount: '还需锁仓数量',
    needLockAmountTip: '将全部 LPT 加速还需要锁仓 SFG 数量',
    needLockDays: '还需锁仓天数',
    needLockDaysTip: '将加速倍数提高到 2.5 倍还需要锁仓天数',
    sfgMiningPool: 'SFG 流动性矿池',
    actualAcceleration: '实际加速倍数',
    actualAccelerationTip: '实际加速倍数的计算综合了锁仓 SFG 数量、时间以及其他矿池消耗等因素',
    basicAPY: '基础 APY',
    basicAPYTip: '不锁仓 SFG 进行挖矿的 APY',
    myAPY: '我的 APY',

    // dividends: '分红',
    // dividendsTip: '锁仓 SFG 数量越多，时间越久，分红越高',
    // cumulativePendingDividend: '我的累计待分红',
    // platformAccumulativePendingDividend: '平台累计待分红',
    // platformAddsDividendsToDistributedToday: '平台今日新增待分红',
  },
  temp: '* 如果要全部取款为一个币种，请点选该币种',
}