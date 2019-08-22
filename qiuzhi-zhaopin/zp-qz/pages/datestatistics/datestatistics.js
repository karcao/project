var wxCharts = require('../../utils/wxcharts.js');
var util = require("../../utils/util.js")
var app = getApp();
var lineChart = null;
var startPos = null;
const sun = 24 * 60 * 60 * 1000;
Page({
    data: {
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
        chartTitle: '统计',
        navon: 0,
        // statimes: ['日', '周', '月'],
    },
    //月
    bindDateChange: function (e) {
        var data = [];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        wx.showLoading({
            title: '加载中',
        })
        let that = this;
        that.setData({
            active1: false,
            active: true,
            active2: false
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
                let alllist = JSON.parse(res.data).data;
                if (alllist.length == 0) {
                    wx.showToast({
                        title: '没有数据',
                        duration: 2000,
                        icon: 'none'
                    })
                } else {
                    for (let i = 0; i < alllist.length; i++) {
                        data.push(alllist[i].browseCount);
                        data1.push(alllist[i].communicateCount);
                        data2.push(alllist[i].positionCount);
                    }
                    console.log(data)
                    console.log(data1)
                    console.log(data2)
                    //////
                    let simulationData = that.createSimulationData();
                    lineChart = new wxCharts({
                        canvasId: 'lineCanvas',
                        type: 'line',
                        categories: simulationData.categories,
                        animation: false,
                        series: [{
                            name: '浏览',
                            data: data,
                            format: function (val, name) {
                                return val.toFixed(0);
                            }
                        }, {
                            name: '沟通',
                            data: data1,
                            format: function (val, name) {
                                return val.toFixed(0);
                            }
                        }, {
                            name: '发布',
                            data: data2,
                            format: function (val, name) {
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
            }
        })
    },
    //选择周
    bindDateChangezhou: function (e) {
        let that = this;
        let width = that.getWidth(750);
        that.setData({
            active1: false,
            active: false,
            active2: true
        })
        var name = [];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        console.log(e.detail.value)
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
                        let alllist = JSON.parse(res.data).data;
                        if (alllist.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 2000,
                                icon: 'none'
                            })
                        } else {
                            for (let i = 0; i < alllist.length; i++) {
                                data.push(alllist[i].browseCount);
                                data1.push(alllist[i].communicateCount);
                                data2.push(alllist[i].positionCount);
                            }
                            console.log(data)
                            console.log(data1)
                            console.log(data2)
                            //////
                            let simulationData = that.createSimulationData();
                            lineChart = new wxCharts({
                                canvasId: 'lineCanvas',
                                type: 'line',
                                categories: simulationData.categories,
                                animation: false,
                                series: [{
                                    name: '浏览',
                                    data: data,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '沟通',
                                    data: data1,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '发布',
                                    data: data2,
                                    format: function (val, name) {
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
                        let alllist = JSON.parse(res.data).data;
                        if (alllist.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 2000,
                                icon: 'none'
                            })
                        } else {
                            for (let i = 0; i < alllist.length; i++) {
                                data.push(alllist[i].browseCount);
                                data1.push(alllist[i].communicateCount);
                                data2.push(alllist[i].positionCount);
                            }
                            console.log(data)
                            console.log(data1)
                            console.log(data2)
                            //////
                            let simulationData = that.createSimulationData();
                            lineChart = new wxCharts({
                                canvasId: 'lineCanvas',
                                type: 'line',
                                categories: simulationData.categories,
                                animation: false,
                                series: [{
                                    name: '浏览',
                                    data: data,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '沟通',
                                    data: data1,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '发布',
                                    data: data2,
                                    format: function (val, name) {
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
                        let alllist = JSON.parse(res.data).data;
                        if (alllist.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 2000,
                                icon: 'none'
                            })
                        } else {
                            for (let i = 0; i < alllist.length; i++) {
                                data.push(alllist[i].browseCount);
                                data1.push(alllist[i].communicateCount);
                                data2.push(alllist[i].positionCount);
                            }
                            console.log(data)
                            console.log(data1)
                            console.log(data2)
                            //////
                            let simulationData = that.createSimulationData();
                            lineChart = new wxCharts({
                                canvasId: 'lineCanvas',
                                type: 'line',
                                categories: simulationData.categories,
                                animation: false,
                                series: [{
                                    name: '浏览',
                                    data: data,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '沟通',
                                    data: data1,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '发布',
                                    data: data2,
                                    format: function (val, name) {
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
                        let alllist = JSON.parse(res.data).data;
                        if (alllist.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 2000,
                                icon: 'none'
                            })
                        } else {
                            for (let i = 0; i < alllist.length; i++) {
                                data.push(alllist[i].browseCount);
                                data1.push(alllist[i].communicateCount);
                                data2.push(alllist[i].positionCount);
                            }
                            console.log(data)
                            console.log(data1)
                            console.log(data2)
                            //////
                            let simulationData = that.createSimulationData();
                            lineChart = new wxCharts({
                                canvasId: 'lineCanvas',
                                type: 'line',
                                categories: simulationData.categories,
                                animation: false,
                                series: [{
                                    name: '浏览',
                                    data: data,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '沟通',
                                    data: data1,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '发布',
                                    data: data2,
                                    format: function (val, name) {
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
                        let alllist = JSON.parse(res.data).data;
                        if (alllist.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 2000,
                                icon: 'none'
                            })
                        } else {
                            for (let i = 0; i < alllist.length; i++) {
                                data.push(alllist[i].browseCount);
                                data1.push(alllist[i].communicateCount);
                                data2.push(alllist[i].positionCount);
                            }
                            console.log(data)
                            console.log(data1)
                            console.log(data2)
                            //////
                            let simulationData = that.createSimulationData();
                            lineChart = new wxCharts({
                                canvasId: 'lineCanvas',
                                type: 'line',
                                categories: simulationData.categories,
                                animation: false,
                                series: [{
                                    name: '浏览',
                                    data: data,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '沟通',
                                    data: data1,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '发布',
                                    data: data2,
                                    format: function (val, name) {
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
                        let alllist = JSON.parse(res.data).data;
                        if (alllist.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 2000,
                                icon: 'none'
                            })
                        } else {
                            for (let i = 0; i < alllist.length; i++) {
                                data.push(alllist[i].browseCount);
                                data1.push(alllist[i].communicateCount);
                                data2.push(alllist[i].positionCount);
                            }
                            console.log(data)
                            console.log(data1)
                            console.log(data2)
                            //////
                            let simulationData = that.createSimulationData();
                            lineChart = new wxCharts({
                                canvasId: 'lineCanvas',
                                type: 'line',
                                categories: simulationData.categories,
                                animation: false,
                                series: [{
                                    name: '浏览',
                                    data: data,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '沟通',
                                    data: data1,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '发布',
                                    data: data2,
                                    format: function (val, name) {
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
                        let alllist = JSON.parse(res.data).data;
                        if (alllist.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 2000,
                                icon: 'none'
                            })
                        } else {
                            for (let i = 0; i < alllist.length; i++) {
                                data.push(alllist[i].browseCount);
                                data1.push(alllist[i].communicateCount);
                                data2.push(alllist[i].positionCount);
                            }
                            console.log(data)
                            console.log(data1)
                            console.log(data2)
                            //////
                            let simulationData = that.createSimulationData();
                            lineChart = new wxCharts({
                                canvasId: 'lineCanvas',
                                type: 'line',
                                categories: simulationData.categories,
                                animation: false,
                                series: [{
                                    name: '浏览',
                                    data: data,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '沟通',
                                    data: data1,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '发布',
                                    data: data2,
                                    format: function (val, name) {
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
                        let alllist = JSON.parse(res.data).data;
                        if (alllist.length == 0) {
                            wx.showToast({
                                title: '没有数据',
                                duration: 2000,
                                icon: 'none'
                            })
                        } else {
                            for (let i = 0; i < alllist.length; i++) {
                                data.push(alllist[i].browseCount);
                                data1.push(alllist[i].communicateCount);
                                data2.push(alllist[i].positionCount);
                            }
                            console.log(data)
                            console.log(data1)
                            console.log(data2)
                            //////
                            let simulationData = that.createSimulationData();
                            lineChart = new wxCharts({
                                canvasId: 'lineCanvas',
                                type: 'line',
                                categories: simulationData.categories,
                                animation: false,
                                series: [{
                                    name: '浏览',
                                    data: data,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '沟通',
                                    data: data1,
                                    format: function (val, name) {
                                        return val.toFixed(0);
                                    }
                                }, {
                                    name: '发布',
                                    data: data2,
                                    format: function (val, name) {
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
                    }
                })
            }
        }
    },
    //日
    bindDateChange1: function (e) {
        var data = [];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        console.log("11111")
        wx.showLoading({
            title: '加载中',
        })
        let that = this;
        that.setData({
            active1: true,
            active: false,
            active2: false
        })
        console.log(e.detail.value)
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
            success: function (res) {
                wx.hideLoading();
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let alllist = JSON.parse(res.data).data;
                if (alllist.length == 0) {
                    wx.showToast({
                        title: '没有数据',
                        duration: 2000,
                        icon: 'none'
                    })
                } else {
                    for (let i = 0; i < alllist.length; i++) {
                        data.push(alllist[i].browseCount);
                        data1.push(alllist[i].communicateCount);
                        data2.push(alllist[i].positionCount);
                        data3.push(alllist[i].statisticsHour); 
                    }
                    console.log(data)
                    console.log(data1)
                    console.log(data2)
                    console.log(data3)
                    //////
                    let simulationData = that.createSimulationData();
                    lineChart = new wxCharts({
                        canvasId: 'lineCanvas',
                        type: 'line',
                        categories: simulationData.categories,
                        animation: false,
                        series: [{
                            name: '浏览',
                            data: data,
                            format: function (val, name) {
                                return val.toFixed(0);
                            }
                        }, {
                            name: '沟通',
                            data: data1,
                            format: function (val, name) {
                                return val.toFixed(0);
                            }
                        }, {
                            name: '发布',
                            data: data2,
                            format: function (val, name) {
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
            }
        })
    },
    changeSales(e) {
        console.log(e)
        this.setData({
            navon: e.currentTarget.dataset.navon,
            // chartData: {
            //     dataY: [15, 20, 45, 37, 15, 100, 45, 37, 15, 20, 100, 100],
            //     categoriesX: ['张明', '王磊', '李俊峰', '张铁头', '米小圈', '王大江', '李长河', '红石榴', '青苹果', '大西瓜', '小番茄', '西红柿'],
            // }
        })
        // columnSales.updateData({
        //     categories: this.data.chartData.categoriesX,
        //     series: [{
        //         name: '今天',
        //         data: this.data.chartData.dataY
        //     }, {
        //         name: '昨天',
        //         data: this.data.chartData.dataY
        //     }, {
        //         name: '日均',
        //         data: this.data.chartData.dataY
        //     }]
        // });
    },
    touchHandler: function (e) {
        lineChart.scrollStart(e);
    },
    moveHandler: function (e) {
        lineChart.scroll(e);
    },
    touchEndHandler: function (e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data
            }
        });
    },
    createSimulationData: function () {
        var categories = [];
        for (var i = 0; i < 24; i++) {
            categories.push('' + i);
        }
        return {
            categories: categories,
        }
    },
    onLoad: function (e) {
        let that = this;
        console.log(that.getDateStr(null, -1))
        let yesterday = that.getDateStr(null, -1);
        var windowWidth = 325;
        try {
            var res = wx.getSystemInfoSync();
            console.log(res)
            windowWidth = res.windowWidth;
            that.setData({
                windowWidth
            })
        } catch (e) {
            // console.error('getSystemInfoSync failed!');
        }
        var data = [];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        wx.showLoading({
            title: '加载中',
        })
        that.setData({
            active1: true,
            active: false,
            active2: false
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
                let alllist = JSON.parse(res.data).data;
                if (alllist.length == 0) {
                    wx.showToast({
                        title: '没有数据',
                        duration: 2000,
                        icon: 'none'
                    })
                } else {
                    for (let i = 0; i < alllist.length; i++) {
                        data.push(alllist[i].browseCount);
                        data1.push(alllist[i].communicateCount);
                        data2.push(alllist[i].positionCount);
                        data3.push(alllist[i].statisticsHour);
                    }
                    console.log(data)
                    console.log(data1)
                    console.log(data2)
                    console.log(data3)
                    //////
                    let simulationData = that.createSimulationData();
                    lineChart = new wxCharts({
                        canvasId: 'lineCanvas',
                        type: 'line',
                        categories: simulationData.categories,
                        animation: false,
                        series: [{
                            name: '浏览',
                            data: data,
                            format: function (val, name) {
                                return val.toFixed(0);
                            }
                        }, {
                            name: '沟通',
                            data: data1,
                            format: function (val, name) {
                                return val.toFixed(0);
                            }
                        }, {
                            name: '发布',
                            data: data2,
                            format: function (val, name) {
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
            }
        })
        // var simulationData = this.createSimulationData();
        // lineChart = new wxCharts({
        //     canvasId: 'lineCanvas',
        //     type: 'line',
        //     categories: simulationData.categories,
        //     animation: false,
        //     series: [{
        //         name: '浏览',
        //         data: simulationData.data,
        //         format: function (val, name) {
        //             return val.toFixed(0);
        //         }
        //     }, {
        //         name: '沟通',
        //         data: simulationData.data1,
        //         format: function (val, name) {
        //             return val.toFixed(0);
        //         }
        //     }, {
        //         name: '发布',
        //         data: simulationData.data2,
        //         format: function (val, name) {
        //             return val.toFixed(0);
        //         }
        //     }],
        //     xAxis: {
        //         disableGrid: false
        //     },
        //     yAxis: {
        //         title: '数量',
        //         min: 0
        //     },
        //     width: windowWidth,
        //     height: 200,
        //     dataLabel: true,
        //     dataPointShape: true,
        //     enableScroll: true,
        //     extra: {
        //         lineStyle: 'curve'
        //     }
        // });
    },
    /**获得宽度 */
    getWidth(rpx) {
        let windowWidth = 320;
        try {
            let res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth * rpx / 750;

        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        return windowWidth;
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