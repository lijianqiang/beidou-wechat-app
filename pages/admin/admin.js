// pages/admin/admin.js

const NOTIFY_UUID = '0000FFE4-0000-1000-8000-00805F9B34FB'
const WRITE_UUID = '0000FFE9-0000-1000-8000-00805F9B34FB'

function getHeader(param) {
  let at = param.indexOf(',')
  at = at > 0 ? at : 0
  return param.substring(0, at)
}

function str2decimal(str) {
  var arr = str.split('').map(item => {
    return item.charCodeAt(0)
  });
  var result = arr.reduce((total, currentValue) => {
    return total ^ currentValue
  }, 0);
  return result < 16 ? '0' + result.toString(16).toUpperCase() : result.toString(16).toUpperCase();
}

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

// 字符串转byte
function stringToBytes(str) {
  var array = new Uint8Array(str.length);
  for (var i = 0, l = str.length; i < l; i++) {
    array[i] = str.charCodeAt(i);
  }
  console.log('stringToBytes', array);
  return array.buffer;
}

const MAP = {
  '$CCYJCX': '$HFCSXX',
  '$CCYDPD': '$HFYDPD',
  '$CCYDDK': '$HFYDDK',
  '$CCBDSZ': '$HFBDSC',
  '$CCGPSZ': '$HFGPSC',
  '$CCLYSZ': '$HFLYSC',
  '$CCXLSZ': '$HFXLSC',
  '$CCCKSZ': '$HFCKSC',
  '$CCRZSZ': '$HFRZSC',
  '$CCGJSZ': '$HFGJSC',
  '$CCBBCX': '$HFBBXX',
  '$CCREST': '设备复位'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    devices: [],
    connected: false,
    canWrite: false,
    chs: [],
    result: '',
    inputParam: '$CCYJCX,0*14',
    outputResult: '',
    requestHeader: '',
    requestLoading: false,
    canSend: false,
    isIphone: true,
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initNotify()

    let that = this
    wx.getSystemInfo({
      success(res) {
        console.log('getSystemInfo:', res)
        let isIphone = res.model.indexOf('iPhone') >= 0
        console.log('isIphone', isIphone)
        that.setData({
          isIphone: isIphone
        })
      },
      fail(err) {

      }
    })
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

  bindInputParam(e) {
    this.setData({
      'inputParam': e.detail.value
    })
  },

  queryInfo: function () {
    console.log('input', this.data.inputParam)
    this.writeBLECharacteristicValue()
  },

  writeBLECharacteristicValue() {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = wx.getStorageSync('WRITE_SERVICEID')
    console.log('write!!! deviceId:', deviceId, ', serviceId:', serviceId, ', uuid:', WRITE_UUID)
    // 向蓝牙设备发送一个0x00的16进制数据
    // let buffer = new ArrayBuffer(1)
    // $CCYJCX,0*14
    let param = this.data.inputParam
    let requestHeader = getHeader(param)
    this.setData({
      'requestHeader': requestHeader,
      'requestLoading': true,
      'outputResult': '',
      'detail': {}
    })
    console.log('requestHeader:', requestHeader, ', responseHeader:', MAP[requestHeader])
    let buffer = stringToBytes(param + "\r\n")
    console.log("发送数据：", buffer)

    let that = this
    let dataView = new DataView(buffer)
    dataView.setUint8(0, 36)
    wx.writeBLECharacteristicValue({
      deviceId,
      serviceId,
      characteristicId: WRITE_UUID,
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res)

        if (that.data.isIphone === false) {
          const serviceIdNotify = wx.getStorageSync('NOTIFY_SERVICEID')
          wx.readBLECharacteristicValue({
            deviceId,
            serviceId: serviceIdNotify,
            characteristicId: NOTIFY_UUID,
            success: function (res) {
              console.log('readBLECharacteristicValue again')
            }
          })
        }
      }
    })
  },

  initNotify() {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = wx.getStorageSync('NOTIFY_SERVICEID')
    console.log('notify serviceId:', serviceId)
    let that = this
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId,
      serviceId,
      characteristicId: NOTIFY_UUID,
      success: function (res) {
        setTimeout(function () {
          that.setData({
            canSend: true
          })
        }, 1500);
        wx.showToast({
          title: '蓝牙通信开启成功',
          icon: 'success',
          duration: 2000
        })
        console.log('notifyBLECharacteristicValueChange success', res)
        // 操作之前先监听，保证第一时间获取数据
        wx.onBLECharacteristicValueChange((characteristic) => {
          console.log('onBLECharacteristicValueChange:', characteristic)

          let buffer = characteristic.value
          let dataView = new DataView(buffer)
          let head = dataView.getUint8(0).toString(16)
          console.log('onBLECharacteristicValueChange head', head)
          if ('24' !== head) {
            console.log('onBLECharacteristicValueChange 非法返回值', ab2hex(characteristic.value))
            return
          }
          console.log("拿到的数据")
          console.log("dataView.byteLength", dataView.byteLength)
          let valueShow = ''
          for (let i = 0; i < dataView.byteLength; i++) {
            // console.log("0x" + dataView.getUint8(i).toString(16))
            // console.log('char:', String.fromCharCode(parseInt(dataView.getUint8(i).toString(16),16)))
            // dataResult.push(dataView.getUint8(i).toString(16))
            valueShow += String.fromCharCode(parseInt(dataView.getUint8(i).toString(16), 16))
          }
          console.log('valueShow', valueShow)
          let requestHeader = that.data.requestHeader
          let responseHeader = MAP[requestHeader]
          let header = getHeader(valueShow)
          console.log('request:', requestHeader, ', response:', responseHeader, ', result:', header)
          if (responseHeader === header) {
            wx.showToast({
              title: '返回值解析成功',
              icon: 'success',
              duration: 1000
            })
            let end = valueShow.indexOf('*')
            let src = valueShow.substring(0, end);
            let keys = src.split(',')
            let length = keys.length
            let detail = {}
            for (let i=1;i<length;i++) {
              detail['key' + i] = keys[i]
            }
            console.log('detail', detail)
            that.setData({
              'detail': detail,
              'outputResult': valueShow,
              'requestLoading': false
            })
            
          }
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '蓝牙通信开启失败',
          duration: 4000
        })
        console.log('启动notify:', err);
      },
    })


  },
  toPageModify: function() {
    wx.navigateTo({
      url: '../test/test'
    })
  }
})