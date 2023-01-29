import lodash from 'lodash'
let tmp = 0
export default function resize (vm) {
  $(window).bind('resize', lodash.debounce(() => {
    if ($(window).width() < 800 || $(window).height() < 400) {
      if (!tmp) {
        vm.$message.info('浏览器当前窗口过小，可能会影响正常操作！');
        tmp = 1;
        setTimeout(() => {
          tmp = 0
        }, 50000)
      }
    }
    let barTop = Math.floor(($(window).height() - 150 - $('#desk-nav').height()) / 2);
    vm.navtop = barTop;
    // let _top = vm.config.shortcutTop;
    // let _left = vm.config.shortcutLeft;
    // let windowHeight = $('#desk').height();
    // vm.appList.forEach(item => {
    //   item.left = _left;
    //   item.top = _top;
    //   _top += 110;
    //   if (_top + vm.config.shortcutTop + 57 > windowHeight) {
    //     _top = vm.config.shortcutTop;
    //     _left += 110;
    //   }
    // });

    // 智能修改每个窗口的定位
    let i = 0;
    $('div.window-container').each(function () {
      let currentW = $(window).width() - $(this).width();
      let currentH = $(window).height() - $(this).height();
      let leftTmp = $(this).position().left;
      let topTmp = $(this).position().top;
      let _l = leftTmp / vm.windows[i].emptyW * currentW >= currentW ? currentW : leftTmp / vm.windows[i].emptyW * currentW;
      _l = _l <= 0 ? 0 : _l;
      let _t = topTmp / vm.windows[i].emptyH * currentH >= currentH ? currentH : topTmp / vm.windows[i].emptyH * currentH;
      _t = _t <= 0 ? 0 : _t;
      vm.windows[i].left = _l + 'px';
      vm.windows[i].top = _t + 'px';
      i++;
    });
  }, 150));
}
