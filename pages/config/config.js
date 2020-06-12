// pages/config/config.js
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
    devices: [],
    connected: false,
    canWrite: false,
    chs: [],
    result: '',
    inputParam: '$CCYJCX,0*14',
    outputResult: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initNotify()

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
        valueShow += String.fromCharCode(parseInt(dataView.getUint8(i).toString(16),16))
      }
      console.log('valueShow', valueShow)
      this.setData({
        'outputResult': valueShow
      })

      //
      const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
      const data = {}
      if (idx === -1) {
        data[`chs[${this.data.chs.length}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      } else {
        data[`chs[${idx}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      }
      // data[`chs[${this.data.chs.length}]`] = {
      //   uuid: characteristic.characteristicId,
      //   value: ab2hex(characteristic.value)
      // }
      console.log('xxxxxxx data', data)
      this.setData(data)
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
    //
    console.log('input', this.data.inputParam)
    this.writeBLECharacteristicValue()
  },

  writeBLECharacteristicValue() {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = '0000FFE5-0000-1000-8000-00805F9B34FB' //wx.getStorageSync('CONNECT_SERVICEID')
    const characteristicId = '0000FFE9-0000-1000-8000-00805F9B34FB' //wx.getStorageSync('CONNECT_CHARACTERISTICID')
    console.log('write!!! deviceId:', deviceId, ', serviceId:', serviceId, ', uuid:', characteristicId)
    // 向蓝牙设备发送一个0x00的16进制数据
    // let buffer = new ArrayBuffer(1)
    // $CCYJCX,0*14
    var buffer = stringToBytes(this.data.inputParam + "\r\n")
    console.log("发送数据：", buffer)

    let dataView = new DataView(buffer)
    dataView.setUint8(0, 36)
    wx.writeBLECharacteristicValue({
      deviceId,
      serviceId,
      characteristicId,
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res)
      }
    })
  },

  readBLECharacteristicValue() {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = wx.getStorageSync('CONNECT_SERVICEID')
    const characteristicId = '0000ffe4-0000-1000-8000-00805f9b34fb' //wx.getStorageSync('CONNECT_CHARACTERISTICID')
    console.log('read!!! deviceId:', deviceId, ', serviceId:', serviceId, ', uuid:', characteristicId)
    wx.readBLECharacteristicValue({
      deviceId,
      serviceId,
      characteristicId,
      success(res) {
        console.log('readBLECharacteristicValue:', res)
      }
    })
    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      console.log('onBLECharacteristicValueChange:', characteristic)
      console.log('onBLECharacteristicValueChange string value:', ab2hex(characteristic.value))
      const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
      const data = {}
      if (idx === -1) {
        data[`chs[${this.data.chs.length}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      } else {
        data[`chs[${idx}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      }
      // data[`chs[${this.data.chs.length}]`] = {
      //   uuid: characteristic.characteristicId,
      //   value: ab2hex(characteristic.value)
      // }
      console.log('xxxxxxx data', data)
      this.setData(data)
    })
  },

  initNotify() {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = '0000FFE0-0000-1000-8000-00805F9B34FB' // wx.getStorageSync('CONNECT_SERVICEID')
    const characteristicId = '0000FFE4-0000-1000-8000-00805F9B34FB' //wx.getStorageSync('CONNECT_CHARACTERISTICID')

    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId,
      serviceId,
      characteristicId,
      success: function (res) {
        console.log('notifyBLECharacteristicValueChange success', res)
      },
      fail: function (err) {
        console.log('启动notify:', err);
      },
    })


  }
})