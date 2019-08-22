var wxCharts = require('../../utils/wxcharts.js');
var util = require("../../utils/util.js")
var app = getApp();
var pieChart = null;
const sun = 24 * 60 * 60 * 1000;
Page({
    data: {
        chartTitle: '统计',
        objectArray: [
            {
                id: 1,
                name: '前一周'
            },
            {
                id: 2,
                name: '前二周'
            },
            {
                id: 3,
                name: '前三周'
            },
            {
                id: 4,
                name: '前四周'
            }
        ],
    },
    touchHandler: function(e) {
        console.log(pieChart.getCurrentDataIndex(e));
    },
    onLoad: function(e) {
        let that = this;
        console.log(that.getDateStr(null, -1))
        let yesterday = that.getDateStr(null, -1);
        // let time = util.formatDate(new Date());
        // let date = util.getDates(7, time);
        // console.log(date)
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        wx.showLoading({
            title: '加载中',
        })
        that.setData({
            active: false,
            active1: true,
            active4: true,
            active2: false,
            active5: false,
            active6: false
        })
        wx.request({
            url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                startDate: yesterday,
                type: 1
            },
            success: function (res) {
                wx.hideLoading();
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let infor = JSON.parse(res.data).data;
                if (JSON.parse(res.data).data.length == 0) {
                    wx.showToast({
                        title: '没有数据',
                        duration: 3500,
                        icon: 'none'
                    })
                    return;
                } else {
                    infor.forEach(function (item) {
                        item.data = item.browseCount;
                        item.name = String(item.statisticsHour);
                        delete item.browseCount
                        delete item.statisticsHour
                        delete item.communicateCount
                        delete item.positionCount
                    })
                    console.log(infor)
                    that.setData({
                        infor
                    })
                    pieChart = new wxCharts({
                        animation: true,
                        canvasId: 'pieCanvas',
                        type: 'pie',
                        series: that.data.infor,
                        width: windowWidth,
                        height: 300,
                        dataLabel: true,
                    });
                }
            }
        })
    },
    //选择日
    bindDateChangeri: function(e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            // console.error('getSystemInfoSync failed!');
        }
        let that = this;
        that.setData({
            shijian: e.detail.value
        })
        wx.showLoading({
            title: '加载中',
        })
        that.setData({
            active: false,
            active1: true,
            active2: false,
            active4: true,
            active5: false,
            active6: false
        })
        wx.request({
            url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                startDate: e.detail.value,
                type: 1
            },
            success: function(res) {
                wx.hideLoading();
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let infor = JSON.parse(res.data).data;
                if (JSON.parse(res.data).data.length == 0) {
                    wx.showToast({
                        title: '没有数据',
                        duration: 3500,
                        icon: 'none'
                    })
                    return;
                } else {
                    infor.forEach(function (item) {
                        item.data = item.browseCount;
                        item.name = String(item.statisticsHour);
                        delete item.browseCount
                        delete item.statisticsHour
                        delete item.communicateCount
                        delete item.positionCount
                    })
                    console.log(infor)
                    that.setData({
                        infor
                    })
                    pieChart = new wxCharts({
                        animation: true,
                        canvasId: 'pieCanvas',
                        type: 'pie',
                        series: that.data.infor,
                        width: windowWidth,
                        height: 300,
                        dataLabel: true,
                    });
                }
            }
        })
    },
    //选择周
    bindDateChangezhou: function (e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            // console.error('getSystemInfoSync failed!');
        }
        let that = this;
        that.setData({
            active: false,
            active1: false,
            active2: true,
            active4: true,
            active5: false,
            active6: false
        })
        console.log(that.getDateStr(null, 0))
        console.log(new Date().getDay())
        console.log(new Date().getTime())
        var Dateday = new Date().getTime();
        wx.showLoading({
            title: '加载中',
        })
        if (e.detail.value == 0) {
            if (new Date().getDay() >= 1) {
                //这种情况不是周日
                //获取周一
                var Data3 = Dateday - sun * (new Date().getDay() - 1);  //先获取本周一的时间戳
                console.log(Data3)
                var monday = Data3 - sun * 7;   //再获取上周一的时间戳
                console.log(monday)
                var startDate = util.formatTime(monday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(startDate)
                //获取周日
                var sunday = Dateday - sun * (new Date().getDay());
                console.log(sunday)
                var endDate = util.formatTime(sunday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(endDate)
                that.setData({
                    startDate,
                    endDate
                })
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        startDate: startDate,
                        endDate: endDate,
                        type: 2
                    },
                    success: function (res) {
                        wx.hideLoading();
                        console.log(res)
                        console.log(JSON.parse(res.data).data)
                        let infor = JSON.parse(res.data).data;
                        if (JSON.parse(res.data).data.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 3500,
                                icon: 'none'
                            })
                            return;
                        } else {
                            infor.forEach(function (item) {
                                item.data = item.browseCount;
                                item.name = String(item.statisticsHour);
                                delete item.browseCount
                                delete item.statisticsHour
                                delete item.communicateCount
                                delete item.positionCount
                            })
                            console.log(infor)
                            that.setData({
                                infor
                            })
                            pieChart = new wxCharts({
                                animation: true,
                                canvasId: 'pieCanvas',
                                type: 'pie',
                                series: that.data.infor,
                                width: windowWidth,
                                height: 300,
                                dataLabel: true,
                            });
                        }
                    }
                })
            } else {
                //这种情况是周日
                //获取周一
                var Data3 = Dateday - sun * 6;  //先获取本周一的时间戳
                console.log(Data3)
                var monday = Data3 - sun * 7;   //再获取上周一的时间戳
                console.log(monday)
                var startDate = util.formatTime(monday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');   //换算成标准日期
                console.log(startDate)
                //获取周日
                var sunday = Dateday - sun * 7;
                console.log(sunday)
                var endDate = util.formatTime(sunday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(endDate)
                that.setData({
                    startDate,
                    endDate
                })
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        startDate: startDate,
                        endDate: endDate,
                        type: 2
                    },
                    success: function (res) {
                        wx.hideLoading();
                        console.log(res)
                        console.log(JSON.parse(res.data).data)
                        let infor = JSON.parse(res.data).data;
                        if (JSON.parse(res.data).data.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 3500,
                                icon: 'none'
                            })
                            return;
                        } else {
                            infor.forEach(function (item) {
                                item.data = item.browseCount;
                                item.name = String(item.statisticsHour);
                                delete item.browseCount
                                delete item.statisticsHour
                                delete item.communicateCount
                                delete item.positionCount
                            })
                            console.log(infor)
                            that.setData({
                                infor
                            })
                            pieChart = new wxCharts({
                                animation: true,
                                canvasId: 'pieCanvas',
                                type: 'pie',
                                series: that.data.infor,
                                width: windowWidth,
                                height: 300,
                                dataLabel: true,
                            });
                        }
                    }
                })
            }
        } else if (e.detail.value == 1) {
            if (new Date().getDay() >= 1) {
                //这种情况不是周日
                //获取周一
                var Data3 = Dateday - sun * (new Date().getDay() - 1);  //先获取本周一的时间戳
                console.log(Data3)
                var monday = Data3 - sun * 14;   //再获取上周一的时间戳
                console.log(monday)
                var startDate = util.formatTime(monday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(startDate)
                //获取周日
                var sunday = Dateday - sun * (new Date().getDay()) - sun * 7;
                console.log(sunday)
                var endDate = util.formatTime(sunday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(endDate)
                that.setData({
                    startDate,
                    endDate
                })
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        startDate: startDate,
                        endDate: endDate,
                        type: 2
                    },
                    success: function (res) {
                        wx.hideLoading();
                        console.log(res)
                        console.log(JSON.parse(res.data).data)
                        let infor = JSON.parse(res.data).data;
                        if (JSON.parse(res.data).data.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 3500,
                                icon: 'none'
                            })
                            return;
                        } else {
                            infor.forEach(function (item) {
                                item.data = item.browseCount;
                                item.name = String(item.statisticsHour);
                                delete item.browseCount
                                delete item.statisticsHour
                                delete item.communicateCount
                                delete item.positionCount
                            })
                            console.log(infor)
                            that.setData({
                                infor
                            })
                            pieChart = new wxCharts({
                                animation: true,
                                canvasId: 'pieCanvas',
                                type: 'pie',
                                series: that.data.infor,
                                width: windowWidth,
                                height: 300,
                                dataLabel: true,
                            });
                        }
                    }
                })
            } else {
                //这种情况是周日
                //获取周一
                var Data3 = Dateday - sun * 6;  //先获取本周一的时间戳
                console.log(Data3)
                var monday = Data3 - sun * 14;   //再获取上周一的时间戳
                console.log(monday)
                var startDate = util.formatTime(monday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');   //换算成标准日期
                console.log(startDate)
                //获取周日
                var sunday = Dateday - sun * 14;
                console.log(sunday)
                var endDate = util.formatTime(sunday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(endDate)
                that.setData({
                    startDate,
                    endDate
                })
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        startDate: startDate,
                        endDate: endDate,
                        type: 2
                    },
                    success: function (res) {
                        wx.hideLoading();
                        console.log(res)
                        console.log(JSON.parse(res.data).data)
                        let infor = JSON.parse(res.data).data;
                        if (JSON.parse(res.data).data.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 3500,
                                icon: 'none'
                            })
                            return;
                        } else {
                            infor.forEach(function (item) {
                                item.data = item.browseCount;
                                item.name = String(item.statisticsHour);
                                delete item.browseCount
                                delete item.statisticsHour
                                delete item.communicateCount
                                delete item.positionCount
                            })
                            console.log(infor)
                            that.setData({
                                infor
                            })
                            pieChart = new wxCharts({
                                animation: true,
                                canvasId: 'pieCanvas',
                                type: 'pie',
                                series: that.data.infor,
                                width: windowWidth,
                                height: 300,
                                dataLabel: true,
                            });
                        }
                    }
                })
            }
        } else if (e.detail.value == 2) {
            if (new Date().getDay() >= 1) {
                //这种情况不是周日
                //获取周一
                var Data3 = Dateday - sun * (new Date().getDay() - 1);  //先获取本周一的时间戳
                console.log(Data3)
                var monday = Data3 - sun * 21;   //再获取上周一的时间戳
                console.log(monday)
                var startDate = util.formatTime(monday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(startDate)
                //获取周日
                var sunday = Dateday - sun * (new Date().getDay()) - sun * 14;
                console.log(sunday)
                var endDate = util.formatTime(sunday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(endDate)
                that.setData({
                    startDate,
                    endDate
                })
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        startDate: startDate,
                        endDate: endDate,
                        type: 2
                    },
                    success: function (res) {
                        wx.hideLoading();
                        console.log(res)
                        console.log(JSON.parse(res.data).data)
                        let infor = JSON.parse(res.data).data;
                        if (JSON.parse(res.data).data.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 3500,
                                icon: 'none'
                            })
                            return;
                        } else {
                            infor.forEach(function (item) {
                                item.data = item.browseCount;
                                item.name = String(item.statisticsHour);
                                delete item.browseCount
                                delete item.statisticsHour
                                delete item.communicateCount
                                delete item.positionCount
                            })
                            console.log(infor)
                            that.setData({
                                infor
                            })
                            pieChart = new wxCharts({
                                animation: true,
                                canvasId: 'pieCanvas',
                                type: 'pie',
                                series: that.data.infor,
                                width: windowWidth,
                                height: 300,
                                dataLabel: true,
                            });
                        }
                    }
                })
            } else {
                //这种情况是周日
                //获取周一
                var Data3 = Dateday - sun * 6;  //先获取本周一的时间戳
                console.log(Data3)
                var monday = Data3 - sun * 21;   //再获取上周一的时间戳
                console.log(monday)
                var startDate = util.formatTime(monday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');   //换算成标准日期
                console.log(startDate)
                //获取周日
                var sunday = Dateday - sun * 21;
                console.log(sunday)
                var endDate = util.formatTime(sunday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(endDate)
                that.setData({
                    startDate,
                    endDate
                })
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        startDate: startDate,
                        endDate: endDate,
                        type: 2
                    },
                    success: function (res) {
                        wx.hideLoading();
                        console.log(res)
                        console.log(JSON.parse(res.data).data)
                        let infor = JSON.parse(res.data).data;
                        if (JSON.parse(res.data).data.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 3500,
                                icon: 'none'
                            })
                            return;
                        } else {
                            infor.forEach(function (item) {
                                item.data = item.browseCount;
                                item.name = String(item.statisticsHour);
                                delete item.browseCount
                                delete item.statisticsHour
                                delete item.communicateCount
                                delete item.positionCount
                            })
                            console.log(infor)
                            that.setData({
                                infor
                            })
                            pieChart = new wxCharts({
                                animation: true,
                                canvasId: 'pieCanvas',
                                type: 'pie',
                                series: that.data.infor,
                                width: windowWidth,
                                height: 300,
                                dataLabel: true,
                            });
                        }
                    }
                })
            }
        } else {
            if (new Date().getDay() >= 1) {
                //这种情况不是周日
                //获取周一
                var Data3 = Dateday - sun * (new Date().getDay() - 1);  //先获取本周一的时间戳
                console.log(Data3)
                var monday = Data3 - sun * 28;   //再获取上周一的时间戳
                console.log(monday)
                var startDate = util.formatTime(monday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(startDate)
                //获取周日
                var sunday = Dateday - sun * (new Date().getDay()) - sun * 21;
                console.log(sunday)
                var endDate = util.formatTime(sunday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(endDate)
                that.setData({
                    startDate,
                    endDate
                })
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        startDate: startDate,
                        endDate: endDate,
                        type: 2
                    },
                    success: function (res) {
                        wx.hideLoading();
                        console.log(res)
                        console.log(JSON.parse(res.data).data)
                        let infor = JSON.parse(res.data).data;
                        if (JSON.parse(res.data).data.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 3500,
                                icon: 'none'
                            })
                            return;
                        } else {
                            infor.forEach(function (item) {
                                item.data = item.browseCount;
                                item.name = String(item.statisticsHour);
                                delete item.browseCount
                                delete item.statisticsHour
                                delete item.communicateCount
                                delete item.positionCount
                            })
                            console.log(infor)
                            that.setData({
                                infor
                            })
                            pieChart = new wxCharts({
                                animation: true,
                                canvasId: 'pieCanvas',
                                type: 'pie',
                                series: that.data.infor,
                                width: windowWidth,
                                height: 300,
                                dataLabel: true,
                            });
                        }
                    }
                })
            } else {
                //这种情况是周日
                //获取周一
                var Data3 = Dateday - sun * 6;  //先获取本周一的时间戳
                console.log(Data3)
                var monday = Data3 - sun * 28;   //再获取上周一的时间戳
                console.log(monday)
                var startDate = util.formatTime(monday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');   //换算成标准日期
                console.log(startDate)
                //获取周日
                var sunday = Dateday - sun * 28;
                console.log(sunday)
                var endDate = util.formatTime(sunday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
                console.log(endDate)
                that.setData({
                    startDate,
                    endDate
                })
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync('unionid'),
                        startDate: startDate,
                        endDate: endDate,
                        type: 2
                    },
                    success: function (res) {
                        wx.hideLoading();
                        console.log(res)
                        console.log(JSON.parse(res.data).data)
                        let infor = JSON.parse(res.data).data;
                        if (JSON.parse(res.data).data.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 3500,
                                icon: 'none'
                            })
                            return;
                        } else {
                            infor.forEach(function (item) {
                                item.data = item.browseCount;
                                item.name = String(item.statisticsHour);
                                delete item.browseCount
                                delete item.statisticsHour
                                delete item.communicateCount
                                delete item.positionCount
                            })
                            console.log(infor)
                            that.setData({
                                infor
                            })
                            pieChart = new wxCharts({
                                animation: true,
                                canvasId: 'pieCanvas',
                                type: 'pie',
                                series: that.data.infor,
                                width: windowWidth,
                                height: 300,
                                dataLabel: true,
                            });
                        }
                    }
                })
            }
        }
    },
    //选择月
    bindDateChangeyue: function (e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            // console.error('getSystemInfoSync failed!');
        }
        console.log(e)
        let that = this;
        that.setData({
            yuefen: e.detail.value
        })
        wx.showLoading({
            title: '加载中',
        })
        that.setData({
            active: true,
            active1: false,
            active: false,
            active4: true,
            active5: false,
            active6: false
        })
        wx.request({
            url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                startDate: e.detail.value,
                type: 3
            },
            success: function (res) {
                wx.hideLoading();
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let infor = JSON.parse(res.data).data;
                if (JSON.parse(res.data).data.length == 0) {
                    wx.showToast({
                        title: '没有数据',
                        duration: 3500,
                        icon: 'none'
                    })
                    return;
                } else {
                    infor.forEach(function (item) {
                        item.data = item.browseCount;
                        item.name = String(item.statisticsHour);
                        delete item.browseCount
                        delete item.statisticsHour
                        delete item.communicateCount
                        delete item.positionCount
                    })
                    console.log(infor)
                    that.setData({
                        infor
                    })
                    pieChart = new wxCharts({
                        animation: true,
                        canvasId: 'pieCanvas',
                        type: 'pie',
                        series: that.data.infor,
                        width: windowWidth,
                        height: 300,
                        dataLabel: true,
                    });
                }
            }
        })
    },
    // 被查看数量
    chakan: function() {
        let that = this;
        console.log(that.data.active1)
        console.log(that.data.active)
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            // console.error('getSystemInfoSync failed!');
        }
        if(that.data.active1 == true){
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                active: false,
                active1: true,
                active2: false,
                active4: true,
                active5: false,
                active6: false,
            })
            wx.request({
                url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    startDate: that.data.shijian,
                    type: 1
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let infor = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data.length == 0) {
                        wx.showToast({
                            title: '没有数据',
                            duration: 3500,
                            icon: 'none'
                        })
                        return;
                    } else {
                        infor.forEach(function (item) {
                            item.data = item.browseCount;
                            item.name = String(item.statisticsHour);
                            delete item.browseCount
                            delete item.statisticsHour
                            delete item.communicateCount
                            delete item.positionCount
                        })
                        console.log(infor)
                        that.setData({
                            infor
                        })
                        pieChart = new wxCharts({
                            animation: true,
                            canvasId: 'pieCanvas',
                            type: 'pie',
                            series: that.data.infor,
                            width: windowWidth,
                            height: 300,
                            dataLabel: true,
                        });
                    }
                }
            })
        }
        else if(that.data.active == true){
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                active: true,
                active1: false,
                active2: false,
                active4: true,
                active5: false,
                active6: false,
            })
            wx.request({
                url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    startDate: that.data.yuefen,
                    type: 3
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let infor = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data.length == 0) {
                        wx.showToast({
                            title: '没有数据',
                            duration: 3500,
                            icon: 'none'
                        })
                        return;
                    } else {
                        infor.forEach(function (item) {
                            item.data = item.browseCount;
                            item.name = String(item.statisticsHour);
                            delete item.browseCount
                            delete item.statisticsHour
                            delete item.communicateCount
                            delete item.positionCount
                        })
                        console.log(infor)
                        that.setData({
                            infor
                        })
                        pieChart = new wxCharts({
                            animation: true,
                            canvasId: 'pieCanvas',
                            type: 'pie',
                            series: that.data.infor,
                            width: windowWidth,
                            height: 300,
                            dataLabel: true,
                        });
                    }
                }
            })
        }
        else if(that.data.active2 == true){
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                active: false,
                active1: false,
                active2: true,
                active4: true,
                active5: false,
                active6: false,
            })
            wx.request({
                url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    startDate: that.data.startDate,
                    endDate: that.data.endDate,
                    type: 2
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let infor = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data.length == 0) {
                        wx.showToast({
                            title: '没有数据',
                            duration: 3500,
                            icon: 'none'
                        })
                        return;
                    } else {
                        infor.forEach(function (item) {
                            item.data = item.browseCount;
                            item.name = String(item.statisticsHour);
                            delete item.browseCount
                            delete item.statisticsHour
                            delete item.communicateCount
                            delete item.positionCount
                        })
                        console.log(infor)
                        that.setData({
                            infor
                        })
                        pieChart = new wxCharts({
                            animation: true,
                            canvasId: 'pieCanvas',
                            type: 'pie',
                            series: that.data.infor,
                            width: windowWidth,
                            height: 300,
                            dataLabel: true,
                        });
                    }
                }
            })
        }
        ///////
    },
    // 沟通数量
    goutong: function () {
        let that = this;
        console.log(that.data.active1)
        console.log(that.data.active)
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            // console.error('getSystemInfoSync failed!');
        }
        if (that.data.active1 == true) {
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                active: false,
                active1: true,
                active2:false,
                active4: false,
                active5: true,
                active6: false,
            })
            wx.request({
                url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    startDate: that.data.shijian,
                    type: 1
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let infor = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data.length == 0) {
                        wx.showToast({
                            title: '没有数据',
                            duration: 3500,
                            icon: 'none'
                        })
                        return;
                    } else {
                        infor.forEach(function (item) {
                            item.data = item.communicateCount;
                            item.name = String(item.statisticsHour);
                            delete item.communicateCount
                            delete item.statisticsHour
                            delete item.browseCount
                            delete item.positionCount
                        })
                        console.log(infor)
                        that.setData({
                            infor
                        })
                        pieChart = new wxCharts({
                            animation: true,
                            canvasId: 'pieCanvas',
                            type: 'pie',
                            series: that.data.infor,
                            width: windowWidth,
                            height: 300,
                            dataLabel: true,
                        });
                    }
                }
            })
        }
        else if (that.data.active == true) {
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                active: true,
                active1: false,
                active2:false,
                active4: false,
                active5: true,
                active6: false,
            })
            wx.request({
                url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    startDate: that.data.yuefen,
                    type: 3
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let infor = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data.length == 0) {
                        wx.showToast({
                            title: '没有数据',
                            duration: 3500,
                            icon: 'none'
                        })
                        return;
                    } else {
                        infor.forEach(function (item) {
                            item.data = item.communicateCount;
                            item.name = String(item.statisticsHour);
                            delete item.communicateCount
                            delete item.statisticsHour
                            delete item.browseCount
                            delete item.positionCount
                        })
                        console.log(infor)
                        that.setData({
                            infor
                        })
                        pieChart = new wxCharts({
                            animation: true,
                            canvasId: 'pieCanvas',
                            type: 'pie',
                            series: that.data.infor,
                            width: windowWidth,
                            height: 300,
                            dataLabel: true,
                        });
                    }
                }
            })
        }
        else if (that.data.active2 == true) {
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                active: false,
                active1: false,
                active2: true,
                active4: false,
                active5: true,
                active6: false,
            })
            wx.request({
                url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    startDate: that.data.startDate,
                    endDate: that.data.endDate,
                    type: 2
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let infor = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data.length == 0) {
                        wx.showToast({
                            title: '没有数据',
                            duration: 3500,
                            icon: 'none'
                        })
                        return;
                    } else {
                        infor.forEach(function (item) {
                            item.data = item.browseCount;
                            item.name = String(item.statisticsHour);
                            delete item.browseCount
                            delete item.statisticsHour
                            delete item.communicateCount
                            delete item.positionCount
                        })
                        console.log(infor)
                        that.setData({
                            infor
                        })
                        pieChart = new wxCharts({
                            animation: true,
                            canvasId: 'pieCanvas',
                            type: 'pie',
                            series: that.data.infor,
                            width: windowWidth,
                            height: 300,
                            dataLabel: true,
                        });
                    }
                }
            })
        }
        ///////
    },
    //发布职位
    fabuzhiwei: function () {
        let that = this;
        console.log(that.data.active1)
        console.log(that.data.active)
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            // console.error('getSystemInfoSync failed!');
        }
        if (that.data.active1 == true) {
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                active: false,
                active1: true,
                active2: false,
                active4: false,
                active5: false,
                active6: true,
            })
            wx.request({
                url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    startDate: that.data.shijian,
                    type: 1
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let infor = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data.length == 0) {
                        wx.showToast({
                            title: '没有数据',
                            duration: 3500,
                            icon: 'none'
                        })
                        return;
                    } else {
                        infor.forEach(function (item) {
                            item.data = item.positionCount;
                            item.name = String(item.statisticsHour);
                            delete item.communicateCount
                            delete item.statisticsHour
                            delete item.browseCount
                            delete item.positionCount
                        })
                        console.log(infor)
                        that.setData({
                            infor
                        })
                        pieChart = new wxCharts({
                            animation: true,
                            canvasId: 'pieCanvas',
                            type: 'pie',
                            series: that.data.infor,
                            width: windowWidth,
                            height: 300,
                            dataLabel: true,
                        });
                    }
                }
            })
        }
        else if(that.data.active == true) {
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                active: true,
                active1: false,
                active2: false,
                active4: false,
                active5: false,
                active6: true,
            })
            wx.request({
                url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    startDate: that.data.yuefen,
                    type:3
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let infor = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data.length == 0) {
                        wx.showToast({
                            title: '没有数据',
                            duration: 3500,
                            icon: 'none'
                        })
                        return;
                    } else {
                        infor.forEach(function (item) {
                            item.data = item.positionCount;
                            item.name = String(item.statisticsHour);
                            delete item.communicateCount
                            delete item.statisticsHour
                            delete item.browseCount
                            delete item.positionCount
                        })
                        console.log(infor)
                        that.setData({
                            infor
                        })
                        pieChart = new wxCharts({
                            animation: true,
                            canvasId: 'pieCanvas',
                            type: 'pie',
                            series: that.data.infor,
                            width: windowWidth,
                            height: 300,
                            dataLabel: true,
                        });
                    }
                }
            })
        }
        else if (that.data.active2 == true) {
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                active: false,
                active1: false,
                active2: true,
                active4: false,
                active5: false,
                active6: true,
            })
            wx.request({
                url: app.data.apiPath + '/statistics/quertyDayWeekMonthHour',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    startDate: that.data.startDate,
                    endDate: that.data.endDate,
                    type: 2
                },
                success: function (res) {
                    wx.hideLoading();
                    console.log(res)
                    console.log(JSON.parse(res.data).data)
                    let infor = JSON.parse(res.data).data;
                    if (JSON.parse(res.data).data.length == 0) {
                        wx.showToast({
                            title: '没有数据',
                            duration: 3500,
                            icon: 'none'
                        })
                        return;
                    } else {
                        infor.forEach(function (item) {
                            item.data = item.browseCount;
                            item.name = String(item.statisticsHour);
                            delete item.browseCount
                            delete item.statisticsHour
                            delete item.communicateCount
                            delete item.positionCount
                        })
                        console.log(infor)
                        that.setData({
                            infor
                        })
                        pieChart = new wxCharts({
                            animation: true,
                            canvasId: 'pieCanvas',
                            type: 'pie',
                            series: that.data.infor,
                            width: windowWidth,
                            height: 300,
                            dataLabel: true,
                        });
                    }
                }
            })
        }
        ///////
    },


    getDateStr: function (today, addDayCount) {
        var date;
        if (today) {
            date = new Date(today);
        } else {
            date = new Date();
        }
        date.setDate(date.getDate() + addDayCount);//获取AddDayCount天后的日期 
        var y = date.getFullYear();
        var m = date.getMonth() + 1;//获取当前月份的日期 
        var d = date.getDate();
        if (m < 10) {
            m = '0' + m;
        };
        if (d < 10) {
            d = '0' + d;
        };
        console.log(y + "-" + m + "-" + d)
        return y + "-" + m + "-" + d;
    },
});