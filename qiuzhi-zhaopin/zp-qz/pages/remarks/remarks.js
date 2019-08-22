const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // name:'123',
        nameimg: false,
        phoneimg: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let that = this;
        that.setData({
            options
        })
    },
    //删除name
    deletename: function () {
        let that = this;
        that.setData({
            name: '',
            nameimg: false
        })
    },
    //键盘输入时触发
    bindinput: function (e) {
        let that = this;
        console.log(e)
        that.setData({
            name: e.detail.value
        })
        if (e.detail.cursor != 0) {
            that.setData({
                nameimg: true
            })
        } else {
            that.setData({
                nameimg: false
            })
        }
        console.log('键盘输入时触发')
    },
    //输入框聚焦时触发
    bindfocus: function (e) {
        let that = this;
        if (that.data.name == "" || that.data.name == undefined) {
            that.setData({
                nameimg: false
            })
        } else {
            that.setData({
                nameimg: true
            })
        }
    },
    //失去焦点时触发
    bindblur: function (e) {
        let that = this;
        that.setData({
            nameimg: false
        })
    },
    /////////////////////////////
    //删除phone
    deletename1: function () {
        let that = this;
        that.setData({
            phone: '',
            phoneimg: false
        })
    },
    //键盘输入时触发
    bindinput1: function (e) {
        let that = this;
        that.setData({
            phone: e.detail.value
        })
        if (e.detail.cursor != 0) {
            that.setData({
                phoneimg: true
            })
        } else {
            that.setData({
                phoneimg: false
            })
        }
        console.log('键盘输入时触发')
    },
    //输入框聚焦时触发
    bindfocus1: function (e) {
        let that = this;
        if (that.data.phone == "" || that.data.phone == undefined) {
            that.setData({
                phoneimg: false
            })
        } else {
            that.setData({
                phoneimg: true
            })
        }
    },
    //失去焦点时触发
    bindblur1: function (e) {
        let that = this;
        that.setData({
            phoneimg: false
        })
    },
    //完成确认
    navtoaddsteam: function () {
        let that = this;
        // let regs = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        console.log(that.data.name)
        console.log(that.data.options)
        //判断名字
        if (that.data.name == '' || that.data.name == undefined) {
            wx.showToast({
                title: '备注不能为空',
                duration: 2000,
                icon: 'none'
            })
            return;
        }
        //发起接口
        wx.request({
            url: app.data.apiPath + '/team/modifyRemark',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                remark: that.data.name,
                tounionid: that.data.options.tounionid,
                teamId: that.data.options.teamid
            },
            success: function (res) {
                console.log(res)
                if (JSON.parse(res.data).rstCode == "SUCCESS") {
                    wx.showToast({
                        title: '修改成功',
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
        console.log('request')
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