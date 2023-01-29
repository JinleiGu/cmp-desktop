<template>
  <div class="wrapper-sm custom-scrollbar">
    <el-card v-show="!detailComponent.visible">
    <!-- 搜索框 -->
    <div class="search">
      <el-form inline :model="listQuery" ref="searchForm">
        <el-form-item label="用户姓名：">
          <el-input v-model="listQuery.name" placeholder="用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="登录账号：">
          <el-input v-model="listQuery.account" placeholder="登录账号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：">
          <el-input v-model="listQuery.idNumber" placeholder="身份证号"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input type="text" v-model="listQuery.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <cmp-form-item label="所属单位：" prop="deptId">
          <el-cascader
            popper-class='select'
            v-model="listQuery.deptId"
            :options="departList3"
            :show-all-levels="false"
            :props="{checkStrictly: true, value: 'id', label: 'name', children: 'children'}"
            @visible-change="elCascaderOnlick"
            @expand-change="elCascaderOnlick"
            clearable
            filterable>
            </el-cascader>
        </cmp-form-item>
        <el-form-item label="工作状态：">
          <el-select v-model="listQuery.state" placeholder="请选择工作状态" clearable>
            <el-option v-for="(item, index) in stateData" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型：">
          <el-select v-model="listQuery.origin" placeholder="请选择账号类型" clearable>
            <el-option v-for="(item, index) in originData" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态：">
          <el-select v-model="listQuery.status" placeholder="请选择账号状态" clearable>
            <el-option v-for="(item, index) in statusData" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="handleSearch()">查询</el-button>
          <el-button plain icon="el-icon-refresh" @click="reset()">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate()">新增</el-button>
          <el-button type="warning" icon="el-icon-user" @click="handleSync()">全量同步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <basic-table :data="datalist" :params="params" :get-list="getData" :total="total">
      <el-table-column label="登录账号" prop="account" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="detail-href" @click="getDetail(scope.row.id)">{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属单位" prop="departments" min-width="210px" show-overflow-tooltip>
        <template slot-scope="scope">
          <ul>
            <li style="list-style-type:none;" v-for="(item, key) in scope.row.departments" :key ="key">
              <Icon type=" icon-tuopu" />
              {{item.fullName}}<span class="m-l" style="background: #003366;color: white;border-radius: 4px;padding: 2px;" v-show="item.main">主要</span>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          {{sex(scope.row.sex)}}
        </template>
      </el-table-column>
      <el-table-column label="联系方式" prop="mobile" show-overflow-tooltip>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="状态">
        <template slot-scope="scope">
          <status-icon :color="cnUser(scope.row.status, 'color')">
            {{cnUser(scope.row.status)}}
          </status-icon>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="账号类型">
        <template slot-scope="scope">
          {{origin(scope.row.origin)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleCreate(scope.row)" :disabled="scope.row.status === 'LOGOUT'"><i class="el-icon-edit"></i> 编辑</el-button>
          <div class="action-divider"></div>
          <el-button type="text" @click="handleDelete(scope.row.id)" :disabled="scope.row.status !== 'LOGOUT'"><i class="el-icon-delete"></i> 删除</el-button>
          <div class="action-divider"></div>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.status !=='LOGOUT'" @click.native="handleGrant(scope.row.id)">
                <Icon type="icon-quanxian"></Icon>
                授权
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status =='NORMAL'" @click.native="handleReset(scope.row.id)">
                <Icon type="icon-zhongzuo"></Icon>
                重置密码
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status =='NORMAL'" @click.native="handleLogout(scope.row.id)">
                <Icon type="icon-mima"></Icon>
                注销
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status =='NORMAL'" @click.native="handleFreeze(scope.row.id)">
                <Icon type="icon-dongjie"></Icon>
                冻结
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status =='ABNORMAL'" @click.native="handleNormal(scope.row.id)">
                <Icon type="icon-jiedong"></Icon>
                解冻
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </basic-table>
    <!--新增编辑用户弹窗-->
    <el-dialog
    :title="textMap[dialogStatus]"
    :before-close='cancel'
    :close-on-click-modal="false"
    v-if="addDialogVisible"
    :visible.sync="addDialogVisible"
    width="65%">
      <cmp-form :model="addData" ref="addData" label-width="110px">
        <el-row>
          <el-col :span="24" class="m-b">
            <el-alert type="warning" show-icon :closable="false" description="请检查当前创建用户是否已在统一用户内, 登录账号登录时需要加上前缀sip_"></el-alert>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="用户姓名：" prop="name" validate="required">
              <el-input v-model="addData.name" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="登录账号：" prop="account" validate="required">
              <el-input :disabled="dialogStatus==='update'" v-model="addData.account" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="用户性别：" prop="sex">
              <el-radio v-model="addData.sex" :label="true">男</el-radio>
              <el-radio v-model="addData.sex" :label="false">女</el-radio>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="电子邮箱：" prop="email" validate="email">
              <el-input v-model="addData.email" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="手机号码：" prop="mobile" validate="required,mobile">
              <el-input v-model="addData.mobile" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="身份证号：" prop="idNumber" validate="idNumber">
              <el-input v-model="addData.idNumber" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12" v-if="!addData.id">
            <cmp-form-item label="登录密码：" prop="password" validate="required,password">
              <el-input name="password" v-model="addData.password" auto-complete="off" show-password></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12" v-if="!addData.id">
            <cmp-form-item label="确认密码：" prop="confirmPassword" validate="required">
              <el-input name="password" v-model="addData.confirmPassword" auto-complete="off" show-password></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="出生日期：" prop="birthday">
              <el-date-picker
              v-model="addData.birthday"
              type="date"
              style="width: 100%;"
              placeholder="选择日期">
              </el-date-picker>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="工作地址：" prop="workAddress" >
              <el-input v-model="addData.workAddress" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="工作短号：" prop="shortPhone">
              <el-input v-model="addData.shortPhone" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="工作号码：" prop="workPhone">
              <el-input v-model="addData.workPhone" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="账号类型：" prop="origin">
              <el-input v-model="filterorigin" auto-complete="off" disabled></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="12">
            <cmp-form-item label="备用邮箱：" prop="secondaryEmail" validate="email">
              <el-input v-model="addData.secondaryEmail" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="所属角色：">
              <el-radio v-model="isProvider" :label="false">局办用户</el-radio>
              <el-radio v-model="isProvider" :label="true">供应商用户</el-radio>
            </cmp-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!isProvider">
          <el-col :span="24">
            <cmp-form-item label="主要单位：" prop="mainDepartId" validate="required">
              <el-cascader
                popper-class='select'
                v-model="addData.mainDepartId"
                :options="departList2"
                :props="{ emitPath: false, checkStrictly: true, value: 'id', label: 'name', children: 'children'}"
                @visible-change="elCascaderOnlick"
                @expand-change="elCascaderOnlick"
                clearable
                filterable
                @change="handleDepartIds">
                </el-cascader>
            </cmp-form-item>
          </el-col>
          <el-col :span="24">
            <cmp-form-item label="附属单位：" prop="departmentIds">
              <el-cascader
              v-model="addData.departmentIds"
              :options="departList"
              :props="{ emitPath: false, multiple: true, checkStrictly: true,  value: 'id', label: 'name', children: 'children'}"
              clearable
              :disabled = "isMain"
              filterable></el-cascader>
            </cmp-form-item>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="24">
            <cmp-form-item label="供应商：" prop="ownerId" validate="required">
              <el-select v-model="addData.ownerId" filterable clearable placeholder="请选择">
                <el-option v-for="(item, key) in providerList" :key="key" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </cmp-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <cmp-form-item label="用户描述：" prop="remark">
              <el-input type="textarea" v-model="addData.remark" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
        </el-row>
      </cmp-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="ghost" @click.native="cancel">取消</el-button>
        <el-button type="primary" @click.native="submit">提交</el-button>
      </div>
    </el-dialog>
    <!--重置密码-->
    <el-dialog title="重置密码" :visible.sync="resetDialogVisible" width="35%">
      <cmp-form :model="resetData" ref="resetForm">
        <el-row>
          <el-col :span="24">
            <cmp-form-item label="登录密码：" prop="password" validate="required">
              <el-input v-model="resetData.password" auto-complete="off" show-password></el-input>
            </cmp-form-item>
          </el-col>
        </el-row>
      </cmp-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="resetDialogVisible = false">取消</el-button>
        <el-button type="primary" @click.native="resetSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!--用户授权应用弹窗-->
    <AuthDialog v-if="authDialog.visible" :dialog="authDialog"></AuthDialog>
    </el-card>
    <!-- 用户详情 -->
    <UserDetail v-if="detailComponent.visible" :config="detailComponent"></UserDetail>
  </div>
</template>

<script>
import { encrypt, decrypt } from '@/utils/crypto'
import { pageUser, addUser, showUser, editUser, deleteUser, editStatus, syncUser, resetPwd2 } from 'api/user'
import { getTenant } from 'api/organization'
import { getProvider } from 'api/provider'
import AuthDialog from './authDialog'
import UserDetail from './userDetail'
export default {
  components: {
    AuthDialog,
    UserDetail
  },
  data () {
    return {
      total: null,
      isMain: true,
      listQuery: {
        name: undefined,
        account: undefined,
        sex: undefined,
        deptId: [],
        idNumber: undefined,
        mobile: undefined,
        state: undefined,
        origin: undefined,
        status: undefined
      },
      stateData: [
        { label: '在职', value: 'working' },
        { label: '退休', value: 'retire' }
      ],
      originData: [
        { label: '系统用户', value: 'System' },
        { label: '统一用户', value: 'Unite' }
      ],
      statusData: [
        { label: '正常', value: 'NORMAL' },
        { label: '冻结', value: 'ABNORMAL' },
        { label: '注销', value: 'LOGOUT' }
      ],
      datalist: [],
      // 附属单位数据源
      departList: [],
      // 主要单位数据源
      departList2: [],
      // 搜索栏的单位数据源
      departList3: [],
      providerList: [],
      params: {
        page: 1,
        rows: 10
      },
      tempId: '',
      isProvider: true,
      addDialogVisible: false,
      resetDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '创建用户'
      },
      // 新增界面数据
      addData: {},
      resetData: {},
      authDialog: {},
      detailComponent: {}
    }
  },
  created () {
    this.getData()
    this.getDepartData()
    this.getProviderData()
  },

  computed: {
    filterorigin () {
      let obj = {
        System: '系统用户',
        Unite: '统一用户'
      }
      return obj[this.addData.origin]
    }
  },
  watch: {
    'addData.mainDepartId': {
      handler: function () {
        if (!this.addData.mainDepartId) {
          this.isMain = true
          if (this.addData.departmentIds.length !== 0) {
            this.addData.departmentIds = []
            this.$message.warning('请输入主要单位')
          }
        } else {
          this.isMain = false
        }
      },
      deep: true
    }
  },
  methods: {
    getData () {
      pageUser(this.params).then(res => {
        if (res.success) {
          this.total = res.data.total
          this.datalist = res.data.rows
        }
      })
    },
    getDepartData () {
      // getTenant({
      //   condition: JSON.stringify({ isTree: true, condition: 'listTopOrganization' })
      // }).then(res => {
      //   if (res.success) {
      //     this.maindepartList = res.data
      //   }
      // })
      getTenant({
        condition: JSON.stringify({ isTree: true, condition: 'listDepartment' })
      }).then(res => {
        if (res.success) {
          this.departList = res.data
          this.departList.forEach(item => {
            if (item.type === 'category') {
              this.$set(item, 'disabled', true)
            }
          })
          this.departList2 = JSON.parse(JSON.stringify(this.departList))
          this.departList3 = JSON.parse(JSON.stringify(this.departList))
        }
      })
    },
    getProviderData () {
      getProvider({
        page: 1,
        rows: 999
      }).then(data => {
        if (data.success) {
          this.providerList = data.data.rows
        }
      })
    },
    checkPassword () {
      if (this.addData.confirmPassword !== this.addData.password) {
        this.$message({
          message: '确认密码与新密码不一致',
          type: 'error'
        })
        return false
      }
      return true
    },
    elCascaderOnlick () {
      let that = this;
      setTimeout(function () {
        document.querySelectorAll('.el-cascader-node__label').forEach(el => {
          el.onclick = function () {
            this.previousElementSibling.click();
          };
        });
      }, 100);
    },
    sex (value) {
      let obj = {
        true: '男',
        false: '女'
      }
      return obj[value]
    },
    origin (value) {
      let obj = {
        System: '系统用户',
        Unite: '统一用户'
      }
      return obj[value]
    },
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
    getDetail (id) {
      this.detailComponent = {
        id: id,
        visible: true
      }
    },
    // 查询用户
    handleSearch () {
      this.$refs.searchForm.validate(valid => {
        if (valid) {
          this.params.page = 1
          this.params.params = this.$tools.formatSearchParam({
            lkParam: {
              name: this.listQuery.name,
              account: this.listQuery.account,
              sex: this.listQuery.sex,
              idNumber: this.listQuery.idNumber,
              mobile: this.listQuery.mobile
            },
            eqParam: {
              deptId: this.listQuery.deptId.length ? JSON.stringify(this.listQuery.deptId[this.listQuery.deptId.length - 1]) : undefined,
              state: this.listQuery.state,
              origin: this.listQuery.origin,
              status: this.listQuery.status
            }
          })
          this.getData()
        }
      })
    },
    // 重置
    reset () {
      this.listQuery = {
        name: undefined,
        account: undefined,
        sex: undefined,
        deptId: [],
        idNumber: undefined,
        mobile: undefined,
        state: undefined,
        origin: undefined,
        status: undefined
      }
      this.handleSearch()
    },
    handleCreate (data) {
      if (data) {
        this.tempId = data.id
        showUser(data.id).then(res => {
          if (res.success) {
            this.addData = res.data
            if (!this.addData.departIds) {
              this.addData.departIds = []
            } else {
              this.addData.departIds = JSON.parse(this.addData.departIds)
            }
            // 判断是单位部门还是供应商
            if (this.addData.ownerId) {
              this.isProvider = true
            } else {
              this.isProvider = false
            }
            this.fun3(this.addData.mainDepart, this.departList)
            if (this.addData.mainDepartId) {
              this.setDisabled(this.addData.mainDepartId)
            }
            this.dialogStatus = 'update'
            this.addDialogVisible = true
          }
        })
      } else {
        this.addData = { departmentIds: [] }
        this.dialogStatus = 'create'
        this.addDialogVisible = true
      }
    },
    handleReset (id) {
      this.resetDialogVisible = true
      this.resetData = { id }
    },
    resetSubmit () {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          const { id, password } = this.resetData
          resetPwd2(id, {
            params: JSON.stringify({ password: encrypt(password) })
          }).then(data => {
            if (data.success) {
              this.resetDialogVisible = false
              this.$message({
                message: data.message,
                type: 'success'
              })
            }
          })
        }
      })
    },
    handleSync () {
      this.$confirm('全量同步操作风险高，确定要进行全量同步吗', '提示', {
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        syncUser().then(res => {
          if (res.success) {
            this.$message.success({
              message: res.message,
              type: 'success'
            })
            this.getData()
          }
        })
      }).catch(() => {
      })
    },
    handleDelete (id) {
      this.$confirm('您确定要删除该用户吗?', '提示', {
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(res => {
          if (res.success) {
            this.$message.success({
              message: res.message,
              type: 'success'
            })
            this.getData()
          }
        })
      }).catch(() => {
      })
    },
    handleFreeze (id) {
      this.$confirm('您确定要冻结该用户吗?', '提示', {
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        editStatus(id, { status: 'ABNORMAL' }).then(res => {
          if (res.success) {
            this.$message.success({
              message: res.message,
              type: 'success'
            })
            this.getData()
          }
        })
      }).catch(() => {
      })
    },
    handleNormal (id) {
      this.$confirm('您确定要解冻该用户吗?', '提示', {
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        editStatus(id, { status: 'NORMAL' }).then(res => {
          if (res.success) {
            this.$message.success({
              message: res.message,
              type: 'success'
            })
            this.getData()
          }
        })
      }).catch(() => {
      })
    },
    handleLogout (id) {
      this.$confirm('您确定要注销该用户吗?', '提示', {
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        editStatus(id, { status: 'LOGOUT' }).then(res => {
          if (res.success) {
            this.$message.success({
              message: res.message,
              type: 'success'
            })
            this.getData()
          }
        })
      }).catch(() => {
      })
    },
    handleGrant (id) {
      this.authDialog = {
        id: id,
        visible: true
      }
    },
    // 找到上级单位的id
    convert (id) {
      let mainDepart
      let options = this.departList
      fun(options)
      function fun (childrenArr) {
        for (let item of childrenArr) {
          if (item.id === id) {
            if (item.type === 'topOrganization') {
              mainDepart = item.id
              return
            } else {
              id = item.parentId
              fun(options)
            }
          } else if (item.children && item.children.length > 0) {
            fun(item.children)
          }
        }
      }
      return mainDepart
    },
    handleDepartIds (val) {
      if (val) {
        this.addData.departmentIds = []
      }
      const id = this.convert(val)
      this.setDisabled(id)
    },
    // 设置附属单位不可选
    setDisabled (id) {
      let options = JSON.parse(JSON.stringify(this.departList2))
      this.fun1(id, options)
      this.departList = options
    },
    fun1 (id, childrenArr) {
      for (let item of childrenArr) {
        if (item.id === id) {
          item.disabled = true
          if (item.children && item.children.length > 0) {
            this.fun2(item.children)
          }
        }
        if (item.children && item.children.length > 0) {
          this.fun1(id, item.children)
        }
      }
    },
    fun2 (childrenArr) {
      childrenArr.forEach(item => {
        this.$set(item, 'disabled', true)
        if (item.children && item.children.length > 0) {
          this.fun2(item.children)
        }
      })
    },
    fun3 (id, childrenArr) {
      childrenArr.forEach(item => {
        if (item.id === id) {
          this.fun4(item)
        } else {
          if (item.children && item.children.length > 0) {
            this.fun3(id, item.children)
          }
        }
      })
    },
    fun4 (data) {
      if (this.addData.departIds.includes(data.id)) {
        const index = this.addData.departIds.indexOf(data.id)
        this.addData.departIds.splice(index, 1)
        this.$set(this.addData, 'mainDepartId', data.id)
        this.$set(this.addData, 'departmentIds', this.addData.departIds)
      } else {
        if (data.children && data.children.length > 0) {
          for (let i = 0; i < data.children.length; i++) {
            this.fun4(data.children[i])
          }
        }
      }
    },
    submit () {
      if (this.dialogStatus === 'create') {
        this.$refs.addData.validate((valid) => {
          if (valid && this.checkPassword()) {
            const filterAdd = {
              account: this.addData.account,
              name: this.addData.name,
              sex: this.addData.sex,
              email: this.addData.email,
              mobile: this.addData.mobile,
              idNumber: this.addData.idNumber,
              password: encrypt(this.addData.password),
              birthday: this.addData.birthday,
              workAddress: this.addData.workAddress,
              shortPhone: this.addData.shortPhone,
              workPhone: this.addData.workPhone,
              origin: this.addData.origin,
              secondaryEmail: this.addData.secondaryEmail,
              remark: this.addData.remark
            }
            if (this.isProvider === true) {
              filterAdd.ownerId = this.addData.ownerId
              filterAdd.mainDepart = null
              filterAdd.departIds = []
            } else {
              filterAdd.ownerId = null
              filterAdd.mainDepart = this.convert(this.addData.mainDepartId)
              filterAdd.departIds = JSON.parse(JSON.stringify(this.addData.departmentIds))
              filterAdd.departIds.push(this.addData.mainDepartId)
            }
            addUser({ params: JSON.stringify(filterAdd) }).then(res => {
              if (res.success) {
                this.$notify({
                  message: res.message,
                  type: 'success'
                })
                this.addDialogVisible = false
                this.getData()
              }
            })
          }
        })
      } else {
        this.$refs.addData.validate(valid => {
          if (valid) {
            if (this.isProvider === true) {
              this.addData.mainDepart = null
              this.addData.departIds = []
            } else {
              this.addData.ownerId = null
              this.addData.mainDepart = this.convert(this.addData.mainDepartId)
              this.addData.departIds = JSON.parse(JSON.stringify(this.addData.departmentIds))
              this.addData.departIds.push(this.addData.mainDepartId)
            }
            editUser(this.tempId, { params: JSON.stringify(this.addData) }).then(res => {
              if (res.success) {
                this.$notify({
                  message: res.message,
                  type: 'success'
                })
                this.addDialogVisible = false
                this.getData()
              }
            })
          }
        })
      }
    },
    cancel () {
      this.addDialogVisible = false
      this.tempId = ''
    }
  }
}
</script>

<style lang="scss">
  .block {
    .el-cascader-panel .el-checkbox{
      width: 100%;
      height: 100%;
      z-index: 10;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .el-cascader-panel .el-radio{
      width: 100%;
      height: 100%;
      z-index: 10;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .el-cascader-panel .el-radio__input{
      visibility: hidden;
    }
    .el-cascader-panel .el-checkbox__input{
      visibility: hidden;
    }
    .el-cascader-panel .el-cascader-node__postfix{
      top: 10px;
    }
  }
  .select {
    .el-cascader-node {
      padding: 0;
    }
    .el-radio {
      visibility: hidden;
    }
  }
  .el-input--suffix .el-input__inner {
    padding-right: 15px !important
  }
  .time-picker  {
    width: 100% !important;
  }
  .i-checks input:checked + i:before {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #00aeef;
  }
  .wrapper-sm {
    background: #f5f7f9;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:100%;
  }
</style>
