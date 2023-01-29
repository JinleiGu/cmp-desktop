<template>
  <el-dialog title="个人信息" :visible.sync="visible" width="600px" @close="cancel" :close-on-click-modal="false">
    <cmp-form :model="userData" ref="userForm">
      <el-row :gutter="5">
        <el-col :span="14">
          <el-col :span="24">
            <cmp-form-item label="登录账号：">
              <el-input v-model="userData.account" disabled></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="用户姓名：" prop="name" validate="required">
              <el-input v-model="userData.name"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span ='24'>
            <cmp-form-item label="用户性别：" prop="sex">
              <el-radio v-model="userData.sex" :label="true">男</el-radio>
              <el-radio v-model="userData.sex" :label="false">女</el-radio>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="用户邮箱：" prop="email" validate="email">
              <el-input v-model="userData.email"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="手机号码：" prop="mobile" validate="required,mobile">
              <el-input v-model="userData.mobile"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="出生日期：" prop="birthday">
              <el-date-picker
              v-model="userData.birthday"
              type="date"
              placeholder="选择日期">
              </el-date-picker>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="身份证号：" prop="idNumber" validate="idNumber">
              <el-input v-model="userData.idNumber"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="工作地址：">
              <el-input v-model="userData.workAddress"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="工作短号：">
              <el-input v-model="userData.shortPhone"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="工作号码：">
              <el-input v-model="userData.workPhone"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="备用邮箱：" prop="secondaryEmail" validate="email">
              <el-input v-model="userData.secondaryEmail"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item>
              <el-button type="primary" @click="editSubmit">更新信息</el-button>
            </cmp-form-item>
          </el-col>
        </el-col>
        <el-col :span="10">
          <div class="info-img">
            <img :src="userData.portrait" alt="">
          </div>
          <div class="info-btn">
            <el-button icon="el-icon-upload2" @click="imageCropperShow = true">更换头像</el-button>
          </div>
        </el-col>
      </el-row>
    </cmp-form>
    <image-cropper field="files"
                   @crop-success="imageCropSuccess"
                   v-if="imageCropperShow"
                   v-model="imageCropperShow"
                   :width="size"
                   :height="size"
                   img-format="png"></image-cropper>
  </el-dialog>
</template>
<script>
import ImageCropper from 'component/image-cropper'
import { editUser } from 'api/user'
import { getTenant } from 'api/organization'
export default {
  components: {
    ImageCropper
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      imageCropperShow: false,
      maindepartList: [],
      size: 65
    }
  },
  computed: {
    userData () {
      return this.$store.state.user.userData;
    }
  },
  created () {
    this.userData.portrait = this.userData.portrait || '/static/img/avatar_default.png'
    this.visible = this.dialogVisible
  },
  methods: {
    imageCropSuccess (imageDataUrl) {
      this.userData.portrait = imageDataUrl
    },
    editSubmit () {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          editUser(this.userData.id, { params: JSON.stringify(this.userData) }).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.cancel(true)
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    cancel (isUpdate) {
      this.$emit('close', isUpdate)
    }
  }
}
</script>
<style>
  .info-header-title {
    padding-left: 10px;
    border-left: 3px solid #2d8cf0;
    margin-bottom: 20px;
  }
  .info-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin: 90px 0px 20px 100px;
    border: 1px solid #d9d9d9;
    margin-top: 40px;
  }

  .info-img img {
    width: 100%;
    height: 100%;
  }

  .info-btn {
    margin: 0px 0px 0px 100px;
  }
</style>
