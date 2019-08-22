const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        one: app.data.canvas + '/xcx/bg1.png',
        two: app.data.canvas + '/xcx/bg2.png',
        three: app.data.canvas + '/xcx/bg3.png',
        four: app.data.canvas + '/xcx/bg4.png',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    memberdata: function () {
        wx.navigateTo({
            url: '../memberdata/memberdata',
        })
    },
    scrollline: function () {
        wx.navigateTo({
            url: '../datestatistics/datestatistics',
        })
    },
    pie: function () {
        wx.navigateTo({
            url: '../periodstatistics/periodstatistics',
        })
    },
    progress:function(){
        wx.navigateTo({
            url: '../progress/progress',
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