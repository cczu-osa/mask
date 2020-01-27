let index = 0,
  items = [], flag=true,
  itemId=1;


const utils = require('../../utils/wxapi.js');

function headimgHD(imageUrl) {
  console.log('原来的头像', imageUrl);
  imageUrl = imageUrl.split('/');        //把头像的路径切成数组
  // 把大小数值为 46 || 64 || 96 || 132 的转换为0
  if (imageUrl[imageUrl.length - 1] && (imageUrl[imageUrl.length - 1] == 46 || imageUrl[imageUrl.length - 1] == 64 || imageUrl[imageUrl.length - 1] == 96 || imageUrl[imageUrl.length - 1] == 132)) {
    imageUrl[imageUrl.length - 1] = 0;
  }
  imageUrl = imageUrl.join('/');   //重新拼接为字符串
  console.log('高清的头像', imageUrl);
  return imageUrl;
}
const app = getApp()
const imgUrl = 'https://www.wlydy.com.cn/images/'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    curImg: '',
    index: 0,   // -1用于调用change函数，抵消第一次的+1操作
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    width: 500,
    imgList: [
      {
        // url:'https://s2.ax1x.com/2020/01/23/1Vhn8x.png',
        url: imgUrl+'mask/eye-1.ab4c711.png',
        selected: false
      },
      {
        // url:'https://s2.ax1x.com/2020/01/23/1VhmP1.png',
        url: imgUrl+'mask/eye-2.094ba3e.png',
        selected: false,
      },
      {
        // url:'https://s2.ax1x.com/2020/01/23/1VhEVJ.png',
        url: imgUrl+'mask/index.png',
        selected: false,
      },
      {
        // url:'https://s2.ax1x.com/2020/01/23/1Vhu26.png',
        url: imgUrl+'mask/mask-n95.436a016.png',
        selected: false
      },
      {
        // url:'https://s2.ax1x.com/2020/01/23/1VhKxK.png',
        url: imgUrl+'mask/mask-1.5a5a642.png',
        selected: false
      },
      {
        // url:'https://s2.ax1x.com/2020/01/23/1VhlrD.png',
        url: imgUrl+'mask/mask-n95-2.1bd4b9a.png',
        selected: false
      },
      {
        // url:'https://s2.ax1x.com/2020/01/23/1Vh1qe.png',
        url: 'mask/red-mask-2.e500d89.png',
        selected: false
      },
      {
        //  url: 'https://s2.ax1x.com/2020/01/23/1VhVa9.png',
        url: imgUrl+'mask/suit.a096a5a.png',
        selected: false
      },
      {
        //  url: 'https://s2.ax1x.com/2020/01/23/1VhQKO.png',
        url: imgUrl+'mask/surgical-mask-1.8b5052a.png',
        selected: false
      },
      {
        //  url: 'https://s2.ax1x.com/2020/01/23/1VhZ5R.png',
        url: imgUrl+'mask/surgical-mask-2.5010c6e.png',
        selected: false
      },
    ],
    itemList: [],
    sysData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    items= this.data.itemList;
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          sysData:res
        })
      },
    })
    this.setDropItem({
      url: '/images/1.png'
    });
    if (app.globalData.userInfo) {
      var url = headimgHD(app.globalData.userInfo.avatarUrl)
      this.setData({
        userInfo: app.globalData.userInfo,
        avatarUrl: url,
        hasUserInfo: true
      })
      console.log('info-1', this.data.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = info => {
        var url = headimgHD(info.userInfo.avatarUrl)
        wx.showLoading({
          title: '加载中...',
          icon: 'none'
        })
        wx.downloadFile({
          url: url,
          success: res => {
            app.globalData.avatarUrl = res.tempFilePath   // 全局头像地址是本地路径
            console.log('avatarUrl', res.tempFilePath);
            wx.hideLoading()
            this.setData({
              userInfo: info.userInfo,
              avatarUrl: res.tempFilePath,
              hasUserInfo: true
            })
          }
        })
        console.log('info-2', this.data.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      var url = headimgHD(res.userInfo.avatarUrl)
      wx.getUserInfo({
        success: res => {
          console.log(res.userInfo)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            avatarUrl: url,
            hasUserInfo: true
          })
        }
      })
      console.log('info-3', this.data.userInfo)          
    }

  },
  downloadImage:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index
    var imgList = this.data.imgList
    wx.downloadFile({
      url: imgList[index].url,
      success:res=>{
        console.log(res)
        imgList[index].url = res.tempFilePath
        this.setData({
          imgList: imgList
        })
      }
    })
  },
  // 打开弹窗/关闭弹窗
  powerDrawer: function (e) {
    if(e){  
      var currentStatu = e.currentTarget.dataset.statu;
    } else {// 兼容绘制的时候js调用
      var currentStatu = 'open'
    }
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  setNotActivate: function () {
    var list = this.data.itemList
    if (list.length == 0) {
      console.log('catchtap-0')
      return
    }
    console.log("catchtap")
    console.log(list)
    for (var i in list) {
      list[i]['active'] = false
    }
    this.setData({
      itemList: list
    })
  },

  selectImg: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var imgList = this.data.imgList
    imgList[index]['selected'] = !imgList[index]['selected']
    this.setData({
      imgList: imgList
    })
    var images = this.data.imgList
    this.setDropItem({
      url: images[index].url
    })
  },
  // onReady: function () {
  //   this.change()
  // },

  // change() {
  //   var list = this.data.imgList
  //   var index = this.data.index
  //   index = (index + 1) % list.length
  //   console.log('change', index)
  //   this.setData({
  //     index: index
  //   })
  //   wx.showToast({
  //     title: '绘制中...',
  //     icon: 'loading',
  //     duration: 100
  //   })
  //   setTimeout(this.draw, 100, this.data.avatarUrl)
  // },
  drawCanvas:function(){
    console.log('-------绘制-------')
    setTimeout(this.draw, 100, this.data.avatarUrl)    
  },
  draw: function (url) {
    console.log('url：', url)
    /**
     * items 是全局变量
     * 画布长宽都是300rpx，根据screenWidth的px换算rpx
     * k=750rpx/px
     * 画布是300rpx
     * num为canvas内背景图占canvas的百分比，若全背景num =1
     * prop值为canvas内背景的宽度与可移动区域的宽度的比，如一致，则prop =1;
     */
    var list = this.data.imgList
    var index = this.data.index
    console.log(index,list)
    var sysData = this.data.sysData
    var k = 750/this.data.sysData.screenWidth
    var canvasWidth = 300 / k;
    var num = 1
    // let prop = (canvasWidth * num) / (this.data.sysData.windowWidth * 0.75)
    let prop = 1
    // var avatarUrl = app.globalData.avatarUrl
    var context = wx.createCanvasContext('drawmask')
    // 绘制头像
    console.log('px：', Math.floor(300 / k))
    context.save();
    context.drawImage(url, 0, 0, Math.floor(300 / k), Math.floor(300 / k))
    // context.restore()
    // context.drawImage(list[index].url, 0, 0, 200, 200)
    items.forEach((currentValue, index) => {
      console.log(index,currentValue)
      context.save();
      // context.translate(canvasWidth * (1 - num) / 2, 10);
      // context.beginPath();
      context.translate(currentValue.x * prop, currentValue.y * prop); //圆心坐标
      context.rotate(currentValue.angle * Math.PI / 180); // 旋转值
      var _width = currentValue.width * currentValue.scale * prop
      var _height = currentValue.height * currentValue.scale * prop
      console.log('width',_width,'height',_height)
      context.translate(-currentValue.x * prop, -currentValue.y * prop); // 撤销圆心坐标
      // context.translate(-_width, -_height)
      context.drawImage(currentValue.image, currentValue.left - (225/k), currentValue.top, _width, _height);
      // context.drawImage(currentValue.image, 0, 0, currentValue.width, currentValue.height);
      context.restore();
    })
    context.stroke()
    context.draw()
    this.powerDrawer()
  },
  chooseImg: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'], // 从相册选择
      success: res => {
        console.log(res)
        // this.draw(res.tempFilePaths[0])
        this.setData({
          avatarUrl:res.tempFilePaths[0]
        })
      },
    })
  },

  save: function () {
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'drawmask',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          img: tempFilePath
        })
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: res => {
            wx.showToast({
              title: '保存成功',
            })
          }
        })
        console.log(tempFilePath)
      },
      fail: function (res) {
        console.log(res);
      },
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log(e)
    if (e.detail.userInfo) {
      var info = e.detail.userInfo
      info.avatarUrl = headimgHD(info.avatarUrl)
      this.setData({
        userInfo: info,
        avatarUrl: info.avatarUrl,
        hasUserInfo: true
      })
      var avatarUrlHD = headimgHD(info.avatarUrl)
      wx.downloadFile({
        url: avatarUrlHD,
        success: (res) => {
          app.globalData.avatarUrl = res.tempFilePath   // 全局头像地址是本地路径
          console.log('avatarUrl', res.tempFilePath);
          this.change()
        }
      })
    }
    console.log("getUserInfo", this.data.userInfo)
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
    console.log('onUnload')
    wx.removeSavedFile({
      filePath: app.globalData.avatarUrl,
    })
  },
  // 233333333333333333333333333333333333333333333333
  setDropItem(imgData) {
    let data = {},
      _this = this;
      wx.showLoading({
        title: '获取图片中...',
        icon:'none'
      })
    wx.getImageInfo({
      src: imgData.url,
      success: res => {
        // 初始化数据
        var k = res.width / 100;
        // w = res.width/(res.width/100)
        data.width = res.width/k;     // 宽度
        data.height = res.height/k;  // 高度
        data.image = imgData.url; //地址
        data.id = ++itemId;//id
        data.top = (items.length) * 20;     // top定位
        data.left = 150 + items.length * 20;    //left定位
        // 圆心坐标
        data.x = data.left + data.width / 2;
        data.y = data.top + data.height/2;
        data.scale = 1;//scale缩放
        data.oScale = 1;//方向缩放
        data.rotate = 1;//旋转角度
        data.active = false;//选中状态
        data.angle = 0
        console.log(data)
        items[items.length] = data;
        _this.setData({
          itemList: items
        })
        wx.hideLoading()
      },
      fail:res=>{
        wx.hideLoading()
        wx.showToast({
          title: '获取图片信息失败！',
          icon:'none'
        })
      }
    })
  },
  WraptouchStart: function (e) {
    for (let i = 0; i < items.length; i++) {
      items[i].active = false;
      if (e.currentTarget.dataset.id == items[i].id) {
        index = i;
        items[index].active = true;
      }
    }
    this.setData({
      itemList: items
    })

    items[index].lx = e.touches[0].clientX;
    items[index].ly = e.touches[0].clientY;

    console.log(items[index])
  },
  WraptouchMove: function(e) {
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 100)
    }
    // console.log('WraptouchMove', e)
    items[index]._lx = e.touches[0].clientX;
    items[index]._ly = e.touches[0].clientY;

    items[index].left += items[index]._lx - items[index].lx;
    items[index].top += items[index]._ly - items[index].ly;
    items[index].x += items[index]._lx - items[index].lx;
    items[index].y += items[index]._ly - items[index].ly;

    items[index].lx = e.touches[0].clientX;
    items[index].ly = e.touches[0].clientY;
    console.log(items)
    this.setData({
      itemList: items
    })
  },
  oTouchStart: function (e) {
    //找到点击的那个图片对象，并记录
    for (let i = 0; i < items.length; i++) {
      items[i].active = false;
      if (e.currentTarget.dataset.id == items[i].id) {
        console.log('e.currentTarget.dataset.id', e.currentTarget.dataset.id)
        index = i;
        items[index].active = true;
      }
    }
    //获取作为移动前角度的坐标
    items[index].tx = e.touches[0].clientX;
    items[index].ty = e.touches[0].clientY;
    //移动前的角度
    items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)
    //获取图片半径
    items[index].r = this.getDistancs(items[index].x, items[index].y, items[index].left, items[index].top);
    console.log(items[index])
  }
  ,
  oTouchMove: function (e) {
    if (flag) {
      flag = false;
      setTimeout(()=>{
        flag= true;
      },100)
    }
    //记录移动后的位置
    items[index]._tx = e.touches[0].clientX;
    items[index]._ty = e.touches[0].clientY;
    //移动的点到圆心的距离
    items[index].disPtoO = this.getDistancs(items[index].x, items[index].y, items[index]._tx , items[index]._ty - 10)

    items[index].scale = items[index].disPtoO / items[index].r; 
    items[index].oScale = 1 / items[index].scale;

    //移动后位置的角度
    items[index].angleNext = this.countDeg(items[index].x, items[index].y, items[index]._tx, items[index]._ty)
    //角度差
    items[index].new_rotate = items[index].angleNext - items[index].anglePre;

    //叠加的角度差
    items[index].rotate += items[index].new_rotate;
    items[index].angle = items[index].rotate; //赋值

    //用过移动后的坐标赋值为移动前坐标
    items[index].tx = e.touches[0].clientX;
    items[index].ty = e.touches[0].clientY;
    items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)

    //赋值setData渲染
    this.setData({
      itemList: items
    })

  },
  getDistancs(cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    return Math.sqrt(
      ox * ox + oy * oy
    );
  },
  /*
     *参数1和2为图片圆心坐标
     *参数3和4为手点击的坐标
     *返回值为手点击的坐标到圆心的角度
     */
  countDeg: function (cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    var to = Math.abs(ox / oy);
    var angle = Math.atan(to) / (2 * Math.PI) * 360;
    // console.log("ox.oy:", ox, oy)
    if (ox < 0 && oy < 0)//相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系  
    {
      angle = -angle;
    } else if (ox <= 0 && oy >= 0)//左下角,3象限  
    {
      angle = -(180 - angle)
    } else if (ox > 0 && oy < 0)//右上角，1象限  
    {
      angle = angle;
    } else if (ox > 0 && oy > 0)//右下角，2象限  
    {
      angle = 180 - angle;
    }
    return angle;
  },
  deleteItem: function (e) {
    let newList = [];
    for (let i = 0; i < items.length; i++) {
      if (e.currentTarget.dataset.id != items[i].id) {
        newList.push(items[i])
      }
    }
    if (newList.length > 0) {
      newList[newList.length - 1].active = true;
    }
    items = newList;
    this.setData({
      itemList: items
    })
  },
})