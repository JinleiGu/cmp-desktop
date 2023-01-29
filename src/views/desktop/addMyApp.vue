<template>
  <el-dialog v-if="dialog.visible" :title="title[source]" :close-on-click-modal="false" :visible.sync="dialog.visible"
    width="500px" append-to-body>
    <cmp-form :model="appData" name="addAppForm" ref="addAppForm">
      <cmp-form-item label="名称：" prop="name" validate="required" required-message="请输入应用名称">
        <el-input name="name" v-model="appData.name" placeholder="请输入应用名称" ></el-input>
      </cmp-form-item>
      <cmp-form-item label="地址：" prop="url" validate="required,webUrl" required-message="请输入应用地址" :maxlength="100">
        <el-input name="url" v-model="appData.url" placeholder="请输入应用地址"></el-input>
      </cmp-form-item>
      <cmp-form-item label="用户权限：" prop="roles" validate="required" required-message="请选择用户权限">
        <el-select style="width: 100%" v-model="appData.roles" multiple>
          <el-option v-for="item in datalist" :key="item.id" :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </cmp-form-item>
      <cmp-form-item label="图标名：" prop="iconContent" validate="required" required-message="请输入应用图标名">
        <el-row>
          <el-col :span="18"><el-input readonly v-model="appData.iconContent" placeholder="请输入应用图标名"></el-input></el-col>
          <el-col :span="4">
            <el-button type="ghost" @click="selectFile" style="margin-left:20px"> 浏览</el-button>
          </el-col>
        </el-row>
        <input ref="upload" type="file" class="ib-file" @change="uploadFile" v-show="false">
      </cmp-form-item>
      <cmp-form-item label="打开方式：" prop="current" validate="required" required-message="请选择打开方式">
        <el-radio-group v-model="appData.current">
          <el-radio :label="true">当前窗口</el-radio>
          <el-radio :label="false">新窗口</el-radio>
        </el-radio-group>
      </cmp-form-item>
      <cmp-form-item label="描述：">
        <el-input type="textarea" name="opinion" rows="2" class="form-control" v-model="appData.remark" placeholder="请输入应用描述"></el-input>
      </cmp-form-item>
    </cmp-form>
    <div slot="footer">
      <el-button type="success" @click="ok">确认</el-button>
      <el-button type="ghost" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Object
    },
    row: {
      type: Object
    }
  },
  mounted () {
    if (!this.row) {
      this.source = 'create';
      this.okUrl = '/app/create'
    } else {
      this.source = 'update';
      this.appData = {
        name: this.row.name,
        url: this.row.url,
        current: this.row.current,
        remark: this.row.remark,
        iconContent: this.row.icon,
        roles: []
      }
      this.roles = this.row.roles ? this.row.roles.split(',') : [];
      this.roles = this.roles.map(item => {
        return parseInt(item)
      })
      this.okUrl = '/app/modify'
    }
    this.isUpdate = !!this.row;
    this.getData(1);
  },
  data () {
    return {
      appData: {
        url: '',
        name: '',
        iconContent: '',
        current: true,
        remark: '',
        roles: []
      },
      isTr: false,
      isImageData: false,
      files: '',
      okUrl: '',
      source: 'create',
      title: { update: '编辑APP', create: '新增APP' },
      datalist: [],
      uploadFileRate: 0
    }
  },
  methods: {
    getData (page) {
      this.$http({
        url: '/role/list',
        method: 'POST',
        data: {
          page: page,
          rows: 1000
        },
        options: {
          noParam: true
        }
      }).then(data => {
        if (data.data && data.data.rows && data.data.rows.length != 0) {
          this.datalist = data.data.rows;
          this.appData.roles = this.roles || []
        }
      })
    },
    selectFile () {
      this.$refs.upload.click();
    },
    uploadFile (event) {
      event.stopPropagation();
      this.files = event.target.files;
      let tmp = {
        progress: 0,
        file: this.files[0],
        isUploading: false,
        isSuccess: false,
        isReady: false
      };
      this.$tools.uploadFile(tmp, this.uploadCallback, this.uploadErrorCallBack)
    },
    uploadCallback (data) {
      this.appData.iconContent = data.filePath
    },
    uploadErrorCallBack (data) {
    },
    ok () {
      this.$refs.addAppForm.validate(valid => {
        if (valid) {
          let param = {
            name: this.appData.name,
            icon: this.appData.iconContent,
            url: this.appData.url,
            roles: this.appData.roles.join(','),
            current: this.appData.current,
            remark: this.appData.remark
          }
          if (this.row) {
            param.id = this.row.id;
          }
          this.$http({
            url: this.okUrl,
            method: 'POST',
            asyn: true,
            data: param
          }).then(data => {
            if (data.success) {
              this.$message.success(data.message)
              this.$emit('updateMyApp', param)
              this.cancel();
            }
          })
        }
      })
    },
    cancel () {
      this.dialog.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>

.i-checks input:checked + i:before {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #00aeef;
}
</style>
