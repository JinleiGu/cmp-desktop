<template>
  <div class="desk-container" :style="{ 'background-image': 'url(' + bgUrl + ')' }"
       :class="themeStyle">
    <!-- 底部bar -->
    <div id="task-bar" @contextmenu="taskSysClick">
      <ul class="task-window">
        <li
          v-for="(item,key) in taskList"
          :key="key"
          :id="`task_${item.num}`"
          @click="taskClick($event, item)"
          @contextmenu="taskRightClick($event, item)"
        >
          <b :class="{ focus: item.focus }">
            <img :src="item.imgsrc" />
            <span :title="item.title">{{item.title}}</span>
          </b>
        </li>
      </ul>
      <div class="desk_clock">
        <span id="clock" :title="date.clockDate">{{date.clockTime}}</span>
      </div>
      <!-- <div class="cloud-logo">
        <span>运营门户</span>
      </div> -->
    </div>
    <!-- 主体 -->
    <div id="desk">
      <!-- 左侧nav -->
      <div id="desk-nav">
        <div style="height: 100%;overflow: hidden">
          <!-- <div @click="getStore" @mousedown="appMouseDown">
            <img src="/static/images/icos/store.png" />
            <span>应用市场</span>
          </div>
          <div @click="myStore" @mousedown="appMouseDown">
            <img src="/static/images/icos/system_cd.png" />
            <span>我的应用</span>
          </div> -->
          <div v-show="false" @click="handleClick(logInfo)" @mousedown="appMouseDown">
            <img src="/static/images/icos/log.png"/>
            <span>操作日志</span>
          </div>
          <div @click="handleClick(userManage)" v-show="isAdmin" @mousedown="appMouseDown">
            <img src="/static/images/icos/usermanage.png"/>
            <span>用户管理</span>
          </div>
          <div @click="handleClick(organization)" v-show="isAdmin" @mousedown="appMouseDown">
            <img src="/static/images/icos/organization.png"/>
            <span>组织机构</span>
          </div>
          <div @click="handleClick(appManage)" v-show="isAdmin" @mousedown="appMouseDown">
            <img src="/static/images/icos/appmanage.png"/>
            <span>应用管理</span>
          </div>
          <div @click="handleClick(resourceManage)" v-show="isAdmin" @mousedown="appMouseDown">
            <img src="/static/images/icos/resourcemanage.png"/>
            <el-tooltip content="平台组" placement="bottom-start">
              <span>平台组</span>
            </el-tooltip>
          </div>
        </div>
        <section id="user-info">
          <span id="user-img">
            <img :src="userPortrait" />
          </span>
          <span id="personal">{{userName}}</span>
          <p class="setup">
            <span @click="modifyUserInf">个人信息</span>
            <span @click="modifyPwd">修改密码</span>
            <span @click="logout">退出登录</span>
          </p>
        </section>
      </div>
      <ul @contextmenu.prevent.stop="appRightClick()">
        <draggable v-model="appList" :move="getdataDrag" @update="datadragEnd" group="applist">
          <!-- <li class="li" v-show="isAdmin">
            <div class="li-content"  @contextmenu.prevent.stop="appRightClick(item)"
                 @dblclick="handleClick(userManage)">
              <img src="/static/images/icos/usermanage.png" @mousedown="appMouseDown"/>
              <span>用户管理</span>
              <em></em>
            </div>
          </li>
          <li class="li">
            <div class="li-content"  @contextmenu.prevent.stop="appRightClick(item)"
                 @dblclick="handleClick(organization)">
              <img src="/static/images/icos/organization.png" @mousedown="appMouseDown"/>
              <span>组织机构</span>
              <em></em>
            </div>
          </li>
          <li class="li" v-show="isAdmin">
            <div class="li-content"  @contextmenu.prevent.stop="appRightClick(item)"
                 @dblclick="handleClick(appManage)">
              <img src="/static/images/icos/appmanage.png" @mousedown="appMouseDown"/>
              <span>应用管理</span>
              <em></em>
            </div>
          </li> -->
          <li
            v-for="item of appList"
            :key="item.appId"
            :app="item.appId"
            v-show="item.appId !== 1"
            class="li"
          >
            <div class="li-content"  @contextmenu.prevent.stop="appRightClick(item)"
                 @click="handleClick(item)">
              <img :src="item.src || '/static/img/default_cmdb.png'" @mousedown="appMouseDown"/>
              <span>{{item.name}}</span>
              <em></em>
            </div>
          </li>
        </draggable>
      </ul>
      <!--<ul @contextmenu.prevent.stop="appRightClick()">
      </ul>-->
      <app-window
        v-for="win in windows"
        :data="win"
        :key="win.num"
        :config="config"
        @close="closeWin"
        :currentWindow="currentWindow"
        @setCurrentWindow="setCurrentWindow"
        :showCover="showCover"
      >
        <!-- <component v-if="win.type === 'inner'" :is="win.component"></component> -->
      </app-window>
    </div>
    <add-app v-if="addAppDialog.visible" :dialog="addAppDialog" @addAppFromStore="setSortAppList" @updateOrDelApp="updateOrDelApp"></add-app>
    <context-menu v-if="menuVisible" :style="menuPos" @openApp="openApp" @deleteApp="deleteApp"
                  :appId="nowAppInfo.appId" @setTheme="openThemeSetting"></context-menu>
    <user-inf
      v-if="upUserVisible"
      @close="updateUserInf"
      :dialogVisible="upUserVisible"
    ></user-inf>
    <update-password
      v-if="upPassVisible"
      @close="upPassVisible = false"
      :dialogVisible="upPassVisible"
    ></update-password>
    <theme-setting v-if="themeSetting.visible" :dialog="themeSetting" @updateTheme="getTheme"></theme-setting>
    <div
      class="popup-menu task-menu"
      style="z-index:99999;"
      v-if="taskRight.num !== -1"
      :style="{ left: taskRight.left, top: taskRight.top }"
    >
      <ul>
        <li>
          <a @click="closeWinFromTask">关闭</a>
        </li>
      </ul>
    </div>
    <div
      class="popup-menu task-menu"
      style="z-index:99999;"
      v-if="sysSetting.visible"
      :style="{ left: sysSetting.left, top: sysSetting.top }"
    >
      <ul>
        <li id="update-password">
          <a @click="modifyPwd">修改密码</a>
        </li>
        <li id="login-out">
          <a @click="logout">退出登录</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
import { MessageBox, Notification } from 'element-ui'
import { safeStr } from '@/filters'
import { getUserApp, getAppDetail, sortApp, deleteApp } from 'api/app'
import { getTheme } from 'api/user'
import { getToken, setToken } from '@/utils/auth'
import { replaceToken, refreshStatus } from 'api/index'
import AddApp from './addApp';
import AppWindow from './window';
import resize from './operation/resize';
import ContextMenu from './contextMenu';
import UpdatePassword from '../login/updatePassword';
import ThemeSetting from './theme';
import userInf from '../userInf';
// import worktask from '../workTask/list';
// import log from '../log/list';
import draggable from 'vuedraggable'
export default {
  components: {
    AddApp,
    AppWindow,
    ContextMenu,
    UpdatePassword,
    ThemeSetting,
    userInf,
    // log,
    // worktask
    draggable
  },
  data () {
    return {
      logInfo: {
        component: 'log',
        appId: -1,
        url: '/#/log',
        name: '操作日志',
        src: '/static/images/icos/log.png',
        current: true
      },
      userManage: {
        component: 'usermanage',
        appId: -2,
        url: '/#/usermanage',
        name: '用户管理',
        src: '/static/images/icos/usermanage.png',
        current: true
      },
      organization: {
        component: 'organization',
        appId: -3,
        url: '/#/organization',
        name: '组织机构',
        src: '/static/images/icos/organization.png',
        current: true
      },
      appManage: {
        component: 'appmanage',
        appId: -4,
        url: '/#/appmanage',
        name: '应用管理',
        src: '/static/images/icos/appmanage.png',
        current: true
      },
      resourceManage: {
        component: 'resourcemanage',
        appId: -5,
        url: '/#/resourcemanage',
        name: '平台组',
        src: '/static/images/icos/resourcemanage.png',
        current: true
      },
      userName: '',
      apps: [],
      appRoles: [],
      isAdmin: '',
      addAppDialog: {
        visible: false
      },
      addMyAppDialog: {
        visible: false
      },
      messageNum: 0,
      date: {
        clockTime: '',
        clockDate: ''
      },
      config: {
        shortcutTop: 20, // 快捷方式top初始位置
        shortcutLeft: 20, // 快捷方式left初始位置
        createIndexid: 1, // z-index初始值
        windowMinWidth: 150, // 窗口最小宽度
        windowMinHeight: 56 // 窗口最小高度
      },
      shortcut: '',
      appList: [],
      taskRight: {
        left: 0,
        top: 0,
        num: -1
      },
      sysSetting: {
        left: 0,
        top: 0,
        visible: false
      },
      menuVisible: false,
      menuPos: {
        left: 0,
        top: 0,
        zIndex: 0
      },
      nowAppInfo: {},
      currentWindow: -1,
      windows: [],
      taskList: [],
      curDrag: null,
      upUserVisible: false,
      upPassVisible: false,
      themeSetting: {
        visible: false
      },
      background: {
        themeStyle: '',
        src: ''
      },
      navtop: 0,
      userPortrait: ''
    };
  },
  computed: {
    userData () {
      return this.$store.state.user.userData;
    },
    showCover () {
      for (let i = 0; i < this.windows.length; i++) {
        if (this.windows[i].resize) return true;
        if (this.windows[i].move) return true;
      }
      return false;
    },
    themeStyle () {
      let styleTheme = this.background.themeStyle
      switch (styleTheme) {
        case '居中':
          return 'bg-center'
        case '适应':
          return 'bg-adapt'
        case '平铺':
          return 'bg-tiling'
        case '拉伸':
          return 'bg-traction'
        default:
          return 'bg-fill'
      }
    },
    bgUrl () {
      return this.background.src
    }
  },
  mounted () {
    let vm = this
    // vm.getMessageNum();
    vm.clock()
    document.addEventListener('click', vm.closeContextMenu)
    document.addEventListener('contextmenu', vm.closeContextMenu)
    resize(vm);
    vm.loadInfo();
    vm.getTheme()
    this.timer = setInterval(() => {
      this.refreshStatus();
      setTimeout(() => {
        if (this.timer) {
          this.replaceToken()
        }
      }, 1000 * 30)
    }, 10000)
  },
  destroyed () {
    document.removeEventListener('click', this.closeContextMenu)
    document.removeEventListener('contextmenu', this.closeContextMenu)
    this.clearTimer()
  },
  methods: {
    clearTimer () {
      clearInterval(this.timer);
      this.timer = null;
    },
    replaceToken () {
      const userToken = getToken()
      replaceToken({ userToken }).then(res => {
        if (res.success) {
          setToken(res.data)
        } else {
          this.clearTimer()
          this.$store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }
      })
    },
    getTheme () {
      getTheme().then(res => {
        if (res.success) {
          this.background.themeStyle = res.data ? res.data.themeStyle : '填充'
          this.background.src = res.data ? res.data.themeUrl : '/static/images/4.png'
        }
      })
    },
    refreshStatus () {
      refreshStatus().then(res => {
        if (!res.success) {
          this.clearTimer()
          this.$store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }
      })
    },
    getdataDrag (evt) {
      // console.log(evt)
    },
    datadragEnd (evt) {
      this.setSortAppList()
    },
    setSortAppList (rows) {
      let params = []
      let appList = this.appList.concat(rows || [])
      for (let i = 0, j = appList.length; i < j; i++) {
        params.push({
          id: appList[i].appId || appList[i].id,
          priority: i
        })
      }
      this.setSort(params)
    },
    setSort (params) {
      sortApp(params).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.getData()
        }
      })
    },
    // 编辑|删除某一应用
    updateOrDelApp (row) {
      // this.getData()
      this.closeWin({
        appId: row.id,
        num: row.id < 0 ? row.id - 3 : row.id
      })
      let list = []
      if (row.type === 'del') {
        list = this.appList.filter(item => {
          return item.appId !== row.id
        })
      } else {
        list = this.appList.map(item => {
          if (item.appId === row.id) {
            item.name = row.name
            item.shortcut = row
            item.url = row.url
            item.src = row.src
            item.redirect = row.redirect
            item.current = row.current
          }
          return item
        })
      }
      this.appList = list
    },
    modifyUserInf () {
      this.upUserVisible = true
    },
    modifyPwd (e) {
      e.stopPropagation();
      this.upPassVisible = true;
      this.sysSetting.visible = false;
    },
    closeContextMenu (e) {
      if (e.type === 'contextmenu') e.preventDefault();
      let vm = this;
      vm.menuVisible = false;
      vm.taskRight.num = -1;
      vm.sysSetting.visible = false;
    },
    closeWin (item) {
      for (let i = 0; i < this.taskList.length; i++) {
        if (this.taskList[i].num === item.num) {
          this.taskList.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < this.windows.length; i++) {
        if (this.windows[i].num === item.num) {
          this.windows.splice(i, 1);
          break;
        }
      }
      this.getData()
    },
    minWindow (item) {
      // 处理任务栏
      for (let i = 0; i < this.taskList.length; i++) {
        if (this.taskList[i].num === item.num) this.taskList[i].focus = false;
      }
      this.setCurrentWindow();
    },
    taskSysClick (e) {
      e.stopPropagation();
      this.closeContextMenu(e);
      this.sysSetting.left = e.clientX + 'px';
      this.sysSetting.top = e.clientY - 60 + 'px';
      this.sysSetting.visible = true;
    },
    setCurrentWindow () {
      let tmp = { num: -1, zIndex: 0 };
      for (let i = 0; i < this.windows.length; i++) {
        let target = this.windows[i];
        if (target.zIndex > tmp.zIndex && target.current) tmp = target;
      }
      this.taskList.forEach(task => {
        if (task.num === tmp.num) task.focus = true;
        else task.focus = false;
      });
      this.currentWindow = tmp.num;
    },
    taskClick (e, item) {
      if (item.focus) {
        item.focus = false;
        for (let i = 0; i < this.windows.length; i++) {
          let target = this.windows[i];
          if (target.num === item.num) {
            target.current = false;
            break;
          }
        }
        this.setCurrentWindow();
      } else {
        // 改变任务栏样式
        this.taskList.forEach(task => {
          task.focus = false;
        });
        item.focus = true;
        this.currentWindow = item.num;
        for (let i = 0; i < this.windows.length; i++) {
          if (this.windows[i].num === item.num) {
            this.windows[i].current = true;
            this.windows[i].zIndex = this.config.createIndexid;
            this.config.createIndexid += 1;
            break;
          }
        }
      }
    },
    taskRightClick (e, item) {
      // 不再派发事件
      e.stopPropagation();
      this.closeContextMenu(e);
      this.taskRight.left = e.clientX + 'px';
      this.taskRight.top = e.clientY - 30 + 'px';
      this.taskRight.num = item.num;
    },
    closeWinFromTask () {
      this.closeWin({ num: this.taskRight.num });
      // this.taskRight.num = -1;
      this.setCurrentWindow();
    },
    appMouseDown (e) {
      // 阻止URL的链接以及表单的提交
      e.preventDefault();
    },
    async handleClick (item) {
      await this.replaceToken()
      let options = {
        num: item.appId < 0 ? item.appId - 3 : item.appId,
        title: item.name,
        imgsrc: item.src,
        url: item.url + '?token=' + getToken() + '&systemCode=' + item.code,
        appId: item.appId,
        code: item.code,
        width: 1000,
        height: 800,
        resize: true
      }
      if (item.redirect) {
        options.url = item.url + '?token=' + getToken() + '&systemCode=' + item.code + '&redirect=' + item.redirect
      } else {
        options.url = item.url + '?token=' + getToken() + '&systemCode=' + item.code
      }
      if (!options.url) {
        this.$alert('该应用禁止OA访问', '提示', {
          confirmButtonText: '取消'
        });
        return;
      }
      let windowNewTab = null
      if (!item.current) {
        windowNewTab = window.open(options.url, '_blank')
      }
      this.openAppLog(item.appId, options, windowNewTab)
    },
    openAppLog (id, options, windowNewTab) {
      getAppDetail(id).then(res => {
        if (res.success) {
          if (!windowNewTab) {
            // 判断窗口是否已打开
            let iswindowopen = 0;
            this.windows.forEach(item => {
              if (item.num === options.num) {
                iswindowopen = 1;
                this.taskList.forEach(task => {
                  if (task.num === options.num) task.focus = true;
                  else task.focus = false;
                });
                for (let i = 0; i < this.windows.length; i++) {
                  if (this.windows[i].num === options.num) {
                    this.windows[i].current = true;
                    this.windows[i].zIndex = this.config.createIndexid;
                    this.config.createIndexid += 1;
                    break;
                  }
                }
              }
            });
            if (iswindowopen == 0) {
              // 任务栏，窗口等数据
              let taskTemp = {
                num: options.num,
                title: options.title,
                imgsrc: options.imgsrc
              };
              let top =
                ($(window).height() - options.height - 30) / 2 <= 0
                  ? 0
                  : ($(window).height() - options.height - 30) / 2;
              let left =
                ($(window).width() - options.width) / 2 <= 0
                  ? 0
                  : ($(window).width() - options.width) / 2;
              let windowTemp = {
                width: options.width + 'px',
                height: options.height + 'px',
                top: top + 'px',
                left: left + 'px',
                emptyW: $(window).width() - options.width,
                emptyH: $(window).height() - options.height,
                zIndex: this.config.createIndexid,
                num: options.num,
                title: options.title,
                url: options.url,
                imgsrc: options.imgsrc
              };
              console.log(windowTemp.url)
              // 新增任务栏
              this.taskList.forEach(task => {
                task.focus = false;
              });
              this.taskList.push({ ...taskTemp, focus: true });
              this.windows.push({ ...windowTemp, current: true });
              this.config.createIndexid += 1;
            }
            this.setCurrentWindow();
          }
        } else {
          if (windowNewTab) {
            windowNewTab.close()
          }
          this.getData()
        }
      })
    },
    appRightClick (item) {
      // 鼠标右击触发事件
      if (!item) this.nowAppInfo = {}
      else this.nowAppInfo = item;
      this.menuVisible = true;
      this.$nextTick(() => {
        this.menuPos.left = event.clientX + 1 + 'px';
        this.menuPos.top = event.clientY + 5 + 'px';
        this.menuPos['z-index'] = this.config.createIndexid;
      });
    },
    getData () {
      if (!this.userName) return
      getUserApp().then(res => {
        if (res.success) {
          let shortcut = res.data
          // 依次往桌面上append应用图标
          let appList = []
          for (let sc of shortcut) {
            if (this.apps.indexOf(sc.id) !== -1) {
              let shortcutTemp = {
                name: sc.name,
                shortcut: sc,
                src: sc.icon,
                appId: sc.id,
                url: sc.url,
                code: sc.code,
                redirect: sc.redirect
              }
              appList.push(shortcutTemp);
            }
          }
          this.appList = appList
        }
      })
    },
    getCookie (name) {
      var strcookie = document.cookie; // 获取cookie字符串
      var arrcookie = strcookie.split('; '); // 分割
      // 遍历匹配
      for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split('=');
        if (arr[0] == name) {
          return arr[1];
        }
      }
      return '';
    },
    getStore () {
      this.addAppDialog.visible = true;
      this.addAppDialog.source = 'appStore';
    },
    myStore () {
      this.addAppDialog.visible = true;
      this.addAppDialog.source = 'myStore';
    },
    logout (e) {
      e.stopPropagation();
      this.$confirm('您确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/logout')
        this.$router.replace({ name: 'Login' })
      });
    },
    getMessageNum () {
      /* this.$http({
        url: '/message/statistics',
        method: 'POST',
        noParam: true
      }).then(data => {
        if (data.success) {
          if (data.data.unreadCount > 99) {
            this.messageNum = 99;
          } else {
            this.messageNum = data.data.unreadCount;
          }
        }
      }); */
    },
    clock () {
      let date_obj = new Date();
      let hour = date_obj.getHours();
      let minute = date_obj.getMinutes();
      let day = date_obj.getDate();
      let year = date_obj.getFullYear();
      let suffix = 'AM';
      // Array for weekday.
      let weekday = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ];
      // Array for month.
      let month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      // Assign weekday, month, date, year.
      weekday = weekday[date_obj.getDay()];
      month = month[date_obj.getMonth()];
      if (hour >= 12) {
        suffix = 'PM';
      }
      if (hour > 12) {
        hour = hour - 12;
      } else if (hour === 0) {
        hour = 12;
      }

      if (minute < 10) {
        minute = '0' + minute;
      }
      let clock_time = weekday + '  ' + hour + ':' + minute + '  ' + suffix;
      let clock_date = month + ' ' + day + ', ' + year;
      this.date = {
        clockTime: clock_time,
        clockDate: clock_date
      };
      setTimeout(this.clock, 60000);
    },
    updateUserInf (isUpdate) {
      this.upUserVisible = false
      if (isUpdate) {
        this.loadUserInf()
      }
    },
    loadUserInf () {
      this.userName = safeStr(this.userData.name)
      this.userPortrait = this.userData.portrait || '/static/img/avatar_default.png'
      this.apps = this.userData.apps
      this.appRoles = this.userData.appRoles
      this.isAdmin = this.apps.indexOf(1) > -1
    },
    loadInfo () {
      this.loadUserInf()
      this.getData();
    },
    openThemeSetting () {
      this.themeSetting.visible = true
    },
    openApp () {
      if (!this.nowAppInfo.appId) return;
      this.handleClick(this.nowAppInfo);
    },
    deleteApp (id) {
      this.$confirm('你确定要删除当前应用吗？', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        deleteApp(id).then(res => {
          if (res.success) {
            for (let i in this.appList) {
              if (this.appList[i].appId === id) {
                this.appList.splice(i, 1);
                break;
              }
            }
            this.$message.success(res.message);
            this.getData()
          }
        })
      }).catch(() => {
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .desk-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .bg-center {
    // 居中
    background-position: center;
    background-repeat: no-repeat;
  }
  .bg-fill {
    // 填充
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .bg-tiling {
    // 平铺
    background-repeat: repeat;
  }
  .bg-adapt {
    // 适应
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .bg-traction {
    // 拉伸
    background-size: 100% 100%;
  }

  .desk_clock {
    position: absolute;
    top: 0;
    right: 20px;
    width: 120px;
    height: 28px;
    overflow: hidden;
    text-align: center;
  }
  #clock {
    line-height: 28px;
    color: #f4f4f4;
    font-weight: normal;
  }
  .cloud-logo {
    width: 210px;
    height: 70px;
    position: absolute;
    right: 0;
    bottom: 30px;
  }
  .cloud-logo span {
    display: block;
    width: 100%;
    height: 50px;
    line-height: 70px;
    font-size: 40px;
    font-family: Arial, Helvetica;
  }
  .message {
    position: relative;
  }
  .message-num {
    position: absolute;
    top: 6px;
    right: 6px;
    height: 20px;
    min-width: 20px;
    line-height: 20px;
    border-radius: 50%;
    background-color: red;
  }
  .message-num span {
    margin-top: 0 !important;
    background: none !important;
    padding: 0 !important;
  }
  .mar-bott-20 {
    margin-bottom: 20px;
  }
  #desk-nav div img:hover {
    width: 55px;
    height: 55px;
  }
  #user-info:hover {
    .setup {
      display: block;
    }
  }
</style>
