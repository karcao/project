const app = getApp();
var time = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        console.log(options)
        that.orderprice(options.resumeid,wx.getStorageSync('unionid'))
        that.inquire(options.resumeid, options.otheunionid,wx.getStorageSync('unionid'))
    },
    //首先拿着我的unionid和简历id获取订单价格
    orderprice: function (resumeId, unionid){
        let that = this;
        //收藏简历
        wx.request({
            url: app.data.apiPath + '/order/queryResumePrice',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                resumeId: resumeId,
                unionid: unionid,
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data);
                let price = JSON.parse(res.data).data;
                that.setData({
                    price
                })
            }
        })
    },
    //根据上个页面传过来得简历id和unionid查询简历详情封装
    inquire: function (resumeId, otherUnionid, unionid){
        let that = this;
        let currenttime = time.formatTime(new Date()).substring(0, 4);
        //收藏简历
        wx.request({
            url: app.data.apiPath + '/resume/resumedetail',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                resumeId: resumeId,
                otherUnionid: otherUnionid,
                unionid: unionid,
            },
            success: function (res) {
                console.log(JSON.parse(res.data).data);
                let reume = JSON.parse(res.data).data;
                reume.workBegin = currenttime - reume.workBegin.substring(0, 4);
                that.setData({
                    reume
                })
                console.log(that.data.reume)
            }
        })
    },
    //确认支付
    payment:function(){
        let that = this;
        console.log(that.data.price)
        wx.request({
            url: app.data.apiPath + '/order/orderDaySuccess',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                orderId: that.data.price.orderId,
                unionid: wx.getStorageSync('unionid'),
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).rstCode);
                if (JSON.parse(res.data).rstCode =="SUCCESS"){
                    wx.showToast({
                        title: '购买成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1500)
                }else{}
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