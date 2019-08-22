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
    onLoad: function(options) {
        let that = this;
        //获取职位靓点
        wx.request({
            url: app.data.apiPath + '/position/queryPositionBrightTagList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function(res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let postlist = JSON.parse(res.data).data;
                postlist.forEach((item) => {
                    item.checked = false
                })
                // 赋值给postlist
                console.log(postlist)
                that.setData({
                    postlist
                })

            }
        })
    },
    clickitem: function(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let item = that.data.postlist[index];
        item.checked = !item.checked;
        that.setData({
            postlist: that.data.postlist,
            index: index
        })
        console.log(that.data.postlist[index]);
        console.log(that.data.postlist[index].checked)
        
    },
    save:function(){
        let that = this;
        var newarr = [];
        for (let i = 0; i < that.data.postlist.length;i++){
            if (that.data.postlist[i].checked == true) {
                newarr.push(that.data.postlist[i])
                // console.log(that.data.postlist[i])
                // console.log(that.data.postlist[i].length)
            }
        }
        console.log(newarr.length)
        if(newarr.length > 5){
            wx.showToast({
                title: '靓点不能超过5个哦',
                duration: 2000,
                icon: 'none'
            })
            return;
        }else{
            wx.setStorageSync('defectarr', newarr)
            wx.navigateBack({
                delta: 1
            })
        }
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