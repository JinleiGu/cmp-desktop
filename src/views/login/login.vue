<template>
  <div class="login-container">
    <el-form :model="loginForm" ref="loginForm"
             label-position="left"
             label-width="0px"
             class="card-box login-form" @keyup.enter.native="handleLogin" status-icon>
      <div class="form-container">
        <el-row class="title-container" :gutter="8">
          <el-col :span="24">
            <img src="/static/img/login/sip.png" alt="" >
          </el-col>
        </el-row>
        <cmp-form-item prop="account" validate="required" required-message="请输入登录账户">
          <span class="svg-container"><Icon type="icon-wo"/></span>
          <el-input name="email" type="text" v-model="loginForm.account" autoComplete="on"
                    placeholder="登录账户"></el-input>
        </cmp-form-item>
        <cmp-form-item prop="password" validate="required" required-message="请输入密码">
          <span class="svg-container"><Icon type="icon-mima"/></span>
          <el-input name="password" v-model="loginForm.password" placeholder="密码" show-password></el-input>
        </cmp-form-item>
        <!-- <cmp-form-item prop="code" validate="required" required-message="请输入验证码">
          <span class="svg-container"><Icon type="icon-shouquan"/></span>
          <el-input name="code" type="text" v-model="loginForm.code" placeholder="验证码"></el-input>
          <img class="code-style" @click="getCode" :src="verifyCode" alt="" >
        </cmp-form-item> -->
        <el-checkbox v-model="remember" class="m-b-sm text-white">记住密码</el-checkbox>
        <el-link class="pull-right" type="primary" :underline="false" @click="retrievePwd">忘记密码</el-link>
        <el-col :span="24" style="margin-bottom: 10px">
          <el-button type="primary" class="w-full" :loading="loading" @click="handleLogin()">
            登录
          </el-button>
        </el-col>
      </div>
    </el-form>
    <retrievePwd v-if="retrievePwdDialog.visible" :dialog="retrievePwdDialog"></retrievePwd>
  </div>
</template>

<script>
import crypto from '@/utils/crypto'
import retrievePwd from './retrievePwd'
import { getCode } from 'api/index'
export default {
  components: {
    retrievePwd
  },
  data () {
    return {
      loginForm: {
        account: '',
        password: '',
        code: ''
      },
      verifyCode: '',
      retrievePwdDialog: {},
      remember: false,
      loading: false
    }
  },
  created () {
    const local = localStorage.getItem('omdLoginData')
    if (local) {
      const obj = JSON.parse(local)
      this.loginForm.account = obj.account
      this.loginForm.password = crypto.decrypt(obj.password)
      this.remember = true
    }
    this.getCode()
  },
  methods: {
    getCode () {
      this.verifyCode = 'api/soc/v1/captcha?' + new Date().getTime()
      this.loginForm.code = ''
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let params = {
            account: this.loginForm.account,
            password: crypto.encrypt(this.loginForm.password)
            // code: this.loginForm.code
          }
          this.$store.dispatch('user/login', params)
            .then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                if (this.remember) {
                  localStorage.setItem('omdLoginData', JSON.stringify(params))
                } else {
                  localStorage.removeItem('omdLoginData');
                }
                this.$router.push('/')
                this.loading = false
              } else {
                this.getCode()
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    retrievePwd () {
      this.retrievePwdDialog = {
        account: this.loginForm.account,
        visible: true
      }
    }
  }
}
</script>

<style>
  .login-container {
    height: 100vh;
    background: url("/static/img/login/background.jpg") #2d3a4b no-repeat;
    background-size: cover;
  }

  input:-webkit-autofill {
    -webkit-text-fill-color: #000 !important;
    transition: background-color 5000s ease-in-out 0s
  }

  .login-container .el-input {
    display: inline-block;
    height: 30px;
    width: calc(100% - 43px);
  }

  .login-container input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 2px 5px 2px 15px;
    color: #000;
    height: 47px;
  }

  .form-container {
    width: 280px;
    margin: 60px auto;
  }

  .title-center {
    color: #eeeeee;
    /* float: left; */
    padding: 6px 10px;
    /* text-align: center; */
  }

  .svg-container {
    display: inline-block;
    padding: 1px 5px 1px 15px;
    color: #889aa4;
  }
  /* 修改图标颜色 */
  .svg-container i {
    display: inline-block;
    width: 13px;
  }

  .title-container {
    font-size: 18px;
    padding: 10px 0;
    text-align: center;
  }

  .title-text {
    color: #eeeeee;
    float: left;
    padding: 6px 10px;
    /*width: calc(100% - 100px);*/
    border-left: 2px solid #eee;
  }

  .login-form {
    position: absolute;
    top: calc(20%);
    background: url("/static/img/login/denglukuang.png");
    background-size: 100% 100%;
    left: calc(65%);
    width: 356px;
    height: 400px;
    border-radius: 10px;
  }

  .login-container .el-form-item {
    border: 1px solid rgba(128,128,128, 0.75);
    background: rgba(238,238,238, 0.75);
    border-radius: 5px;
    color: #454545;
  }

  .login-container .code-style {
    position: absolute;
    width: 95px;
    top: 6px;
    right: 10px;
    cursor: pointer;
  }

</style>
