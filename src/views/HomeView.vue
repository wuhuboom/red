<template>
  <div>
    <p style="padding: 16px; text-align: center">提交提现订单</p>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="150px"
      size="small"
    >
      <el-form-item label="金额" prop="amount">
        <el-input
          v-model.trim="form.amount"
          placeholder="请输入金额"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="nameSurname">
        <el-input
          v-model.trim="form.nameSurname"
          placeholder="请输入用户姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model.trim="form.username"
          placeholder="请输入用户名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="币种" prop="fundType">
        <el-select
          v-model.trim="form.fundType"
          placeholder="请选择币种"
          clearable
        >
          <el-option label="CNY" value="CNY"></el-option>
          <el-option label="TRY" value="TRY"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单信息" prop="orderInfo">
        <el-input
          v-model.trim="form.orderInfo"
          placeholder="请输入订单信息"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收款人名称" prop="receiptAccountName">
        <el-input
          v-model.trim="form.receiptAccountName"
          placeholder="请输入收款人名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收款人账号" prop="receiptAccountNo">
        <el-input
          v-model.trim="form.receiptAccountNo"
          placeholder="请输入收款人账号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收款账户类型" prop="receiptAccountType">
        <el-select
          v-model.trim="form.receiptAccountType"
          placeholder="请选择收款账户类型"
          clearable
        >
          <el-option label="个人账户" value="private"></el-option>
          <el-option label="对公账户" value="public"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="银行编码" prop="bankId">
        <el-input
          v-model.trim="form.bankId"
          placeholder="请输入银行编码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收款账户开户行名称" prop="bankName">
        <el-input
          v-model.trim="form.bankName"
          placeholder="请输入收款账户开户行名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收款人账户联行号" prop="bankType">
        <el-input
          v-model.trim="form.bankType"
          placeholder="请输入收款人账户联行号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="证件号" prop="identity">
        <el-input
          v-model.trim="form.identity"
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
import qs from "qs";
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
            pattern: /^(0|[1-9]\d*)(\.\d{2})?$/,
            message: "金额必须为数字，整数或保留两位小数",
            trigger: "blur",
          },
        ],
        nameSurname: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          {
            min: 3,
            max: 128,
            message: "用户姓名长度在 3 到 128 个字符",
            trigger: "blur",
          },
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 1,
            max: 16,
            message: "用户名长度在 1 到 16 个字符",
            trigger: "blur",
          },
        ],
        fundType: [{ required: true, message: "请选择币种", trigger: "blur" }],
        orderInfo: [
          { required: true, message: "请输入订单信息", trigger: "blur" },
          {
            min: 1,
            max: 2048,
            message: "订单信息长度在 1 到 2048 个字符",
            trigger: "blur",
          },
        ],
        receiptAccountName: [
          { required: true, message: "请输入收款人名称", trigger: "blur" },
          {
            min: 1,
            max: 64,
            message: "收款人名称长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        receiptAccountNo: [
          { required: true, message: "请输入收款人账号", trigger: "blur" },
          {
            min: 1,
            max: 102,
            message: "收款人账号长度在 1 到 102 个字符",
            trigger: "blur",
          },
        ],
        receiptAccountType: [
          { required: true, message: "请选择收款账户类型", trigger: "blur" },
        ],
        bankId: [
          { required: true, message: "请输入银行编码", trigger: "blur" },
          {
            min: 1,
            max: 32,
            message: "银行编码长度在 1 到 32 个字符",
            trigger: "blur",
          },
        ],
        bankName: [
          {
            required: true,
            message: "请输入收款账户开户行名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 32,
            message: "收款账户开户行名称长度在 1 到 32 个字符",
            trigger: "blur",
          },
        ],
        bankType: [
          {
            required: true,
            message: "请输入收款人账户联行号",
            trigger: "blur",
          },
          {
            min: 1,
            max: 32,
            message: "收款人账户联行号长度在 1 到 32 个字符",
            trigger: "blur",
          },
        ],
        birthday: [{ required: true, message: "请选择日期", trigger: "blur" }],
        identity: [
          { required: true, message: "请输入证件号", trigger: "blur" },
          {
            min: 1,
            max: 32,
            message: "证件号长度在 1 到 32 个字符",
            trigger: "blur",
          },
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
      const hash = CryptoJS.HmacSHA256(concatenatedString, "");
      const signature = hash.toString(CryptoJS.enc.Hex);

      return signature;
    },
    vaidForm() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve(valid);
          } else {
            resolve(false);
          }
        });
      });
    },
    async submitForm(formName) {
      const status = await this.vaidForm();
      console.log("表单验证结果:", status);
      if (!status) {
        return;
      }
      // 准备请求参数
      const withdrawalData = {
        ...this.form,
      };

      // 生成签名
      const signature = this.generateSignature(withdrawalData);
      console.log("签名:", signature);
      // 构造请求数据
      const requestData = {
        ...withdrawalData,
        signature: signature, // 将签名添加到请求数据中
      };
      const formData = qs.stringify(requestData);
      console.log("请求数据:", formData);
      // 发送 POST 请求
      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("提交结果:", response.data);
      // 提交成功后清空表单数据
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style>
/* 可以在这里添加样式 */
</style>
