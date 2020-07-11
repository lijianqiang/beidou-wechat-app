// pages/power/power.js
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputParam: '$BDRMO,BSI,2,0*20',
    outputResult: '',
    requestHeader: '',
    requestLoading: false,
    canSend: false,
    isIphone: true,
    msgBegin: false,
    msgText: ''
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
    this.initNotify()
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

  queryInfo: function () {
    console.log('input', this.data.inputParam)
    this.writeBLECharacteristicValue(this.data.inputParam)

    let that = this
    setTimeout(function () {
      that.queryInfo()
    }, 2000);
  },

  writeBLECharacteristicValue(param) {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = wx.getStorageSync('WRITE_SERVICEID')
    console.log('write!!! deviceId:', deviceId, ', serviceId:', serviceId, ', uuid:', WRITE_UUID)

    this.setData({
      'requestLoading': true,
      'outputResult': '',
      'detail': {}
    })
    let buffer = stringToBytes(param + "\r\n")
    console.log("发送数据 param:", param, ', buffer:', buffer)

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
      },
      fail: function (err) {
        console.log('writeBLECharacteristicValue fail', err)
        if (10006 == err.errCode) {
          that.createBLEConnection()
        }
      }
    })
  },
  createBLEConnection() {
    console.log('-- createBLEConnection')
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const name = wx.getStorageSync('CONNECT_DEVICENAME')
    console.log('createBLEConnection')
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        this.setData({
          connected: true,
          name,
          deviceId,
        })
      },
      fail: (err) => {
        console.log('createBLEConnection fail', err)
      }
    })
  },

  initNotify() {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = wx.getStorageSync('NOTIFY_SERVICEID')
    console.log('initNotify serviceId:', serviceId, ', notifyuuid:', NOTIFY_UUID)
    let that = this
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: NOTIFY_UUID,
      success: function (res) {
        setTimeout(function () {
          that.queryInfo()
        }, 2000);
        wx.showToast({
          title: '蓝牙开启中',
          icon: 'loading',
          duration: 1500
        });
        console.log('notifyBLECharacteristicValueChange success', res)
        // 操作之前先监听，保证第一时间获取数据
        wx.onBLECharacteristicValueChange((characteristic) => {
          console.log('onBLECharacteristicValueChange:', characteristic)

          let buffer = characteristic.value
          let dataView = new DataView(buffer)
          let first = dataView.getUint8(0).toString(16)
          let last = dataView.getUint8(dataView.byteLength - 1).toString(16)
          console.log('拿到的数据 onBLECharacteristicValueChange byteLength=', dataView.byteLength, ', first=', first, ', last=', last)

          let valueShow = ''
          for (let i = 0; i < dataView.byteLength; i++) {
            valueShow += String.fromCharCode(parseInt(dataView.getUint8(i).toString(16), 16))
          }
          console.log('valueShow', valueShow)
          let responseHeader = '$BDBSI'
          if ('24' === first) {
            let header = getHeader(valueShow)
            if (responseHeader === header) {
              console.log('1.response:', responseHeader, ', receive result:', header)
              that.setData({
                msgBegin: true,
                msgText: valueShow
              })
            }
          }

          if (that.data.msgBegin && '24' !== first) {
            let msgText = that.data.msgText + valueShow
            that.setData({
              msgText: msgText
            })
          }

          if ('d' === last || 'a' === last || 'D' === last || 'A' === last) {
            let msg = that.data.msgText
            let header = getHeader(msg)
            console.log('2.response:', responseHeader, ', receive result:', header)
            if (responseHeader === header) {
              // wx.showToast({
              //   title: '解析成功',
              //   icon: 'success',
              //   duration: 1000
              // })
              let end = msg.indexOf('*')
              let src = msg.substring(0, end);
              let keys = src.split(',')
              let length = keys.length
              let value1 = keys[1]
              let value2 = keys[2]
              let value3 = ''
              for (let i = 3; i < length; i++) {
                if (i > 3) {
                  value3 += ','
                }
                value3 += keys[3]
              }
              console.log('value1:', value1, ', value2:', value2, ', value3:', value3)
              that.setData({
                'msgBegin': false,
                'msgText': '',
                'outputResult': msg,
                'requestLoading': false,
                'value1': value1,
                'value2': value2,
                'value3': value3
              })
            }
          }
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '蓝牙通知失败',
          icon: 'none',
          duration: 4000
        })
        console.log('启动notify:', err);
      },
    })
  },
})