import request from "@/plugins/request";
export default {
  authSysconfig() {
    return request({
      url: "/auth/sys_config",
    });
  },
  verifyCodeReq(
    params = {
      verifyKey: new Date().getTime(),
    }
  ) {
    return request({
      url: "/auth/verify_code",
      params,
    });
  },
  register(data) {
    return request({
      url: "/auth/regist",
      method: "post",
      data,
    });
  },
  login(data) {
    return request({
      url: "/auth/login",
      method: "post",
      data,
    });
  },
  userInfo() {
    return request({
      url: "/player_info",
    });
  },
  servTmpReq() {
    return request({
      url: "/home/serv_tmp",
    });
  },
  // 获取客服地址
  servReq() {
    return request({
      url: "/home/serv",
    });
  },
  homehot() {
    return request({
      url: "/home/hot",
    });
  },
  homeswiper(params) {
    return request({
      url: "/home/slider",
      params,
    });
  },
  playerGame(data) {
    return request({
      url: "/game",
      method: "post",
      data,
    });
  },
  gameDetail(params) {
    return request({
      url: "/game",
      params,
    });
  },
  betPre(data) {
    return request({
      url: "/bet/pre",
      method: "post",
      data,
    });
  },
  betOrder(data) {
    return request({
      url: "/bet",
      method: "post",
      data,
    });
  },
  listBetsToday(data) {
    return request({
      url: "/bets/today",
      method: "post",
      data,
    });
  },
  listBets(data) {
    return request({
      url: "/bets",
      method: "post",
      data,
    });
  },
  gameFinished(data) {
    return request({
      url: "/game/finished",
      method: "post",
      data,
    });
  },
  betInfo(params) {
    return request({
      url: "/betInfo",
      params,
    });
  },
  unbet(params) {
    return request({
      url: "/unbet",
      params,
    });
  },
  notice(params) {
    return request({
      url: "/home/notice",
      params,
    });
  },
  hasMsg() {
    return request({
      url: "/fb/msg/has",
    });
  },
  recharge() {
    return request({
      url: "/recharge_pre",
    });
  },
  rechargeOrder(data) {
    return request({
      url: "/recharge",
      method: "post",
      data,
    });
  },
  withdrawalPre() {
    return request({
      url: "/withdrawal_pre",
    });
  },
  homeVip() {
    return request({
      url: "/home/vip",
    });
  },
  safeInfo() {
    return request({
      url: "/safe/info",
    });
  },
  usdtListReq() {
    return request({
      url: "/virtual_currency_list",
      method: "post",
    });
  },
  withdrawalReq(data) {
    return request({
      url: "/withdrawal",
      method: "post",
      data,
    });
  },
  // 发送邮件验证码,用于绑定或者换绑邮箱地址 换绑发送验证码到原邮件地址
  emailCodeReq(data) {
    return request({
      url: "/mail/code",
      method: "post",
      data,
    });
  },
  mailCode() {
    return request({
      url: "/mail/code",
    });
  },
  // 获取手机验证码-登录状态(需手机号)
  phoneCodeReq(data) {
    return request({
      url: "/v2/phone_code",
      method: "post",
      data,
    });
  },
  // 获取手机验证码(无需手机号)
  phoneCode() {
    return request({
      url: "/v2/phone_code/online",
      method: "post",
    });
  },
  phoneBindReq(data) {
    return request({
      url: "/v2/phone_bind",
      method: "post",
      data,
    });
  },
  virtualCurrencyAdd(data) {
    return request({
      url: "/virtual_currency_add",
      method: "post",
      data,
    });
  },
  walletInfo() {
    return request({
      url: "/wallet_info",
    });
  },
  bankCardinfo() {
    return request({
      url: "/bank_card_info",
    });
  },
  walletTypeReq() {
    return request({
      url: "/wallet_type",
    });
  },
  walletReq(data) {
    return request({
      url: "/wallet",
      method: "post",
      data,
    });
  },
  banks() {
    return request({
      url: "/banks",
    });
  },
  bindBank(data) {
    return request({
      url: "/bind_bank_card",
      method: "post",
      data,
    });
  },
  detailSafeInfo() {
    return request({
      url: "/safe/info",
    });
  },
  safeTransfer(data) {
    return request({
      url: "/safe/transfer",
      method: "post",
      data,
    });
  },
  safeToBalance(data) {
    return request({
      url: "/safe/toBalance",
      method: "post",
      data,
    });
  },
  safeChangeLog(data) {
    return request({
      url: "/safe/changeLog",
      method: "post",
      data,
    });
  },
  getFaceRecognition(data) {
    return request({
      url: "/risk/secure3",
      method: "post",
      data,
    });
  },
  riskSecure2(data) {
    return request({
      url: "/risk/secure2",
      method: "post",
      data,
    });
  },
  riskSecure6(data) {
    return request({
      url: "/risk/secure6",
      method: "post",
      data,
    });
  },
  appUrl(params) {
    return request({
      url: "/home/app_url",
      params,
    });
  },
  appCount(params) {
    return request({
      url: "/home/app_url_count",
      params,
    });
  },
  dataCenter(data, index) {
    return request({
      url: `/data_center/${index}`,
      method: "post",
      data,
    });
  },
  rebateStatisReq(params) {
    return request({
      url: `/rebate_statis`,
      params,
    });
  },
  rebateListReq(data) {
    return request({
      url: "/rebate_list",
      method: "post",
      data,
    });
  },
  subPlayersReq(data) {
    return request({
      url: "/sub_players",
      method: "post",
      data,
    });
  },
  rechargeLogReq(data) {
    return request({
      url: "/recharge_log",
      method: "post",
      data,
    });
  },
  withdrawLogReq(data) {
    return request({
      url: "/withdrawal_log",
      method: "post",
      data,
    });
  },
  balanceChangeReq(data) {
    return request({
      url: "/balance_change",
      method: "post",
      data,
    });
  },
  setPwdPay(data) {
    return request({
      url: "/setPwdPay",
      method: "post",
      data,
    });
  },
  getPwdPay() {
    return request({
      url: "/getPwdPay",
    });
  },
  authEditPwd(data) {
    return request({
      url: "/auth/editPwd",
      method: "post",
      data,
    });
  },
  changePwdOnlineReq(data) {
    return request({
      url: "/v2/change_pwd_online",
      method: "post",
      data,
    });
  },
  emailBindReq(data) {
    return request({
      url: "/mail/bind",
      method: "post",
      data,
    });
  },
  // 修改提现密码
  editPwdPayReq(data) {
    return request({
      url: "/v2/change_pwd_pay",
      method: "post",
      data,
    });
  },
  // 修改提现密码
  editPwdPayNeedCodeReq(data) {
    return request({
      url: "/v2/phone_change_pwd_pay",
      method: "post",
      data,
    });
  },
  // 虚拟币修改
  usdtEditReq(data) {
    return request({
      url: "/virtual_currency_edit",
      method: "post",
      data,
    });
  },
  // 修改银行卡
  bindBankCardEditReq(data) {
    return request({
      url: "/bind_bank_card_edit",
      method: "post",
      data,
    });
  },
  // 提现-新类型修改钱包
  walletEditReq(data) {
    return request({
      url: "/wallet_edit",
      method: "post",
      data,
    });
  },
  fbConf() {
    return request({
      url: "/safe/conf",
    });
  },
  // 获取邮件验证码-未登录状态
  notLoginEmailChangePwd(data) {
    return request({
      url: "/mail/change_pwd",
      method: "post",
      data,
    });
  },
  // 获取手机验证码-未登录状态
  notLoginchangePwd(data) {
    return request({
      url: "/v2/phone_code/change_pwd",
      method: "post",
      data,
    });
  },
  // 修改登录密码(需短信验证码)
  phoneChangePwdReq(data) {
    return request({
      url: "/v2/phone_change_pwd",
      method: "post",
      data,
    });
  },
  ///safe/recharge_pre_mult
  rechargePreMult() {
    return request({
      url: "/safe/recharge_pre_mult",
    });
  },
  safeRecharge(data) {
    return request({
      url: "/safe/recharge",
      method: "post",
      data,
    });
  },
  palyerConfig() {
    return request({
      url: "/fb/conf",
    });
  },
  versionReq() {
    return request({
      url: "/home/version",
    });
  },
  fbInfo() {
    return request({
      url: "/fb/info",
    });
  },
  saleList(data) {
    return request({
      url: "/fb/sale_list",
      data,
      method: "post",
    });
  },
  fbMsgHasReq() {
    return request({
      url: "/fb/msg/has",
    });
  },
  fbSaleMe() {
    return request({
      url: "/fb/sale/me",
      method: "post",
    });
  },
  soldout(data) {
    return request({
      url: "/fb/soldout",
      method: "post",
      data,
    });
  },
  resale(data) {
    return request({
      url: "/fb/resale",
      method: "post",
      data,
    });
  },
  fbSaleReq(data) {
    return request({
      url: "/fb/sale",
      method: "post",
      data,
    });
  },
  fbSaleMerLimitrReq(data) {
    return request({
      url: "/fb/sale/limit",
      method: "post",
      data,
    });
  },
  fbInfoSalerReq(data) {
    return request({
      url: "/fb/info/saler",
      method: "post",
      data,
    });
  },
  fbBuyReq(data) {
    return request({
      url: "/fb/buy",
      method: "post",
      data,
    });
  },
  //购买-获取支付方式
  fbBuy1Req(data) {
    return request({
      url: "/fb/buy1",
      method: "post",
      data,
    });
  },
  // 交易列表详情
  fbSaleOrderDetailReq(data) {
    return request({
      url: "/fb/sale/order/detail",
      method: "post",
      data,
    });
  },
  //购买-选择支付方式
  fbBuy2Req(data) {
    return request({
      url: "/fb/buy2",
      method: "post",
      data,
    });
  },
  fbBuyPayedReq(data) {
    return request({
      url: "/fb/buy/payed",
      method: "post",
      data,
    });
  },
  fbBuyCancelReq(data) {
    return request({
      url: "/fb/buy/cancel",
      method: "post",
      data,
    });
  },
  // 会员交易列表
  fbSalePlayerOrderReq(data) {
    return request({
      url: "/fb/sale/player/order",
      method: "post",
      data,
    });
  },
  mailCodeRegReq(params) {
    return request({
      url: "/mail/code/reg",
      params,
    });
  },
  // 申请商户
  fbOpenReq(data) {
    return request({
      url: "/fb/open",
      method: "post",
      data,
    });
  },
  //充值准备
  fbRechargePreReq() {
    return request({
      url: "/fb/recharge_pre",
    });
  },
  //充值 minMax
  fbRechargeReq(data) {
    return request({
      url: "/fb/recharge",
      method: "post",
      data,
    });
  },
  //消息列表-商家
  fbMsgSalerReq(data) {
    return request({
      url: "/fb/msg/saler",
      method: "post",
      data,
    });
  },
};
