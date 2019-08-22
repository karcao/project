const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        curIDx: false,
        starDesc: '非常好',
        stars: [{
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '差'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '较差'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '一般'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '好'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '非常好'
        }],
        starDesc1: '非常好',
        stars1: [{
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '差'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '较差'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '一般'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '好'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '非常好'
        }],
        starDesc2: '非常好',
        stars2: [{
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '差'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '较差'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '一般'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '好'
        }, {
            lightImg: '../../images/icon/star-active.png',
            blackImg: '../../images/icon/star.png',
            flag: 1,
            message: '非常好'
        }],
    },
    //点击选中和不选中匿名
    chooseImgtab: function(e) {
        let that = this;
        that.setData({
            curIDx: !that.data.curIDx
        })
    },
    // 选择评价星星
    starClick: function(e) {
        console.log(e)
        var that = this;
        for (var i = 0; i < that.data.stars.length; i++) {
            var allItem = 'stars[' + i + '].flag';
            that.setData({
                [allItem]: 2
            })
        }
        var index = e.target.dataset.index;
        for (var i = 0; i <= index; i++) {
            var item = 'stars[' + i + '].flag';
            that.setData({
                [item]: 1
            })
        }
        this.setData({
            starDesc: this.data.stars[index].message,
            iDx: index
        })
    },
    starClick1: function(e) {
        console.log(e)
        var that = this;
        for (var i = 0; i < that.data.stars1.length; i++) {
            var allItem = 'stars1[' + i + '].flag';
            that.setData({
                [allItem]: 2
            })
        }
        var index = e.target.dataset.index;
        for (var i = 0; i <= index; i++) {
            var item = 'stars1[' + i + '].flag';
            that.setData({
                [item]: 1
            })
        }
        this.setData({
            starDesc1: this.data.stars1[index].message,
            iDx1:index
        })
    },
    starClick2: function(e) {
        console.log(e)
        var that = this;
        for (var i = 0; i < that.data.stars2.length; i++) {
            var allItem = 'stars2[' + i + '].flag';
            that.setData({
                [allItem]: 2
            })
        }
        var index = e.target.dataset.index;
        for (var i = 0; i <= index; i++) {
            var item = 'stars2[' + i + '].flag';
            that.setData({
                [item]: 1
            })
        }
        this.setData({
            starDesc2: this.data.stars2[index].message,
            iDx2: index
        })
    },
    //获取评价内容
    dutyChange: function (e) {
        var name = e.currentTarget.dataset.name;
        this.setData({
            [name]: e.detail.value.replace(/\s+/g, ''),
            dutyInput: e.detail.value
        })
    },
    submit: function() {
        let that = this;
        console.log(that.data.curIDx);
        let skillScore = ""; //技能
        let linkScore = ""; //能力
        let workScore = ""; //态度
        let duty = that.data.dutyInput; //描述内容
        let anonymity = '';
        // 判断技能
        if (that.data.iDx == 0) {
            skillScore = 1
        }
        if (that.data.iDx == 1) {
            skillScore = 2
        }
        if (that.data.iDx == 2) {
            skillScore = 3
        }
        if (that.data.iDx == 3) {
            skillScore = 4
        }
        if (that.data.iDx == 4 || that.data.iDx == undefined) {
            skillScore = 5
        }
        
        // 判断能力
        if (that.data.iDx1 == 0) {
            linkScore = 1
        }
        if (that.data.iDx1 == 1) {
            linkScore = 2
        }
        if (that.data.iDx1 == 2) {
            linkScore = 3
        }
        if (that.data.iDx1 == 3) {
            linkScore = 4
        }
        if (that.data.iDx1 == 4 || that.data.iDx1 == undefined) {
            linkScore = 5
        }
        // 判断态度
        if (that.data.iDx2 == 0) {
            workScore = 1
        }
        if (that.data.iDx2 == 1) {
            workScore = 2
        }
        if (that.data.iDx2 == 2) {
            workScore = 3
        }
        if (that.data.iDx2 == 3) {
            workScore = 4
        }
        if (that.data.iDx2 == 4 || that.data.iDx2 == undefined) {
            workScore = 5
        }
        //判断匿名为1
        if (that.data.curIDx){
            anonymity = 1
        }else{
            anonymity = 0
        }
        console.log(anonymity)
        console.log(skillScore)
        console.log(linkScore)
        console.log(workScore)
        console.log(duty)
        wx.request({
            url: app.data.apiPath + '/chat/saveOrUpdateEvaluate',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                resumeId: that.data.options.resumeId,
                skillScore: skillScore,
                linkScore: linkScore,
                workScore: workScore,
                content: duty,
                anonymity: anonymity
            },
            success: function (res) {
                if (JSON.parse(res.data).rstCode == "SUCCESS") {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1500)
                } else { }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        console.log(options)
        that.setData({
            options
        })
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