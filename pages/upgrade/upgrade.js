// pages/upgrade/upgrade.js
const NOTIFY_UUID = '0000FFE4-0000-1000-8000-00805F9B34FB'
const WRITE_UUID = '0000FFE9-0000-1000-8000-00805F9B34FB'

const PKG_SIZE = 1024

function hexStringToArrayBuffer(str) {
  if (!str) {
    return new ArrayBuffer(0);
  }
  var buffer = new ArrayBuffer(str.length / 2);
  let dataView = new DataView(buffer)
  let ind = 0;
  for (var i = 0, len = str.length; i < len; i += 2) {
    let code = parseInt(str.substr(i, 2), 16)
    dataView.setUint8(ind, code)
    ind++
  }
  return buffer;
}

function hexString2decimal(str) {
  if (!str) {
    return new ArrayBuffer(0);
  }
  let ind = 0;
  let result = 0
  for (var i = 0, len = str.length; i < len; i += 2) {
    let code = parseInt(str.substr(i, 2), 16)
    ind++
    result ^= code
  }
  return result < 16 ? '0' + result.toString(16).toUpperCase() : result.toString(16).toUpperCase();
}

// 字符串转16进制
function str2hex(str) {
  if (str === "") {
    return "";
  }
  var arr = [];
  arr.push("0x");
  for (var i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i).toString(16));
  }
  return arr.join('');
}

// 16进制转字符串
function hex2str(hex) {
  var trimedStr = hex.trim();
  var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    alert("Illegal Format ASCII Code!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16);
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
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
    address: 'https://huajietaojin.oss-cn-hangzhou.aliyuncs.com/beidou/bin/hfth05.bin',
    pkgCount: 0,
    totalCount: 0,
    filePath: '',
    update_press: null,
    beginCmd: '$1234,1,*12\r\n',
    endCmd: ''
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

    wx.setKeepScreenOn({
      keepScreenOn: true
    })
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
        // self.readBin()
        self.readHex()
        //console.log('res.data',typeof(res.data))
      },
      fail: function (err) {
        console.log('downloadFile err', err)
        self.setData({
          filePath: ''
        })
      }
    })
  },

  readBin: function () {
    var self = this
    var fs = wx.getFileSystemManager()
    fs.readFile({
      filePath: this.data.filePath,
      success: function (res) {
        //返回文件读取的内容
        console.log('readFile', res)
        let dataarr = res.data //这里就是读取出来的bin数据arrayBuffer 格式
      },
      fail: function (err) {
        console.log('readFile err', err)
      }

    })
  },

  readHex: function () {
    var self = this
    var fs = wx.getFileSystemManager()
    if (this.data.filePath.length < 1) {
      return
    }
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
        let totalCount = res.data.length / (PKG_SIZE * 2)
        self.setData({
          updata_buff: rrdata, //string格式的数据放这里
          updata_buff_cnt: 0,
          update_press: res.data.length,
          totalCount: totalCount
        })

        setTimeout(function () {
          self.writeBLECharacteristicValue(stringToBytes(self.data.beginCmd))
        }, 500)
      },
      fail: res => {
        console.log('xxxxx', res)
      }
    })
  },

  //发送一包数据
  sendBlePkg: function (pkgCount) {
    if (pkgCount < 1) {
      pkgCount = 1
    }
    if (this.data.filePath.length < 1 || this.data.totalCount < 1) {
      return
    }
    var self = this
    let totalCount = self.data.totalCount
    console.log('sendBlePkg totalCount', totalCount, 'pkgCount', pkgCount)
    self.setData({
      pkgCount: pkgCount
    })
    let limit = PKG_SIZE * 2
    let begin = (pkgCount - 1) * limit
    let tmpb = self.data.updata_buff.substr(begin, limit) // new ArrayBuffer(148)
    let length = tmpb ? tmpb.length : 0
    if (length === 0) {
      console.log('发结束的 length === 0')
      self.finishPkgSend();
      return
    }
    if (length != 0 && length < limit) {
      let add = limit - length
      for (let j = 0; j < add; j++) {
        tmpb += '0'
      }
    }
    length = tmpb ? tmpb.length : 0
    console.log('pkgCount', pkgCount, ', length', length, 'tmpb', tmpb)

    let cnt = pkgCount
    let cntHex = cnt < 16 ? '0' + cnt.toString(16).toUpperCase() : cnt.toString(16).toUpperCase();
    let param = '24' + cntHex + '0405' + tmpb // 0069 = PKR_SIZE + 5
    let hh = hexString2decimal(param)
    console.log('cntHex', cntHex, 'hh', hh)
    param = param + hh

    let paramLength = param.length
    console.log('pkgCount', pkgCount, 'paramLength', param.length, 'param', param)

    let psize = 100
    begin = 0
    for (; begin < paramLength;) {
      let part = param.substr(begin, psize)
      self.writeBLECharacteristicValue(hexStringToArrayBuffer(part))
      begin += psize
    }
  },

  finishPkgSend() {
    // 发结束的
    let endCmdStr = '2400000600'
    let endCmd = endCmdStr + hexString2decimal(endCmdStr)
    console.log('发结束的', endCmd)
    this.writeBLECharacteristicValue(hexStringToArrayBuffer(endCmd))

    wx.showToast({
      title: '设备重启中',
      icon: 'loading',
      duration: 4000
    })

    let self = this
    setTimeout(function () {
      self.setData({
        pkgCount: 0
      })
      wx.setStorageSync('REST_DEVICE', true)
      wx.navigateBack({
        delta: 1
      })
      
    }, 5000)
  },

  // 蓝牙方法
  writeBLECharacteristicValue(buffer) {
    const deviceId = wx.getStorageSync('CONNECT_DEVICEID')
    const serviceId = wx.getStorageSync('WRITE_SERVICEID')
    console.log('write!!! deviceId:', deviceId, ', serviceId:', serviceId, ', uuid:', WRITE_UUID, ', buffer', buffer)
    // 向蓝牙设备发送一个0x00的16进制数据
    // let buffer = new ArrayBuffer(1)
    // $CCYJCX,0*14
    // let param = this.data.inputParam
    // let buffer = stringToBytes(param)
    console.log("发送数据：", buffer)
    let self = this
    let isIphone = wx.getStorageSync('IS_IPHONE')
    let dataView = new DataView(buffer)
    // dataView.setUint8(0, 36)
    wx.writeBLECharacteristicValue({
      deviceId,
      serviceId,
      characteristicId: WRITE_UUID,
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res)
        // wx.showToast({
        //   title: self.data.pkgCount + '包成功',
        //   icon: 'success',
        //   duration: 1000
        // })
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
          console.log("dataView", dataView, "dataView.byteLength", dataView.byteLength)
          // 长度是6位的都是设备请求包的
          if (6 === dataView.byteLength) {
            // 第二位是第几包
            let count = parseInt(dataView.getUint8(1).toString(16), 16)
            console.log('设备请求包count', count)
            that.sendBlePkg(count)
          }
          // let valueShow = ''
          // for (let i = 0; i < dataView.byteLength; i++) {
          //   console.log("0x" + dataView.getUint8(i).toString(16))
          //   console.log('char:', String.fromCharCode(parseInt(dataView.getUint8(i).toString(16),16)))
          //   // dataResult.push(dataView.getUint8(i).toString(16))
          //   valueShow += String.fromCharCode(parseInt(dataView.getUint8(i).toString(16), 16))
          // }
          // console.log('valueShow', valueShow)
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