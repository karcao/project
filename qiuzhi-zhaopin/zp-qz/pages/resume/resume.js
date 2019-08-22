const app = getApp();
var time = require('../../utils/util.js');
Page({
    // 点击别处隐藏按钮
    quxiaoall: function() {
        let that = this;
        that.setData({
            // inDex: -1,
            inDex1: -1,
            inDex2: -1,
            inDex3: -1,
        })
    },
    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0, //预设当前项的值
        winHeight: "", //窗口高度
        tab: {
            curHdIndex: 0,
            curBdIndex: 0,
        },
        tab1: {
            curHdIndex: 0,
            curBdIndex: 0,
        },
        tab2: {
            curHdIndex: 0,
            curBdIndex: 0,
        },
        inputShowed: false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        let that = this;
        let currenttime = time.formatTime(new Date()).substring(0, 4);
        //  高度自适应
        wx.getSystemInfo({
            success: function(res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR;
                that.setData({
                    winHeight: calc
                });
            }
        });
        that.queryResume1(); //简历库接口
        that.queryResume2(); //收藏简历接口
        that.queryResume3(); //浏览记录接口
    },
    //我的简历库封装
    queryResume1: function() {
        let that = this;
        let currenttime = time.formatTime(new Date()).substring(0, 4);
        //简历库接口
        wx.request({
            url: app.data.apiPath + '/resume/queryResume',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                type: 1,
            },
            success: function(res) {
                let resumelibrary = JSON.parse(res.data).data;
                console.log(res)
                console.log(resumelibrary)
                resumelibrary.forEach((item) => {
                    item.time = item.time.substring(5, 10).replace(/-/g, "月");
                    if (item.birthday){
                        item.birthday = currenttime - item.birthday.substring(0, 4);
                    }
                    if (item.workBegin){
                        item.workBegin = currenttime - item.workBegin.substring(0, 4);
                    }
                })
                console.log(resumelibrary)
                that.setData({
                    resumelibrary
                })
            }
        })
    },
    //收藏简历封装
    queryResume2: function() {
        let that = this;
        let currenttime = time.formatTime(new Date()).substring(0, 4);
        //收藏简历接口
        wx.request({
            url: app.data.apiPath + '/resume/queryResume',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                type: 2,
            },
            success: function(res) {
                let favoriteresume = JSON.parse(res.data).data;
                console.log(res)
                console.log(favoriteresume)
                favoriteresume.forEach((item) => {
                    item.time = item.time.substring(5, 10).replace(/-/g, "月");
                    if (item.workBegin) {
                        item.workBegin = currenttime - item.workBegin.substring(0, 4);
                    }
                    if (item.birthday) {
                        item.birthday = currenttime - item.birthday.substring(0, 4);
                    }
                })
                console.log(favoriteresume)
                that.setData({
                    favoriteresume
                })
            }
        })
    },
    //浏览记录封装
    queryResume3: function() {
        let that = this;
        let currenttime = time.formatTime(new Date()).substring(0, 4);
        //浏览记录接口
        wx.request({
            url: app.data.apiPath + '/resume/queryResume',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                type: 3,
            },
            success: function(res) {
                let browserecord = JSON.parse(res.data).data;
                console.log(res)
                console.log(browserecord)
                browserecord.forEach((item) => {
                    item.time = item.time.substring(5, 10).replace(/-/g, "月");
                    if (item.workBegin) {
                        item.workBegin = currenttime - item.workBegin.substring(0, 4);
                    }
                    if (item.birthday) {
                        item.birthday = currenttime - item.birthday.substring(0, 4);
                    }
                })
                console.log(browserecord)
                that.setData({
                    browserecord
                })
            }
        })
    },
    // 搜索框
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function() {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    // input框
    inputTyping: function(e) {
        let that = this;
        let currenttime = time.formatTime(new Date()).substring(0, 4);
        that.setData({
            inputVal: e.detail.value
        });
        if (that.data.currentTab == 0) {
            wx.request({
                url: app.data.apiPath + '/resume/queryResume',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded;'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    word: e.detail.value,
                    type: 1
                },
                success: function(res) {
                    // console.log(res)
                    // console.log(JSON.parse(res.data).data)
                    let resumelibrary = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data == "") {
                        wx.showToast({
                            title: '没有匹配到合适的信息',
                            icon: 'none',
                            duration: 2000
                        })
                        console.log(resumelibrary)
                        that.setData({
                            resumelibrary
                        })
                    } else {
                        resumelibrary.forEach((item) => {
                            item.birthday = currenttime - item.birthday.substring(0, 4);
                            item.workBegin = currenttime - item.workBegin.substring(0, 4);
                            item.time = item.time.substring(5, 10).replace(/-/g, "月");
                        })
                        console.log(resumelibrary)
                        that.setData({
                            resumelibrary
                        })
                    }
                }
            })
        } else if (that.data.currentTab == 1) {
            wx.request({
                url: app.data.apiPath + '/resume/queryResume',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded;'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    word: e.detail.value,
                    type: 2
                },
                success: function(res) {
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let favoriteresume = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data == "") {
                        wx.showToast({
                            title: '没有匹配到合适的信息',
                            icon: 'none',
                            duration: 2000
                        })
                        that.setData({
                            favoriteresume
                        })
                    } else {
                        console.log(favoriteresume)
                        favoriteresume.forEach((item) => {
                            item.birthday = currenttime - item.birthday.substring(0, 4);
                            item.workBegin = currenttime - item.workBegin.substring(0, 4);
                            item.time = item.time.substring(5, 10).replace(/-/g, "月");
                        })
                        console.log(favoriteresume)
                        that.setData({
                            favoriteresume
                        })
                    }
                }
            })
        } else {
            wx.request({
                url: app.data.apiPath + '/resume/queryResume',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded;'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    word: e.detail.value,
                    type: 3
                },
                success: function(res) {
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let browserecord = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data == "") {
                        wx.showToast({
                            title: '没有匹配到合适的信息',
                            icon: 'none',
                            duration: 2000
                        })
                        that.setData({
                            browserecord
                        })
                    } else {
                        console.log(browserecord)
                        browserecord.forEach((item) => {
                            item.birthday = currenttime - item.birthday.substring(0, 4);
                            item.workBegin = currenttime - item.workBegin.substring(0, 4);
                            item.time = item.time.substring(5, 10).replace(/-/g, "月");
                        })
                        console.log(browserecord)
                        that.setData({
                            browserecord
                        })
                    }
                }
            })
        }
    },
    // 滚动切换标签样式/////////////////////////////////////
    switchTab: function(e) {
        let that = this;
        that.setData({
            currentTab: e.detail.current,
            inDex1: -1,
            inDex2: -1,
            inDex3: -1
        });
    },
    // 切换
    swichNav: function(e) {
        let that = this;
        let cur = e.currentTarget.dataset.current;
        let type = that.data.type;
        type = '0'
        if (that.data.currentTaB == cur) {
            return false;
        } else {
            that.setData({
                currentTab: cur,
                type: '0',
            })
        }
    },
    // type == 1
    swichNav1: function(e) {
        let that = this;
        let cur = e.currentTarget.dataset.current;
        let type = that.data.type;
        type = '1'
        if (that.data.currentTaB == cur) {
            return false;
        } else {
            that.setData({
                currentTab: cur,
                type: '1',
            })
        }
    },
    // type == 2
    swichNav2: function(e) {
        let that = this;
        let cur = e.currentTarget.dataset.current;
        let type = that.data.type;
        type = '2'
        if (that.data.currentTaB == cur) {
            return false;
        } else {
            that.setData({
                currentTab: cur,
                type: '2',
            })
        }
    },
    // 切换下边列表
    tabFun: function(e) {
        let that = this;
        // 获取下标
        let _datasetId = e.target.dataset.id;
        let _obj = {};
        _obj.curHdIndex = _datasetId;
        _obj.curBdIndex = _datasetId;
        that.setData({
            tab: _obj
        });
    },
    // 切换下边列表
    tabFun1: function(e) {
        let that = this;
        // 获取下标
        let _datasetId = e.target.dataset.id;
        let _obj = {};
        _obj.curHdIndex = _datasetId;
        _obj.curBdIndex = _datasetId;
        that.setData({
            tab1: _obj
        });
    },
    // 切换下边列表
    tabFun2: function(e) {
        let that = this;
        // 获取下标
        let _datasetId = e.target.dataset.id;
        let _obj = {};
        _obj.curHdIndex = _datasetId;
        _obj.curBdIndex = _datasetId;
        that.setData({
            tab2: _obj
        });
    },
    // 长按我的简历库列表某一项
    myresume1: function(e) {
        let that = this;
        that.setData({
            inDex1: e.currentTarget.dataset.index
        })
    },
    // 长按收藏简历列表某一项
    myresume2: function(e) {
        let that = this;
        that.setData({
            inDex2: e.currentTarget.dataset.index
        })
    },
    // 长按浏览记录列表某一项
    myresume3: function(e) {
        let that = this;
        that.setData({
            inDex3: e.currentTarget.dataset.index
        })
    },
    //我的简历库点击查看简历
    vae0: function(e) {
        let that = this;
        console.log(that.data.resumelibrary)
        let index = e.currentTarget.dataset.index;
        let otherunionid = that.data.resumelibrary[index].unionid;
        let positionId = that.data.resumelibrary[index].positionId;
        if (that.data.resumelibrary[index].customerCode) {
            let jianlicode = that.data.resumelibrary[index].customerCode;
            wx.navigateTo({
                url: '../networking/networking?jianlicode=' + jianlicode,
            })
        } else {
            // wx.navigateTo({
            //     url: '../redetails/redetails?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + otherunionid + '&positionid=' + positionId,
            // })
            wx.request({
                url: app.data.apiPath + '/resume/queryCustomerCodeByResumeId',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                data: {
                    resumeId: that.data.resumelibrary[index].resumeId
                },
                success: function (res) {
                    console.log(res)
                    console.log(JSON.parse(res.data).data);
                    let jianlicode = JSON.parse(res.data).data;
                    wx.navigateTo({
                        url: '../networking/networking?jianlicode=' + jianlicode,
                    })
                }
            })
        }
        that.setData({
            inDex1: -1
        })
    },
    //收藏简历点击查看简历
    vae01: function(e) {
        let that = this;
        console.log(that.data.favoriteresume)
        let index = e.currentTarget.dataset.index;
        let otherunionid = that.data.favoriteresume[index].unionid;
        let positionId = that.data.favoriteresume[index].positionId;
        if (that.data.favoriteresume[index].customerCode) {
            let jianlicode = that.data.favoriteresume[index].customerCode;
            wx.navigateTo({
                url: '../networking/networking?jianlicode=' + jianlicode,
            })
        } else {
            // wx.navigateTo({
            //     url: '../redetails/redetails?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + otherunionid + '&positionid=' + positionId,
            // })
            wx.request({
                url: app.data.apiPath + '/resume/queryCustomerCodeByResumeId',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                data: {
                    resumeId: that.data.favoriteresume[index].resumeId
                },
                success: function(res) {
                    console.log(res)
                    console.log(JSON.parse(res.data).data);
                    let jianlicode = JSON.parse(res.data).data;
                    wx.navigateTo({
                        url: '../networking/networking?jianlicode=' + jianlicode,
                    })
                }
            })
        }
        // wx.navigateTo({
        //     url: '../redetails/redetails?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + otherunionid + '&positionid=' + positionId,
        // })
        that.setData({
            inDex2: -1
        })
    },
    //浏览记录点击查看简历
    vae02: function(e) {
        let that = this;
        console.log(that.data.browserecord)
        let index = e.currentTarget.dataset.index;
        let otherunionid = that.data.browserecord[index].unionid;
        let positionId = that.data.browserecord[index].positionId;
        if (that.data.browserecord[index].customerCode) {
            let jianlicode = that.data.browserecord[index].customerCode;
            wx.navigateTo({
                url: '../networking/networking?jianlicode=' + jianlicode,
            })
        } else {
            // wx.navigateTo({
            //     url: '../redetails/redetails?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + otherunionid + '&positionid=' + positionId,
            // })
            wx.request({
                url: app.data.apiPath + '/resume/queryCustomerCodeByResumeId',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                data: {
                    resumeId: that.data.browserecord[index].resumeId
                },
                success: function(res) {
                    console.log(res)
                    console.log(JSON.parse(res.data).data);
                    let jianlicode = JSON.parse(res.data).data;
                    wx.navigateTo({
                        url: '../networking/networking?jianlicode=' + jianlicode,
                    })
                }
            })
        }
        that.setData({
            inDex3: -1
        })
    },
    //我得简历库里面一键拨号
    vae1: function(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        console.log(index)
        console.log(that.data.resumelibrary)
        wx.makePhoneCall({
            phoneNumber: that.data.resumelibrary[index].tel,
        })
        that.setData({
            inDex1: -1,
            inDex2: -1,
            inDex3: -1,
        })
    },
    //我得简历库里面填写评价信息
    vae2: function(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        console.log(index)
        console.log(that.data.resumelibrary)
        wx.navigateTo({
            url: '../interview/interview?resumeId=' + that.data.resumelibrary[index].resumeId,
        })
        that.setData({
            inDex1: -1,
            inDex2: -1,
            inDex3: -1,
        })
    },
    //收藏简历里点击取消收藏简历
    vae3: function(e) {
        let that = this;
        console.log(e.currentTarget.dataset.index)
        console.log(that.data.favoriteresume)
        let index = e.currentTarget.dataset.index;
        let data = {
            // customerCode: that.data.favoriteresume[index].customerCode,
            unionid: wx.getStorageSync('unionid'),
            flag: 2, //1添加收藏 2删除收藏//
        }
        if (that.data.favoriteresume[index].customerCode) {
            data.customerCode = that.data.favoriteresume[index].customerCode
        }
        if (that.data.favoriteresume[index].resumeId) {
            data.resumeId = that.data.favoriteresume[index].resumeId
        }
        if (that.data.favoriteresume[index].unionid) {
            data.beCollectionId = that.data.favoriteresume[index].unionid
        }
        wx.showModal({
            title: '提示',
            content: '确定要取消收藏此简历吗',
            success(res) {
                if (res.confirm) {
                    //成功时删除
                    wx.request({
                        url: app.data.apiPath + '/resume/saveResumeCollection',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        data: data,
                        success: function(res) {
                            console.log(res)
                            console.log(JSON.parse(res.data).rstCode);
                            console.log(that.data.resume)
                            if (JSON.parse(res.data).rstCode == 'SUCCESS') {
                                wx.showToast({
                                    title: '已取消',
                                    icon: 'success',
                                    duration: 2000
                                })
                                that.queryResume3();
                                that.queryResume2();
                                that.setData({
                                    // inDex: -1,
                                    inDex1: -1,
                                    inDex2: -1,
                                    inDex3: -1,
                                })
                            }
                        }
                    })
                } else if (res.cancel) {
                    that.setData({
                        inDex1: -1,
                        inDex2: -1,
                        inDex3: -1,
                    })
                    return;
                }
            }
        })
    },
    //收藏简历里点击购买简历
    vae4: function(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let otheunionid = that.data.favoriteresume[index].unionid;
        let resumeid = that.data.favoriteresume[index].resumeId;
        console.log(otheunionid)
        console.log(resumeid)
        wx.navigateTo({
            url: '../orderdetails/orderdetails?otheunionid=' + otheunionid + '&resumeid=' + resumeid,
        })
        that.setData({
            inDex1: -1,
            inDex2: -1,
            inDex3: -1,
        })
    },
    //浏览记录里点击购买简历
    vae6: function(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let otheunionid = that.data.browserecord[index].unionid;
        let resumeid = that.data.browserecord[index].resumeId;
        console.log(otheunionid)
        console.log(resumeid)
        wx.navigateTo({
            url: '../orderdetails/orderdetails?otheunionid=' + otheunionid + '&resumeid=' + resumeid,
        })
        that.setData({
            inDex1: -1,
            inDex2: -1,
            inDex3: -1,
        })
    },
    //浏览记录里点击收藏简历
    vae5: function(e) {
        let that = this;
        console.log(e.currentTarget.dataset.index)
        console.log(that.data.browserecord)
        let index = e.currentTarget.dataset.index;
        let data = {
            unionid: wx.getStorageSync('unionid'),
            flag: 1, //1添加收藏 2删除收藏//
        }
        if (that.data.browserecord[index].customerCode){
            data.customerCode = that.data.browserecord[index].customerCode
        }
        if (that.data.browserecord[index].resumeId) {
            data.resumeId = that.data.browserecord[index].resumeId
        }
        if (that.data.browserecord[index].unionid) {
            data.beCollectionId = that.data.browserecord[index].unionid
        }
        //收藏简历
        wx.request({
            url: app.data.apiPath + '/resume/saveResumeCollection',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: data,
            success: function(res) {
                console.log(res)
                console.log(JSON.parse(res.data).rstCode);
                console.log(that.data.resume)
                if (JSON.parse(res.data).rstCode == 'SUCCESS') {
                    wx.showToast({
                        title: '收藏成功',
                        icon: 'success',
                        duration: 2000
                    })
                    that.queryResume3();
                    that.queryResume2();
                    that.setData({
                        // inDex: -1,
                        inDex1: -1,
                        inDex2: -1,
                        inDex3: -1,
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.onLoad();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    // 下拉刷新
    onPullDownRefresh: function() {
        let that = this;
        wx.showNavigationBarLoading()
        console.log('下拉刷新')
        that.onLoad();
        setTimeout(function() {
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1200);
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    //跳转到全网搜简历页面
    btnrelease: function() {
        wx.navigateTo({
            url: '../network/network',
        })
    },
    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})