const app = getApp();
var wxCharts = require('../../utils/wxcharts.js');
var util = require("../../utils/util.js");
var lineChart = null;
var startPos = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        yi: app.data.canvas + '/xcx/yi.png',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        var windowWidth = 325;
        try {
            var res = wx.getSystemInfoSync();
            // console.log(res)
            windowWidth = res.windowWidth;
            that.setData({
                windowWidth
            })
        } catch (e) {
            // console.error('getSystemInfoSync failed!');
        }
        //当前登陆人前三天的数据
        wx.request({
            url: app.data.apiPath + '/statistics/querty3DayHour',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
            },
            success: function(res) {
                // console.log(res)
                console.log(res.data.data)
                let newarr = res.data.data;
                // newarr.forEach((item) => {
                //     item.date = util.formatTime(item.date, 'Y/M/D h:m:s')
                // });
                console.log(newarr[0])
                if (newarr[0] == null){
                    var data = []
                }else{
                    var data = [newarr[0].h0, newarr[0].h1, newarr[0].h2, newarr[0].h3, newarr[0].h4, newarr[0].h5, newarr[0].h6, newarr[0].h7, newarr[0].h8, newarr[0].h9, newarr[0].h10, newarr[0].h11, newarr[0].h12, newarr[0].h13, newarr[0].h14, newarr[0].h15, newarr[0].h16, newarr[0].h17, newarr[0].h18, newarr[0].h19, newarr[0].h20, newarr[0].h21, newarr[0].h22, newarr[0].h23,];
                }
                if (newarr[1] == null){
                    var data1 = []
                }else{
                    var data1 = [newarr[1].h0, newarr[1].h1, newarr[1].h2, newarr[1].h3, newarr[1].h4, newarr[1].h5, newarr[1].h6, newarr[1].h7, newarr[1].h8, newarr[1].h9, newarr[1].h10, newarr[1].h11, newarr[1].h12, newarr[1].h13, newarr[1].h14, newarr[1].h15, newarr[1].h16, newarr[1].h17, newarr[1].h18, newarr[1].h19, newarr[1].h20, newarr[1].h21, newarr[1].h22, newarr[1].h23,];
                }
                if (newarr[2] == null){
                    var data2 = []
                }else{
                    var data2 = [newarr[2].h0, newarr[2].h1, newarr[2].h2, newarr[2].h3, newarr[2].h4, newarr[2].h5, newarr[2].h6, newarr[2].h7, newarr[2].h8, newarr[2].h9, newarr[2].h10, newarr[2].h11, newarr[2].h12, newarr[2].h13, newarr[2].h14, newarr[2].h15, newarr[2].h16, newarr[2].h17, newarr[2].h18, newarr[2].h19, newarr[2].h20, newarr[2].h21, newarr[2].h22, newarr[2].h23,];
                }
                let simulationData = that.createSimulationData();
                lineChart = new wxCharts({
                    canvasId: 'lineCanvas',
                    type: 'line',
                    categories: simulationData.categories,
                    animation: false,
                    series: [{
                        name: '昨天',
                        data: data,
                        format: function(val, name) {
                            return val.toFixed(0);
                        }
                    }, {
                        name: '前天',
                        data: data1,
                        format: function(val, name) {
                            return val.toFixed(0);
                        }
                    }, {
                        name: '大前天',
                        data: data2,
                        format: function(val, name) {
                            return val.toFixed(0);
                        }
                    }],
                    xAxis: {
                        disableGrid: false
                    },
                    yAxis: {
                        title: '数量',
                        min: 0
                    },
                    width: that.data.windowWidth,
                    height: 150,
                    dataLabel: true,
                    dataPointShape: true,
                    enableScroll: true,
                    extra: {
                        lineStyle: 'curve'
                    }
                });
            }
        })
        //日
        wx.request({
            url: app.data.apiPath + '/statistics/quertyContrast',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                type: 1
            },
            success: function(res) {
                console.log(res.data.data)
                let datadata = res.data.data;
                if (datadata.inmurl1) {
                    that.setData({
                        datadata,
                        inmurl1: datadata.headimgurl,
                        nickname1: datadata.nickname
                    })
                    if (datadata.oneselfCount >= datadata.firstCount) {
                        that.setData({
                            datanum: 100
                        })
                    } else {
                        let datanum = parseInt(datadata.oneselfCount / datadata.firstCount * 100)
                        that.setData({
                            datanum: datanum
                        })
                    }
                } else {
                    that.setData({
                        datadata
                    })
                    // wx.showToast({
                    //     title: '本日暂无数据',
                    // })
                }
            }
        })
        //周
        wx.request({
            url: app.data.apiPath + '/statistics/quertyContrast',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                type: 2
            },
            success: function(res) {
                console.log(res.data.data)
                let datadata1 = res.data.data;
                if (datadata1.inmurl2) {
                    that.setData({
                        datadata1,
                        inmurl2: datadata1.headimgurl,
                        nickname2: datadata1.nickname
                    })
                    if (datadata1.oneselfCount >= datadata1.firstCount) {
                        that.setData({
                            datanum1: 100
                        })
                    } else {
                        let datanum1 = parseInt(datadata1.oneselfCount / datadata1.firstCount * 100)
                        that.setData({
                            datanum1: datanum1
                        })
                    }
                } else {
                    that.setData({
                        datadata1
                    })
                    // wx.showToast({
                    //     title: '本周暂无数据',
                    // })
                }
            }
        })
        //月
        wx.request({
            url: app.data.apiPath + '/statistics/quertyContrast',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                type: 3
            },
            success: function(res) {
                console.log(res.data.data)
                let datadata2 = res.data.data;
                if (datadata2.inmurl3) {
                    that.setData({
                        datadata2,
                        inmurl3: datadata2.headimgurl,
                        nickname3: datadata2.nickname
                    })
                    if (datadata2.oneselfCount >= datadata2.firstCount) {
                        that.setData({
                            datanum2: 100
                        })
                    } else {
                        let datanum2 = parseInt(datadata2.oneselfCount / datadata2.firstCount * 100)
                        that.setData({
                            datanum2: datanum2
                        })
                    }
                } else {
                    that.setData({
                        datadata2
                    })
                    // wx.showToast({
                    //     title: '本月暂无数据',
                    // })
                }
            }
        })
    },
    //鼠标拖动
    touchHandler: function(e) {
        lineChart.scrollStart(e);
    },
    moveHandler: function(e) {
        lineChart.scroll(e);
    },
    touchEndHandler: function(e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function(item, category) {
                return category + ' ' + item.name + ':' + item.data
            }
        });
    },
    //小时
    createSimulationData: function() {
        var categories = [];
        for (var i = 0; i < 24; i++) {
            categories.push('' + i);
        }
        return {
            categories: categories,
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