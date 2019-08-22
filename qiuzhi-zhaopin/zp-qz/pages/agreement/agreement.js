const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        modalShow: false, //授权状态显示和隐藏
    },
    fujian: function () {
        wx.navigateTo({
            url: '../privacypolicy/privacypolicy',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.showLoading({
            title: '加载中',
        })
        wx.checkSession({
            success: function (res) {
                // console.log("处于登录态");

                that.getsessionkey();
            },
            fail: function (res) {
                wx.hideLoading()
                // console.log("需要重新登录");
                that.setData({
                    modalShow: true,
                })
            }
        })
    },
    //进入小程序判断unionid系列操作
    getsessionkey: function () {
        let that = this;
        //首先登陆
        wx.login({
            success: function (res) {
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
                    success: function (res) {
                        console.log(res)
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
    saveWxInfo: function (e) {
        let that = this;
        // var time = util.formatTime(new Date()); //获取当前时间
        /////////////
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        withCredentials: true,
                        lang: "zh_CN",
                        success: function (res) {
                            // console.log(res)
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
                                    //'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
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
                                    wx.request({
                                        url: app.data.apiPath + '/user/getWxUserInfo',
                                        method: "GET",
                                        header: {
                                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                        },
                                        data: {
                                            unionid: unionid
                                        },
                                        success: function (res) {
                                            console.log(JSON.parse(res.data))
                                            console.log(JSON.parse(res.data).data)
                                            let isClause = JSON.parse(res.data).data;
                                            if (isClause.isClause == 0) {
                                                that.setData({
                                                    isClause
                                                })
                                                return
                                            } else {
                                                wx.switchTab({
                                                    url: '../index/index'
                                                })
                                            }
                                        }
                                    })
                                    that.setData({
                                        unionid
                                    })
                                    wx.setStorageSync("unionid", unionid);
                                    wx.hideLoading()
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    // 点击同意
    tongyi: function () {
        let that = this;
        console.log(that.data.unionid)
        wx.request({
            url: app.data.apiPath + '/user/consentClause',
            method: "GET",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: that.data.unionid
            },
            success: function (res) {
                console.log(res)
                wx.navigateToMiniProgram({
                    appId: 'wx03dc8a63866ea187', // 要跳转的小程序的appid
                    path: 'pages/index/index', // 跳转的目标页面
                    envVersion: 'release',
                    success(res) {
                        // 打开成功 
                        console.log(res)
                    },
                    fail: function () {

                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /**
     * 获取用户信息
     */
    getUserDetails(e) {
        let that = this;
        // console.log(e)
        let detail = e.detail;
        let userInfo = e.detail.userInfo;
        if (userInfo) {
            that.setData({
                modalShow: false,
                // modalShow1:true
            })
            wx.setStorageSync('detail', detail);
            wx.setStorageSync('userInfo', userInfo);
            wx.showLoading({
                title: '加载中',
            })
            // console.log(userInfo)
            that.getsessionkey()
        }
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

    }
})