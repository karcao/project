const app = getApp();
var time = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        winHeight: "", //窗口高度
        state: '',
        type: '0',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        //  高度自适应
        wx.getSystemInfo({
            success: function (res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR;
                that.setData({
                    winHeight: calc
                });
            }
        });
        wx.request({
            url: app.data.apiPath + '/wxPay/buyReCord',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                page: 1,
                pageSize: 15
            },
            success: function (res) {
                console.log(res)
                console.log(res.data.data)
                let queryOrderList = res.data.data;
                queryOrderList.forEach((item)=>{
                    item.addTime = time.formatTime(item.addTime).replace(/\//g, "-")
                })
                console.log(queryOrderList)
                that.setData({
                    queryOrderList
                })
            }
        })
    },
    navtochats:function(e){
        let that = this;
        let idx = e.currentTarget.dataset.index;
        // console.log(that.data.queryOrderList[idx].customerCode)
        if (that.data.queryOrderList[idx].customerCode){
            let jianlicode = that.data.queryOrderList[idx].customerCode;
            wx.navigateTo({
                url: '../networking/networking?jianlicode=' + jianlicode,
            })
        }
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
    // onShareAppMessage: function () {

    // }
})