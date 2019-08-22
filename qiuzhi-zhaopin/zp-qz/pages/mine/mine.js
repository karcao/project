const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bgcolor: app.data.canvas + '/xcx/my-back.png',
    },
    //前往充值页面
    navtorecharge: function () {
        wx.navigateTo({
            url: '../recharge/recharge',
        })
    },
    //前往消息中心
    navtomesscenter: function () {
        wx.navigateTo({
            url: '../messcenter/messcenter',
        })
    },
    //前往我的团队
    navtoyteam: function () {
        wx.navigateTo({
            url: '../myteam/myteam',
        })
    },
    //前往报表统计
    navtostatistics: function () {
        wx.navigateTo({
            url: '../statistics/statistics',
        })
    },
    // 前往公司信息
    navtocomfile: function () {
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
    },
    // 前往消费记录
    navtoexcord: function () {
        wx.navigateTo({
            url: '../excord/excord',
        })
    },
    //客服
    kefu:function(){
        let that = this;
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
                let companyDetail = JSON.parse(res.data).data;
                if (companyDetail) {
                    wx.navigateTo({
                        url: '../registered/registered',
                    })
                }else{
                    wx.showToast({
                        title: '请先完善公司信息',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
        
    },
    // 通知求职者
    // tongzhi:function(){
    //     wx.navigateTo({
    //         url: '../tongzhi/tongzhi',
    //     })
    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.request({
            url: app.data.apiPath + '/userCenter/queryUserCenterIndex',
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
                let company = JSON.parse(res.data).data;
                that.setData({
                    company
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
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.onLoad()
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
    // onShareAppMessage: function () {
    //     let that = this;
    //     // console.log(that.data.positionId)
    //     let yunionid = wx.getStorageSync("unionid");
    //     console.log(yunionid)
    //     return {
    //         title: '伯乐已经在这里恭候多时了!听您吩咐',
    //         path: `/pages/agreement/agreement?yunionid=${yunionid}`,
    //         imageUrl: '../../images/fengmian.jpg',
    //         success: function (res) {
    //             // console.log(res)
    //             // 添加分享记录
    //             // wx.request({
    //             //     url: app.data.apiPath + '/share/add',
    //             //     method: "POST",
    //             //     header: {
    //             //         'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //             //     },
    //             //     data: {
    //             //         unionid: wx.getStorageSync("unionid"),
    //             //         positionId: that.data.positionId,
    //             //         shareType: 2
    //             //     },
    //             //     success: function (res) {
    //             //         console.log(res)
    //             //     }
    //             // })
    //             // 添加分享记录

    //             var shareTickets = res.shareTickets;
    //             if (shareTickets.length == 0) {
    //                 return false;
    //             }
    //             //可以获取群组信息
    //             wx.getShareInfo({
    //                 shareTicket: shareTickets[0],
    //                 success: function (res) {
    //                 }
    //             })
    //             // that.setData({
    //             //     friendShow: false
    //             // })
    //         },
    //         fail: function (res) {
    //             wx.showToast({
    //                 title: '分享失败',
    //                 duration: 1000,
    //                 mask: true
    //             })
    //         }
    //     }
    // }
})