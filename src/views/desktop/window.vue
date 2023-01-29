<template>
  <div :id="`window_${win.num}_warp`" :style="currStyle" :class="currClass">
    <div style="height: 100%;" :id="`window_${win.num}_inner`">
      <div
        class="title-bar"
        @dblclick.stop="handle(win,'dblclick')"
        :style="{ cursor: max ? 'initial' : 'move'}"
      >
        {{win.title}}
        <div class="title-drop" @mousedown="windowMove($event, win)"></div>
        <div class="title-handle">
          <a class="ha-min" @click.stop="handle(win, 'min')">最小化</a>
          <a class="ha-max" v-if="!max" @click.stop="handle(win, 'max')">最大化</a>
          <a class="ha-revert" v-if="max" @click.stop="handle(win, 'revert')">还原</a>
          <a class="ha-close" @click.stop="handle(win, 'close')">关闭</a>
        </div>
      </div>
      <div class="window-frame" :id="`window-frame_${win.num}`">
        <slot>
          <div class="window-loading" v-if="loading">
            <i class="el-icon-loading"></i>
          </div>
          <iframe frameborder="0" :id="`frame${win.num}`" v-show="!loading"></iframe>
        </slot>
      </div>
      <div class="set-bar">
        <div class="fr">
          <a class="btn" id="refresh"  @click.stop="handle(win, 'refresh')">
            <i class="el-icon-refresh"></i>
            <span class="btn-con">刷新</span>
          </a>
        </div>
      </div>
      <div class="cover-box" v-if="currentWindow !== win.num && showCover"></div>
      <template v-if="!max">
        <div
          v-for="item in resizeBlocks"
          :resize="item"
          :key="item"
          class="resize-block"
          :class="`resize-${item}`"
          @mousedown="windowResize($event, win, item)"
        ></div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    },
    config: {
      type: Object
    },
    currentWindow: {
      type: Number,
      default: -1
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    showCover: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      win: this.data,
      resizeBlocks: ['t', 'r', 'b', 'l', 'rt', 'rb', 'lt', 'lb'],
      lastPos: {
        x: 0,
        y: 0
      },
      bkPosition: {},
      max: false,
      resize: false,
      move: false,
      loading: true
    };
  },
  computed: {
    currStyle () {
      let window = this.win;
      return {
        width: window.width,
        height: window.height,
        top: window.top,
        left: window.left,
        zIndex: window.zIndex
      };
    },
    currClass () {
      let window = this.win;
      return {
        'window-container': 1,
        'window-current': window.current,
        'window-modify': this.move || this.resize
      };
    }
  },
  mounted () {
    let vm = this;
    // if (vm.appendToBody) {
    //   document.body.appendChild(vm.$el);
    // }
    vm.$set(vm.win, 'resize', false);
    vm.$set(vm.win, 'move', false);
    vm.$set(vm.win, 'max', false);
    let ifr = $(`#frame${vm.win.num}`);
    ifr.attr('src', vm.win.url);
    ifr.on('load', function () {
      vm.loading = false;
    });
  },
  // destroyed () {
  //   if (this.appendToBody && this.$el && this.$el.parentNode) {
  //     this.$el.parentNode.removeChild(this.$el);
  //   }
  // },
  methods: {
    setCreateIndexid () {
      this.win.zIndex = this.config.createIndexid;
      this.config.createIndexid += 1;
    },
    handle (item, type) {
      if (type !== 'dblclick') this.setCreateIndexid();
      switch (type) {
        case 'min':
          this.minWin(item);
          break;
        case 'max':
          this.maxWin(item);
          break;
        case 'revert':
          this.revertWin(item);
          break;
        case 'dblclick':
          this.barDblClick(item);
          break;
        case 'close':
          this.closeWin(item);
          break;
        case 'refresh':
          this.refreshWin(item);
          break;
      }
      let setCode = ['close', 'min'];
      if (this.currentWindow !== this.win.num || setCode.includes(type)) {
        this.$emit('setCurrentWindow');
      }
    },
    minWin (item) {
      item.current = false;
    },
    maxWin (item) {
      // 最大化
      this.bkPosition = {
        width: item.width,
        height: item.height,
        top: item.top,
        left: item.left
      };
      item.width = '100%';
      item.height = '100%';
      item.top = 0;
      item.left = 0;
      this.max = true;
      this.win.max = true;
      this.$message({
        message: '按F11体验浏览器全屏模式！',
        showClose: true,
        type: 'info'
      });
    },
    revertWin (item) {
      // 还原
      let { width, height, top, left } = this.bkPosition;
      item.width = width;
      item.height = height;
      item.top = top;
      item.left = left;
      this.max = false;
      this.win.max = false;
    },
    // 双击
    barDblClick (item) {
      if (!this.max) this.handle(item, 'max');
      else this.handle(item, 'revert');
    },
    // 关闭
    closeWin (item) {
      this.$emit('close', item);
    },
    // 刷新
    refreshWin (item) {
      let vm = this;
      vm.loading = true;
      let ifr = $(`#frame${item.num}`);
      let hrefWin = item.url.split('?')[0]
      if (hrefWin.indexOf('//') === -1) {
        document.getElementById(`frame${item.num}`).contentWindow.location.reload(true);
      }
      ifr.attr('src', item.url);
      ifr.on('load', function () {
        vm.loading = false;
      });
      // let target = document.getElementById('frame' + item.num);
      // target.src = item.url;
      // document.getElementById('frame' + item.num).src = item.url
    },
    windowMove (e, item) {
      if (e.button !== 0) return;
      let vm = this;
      if (vm.max) return;
      vm.setCreateIndexid();
      vm.$emit('setCurrentWindow');
      e = window.e || e;
      let targetWindow = document.getElementById(`window_${item.num}_warp`);

      vm.lastPos.x = e.pageX;
      vm.lastPos.y = e.pageY;
      let x = e.screenX, // 鼠标位于屏幕的left
        y = e.screenY, // 鼠标位于屏幕的top
        sT = $(targetWindow).offset().top,
        sL = $(targetWindow).offset().left;
      let lay = $(window);
      lay.unbind('mousemove').bind('mousemove', function (e) {
        if (e.pageX === vm.lastPos.x && e.pageY === vm.lastPos.y) {
          return false;
        }
        if (this.max) vm.revertWin(null, item);
        vm.move = true;
        vm.win.move = true;
        let eX = e.screenX, // 鼠标位于屏幕的left
          eY = e.screenY, // 鼠标位于屏幕的top
          lessX = eX - x, // 距初始位置的偏移量
          lessY = eY - y, // 距初始位置的偏移量
          _l = sL + lessX,
          _t = sT + lessY,
          _w = $(targetWindow).width(),
          _h = $(targetWindow).height();
        if (_l >= lay.width() - _w) {
          _l = lay.width() - _w;
        }
        if (_t >= lay.height() - _h - 31) {
          _t = lay.height() - _h - 31;
        }
        if (_l <= 0) _l = 0;
        if (_t <= 0) _t = 0;
        // item.width = _w + 'px';
        // item.height = _h + 'px';
        item.left = _l + 'px';
        item.top = _t + 'px';
        item.emptyH = lay.height() - _h;
        item.emptyW = lay.width() - _w;
      });
      lay.unbind('mouseup').bind('mouseup', function () {
        vm.move = false;
        vm.win.move = false;
        $(this).unbind('mousemove');
      });
    },
    windowResize (e, item, r) {
      if (e.button !== 0) return;
      let vm = this;
      vm.setCreateIndexid();
      vm.$emit('setCurrentWindow');
      let lay = $(window);
      let cy = e.clientY;
      let cx = e.clientX;
      vm.lastPos.x = e.pageX;
      vm.lastPos.y = e.pageY;
      let targetWindow = document.getElementById(`window_${item.num}_warp`);
      let h = $(targetWindow).height();
      let w = $(targetWindow).width();
      lay.unbind('mousemove').bind('mousemove', function (e) {
        if (e.pageX === vm.lastPos.x && e.pageY === vm.lastPos.y) {
          return false;
        }
        vm.win.resize = true;
        vm.resize = true;
        let _t = e.clientY;
        let _l = e.clientX;
        // 窗口贴屏幕底部31px内
        if (_t >= lay.height() - 31) {
          _t = lay.height() - 31;
        }
        // 窗口贴屏幕顶部10px内
        if (_t <= 0) {
          _t = 0;
        }
        if (_l >= lay.width()) {
          _l = lay.width();
        }
        if (_l <= 0) {
          _l = 0;
        }
        switch (r) {
          case 't':
            if (h + cy - _t > vm.config.windowMinHeight) {
              item.height = h + cy - _t + 'px';
              item.top = _t + 'px';
            }
            break;
          case 'r':
            if (w - cx + _l > vm.config.windowMinWidth) {
              let max = lay.width() - parseFloat(item.left);
              let cgTar = w - cx + _l;
              item.width = (cgTar > max ? max : cgTar) + 'px';
            }
            break;
          case 'b':
            if (h - cy + _t > vm.config.windowMinHeight) {
              let max = lay.height() - parseFloat(item.top) - 31;
              let cgTar = h - cy + _t;
              item.height = (cgTar > max ? max : cgTar) + 'px';
            }
            break;
          case 'l':
            if (w + cx - _l > vm.config.windowMinWidth) {
              item.width = w + cx - _l + 'px';
              item.left = _l + 'px';
            }
            break;
          case 'rt':
            if (h + cy - _t > vm.config.windowMinHeight) {
              item.height = h + cy - _t + 'px';
              item.top = _t + 'px';
            }
            if (w - cx + _l > vm.config.windowMinWidth) {
              let max = lay.width() - parseFloat(item.left);
              let cgTar = w - cx + _l;
              item.width = (cgTar > max ? max : cgTar) + 'px';
            }
            break;
          case 'rb':
            if (w - cx + _l > vm.config.windowMinWidth) {
              let max = lay.width() - parseFloat(item.left);
              let cgTar = w - cx + _l;
              item.width = (cgTar > max ? max : cgTar) + 'px';
            }
            if (h - cy + _t > vm.config.windowMinHeight) {
              let max = lay.height() - parseFloat(item.top) - 31;
              let cgTar = h - cy + _t;
              item.height = (cgTar > max ? max : cgTar) + 'px';
            }
            break;
          case 'lt':
            if (w + cx - _l > vm.config.windowMinWidth) {
              item.width = w + cx - _l + 'px';
              item.left = _l + 'px';
            }
            if (h + cy - _t > vm.config.windowMinHeight) {
              item.height = h + cy - _t + 'px';
              item.top = _t + 'px';
            }
            break;
          case 'lb':
            if (w + cx - _l > vm.config.windowMinWidth) {
              item.width = w + cx - _l + 'px';
              item.left = _l + 'px';
            }
            if (h - cy + _t > vm.config.windowMinHeight) {
              let max = lay.height() - parseFloat(item.top) - 31;
              let cgTar = h - cy + _t;
              item.height = (cgTar > max ? max : cgTar) + 'px';
            }
            break;
        }
        // 更新窗口宽高缓存
        item.emptyW = lay.width() - $(targetWindow).width();
        item.emptyH = lay.height() - $(targetWindow).height();
      });
      // 绑定鼠标抬起事件
      lay.unbind('mouseup').bind('mouseup', function () {
        vm.resize = false;
        vm.win.resize = false;
        $(this).unbind('mousemove');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.resize-block {
  position: absolute;
  overflow: hidden;
  z-index: 10;
}
.resize-t {
  left: 0;
  top: -3px;
  width: 100%;
  height: 5px;
  cursor: n-resize;
}
.resize-r {
  right: -3px;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: e-resize;
}
.resize-b {
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 5px;
  cursor: s-resize;
}
.resize-l {
  left: -3px;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: w-resize;
}
.resize-rt {
  right: -3px;
  top: -3px;
  width: 10px;
  height: 10px;
  z-index: 11;
  cursor: ne-resize;
}
.resize-rb {
  right: -3px;
  bottom: -3px;
  width: 10px;
  height: 10px;
  z-index: 11;
  cursor: se-resize;
}
.resize-lt {
  left: -3px;
  top: -3px;
  width: 10px;
  height: 10px;
  z-index: 11;
  cursor: nw-resize;
}
.resize-lb {
  left: -3px;
  bottom: -3px;
  width: 10px;
  height: 10px;
  z-index: 11;
  cursor: sw-resize;
}
.window-modify {
  opacity: 0.7;
  .window-frame,
  .set-bar {
    display: none;
  }
}
.window-container {
  transition: all 0.5s ease;
  transition: display 0s;
}
.window-container .cover-box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 26px;
}
.window-frame div {
  z-index: 9000000;
  background: none;
  height: 100%;
  width: 100%;
}
.window-loading {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
</style>
