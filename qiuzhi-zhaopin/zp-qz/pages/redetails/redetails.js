const app = getApp();
var time = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ellipsis: true,
        hidden:true,
        ellipsis1: true,
        hidden1: true,
        ellipsis2: true,
        hidden2: true,
    },
    ellipsis: function () {
        let value = !this.data.ellipsis;
        this.setData({
            ellipsis: value,
            hidden: false
        })
    },
    ellipsis1: function () {
        let value = !this.data.ellipsis1;
        this.setData({
            ellipsis1: value,
            hidden1: false
        })
    },
    ellipsis2: function () {
        let value = !this.data.ellipsis2;
        this.setData({
            ellipsis2: value,
            hidden2: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        console.log(options)
        console.log(options.otherunionid)
        let currenttime = time.formatTime(new Date()).substring(0, 4);
        that.setData({
            options: options
        })
        // 获取简历详情
        wx.request({
            url: app.data.apiPath + '/resume/resumedetail',
            method: "POST",
            data:{
                otherUnionid: options.otherunionid,
                unionid: wx.getStorageSync('unionid')
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data);
                let resume = JSON.parse(res.data).data;
                //无论成功与失败都要调取浏览记录
                wx.request({
                    url: app.data.apiPath + '/resume/saveResumeRecord',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    data: {
                        resumeId: resume.resumeId,
                        unionid:wx.getStorageSync('unionid')
                    },
                    success: function (res) {
                    }
                })
                //浏览结束
                console.log(resume)
                // 获取年龄用年数相减
                let age = currenttime - resume.birthday.substring(0,4);
                //获取经验用年数相减
                let exp = currenttime - resume.workBegin.substring(0, 4);
                console.log(age)
                console.log(exp)
                // 工作经历时间戳转换
                resume.resumeWorkList.forEach((item) => {
                    //工作开始时间戳转换
                    item.startTime = time.formatTime(item.startTime).substring(0, 7).replace(/\//g, ".")
                    //工作结束时间戳转换
                    item.endTime = time.formatTime(item.endTime).substring(0,7).replace(/\//g, ".")
                });
                // 项目经历时间裁切
                resume.workProjectList.forEach((item) => {
                    //项目经历开始时间裁切
                    item.beginTime = item.beginTime.substring(0, 7).replace(/-/g, ".")
                    //项目经历开始时间裁切
                    item.endTime = item.endTime.substring(0, 7).replace(/-/g, ".")
                });
                // 教育经历时间裁切
                resume.educationList.forEach((item) => {
                    //教育经历开始时间裁切
                    item.beginTime = item.beginTime.substring(0, 7).replace(/-/g, ".")
                    //教育经历开始时间裁切
                    item.endTime = item.endTime.substring(0, 7).replace(/-/g, ".")
                });
                // 评价时间裁切
                resume.resumeEvaluateList.forEach((item) => {
                    //评价时间裁切
                    item.insertTime = item.insertTime.substring(0, 10).replace(/-/g, ".")
                });
                console.log(resume)
                that.setData({
                    resume: resume,
                    age,
                    exp
                })
            }
        })
    },
    //和他聊聊
    withhechat:function(){
        let that = this;
        if (that.data.options.charid == undefined || that.data.options.charid == '' ){
            // 用三个参数去获取charid
            wx.request({
                url: app.data.apiPath + '/chat/queryChatId',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                data: {
                    positionId: that.data.options.positionid,
                    unionid: wx.getStorageSync('unionid'),
                    toUnionid: that.data.options.otherunionid
                },
                success: function (res) {
                    let charid = JSON.parse(res.data).data;
                    wx.navigateTo({
                        url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + that.data.options.otherunionid + '&charid=' + charid + '&positionid=' + that.data.options.positionid,
                    })
                }
            })
        }else{
            wx.navigateTo({
                url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + that.data.options.otherunionid + '&charid=' + that.data.options.charid + '&positionid=' + that.data.options.positionid,
            })
        }
    },
    //点击收藏
    collection:function(){
        let that = this;
        console.log(that.data.resume)
        let resumeId = that.data.resume.resumeId; // 简历ID
        let beCollectionId = that.data.resume.unionid; // 对方的unionid
        if (!that.data.resume.collectionId){
            //收藏简历
            wx.request({
                url: app.data.apiPath + '/resume/saveResumeCollection',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                data: {
                    resumeId: resumeId,
                    unionid: wx.getStorageSync('unionid'),
                    beCollectionId: beCollectionId,
                    flag: 1,//1添加收藏 2删除收藏
                },
                success: function (res) {
                    console.log(res)
                    console.log(JSON.parse(res.data).rstCode);
                    console.log(that.data.resume)
                    if (JSON.parse(res.data).rstCode == 'SUCCESS'){
                        wx.showToast({
                            title: '收藏成功',
                            icon: 'success',
                            duration: 2000
                        })
                        //添加成功后再调取查看简历详情接口
                        wx.request({
                            url: app.data.apiPath + '/resume/resumedetail',
                            method: "POST",
                            data: {
                                otherUnionid: that.data.options.otherunionid,
                                unionid: wx.getStorageSync('unionid')
                            },
                            header: {
                                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                            success:function(res){
                                // console.log(JSON.parse(res.data))
                                // console.log(JSON.parse(JSON.parse(res.data)))
                                // console.log(JSON.parse(res.data).data);
                                let resume = JSON.parse(res.data).data;
                                that.setData({
                                    resume
                                })
                            }
                        })
                    }
                }
            })
        }else{
            //删除收藏简历
            wx.showModal({
                title: '提示',
                content: '确定要取消收藏此简历吗',
                success(res) {
                    if (res.confirm) {
                        //成功时删除
                        wx.request({
                            url: app.data.apiPath + '/resume/saveResumeCollection',
                            method: "POST",
                            header: {
                                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                            },
                            data: {
                                resumeId: resumeId,
                                unionid: wx.getStorageSync('unionid'),
                                beCollectionId: beCollectionId,
                                flag: 2,//1添加收藏 2删除收藏
                            },
                            success: function (res) {
                                console.log(res)
                                console.log(JSON.parse(res.data).rstCode);
                                console.log(that.data.resume)
                                if (JSON.parse(res.data).rstCode == 'SUCCESS') {
                                    wx.showToast({
                                        title: '已取消',
                                        icon: 'success',
                                        duration: 2000
                                    })
                                    //删除成功后再调取查看简历详情接口
                                    wx.request({
                                        url: app.data.apiPath + '/resume/resumedetail',
                                        method: "POST",
                                        data: {
                                            otherUnionid: that.data.options.otherunionid,
                                            unionid: wx.getStorageSync('unionid')
                                        },
                                        header: {
                                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                        },
                                        success: function (res) {
                                            // console.log(JSON.parse(res.data).rs)
                                            // console.log(JSON.parse(JSON.parse(res.data)))
                                            let resume = JSON.parse(res.data).data;
                                            that.setData({
                                                resume
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    } else if (res.cancel) {
                        return;
                    }
                }
            })
        }
    },
    //点击一键拨号
    dial:function(){
        let that = this;
        console.log(that.data.resume)
        wx.makePhoneCall({
            phoneNumber: that.data.resume.tel,
        })
    },
    //点击获取电话号码也就是购买简历
    buyphone:function(){
        let that = this;
        console.log(that.data.resume)
        let otheunionid = that.data.resume.unionid;
        let resumeid = that.data.resume.resumeId;
        wx.navigateTo({
            url: '../orderdetails/orderdetails?otheunionid=' + otheunionid + '&resumeid=' + resumeid,
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