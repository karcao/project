const app = getApp();
var time = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ellipsis: true,
        hidden: true,
        ellipsis1: true,
        hidden1: true,
        ellipsis2: true,
        hidden2: true,
    },
    ellipsis: function() {
        let value = !this.data.ellipsis;
        this.setData({
            ellipsis: value,
            hidden: false
        })
    },
    ellipsis1: function() {
        let value = !this.data.ellipsis1;
        this.setData({
            ellipsis1: value,
            hidden1: false
        })
    },
    ellipsis2: function() {
        let value = !this.data.ellipsis2;
        this.setData({
            ellipsis2: value,
            hidden2: false
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        console.log(options)
        that.setData({
            options
        })
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: app.data.apiPath + '/webCompany/queryCustomerInfo',
            method: "POST",
            data: {
                customerCode: options.jianlicode,
                unionid: wx.getStorageSync('unionid')
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function(res) {
                wx.hideLoading();
                console.log(res)
                // console.log(JSON.parse(res.data).data)
                console.log(JSON.parse(JSON.parse(res.data).data))
                let resume = JSON.parse(JSON.parse(res.data).data);
                //无论成功与失败都要调取浏览记录
                wx.request({
                    url: app.data.apiPath + '/resume/saveResumeRecord',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    data: {
                        customerCode: resume.CustomerCode,
                        unionid: wx.getStorageSync('unionid')
                    },
                    success: function (res) {
                    }
                })
                // 工作经历时间戳转换
                resume.workList.forEach((item) => {
                    //工作开始时间戳转换
                    item.startTime = time.formatTime(item.startTime).substring(0, 7).replace(/\//g, ".")
                    //工作结束时间戳转换
                    item.endTime = time.formatTime(item.endTime).substring(0, 7).replace(/\//g, ".")
                });
                // 项目经历时间裁切
                resume.projectList.forEach((item) => {
                    //项目经历开始时间裁切
                    item.joinProjectTime = time.formatTime(item.joinProjectTime).substring(0, 7).replace(/-/g, ".")
                    //项目经历开始时间裁切
                    item.quitProjectTime = time.formatTime(item.quitProjectTime).substring(0, 7).replace(/-/g, ".")
                });
                // 教育经历时间裁切
                resume.educationList.forEach((item) => {
                    //教育经历开始时间裁切
                    item.addtime = time.formatTime(item.addtime).substring(0, 7).replace(/-/g, ".")
                    //教育经历开始时间裁切
                    item.endTime = time.formatTime(item.endTime).substring(0, 7).replace(/-/g, ".")
                });
                // console.log(JSON.parse(JSON.parse(res.data)));
                // let edulist = JSON.parse(res.data).data;
                // console.log(edulist)
                that.setData({
                    resume
                })
            }
        })
    },
    //点击购买
    buy: function() {
        let that = this;
        console.log(that.data.resume)
        console.log(that.data.resume.isResumeBuy)
        if (that.data.resume.isResumeBuy == true) {
            wx.showLoading({
                title: '加载中',
            })
            if (that.data.resume.balance >= that.data.resume.resumeMoney) {
                wx.request({
                    url: app.data.apiPath + '/wxPay/buy',
                    method: "POST",
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        customerCode: that.data.resume.CustomerCode
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    success: function(res) {
                        console.log(res)
                        // console.log(JSON.parse(res.data).data)
                        wx.showToast({
                            title: '购买成功',
                            icon: 'success',
                            duration: 2000
                        })
                        wx.request({
                            url: app.data.apiPath + '/webCompany/queryCustomerInfo',
                            method: "POST",
                            data: {
                                customerCode: that.data.options.jianlicode,
                                unionid: wx.getStorageSync('unionid')
                            },
                            header: {
                                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                            success: function (res) {
                                wx.hideLoading();
                                console.log(res)
                                // console.log(JSON.parse(res.data).data)
                                console.log(JSON.parse(JSON.parse(res.data).data))
                                let resume = JSON.parse(JSON.parse(res.data).data);
                                // 工作经历时间戳转换
                                resume.workList.forEach((item) => {
                                    //工作开始时间戳转换
                                    item.startTime = time.formatTime(item.startTime).substring(0, 7).replace(/\//g, ".")
                                    //工作结束时间戳转换
                                    item.endTime = time.formatTime(item.endTime).substring(0, 7).replace(/\//g, ".")
                                });
                                // 项目经历时间裁切
                                resume.projectList.forEach((item) => {
                                    //项目经历开始时间裁切
                                    item.joinProjectTime = time.formatTime(item.joinProjectTime).substring(0, 7).replace(/-/g, ".")
                                    //项目经历开始时间裁切
                                    item.quitProjectTime = time.formatTime(item.quitProjectTime).substring(0, 7).replace(/-/g, ".")
                                });
                                // 教育经历时间裁切
                                resume.educationList.forEach((item) => {
                                    //教育经历开始时间裁切
                                    item.addtime = time.formatTime(item.addtime).substring(0, 7).replace(/-/g, ".")
                                    //教育经历开始时间裁切
                                    item.endTime = time.formatTime(item.endTime).substring(0, 7).replace(/-/g, ".")
                                });
                                // console.log(JSON.parse(JSON.parse(res.data)));
                                // let edulist = JSON.parse(res.data).data;
                                // console.log(edulist)
                                that.setData({
                                    resume
                                })
                            }
                        })
                    }
                })
            }else{
                wx.request({
                    url: app.data.apiPath + '/wxPay/getWxPay',
                    method: "POST",
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        customerCode: that.data.resume.CustomerCode,
                        money: that.data.resume.resumeMoney
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    success: function (res) {
                        wx.hideLoading();
                        console.log(res.data.data)
                        let pay = res.data.data
                        // console.log(JSON.parse(res.data).data)
                        wx.requestPayment({
                            timeStamp: pay.timeStamp,
                            nonceStr: pay.nonceStr,
                            package: pay.package,
                            signType: pay.signType,
                            paySign: pay.paySign,
                            success(res) {
                                console.log(res)
                                wx.showToast({
                                    title: '购买成功',
                                    icon: 'success',
                                    duration: 2000
                                })
                                wx.showLoading({
                                    title: '加载中',
                                })
                                wx.request({
                                    url: app.data.apiPath + '/webCompany/queryCustomerInfo',
                                    method: "POST",
                                    data: {
                                        customerCode: that.data.options.jianlicode,
                                        unionid: wx.getStorageSync('unionid')
                                    },
                                    header: {
                                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                    },
                                    success: function (res) {
                                        wx.hideLoading();
                                        console.log(res)
                                        // console.log(JSON.parse(res.data).data)
                                        console.log(JSON.parse(JSON.parse(res.data).data))
                                        let resume = JSON.parse(JSON.parse(res.data).data);
                                        // 工作经历时间戳转换
                                        resume.workList.forEach((item) => {
                                            //工作开始时间戳转换
                                            item.startTime = time.formatTime(item.startTime).substring(0, 7).replace(/\//g, ".")
                                            //工作结束时间戳转换
                                            item.endTime = time.formatTime(item.endTime).substring(0, 7).replace(/\//g, ".")
                                        });
                                        // 项目经历时间裁切
                                        resume.projectList.forEach((item) => {
                                            //项目经历开始时间裁切
                                            item.joinProjectTime = time.formatTime(item.joinProjectTime).substring(0, 7).replace(/-/g, ".")
                                            //项目经历开始时间裁切
                                            item.quitProjectTime = time.formatTime(item.quitProjectTime).substring(0, 7).replace(/-/g, ".")
                                        });
                                        // 教育经历时间裁切
                                        resume.educationList.forEach((item) => {
                                            //教育经历开始时间裁切
                                            item.addtime = time.formatTime(item.addtime).substring(0, 7).replace(/-/g, ".")
                                            //教育经历开始时间裁切
                                            item.endTime = time.formatTime(item.endTime).substring(0, 7).replace(/-/g, ".")
                                        });
                                        // console.log(JSON.parse(JSON.parse(res.data)));
                                        // let edulist = JSON.parse(res.data).data;
                                        // console.log(edulist)
                                        that.setData({
                                            resume
                                        })
                                    }
                                })
                            },
                            fail(res) {
                                wx.showToast({
                                    title: '购买失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        })
                    }
                })
            }
        } else {
            // wx.showToast({
            //     title: that.data.resume.reason,
            // })
            wx.showModal({
                title: '提示',
                content: that.data.resume.reason,
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../registered/registered',
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
        // if()
        // wx.request({
        //     url: app.data.apiPath + '/user/getWxUserInfo',
        //     method: "GET",
        //     data: {
        //         unionid: wx.getStorageSync('unionid')
        //     },
        //     header: {
        //         'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //     },
        //     success: function (res) {
        //         // console.log()
        //         console.log(JSON.parse(res.data).data)
        //         let user = JSON.parse(res.data).data;
        //         console.log(user)
        //         if (user.webAccount){
        //             wx.navigateTo({
        //                 url: '../orderdetails/orderdetails',
        //                 // ?otheunionid=' + otheunionid + ' & resumeid=' + resumeid
        //             })
        //         }else{
        //             wx.navigateTo({
        //                 url: '../registered/registered',
        //             })
        //         }
        //     }
        // })
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
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})