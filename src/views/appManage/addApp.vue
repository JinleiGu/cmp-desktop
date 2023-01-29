<template>
  <el-dialog
    :title="title"
    :visible.sync="config.visible"
    :close-on-click-modal="false"
    :before-close='cancel'
    width="45%">
    <cmp-form ref="addData" :model="addData">
      <el-row :gutter="10">
        <el-col :span="24">
          <cmp-form-item label="应用名称" prop="name" validate="required">
            <el-input v-model="addData.name"></el-input>
          </cmp-form-item>
        </el-col>
        <el-col :span="24">
          <cmp-form-item label="应用编码" prop="code" validate="required">
            <el-input v-model="addData.code" auto-complete="off"></el-input>
          </cmp-form-item>
        </el-col>
        <el-col :span="24">
          <cmp-form-item label="应用URL" prop="url" validate="required" maxlength="128">
            <el-input v-model="addData.url" auto-complete="off"></el-input>
          </cmp-form-item>
        </el-col>
        <el-col :span="24">
          <cmp-form-item label="默认路径" prop="redirect" maxlength="128">
              <el-input v-model="addData.redirect" auto-complete="off"></el-input>
          </cmp-form-item>
        </el-col>
        <el-col :span="24">
          <cmp-form-item label="排序序号" prop="priority">
              <el-input-number :control="false" v-model="addData.priority" auto-complete="off"></el-input-number>
          </cmp-form-item>
        </el-col>
        <el-col :span="24">
          <cmp-form-item label="应用图标">
            <img @click="handleicon()" class="model-icon" :src="addData.icon || '/static/img/default_cmdb.png'" alt="">
          </cmp-form-item>
        </el-col>
        <el-col :span="24">
          <cmp-form-item label="获取角色" prop="api" maxlength="128">
            <el-input v-model="addData.api"></el-input>
          </cmp-form-item>
        </el-col>
        <el-col :span="24">
          <cmp-form-item label="应用描述" prop="remark">
            <el-input v-model="addData.remark" type="textarea"></el-input>
          </cmp-form-item>
        </el-col>
      </el-row>
    </cmp-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancel()">取 消</el-button>
        <el-button type="primary" @click.native="submit()">确 定</el-button>
    </span>
    <!-- 图标弹出框 -->
    <el-dialog
      title="选择图标"
      :visible.sync="iconVisible"
      :before-close='cancelIcon'
      width="50%"
      append-to-body>
      <el-row>
        <el-col :span="24">
            <el-alert
              title="提示"
              type="success"
              :closable="false"
              >
              <slot>
                <span>没有您喜欢的图标，可以尝试上传一个新的图标。</span>
                <el-button size="mini" type="primary" @click="toggleShow">上传</el-button>
              </slot>
            </el-alert>
        </el-col>
        <my-upload field="files"
        v-model="show"
        :width="65"
        :height="65"
        :langExt='omd'
        url="api/cos/v1/icons"
        :params="uploadParams"
        @crop-upload-success="cropUploadSuccess"
        img-format="png"></my-upload>
        <el-col :span="24">
          <div class="icon-cell" v-for="item of iconData" :key="item.id" :class="{selected:item.checked}" @click="selectItem(item)">
            <img :src="item.icon">
            <i class="remove" v-show="!item.reserved" @click.stop="removeItem(item.id)">&times;</i>
            <span><i class="el-icon-check"></i></span>
          </div>
        </el-col>
        <el-col :span="24" class="m-t-sm">
          <el-pagination @size-change="handleSizeChange" @current-change="getIcon" :current-page.sync="params.page" :page-sizes="[5,10,20,30, 50]" :page-size="params.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelIcon()">取 消</el-button>
          <el-button type="primary" @click="saveIcon()">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import { editApp, addApp } from 'api/app'
import { pageIcon, deleteIcon } from 'api/icon'
export default {
  components: {
    myUpload
  },
  props: {
    config: {
      type: Object
    },
    addData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  created () {
    if (this.config.status == 'create') {
      this.title = '新增应用'
    } else {
      this.title = '编辑应用'
    }
  },
  data () {
    return {
      title: '',
      total: 0,
      show: false,
      checked: false,
      iconVisible: false,
      params: {
        page: 1,
        rows: 50,
        params: JSON.stringify([{ param: { category: 'APP' }, sign: 'EQ' }])
      },
      uploadParams: {
        category: 'APP'
      },
      iconData: [],
      currentIcon: {},
      validateUrl: [{
        required: true,
        message: '请输入内容',
        trigger: null
      }],
      omd: {
        hint: '点击，或拖动图片至此处',
        loading: '正在上传……',
        noSupported: '浏览器不支持该功能，请使用IE10以上或其他现在浏览器！',
        success: '上传成功',
        fail: '图片上传失败',
        preview: '预览',
        btn: {
          off: '取消',
          close: '关闭',
          back: '上一步',
          save: '保存'
        },
        error: {
          onlyImg: '仅限图片格式',
          outOfSize: '单文件大小不能超过 ',
          lowestPx: '图片最低像素为（宽*高）：'
        }
      }
    }
  },
  methods: {
    cancel () {
      this.config.visible = false
    },
    submit () {
      this.$refs.addData.validate(valid => {
        if (valid) {
          const http = this.config.status === 'update' ? editApp : addApp;
          http(this.addData).then(data => {
            if (data.success) {
              this.$message({
                message: data.message,
                type: 'success'
              });
              this.config.visible = false;
              this.$emit('close')
            }
          })
        }
      })
    },
    toggleShow () {
      this.show = !this.show;
    },
    // 上传成功
    cropUploadSuccess () {
      this.getIcon()
    },
    handleicon () {
      this.iconVisible = true
      this.currentCell = {
        icon: this.addData.icon
      }
      this.getIcon()
    },
    // 获得图标数据
    getIcon () {
      pageIcon(this.params).then(res => {
        if (res.success) {
          this.total = res.data.total
          this.iconData = res.data.rows
        }
        this.iconData.forEach(item => {
          if (item.icon === this.currentCell.icon) {
            this.$set(item, 'checked', true);
          }
        })
      })
    },
    handleSizeChange (val) {
      this.params.rows = val;
      this.getIcon()
    },
    // 选择图标
    selectItem (item) {
      if (item.checked) return
      this.iconData.forEach((row) => {
        this.$set(row, 'checked', false)
      })
      item.checked = true
      this.currentCell = item
    },
    // 删除图标
    removeItem (id) {
      this.$confirm('您确定要删除该图标吗?', '提示', {
        confirmButtonText: '删除',
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        deleteIcon(id).then(data => {
          this.$message({
            message: data.message,
            type: 'success'
          });
          if (data.success) {
            this.getIcon();
          }
        });
      });
    },
    cancelIcon () {
      this.iconVisible = false
      this.params.page = 1
      this.iconData = []
    },
    // 保存图标
    saveIcon () {
      if (!this.currentCell.id) return this.$message.error('请选择图标');
      this.addData.icon = this.currentCell.icon;
      this.iconVisible = false
      this.params.page = 1
      this.getIcon()
    }
  }
}
</script>

<style scoped>
.model-icon {
  width: 50px;
  height: 50px;
  cursor: pointer;
  margin-top: 5px;
}

div.icon-cell {
  position: relative;
  float: left;
  display: inline-block;
  width: 65px;
  height: 65px;
  border-radius: 10px;
  margin: 10px 10px 0 0;
  cursor: pointer;
}

div.icon-cell > span {
  display: none;
}

div.icon-cell.selected > span {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 65px;
  height: 65px;
  border: 1px dashed #8e7070;
  border-radius: 10px;
  line-height: 65px;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #fff;
}

div.icon-cell.selected i.el-icon-check {
  position: relative;
  left: 20px;
  top: 20px;
  color: #27c24c;
  font-size: 20px;
  font-weight: bold;
}

i.remove {
  display: none;
}

div.icon-cell:hover > i.remove {
  display: inline-block;
  position: absolute;
  top: -11px;
  right: -8px;
  color: #fff;
  text-align: center;
  background: rgba(0, 0, 0, 0.64);
  border-radius: 8px;
  font-size: 20px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  padding: -2px;
}

div.icon-cell img {
  width: 100%;
}
</style>
