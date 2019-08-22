const app = getApp()
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

    },
    // 搜索框
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    //搜索部分
    inputTyping: function (e) {
        let that = this;
        // console.log(e.detail.value)
        that.setData({
            inputVal: e.detail.value
        });
        wx.request({
            url: app.data.apiPath + '/team/queryUserInfoByPhone',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;'
            },
            data: {
                phone: that.data.inputVal
            },
            success: function (res) {
                // console.log(res)
                // console.log(JSON.parse(res.data).data)
                let teammember = JSON.parse(res.data).data;
                if (teammember) {
                    console.log(teammember)
                    that.setData({
                        teamphone: that.data.inputVal,
                        teammembershow: true,
                        teammember
                    })
                } else {
                    wx.showToast({
                        title: '抱歉!没有匹配到合适的信息',
                        icon: 'none',
                        duration: 200
                    })
                }
            }
        })
    },
    //确认邀请
    confirmtion: function () {
        let that = this;
        // console.log(that.data.teammember)
        if (that.data.teammember) {
            if (that.data.teammember.unionid == wx.getStorageSync('unionid')) {
                wx.showToast({
                    title: '您已身在其中',
                    icon: 'none',
                    duration: 2000
                })
            } else {
                wx.request({
                    url: app.data.apiPath + '/team/inviteMember',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded;'
                    },
                    data: {
                        tounionid: that.data.teammember.unionid,
                        unionid: wx.getStorageSync('unionid')
                    },
                    success: function (res) {
                        console.log(res)
                        console.log(JSON.parse(res.data).rstCode)
                        if (JSON.parse(res.data).rstCode == 400) {
                            wx.showToast({
                                title: '请勿重复邀请哦',
                                icon: 'none',
                                duration: 2000
                            })
                        } else if (JSON.parse(res.data).rstCode == "SUCCESS") {
                            wx.showToast({
                                title: '邀请成功',
                                duration: 2000,
                                icon: 'success'
                            })
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 500)
                        }
                    }
                })
            }
        } else {
            wx.showToast({
                title: '对不起，该用户不存在',
                duration: 2000,
                icon: 'none'
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
    onShareAppMessage: function () {

    }
})