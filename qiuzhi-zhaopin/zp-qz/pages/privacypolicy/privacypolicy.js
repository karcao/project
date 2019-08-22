const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    // 同意
    agree: function () {
        wx.request({
            url: app.data.apiPath + '/user/consentClause',
            method: "GET",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid')
            },
            success: function (res) {
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                })
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 200)
            }
        })
    },
    // 拒绝
    refuse: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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