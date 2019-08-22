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
        let that = this;
        //查询公司信息接口
        wx.request({
            url: app.data.apiPath + '/userCenter/queryCompanyDetail',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                // unionid: "2323",
            },
            success: function (res) {
                console.log(JSON.parse(res.data).data)
                let companyname = JSON.parse(res.data).data;
                if (companyname){
                    that.setData({
                        companyname: companyname.companyName
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        showCancel:false,
                        content: '抱歉!您没有公司信息需要去添加公司信息',
                        success(res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '../editcompany/editcompany',
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    // 注册
    doRegist:function(e){
        console.log(e)
        let that = this;
        var formObject = e.detail.value;
        var username = formObject.username;
        var password = formObject.password;
        var password1 = formObject.password1;
        console.log(username)
        console.log(password)
        console.log(password1)
        console.log(that.data.companyname)
        //判断账号密码
        if (username.length == 0){
            wx.showToast({
                title: '用户名不能为空',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (username.length < 6) {
            wx.showToast({
                title: '用户名长度不能大小于6位',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (password.length == 0) {
            wx.showToast({
                title: '密码不能为空',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (password.length < 6) {
            wx.showToast({
                title: '密码长度不能大小于6',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (password == username){
            wx.showToast({
                title: '密码不能和账号一样哦',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (password1.length == 0){
            wx.showToast({
                title: '请确认密码',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (password1 != password){
            wx.showToast({
                title: '密码不一致,请重新输入',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        //发起请求
        wx.request({
            url: app.data.apiPath + '/webCompany/registerCompany',    ////////webCompany/bindingCompany
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                companyName: that.data.companyname,
                companyCode: username,
                password: password,
            },
            success: function (res) {
                wx.hideLoading();
                console.log(JSON.parse(res.data))
                console.log(JSON.parse(res.data).rstMessage)
                if (JSON.parse(res.data).rstMessage == 'SUCCESS') {
                    wx.showToast({
                        title: '注册成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function(){
                        wx.navigateBack({
                            delta: 1
                        })
                    },1000)
                }
                if (JSON.parse(res.data).rstCode == 400){
                    wx.showToast({
                        title: JSON.parse(res.data).rstMessage,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
        
    },
    //返回登陆页面
    goLoginPage: function () {
        wx.navigateBack({
            delta:1
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