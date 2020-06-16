// pages/modify/modify.js
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
  '$CCDLCX': '$HFDLXX',
  '$CCBBCX': '$HFBBXX',
  '$CCREST': '设备复位'
}

const REQUEST_CODE = {
  '$CCYJCX': '2',
  '$CCYDPD': '4',
  '$CCYDDK': '6',
  '$CCBDSZ': '8',
  '$CCGPSZ': '10',
  '$CCLYSZ': '12',
  '$CCXLSZ': '14',
  '$CCCKSZ': '16',
  '$CCRZSZ': '18',
  '$CCGJSZ': '20',
  '$CCDLCX': '22',
  '$CCBBCX': '26',
  '$CCREST': '28'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
     detail4: {},
     detail6: {},
     detail8: {},
     detail10: {},
     detail12: {},
     detail14: {},
     detail16: {},
     detail18: {},
     detail20: {},
     detail22: {},
     detail24: {},
     detail26: {},

    devices: [],
    connected: false,
    canWrite: false,
    result: '',
    inputParam: '$CCYJCX,0*14',
    outputResult: '',
    requestHeader: '',
    requestLoading: false,
    canSend: false,
    isIphone: true,
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
  
  // 4
  input_4_1: function (e) {
    console.log('4_1', e.detail.value)
    let detail = this.data.detail4
    detail.key1 = e.detail.value
    this.setData({
      'detail4': detail
    })
  },
  input_4_2: function (e) {
    console.log('4_2', e.detail.value)
    let detail = this.data.detail4
    detail.key2 = e.detail.value === true ? '1' : '0'
    this.setData({
      'detail4': detail
    })
  },
  query4: function () {
    let content = 'CCYDPD,0,0,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query4 request', request)
    this.writeBLECharacteristicValue(request)
  },
  update4: function () {
    let detail = this.data.detail4
    let content = 'CCYDPD,1,' + detail.key1 + ',' + detail.key2
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('update4 request', request)
    this.writeBLECharacteristicValue(request)
  },

  // 6
  input_6_1: function (e) {
    console.log('6_1', e.detail.value)
    let detail = this.data.detail6
    detail.key1 = e.detail.value
    this.setData({
      'detail6': detail
    })
  },
  input_6_2: function (e) {
    console.log('6_2', e.detail.value)
    let detail = this.data.detail6
    detail.key2 = e.detail.value
    this.setData({
      'detail6': detail
    })
  },
  query6: function () {
    let content = 'CCYDDK,0,0,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query6 request', request)
    this.writeBLECharacteristicValue(request)
  },
  update6: function () {
    let detail = this.data.detail6
    let content = 'CCYDDK,1,' + detail.key1 + ',' + detail.key2
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('update6 request', request)
    this.writeBLECharacteristicValue(request)
  },

  // 8
  input_8_1: function (e) {
    console.log('8_1', e.detail.value)
    let detail = this.data.detail8
    detail.key1 = e.detail.value
    this.setData({
      'detail8': detail
    })
  },
  input_8_2: function (e) {
    console.log('8_2', e.detail.value)
    let detail = this.data.detail8
    detail.key2 = e.detail.value
    this.setData({
      'detail8': detail
    })
  },
  input_8_3: function (e) {
    console.log('8_3', e.detail.value)
    let detail = this.data.detail8
    detail.key3 = e.detail.value === true ? '1' : '0'
    this.setData({
      'detail8': detail
    })
  },
  query8: function () {
    let content = 'CCBDSZ,0,0,0,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query8 request', request)
    this.writeBLECharacteristicValue(request)
  },
  update8: function () {
    let detail = this.data.detail8
    let content = 'CCBDSZ,1,' + detail.key1 + ',' + detail.key2 + ',' + detail.key3
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('update8 request', request)
    this.writeBLECharacteristicValue(request)
  },

  // 10
  input_10_1: function (e) {
    console.log('10_1', e.detail.value)
    let detail = this.data.detail10
    detail.key1 = e.detail.value === true ? '1' : '0'
    this.setData({
      'detail10': detail
    })
  },
  query10: function () {
    let content = 'CCGPSZ,0,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query10 request', request)
    this.writeBLECharacteristicValue(request)
  },
  update10: function () {
    let detail = this.data.detail10
    let content = 'CCGPSZ,1,' + detail.key1
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('update10 request', request)
    this.writeBLECharacteristicValue(request)
  },

  // 12
  input_12_1: function (e) {
    console.log('12_1', e.detail.value)
    let detail = this.data.detail12
    detail.key1 = e.detail.value === true ? '1' : '0'
    this.setData({
      'detail12': detail
    })
  },
  query12: function () {
    let content = 'CCLYSZ,0,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query12 request', request)
    this.writeBLECharacteristicValue(request)
  },
  update12: function () {
    let detail = this.data.detail12
    let content = 'CCLYSZ,1,' + detail.key1
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('update12 request', request)
    this.writeBLECharacteristicValue(request)
  },
  // 14
  input_14_1: function (e) {
    console.log('14_1', e.detail.value)
    let detail = this.data.detail14
    detail.key1 = e.detail.value
    this.setData({
      'detail14': detail
    })
  },
  query14: function () {
    let content = 'CCXLSZ,0,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query14 request', request)
    this.writeBLECharacteristicValue(request)
  },
  update14: function () {
    let detail = this.data.detail14
    let content = 'CCXLSZ,1,' + detail.key1
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('update14 request', request)
    this.writeBLECharacteristicValue(request)
  },

  // 16
  input_16_1: function (e) {
    console.log('16_1', e.detail.value)
    let detail = this.data.detail16
    detail.key1 = e.detail.value
    this.setData({
      'detail16': detail
    })
  },
  input_16_2: function (e) {
    console.log('16_2', e.detail.value)
    let detail = this.data.detail16
    detail.key2 = e.detail.value === true ? '1' : '0'
    this.setData({
      'detail16': detail
    })
  },
  query16: function () {
    let content = 'CCCKSZ,0,0,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query16 request', request)
    this.writeBLECharacteristicValue(request)
  },
  update16: function () {
    let detail = this.data.detail16
    let content = 'CCCKSZ,1,' + detail.key1 + ',' + detail.key2
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('update16 request', request)
    this.writeBLECharacteristicValue(request)
  },
  // 18
  input_18_1: function (e) {
    console.log('18_1', e.detail.value)
    let detail = this.data.detail18
    detail.key1 = e.detail.value === true ? '1' : '0'
    this.setData({
      'detail18': detail
    })
  },
  query18: function () {
    let content = 'CCRZSZ,0,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query18 request', request)
    this.writeBLECharacteristicValue(request)
  },
  update12: function () {
    let detail = this.data.detail18
    let content = 'CCRZSZ,1,' + detail.key1
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('update18 request', request)
    this.writeBLECharacteristicValue(request)
  },
  // 20
  input_20_1: function (e) {
    console.log('20_1', e.detail.value)
    let detail = this.data.detail20
    detail.key1 = e.detail.value
    this.setData({
      'detail20': detail
    })
  },
  input_20_2: function (e) {
    console.log('20_2', e.detail.value)
    let detail = this.data.detail20
    detail.key2 = e.detail.value
    this.setData({
      'detail20': detail
    })
  },
  input_20_3: function (e) {
    console.log('20_3', e.detail.value)
    let detail = this.data.detail20
    detail.key3 = e.detail.value
    this.setData({
      'detail20': detail
    })
  },
  query20: function () {
    let content = 'CCGJSZ,0,0,0,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query20 request', request)
    this.writeBLECharacteristicValue(request)
  },
  update20: function () {
    let detail = this.data.detail20
    let content = 'CCGJSZ,1,' + detail.key1 + ',' +  + detail.key2 + ',' +  + detail.key3
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('update20 request', request)
    this.writeBLECharacteristicValue(request)
  },

  // 22
  query22: function () {
    let content = 'CCDLCX,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query22 request', request)
    this.writeBLECharacteristicValue(request)
  },

  // 26
  query26: function () {
    let content = 'CCBBCX,0'
    let request = '$' + content + '*' + str2decimal(content) + '\r\n'
    console.log('query22 request', request)
    this.writeBLECharacteristicValue(request)
  },

  // 蓝牙方法
  writeBLECharacteristicValue(param) {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = wx.getStorageSync('WRITE_SERVICEID')
    console.log('write!!! deviceId:', deviceId, ', serviceId:', serviceId, ', uuid:', WRITE_UUID, ', param', param)
    // 向蓝牙设备发送一个0x00的16进制数据
    // let buffer = new ArrayBuffer(1)
    // $CCYJCX,0*14
    // let param = this.data.inputParam
    let requestHeader = getHeader(param)
    this.setData({
      'requestHeader': requestHeader,
      'requestLoading': true,
      'outputResult': '',
      'detail': {}
    })
    console.log('requestHeader:', requestHeader, ', responseHeader:', MAP[requestHeader])
    let buffer = stringToBytes(param)
    console.log("发送数据：", buffer)

    let isIphone = wx.getStorageSync('IS_IPHONE')
    let dataView = new DataView(buffer)
    dataView.setUint8(0, 36)
    wx.writeBLECharacteristicValue({
      deviceId,
      serviceId,
      characteristicId: WRITE_UUID,
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res)
        wx.showToast({
          title: '指令执行成功',
          icon: 'success',
          duration: 2000
        })
        if (isIphone === false) {
          const serviceIdNotify = wx.getStorageSync('NOTIFY_SERVICEID')
          wx.readBLECharacteristicValue({
            deviceId,
            serviceId: serviceIdNotify,
            characteristicId: NOTIFY_UUID,
            success: function (res1) {
              console.log('readBLECharacteristicValue again', res1)
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
        }, 1200);
        // wx.showToast({
        //   title: '蓝牙通信开启成功',
        //   icon: 'success',
        //   duration: 2000
        // })
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
              title: '解析成功',
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
            let requestCode = REQUEST_CODE[requestHeader]
            let detailKey = 'detail' + requestCode
            console.log('requestCode:', requestCode, ', detailKey:', detailKey, ', detail', detail)
            that.setData({
              [detailKey]: detail,
              'requestHeader': '',
              'outputResult': valueShow,
              'requestLoading': false
            })
            
          }
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '蓝牙通信失败',
          icon: 'none',
          duration: 8000
        })
        console.log('启动notify:', err);
      },
    })
  },
})