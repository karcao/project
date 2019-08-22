const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    //重新编辑
    edit: function () {
        let that = this;
        console.log(that.data.positionId)
        wx.navigateTo({
            url: '../neweditposition/neweditposition?positionId=' + that.data.positionId,
        })
    },
    //发布
    release: function () {
        let that = this;
        console.log(that.data.position)
        //发布
        wx.request({
            url: app.data.apiPath + '/position/saveOrUpdatePositionInfo',
            method: "POST",
            header: {
                'content-type': 'application/json; charset=UTF-8'
            },
            data: {
                positionInfo: {
                    positionInfo: {
                        positionId: that.data.position.position_id,
                        state:1,
                    },
                },
            },
            success: function (res) {
                console.log(res)
                if (JSON.parse(res.data).rstCode == "SUCCESS") {
                    console.log("发布成功")
                    wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 800)

                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        console.log(e)
        let that = this;
        let positionId = JSON.parse(e.positionId)
        console.log(positionId)
        that.setData({
            positionId
        })
        //查询职位详情
        wx.request({
            url: app.data.apiPath + '/position/queryPositionInfo',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                positionId: positionId,
            },
            success: function (res) {
                console.log(e)
                console.log(JSON.parse(res.data).data)
                let position = JSON.parse(res.data).data;
                that.setData({
                    position
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