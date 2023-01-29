<template>
  <el-card>
    <CommondDetail :setting="detailSetting" :data="addData"  @goBack="config.visible=false" :title="addData.name">
      <div class="attr" v-if="addData.provider===false">
        <span class="attr-name" >所属单位：</span>
        <span class="attr-value">
          <li style="list-style-type:none;" v-for="(item, key) in addData.departments" :key ="key">
            <Icon type=" icon-tuopu" />
            {{item.fullName}}<span class="m-l" style="background: #003366;color: white;border-radius: 4px;padding: 2px;" v-show="item.main">主要</span>
          </li>
        </span>
      </div>
      <div class="attr" v-if="addData.provider===true">
        <span class="attr-name" >所属供应商：</span>
        <span class="attr-value">{{addData.providerName}}</span>
      </div>
      <el-tabs value="auth">
        <el-tab-pane label="授权信息" name="auth">
          <basic-table :data="authList">
            <el-table-column show-overflow-tooltip label="应用图标" prop="appName">
              <template slot-scope="scope">
                <img style="width: 30px; height: 30px;" :src="scope.row.appIcon">
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="应用名称" prop="appName">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="授权角色" prop="roles">
              <template slot-scope="scope">
                <span v-for="item in scope.row.roles" :key="item.index">
                  {{item}}
                </span>
              </template>
            </el-table-column>
            <div slot="pagination"></div>
          </basic-table>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="operate">
          <basic-table :data="operateList" :params="operateParmas" :get-list="getOperate" :total="operateTotal">
            <el-table-column show-overflow-tooltip label="服务名称" prop="module">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="请求IP" prop="requestIp">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="响应IP" prop="responseIp">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="操作者" prop="account">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="请求对象" prop="object">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="操作" prop="action">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="请求时间" prop="gmtCreate">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="请求耗时(ms)" prop="cost">
            </el-table-column>
          </basic-table>
        </el-tab-pane>
        <el-tab-pane label="登录日志" name="login">
          <basic-table :data="loginList" :params="loginParams" :get-list="getLogin" :total="loginTotal">
            <el-table-column show-overflow-tooltip label="登录账号" prop="account">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="登录IP" prop="requestIp">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="响应地址" prop="responseIp">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="登录结果" prop="status">
              <template slot-scope="scope">
                {{scope.row.status == true ? '成功' : '失败'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="登录时间" prop="gmtCreate">
            </el-table-column>
          </basic-table>
        </el-tab-pane>
      </el-tabs>
    </CommondDetail>
  </el-card>
</template>
<script>
import { showUser, getTrack, pageUser } from 'api/user'
import { getLog } from 'api/log'
import { handleSearchParam } from 'utils'
import { generalStatusFilter, generalStateFilter, roleFilter, sexFilter, originFilter } from 'filters'
import CommondDetail from 'components/CommondDetail'
const detailSetting = {
  type: 'yonghu',
  columns: [
    [
      { name: '登录账号', value: 'account' },
      { name: '用户姓名', value: 'name' },
      { name: '用户性别', value: 'sex', filter: sexFilter }
    ],
    [
      { name: '用户状态', value: 'status', filter: generalStatusFilter, icon: generalStatusFilter },
      { name: '用户类型', value: 'origin', filter: originFilter },
      { name: '所属角色', value: 'provider', filter: roleFilter }
    ],
    [
      { name: '联系方式', value: 'mobile' },
      { name: '电子邮箱', value: 'email' },
      { name: '工作地址', value: 'workAddress' }
    ],
    [
      { name: '创建时间', value: 'gmtCreate' },
      { name: '工作状态', value: 'state', filter: generalStateFilter },
      { name: '用户描述', value: 'remark' }
    ]
  ]
}
export default {
  props: {
    config: {
      type: Object
    }
  },
  components: { CommondDetail },
  data () {
    return {
      detailSetting,
      addData: {},
      operateList: [],
      operateTotal: 0,
      operateParmas: {
        page: 1,
        rows: 10
      },
      loginList: [],
      loginTotal: 0,
      loginParams: {
        page: 1,
        rows: 10
      },
      authList: []
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    cnUser (value, type) {
      const cnUserData = {
        NORMAL: '正常',
        ABNORMAL: '已冻结',
        LOGOUT: '注销'
      }
      const colorMap = {
        ABNORMAL: 'danger',
        NORMAL: 'normal',
        LOGOUT: 'disabled'
      }
      return type == 'color' ? colorMap[value] : cnUserData[value]
    },
    getDetail () {
      showUser(this.config.id).then(res => {
        if (res.success) {
          this.addData = res.data
          this.getAuth()
          this.getLogin()
          this.getOperate()
        }
      })
    },
    getAuth () {
      pageUser({
        condition: JSON.stringify({ userId: this.config.id, condition: 'listUserApp' })
      }).then(data => {
        if (data.success) {
          this.authList = data.data
        }
      })
    },
    getOperate () {
      this.operateParmas.params = handleSearchParam({
        userId: this.addData.id
      })
      getLog(this.operateParmas).then(data => {
        if (data.success) {
          this.operateList = data.data.rows
          this.operateTotal = data.data.total
        }
      })
    },
    getLogin () {
      this.loginParams.params = handleSearchParam({
        account: this.addData.account
      })
      getTrack(this.loginParams).then(data => {
        if (data.success) {
          this.loginList = data.data.rows
          this.loginTotal = data.data.total
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.attr {
  font-size: 12px;
  margin-left: 120px;
  .attr-name {
    display: inline-block;
    white-space: nowrap;
    color: #999;
    width: 98px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .attr-value {
    display: inline-block;
    white-space: nowrap;
    width: calc(100% - 105px);
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
