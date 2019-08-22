//index.js pages/neweditposition/neweditposition
//获取应用实例
const app = getApp()
var startPoint;
Page({
    data: {
        buttonTop: 0,
        buttonLeft: 0,
        windowHeight: '',
        windowWidth: '',
        // userInfo: {},
        // hasUserInfo: false,
        // canIUse: wx.canIUse('button.open-type.getUserInfo')
        hidden:true,
        inputShowed: false,
        inputVal: "",
        winHeight: "", //窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        state: '',
        type: '0',
        modalShow: false, //授权状态显示和隐藏
        modalShow1: false, //授权状态显示和隐藏
        //上拉触底
        pageIndex: 1, //默认第一页
        showThis: false,
        text: '努力加载中',
        showIcon: false,
        //上拉触底
    },
    onReady:function(){
        let that = this;
        that.noread();
    },
    //聊天室未读信息
    noread: function () {
        let that = this;
        wx.request({
            url: app.data.apiPath + '/chat/queryChatState',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
            },
            success: function (res) {
                console.log(JSON.parse(res.data).data)
                // console.log(JSON.parse(res.data).data.hasNoRead)
                //console.log()
                // console.log((JSON.parse(res.data).hasNoRead).toString())
                let weidunum = (JSON.parse(res.data).data.hasNoRead).toString();
                if (JSON.parse(res.data).data.hasNoRead != 0) {
                    console.log('有未读消息')
                    // wx.showTabBarRedDot({
                    //     index: 1
                    // });
                    wx.setTabBarBadge({
                        index: 1,
                        text: weidunum
                    })
                } else {
                    wx.removeTabBarBadge({
                        index: 1,
                    })
                    // wx.hideTabBarRedDot({
                    //     index: 1
                    // })
                }
            }
        })
    },
    //点击跳转到发布页面
    navtoedit: function() {
        let that = this;
        //查询公司信息接口
        wx.request({
            url: app.data.apiPath + '/userCenter/queryCompanyDetail',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                if (JSON.parse(res.data).data == undefined || JSON.parse(res.data).data == ''){
                    wx.showModal({
                        title: '提示',
                        content: '需要先完善公司信息才能发布职位，去完善公司信息',
                        success(res){
                            if(res.confirm){
                                wx.navigateTo({
                                    url: '../editcompany/editcompany',
                                })
                            } else if (res.cancel) {
                                return;
                            }
                        }
                    })
                }else{
                    wx.navigateTo({
                        url: '../neweditposition/neweditposition',
                    })
                }
            }
        })
    },
    //进行中---点击跳转到发布页面
    btnrelease: function () {
        let that = this;
        //查询公司信息接口
        wx.request({
            url: app.data.apiPath + '/userCenter/queryCompanyDetail',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                if (JSON.parse(res.data).data == undefined || JSON.parse(res.data).data == '') {
                    wx.showModal({
                        title: '提示',
                        content: '需要先完善公司信息才能发布职位，去完善公司信息',
                        success(res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '../editcompany/editcompany',
                                })
                            } else if (res.cancel) {
                                return;
                            }
                        }
                    })
                } else {
                    wx.navigateTo({
                        url: '../neweditposition/neweditposition',
                    })
                }
            }
        })
    },
    //拖拽开始
    buttonStart: function (e) {
        startPoint = e.touches[0]
    },
    buttonMove: function (e) {
        var endPoint = e.touches[e.touches.length - 1]
        var translateX = endPoint.clientX - startPoint.clientX
        var translateY = endPoint.clientY - startPoint.clientY
        startPoint = endPoint
        var buttonTop = this.data.buttonTop + translateY
        var buttonLeft = this.data.buttonLeft + translateX
        //判断是移动否超出屏幕
        if (buttonLeft + 50 >= this.data.windowWidth) {
            buttonLeft = this.data.windowWidth - 50;
        }
        if (buttonLeft <= 0) {
            buttonLeft = 0;
        }
        if (buttonTop <= 0) {
            buttonTop = 0
        }
        if (buttonTop + 50 >= this.data.windowHeight) {
            buttonTop = this.data.windowHeight - 50;
        }
        this.setData({
            buttonTop: buttonTop,
            buttonLeft: buttonLeft
        })
    },
    //滚动到底时触发
    buttonEnd: function (e) {
        cons.log(e)
    },
    //拖拽结束
    //点击跳转到编辑公司信息页面(没有公司id的情况下)
    navtoeditcompany: function () {
        wx.navigateTo({
            url: '../editcompany/editcompany',
        })
    },
    //点击跳转到编辑公司信息页面(有公司id的情况下)
    navtoeditcompany1: function () {
        console.log(this.data.companyid)
        wx.navigateTo({
            url: '../editcompany/editcompany?companyid=' + this.data.companyid,
        })
    },
    //页面加载时出发
    onLoad: function() {
        let that = this;
        //  高度自适应
        wx.getSystemInfo({
            success: function (res) {
                console.log(res)
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR;
                that.setData({
                    winHeight: calc,
                    windowHeight: clientHeight,
                    windowWidth: clientWidth
                });
            }
        });
        wx.checkSession({
            success: function (res) {
                console.log("处于登录态");
                wx.showLoading({
                    title: '加载中',
                })
                that.getsessionkey();
            },
            fail: function (res) {
                console.log("需要重新登录");
                that.setData({
                    modalShow: true,
                })
            }
        })
        // //判断授权
        // if(!wx.getStorageSync('unionid')){
        //     console.log("不存在")
        //     that.setData({
        //         modalShow: true
        //     })
        // }else{
        //     //如果存在说明之前登陆过直接加载数据列表
        //     that.processinglist();
        //     that.overlist();
        //     //查询公司信息接口
        //     wx.request({
        //         url: app.data.apiPath + '/userCenter/queryCompanyDetail',
        //         method: "POST",
        //         header: {
        //             'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //         },
        //         data: {
        //             unionid: wx.getStorageSync('unionid'),
        //             // unionid: 'atyiwtiagfkg',
        //         },
        //         success: function (res) {
        //             console.log(res);
        //             console.log(JSON.parse(res.data).data);
        //             if (JSON.parse(res.data).data == undefined){
        //                 that.setData({
        //                     addcom:true
        //                 })
        //             }else{
        //                 let companyid = JSON.parse(res.data).data.companyId;
        //                 that.setData({
        //                     addcom: false,
        //                     companyid: companyid
        //                 })
        //             }
        //             // let companyDetail = JSON.parse(res.data).data;
        //             // console.log(companyDetail)
        //             // that.setData({
        //             //     companyDetail,
        //             //     imagesUrl: companyDetail.companyPictureList
        //             // })
        //         }
        //     })
        // }
    },
    //获取进行中or已结束列表
    processinglist:function(){
        let that = this;
        wx.request({
            url: app.data.apiPath + '/position/queryPositionList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                type: 1,
                pageIdx: 1,
                pageSize: 50
            },
            success: function (res) {
                wx.hideLoading()
                // console.log(res)
                console.log(JSON.parse(res.data))
                let position = JSON.parse(res.data);
                let positionlist = position.data;
                positionlist.forEach((item) => {
                    item.relaseDate = item.relaseDate.substring(5, 10)
                    item.relaseDate = item.relaseDate.replace(/-/g, "月")
                });
                if (position.data != "") {
                    that.setData({
                        positionlist,
                        state: 0
                    })
                } else {
                    that.setData({
                        state: 1
                    })
                }
            }
        })
    },
    overlist:function(){
        // wx.showLoading({
        //     title: '加载中',
        // })
        let that = this;
        wx.request({
            url: app.data.apiPath + '/position/queryPositionList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                type: 2,
                pageIdx: 1,
                pageSize: 50
            },
            success: function (res) {
                wx.hideLoading()
                // console.log(res)
                let over = JSON.parse(res.data)
                // console.log(over)
                let overlist = over.data;
                console.log(overlist)
                overlist.forEach((item) => {
                    item.relaseDate = item.relaseDate.substring(5, 10)
                    item.relaseDate = item.relaseDate.replace(/-/g, "月")
                });
                that.setData({
                    overlist
                })
            }
        })
    },
    // 查询公司信息接口
    queryCompanyDetail:function(){
        let that = this;
        //查询公司信息接口
        wx.request({
            url: app.data.apiPath + '/userCenter/queryCompanyDetail',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
            },
            success: function (res) {
                console.log(res);
                console.log(JSON.parse(res.data).data);
                if (JSON.parse(res.data).data == undefined) {
                    that.setData({
                        addcom: true
                    })
                } else {
                    let companyid = JSON.parse(res.data).data.companyId;
                    that.setData({
                        addcom: false,
                        companyid: companyid
                    })
                }
            }
        })
    },
    //进入小程序判断unionid系列操作
    getsessionkey: function() {
        let that = this;
        //首先登陆
        wx.login({
            success: function(res) {
                console.log(res)
                //拿到code发送给后端
                wx.request({
                    url: app.data.apiPath + '/user/setCode',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        code: res.code
                    },
                    success: function(res) {
                        console.log(JSON.parse(res.data))
                        let sessionId = JSON.parse(res.data).id;
                        let openId = JSON.parse(res.data).wxid;
                        wx.setStorageSync('sessionId', sessionId);
                        wx.setStorageSync('openId', openId);
                        that.saveWxInfo();
                    }
                })
            }
        })
    },
    //将获取到的微信信息保存到数据库并且拿到unionid
    saveWxInfo:function(e){
        let that = this;
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        withCredentials: true,
                        lang: "zh_CN",
                        success: function (res) {
                            console.log(res)
                            var unionid = wx.getStorageSync('unionid');
                            var opid = wx.getStorageSync('opid');
                            var sessionId = wx.getStorageSync('sessionId');
                            var encryptedData = res.encryptedData;
                            var iv = res.iv;
                            wx.request({
                                url: app.data.apiPath + '/user/saveWxUser',
                                method: "POST",
                                header: {
                                    'content-type': 'application/json;charset=UTF-8'
                                    // 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                },
                                data: {
                                    nickname: res.userInfo.nickName,
                                    sex: res.userInfo.gender,
                                    country: res.userInfo.country,
                                    province: res.userInfo.province,
                                    city: res.userInfo.city,
                                    headimgurl: res.userInfo.avatarUrl,
                                    unionid: unionid,
                                    openid: opid,
                                    sessionId: sessionId,
                                    encryptedData: encryptedData,
                                    iv: iv,
                                },
                                success: function (res) {
                                    console.log(JSON.parse(res.data))
                                    console.log(JSON.parse(res.data).unionid)
                                    var unionid = JSON.parse(res.data).unionid;
                                    wx.setStorageSync("unionid", unionid);
                                    that.processinglist();
                                    that.overlist();
                                    //查询公司信息接口
                                    that.queryCompanyDetail();
                                    //查询是不是上传营业执照
                                    wx.request({
                                        url: app.data.apiPath + '/company/queryLicense',
                                        method: "POST",
                                        header: {
                                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                        },
                                        data: {
                                            unionid: unionid
                                        },
                                        success: function (res) {
                                            console.log(res)
                                            console.log(JSON.parse(res.data).data)
                                            if (JSON.parse(res.data).data.status == 0){
                                                console.log("不用提示")
                                            }
                                            if (JSON.parse(res.data).data.status == 1) {
                                                wx.showModal({
                                                    title: '温馨提示',
                                                    content: '请立即上传营业执照，否则系统会下线您的所有职位',
                                                    confirmText:"去上传",
                                                    confirmColor: "#576B95",
                                                    success(res) {
                                                        if (res.confirm) {
                                                            wx.request({
                                                                url: app.data.apiPath + '/userCenter/queryCompanyDetail',
                                                                method: "POST",
                                                                header: {
                                                                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                                                },
                                                                data: {
                                                                    unionid: wx.getStorageSync('unionid'),
                                                                },
                                                                success: function (res) {
                                                                    console.log(res.data)
                                                                    console.log(JSON.parse(res.data).data)
                                                                    if (JSON.parse(res.data).data == undefined || JSON.parse(res.data).data == "") {
                                                                        wx.navigateTo({
                                                                            url: '../editcompany/editcompany',
                                                                        })
                                                                    } else {
                                                                        wx.navigateTo({
                                                                            url: '../viewcomfile/viewcomfile',
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        } else if (res.cancel) {
                                                            console.log('用户点击取消')
                                                        }
                                                    }
                                                })
                                            }
                                            if (JSON.parse(res.data).data.status == 2) {
                                                wx.showModal({
                                                    title: '警告',
                                                    content: '系统下线了您的所有职位,请立即上传营业执照',
                                                    confirmText: "去上传",
                                                    confirmColor:"#576B95",
                                                    success(res) {
                                                        if (res.confirm) {
                                                            wx.request({
                                                                url: app.data.apiPath + '/userCenter/queryCompanyDetail',
                                                                method: "POST",
                                                                header: {
                                                                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                                                },
                                                                data: {
                                                                    unionid: wx.getStorageSync('unionid'),
                                                                },
                                                                success: function (res) {
                                                                    console.log(res.data)
                                                                    console.log(JSON.parse(res.data).data)
                                                                    if (JSON.parse(res.data).data == undefined || JSON.parse(res.data).data == "") {
                                                                        wx.navigateTo({
                                                                            url: '../editcompany/editcompany',
                                                                        })
                                                                    } else {
                                                                        wx.navigateTo({
                                                                            url: '../viewcomfile/viewcomfile',
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        } else if (res.cancel) {
                                                            console.log('用户点击取消')
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    //进行中--进入职位详情
    navtojob:function(e){
        let that = this;
        console.log(e)
        console.log(that.data.positionlist)
        let listid = e.currentTarget.dataset.id;
        let positionId = that.data.positionlist[listid].positionId;
        console.log(positionId)
        wx.navigateTo({
            url: '../jobdetails/jobdetails?positionId=' + JSON.stringify(positionId)
        })
    },
    //已结束--进入职位详情
    navtojob1: function (e) {
        let that = this;
        console.log(e)
        let listid = e.currentTarget.dataset.id;
        let positionId = that.data.overlist[listid].positionId;
        console.log(positionId)
        wx.navigateTo({
            url: '../onlineagain/onlineagain?positionId=' + JSON.stringify(positionId)
        })
    },
    //删除进行中的职位
    delete:function(e){
        let that = this;
        console.log(e)
        console.log(that.data.positionlist)
        wx.showModal({
            title: '提示',
            content: '确定删除此岗位吗',
            success(res) {
                if (res.confirm) {
                    //职位下线
                    wx.request({
                        url: app.data.apiPath + '/position/updatePositionState',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        data: {
                            positionId: that.data.positionlist[e.currentTarget.dataset.index].positionId,
                            state: 3
                        },
                        success: function (res) {
                            wx.showToast({
                                title: '已删除',
                                duration: 2000,
                                mask: true
                            })
                            that.processinglist();
                            that.overlist();
                        }
                    })
                } else if (res.cancel) {
                    return;
                }
            }
        })
    },
    //删除已结束的职位
    delete1: function (e) {
        let that = this;
        console.log(e)
        console.log(that.data.positionlist)
        wx.showModal({
            title: '提示',
            content: '确定删除此岗位吗',
            success(res) {
                if (res.confirm) {
                    //职位下线
                    wx.request({
                        url: app.data.apiPath + '/position/updatePositionState',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        data: {
                            positionId: that.data.overlist[e.currentTarget.dataset.index].positionId,
                            state: 3
                        },
                        success: function (res) {
                            wx.showToast({
                                title: '已删除',
                                duration: 2000,
                                mask: true
                            })
                            that.processinglist();
                            that.overlist();
                        }
                    })
                } else if (res.cancel) {
                    return;
                }
            }
        })
    },
    //进行中。。。进入围观/收藏/关注列表
    navtoonlookwg:function(e){
        let that= this;
        console.log(e)
        console.log(that.data.positionlist)
        let listid = e.currentTarget.dataset.id;
        let positionId = that.data.positionlist[listid].positionId;
        console.log(positionId)
        wx.navigateTo({
            url: '../releaselist/releaselist?positionId=' + JSON.stringify(positionId) + '&idd=' + 0
        })
    },
    navtoonlookgxq: function (e) {
        let that = this;
        console.log(e)
        console.log(that.data.positionlist)
        let listid = e.currentTarget.dataset.id;
        let positionId = that.data.positionlist[listid].positionId;
        console.log(positionId)
        wx.navigateTo({
            url: '../releaselist/releaselist?positionId=' + JSON.stringify(positionId) + '&idd=' + 1
        })
    }, 
    navtoonlookwgz: function (e) {
        let that = this;
        console.log(e)
        console.log(that.data.positionlist)
        let listid = e.currentTarget.dataset.id;
        let positionId = that.data.positionlist[listid].positionId;
        console.log(positionId)
        wx.navigateTo({
            url: '../releaselist/releaselist?positionId=' + JSON.stringify(positionId) + '&idd=' + 2
        })
    },
    //已结束。。。。进入围观/收藏/关注列表
    navtoonlookwg1: function (e) {
        let that = this;
        console.log(e)
        console.log(that.data.overlist)
        let listid = e.currentTarget.dataset.id;
        let positionId = that.data.overlist[listid].positionId;
        console.log(positionId)
        wx.navigateTo({
            url: '../releaselist/releaselist?positionId=' + JSON.stringify(positionId)
        })
    },
    navtoonlookgxq1: function (e) {
        let that = this;
        console.log(e)
        console.log(that.data.overlist)
        let listid = e.currentTarget.dataset.id;
        let positionId = that.data.overlist[listid].positionId;
        console.log(positionId)
        wx.navigateTo({
            url: '../releaselist/releaselist?positionId=' + JSON.stringify(positionId) + '&idd=' + 1
        })
    },
    navtoonlookwgz1: function (e) {
        let that = this;
        console.log(e)
        console.log(that.data.overlist)
        let listid = e.currentTarget.dataset.id;
        let positionId = that.data.overlist[listid].positionId;
        console.log(positionId)
        wx.navigateTo({
            url: '../releaselist/releaselist?positionId=' + JSON.stringify(positionId) + '&idd=' + 2
        })
    },  
    // tab切换0
    processing: function(e) {
        let that = this;
        // console.log(e)
        let cur = e.target.dataset.current;
        // let type = that.data.type;
        // type = '0';
        if (that.data.currentTaB == cur) {
            return false;
        } else {
            that.setData({
                currentTab: cur,
                // type: '0',
            })
        }
        // console.log(that.data.currentTab)
    },
    // tab切换1
    over: function(e) {
        let that = this;
        let cur = e.target.dataset.current;
        // let type = that.data.type;
        // type = '1';
        if (that.data.currentTaB == cur) {
            return false;
        } else {
            that.setData({
                currentTab: cur,
                // type: '1',
            })
        }
        // console.log(that.data.currentTab)
    },
    // 跳转到发布列表
    releaselist: function() {
        wx.navigateTo({
            url: '../releaselist/releaselist',
        })
    },
    onShow:function(){
        let that = this;
        if (wx.getStorageSync('unionid')){
            that.processinglist();
            that.overlist();
        }else{}
        // this.onLoad();
        this.noread();
    },
    /**
     * 获取用户信息
     */
    getUserDetails(e) {
        let that = this;
        console.log(e)
        let detail = e.detail;
        let userInfo = e.detail.userInfo;
        if (userInfo) {
            that.setData({
                modalShow: false,
            })
            wx.showLoading({
                title: '加载中',
            })
            wx.setStorageSync('detail', detail);
            wx.setStorageSync('userInfo', userInfo);
            that.getsessionkey();
        }
    },
    // 下拉刷新
    onPullDownRefresh: function (e) {
        let that = this;
        wx.showLoading({
            title: '加载中',
        })
        if(that.data.currentTab == 0){
            wx.showNavigationBarLoading()
            console.log('0')
            setTimeout(function () {
                that.processinglist();
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
            }, 1200);
        }else{
            wx.showNavigationBarLoading()
            console.log('1')
            setTimeout(function () {
                that.overlist();
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
            }, 1200);
        }
    },
    //上拉触底加载
    onReachBottom:function(e){
        let that = this;
        wx.showLoading({
            title: '加载中',
        })
        console.log(e)
        if (that.data.currentTab == 0){
            // 加载进行中的列表
            let pageIndex = that.data.pageIndex + 1;
            console.log(that.data.currentTab)
            setTimeout(function () {
                wx.request({
                    url: app.data.apiPath + '/position/queryPositionList',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        type: 1,
                        pageIdx: pageIndex
                    },
                    success: function (res) {
                        wx.hideLoading()
                        console.log(JSON.parse(res.data).data)
                        let positionlist1 = JSON.parse(res.data).data;
                        if (positionlist1.length == 0){
                            wx.showToast({
                                title: '没有更多数据啦',
                                icon: 'none',
                                duration: 1500
                            })
                        }else{
                            positionlist1.forEach((item) => {
                                item.relaseDate = item.relaseDate.substring(5, 10)
                                item.relaseDate = item.relaseDate.replace(/-/g, "月")
                            });
                            let array = that.data.positionlist;
                            for (let i = 0; i < positionlist1.length; i++) {
                                array.push(positionlist1[i])
                            }
                            console.log(that.data.positionlist)
                            that.setData({
                                positionlist: that.data.positionlist,
                                pageIndex
                            })
                        }
                    }
                })
            }, 900)
        }else if(that.data.currentTab == 1){
            console.log(that.data.currentTab)
            let pageIndex = that.data.pageIndex + 1;
            setTimeout(function () {
                wx.request({
                    url: app.data.apiPath + '/position/queryPositionList',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        type: 2,
                        pageIdx: pageIndex
                    },
                    success: function (res) {
                        wx.hideLoading()
                        let overlist1 = JSON.parse(res.data).data;
                        console.log(overlist1)
                        if (overlist1.length == 0){
                            wx.showToast({
                                title: '没有更多数据啦',
                                icon: 'none',
                                duration: 1500
                            })
                        }else{
                            overlist1.forEach((item) => {
                                item.relaseDate = item.relaseDate.substring(5, 10)
                                item.relaseDate = item.relaseDate.replace(/-/g, "月")
                            });
                            let array = that.data.overlist;
                            for (let i = 0; i < overlist1.length; i++) {
                                array.push(overlist1[i])
                            }
                            console.log(that.data.overlist)
                            that.setData({
                                overlist: that.data.overlist,
                            })
                        }
                    }
                })
            }, 900)
        }
    }
})