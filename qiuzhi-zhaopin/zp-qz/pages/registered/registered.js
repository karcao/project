const app = getApp();
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
    doLogin:function(e){
        wx.showLoading({
            title: '请稍后',
        })
        console.log(e)
        var formObject = e.detail.value;
        var username = formObject.username;
        var password = formObject.password;
        console.log(username)
        console.log(password)
        // 简单验证
        if (username.length == 0 || password.length == 0) {
            wx.showToast({
                title: '用户名或密码不能为空',
                icon: 'none',
                duration: 3000
            })
            return;
        };
        //发起请求
        wx.request({
            url: app.data.apiPath + '/webCompany/bindingCompany',    ////////webCompany/bindingCompany
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                unionid:wx.getStorageSync('unionid'),
                companyCode: username,
                password: password,
            },
            success: function (res) {
                wx.hideLoading();
                console.log(JSON.parse(res.data))
                console.log(JSON.parse(res.data).rstMessage)
                if (JSON.parse(res.data).rstMessage == 'SUCCESS'){
                    wx.showToast({
                        title: '登陆成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1000)
                }
                if (JSON.parse(res.data).rstMessage == '没有此账号,或账户密码错误，您先可以先注册再绑定'){
                    wx.showToast({
                        title: '没有此账号,或账户密码错误',
                        icon: 'none',
                        duration: 2500
                    })
                }
            }
        })
    },
    //去注册
    goRegistPage: function () {
        wx.navigateTo({
            url: '../landing/landing',
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