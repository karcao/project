const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    navtomesscenterdetails:function(e){
        let that = this;
        console.log(e.currentTarget.dataset.index)
        let listindex = e.currentTarget.dataset.index;
        console.log(that.data.newslist[listindex]);
        let content = that.data.newslist[listindex];
        console.log(content)
        wx.navigateTo({
            url: '../messcenterdetails/messcenterdetails?content=' + JSON.stringify(content)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.request({
            url: app.data.apiPath + '/userCenter/queryUserNewsList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
            },
            success: function (res) {
                console.log(JSON.parse(res.data).data)
                let newslist = JSON.parse(res.data).data;
                that.setData({
                    newslist
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