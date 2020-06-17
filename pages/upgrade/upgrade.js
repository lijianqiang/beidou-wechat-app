// pages/upgrade/upgrade.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: 'https://huajietaojin.oss-cn-hangzhou.aliyuncs.com/beidou/bin/hfth05.bin',
    percent: 0,
    filePath: '',
    update_press: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindAddress: function (e) {
    console.log('address', e.detail.value)
    this.setData({
      'address': e.detail.value
    })
  },
  upgradeDevice: function () {
    this.downlaodFile()
  },

  downlaodFile: function () {
    let address = this.data.address
    let self = this
    let ts = new Date().getTime()
    let filePath = wx.env.USER_DATA_PATH + '/bin_' + ts + '.bin'
    console.log('filePath', filePath)
    wx.downloadFile({
      url: address,
      filePath: filePath,
      header: {},
      success: function (res) {
        console.log('res', res)
        console.log('res.filePath', res.filePath)
        self.setData({
          filePath: filePath,
          update_press: res.filePath
        })
        self.readHex()
        //console.log('res.data',typeof(res.data))
      },
      fail: function (err) {
        console.log('downloadFile err', err)
      }
    })
  },

  readBin: function () {
    var self = this
    var rrdata = null
    var fs = wx.getFileSystemManager()
    fs.readFile({
      filePath: this.data.filePath,
      success: function (res) {
        //返回文件读取的内容
        console.log('readFile', res)
        //let rdata =res.data  //这里就是读取出来的bin数据arrayBuffer 格式
      },
      fail: function (err) {
        console.log('readFile err', err)
      }

    })
  },

  readHex: function () {
    var self = this
    var rrdata
    var fs = wx.getFileSystemManager()
    fs.readFile({
      filePath: this.data.filePath,
      //ascii 格式，超过128 的值不对
      //binary： arraybffer 格式，数据正确，怎么取？
      //hex: 以hex字符串形式，1个字节变2个字节。
      //utf8: 超过128 的，变成0xfd
      //不要encoding 默认为 binary格式。
      encoding: 'hex',
      success: res => {
        //返回文件读取的内容
        //str 格式，需要hexstr 转arraybuffer
        let rrdata = res.data
        console.log('length', res.data.length)
        console.log('rrdata', rrdata)
        // self.setData({
        //   updata_buff: rrdata, //string格式的数据放这里
        //   updata_buff_cnt: 0,
        //   update_press: res.data.length
        // })


        // var that = this;
        // setTimeout(function () {
        //   self.SendBlePkg()
        // }, 1000)
      },
      fail: res => {
        console.log('xxxxx', res)
        
      }
    })
  }

})