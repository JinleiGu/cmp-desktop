<template>
  <div class="wrapper-md">
    <div class="panel panel-default">
      <div class="search-box">
        <div class="legend">查询条件</div>
        <div class="search-content">
          <cmp-form style="margin: 10px">
            <el-row>
              <el-col :span="8">
                <cmp-form-item label="用户姓名：">
                  <el-select
                    v-model="username" filterable remote clearable
                    placeholder="请输入用户姓名" :remote-method="usersMethod" :loading="userLoading">
                    <el-option
                      v-for="item in userList"
                      :key="item.id"
                      :label="item.name+'('+item.username+')'"
                      :value="item.username">
                      <span>{{item.name}}({{item.username}})</span>
                    </el-option>
                  </el-select>
                </cmp-form-item>
              </el-col>
              <el-col :span="9">
                <cmp-form-item label="操作时间：">
                  <el-date-picker
                    class="time-picker"
                    v-model="date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy/MM/dd">
                  </el-date-picker>
                </cmp-form-item>
              </el-col>
              <el-col :span="7">
                <cmp-form-item label="应用名称：">
                  <el-input v-model="module" placeholder="请输入应用名称"></el-input>
                </cmp-form-item>
              </el-col>
              <el-col :span="12">
                <cmp-form-item label="操作描述：">
                  <el-input v-model="action" placeholder="请输入操作描述"></el-input>
                </cmp-form-item>
              </el-col>
            </el-row>
          </cmp-form>
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="search">
            <i class="el-icon-search"></i> 查询
          </el-button>
        </div>
      </div>
      <el-table :data="datalist" style="margin-top: 10px">
        <el-table-column label="操作时间" prop="gmtCreate" width="140"></el-table-column>
        <el-table-column label="操作用户" prop="username"></el-table-column>
        <el-table-column label="访问IP" prop="requestIp" show-overflow-tooltip></el-table-column>
        <!--<el-table-column label="操作对象" prop="object"></el-table-column>-->
        <el-table-column label="操作描述" prop="action"></el-table-column>
        <el-table-column label="操作结果" prop="result"></el-table-column>
        <el-table-column label="应用名称" prop="module"></el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @current-change="getData"
          :current-page.sync="param.page"
          :page-size="param.rows"
           layout="total, prev, pager, next" :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { safeStr } from '@/filters'
export default {
  data () {
    return {
      param: {
        page: 1,
        rows: 10
      },
      appId: '',
      totalCount: 0,
      sectionId: '',
      createId: '',
      username: '',
      module: '',
      action: '',
      date: [],
      datalist: [],
      userList: [],
      userLoading: false
    }
  },
  mounted () {
    let userInfo = JSON.parse(localStorage.getItem('userData')) || {};
    this.sectionId = userInfo.sessionId;
    this.createId = userInfo.userId;
    // this.username = safeStr(userInfo.username);
    this.search();
  },
  methods: {
    // 远程搜索
    usersMethod (query) {
      if (query) {
        this.userLoading = true;
        this.$http({
          method: 'post',
          url: '/user/list',
          options: {
            noParam: true
          },
          data: {
            page: 1,
            rows: 25,
            params: JSON.stringify({ name: query })
          }
        }).then(data => {
          this.userLoading = false;
          if (data.success) {
            this.userList = data.data.rows
          } else {
            this.userList = []
          }
        })
      } else {
        this.userList = [];
      }
    },
    // 获取用户管理数据列表
    getData () {
      this.param.page = this.param.page;
      this.$http({
        url: '/log/page',
        method: 'POST',
        data: this.param
      }).then(data => {
        if (data.data && data.data.rows && data.data.rows.length) {
          this.totalCount = data.data.total;
          this.datalist = data.data.rows.map(item => {
            if (item.result) {
              let resulet = JSON.parse(item.result)
              item.result = resulet.success ? '成功' : '失败'
            }
            return item
          });
        } else {
          this.totalCount = 0;
          this.datalist = [];
        }
      })
    },
    // 查询
    search () {
      let param = {
        username: this.username,
        module: this.module,
        action: this.action,
        startTime: this.date[0] || '',
        endTime: this.date[1] || ''
      };

      if (this.sectionId != 'S000000218') {
        param['sectionId'] = this.sectionId;
      }

      this.param = {
        page: 1,
        rows: 10,
        ...param
      };
      this.getData();
    },
    toObjFormat (obj) {
      // for (let a of obj) {
      //   if (a == '' || !a) delete a;
      // }
      return obj;
    }
  }
};
</script>

<style lang="scss" scoped>
.time-picker  {
  width: 100% !important;
}
.wrapper-md {
  background: #fff;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box
}

</style>
