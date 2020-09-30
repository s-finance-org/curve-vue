/**
 *  NOTE:
 */

export default {
  global: {
    sFinance: 'S.Finance',
    home: '首页',
    swap: '兑换',
    liquidity: '存取款',
    stats: '统计',
    statemented: '新鲜事',
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
    totalPoolsDeposits: '兑换池资金'
  },
  beta: {
    slogan: '项目还在测试阶段，请注意风险，更多功能敬请期待~',
    followMe: '抢先关注'
  },
  statement: {
    more: '查看详情',
    ok: '知道了',
    toMore: '了解更多',
    noticeTitleHtml: '关于调整SFG流动性矿池挖矿奖励权重的公告',
    noticeDateHtml: '2020/09/29 00:00',
    noticeContHtml: `S.Finance 将于新加坡时间 2020-09-29 00:00 提升SFG流动性矿池挖矿奖励权重至40%。<br/>
    S.Finance 即将在稳定币矿池区与YFII社区合作上线独有 dfi稳定币矿池，50%手续费奖励流动性提供用户，50%手续费将未来分享给SFG持有用户。同时抵押iUSD（dfi流动性矿池lp token）挖矿可获得SFG奖励。<br/>
    S.Finance 将于近期上线链上投票治理工具，由社区讨论决定是否进行SFG挖矿减产以及减产方案。`,
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
    warningNoPool: '兑换不可用。请在池中选择 {0}。'
  },
  balancesInfo: {
    name: '兑换池概念',
    assetDistribution: '资产分布',
    swapFeeRate: '兑换费',
    depositFeeRate: '存款费',
    withdrawalFeeRate: '取款费',
    adminFeeRate: '管理员费',
    avgAssetPrice: '资产均价',
    amplificationCoefficient: '放大系数',
    fundingFeeRate: '资金费用率'
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
    depositBalancedProportion: '均衡添加所有硬币',
    depositUseMaximumAvailable: '使用最大数量的硬币',
    depositWrapped: '打包存款',
    depositWrappedPlaceholder: '存入抵押凭据',
    willLeastReceive: '你将至少收到',
    willReceive: '你将收到',
    bonus: '额外奖励',
    slippage: '额外成本',
    highSlippage: '警告!高滑点',
    depositStakeGauge: '存款并抵押挖矿',
    withdrawAvailableAmount: '可取款数量',
    withdrawAmountPlaceholder: '输入取出数量',
    withdrawRedemptionTip: '赎回挖矿中的 LP token',
    dailyProfit: '今日存款收益'
  },
  dao: {
    standTitle: '稳定币流动性矿池',
    tokenTitle: '{0} 流动性矿池',
    rewardWeight: '{0} 奖励权重',
    describe: '抵押 {0} 挖矿奖励 {1}',
    staking: '抵押',
    redemption: '赎回',
    miningReward: '挖矿奖励',
    stakingAmountPlaceholder: '输入抵押数量',
    stakingBalance: '当前可抵押',
    infiniteApproval: '信任此合约使用最佳矿工费，后续将无需再次批准',
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
  },
  notice: {
    approveSpending: '请授权钱包进行扣款',
    confirmDepositTransaction: '请在钱包中确认存款转账',
    // syntetixAnomalous: '由于Syntetix合约升级操作可能会失败，为避免矿工费损失可稍后再试。',
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
  statemented: {
    notice1: {
      titleHtml: 'S.Finance 即将开启流动性挖矿',
      dateHtml: '2020/09/22 22:22:22',
      contHtml: `S.Finance 将于新加坡时间 2020-09-23 00:00:00 开启 susd 流动性矿池抵押挖矿。 抵押 susdv2 LP tokens 即可获得 S.Finance 治理代币 SFG、Curve 治理代币 CRV 以及 Synthetix 平台代币 SNX。<br/>
      SFG 总发行量 2100 万，遵循 100%基于贡献分配，无私募，无预挖。每日挖矿产出剩余部分的 0.2%，开启挖矿后的24 小时内 SFG 产出速率为 10%，即首日挖矿产出 0.02%，24 小时后挖矿速率恢复正常（CRV 和 SNX 的挖矿速率不受影响）。挖矿开启后的第三日将上线 SFG 流动性矿池，届时SFG 流动性矿池挖矿奖励权重将为稳定币矿池权重三倍。<br/>
      S.Finance 智能合约已由知道创宇完成安全审计，然而，安全审计并不能完全消除风险，请在能力承受范围内谨慎操作，SFG 有可能一文不值。`
    },
    notice2: {
      titleHtml: 'S.Finance 已开启 SFG 流动性挖矿',
      dateHtml: '2020/09/25 20:00',
      contHtml: `S.Finance 已于新加坡时间 2020-09-25 20:00 开启 SFG 流动性矿池抵押挖矿，抵押 BPT 即可获得 S.Finance 治理代币 SFG 奖励。SFG 兑换以及存取款服务由 Balancer 提供，其中：<br/>
      *兑换地址：<a href="https://legacy.balancer.exchange/#/swap/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0" target="_blank">https://legacy.balancer.exchange/#/swap/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0</a><br/>
      *流动性地址：<a href="https://pools.balancer.exchange/#/pool/0x2f49eea1efc1b04e9ecd3b81321060e29db26a19/" target="_blank">https://pools.balancer.exchange/#/pool/0x2f49eea1efc1b04e9ecd3b81321060e29db26a19/</a><br/>
      *SFG 合约（谨防假币）: <a href="https://etherscan.io/token/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0" target="_blank">https://etherscan.io/token/0x8a6ACA71A218301c7081d4e96D64292D3B275ce0</a><br/>
      SFG 流动性挖矿开启后，SFG 流动性矿池区奖励当前权重为 30%。<br/>
      S.Finance 流动性挖矿已开启 3 日，按照 SFG 挖矿释放规则，目前流通数量较少，通常价格波动比较剧烈，请谨慎操作注意风险。<br/>
      S.Finance 即将在稳定币流动性矿池区上线 Y （yfi）流动性矿池，抵押 iearn LP tokens  挖矿可获得 SFG 和 CRV 奖励。<br/>
      S.Finance 即将在稳定币流动性矿池区上线 iusd（yfii）流动性矿池，抵押 iearn LP tokens  挖矿可获得 SFG 和 iusd 奖励。`,
    }
  },
  temp: '* 如果只想取单个币种可将其他币种数量修改为0',
}