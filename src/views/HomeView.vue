<template>
  <div>
    <p style="padding: 16px; text-align: center">提交提现订单</p>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="120px"
      size="small"
    >
      <el-form-item label="金额" prop="amount">
        <el-input
          v-model="form.amount"
          placeholder="请输入金额"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="nameSurname">
        <el-input
          v-model="form.nameSurname"
          placeholder="请输入用户姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="币种" prop="fundType">
        <el-input
          v-model="form.fundType"
          placeholder="请输入币种"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收款人名称" prop="receiptAccountName">
        <el-input
          v-model="form.receiptAccountName"
          placeholder="请输入收款人名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收款人账号" prop="receiptAccountNo">
        <el-input
          v-model="form.receiptAccountNo"
          placeholder="请输入收款人账号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收款账户类型" prop="receiptAccountType">
        <el-select
          v-model="form.receiptAccountType"
          placeholder="请选择收款账户类型"
          clearable
        >
          <el-option label="个人账户" value="private"></el-option>
          <el-option label="对公账户" value="public"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="银行编码" prop="bankId">
        <el-input
          v-model="form.bankId"
          placeholder="请输入银行编码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收款账户开户行名称" prop="bankName">
        <el-input
          v-model="form.bankName"
          placeholder="请输入收款账户开户行名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收款人账户联行号" prop="bankType">
        <el-input
          v-model="form.bankType"
          placeholder="请输入收款人账户联行号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-input
          v-model="form.birthday"
          placeholder="请输入生日"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="证件号" prop="identity">
        <el-input
          v-model="form.identity"
          placeholder="请输入证件号"
          clearable
        ></el-input>
      </el-form-item>
      <!-- 其他参数根据接口要求添加 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')"
          >提交订单</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import CryptoJS from "crypto-js";

export default {
  data() {
    return {
      apiUrl: "/api/payment/withdraw",
      token: "your_token_here", // 替换成实际的token
      form: {
        amount: "",
        nameSurname: "",
        username: "",
        fundType: "",
        orderInfo: "",
        receiptAccountName: "",
        receiptAccountNo: "",
        receiptAccountType: "",
        bankId: "",
        bankName: "",
        bankType: "",
        birthday: "",
        identity: "",
      },
      rules: {
        amount: [
          { required: true, message: "请输入金额", trigger: "blur" },
          {
            pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
            message: "金额必须为数字，最多保留两位小数",
            trigger: "blur",
          },
        ],
        nameSurname: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
        ],
        username: [
          { required: false, message: "请输入用户名", trigger: "blur" },
        ],
        fundType: [{ required: true, message: "请输入币种", trigger: "blur" }],
        receiptAccountName: [
          { required: true, message: "请输入收款人名称", trigger: "blur" },
        ],
        receiptAccountNo: [
          { required: true, message: "请输入收款人账号", trigger: "blur" },
        ],
        receiptAccountType: [
          { required: true, message: "请选择收款账户类型", trigger: "blur" },
        ],
        bankId: [
          { required: true, message: "请输入银行编码", trigger: "blur" },
        ],
        bankName: [
          {
            required: false,
            message: "请输入收款账户开户行名称",
            trigger: "blur",
          },
        ],
        bankType: [
          {
            required: false,
            message: "请输入收款人账户联行号",
            trigger: "blur",
          },
        ],
        birthday: [{ required: false, message: "请输入生日", trigger: "blur" }],
        identity: [
          { required: false, message: "请输入证件号", trigger: "blur" },
        ],
        // 其他参数的验证规则根据接口要求添加
      },
    };
  },
  methods: {
    generateSignature(data) {
      // 按照签名规则构造待签名字符串
      const sortedKeys = Object.keys(data).sort();
      let concatenatedString = sortedKeys
        .map((key) => `${key}=${data[key]}`)
        .join("&");
      concatenatedString += this.token;

      // 使用 SHA-256 计算签名
      const hash = CryptoJS.HmacSHA256(concatenatedString);
      const signature = hash.toString(CryptoJS.enc.Hex);

      return signature;
    },
    async submitForm(formName) {
      try {
        await this.$refs[formName].validate();

        // 准备请求参数
        const withdrawalData = {
          amount: this.form.amount,
          nameSurname: this.form.nameSurname,
          username: this.form.username,
          fundType: this.form.fundType,
          orderInfo: this.form.orderInfo,
          receiptAccountName: this.form.receiptAccountName,
          receiptAccountNo: this.form.receiptAccountNo,
          receiptAccountType: this.form.receiptAccountType,
          bankId: this.form.bankId,
          bankName: this.form.bankName,
          bankType: this.form.bankType,
          birthday: this.form.birthday,
          identity: this.form.identity,
          // 其他参数根据接口要求添加
        };

        // 生成签名
        const signature = this.generateSignature(withdrawalData);

        // 构造请求数据
        const requestData = {
          ...withdrawalData,
          sign: signature, // 将签名添加到请求数据中
        };

        // 发送 POST 请求
        const response = await axios.post(this.apiUrl, requestData);
        console.log("提交提现订单成功:", response.data);

        // 提交成功后清空表单数据
        this.$refs[formName].resetFields();
      } catch (error) {
        //, error.response.data
        console.error("提交提现订单失败:");
      }
    },
  },
};
</script>

<style>
/* 可以在这里添加样式 */
</style>
