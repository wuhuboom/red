<template>
  <div>
    <h2>提交提现订单</h2>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      size="small"
    >
      <el-form-item label="金额" prop="amount">
        <el-input
          v-model="form.amount"
          placeholder="请输入金额"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="nameSurname">
        <el-input
          v-model="form.nameSurname"
          placeholder="请输入姓名"
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
        <el-input
          v-model="form.receiptAccountType"
          placeholder="请输入收款账户类型"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="银行编码" prop="bankId">
        <el-input
          v-model="form.bankId"
          placeholder="请输入银行编码"
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
import { ElMessage } from "element-ui";

export default {
  data() {
    return {
      apiUrl: "/api/payment/withdraw",
      token: "your_token_here", // 替换成实际的token
      secretKey: "your_secret_key_here", // 替换成实际的secret key
      form: {
        amount: "",
        nameSurname: "",
        username: "",
        fundType: "",
        receiptAccountName: "",
        receiptAccountNo: "",
        receiptAccountType: "",
        bankId: "",
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
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        fundType: [{ required: true, message: "请输入币种", trigger: "blur" }],
        receiptAccountName: [
          { required: true, message: "请输入收款人名称", trigger: "blur" },
        ],
        receiptAccountNo: [
          { required: true, message: "请输入收款人账号", trigger: "blur" },
        ],
        receiptAccountType: [
          { required: true, message: "请输入收款账户类型", trigger: "blur" },
        ],
        bankId: [
          { required: true, message: "请输入银行编码", trigger: "blur" },
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
      const hash = CryptoJS.HmacSHA256(concatenatedString, this.secretKey);
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
          receiptAccountName: this.form.receiptAccountName,
          receiptAccountNo: this.form.receiptAccountNo,
          receiptAccountType: this.form.receiptAccountType,
          bankId: this.form.bankId,
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
        ElMessage.success("提交提现订单成功");

        // 提交成功后清空表单数据
        this.$refs[formName].resetFields();
      } catch (error) {
        console.error("提交提现订单失败:", error.response.data);
        ElMessage.error("提交提现订单失败");
      }
    },
  },
};
</script>

<style>
/* 这里是你的样式 */
</style>
