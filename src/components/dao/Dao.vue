<template>
	<div>
    <div class="total-bg">
      <b-container class="py-4 pl-5 d-flex align-items-center">
        <img class="logo_lg mr-4" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
        <h3 class="mb-0">{{ $t('global.sFinance') }}<br/>{{ $t('global.dao') }}</h3>
      </b-container>
    </div>

    <b-container>
      <root-sub />

      <b-tabs pills nav-class="tabs-nav" class="mt-4">
        <b-tab :title="$t('dao.standTitle')" class="pt-3" active>
          <!-- usd5 -->
          <h4 class="mb-2 d-flex flex-wrap align-items-end">
            <span class="mr-3">{{ $t('dao.tokenTitle', [store.gauges.usd5.propagateMark]) }}</span>
            <small class="mr-auto">{{ $t('dao.describe', [store.gauges.usd5.mortgagesUnit, store.gauges.usd5.rewardsUnit.join(' + ')]) }}</small>
            <text-overlay-loading inline :show="store.gauges.usd5.apy.loading">
              <span class="h5 text-danger-1 mb-0">
                <small class="text-black-45">{{ $t('global.apr') }}</small>
                {{ store.gauges.usd5.apy.percent }}%
              </span>
            </text-overlay-loading>
          </h4>
          <div class="box mb-4 px-4 py-3">
            <div class="row mb-3 line-bottom">
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.totalStaking') }}</h6>
                <text-overlay-loading inline :show="store.gauges.usd5.mortgages.usd5.totalStaking.loading">
                  <span class="h4 mr-2">{{ store.gauges.usd5.mortgages.usd5.totalStaking.cont }}</span>
                  <span class="inline-block text-black-65">{{ store.gauges.usd5.mortgagesUnit }}</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.myStaking') }}</h6>
                <text-overlay-loading inline :show="store.gauges.usd5.mortgages.usd5.userStaking.loading">
                  <span class="h4 mr-2">{{ store.gauges.usd5.mortgages.usd5.userStaking.cont }}</span>
                  <span class="inline-block text-black-65">{{ store.gauges.usd5.mortgagesUnit }}</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.virtualPrice') }}</h6>
                <text-overlay-loading inline :show="store.tokens.usd5.price.loading">
                  <span class="h4 mb-0">
                    1 <span class="h6 text-black-65">{{ store.tokens.usd5.name }} = </span>
                  </span>
                  <span class="h4 mb-0">
                    {{ store.tokens.usd5.price.cont }}
                    <span class="text-black-65 h6">USD</span>
                  </span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.rewardWeight', ['SFG']) }}</h6>
                <text-overlay-loading inline :show="store.gauges.usd5.rewards.sfg.weighting.loading">
                  <span class="h4">{{ store.gauges.usd5.rewards.sfg.weighting.percent }}%</span>
                </text-overlay-loading>
              </span>
            </div>

            <b-tabs pills nav-class="tabs-nav" class="mt-1">
              <b-tab :title="$t('dao.staking')" class="pt-3" active>
                <label class="text-black-65 mb-0">{{ $t('dao.staking') }}</label>
                <div class="row flex-wrap">
                  <div class="col-12 col-lg mt-2">
                    <b-form-input class="h-38" v-model="store.gauges.usd5.mortgages.usd5.stakeAmountInput" :placeholder="$t('dao.stakingAmountPlaceholder')"></b-form-input>
                  </div>
                  <b-form-radio-group
                    class="mt-2 col"
                    v-model="store.gauges.usd5.mortgages.usd5.stakeSliderSelectedRadio"
                    :options="store.gauges.usd5.mortgages.usd5.stakeSliderOptions"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </div>
                <small class="d-flex mt-1 flex-wrap">
                  {{ $t('dao.stakingBalance') }}：
                  <text-overlay-loading class="mr-2" :show="store.gauges.usd5.mortgages.usd5.userBalanceOf.loading">{{ store.gauges.usd5.mortgages.usd5.userBalanceOf.cont }} {{ store.gauges.usd5.mortgages.usd5.name }}</text-overlay-loading>
                  <b-button class="text-blue-1" to='/liquidity/usd5' size="xsm" variant="light">{{ $t('dao.stakingConfirmTip', [store.gauges.usd5.mortgages.usd5.name]) }}</b-button>
                </small>
                <!-- FIXME: inf_approval -->
                <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                <b-alert class="mt-3" :show="dismissCountDown" variant="dark" dismissible fade
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  v-html='waitingMessage'>
                </b-alert>
                <b-alert class="mt-3" :show="store.tokens.usd5.error.dismissCountDown" variant="dark" dismissible fade
                  @dismissed="store.tokens.usd5.error.dismissCountDown=0"
                  v-html='store.tokens.usd5.error.message'>
                </b-alert>

                <div class="d-flex align-items-end mt-5 float-right">
                  <text-overlay-loading :show="loadingAction">
                    <b-button size="lg" variant="danger" @click=onUsd5Stake>
                      {{ $t('dao.stakingConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <b-tab :title="$t('dao.redemption')" class="pt-3">
                <label class="text-black-65 mb-0">{{ $t('dao.redemption') }}</label>
                <div class="row flex-wrap">
                  <div class="col-12 col-lg mt-2">
                    <b-form-input class="h-38" v-model="store.gauges.usd5.mortgages.usd5.redemptionAmountInput" :placeholder="$t('dao.redemptionAmountPlaceholder')"></b-form-input>
                  </div>
                  <b-form-radio-group
                    class="mt-2 col"
                    v-model="store.gauges.usd5.mortgages.usd5.redemptionSliderSelectedRadio"
                    :options="store.gauges.usd5.mortgages.usd5.redemptionSliderOptions"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </div>
                <small class="d-flex mt-1">
                  {{ $t('dao.redemptionBalance') }}：
                  <text-overlay-loading :show="store.gauges.usd5.mortgages.usd5.userStaking.loading">{{ store.gauges.usd5.mortgages.usd5.userStaking.cont }} {{ store.gauges.usd5.mortgages.usd5.name }}</text-overlay-loading>
                </small>
                <!-- FIXME: inf_approval -->
                <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                <b-alert class="mt-3" :show="dismissCountDown && waitingMessageTargetId === 'withdraw'" variant="dark" dismissible fade
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  v-html='waitingMessage'>
                </b-alert>
                <div class="d-flex align-items-end mt-5 float-right">
                  <text-overlay-loading :show="loadingAction">
                    <b-button size="lg" variant="danger" @click=onUsd5Redemption>
                      {{ $t('dao.redemptionConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <b-tab :title="$t('dao.miningReward')" class="pt-3">
                <div class="area">
                  <h5 class="mb-3 d-flex align-items-center">
                    <img :src="getTokenIcon(store.gauges.usd5.rewards.sfg.code)" class="mr-2 icon-w-20 icon token-icon" :class="[store.gauges.usd5.rewards.sfg.code+'-icon']">
                    {{ store.gauges.usd5.rewards.sfg.name }}
                  </h5>
                  <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                  <h4 class="mb-1">
                    <text-overlay-loading inline :show="store.gauges.usd5.rewards.sfg.userPendingReward.loading">
                      {{ store.gauges.usd5.rewards.sfg.userPendingReward.cont }} {{ store.gauges.usd5.rewards.sfg.name }}
                    </text-overlay-loading>
                  </h4>
                  <div class="d-flex no-gutters align-items-end">
                    <small class="col row flex-wrap">
                      <span class="col-12 col-lg-auto">
                        {{ $t('dao.miningPaidReward') }}：
                        <text-overlay-loading inline :show="store.gauges.usd5.rewards.sfg.userPaidReward.loading">
                          {{ store.gauges.usd5.rewards.sfg.userPaidReward.cont }} {{ store.gauges.usd5.rewards.sfg.name }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                      </span>
                      <span class="col-12 col-lg-auto">
                        {{ $t('dao.miningTotalReward') }}：
                        <text-overlay-loading inline :show="store.gauges.usd5.rewards.sfg.userTotalReward.loading">
                          {{ store.gauges.usd5.rewards.sfg.userTotalReward.cont }} {{ store.gauges.usd5.rewards.sfg.name }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                      </span>
                      <text-overlay-loading class="col-12 col-lg-auto"  inline :show="store.tokens.sfg.price.loading">
                        1 {{ store.tokens.sfg.name }} = {{ store.tokens.sfg.price.cont }} {{ store.tokens.sfg.priceUnit }}
                      </text-overlay-loading>
                    </small>
                    <text-overlay-loading :show="loadingAction">
                      <b-button variant="danger" @click="onUsd5Harvest">
                        {{ $t('dao.miningClaimConfirm') }}
                      </b-button>
                    </text-overlay-loading>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>

          <!-- dUSD -->
          <h4 class="mb-2 d-flex flex-wrap align-items-end">
            <span class="mr-3">{{ $t('dao.tokenTitle', [store.gauges.dusd.propagateMark]) }}</span>
            <small class="mr-auto">{{ $t('dao.describe', [store.gauges.dusd.mortgagesUnit, store.gauges.dusd.rewardsUnit.join(' + ')]) }}</small>
            <text-overlay-loading inline :show="store.gauges.dusd.apy.loading">
              <span class="h5 text-danger-1 mb-0">
                <small class="text-black-45">{{ $t('global.apr') }}</small>
                {{ store.gauges.dusd.apy.percent }}%
              </span>
            </text-overlay-loading>
          </h4>
          <div class="box mb-4 px-4 py-3">
            <div class="row mb-3 line-bottom">
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.totalStaking') }}</h6>
                <text-overlay-loading inline :show="store.gauges.dusd.mortgages.dusd.totalStaking.loading">
                  <span class="h4 mr-2">{{ store.gauges.dusd.mortgages.dusd.totalStaking.cont }}</span>
                  <span class="inline-block text-black-65">{{ store.gauges.dusd.mortgagesUnit }}</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.myStaking') }}</h6>
                <text-overlay-loading inline :show="store.gauges.dusd.mortgages.dusd.userStaking.loading">
                  <span class="h4 mr-2">{{ store.gauges.dusd.mortgages.dusd.userStaking.cont }}</span>
                  <span class="inline-block text-black-65">{{ store.gauges.dusd.mortgagesUnit }}</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.virtualPrice') }}</h6>
                <text-overlay-loading inline :show="store.tokens.dusd.price.loading">
                  <span class="h4 mb-0">
                    1 <span class="h6 text-black-65">{{ store.tokens.dusd.name }} = </span>
                  </span>
                  <span class="h4 mb-0">
                    {{ store.tokens.dusd.price.cont }}
                    <span class="text-black-65 h6">USDT</span>
                  </span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.rewardWeight', ['SFG']) }}</h6>
                <text-overlay-loading inline :show="store.gauges.dusd.rewards.sfg.weighting.loading">
                  <span class="h4">{{ store.gauges.dusd.rewards.sfg.weighting.percent }}%</span>
                </text-overlay-loading>
              </span>
            </div>

            <b-tabs pills nav-class="tabs-nav" class="mt-1">
              <b-tab :title="$t('dao.staking')" class="pt-3" active>
                <label class="text-black-65 mb-0">{{ $t('dao.staking') }}</label>
                <div class="row flex-wrap">
                  <div class="col-12 col-lg mt-2">
                    <b-form-input class="h-38" v-model="store.gauges.dusd.mortgages.dusd.stakeAmountInput" :placeholder="$t('dao.stakingAmountPlaceholder')"></b-form-input>
                  </div>
                  <b-form-radio-group
                    class="mt-2 col"
                    v-model="store.gauges.dusd.mortgages.dusd.stakeSliderSelectedRadio"
                    :options="store.gauges.dusd.mortgages.dusd.stakeSliderOptions"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </div>
                <small class="d-flex mt-1 flex-wrap">
                  {{ $t('dao.stakingBalance') }}：
                  <text-overlay-loading class="mr-2" :show="store.gauges.dusd.mortgages.dusd.userBalanceOf.loading">{{ store.gauges.dusd.mortgages.dusd.userBalanceOf.cont }} {{ store.gauges.dusd.mortgages.dusd.name }}</text-overlay-loading>
                  <b-button class="text-blue-1" to='/liquidity/dusd' size="xsm" variant="light">{{ $t('dao.stakingConfirmTip', [store.gauges.dusd.mortgages.dusd.name]) }}</b-button>
                </small>
                <!-- FIXME: inf_approval -->
                <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                <b-alert class="mt-3" :show="dismissCountDown" variant="dark" dismissible fade
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  v-html='waitingMessage'>
                </b-alert>
                <b-alert class="mt-3" :show="store.tokens.dusd.error.dismissCountDown" variant="dark" dismissible fade
                  @dismissed="store.tokens.dusd.error.dismissCountDown=0"
                  v-html='store.tokens.dusd.error.message'>
                </b-alert>

                <div class="d-flex align-items-end mt-5 float-right">
                  <text-overlay-loading :show="loadingAction">
                    <b-button size="lg" variant="danger" @click=onDusdStake>
                      {{ $t('dao.stakingConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <b-tab :title="$t('dao.redemption')" class="pt-3">
                <label class="text-black-65 mb-0">{{ $t('dao.redemption') }}</label>
                <div class="row flex-wrap">
                  <div class="col-12 col-lg mt-2">
                    <b-form-input class="h-38" v-model="store.gauges.dusd.mortgages.dusd.redemptionAmountInput" :placeholder="$t('dao.redemptionAmountPlaceholder')"></b-form-input>
                  </div>
                  <b-form-radio-group
                    class="mt-2 col"
                    v-model="store.gauges.dusd.mortgages.dusd.redemptionSliderSelectedRadio"
                    :options="store.gauges.dusd.mortgages.dusd.redemptionSliderOptions"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </div>
                <small class="d-flex mt-1">
                  {{ $t('dao.redemptionBalance') }}：
                  <text-overlay-loading :show="store.gauges.dusd.mortgages.dusd.userStaking.loading">{{ store.gauges.dusd.mortgages.dusd.userStaking.cont }} {{ store.gauges.dusd.mortgages.dusd.name }}</text-overlay-loading>
                </small>
                <!-- FIXME: inf_approval -->
                <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                <b-alert class="mt-3" :show="dismissCountDown && waitingMessageTargetId === 'withdraw'" variant="dark" dismissible fade
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  v-html='waitingMessage'>
                </b-alert>
                <div class="d-flex align-items-end mt-5 float-right">
                  <text-overlay-loading :show="loadingAction">
                    <b-button size="lg" variant="danger" @click=onDusdRedemption>
                      {{ $t('dao.redemptionConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <b-tab :title="$t('dao.miningReward')" class="pt-3">
                <div class="area">
                  <h5 class="mb-3 d-flex align-items-center">
                    <img :src="getTokenIcon(store.gauges.dusd.rewards.sfg.code)" class="mr-2 icon-w-20 icon token-icon" :class="[store.gauges.dusd.rewards.sfg.code+'-icon']">
                    {{ store.gauges.dusd.rewards.sfg.name }}
                  </h5>
                  <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                  <h4 class="mb-1">
                    <text-overlay-loading inline :show="store.gauges.dusd.rewards.sfg.userPendingReward.loading">
                      {{ store.gauges.dusd.rewards.sfg.userPendingReward.cont }} {{ store.gauges.dusd.rewards.sfg.name }}
                    </text-overlay-loading>
                  </h4>
                  <div class="d-flex no-gutters align-items-end">
                    <small class="col row flex-wrap">
                      <span class="col-12 col-lg-auto">
                        {{ $t('dao.miningPaidReward') }}：
                        <text-overlay-loading inline :show="store.gauges.dusd.rewards.sfg.userPaidReward.loading">
                          {{ store.gauges.dusd.rewards.sfg.userPaidReward.cont }} {{ store.gauges.dusd.rewards.sfg.name }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                      </span>
                      <span class="col-12 col-lg-auto">
                        {{ $t('dao.miningTotalReward') }}：
                        <text-overlay-loading inline :show="store.gauges.dusd.rewards.sfg.userTotalReward.loading">
                          {{ store.gauges.dusd.rewards.sfg.userTotalReward.cont }} {{ store.gauges.dusd.rewards.sfg.name }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                      </span>
                      <text-overlay-loading class="col-12 col-lg-auto"  inline :show="store.tokens.sfg.price.loading">
                        1 {{ store.tokens.sfg.name }} = {{ store.tokens.sfg.price.cont }} {{ store.tokens.sfg.priceUnit }}
                      </text-overlay-loading>
                    </small>
                    <text-overlay-loading :show="loadingAction">
                      <b-button variant="danger" @click="onDusdHarvest">
                        {{ $t('dao.miningClaimConfirm') }}
                      </b-button>
                    </text-overlay-loading>
                  </div>
                </div>
                <div class="area">
                  <h5 class="mb-3 d-flex align-items-center">
                    <img :src="getTokenIcon(store.gauges.dusd.rewards.df.code)" class="mr-2 icon-w-20 icon token-icon" :class="[store.gauges.dusd.rewards.df.code+'-icon']">
                    {{ store.gauges.dusd.rewards.df.name }}
                  </h5>
                  <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                  <h4 class="mb-1">
                    <text-overlay-loading inline :show="store.gauges.dusd.rewards.df.userPendingReward.loading">
                      {{ store.gauges.dusd.rewards.df.userPendingReward.cont }} {{ store.gauges.dusd.rewards.df.name }}
                    </text-overlay-loading>
                  </h4>
                  <div class="d-flex no-gutters align-items-end">
                    <small class="col row flex-wrap">
                      <span class="col-12 col-lg-auto">
                        {{ $t('dao.miningPaidReward') }}：
                        <text-overlay-loading inline :show="store.gauges.dusd.rewards.df.userPaidReward.loading">
                          {{ store.gauges.dusd.rewards.df.userPaidReward.cont }} {{ store.gauges.dusd.rewards.df.name }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                      </span>
                      <span class="col-12 col-lg-auto">
                        {{ $t('dao.miningTotalReward') }}：
                        <text-overlay-loading inline :show="store.gauges.dusd.rewards.df.userTotalReward.loading">
                          {{ store.gauges.dusd.rewards.df.userTotalReward.cont }} {{ store.gauges.dusd.rewards.df.name }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                      </span>
                      <text-overlay-loading class="col-12 col-lg-auto"  inline :show="store.tokens.df.price.loading">
                        1 {{ store.gauges.dusd.rewards.df.name }} = {{ store.tokens.df.price.cont }} {{ store.tokens.df.priceUnit }}
                      </text-overlay-loading>
                    </small>
                    <text-overlay-loading :show="loadingAction">
                      <b-button variant="danger" @click="onDusdClaimRewards">
                        {{ $t('dao.miningClaimConfirm') }}
                      </b-button>
                    </text-overlay-loading>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>

          <!-- dfi -->
          <h4 class="mb-2 d-flex flex-wrap align-items-end">
            <span class="mr-3">{{ $t('dao.tokenTitle', [store.gauges.dfi.propagateMark]) }}</span>
            <small class="mr-auto">{{ $t('dao.describe', [store.gauges.dfi.mortgagesUnit, store.gauges.dfi.rewardsUnit.join(' ')]) }}</small>
            <text-overlay-loading inline :show="store.gauges.dfi.apy.loading">
              <span class="h5 text-danger-1 mb-0">
                <small class="text-black-45">{{ $t('global.apr') }}</small>
                {{ store.gauges.dfi.apy.percent }}%
              </span>
            </text-overlay-loading>
          </h4>
          <div class="box mb-4 px-4 py-3">
            <div class="row mb-3 line-bottom">
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.totalStaking') }}</h6>
                <text-overlay-loading inline :show="store.gauges.dfi.mortgages.iUSD_LPT.totalStaking.loading">
                  <span class="h4 mr-2">{{ store.gauges.dfi.mortgages.iUSD_LPT.totalStaking.cont }}</span>
                  <span class="inline-block text-black-65">{{ store.gauges.dfi.mortgagesUnit }}</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.myStaking') }}</h6>
                <text-overlay-loading inline :show="store.gauges.dfi.mortgages.iUSD_LPT.userStaking.loading">
                  <span class="h4 mr-2">{{ store.gauges.dfi.mortgages.iUSD_LPT.userStaking.cont }}</span>
                  <span class="inline-block text-black-65">{{ store.gauges.dfi.mortgagesUnit }}</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.virtualPrice') }}</h6>
                <text-overlay-loading inline :show="store.tokens.iUSD_LPT.price.loading">
                  <span class="h4 mb-0">
                    1 <span class="h6 text-black-65">{{ store.tokens.iUSD_LPT.name }} = </span>
                  </span>
                  <span class="h4 mb-0">
                    {{ store.tokens.iUSD_LPT.price.cont }}
                    <span class="text-black-65 h6">USD</span>
                  </span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.rewardWeight', ['SFG']) }}</h6>
                <text-overlay-loading inline :show="store.gauges.dfi.rewards.sfg.weighting.loading">
                  <span class="h4">{{ store.gauges.dfi.rewards.sfg.weighting.percent }}%</span>
                </text-overlay-loading>
              </span>
            </div>

            <b-tabs pills nav-class="tabs-nav" class="mt-1">
              <b-tab :title="$t('dao.staking')" class="pt-3" active>
                <label class="text-black-65 mb-0">{{ $t('dao.staking') }}</label>
                <div class="row flex-wrap">
                  <div class="col-12 col-lg mt-2">
                    <b-form-input class="h-38" v-model="store.gauges.dfi.mortgages.iUSD_LPT.stakeAmountInput" :placeholder="$t('dao.stakingAmountPlaceholder')"></b-form-input>
                  </div>
                  <b-form-radio-group
                    class="mt-2 col"
                    v-model="store.gauges.dfi.mortgages.iUSD_LPT.stakeSliderSelectedRadio"
                    :options="store.gauges.dfi.mortgages.iUSD_LPT.stakeSliderOptions"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </div>
                <small class="d-flex mt-1 flex-wrap">
                  {{ $t('dao.stakingBalance') }}：
                  <text-overlay-loading class="mr-2" :show="store.gauges.dfi.mortgages.iUSD_LPT.userBalanceOf.loading">{{ store.gauges.dfi.mortgages.iUSD_LPT.userBalanceOf.cont }} {{ store.gauges.dfi.mortgages.iUSD_LPT.name }}</text-overlay-loading>
                  <b-button class="text-blue-1" to='/liquidity/dfi' size="xsm" variant="light">{{ $t('dao.stakingConfirmTip', [store.gauges.dfi.mortgages.iUSD_LPT.name]) }}</b-button>
                </small>
                <!-- FIXME: inf_approval -->
                <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                <b-alert class="mt-3" :show="dismissCountDown" variant="dark" dismissible fade
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  v-html='waitingMessage'>
                </b-alert>
                <b-alert class="mt-3" :show="store.tokens.iUSD_LPT.error.dismissCountDown" variant="dark" dismissible fade
                  @dismissed="store.tokens.iUSD_LPT.error.dismissCountDown=0"
                  v-html='store.tokens.iUSD_LPT.error.message'>
                </b-alert>

                <div class="d-flex align-items-end mt-5 float-right">
                  <text-overlay-loading :show="loadingAction">
                    <b-button size="lg" variant="danger" @click=onDfiStake>
                      {{ $t('dao.stakingConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <b-tab :title="$t('dao.redemption')" class="pt-3">
                <label class="text-black-65 mb-0">{{ $t('dao.redemption') }}</label>
                <div class="row flex-wrap">
                  <div class="col-12 col-lg mt-2">
                    <b-form-input class="h-38" v-model="store.gauges.dfi.mortgages.iUSD_LPT.redemptionAmountInput" :placeholder="$t('dao.redemptionAmountPlaceholder')"></b-form-input>
                  </div>
                  <b-form-radio-group
                    class="mt-2 col"
                    v-model="store.gauges.dfi.mortgages.iUSD_LPT.redemptionSliderSelectedRadio"
                    :options="store.gauges.dfi.mortgages.iUSD_LPT.redemptionSliderOptions"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </div>
                <small class="d-flex mt-1">
                  {{ $t('dao.redemptionBalance') }}：
                  <text-overlay-loading :show="store.gauges.dfi.mortgages.iUSD_LPT.userStaking.loading">{{ store.gauges.dfi.mortgages.iUSD_LPT.userStaking.cont }} {{ store.gauges.dfi.mortgages.iUSD_LPT.name }}</text-overlay-loading>
                </small>
                <!-- FIXME: inf_approval -->
                <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                <b-alert class="mt-3" :show="dismissCountDown && waitingMessageTargetId === 'withdraw'" variant="dark" dismissible fade
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  v-html='waitingMessage'>
                </b-alert>
                <div class="d-flex align-items-end mt-5 float-right">
                  <text-overlay-loading :show="loadingAction">
                    <b-button size="lg" variant="danger" @click=onDfiRedemption>
                      {{ $t('dao.redemptionConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <b-tab :title="$t('dao.miningReward')" class="pt-3">
                <div class="area">
                  <h5 class="mb-3 d-flex align-items-center">
                    <img :src="getTokenIcon(store.gauges.dfi.rewards.sfg.code)" class="mr-2 icon-w-20 icon token-icon" :class="[store.gauges.dfi.rewards.sfg.code+'-icon']">
                    {{ store.gauges.dfi.rewards.sfg.name }}
                  </h5>
                  <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                  <h4 class="mb-1">
                    <text-overlay-loading inline :show="store.gauges.dfi.rewards.sfg.userPendingReward.loading">
                      {{ store.gauges.dfi.rewards.sfg.userPendingReward.cont }} {{ store.gauges.dfi.rewards.sfg.name }}
                    </text-overlay-loading>
                  </h4>
                  <div class="d-flex no-gutters align-items-end">
                    <small class="col row flex-wrap">
                      <span class="col-12 col-lg-auto">
                        {{ $t('dao.miningPaidReward') }}：
                        <text-overlay-loading inline :show="store.gauges.dfi.rewards.sfg.userPaidReward.loading">
                          {{ store.gauges.dfi.rewards.sfg.userPaidReward.cont }} {{ store.gauges.dfi.rewards.sfg.name }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                      </span>
                      <span class="col-12 col-lg-auto">
                        {{ $t('dao.miningTotalReward') }}：
                        <text-overlay-loading inline :show="store.gauges.dfi.rewards.sfg.userTotalReward.loading">
                          {{ store.gauges.dfi.rewards.sfg.userTotalReward.cont }} {{ store.gauges.dfi.rewards.sfg.name }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                      </span>
                      <text-overlay-loading class="col-12 col-lg-auto"  inline :show="store.tokens.sfg.price.loading">
                        1 {{ store.tokens.sfg.name }} = {{ store.tokens.sfg.price.cont }} {{ store.tokens.sfg.priceUnit }}
                      </text-overlay-loading>
                    </small>
                    <text-overlay-loading :show="loadingAction">
                      <b-button variant="danger" @click="onDfiHarvest">
                        {{ $t('dao.miningClaimConfirm') }}
                      </b-button>
                    </text-overlay-loading>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>

          <!-- sUSD -->
          <h4 class="mb-2 d-flex flex-wrap align-items-end">
            <span class="mr-3">{{ $t('dao.tokenTitle', [currentPool.nameCont]) }}</span>
            <small class="mr-auto">{{ $t('dao.describe', [currentPool.name + ' LP token', currentPool.describeTokensCont]) }}</small>
            <text-overlay-loading inline :show="store.gauges.susdv2.apy.loading">
              <span class="h5 text-danger-1 mb-0">
                <small class="text-black-45">{{ $t('global.apr') }}</small>
                {{ store.gauges.susdv2.apy.percent }}%
              </span>
            </text-overlay-loading>
          </h4>
          <div class="box mb-4 px-4 py-3">
            <div class="row mb-3 line-bottom">
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.totalStaking') }}</h6>
                <text-overlay-loading inline :show="currentPool.totalSupply.loading">
                  <span class="h4 mr-2">{{ currentPool.totalSupply.cont }}</span>
                  <span class="inline-block text-black-65">{{ currentPool.name }} LP token</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.myStaking') }}</h6>
                <text-overlay-loading inline :show="currentPool.gaugeBalance.loading">
                  <span class="h4 mr-2">{{ currentPool.gaugeBalance.cont }}</span>
                  <span class="inline-block text-black-65">{{ currentPool.name }} LP token</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.virtualPrice') }}</h6>
                <text-overlay-loading inline :show="store.tokens.susdv2LpToken.price.loading">
                  <span class="h4 mb-0">
                    1 <span class="h6 text-black-65">{{ currentPool.name }} LP token = </span>
                  </span>
                  <span class="h4 mb-0">
                    {{ store.tokens.susdv2LpToken.price.cont }}<span class="text-black-65 h6"> USD</span>
                  </span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.rewardWeight', ['SFG']) }}</h6>
                <text-overlay-loading inline :show="store.gauges.susdv2.rewards.sfg.weighting.loading">
                  <span class="h4">{{ store.gauges.susdv2.rewards.sfg.weighting.percent }}%</span>
                </text-overlay-loading>
              </span>
            </div>

            <b-tabs pills nav-class="tabs-nav" class="mt-1">
              <b-tab :title="$t('dao.staking')" class="pt-3" active>
                <label class="text-black-65 mb-0">{{ $t('dao.staking') }}</label>
                <div class="row flex-wrap">
                  <div class="col-12 col-lg mt-2">
                    <b-form-input class="h-38" v-model="depositAmountInput" :placeholder="$t('dao.stakingAmountPlaceholder')"></b-form-input>
                  </div>
                  <b-form-radio-group
                    class="mt-2 col"
                    v-model="depositSliderSelectedRadio"
                    :options="depositSliderOptions"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </div>
                <small class="d-flex mt-1 flex-wrap">
                  {{ $t('dao.stakingBalance') }}：
                  <text-overlay-loading class="mr-2" :show="currentPool.balanceOf.loading">{{ currentPool.balanceOf.cont }} {{ currentPool.name }} LP token</text-overlay-loading>
                  <b-button class="text-blue-1" to="/liquidity/susdv2" size="xsm" variant="light">{{ $t('dao.stakingConfirmTip', ['LP token']) }}</b-button>
                </small>
                <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                <b-alert class="mt-3" :show="dismissCountDown && waitingMessageTargetId === 'deposit'" variant="dark" dismissible fade
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  v-html='waitingMessage'>
                </b-alert>
                <div class="d-flex align-items-end mt-5 float-right">
                  <text-overlay-loading :show="loadingAction">
                    <b-button size="lg" variant="danger" @click=deposit>
                      {{ $t('dao.stakingConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <b-tab :title="$t('dao.redemption')" class="pt-3">
                <label class="text-black-65 mb-0">{{ $t('dao.redemption') }}</label>
                <div class="row flex-wrap">
                  <div class="col-12 col-lg mt-2">
                    <b-form-input class="h-38" v-model="withdrawAmountInput" :placeholder="$t('dao.redemptionAmountPlaceholder')"></b-form-input>
                  </div>
                  <b-form-radio-group
                    class="mt-2 col"
                    v-model="withdrawSliderSelectedRadio"
                    :options="withdrawSliderOptions"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </div>
                <small class="d-flex mt-1">
                  {{ $t('dao.redemptionBalance') }}：
                  <text-overlay-loading :show="currentPool.gaugeBalance.loading">{{ currentPool.gaugeBalance.cont }} {{ currentPool.name }} LP token</text-overlay-loading>
                </small>
                <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                <b-alert class="mt-3" :show="dismissCountDown && waitingMessageTargetId === 'withdraw'" variant="dark" dismissible fade
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  v-html='waitingMessage'>
                </b-alert>
                <b-alert class="mt-3" :show="store.tokens.susdv2LpToken.error.dismissCountDown" variant="dark" dismissible fade
                  @dismissed="store.tokens.susdv2LpToken.error.dismissCountDown=0"
                  v-html='store.tokens.susdv2LpToken.error.message'>
                </b-alert>

                <div class="d-flex align-items-end mt-5 float-right">
                  <text-overlay-loading :show="loadingAction">
                    <b-button size="lg" variant="danger" @click=withdraw>
                      {{ $t('dao.redemptionConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <b-tab :title="$t('dao.miningReward')" class="pt-3">
                <div class="area" v-for="(token, idx) in currentPool.mining.relation" :key="'token-'+idx">
                  <template v-if="Array.isArray(token)">
                    <div class="row">
                      <div class="col" v-for="childToken in token" :key="'token-'+currentPool.tokens[childToken].name">
                        <h5 class="mb-3 d-flex align-items-center">
                          <img :src="getTokenIcon(currentPool.tokens[childToken].name)" class="mr-2 icon-w-20 icon token-icon" :class="[currentPool.tokens[childToken].name+'-icon']">
                          {{ currentPool.tokens[childToken].nameCont }}
                        </h5>
                        <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                        <h4 class="mb-1">
                          <text-overlay-loading inline :show="currentPool.tokens[childToken].pendingReward.loading">
                            {{ currentPool.tokens[childToken].pendingReward.cont }} {{ currentPool.tokens[childToken].nameCont }}
                          </text-overlay-loading>
                        </h4>
                        <div class="d-flex no-gutters align-items-end mt-3">
                          <small class="col row flex-wrap">
                            <span class="col-12 col-lg-auto">
                              {{ $t('dao.miningPaidReward') }}：
                              <text-overlay-loading inline :show="currentPool.tokens[childToken].paidReward.loading">
                                {{ currentPool.tokens[childToken].paidReward.cont }} {{ currentPool.tokens[childToken].nameCont }}
                              </text-overlay-loading>
                              <em class="px-3 text-black-15">/</em>
                            </span>
                            <span class="col-12 col-lg-auto">
                              {{ $t('dao.miningTotalReward') }}：
                              <text-overlay-loading inline :show="currentPool.tokens[childToken].totalReward.loading">
                                {{ currentPool.tokens[childToken].totalReward.cont }} {{ currentPool.tokens[childToken].nameCont }}
                              </text-overlay-loading>
                            </span>
                            <!-- <em class="px-3 text-black-15">/</em>
                            <text-overlay-loading inline :show="store.tokens[childToken].price.loading">
                              {{ store.tokens[childToken].price.cont }} {{ store.tokens[childToken].priceUnit }} = 1 {{ store.tokens[childToken].name }}
                            </text-overlay-loading> -->
                          </small>
                        </div>
                      </div>
                    </div>
                    <b-alert class="mt-3" :show="dismissCountDown && waitingMessageTargetId === 'claimRewards'" variant="dark" dismissible fade
                      @dismissed="dismissCountDown=0"
                      @dismiss-count-down="countDownChanged"
                      v-html='waitingMessage'>
                    </b-alert>
                    <div class="d-flex mt-4 justify-content-end">
                      <text-overlay-loading :show="loadingAction">
                        <b-button variant="danger" @click=claimRewards>
                          {{ $t('dao.miningClaimConfirm') }}
                        </b-button>
                      </text-overlay-loading>
                    </div>
                  </template>
                  <template v-else>
                    <h5 class="mb-3 d-flex align-items-center">
                      <img :src="getTokenIcon(currentPool.tokens[token].name)" class="mr-2 icon-w-20 icon token-icon" :class="[currentPool.tokens[token].name+'-icon']">
                      {{ currentPool.tokens[token].nameCont }}
                    </h5>
                    <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                    <h4 class="mb-1">
                      <text-overlay-loading inline :show="currentPool.tokens[token].pendingReward.loading">
                        {{ currentPool.tokens[token].pendingReward.cont }} {{ currentPool.tokens[token].nameCont }}
                      </text-overlay-loading>
                    </h4>
                    <div class="d-flex no-gutters align-items-end">
                      <small class="col row flex-wrap">
                        <span class="col-12 col-lg-auto">
                          {{ $t('dao.miningPaidReward') }}：
                          <text-overlay-loading inline :show="currentPool.tokens[token].paidReward.loading">
                            {{ currentPool.tokens[token].paidReward.cont }} {{ currentPool.tokens[token].nameCont }}
                          </text-overlay-loading>
                          <em class="px-3 text-black-15">/</em>
                        </span>
                        <span class="col-12 col-lg-auto">
                          {{ $t('dao.miningTotalReward') }}：
                          <text-overlay-loading inline :show="currentPool.tokens[token].totalReward.loading">
                            {{ currentPool.tokens[token].totalReward.cont }} {{ currentPool.tokens[token].nameCont }}
                          </text-overlay-loading>
                          <em class="px-3 text-black-15">/</em>
                        </span>
                        <text-overlay-loading class="col-12 col-lg-auto" inline :show="store.tokens[token].price.loading">
                          1 {{ store.tokens[token].name }} = {{ store.tokens[token].price.cont }} {{ store.tokens[token].priceUnit }}
                        </text-overlay-loading>
                      </small>
                      <text-overlay-loading :show="loadingAction">
                        <b-button variant="danger" @click="currentPool.tokens[token].claimConfirm">
                          {{ $t('dao.miningClaimConfirm') }}
                        </b-button>
                      </text-overlay-loading>
                    </div>
                    <b-alert class="mt-3" :show="dismissCountDown && waitingMessageTargetId === 'claim'" variant="dark" dismissible fade
                      @dismissed="dismissCountDown=0"
                      @dismiss-count-down="countDownChanged"
                      v-html='waitingMessage'>
                    </b-alert>
                  </template>

                </div>
              </b-tab>
            </b-tabs>
          </div>
        </b-tab>

        <b-tab :title="$t('dao.tokenTitle', [store.gauges.bpt.propagateMark])" class="pt-3">
          <h4 class="mb-2 d-flex flex-wrap align-items-end">
            <span class="mr-3">{{ $t('dao.tokenTitle', [store.gauges.bpt.propagateMark]) }}</span>
            <small class="mr-auto">{{ $t('dao.describe', [store.gauges.bpt.mortgagesUnit, store.gauges.bpt.rewardsUnit.join(' ')]) }}</small>
            <text-overlay-loading inline :show="store.gauges.bpt.apy.loading">
              <span class="h5 text-danger-1 mb-0">
                <small class="text-black-45">{{ $t('global.apr') }}</small>
                {{ store.gauges.bpt.apy.percent }}%
              </span>
            </text-overlay-loading>
          </h4>
          <div class="box mb-4 px-4 py-3">
            <div class="row mb-3 line-bottom">
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.totalStaking') }}</h6>
                <text-overlay-loading inline :show="store.gauges.bpt.mortgages.bpt.totalStaking.loading">
                  <span class="h4 mr-2">{{ store.gauges.bpt.mortgages.bpt.totalStaking.cont }}</span>
                  <span class="inline-block text-black-65">{{ store.gauges.bpt.mortgagesUnit }}</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.myStaking') }}</h6>
                <text-overlay-loading inline :show="store.gauges.bpt.mortgages.bpt.userStaking.loading">
                  <span class="h4 mr-2">{{ store.gauges.bpt.mortgages.bpt.userStaking.cont }}</span>
                  <span class="inline-block text-black-65">{{ store.gauges.bpt.mortgagesUnit }}</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.miningPaidReward') }}</h6>
                <text-overlay-loading inline :show="store.gauges.bpt.rewards.sfg.userPaidReward.loading">
                  <span class="h4 mr-2">{{ store.gauges.bpt.rewards.sfg.userPaidReward.cont }}</span>
                  <span class="inline-block text-black-65">{{ store.gauges.bpt.rewards.sfg.name }}</span>
                </text-overlay-loading>
              </span>
              <span class="col-12 col-md-6 pb-3">
                <h6 class="mb-0 text-black-65">{{ $t('dao.rewardWeight', ['SFG']) }}</h6>
                <text-overlay-loading inline :show="store.gauges.bpt.rewards.sfg.weighting.loading">
                  <span class="h4">{{ store.gauges.bpt.rewards.sfg.weighting.percent }}%</span>
                </text-overlay-loading>
              </span>
            </div>

            <b-tabs pills nav-class="tabs-nav" class="mt-1">
              <b-tab :title="$t('dao.staking')" class="pt-3" active>
                <label class="text-black-65 mb-0">{{ $t('dao.staking') }}</label>
                <div class="row flex-wrap">
                  <div class="col-12 col-lg mt-2">
                    <b-form-input class="h-38" v-model="store.gauges.bpt.mortgages.bpt.stakeAmountInput" :placeholder="$t('dao.stakingAmountPlaceholder')"></b-form-input>
                  </div>
                  <b-form-radio-group
                    class="mt-2 col"
                    v-model="store.gauges.bpt.mortgages.bpt.stakeSliderSelectedRadio"
                    :options="store.gauges.bpt.mortgages.bpt.stakeSliderOptions"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </div>
                <small class="d-flex mt-1 flex-wrap">
                  {{ $t('dao.stakingBalance') }}：
                  <text-overlay-loading class="mr-2" :show="store.gauges.bpt.mortgages.bpt.userBalanceOf.loading">{{ store.gauges.bpt.mortgages.bpt.userBalanceOf.cont }} {{ store.gauges.bpt.mortgages.bpt.name }}</text-overlay-loading>
                  <b-button class="text-blue-1" target="_blank" :href=store.gauges.bpt.mortgages.bpt.gainUrl size="xsm" variant="light">{{ $t('dao.stakingConfirmTip', [store.gauges.bpt.mortgages.bpt.name]) }}</b-button>
                </small>
                <!-- FIXME: inf_approval -->
                <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                <b-alert class="mt-3" :show="dismissCountDown" variant="dark" dismissible fade
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  v-html='waitingMessage'>
                </b-alert>
                <b-alert class="mt-3" :show="store.tokens.bpt.error.dismissCountDown" variant="dark" dismissible fade
                  @dismissed="store.tokens.bpt.error.dismissCountDown=0"
                  v-html='store.tokens.bpt.error.message'>
                </b-alert>

                <div class="d-flex align-items-end mt-5 float-right">
                  <text-overlay-loading :show="loadingAction">
                    <b-button size="lg" variant="danger" @click=onStake>
                      {{ $t('dao.stakingConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <b-tab :title="$t('dao.redemption')" class="pt-3">
                <label class="text-black-65 mb-0">{{ $t('dao.redemption') }}</label>
                <div class="row flex-wrap">
                  <div class="col-12 col-lg mt-2">
                    <b-form-input class="h-38" v-model="store.gauges.bpt.mortgages.bpt.redemptionAmountInput" :placeholder="$t('dao.redemptionAmountPlaceholder')"></b-form-input>
                  </div>
                  <b-form-radio-group
                    class="mt-2 col"
                    v-model="store.gauges.bpt.mortgages.bpt.redemptionSliderSelectedRadio"
                    :options="store.gauges.bpt.mortgages.bpt.redemptionSliderOptions"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </div>
                <small class="d-flex mt-1">
                  {{ $t('dao.redemptionBalance') }}：
                  <text-overlay-loading :show="store.gauges.bpt.mortgages.bpt.userStaking.loading">{{ store.gauges.bpt.mortgages.bpt.userStaking.cont }} {{ store.gauges.bpt.mortgages.bpt.name }}</text-overlay-loading>
                </small>
                <!-- FIXME: inf_approval -->
                <b-form-checkbox class="mt-4" v-model="inf_approval" name="inf-approval">{{ $t('global.infiniteApproval') }}</b-form-checkbox>
                <b-alert class="mt-3" :show="dismissCountDown && waitingMessageTargetId === 'withdraw'" variant="dark" dismissible fade
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged"
                  v-html='waitingMessage'>
                </b-alert>
                <div class="d-flex align-items-end mt-5 float-right">
                  <text-overlay-loading :show="loadingAction">
                    <b-button size="lg" variant="danger" @click=onRedemption>
                      {{ $t('dao.redemptionConfirm') }}
                    </b-button>
                  </text-overlay-loading>
                </div>
              </b-tab>
              <b-tab :title="$t('dao.miningReward')" class="pt-3">
                <div class="area">
                  <h5 class="mb-3 d-flex align-items-center">
                    <img :src="getTokenIcon(store.gauges.bpt.rewards.sfg.code)" class="mr-2 icon-w-20 icon token-icon" :class="[store.gauges.bpt.rewards.sfg.code+'-icon']">
                    {{ store.gauges.bpt.rewards.sfg.name }}
                  </h5>
                  <h6 class="mb-0 text-black-65">{{ $t('dao.miningPendingReward') }}</h6>
                  <h4 class="mb-1">
                    <text-overlay-loading inline :show="store.gauges.bpt.rewards.sfg.userPendingReward.loading">
                      {{ store.gauges.bpt.rewards.sfg.userPendingReward.cont }} {{ store.gauges.bpt.rewards.sfg.name }}
                    </text-overlay-loading>
                  </h4>
                  <div class="d-flex no-gutters align-items-end">
                    <small class="col row flex-wrap">
                      <span class="col-12 col-lg-auto">
                        {{ $t('dao.miningPaidReward') }}：
                        <text-overlay-loading inline :show="store.gauges.bpt.rewards.sfg.userPaidReward.loading">
                          {{ store.gauges.bpt.rewards.sfg.userPaidReward.cont }} {{ store.gauges.bpt.rewards.sfg.name }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                      </span>
                      <span class="col-12 col-lg-auto">
                        {{ $t('dao.miningTotalReward') }}：
                        <text-overlay-loading inline :show="store.gauges.bpt.rewards.sfg.userTotalReward.loading">
                          {{ store.gauges.bpt.rewards.sfg.userTotalReward.cont }} {{ store.gauges.bpt.rewards.sfg.name }}
                        </text-overlay-loading>
                        <em class="px-3 text-black-15">/</em>
                      </span>
                      <text-overlay-loading class="col-12 col-lg-auto"  inline :show="store.tokens.sfg.price.loading">
                        1 {{ store.tokens.sfg.name }} = {{ store.tokens.sfg.price.cont }} {{ store.tokens.sfg.priceUnit }}
                      </text-overlay-loading>
                    </small>
                    <text-overlay-loading :show="loadingAction">
                      <b-button variant="danger" @click="onHarvest">
                        {{ $t('dao.miningClaimConfirm') }}
                      </b-button>
                    </text-overlay-loading>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </b-tab>
      </b-tabs>

    </b-container>


    <fieldset v-if=false>
			<!-- <div class='pool-info'>
				<button @click='applyBoost' class='applyBoost' v-show='canApplyBoost && claimableTokens == 0'>Apply boost</button>
				<span class='greentext' v-show='canApplyBoost && claimableTokens > 0'>You can apply boost by claiming CRV</span>
				<div class='gaugeRelativeWeight'>
					Gauge relative weight: {{ gaugeRelativeWeight.toFixed(2) }}%
				</div>
				<div class='mintedCRVFrom'>
					Minted CRV from this gauge: {{ mintedFormat }}
				</div>
				<div v-show="['susdv2', 'sbtc'].includes(gauge.name) && claimedRewards > 0" class='claimedRewards'>
					Claimed 
					<span v-show="gauge.name == 'susdv2'">SNX</span>
					<span v-show="gauge.name == 'sbtc'">BPT</span>: {{ claimedRewardsFormat }}
				</div>
				<div class='boost' v-show='boost !== null && !isNaN(boost)'>
					Boost: {{ boost && boost.toFixed(4) }}
				</div>
				<div class='boost' v-show='currentBoost !== null && !isNaN(currentBoost)'>
					Current boost: {{ currentBoost && currentBoost.toFixed(4) }}
				</div>
			</div> -->
			<div>
				<div class='flex-break'></div>
				<!-- <div class='simple-error' v-show="['susdv2', 'sbtc'].includes(gauge.name) && synthsUnavailable">
					Synthetix are upgrading their contract now and claiming SNX is not available
					{{ synthsUnavailable }}
				</div> -->
				<div class='pool'>
          LPT deposit:<br/>
					<div class='poolBalance'>Balance: <span class='hoverpointer'>_{ poolBalanceFormat }}</span> _{ gauge.name }} LP token</div>
					<div class='input'>
						<label for='deposit'>Amount:</label>
						<!-- <input id='deposit' type='text' v-model='depositAmount'> -->
					</div>
					<div class='range' v-show=false>
						<div class='label'>
							<label for='zoom'>{{ depositSlider }}%</label>
						</div>
					</div>
					<div>
						<p>
              <input id="'inf-approval-susdv2" type="checkbox" name="inf-approval" v-model='inf_approval'>
              <label for="'inf-approval-susdv2" class='inf-approval-label'>Infinite approval </label>
            </p>
						<div>
							<button @click='deposit'>
								Deposit and stake
							</button>
						</div>
					</div>
				</div>
        <div class='flex-break'></div>
        LPT withdraw:<br/>

				<div class='gauge'>
					<div class='gaugeBalance'>Balance: <span class='hoverpointer'>{{ currentPool.gaugeBalance.cont }}</span> in gauge</div>
					<div class='input'>
						<label for='withdraw'>Amount:</label>
						<input id='withdraw' type='text' v-model='currentPool.withdraw.amount'>
					</div>
					<div class='range' v-show=false>
						<div class='label'>
							<label for='zoom'>{{ withdrawSlider }}%</label>
						</div>
					</div>
					<button @click='withdraw'>Withdraw</button>
				</div>
				<div class='flex-break'></div>

        <!-- SFG claimableTokens: {{ currentPool.tokens.sfg.mining.pendingRewardTether }} -->
        <button @click='claim' class='claimtokens'>Claim </button>
        <div class='flex-break'></div>

        CRV claimableReward: {{ claimableReward }}
        <button @click='claimRewards' class='claimrewards'>
          Claim {{ this.claimableReward / 1e18 }}
          <span>SNX</span>
        </button>
			</div>
		</fieldset>
	</div>
</template>

<script>
	  import Vue from 'vue'
    import { notify, notifyHandler, notifyNotification } from '../../init'
    import * as common from '../../utils/common.js'
    import { getters, contract as currentContract, gas as contractGas } from '../../contract'
    import allabis, { ERC20_abi, balancer_ABI, balancer_address } from '../../allabis'
    const compound = allabis.compound
    import * as helpers from '../../utils/helpers'

    import * as gasPriceStore from '../common/gasPriceStore'
    import GasPrice from '../common/GasPrice.vue'
    import RootSub from '../root/RootSub.vue'
    import DaoLiquidityGaugereAbi_susdv2 from './abi/susdv2'
    import DaoLiquidityGaugereAbi_snx from './abi/snx'

    import * as errorStore from '../common/errorStore'

    import TextOverlayLoading from '../../components/common/TextOverlayLoading.vue'

    import BN from 'bignumber.js'

    import Slippage from '../common/Slippage.vue'
    import * as gaugeStore from './gaugeStore'

    import { getBTCPrice } from '../common/priceStore'

    import store from '../../store'
    import { valueModel } from '../../model'
    import { floor } from '../../utils/math/round'
  	import * as volumeStore from '@/components/common/volumeStore'

    const __store__ = {
      loadingAction: true,
      notationDecimal: 1e18,

      tokens: {
        sfg: {
          priceDecimal: 2,
        },
        crv: {
          priceDecimal: 4,
        },
        snx: {
          priceDecimal: 4,
        }
      }
    }

    export default {
    	components: {
        Slippage,
        GasPrice,
        TextOverlayLoading,
        RootSub
    	},
    	data: () => ({
        store,

        depositSliderSelected: 0,
        depositSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],
        withdrawSliderSelected: 0,
        withdrawSliderOptions: [
          { text: '25%', value: 0.25 },
          { text: '50%', value: 0.5 },
          { text: '75%', value: 0.75 },
          { text: '100%', value: 1 }
        ],

        supportGauges: [
          ''
        ],



        waitingMessage: '',
        waitingMessageTargetId: '',
        dismissSecs: 10,
        dismissCountDown: 0,

        // TODO: 
        pools: {
          stand: ['susdv2', 'dfi'],
          token: ['sfg']
        },

        currentPool: {
          swap: '',
          swap_token: '',
          id: '',
          name: 'susdv2',
          nameCont: 'sUSD',
          /**
           *  @type {number}
           */
          priceDecimal: 2,
          /**
           *  @type {number}
           */
          get notationDecimal () {
            return __store__.notationDecimal
          },
          typeName: 'Liquidity',

          totalSupply: valueModel.create(),

          gauge: '',
          gaugeBalance: valueModel.create(),
          balanceOf: valueModel.create(),
          swap: '',
          swap_token: '',
          type: 0,

          describeTokensCont: 'SFG + CRV + SNX',
          staking: {
            in: -1,
            balance: -1
          },
          deposit: {
            gas: 750000,
            amount: 0
          },
          withdraw: {
            gas: 1000000,
            amount: 0
          },
          mining: {
            relation: [
              'sfg',
              ['crv', 'snx']
            ]
          },
          tokens: {
            sfg: {
              name: 'sfg',
              nameCont: 'SFG',
              rateUsd: -1,
              get priceDecimal () {
                return __store__.tokens.sfg.priceDecimal
              },
              set priceDecimal (val) {
                __store__.tokens.sfg.priceDecimal = val
              },
              pendingReward: valueModel.create(),
              paidReward: valueModel.create(),
              totalReward: valueModel.create(),
              claimConfirm: null
            },
            crv: {
              name: 'crv',
              nameCont: 'CRV',
              rateUsd: -1,
              priceDecimal: 18,
              pendingReward: valueModel.create(),
              paidReward: valueModel.create(),
              totalReward: valueModel.create(),
              claimConfirm: null
            },
            snx: {
              name: 'snx',
              nameCont: 'SNX',
              rateUsd: -1,
              priceDecimal: 18,
              pendingReward: valueModel.create(),
              paidReward: valueModel.create(),
              totalReward: valueModel.create(),
              claimConfirm: null
            }
          }
        },
        pools: [],
        mypools: [],
        claimFromGauges: [],

        inf_approval: true,

        gaugeContract: null,
        depositSlider: 100,
        withdrawSlider: 100,

        // FIXME:
        claimableReward: 0,
        gaugeContract: null,
        gauge: '',
      }),

        computed: {
          ...getters,
          gasPrice() {
            return gasPriceStore.state.gasPrice
          },
          gasPriceWei() {
            return gasPriceStore.gasPriceWei
          },
          loadingAction: {
            get () {
              // FIXME: 
              if (__store__.loadingAction && currentContract.initializedContracts) {
                this.mounted()
                __store__.loadingAction = false
              }

              return __store__.loadingAction
            },
            set (val) {
              __store__.loadingAction = val
            }
          },

          depositAmountInput: {
            get () {
              const { currentPool: { deposit }  } = this

              return deposit.amount || ''
            },
            set (val) {
              const { currentPool: { deposit }  } = this

              this.depositSliderSelected = 0
              deposit.amount = val
            }
          },

          withdrawAmountInput: {
            get () {
              const { currentPool: { withdraw }  } = this

              return withdraw.amount || ''
            },
            set (val) {
              const { currentPool: { withdraw }  } = this

              this.withdrawSliderSelected = 0
              withdraw.amount = val
            }
          },

          depositSliderSelectedRadio: {
            get () {
              return this.depositSliderSelected
            },
            set (val) {
              const { currentPool: { deposit, priceDecimal, balanceOf } } = this

              if (val === 0) return false

              deposit.amount = +balanceOf.handled > 0
                ? floor(BN(val).times(balanceOf.handled).toString(), priceDecimal)
                : 0
              this.depositSliderSelected = val
            }
          },

          withdrawSliderSelectedRadio: {
            get () {
              return this.withdrawSliderSelected
            },
            set (val) {
              const { currentPool: { withdraw, priceDecimal, gaugeBalance } } = this

              if (val === 0) return false

              withdraw.amount = +gaugeBalance.handled > 0
                ? floor(BN(val).times(gaugeBalance.handled).toString(), priceDecimal)
                : 0
              this.withdrawSliderSelected = val
            }
          },
        },
        created() {
          // FIXME: ?
          this.$watch(() => currentContract.currentContract, (val, oldval) => {
            console.log('watch currentContract', val, oldval)
          })
        },
        async mounted() {
          // Set currentPool confirm
          this.currentPool.tokens.sfg.claimConfirm = this.claim
          // FIXME: 
          this.currentPool.tokens.crv.claimConfirm = this.claimRewards
          this.currentPool.tokens.snx.claimConfirm = this.claimRewards
        },
        watch: {
          loadingAction (val) {
            console.log('watch ---- ', val)
          },
          // depositAmount(val) {
          //   // let depositVal = (val * 100 / (this.gauge.balance / 1e18)) || 0
          //   // this.depositSlider = (Math.min(depositVal, 100)).toFixed(0)
          // },

          // withdrawAmount(val) {
          //   // let withdrawVal = (val * 100 / (this.gauge.gaugeBalance / 1e18)) || 0
          //   // this.withdrawSlider = (Math.min(withdrawVal, 100)).toFixed(0)
          // },
        },
        methods: {
          // FIXME:
          async onStake () {
            const { gauges, tokens } = store
            // this.alert('notice.approveOperationWarning', 'stake')

            if (!await tokens.bpt.hasValidAmount(gauges.bpt.mortgages.bpt.userStake.revised)) return false

            if (await tokens.bpt.hasApprove(gauges.bpt.mortgages.bpt.userStake.revised, currentContract.default_account, gauges.bpt.address)) {
              gauges.bpt.onStake(currentContract.default_account, this.inf_approval)
            } else {
              tokens.bpt.onApproveAmount(gauges.bpt.mortgages.bpt.userStake.revised, currentContract.default_account, gauges.bpt.address, this.inf_approval)
            }
          },
          async onRedemption () {
            store.gauges.bpt.onRedemption(currentContract.default_account, this.inf_approval)
          },
          async onHarvest () {
            store.gauges.bpt.onHarvest(currentContract.default_account)
          },

          // dfi
          // FIXME:
          async onDfiStake () {
            const { gauges, tokens } = store
            // this.alert('notice.approveOperationWarning', 'stake')

            if (!await tokens.iUSD_LPT.hasValidAmount(gauges.dfi.mortgages.iUSD_LPT.userStake.revised)) return false

            if (await tokens.iUSD_LPT.hasApprove(gauges.dfi.mortgages.iUSD_LPT.userStake.revised, currentContract.default_account, gauges.dfi.address)) {
              gauges.dfi.onStake(currentContract.default_account, this.inf_approval)
            } else {
              tokens.iUSD_LPT.onApproveAmount(gauges.dfi.mortgages.iUSD_LPT.userStake.revised, currentContract.default_account, gauges.dfi.address, this.inf_approval)
            }
          },
          async onDfiRedemption () {
            store.gauges.dfi.onRedemption(currentContract.default_account, this.inf_approval)
          },
          async onDfiHarvest () {
            store.gauges.dfi.onHarvest(currentContract.default_account)
          },

          // FIXME:
          async onDusdStake () {
            const { gauges, tokens } = store
            // this.alert('notice.approveOperationWarning', 'stake')

            if (!await tokens.dusd.hasValidAmount(gauges.dusd.mortgages.dusd.userStake.revised)) return false

            if (await tokens.dusd.hasApprove(gauges.dusd.mortgages.dusd.userStake.revised, currentContract.default_account, gauges.dusd.address)) {
              gauges.dusd.onStake(currentContract.default_account, this.inf_approval)
            } else {
              tokens.dusd.onApproveAmount(gauges.dusd.mortgages.dusd.userStake.revised, currentContract.default_account, gauges.dusd.address, this.inf_approval)
            }
          },
          async onDusdRedemption () {
            store.gauges.dusd.onRedemption(currentContract.default_account, this.inf_approval)
          },
          async onDusdHarvest () {
            store.gauges.dusd.onHarvest(currentContract.default_account)
          },
          async onDusdClaimRewards () {
            store.gauges.dusd.onClaimRewards(currentContract.default_account)
          },

          // FIXME:
          async onUsd5Stake () {
            const { gauges, tokens } = store
            // this.alert('notice.approveOperationWarning', 'stake')

            if (!await tokens.usd5.hasValidAmount(gauges.usd5.mortgages.usd5.userStake.revised)) return false

            if (await tokens.usd5.hasApprove(gauges.usd5.mortgages.usd5.userStake.revised, currentContract.default_account, gauges.usd5.address)) {
              gauges.usd5.onStake(currentContract.default_account, this.inf_approval)
            } else {
              tokens.usd5.onApproveAmount(gauges.usd5.mortgages.usd5.userStake.revised, currentContract.default_account, gauges.usd5.address, this.inf_approval)
            }
          },
          async onUsd5Redemption () {
            store.gauges.usd5.onRedemption(currentContract.default_account, this.inf_approval)
          },
          async onUsd5Harvest () {
            store.gauges.usd5.onHarvest(currentContract.default_account)
          },

          async mounted() {
            this.currentPool.gauge = process.env.VUE_APP_PSS_GAUGE

            await gaugeStore.getState()

            this.loadingAction = false

            this.pools = gaugeStore.state.pools
            this.mypools = gaugeStore.state.mypools
            this.claimFromGauges = this.myGauges

            let btcPrice = await getBTCPrice()

            let total = this.mypools.reduce((a,b,i) => {
              let balance = +b.gaugeBalance
              if(['ren','sbtc'].includes(this.mypools[i].name))
                balance *= btcPrice
              return +a + balance
            }, 0)

            let piedata = this.mypools.map(pool => {
              let balance = pool.gaugeBalance
              if(['ren','sbtc'].includes(pool.name))
                balance = pool.gaugeBalance * btcPrice
              return {
                name: pool.name,
                y: total == 0 ? 0 : balance / total
              }
            })
            piedata = piedata.filter(pool => pool.y > 0)

            let gaugeSum = Object.values(gaugeStore.state.pools).reduce((a,b) => +a + +b.gauge_relative_weight, 0)
            let piegauges = Object.values(gaugeStore.state.pools).map(v => ({ name: v.name, y: v.gauge_relative_weight / gaugeSum}))

            let highest = piegauges.map(data=>data.y).indexOf(Math.max(...piegauges.map(data => data.y)))
            piegauges[highest].sliced = true;
            piegauges[highest].selected = true;

            // susdv2
            store.tokens.susdv2LpToken.getBalanceOf(this.currentPool.balanceOf, currentContract.default_account)

            const { crv, snx, sfg } = this.currentPool.tokens

            // TODO: temp
            this.gaugeContract = store.gauges.susdv2.contract

            store.gauges.susdv2.rewards.sfg.weighting.handled = 0.05

            store.gauges.susdv2.getAPY(
              store.tokens.sfg.getPrice(),
              store.tokens.sfg.getDailyYield(),
              store.gauges.susdv2.getTotalSupply(this.currentPool.totalSupply),
              store.tokens.susdv2LpToken.getPrice(),
            )

            store.gauges.susdv2.getBalanceOf(this.currentPool.gaugeBalance, currentContract.default_account)

            store.gauges.susdv2.getSfgTotalReward(
              sfg.totalReward,
              store.gauges.susdv2.getSfgPendingReward(sfg.pendingReward, currentContract.default_account),
              store.gauges.susdv2.getSfgPaidReward(sfg.paidReward, currentContract.default_account)
            )

            store.gauges.susdv2.getCrvTotalReward(
              crv.totalReward,
              store.gauges.susdv2.getCrvPendingReward(crv.pendingReward, currentContract.default_account),
              store.gauges.susdv2.getCrvPaidReward(crv.paidReward, currentContract.default_account)
            )

            store.gauges.susdv2.getSnxTotalReward(
              snx.totalReward,
              store.gauges.susdv2.getSnxPendingReward(snx.pendingReward, currentContract.default_account),
              store.gauges.susdv2.getSnxPaidReward(snx.paidReward, currentContract.default_account)
            )

            const { dfi, bpt, dusd, okuu, usd5 } = store.gauges

            // dusd
            store.gauges.dusd.rewards.sfg.weighting.handled = 0.1

            store.gauges.dusd.getAPY(
              store.tokens.sfg.getPrice(),
              store.tokens.sfg.getDailyYield(),
              dusd.getTotalStaking(dusd.mortgages.dusd.totalStaking),
              store.tokens.dusd.getPrice(),
              store.tokens.df.getPrice(),
            )

            store.tokens.dusd.getBalanceOf(dusd.mortgages.dusd.userBalanceOf, currentContract.default_account)

            dusd.getBalanceOf(dusd.mortgages.dusd.userStaking, currentContract.default_account)

            dusd.getUserTotalReward_SFG(
              dusd.rewards.sfg.userTotalReward,
              dusd.getUserPendingReward_SFG(dusd.rewards.sfg.userPendingReward, currentContract.default_account),
              dusd.getUserPaidReward_SFG(dusd.rewards.sfg.userPaidReward, currentContract.default_account)
            )

            dusd.getUserTotalReward_DF(
              dusd.rewards.df.userTotalReward,
              dusd.getUserPendingReward_DF(dusd.rewards.df.userPendingReward, currentContract.default_account),
              dusd.getUserPaidReward_DF(dusd.rewards.df.userPaidReward, currentContract.default_account)
            )

            // dfi
            store.gauges.dfi.rewards.sfg.weighting.handled = 0.15

            store.gauges.dfi.getAPY(
              store.tokens.sfg.getPrice(),
              store.tokens.sfg.getDailyYield(),
              dfi.getTotalStaking(dfi.mortgages.iUSD_LPT.totalStaking),
              store.tokens.iUSD_LPT.getPrice(),
            )

            store.tokens.iUSD_LPT.getBalanceOf(dfi.mortgages.iUSD_LPT.userBalanceOf, currentContract.default_account)

            dfi.getBalanceOf(dfi.mortgages.iUSD_LPT.userStaking, currentContract.default_account)

            dfi.getUserTotalReward_SFG(
              dfi.rewards.sfg.userTotalReward,
              dfi.getUserPendingReward_SFG(dfi.rewards.sfg.userPendingReward, currentContract.default_account),
              dfi.getUserPaidReward_SFG(dfi.rewards.sfg.userPaidReward, currentContract.default_account)
            )

            // okuu
            // store.gauges.okuu.rewards.sfg.weighting.handled = 0

            // store.gauges.okuu.getAPY(
            //   store.tokens.sfg.getPrice(),
            //   store.tokens.sfg.getDailyYield(),
            //   okuu.getTotalStaking(okuu.mortgages.okuu.totalStaking),
            //   store.tokens.okuu.getPrice(),
            // )

            // store.tokens.okuu.getBalanceOf(okuu.mortgages.okuu.userBalanceOf, currentContract.default_account)

            // okuu.getBalanceOf(okuu.mortgages.okuu.userStaking, currentContract.default_account)

            // okuu.getUserTotalReward_SFG(
            //   okuu.rewards.sfg.userTotalReward,
            //   okuu.getUserPendingReward_SFG(okuu.rewards.sfg.userPendingReward, currentContract.default_account),
            //   okuu.getUserPaidReward_SFG(okuu.rewards.sfg.userPaidReward, currentContract.default_account)
            // )

            // usd5
            store.gauges.usd5.rewards.sfg.weighting.handled = 0.3

            store.gauges.usd5.getAPY(
              store.tokens.sfg.getPrice(),
              store.tokens.sfg.getDailyYield(),
              usd5.getTotalStaking(usd5.mortgages.usd5.totalStaking),
              store.tokens.usd5.getPrice(),
            )

            store.tokens.usd5.getBalanceOf(usd5.mortgages.usd5.userBalanceOf, currentContract.default_account)

            usd5.getBalanceOf(usd5.mortgages.usd5.userStaking, currentContract.default_account)

            usd5.getUserTotalReward_SFG(
              usd5.rewards.sfg.userTotalReward,
              usd5.getUserPendingReward_SFG(usd5.rewards.sfg.userPendingReward, currentContract.default_account),
              usd5.getUserPaidReward_SFG(usd5.rewards.sfg.userPaidReward, currentContract.default_account)
            )

            // bpt
            store.gauges.bpt.rewards.sfg.weighting.handled = 0.4

            store.gauges.bpt.getAPY(
              store.tokens.sfg.getPrice(),
              store.tokens.sfg.getDailyYield(),
              bpt.getTotalStaking(bpt.mortgages.bpt.totalStaking),
              store.tokens.bpt.getPrice(),
            )

            store.tokens.bpt.getBalanceOf(bpt.mortgages.bpt.userBalanceOf, currentContract.default_account)

            bpt.getBalanceOf(bpt.mortgages.bpt.userStaking, currentContract.default_account)

            bpt.getUserTotalReward_SFG(
              bpt.rewards.sfg.userTotalReward,
              bpt.getUserPendingReward_SFG(bpt.rewards.sfg.userPendingReward, currentContract.default_account),
              bpt.getUserPaidReward_SFG(bpt.rewards.sfg.userPaidReward, currentContract.default_account)
            )
          },
          countDownChanged(val) {
            this.dismissCountDown = val
          },
          alert(msg = '', targetId = '') {
            this.dismissCountDown = this.dismissSecs
            this.waitingMessage = this.$i18n.t(msg)
            this.waitingMessageTargetId = targetId
          },
          getTokenIcon(token) {
            return helpers.getTokenIcon(token, false, '')
          },
          toFixed(num) {
            if(num == '' || num == undefined || +num == 0) return '0.00'
            if(!BN.isBigNumber(num)) num = +num
            return num.toFixed(2)
          },

          async deposit () {
            let deposit = BN(this.currentPool.deposit.amount).times(1e18)

            await common.approveAmount(
              store.tokens.susdv2LpToken.contract,
              deposit,
              currentContract.default_account,
              this.currentPool.gauge,
              this.inf_approval)

            var { dismiss } = notifyNotification(`Please confirm depositing into ${this.currentPool.name} gauge`)

            await this.gaugeContract.methods.deposit(deposit.toFixed(0,1)).send({
              from: currentContract.default_account,
              // gasPrice: this.gasPriceWei,
              // gas: this.currentPool.deposit.gas,
              gas: 1200000
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
          },

          async withdraw () {
            this.alert('notice.syntetixAnomalous', 'withdraw')

            let withdraw = BN(this.currentPool.withdraw.amount).times(1e18)
            let balance = BN(await this.gaugeContract.methods.balanceOf(currentContract.default_account).call())

            console.log('withdraw', withdraw, 'balance', balance)

            if(withdraw.gt(balance))
              withdraw = balance

            let gas = this.currentPool.deposit.gas
            let withdrawMethod = this.gaugeContract.methods.withdraw(withdraw.toFixed(0,1))

            try {
              // update
              gas = await withdrawMethod.estimateGas()
            }
            catch(err) { }

            var { dismiss } = notifyNotification(`Please confirm withdrawing from ${this.currentPool.name} gauge`)

            await withdrawMethod.send({
              from: currentContract.default_account,
              // gasPrice: this.gasPriceWei,
              // gas: gas * 1.5 | 0,
              gas: 1200000
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
          },

          async claim () {
            this.alert('notice.syntetixAnomalous' , 'claim')

            const mint = await gaugeStore.state.minter.methods.mint(this.currentPool.gauge)
            // let gas = await mint.estimateGas()

            var { dismiss } = notifyNotification(`Please confirm claiming ${this.currentPool.tokens.sfg.name} from ${this.currentPool.name} gauge`)

            await mint.send({
              from: currentContract.default_account,
              // gasPrice: this.gasPriceWei,
              // gas: gas * 1.5 | 0,
              gas: 1200000
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
          },

          async claimRewards () {
            this.alert('notice.syntetixAnomalous', 'claimRewards')

            // let gas = await this.gaugeContract.methods.claim_rewards(currentContract.default_account).estimateGas()

            var { dismiss } = notifyNotification(`Please confirm claiming ${this.currentPool.tokens.crv.name + ' ' + this.currentPool.tokens.snx.name}`)

            await this.gaugeContract.methods.claim_rewards(currentContract.default_account).send({
              from: currentContract.default_account,
              // gasPrice: this.gasPriceWei,
              // gas: gas * 1.5 | 0,
              gas: 1200000
            })
            .once('transactionHash', hash => {
              dismiss()
              notifyHandler(hash)
            })
          },
        }
  }
</script>

<style>
  .area {
    background: rgba(255,255,255,0.3);
    border: 1px solid #dadedf;
    border-radius: 2px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .area:last-child {
    margin-bottom: 0px;
  }
  .area > .row > .col {
    border-right: 1px solid rgba(0,0,0,0.08);
  }
  .area > .row > .col:last-child {
    border-right-width: 0px;
  }
</style>
