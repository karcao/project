const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeIndex: 0, //默认选中第一个
        // numArray: [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000],
        numArray:[
            {
                money:10
            },
            {
                money: 50
            },
            {
                money: 100
            },
            {
                money: 200
            },
            {
                money: 500
            },
            {
                money: 1000
            },
            {
                money: 2000
            },
            {
                money: 5000
            },
            {
                money: 10000
            },
        ]
    },
    activethis: function(e) { //点击选中事件
        let that = this;
        let thisindex = e.currentTarget.dataset.thisindex; //当前index
        let inDex = that.data.numArray[thisindex].money
        console.log(inDex)
        that.setData({
            activeIndex: thisindex,
            inDex
        })
    },
    chongzhi:function(e){
        let that = this;
        console.log(that.data.numArray)
        console.log(that.data.inDex)
        wx.showLoading({
            title: '加载中',
        })
        if (that.data.inDex == undefined){
            let money = that.data.numArray[0].money;
            console.log(money)
            wx.request({
                url: app.data.apiPath + '/wxPay/getWxPay',
                method: "POST",
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    money: money
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(res.data.data)
                    let pay = res.data.data
                    // console.log(JSON.parse(res.data).data)
                    wx.requestPayment({
                        timeStamp: pay.timeStamp,
                        nonceStr: pay.nonceStr,
                        package: pay.package,
                        signType: pay.signType,
                        paySign: pay.paySign,
                        success(res) {
                            console.log(res)
                            wx.showToast({
                                title: '购买成功',
                                icon: 'success',
                                duration: 2000
                            })
                            setTimeout(function(){
                                wx.navigateBack({
                                    delta: 1
                                })
                            },300)
                        },
                        fail(res) {
                            wx.showToast({
                                title: '购买失败',
                                icon: 'none',
                                duration: 2000
                            })
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                }
            })
        }else{
            wx.request({
                url: app.data.apiPath + '/wxPay/getWxPay',
                method: "POST",
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    money: that.data.inDex
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(res.data.data)
                    let pay = res.data.data
                    wx.requestPayment({
                        timeStamp: pay.timeStamp,
                        nonceStr: pay.nonceStr,
                        package: pay.package,
                        signType: pay.signType,
                        paySign: pay.paySign,
                        success(res) {
                            console.log(res)
                            wx.showToast({
                                title: '购买成功',
                                icon: 'success',
                                duration: 2000
                            })
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 300)
                        },
                        fail(res) {
                            wx.showToast({
                                title: '购买失败',
                                icon: 'none',
                                duration: 2000
                            })
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                }
            })
        } 
    },
    shenqing:function(){
        wx.navigateTo({
            url: '../tuikuan/tuikuan',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})