<template>
  <el-dialog title="修改密码" :visible.sync="visible" width="400px" :close-on-click-modal="false">
    <cmp-form :model="updateData" ref="updatePasswordForm">
      <cmp-form-item label="原密码：" prop="oldPassword" validate="required" :rule="rules.oldPassword" maxlength="18">
        <el-input placeholder="请输入原密码"
          type="password"
          name="oldPassword"
          class="form-control"
          v-model="updateData.oldPassword"
        ></el-input>
      </cmp-form-item>
      <cmp-form-item label="新密码：" prop="newPassword" validate="required" :rule="rules.newPassword" maxlength="18">
        <el-input placeholder="请输入新密码"
          type="password"
          name="oldPassword"
          class="form-control"
          v-model="updateData.newPassword"
        ></el-input>
      </cmp-form-item>
      <cmp-form-item validate="required"
        label="确认密码："
        prop="confirmPassword"
        :rule="rules.confirmPassword"
        maxlength="18"
      >
        <el-input
          placeholder="请再次输入新密码"
          type="password"
          name="oldPassword"
          class="form-control"
          v-model="updateData.confirmPassword"
        ></el-input>
      </cmp-form-item>
    </cmp-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="cancel">取消</el-button>
      <el-button class="btn btn-primary" @click.native="ok">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editPwd } from 'api/user'
import crypto from '@/utils/crypto'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.visible = this.dialogVisible;
  },
  watch: {
    visible () {
      if (!this.visible) this.$emit('close');
    }
  },
  data () {
    let checkOldPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入原密码'));
      } else {
        callback()
      }
    }
    let checkNewPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入新密码'));
      } else if (this.updateData.oldPassword === value) {
        callback(new Error('新密码不能与原密码相同'));
      } else {
        callback();
      }
    }
    let checkConfirmPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入确认密码'));
      } else if (this.updateData.newPassword === value) {
        callback();
      } else {
        callback(new Error('两次输入的密码不一致'));
      }
    }
    return {
      visible: false,
      updateData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{ validator: checkOldPassword, trigger: 'blur' }],
        newPassword: [{ validator: checkNewPassword, trigger: null }],
        confirmPassword: [{ validator: checkConfirmPassword, trigger: null }]
      }
    };
  },
  computed: {
    userData () {
      return JSON.parse(localStorage.getItem('userData')) || {};
    }
  },
  methods: {
    ok () {
      this.$refs.updatePasswordForm.validate(valid => {
        if (valid) {
          let updateData = {
            oldPassword: crypto.encrypt(this.updateData.oldPassword),
            password: crypto.encrypt(this.updateData.newPassword)
          }
          editPwd(this.userData.id, { params: JSON.stringify(updateData) }).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.$router.replace({ name: 'Login' })
            }
          })
        }
      })
    },
    cancel () {
      this.$emit('close');
    }
  }
};
</script>

<style lang="sass" scoped>

</style>
