const app = getApp();
var time = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageIndex: 1, //默认第一页
        positionzw: false,
        positionxz: true,
        //工作年限
        explist: [{
            expid: 1,
            name: '1年以下'
        }, {
            expid: 2,
            name: '1-3年'
        }, {
            expid: 3,
            name: '3-5年'
        }, {
            expid: 4,
            name: '5-10年'
        }, {
            expid: 5,
            name: '10年以上'
        }],
        //投递时间
        datelist: [{
            dateid: 1,
            name: '最近三天'
        }, {
            dateid: 2,
            name: '最近一周'
        }, {
            dateid: 3,
            name: '最近二周'
        }, {
            dateid: 4,
            name: '最近一个月'
        }, {
            dateid: 5,
            name: '一个月以上'
        }],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let data = {
            "unionid": wx.getStorageSync('unionid')
        };
        wx.showLoading({
            title: '加载中',
        })
        that.obtain();
        that.hqposition();
        wx.request({
            url: app.data.apiPath + '/webCompany/searchCustomerInfo',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;'
            },
            data: data,
            success: function(res) {
                wx.hideLoading();
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let browserecord = JSON.parse(res.data).data;
                if (browserecord == undefined) {
                    that.setData({
                        bgshow3: false,
                        browserecord: []
                    })
                    wx.showToast({
                        title: '没有匹配到合适的信息',
                        icon: 'none',
                        duration: 2000
                    })
                } else if (browserecord.length != 0) {
                    browserecord.forEach((item) => {
                        item.ResumeUpdateDate = time.formatTime(item.ResumeUpdateDate, 'Y/M/D').substring(0, 10)
                    })
                    console.log(browserecord)
                    that.setData({
                        bgshow3: false,
                        browserecord
                    })
                } else {
                    that.setData({
                        bgshow3: false,
                        browserecord: []
                    })
                    wx.showToast({
                        title: '没有匹配到合适的信息',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    //点击遮罩层全部隐藏
    bghide: function() {
        let that = this;
        that.setData({
            bgshow3: false
        })
    },
    //点击更多状态弹出框
    newmore: function() {
        let that = this;
        that.setData({
            bgshow3: !that.data.bgshow3,
        })
    },
    //获取新职位
    hqposition: function() {
        let that = this;
        wx.request({
            url: app.data.apiPath + '/dicJob/queryPositionByParent',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function(res) {
                let query = JSON.parse(res.data).data;
                console.log(query[0].positionList)
                let objectArray = query[0].positionList;
                that.setData({
                    objectArray
                })
            }
        });
    },
    // 获取学历封装
    obtain: function() {
        let that = this;
        //获取要求里学历列表并渲染
        wx.request({
            url: app.data.apiPath + '/dicJob/queryEducation',
            method: "POST",
            header: {
                'content-type': 'application/x-www-urlencoded; charset=UTF-8'
            },
            success: function(res) {
                let edulist = JSON.parse(res.data).data;
                console.log(edulist)
                that.setData({
                    edulist
                })
            }
        })
    },
    //求职状态选择器
    bindstateChange: function(e) {
        let that = this;
        that.setData({
            state: e.detail.value,
            positionzw: true,
            positionxz: false
        })
    },
    //要求内的学历
    clickedu: function(e) {
        let that = this;
        console.log(e.currentTarget.dataset.index)
        that.setData({
            curNav: e.currentTarget.dataset.index
        })
    },
    //要求内工作经验
    clickexp: function(e) {
        let that = this;
        console.log(e.currentTarget.dataset.index)
        that.setData({
            curNav1: e.currentTarget.dataset.index
        })
    },
    //要求内投递时间
    clicksalary: function(e) {
        let that = this;
        console.log(e.currentTarget.dataset.index)
        that.setData({
            curNav2: e.currentTarget.dataset.index
        })
    },
    //点击重置
    reset4: function() {
        let that = this;
        that.setData({
            positionzw: false,
            positionxz: true,
            curNav: null,
            curNav1: null,
            curNav2: null
        })
    },
    //点击确定交给后台
    determine4: function() {
        wx.showLoading({
            title: '加载中',
        })
        let that = this;
        // let currenttime = time.formatTime(new Date()).substring(0, 4);
        var data = {
            "unionid": wx.getStorageSync('unionid'),
            "page": 1,
            "pageSize": 15
        };
        // console.log(that.data.objectArray);//职位列表
        // console.log(that.data.edulist);//学历列表
        // console.log(that.data.explist);//工作经验列表
        // console.log(that.data.datelist);//投递时间列表
        console.log(that.data.positionxz)
        console.log(that.data.objectArray[that.data.state])
        console.log(that.data.edulist[that.data.curNav])
        console.log(that.data.explist[that.data.curNav1])
        console.log(that.data.datelist[that.data.curNav2])
        if (that.data.positionxz == false) {
            data.professionid = that.data.objectArray[that.data.state].id
        }
        console.log(data)
        if (that.data.curNav) {
            data.educationid = that.data.edulist[that.data.curNav].educationId
        }
        if (that.data.curNav1) {
            data.gradeid = that.data.explist[that.data.curNav1].expid
        }
        if (that.data.curNav2) {
            data.delivery = that.data.datelist[that.data.curNav2].dateid
        }
        console.log(data)
        // console.log(professionid)
        // console.log(educationid)
        // console.log(gradeid)
        // console.log(delivery)
        ////////////////////////////////////////////////////////
        wx.request({
            url: app.data.apiPath + '/webCompany/searchCustomerInfo',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;'
            },
            data: data,
            success: function(res) {
                wx.hideLoading();
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let browserecord = JSON.parse(res.data).data;
                if (browserecord == undefined) {
                    that.setData({
                        bgshow3: false,
                        browserecord: []
                    })
                    wx.showToast({
                        title: '没有匹配到合适的信息',
                        icon: 'none',
                        duration: 2000
                    })
                } else if (browserecord.length != 0) {
                    browserecord.forEach((item) => {
                        item.ResumeUpdateDate = time.formatTime(item.ResumeUpdateDate, 'Y/M/D').substring(0, 10)
                    })
                    console.log(browserecord)
                    that.setData({
                        bgshow3: false,
                        browserecord
                    })
                } else {
                    that.setData({
                        bgshow3: false,
                        browserecord: []
                    })
                    wx.showToast({
                        title: '没有匹配到合适的信息',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    //查看简历详情
    myresume3: function(e) {
        let that = this;
        console.log(that.data.browserecord)
        console.log(e.currentTarget.dataset.index)
        let jianlicode = that.data.browserecord[e.currentTarget.dataset.index].CustomerCode;
        wx.navigateTo({
            url: '../networking/networking?jianlicode=' + jianlicode,
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
        let that = this;
        let pageIndex = that.data.pageIndex + 1;
        wx.showLoading({
            title: '加载中',
        })
        var data = {
            "unionid": wx.getStorageSync('unionid'),
            "page": pageIndex,
            "pageSize": 15
        };
        console.log(data)
        console.log(that.data.positionxz)
        console.log(that.data.objectArray[that.data.state])
        console.log(that.data.edulist[that.data.curNav])
        console.log(that.data.explist[that.data.curNav1])
        console.log(that.data.datelist[that.data.curNav2])
        if (that.data.positionxz == false) {
            data.professionid = that.data.objectArray[that.data.state].id
        }
        console.log(data)
        if (that.data.curNav) {
            data.educationid = that.data.edulist[that.data.curNav].educationId
        }
        if (that.data.curNav1) {
            data.gradeid = that.data.explist[that.data.curNav1].expid
        }
        if (that.data.curNav2) {
            data.delivery = that.data.datelist[that.data.curNav2].dateid
        }
        console.log(data)
        wx.request({
            url: app.data.apiPath + '/webCompany/searchCustomerInfo',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;'
            },
            data: data,
            success: function(res) {
                wx.hideLoading();
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let browserecord1 = JSON.parse(res.data).data;
                if (browserecord1.length != 0){
                    browserecord1.forEach((item) => {
                        item.ResumeUpdateDate = time.formatTime(item.ResumeUpdateDate, 'Y/M/D').substring(0, 10)
                    })
                    let array = that.data.browserecord;
                    for (let i = 0; i < browserecord1.length; i++) {
                        array.push(browserecord1[i])
                    }
                    that.setData({
                        browserecord: that.data.browserecord,
                        pageIndex
                    })
                    console.log(that.data.browserecord)
                }else{
                    wx.showToast({
                        title: '没有更多数据啦',
                        icon: 'none',
                        duration: 1500
                    })
                }
                
                // let browserecord = JSON.parse(res.data).data;
                // if (browserecord == undefined) {
                //     that.setData({
                //         bgshow3: false,
                //         browserecord: []
                //     })
                //     wx.showToast({
                //         title: '没有匹配到合适的信息',
                //         icon: 'none',
                //         duration: 2000
                //     })
                // }
                // else if (browserecord.length != 0) {
                //     browserecord.forEach((item) => {
                //         item.ResumeUpdateDate = time.formatTime(item.ResumeUpdateDate, 'Y/M/D').substring(0, 10)
                //     })
                //     console.log(browserecord)
                //     that.setData({
                //         bgshow3: false,
                //         browserecord
                //     })
                // } else {
                //     that.setData({
                //         bgshow3: false,
                //         browserecord: []
                //     })
                //     wx.showToast({
                //         title: '没有匹配到合适的信息',
                //         icon: 'none',
                //         duration: 2000
                //     })
                // }
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})