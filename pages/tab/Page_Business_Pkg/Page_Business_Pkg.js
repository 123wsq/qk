// pages/tab/Page_Business_Pkg/Page_Business_Pkg.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isActive: null,
    curIndex:'',
    indexMarginTop:0,
    indexHeight:0,
    hiddenIndexDialog: true,

    sideBar:[
      "#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
      "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ],
    scrollPosition:0,
    lineHeight:0,
    scroolHeight: 0,
    isAndroid: false,
    primitive:[], //原始数据
    constantData:[] //页面显示的数据

  },

  //右侧索引属性
    endWords:'',
    isNum:'',
    scrollTopId:'',
  //侧滑属性
    swipeCheckX: 35, //激活检测滑动的阈值
    swipeCheckState: 0, //0未激活 1激活
    maxMoveLeft: 230, //消息列表项最大左滑距离
    correctMoveLeft: 220, //显示菜单时的左滑距离
    thresholdMoveLeft: 75,//左滑阈值，超过则显示菜单
    lastShowMsgId: '', //记录上次显示菜单的消息id
    moveX: 0,  //记录平移距离
    showState: 0, //0 未显示菜单 1显示菜单
    touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
    swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (!app.isEmpty(wx.getStorageSync('shareData'))) {
          let shareData = JSON.parse(wx.getStorageSync('shareData'));
          shareData.isShareData = true;
          if (!app.isEmpty(shareData.custom_detail_url)) {
              wx.navigateTo({
                  url: '/pages/user/web/Web_view/Web_view?data=' + JSON.stringify(shareData),
              })
              return;
          }
          if (!app.isEmpty(shareData.id)) {
              wx.navigateTo({
                  url: '/pages/user/business/details/Business_Details/Business_Details?data=' + JSON.stringify(shareData),
              })
          }
          wx.setStorageSync("shareData", '');
      }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.hideShareMenu({})
    let that = this;
      let query = wx.createSelectorQuery();
      query.select('.view_right').boundingClientRect()
      query.exec(function (res) {
          that.setData({
              indexHeight: res[0].height,
              indexMarginTop: res[0].top+10,

          })
      });
  },
    


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      let that = this;
      wx.getSystemInfo({
          success: function (res) {
              let height = res.screenHeight - 200;
              that.setData({
                  scroolHeight: height,
                  horizontalWidth: res.screenWidth - 30,
                  isAndroid: res.system.indexOf('Android') != -1 ? true : false
              })
          },
          fail: function (res) { },
          complete: function (res) { },
      });


      let url = app.onGetUrls('CONTACT_LIST');
      app.onHttpRequest(url,'POST',{
          token: wx.getStorageSync('token')
      }, function(data){
          that.onInitData(data);
      });
      
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  onInitData: function(data){

      //设置拼音 简拼 首字母等
      for (let i = 0; i < data.length; i++) {
          let name = data[i].name;
          let pinyin = app.chineseToPinyin(name);
          let pyArrays = pinyin.split(',');
          let spell = '';
          for (let j = 0; j < pyArrays.length; j++) {
              spell += pyArrays[j].substr(0, 1);
          }
          data[i].spell = spell;
          let first = pinyin.substr(0, 1);
          data[i].name_zh = pinyin;
          data[i].initials = first.toUpperCase();
          data[i].family = name.substr(0, 1);
          data[i].search_start = name;
          data[i].search_center = '';
          data[i].search_end = '';
          let type = data[i].type;
          if (type == 2) {
              data[i].initials = '#';
          }
      }
      this.setData({
          primitive: data
      })
      let collectData = new Array();
      let focusData = new Array();
      for (let i = 0; i < data.length; i++) {
          let type = data[i].type;
          if (type == 2) {
              focusData.push(data[i]);
          } else {
              collectData.push(data[i]);
          }
      }
      let newData = new Array();
      newData.push(focusData);
      newData.push(collectData);

      this.sortArrays(newData);
  },
  sortArrays: function(arr){
      for(let i=0; i< arr.length; i++){
          arr[i].sort(function (obj, obj2) {
              if (obj.name_zh < obj2.name_zh) {
                  return -1;
              } else if (obj.name_zh > obj2.name_zh) {
                  return 1;
              } else {
                  return 0;
              }
          });
      }
      
      this.setData({
          constantData: arr
      })

  },
    
    /**
     * 搜索框输入监听
     */
    onInputChangeListener: function(e){
        this.onTextChangeListener(e.detail.value);
    },
    /**
     * 开始触摸全部开始选择
     */
    onStartTouchListener: function(e){
        this.setData({
            trans: ".3",
            hiddenIndexDialog: false
        })
    },
    /**
     * 触摸结束
     */
    onEndTouchListener: function(e){
        //如果需要在手指触摸结束后再滚到指定的位置，则只需要将下面注释打开 再在onMoveTouchListener中将下面代码注释，就会执行
        // let scrollPosition;
        // let curIndex;
        // //开始更新数据
        // if (this.endWords == '#') {
        //     scrollPosition = 0;
        //     curIndex = this.endWords;
        // } else {
        //     let data = this.data.constantData[1];
        //     let indexCount = 1; //计算标题索引的个数
        //     let groupTotalHeight = 35 * 2;

        //     for (var i = 0; i < data.length; i++) {
        //         try {
        //             let curInitials = data[i].initials;

        //             let upInitials = data[i + 1].initials;
        //             if (curInitials != upInitials) {
        //                 indexCount++;
        //             }
        //         } catch (e) {
        //         }

        //         if (data[i].initials == this.endWords) {
        //             //特别关注的个数
        //             let focuslength = this.data.constantData[0].length;
        //             //当前选中索引的第一个item的位置
        //             let position = i + focuslength;

        //             let indexTotalHeight = indexCount * 30;
        //             //索引的总高度
        //             indexTotalHeight = Math.round(indexTotalHeight * 100) / 100;
        //             //滚动的位置= 索引高度+ group高度+item*count 
        //             let moveDistance = indexTotalHeight + groupTotalHeight + (position * 71);

        //             scrollPosition = moveDistance;
        //             curIndex = this.endWords;
        //             break;
        //         }
        //     }
        // }


        this.setData({
            trans: "0",
            hiddenIndexDialog: true,
            // scrollPosition: scrollPosition,
            // curIndex: curIndex,
            
        })
    },
    /**
     * 开始触摸索引
     */
    onStartTouchIndexListener: function(e){
        var id = e.currentTarget.dataset.id;
        this.endWords = id;
        this.isNum = id;
    },
    /**
     * 选择结束
     */
    onEndTouchIndexListener: function(e){
        var id = e.currentTarget.dataset.id;
        
    },
    /**
     * index点击事件
     */
    onClickIndexListener: function(e){
        let hash = e.currentTarget.dataset.hash;
        this.endWords = hash;
        this.onScrollPositionListener();
    },
    onMoveTouchListener: function(e){
 
    /**
     * 此处开始是在计算当前选中的index
     */
        var y = e.touches[0].clientY;
        var offsettop = e.currentTarget.offsetTop;
        var height = this.data.scroolHeight;
        var that = this;
        var cityarr = this.data.sideBar;
        let indexHeight = that.data.indexHeight;
        let itemHeight = Math.round((indexHeight / 27) * 100) / 100;



        //判断选择区域,只有在选择区才会生效
        if (y > offsettop && y-130 < height) {
            // console.log((y-offsettop)/lineHeight)
            var num = parseInt((y - offsettop) / itemHeight);
            // 这里 把endWords 绑定到this 上，是为了手指离开事件获取值
                that.endWords = cityarr[num];
        };



        //去除重复，为了防止每次移动都赋值 ,这里限制值有变化后才会有赋值操作，
        //DOTO 这里暂时还有问题，还是比较卡，待优化
        if (this.isNum != num) {
            this.isNum = num;
            this.onScrollPositionListener();
        }

    },
    /**
     * 滚动位置
     */
    onScrollPositionListener: function(){
        let scrollPosition="";
        let curIndex ="";
        /***
         * 在此处时是计算scroll滚动距离
         */
        //开始更新数据
        if (this.endWords == '#') {
            scrollPosition = 0;
            curIndex = this.endWords;
        } else {
            let data = this.data.constantData[1];
            let indexCount = 1; //计算标题索引的个数
            let groupTotalHeight = 35 * 2;

            for (var i = 0; i < data.length; i++) {
                try {
                    let curInitials = data[i].initials;

                    let upInitials = data[i + 1].initials;
                    if (curInitials != upInitials) {
                        indexCount++;
                    }
                } catch (e) {
                }

                if (data[i].initials == this.endWords) {
                    //特别关注的个数
                    let focuslength = this.data.constantData[0].length;
                    //当前选中索引的第一个item的位置
                    let position = i + focuslength;

                    let indexTotalHeight = indexCount * 30;
                    //索引的总高度
                    indexTotalHeight = Math.round(indexTotalHeight * 100) / 100;
                    //滚动的位置= 索引高度+ group高度+item*count 
                    let moveDistance = indexTotalHeight + groupTotalHeight + (position * 71);

                    scrollPosition = moveDistance;
                    curIndex = this.endWords;
                    break;
                }
            }
        }
        this.setData({
            showwords: this.endWords,
            scrollPosition: scrollPosition,
            curIndex: curIndex,
        })
    },

    
    /**
     * 输入框内容发生变化的时候执行
     */
    onTextChangeListener: function(str){
        str = str.toLowerCase();
        let searchData = new Array();
        searchData.splice(0)
        let data = this.data.primitive;
        //根据输入的字符查询
        if (app.isChinese(str)){
            for (let i = 0; i < data.length; i++){
                let name = data[i].name;
                let index = name.indexOf(str);
                if(index != -1){
                    data[i].search_start = name.substring(0, index);
                    data[i].search_center = str;
                    data[i].search_end = name.substring(index + str.length);
                    searchData.push(data[i]);
                }
            }
        }else {
            
            for(let i=0; i< data.length; i++){
                let name = data[i].name;
                let pinyin = data[i].name_zh;
                let spell=data[i].spell;
                let index = spell.indexOf(str);
                
                if (index != -1) { //匹配简拼
                    data[i].search_start = name.substring(0, index);
                    data[i].search_center = name.substr(index, str.length);
                    data[i].search_end = name.substring(index +str.length);
                    searchData.push(data[i]);
                }else{  //匹配拼音
                   
                    let pyArrays = pinyin.split(',');
                    let py = pyArrays.join('');
                    let p = py.indexOf(str);
                    let startP = -1, endP= -1;
                    for(let j=0;j<pyArrays.length; j++){
                        let start = str.indexOf(pyArrays[j]);
                        if (start ==0){
                            startP =j;
                        }
                        if (str.endsWith(pyArrays[j])) {
                            endP = j + 1;
                        }

                    }
                    if (parseInt(startP) != -1  && parseInt(endP) != -1) {
                        
                        data[i].search_start = (p == 0 ? "" : name.substring(0, startP));
                        data[i].search_center = (name.substring(startP, endP));
                        data[i].search_end = (name.substring(endP));
                        searchData.push(data[i]);
                    }

                }
            }
        }
        
        let collectData = new Array();
        let focusData = new Array();
        for (let i = 0; i < searchData.length; i++) {
            let type = searchData[i].type;
            if (type == 2) {
                focusData.push(searchData[i]);
            } else {
                collectData.push(searchData[i]);
            }
        }
        let newData = new Array();
        newData.push(focusData);
        newData.push(collectData);
        this.sortArrays(newData);
    },
    onItemClickListener: function(e){
        let data = e.currentTarget.dataset.grid;
        if (app.isEmpty(data.custom_detail_url)){
            wx.navigateTo({
                url: '/pages/user/business/details/Business_Details/Business_Details?data=' + JSON.stringify(data),
            })
        }else{
            let json = {
                custom_detail_url: data.custom_detail_url,
                id: data.id,
            }
            wx.navigateTo({
                url: '/pages/user/web/Web_view/Web_view?data=' + JSON.stringify(json),
            })
        }
        
    },



    /**
     * 菜单按钮事件
     */
    onClickMenuListener: function(e){
        if (this.showState === 1) {
            this.touchStartState = 1;
            this.showState = 0;
            this.moveX = 0;
            this.translateXMsgItem(this.lastShowMsgId, 0, 200);
            this.lastShowMsgId = "";
        }
        let that = this;
        let type = e.currentTarget.dataset.type;
        let curData = this.data.constantData[type[1]][type[2]];
        let totalData = this.data.constantData;
        let primitive = this.data.primitive;
        if(type[0] ==0){ //表示置顶或者取消置顶

            let curState = curData.type;
            app.onHttpRequest(app.onGetUrls('UPDATE_FOCUS') + '/' + curData.id,'GET',{
                token: wx.getStorageSync('token'),
                type: curState == 2 ? '0' : '2',
            }, function(data){
                that.onShow();
            });

        }else if(type[0]==1){ //编辑
            wx.navigateTo({
                //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
                url: '/pages/user/business/edit/Edit_Business/Edit_Business?data=' + JSON.stringify(curData),
                success: function () { }        //成功后的回调；

            })
        }else{  //删除

            wx.showModal({
                title: '提示',
                content: '您确定要删除 ' + curData.name + " 吗",
                success: function (res) {
                    if (res.confirm) {
                        let delUrls = app.onGetUrls('DELETE_BUSNESS') + '/' + curData.id;
                        app.onHttpRequest(delUrls, 'GET', { token: wx.getStorageSync('token')}, function(data){
                            totalData[type[1]].splice(type[2], 1);
                            
                            //删除原始数据
                            for (var i = 0; i < primitive.length; i++) {
                                if (primitive[i].id == curData.id) {
                                    primitive.splice(i, 1);
                                    continue;
                                }
                            }
                            that.setData({
                                constantData: totalData,
                                primitive: primitive
                            })
                        });
                        
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    /**
         * 拍照识别
         */
    onCameraDiscernClickListner: function (e) {
        let _this = this;
        wx.authorize({
            scope: 'scope.camera',
            success: function (res) {

                wx.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],
                    sourceType: ['camera'],
                    success: function (res) {
                        // var files = res.tempFiles;//[{path:"wxfile://tmp_b5ad1d89c409d0e118234cdf6d72b27f.jpg", size:''}]
                        let path = res.tempFilePaths[0];
                        wx.navigateTo({
                            url: '/pages/user/business/preview/Preview_business/Preview_business?path=' + path,
                        })
                        // _this.onXFyunOcr(path);
                    },
                    fail: function (res) {
                    },
                    complete: function (res) {

                    },
                })

            },
            fail: function (res) {
            },
            complete: function (res) {
                console.log(res);
            },
        })

    },
    onTouchStartListener: function (e) {
        if (this.showState === 1) {
            this.touchStartState = 1;
            this.showState = 0;
            this.moveX = 0;
            this.translateXMsgItem(this.lastShowMsgId, 0, 500);
            this.lastShowMsgId = "";
            return;
        }
        this.firstTouchX = e.touches[0].clientX;
        this.firstTouchY = e.touches[0].clientY;
        if (this.firstTouchX > this.swipeCheckX) {
            this.swipeCheckState = 1;
        }
        this.lastMoveTime = e.timeStamp;
    },
    onTouchMoveListener: function (e) {
        if (this.swipeCheckState === 0) {
            return;
        }
        //当开始触摸时有菜单显示时，不处理滑动操作
        if (this.touchStartState === 1) {
            return;
        }
        var moveX = e.touches[0].clientX - this.firstTouchX;
        var moveY = e.touches[0].clientY - this.firstTouchY;
        //已触发垂直滑动，由scroll-view处理滑动操作
        if (this.swipeDirection === 2) {
            return;
        }
        //未触发滑动方向
        if (this.swipeDirection === 0) {
            //触发垂直操作
            if (Math.abs(moveY) > 4) {
                this.swipeDirection = 2;

                return;
            }
            //触发水平操作
            if (Math.abs(moveX) > 4) {
                this.swipeDirection = 1;
                this.setData({ scrollY: false });
            }
            else {
                return;
            }

        }
        //禁用垂直滚动
        // if (this.data.scrollY) {
        //   this.setData({scrollY:false});
        // }

        this.lastMoveTime = e.timeStamp;
        //处理边界情况
        if (moveX > 0) {
            moveX = 0;
        }
        //检测最大左滑距离
        if (moveX < -this.maxMoveLeft) {
            moveX = -this.maxMoveLeft;
        }
        this.moveX = moveX;
        this.translateXMsgItem(e.currentTarget.dataset.id, moveX, 0);
    },
    onTouchEndListener: function (e) {
        this.swipeCheckState = 0;
        var swipeDirection = this.swipeDirection;
        this.swipeDirection = 0;
        if (this.touchStartState === 1) {
            this.touchStartState = 0;
            this.setData({ scrollY: true });
            return;
        }
        //垂直滚动，忽略
        if (swipeDirection !== 1) {
            return;
        }
        if (this.moveX === 0) {
            this.showState = 0;
            //不显示菜单状态下,激活垂直滚动
            this.setData({ scrollY: true });
            return;
        }
        if (this.moveX === this.correctMoveLeft) {
            this.showState = 1;
            this.lastShowMsgId = e.currentTarget.dataset.id;
            return;
        }
        if (this.moveX < -this.thresholdMoveLeft) {
            this.moveX = -this.correctMoveLeft;
            this.showState = 1;
            this.lastShowMsgId = e.currentTarget.dataset.id;
        }
        else {
            this.moveX = 0;
            this.showState = 0;
            //不显示菜单,激活垂直滚动
            this.setData({ scrollY: true });
        }
        this.translateXMsgItem(e.currentTarget.dataset.id, this.moveX, 20);
    },

    translateXMsgItem: function (id, x, duration) {
        var animation = wx.createAnimation({ duration: duration });
        animation.translateX(x).step();
        this.animationMsgItem(id, animation);
    },
    animationMsgItem: function (id, animation) {
        var index = this.getItemIndex(id);
        var param = {};
        if(index !=undefined){
            var indexString = 'constantData[' + index.groupId + '][' + index.childId +'].animation';
            param[indexString] = animation.export();
            this.setData(param);
        }
    },
    animationMsgWrapItem: function (id, animation) {
        var index = this.getItemIndex(id);
        var param = {};
        if(index != undefined){
            var indexString = 'constantData[' + index.groupId + ']['+index.childId+'].wrapAnimation';
            param[indexString] = animation.export();
            this.setData(param);
        }
    },
    getItemIndex: function (id) {
        var msgList = this.data.constantData;
        for (var i = 0; i < msgList.length; i++) {
            let data = msgList[i];
            for(let j =0 ;j< data.length; j++){
                if (data[j].id === id) {
                    return {groupId:i, childId:j};
                }
            }
        }
        return null;
    },
    

})