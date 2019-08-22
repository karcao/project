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
        let that = this;
        // 查看退款申请
        wx.request({
            url: app.data.apiPath + '/webCompany/queryApplyRefund',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
            },
            success: function (res) {
                console.log(JSON.parse(res.data).data)
                if (JSON.parse(res.data).data){
                    that.setData({
                        comer:false,
                        state: JSON.parse(res.data).data,
                    })
                }else{
                    that.setData({
                        comer: true,
                    })
                }
            }
        })
    },
    //输入焦点
    shuruxinxi:function(e){
        // console.log(e.detail.value)
        this.setData({
            infor: e.detail.value
        })
    },
    // 提交申请
    btnbtn:function(){
        let that = this;
        if (that.data.infor == undefined || that.data.infor == ""){
            wx.showToast({
                title: '请输入退款信息',
                icon: 'none',
                duration: 2000
            })
            return;
        }else{
            wx.request({
                url: app.data.apiPath + '/webCompany/applyRefund',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    reason: that.data.infor
                },
                success: function (res) {
                    console.log(res)
                    console.log(JSON.parse(res.data))
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function(){
                        wx.navigateBack({
                            delta: 1
                        })
                    },1000)                    
                }
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