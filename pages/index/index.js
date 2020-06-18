//index.js
//获取应用实例
const app = getApp()

function str2decimal(str){
  var arr = str.split('').map(item=>{return item.charCodeAt(0)});
  var result = arr.reduce((total,currentValue)=>{return total^currentValue},0);
  return result <16? '0' + result.toString(16).toUpperCase() :result.toString(16).toUpperCase();
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    beidouCover: '../images/beidou.jpg'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.getSystemInfo({
      success(res) {
        console.log('getSystemInfo:', res)
        let isIphone = res.model.indexOf('iPhone') >= 0
        console.log('isIphone', isIphone)
        wx.setStorageSync('IS_IPHONE', isIphone)
      },
      fail(err) {
        
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toPageSacn: function() {
    // let srt = '1234567890'
    // for (let i = 0;i<3;i++) {
    //   let v = srt.substr(4 * i, 4)
    //   console.log(v, v.length)
    // }
    wx.navigateTo({
      url: '../scan/scan'
    })
    // console.log(str2decimal('CCREST,0'))
    // const MAP = {
    //   '$CCYJCX': '$HFCSXX',
    //   '$CCYDPD': '$HFYDPD',
    //   '$CCYDDK': '$HFYDDK',
    //   '$CCBDSZ': '$HFBDSC',
    //   '$CCGPSZ': '$HFGPSC',
    //   '$CCLYSZ': '$HFLYSC',
    //   '$CCXLSZ': '$HFXLSC',
    //   '$CCCKSZ': '$HFCKSC',
    //   '$CCRZSZ': '$HFRZSC',
    //   '$CCGJSZ': '$HFGJSC',
    //   '$CCBBCX': '$HFBBXX',
    //   '$CCREST': '设备复位'
    // }
    // let param = '$CCYJCX,0*14'
    // let at = param.indexOf(',')
    // let cmd = param.substring(0, at)
    // console.log('cmd:', cmd, ', res:', MAP[cmd])
  }
})
