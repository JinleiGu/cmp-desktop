<template>
  <el-dialog
  title="找回密码"
  :visible.sync="dialog.visible"
  :close-on-click-modal="false"
  width="700px">
    <el-steps :active="active" align-center class="m-b">
      <el-step title="账号确认"></el-step>
      <el-step title="重置密码"></el-step>
      <el-step title="重置成功"></el-step>
    </el-steps>
  <div class="PwdForm">
    <el-form :rules="rules" :model="retrieveData" v-if="active==0" ref="step0" label-width="150px">
      <el-row>
        <el-col :span="16">
          <el-form-item label="登录账户" prop="account">
            <el-input v-model="retrieveData.account"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="验证码" prop="identifyCode">
            <el-input placeholder="请输入邮箱验证码" v-model="retrieveData.identifyCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button plain :disabled="flag" @click="getAuthCode">{{msg}}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-form :model="retrieveData" v-if="active==1" ref="step1" label-width="150px">
      <el-row :gutter="10">
        <el-col :span="24">
          <cmp-form-item label="新密码" prop="password" validate="required">
            <el-input name="password" v-model="retrieveData.password" auto-complete="off" show-password></el-input>
          </cmp-form-item>
        </el-col>
        <el-col :span="24">
          <cmp-form-item label="确认密码" prop="password" validate="required">
            <el-input name="password" v-model="retrieveData.checkpassword"  auto-complete="off" show-password></el-input>
          </cmp-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form :model="retrieveData" v-if="active==2" ref="step2" label-width="150px">
      <h2 class="success_title"><span class="svg-wrapper"><i class="el-icon-check"></i></span>密码重置成功</h2>
    </el-form>
  </div>
  <div slot="footer" class="dialog-footer" v-if="active==0">
    <el-button type="ghost" @click.native="dialog.visible = false">取消</el-button>
    <el-button type="primary" @click="next(0)">下一步</el-button>
  </div>
  <div slot="footer" class="dialog-footer" v-if="active==1">
    <el-button type="ghost" @click="goback(1)">上一步</el-button>
    <el-button type="primary" @click="next(1)" :loading="loading">下一步</el-button>
  </div>
  <div slot="footer" class="dialog-footer" v-if="active==2">
    <el-button type="primary"  @click.native="dialog.visible = false">完成</el-button>
  </div>
  </el-dialog>
</template>

<script>
import crypto from '@/utils/crypto'
import { resetPwd, getidentifyCode, checkidentifyCode } from 'api/user'
export default {
  props: {
    dialog: {
      type: Object
    }
  },
  data () {
    return {
      active: 0,
      msg: '获取验证码',
      loading: false,
      flag: false,
      retrieveData: {
        account: undefined,
        identifyCode: undefined,
        password: undefined,
        checkpassword: undefined
      },
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        identifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.retrieveData.account = this.dialog.account || undefined
  },
  methods: {
    next (active) {
      switch (active) {
        case 0:
          this.$refs.step0.validate(valid => {
            if (valid) {
              checkidentifyCode({
                account: this.retrieveData.account,
                code: this.retrieveData.identifyCode
              }).then(res => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.active = 1
                }
              })
            }
          })
          break
        case 1:
          this.loading = true
          this.$refs.step1.validate(valid => {
            if (valid && this.checkPassword()) {
              resetPwd({
                account: this.retrieveData.account,
                code: this.retrieveData.identifyCode,
                password: crypto.encrypt(this.retrieveData.password)
              }).then(res => {
                if (res.success) {
                  this.active = 2
                }
              }).finally(() => {
                this.loading = false
              })
            }
          })
          break
      }
    },
    goback (active) {
      --this.active
    },
    checkPassword () {
      if (this.retrieveData.checkpassword !== this.retrieveData.password) {
        this.$message({
          message: '确认密码与新密码不一致',
          type: 'error'
        })
        return false
      }
      return true
    },
    getAuthCode () {
      this.$refs.step0.validateField('account', accountError => {
        if (!accountError) {
          getidentifyCode({
            condition: 'queryByAccount',
            account: this.retrieveData.account
          }).then(res => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              const _this = this
              this.flag = true
              var time = 60
              var timer = null
              timer = setInterval(() => {
                if (time == 0) {
                  _this.msg = '重新获取验证码'
                  _this.flag = false
                  clearInterval(timer)
                } else {
                  _this.msg = time + '秒后重新获取'
                  time--
                }
              }, 1000)
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
  .PwdForm .el-form-item {
    border: none;
    background: #fff;
  }
  .PwdForm .el-input {
    border: 1px solid #dcdfe6;
  }
  .success_title {
    font-weight: 400;
    margin-bottom: 40px;
    color: #333;
    font-size: 30px;
    line-height: 3;
    text-align: center
  }
</style>
