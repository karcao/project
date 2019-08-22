const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    // 点击别处隐藏按钮
    navtochats: function () {
        let that = this;
        that.setData({
            inDex: -1,
        })
    },
    data: {

    },
    //长按全部列表出现弹窗
    ondelete: function (e) {
        let that = this;

        that.setData({
            inDex: e.currentTarget.dataset.index
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.queryTeamList();
    },
    //封装团队成员列表
    queryTeamList: function () {
        let that = this;
        wx.request({
            url: app.data.apiPath + '/team/queryTeamList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                type: -1,
                page: 1,
                pageSize: 15,
                unionid: wx.getStorageSync('unionid')
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let teamlist = JSON.parse(res.data).data;
                if (teamlist.length != 0) {
                    that.setData({
                        teamlist
                    })
                } else {
                    console.log('kong')
                }
            }
        })
    },
    //添加成员
    navtoaddsteam: function () {
        wx.navigateTo({
            url: '../addsteam/addsteam',
        })
    },
    //备注跳转
    vae1: function (e) {
        let that = this;
        console.log(e)
        this.setData({
            inDex: -1,
        })
        let index = e.currentTarget.dataset.index;
        let tounionid = that.data.teamlist[index].temeUnionid;
        let teamid = that.data.teamlist[index].teamId;
        wx.navigateTo({
            url: '../remarks/remarks?tounionid=' + tounionid + '&teamid=' + teamid,
        })
    },
    //删除
    vae2: function (e) {
        let that = this;
        console.log(e.currentTarget.dataset.index)
        this.setData({
            inDex: -1,
        })
        let index = e.currentTarget.dataset.index;
        let tounionid = that.data.teamlist[index].temeUnionid;
        let teamid = that.data.teamlist[index].teamId;
        console.log(that.data.teamlist)
        console.log(tounionid)
        console.log(teamid)
        wx.request({
            url: app.data.apiPath + '/team/deleteInvite',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                tounionid: tounionid,
                teamId: teamid
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).rstCode)
                that.queryTeamList();
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // this.onLoad()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.queryTeamList();
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