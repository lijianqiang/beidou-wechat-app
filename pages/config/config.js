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
  console.log(array);
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
    result: ''
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

  queryInfo: function () {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = wx.getStorageSync('CONNECT_SERVICEID')
    const characteristicId = wx.getStorageSync('CONNECT_CHARACTERISTICID')
    console.log('read!!! deviceId:', deviceId, ', serviceId:', serviceId, ', uuid:', characteristicId)
    // wx.readBLECharacteristicValue({
    //   deviceId,
    //   serviceId,
    //   characteristicId,
    //   success(res) {
    //     console.log('readBLECharacteristicValue:', res)
    //   }
    // })
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

    //
    this.writeBLECharacteristicValue()
  },

  writeBLECharacteristicValue() {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = wx.getStorageSync('CONNECT_SERVICEID')
    const characteristicId = wx.getStorageSync('CONNECT_CHARACTERISTICID')
    console.log('write!!! deviceId:', deviceId, ', serviceId:', serviceId, ', uuid:', characteristicId)
    // 向蓝牙设备发送一个0x00的16进制数据
    // let buffer = new ArrayBuffer(1)
    var buffer = stringToBytes("$CCYJCX,0*20\r\n")
    console.log("发送数据：", buffer) 
    
    let dataView = new DataView(buffer)
    dataView.setUint8(0, Math.random() * 255 | 0)
    wx.writeBLECharacteristicValue({
      deviceId,
      serviceId,
      characteristicId,
      value: buffer,
      success (res) {
        console.log('writeBLECharacteristicValue success', res)
      }
    })
  },
})