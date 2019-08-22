var wxCharts = require('../../utils/wxcharts.js');
var util = require("../../utils/util.js")
var app = getApp();
var columnSales = null;
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
        isMainChartDisplay: true,
        statimes: ['日', '周', '月'],
        navon: 0,
        being: 0,
        chartData: {
            title: '统计',
            dataY: [15, 20, 45, 37, 15, 100, 45, 37, 15, 20, 100, 100],
            categoriesX: ['张明', '王磊', '李俊峰', '张铁头', '米小圈', '王大江', '李长河', '红石榴', '青苹果', '大西瓜', '小番茄', '西红柿'],

        }
    },
    onLoad:function(e){
        let that = this;
        // console.log(util.getTime(7))
        
        
        let width = that.getWidth(750);
        that.setData({
            active1:true,
            active:false,
            active2: false
        })
        var name = [];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        // console.log(that.getDateStr(null, -1))
        let yesterday = that.getDateStr(null, -1);
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                }else{
                    for (let i = 0; i < infor.length;i++){
                        name.push(infor[i].name)
                        data1.push(infor[i].browseCount)
                        data2.push(infor[i].communicateCount)
                        data3.push(infor[i].positionCount)
                    }
                    // console.log(name)
                    columnSales = new wxCharts({
                        canvasId: 'columnCanvas',
                        type: 'column',
                        dataPointShape: false,
                        animation: true,
                        categories: name,
                        series: [{
                            name: '被查看',
                            data: data1
                        }, {
                            name: '沟通',
                            data: data2
                        }, {
                            name: '发布职位',
                            data: data3
                        }],
                        yAxis: {
                            title: '',
                            min: 0
                        },
                        xAxis: {
                            disableGrid: false,
                            type: 'calibration',
                            axisLine: false,
                        },
                        extra: {
                            column: {
                                width: 20
                            }
                        },
                        enableScroll: true,
                        width: width,
                        height: 200,
                        dataLabel: true,
                    });
                }
            }
        })
    },
    onReady: function (e) {
        // let that = this;
        // // this.echartSales('columnCanvas', this.data.chartData.categoriesX, this.data.chartData.dataY)
        // console.log(that.getDateStr(null, 0))
        // console.log(new Date().getDay())
        // console.log(new Date().getTime())
        // var Dateday = new Date().getTime();
        // if (new Date().getDay() >= 1){
        //     //这种情况不是周日
        //     //获取周一
        //     var Data3 = Dateday - sun * (new Date().getDay() - 1);  //先获取本周一的时间戳
        //     console.log(Data3)
        //     var monday = Data3 - sun * 7;   //再获取上周一的时间戳
        //     console.log(monday)
        //     var startDate = util.formatTime(monday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
        //     console.log(startDate)
        //     //获取周日
        //     var sunday = Dateday - sun * (new Date().getDay());
        //     console.log(sunday)
        //     var endDate = util.formatTime(sunday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
        //     console.log(endDate)
        // }else{
        //     //这种情况是周日
        //     //获取周一
        //     var Data3 = Dateday - sun * 6;  //先获取本周一的时间戳
        //     console.log(Data3)
        //     var monday = Data3 - sun * 7;   //再获取上周一的时间戳
        //     console.log(monday)
        //     var startDate = util.formatTime(monday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');   //换算成标准日期
        //     console.log(startDate)
        //     //获取周日
        //     var sunday = Dateday - sun * 7;
        //     console.log(sunday)
        //     var endDate = util.formatTime(sunday, 'Y/M/D h:m:s').substring(0, 10).replace(/\//g, '-');    //换算成标准日期
        //     console.log(endDate)
        // }
    },
    //点击
    //选择日
    bindDateChangeri: function (e) {
        let that = this;
        let width = that.getWidth(750);
        that.setData({
            active1: true,
            active: false,
            active2: false
        })
        var name = [];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                let infor = JSON.parse(res.data).data;
                if (JSON.parse(res.data).data.length == 0) {
                    wx.showToast({
                        title: '没有数据',
                        duration: 3500,
                        icon: 'none'
                    })
                    return;
                } else {
                    for (let i = 0; i < infor.length; i++) {
                        name.push(infor[i].name)
                        data1.push(infor[i].browseCount)
                        data2.push(infor[i].communicateCount)
                        data3.push(infor[i].positionCount)
                    }
                    // console.log(name)
                    columnSales = new wxCharts({
                        canvasId: 'columnCanvas',
                        type: 'column',
                        dataPointShape: false,
                        animation: true,
                        categories: name,
                        series: [{
                            name: '被查看',
                            data: data1
                        }, {
                            name: '沟通',
                            data: data2
                        }, {
                            name: '发布职位',
                            data: data3
                        }],
                        yAxis: {
                            title: '',
                            min: 0
                        },
                        xAxis: {
                            disableGrid: false,
                            type: 'calibration',
                            axisLine: false,
                        },
                        extra: {
                            column: {
                                width: 20
                            }
                        },
                        enableScroll: true,
                        width: width,
                        height: 200,
                        dataLabel: true,
                    });
                }
            }
        })
    },
    //选择周
    bindDateChangezhou:function(e){
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
        if (e.detail.value == 0){
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
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                            for (let i = 0; i < infor.length; i++) {
                                name.push(infor[i].name)
                                data1.push(infor[i].browseCount)
                                data2.push(infor[i].communicateCount)
                                data3.push(infor[i].positionCount)
                            }
                            // console.log(name)
                            columnSales = new wxCharts({
                                canvasId: 'columnCanvas',
                                type: 'column',
                                dataPointShape: false,
                                animation: true,
                                categories: name,
                                series: [{
                                    name: '被查看',
                                    data: data1
                                }, {
                                    name: '沟通',
                                    data: data2
                                }, {
                                    name: '发布职位',
                                    data: data3
                                }],
                                yAxis: {
                                    title: '',
                                    min: 0
                                },
                                xAxis: {
                                    disableGrid: false,
                                    type: 'calibration',
                                    axisLine: false,
                                },
                                extra: {
                                    column: {
                                        width: 20
                                    }
                                },
                                enableScroll: true,
                                width: width,
                                height: 200,
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
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                            for (let i = 0; i < infor.length; i++) {
                                name.push(infor[i].name)
                                data1.push(infor[i].browseCount)
                                data2.push(infor[i].communicateCount)
                                data3.push(infor[i].positionCount)
                            }
                            // console.log(name)
                            columnSales = new wxCharts({
                                canvasId: 'columnCanvas',
                                type: 'column',
                                dataPointShape: false,
                                animation: true,
                                categories: name,
                                series: [{
                                    name: '被查看',
                                    data: data1
                                }, {
                                    name: '沟通',
                                    data: data2
                                }, {
                                    name: '发布职位',
                                    data: data3
                                }],
                                yAxis: {
                                    title: '',
                                    min: 0
                                },
                                xAxis: {
                                    disableGrid: false,
                                    type: 'calibration',
                                    axisLine: false,
                                },
                                extra: {
                                    column: {
                                        width: 20
                                    }
                                },
                                enableScroll: true,
                                width: width,
                                height: 200,
                                dataLabel: true,
                            });
                        }
                    }
                })
            }
        }else if(e.detail.value == 1){
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
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                            for (let i = 0; i < infor.length; i++) {
                                name.push(infor[i].name)
                                data1.push(infor[i].browseCount)
                                data2.push(infor[i].communicateCount)
                                data3.push(infor[i].positionCount)
                            }
                            // console.log(name)
                            columnSales = new wxCharts({
                                canvasId: 'columnCanvas',
                                type: 'column',
                                dataPointShape: false,
                                animation: true,
                                categories: name,
                                series: [{
                                    name: '被查看',
                                    data: data1
                                }, {
                                    name: '沟通',
                                    data: data2
                                }, {
                                    name: '发布职位',
                                    data: data3
                                }],
                                yAxis: {
                                    title: '',
                                    min: 0
                                },
                                xAxis: {
                                    disableGrid: false,
                                    type: 'calibration',
                                    axisLine: false,
                                },
                                extra: {
                                    column: {
                                        width: 20
                                    }
                                },
                                enableScroll: true,
                                width: width,
                                height: 200,
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
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                            for (let i = 0; i < infor.length; i++) {
                                name.push(infor[i].name)
                                data1.push(infor[i].browseCount)
                                data2.push(infor[i].communicateCount)
                                data3.push(infor[i].positionCount)
                            }
                            // console.log(name)
                            columnSales = new wxCharts({
                                canvasId: 'columnCanvas',
                                type: 'column',
                                dataPointShape: false,
                                animation: true,
                                categories: name,
                                series: [{
                                    name: '被查看',
                                    data: data1
                                }, {
                                    name: '沟通',
                                    data: data2
                                }, {
                                    name: '发布职位',
                                    data: data3
                                }],
                                yAxis: {
                                    title: '',
                                    min: 0
                                },
                                xAxis: {
                                    disableGrid: false,
                                    type: 'calibration',
                                    axisLine: false,
                                },
                                extra: {
                                    column: {
                                        width: 20
                                    }
                                },
                                enableScroll: true,
                                width: width,
                                height: 200,
                                dataLabel: true,
                            });
                        }
                    }
                })
            }
        } else if (e.detail.value == 2){
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
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                            for (let i = 0; i < infor.length; i++) {
                                name.push(infor[i].name)
                                data1.push(infor[i].browseCount)
                                data2.push(infor[i].communicateCount)
                                data3.push(infor[i].positionCount)
                            }
                            // console.log(name)
                            columnSales = new wxCharts({
                                canvasId: 'columnCanvas',
                                type: 'column',
                                dataPointShape: false,
                                animation: true,
                                categories: name,
                                series: [{
                                    name: '被查看',
                                    data: data1
                                }, {
                                    name: '沟通',
                                    data: data2
                                }, {
                                    name: '发布职位',
                                    data: data3
                                }],
                                yAxis: {
                                    title: '',
                                    min: 0
                                },
                                xAxis: {
                                    disableGrid: false,
                                    type: 'calibration',
                                    axisLine: false,
                                },
                                extra: {
                                    column: {
                                        width: 20
                                    }
                                },
                                enableScroll: true,
                                width: width,
                                height: 200,
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
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                            for (let i = 0; i < infor.length; i++) {
                                name.push(infor[i].name)
                                data1.push(infor[i].browseCount)
                                data2.push(infor[i].communicateCount)
                                data3.push(infor[i].positionCount)
                            }
                            // console.log(name)
                            columnSales = new wxCharts({
                                canvasId: 'columnCanvas',
                                type: 'column',
                                dataPointShape: false,
                                animation: true,
                                categories: name,
                                series: [{
                                    name: '被查看',
                                    data: data1
                                }, {
                                    name: '沟通',
                                    data: data2
                                }, {
                                    name: '发布职位',
                                    data: data3
                                }],
                                yAxis: {
                                    title: '',
                                    min: 0
                                },
                                xAxis: {
                                    disableGrid: false,
                                    type: 'calibration',
                                    axisLine: false,
                                },
                                extra: {
                                    column: {
                                        width: 20
                                    }
                                },
                                enableScroll: true,
                                width: width,
                                height: 200,
                                dataLabel: true,
                            });
                        }
                    }
                })
            }
        }else{
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
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                            for (let i = 0; i < infor.length; i++) {
                                name.push(infor[i].name)
                                data1.push(infor[i].browseCount)
                                data2.push(infor[i].communicateCount)
                                data3.push(infor[i].positionCount)
                            }
                            // console.log(name)
                            columnSales = new wxCharts({
                                canvasId: 'columnCanvas',
                                type: 'column',
                                dataPointShape: false,
                                animation: true,
                                categories: name,
                                series: [{
                                    name: '被查看',
                                    data: data1
                                }, {
                                    name: '沟通',
                                    data: data2
                                }, {
                                    name: '发布职位',
                                    data: data3
                                }],
                                yAxis: {
                                    title: '',
                                    min: 0
                                },
                                xAxis: {
                                    disableGrid: false,
                                    type: 'calibration',
                                    axisLine: false,
                                },
                                extra: {
                                    column: {
                                        width: 20
                                    }
                                },
                                enableScroll: true,
                                width: width,
                                height: 200,
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
                //发起请求
                wx.request({
                    url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                            for (let i = 0; i < infor.length; i++) {
                                name.push(infor[i].name)
                                data1.push(infor[i].browseCount)
                                data2.push(infor[i].communicateCount)
                                data3.push(infor[i].positionCount)
                            }
                            // console.log(name)
                            columnSales = new wxCharts({
                                canvasId: 'columnCanvas',
                                type: 'column',
                                dataPointShape: false,
                                animation: true,
                                categories: name,
                                series: [{
                                    name: '被查看',
                                    data: data1
                                }, {
                                    name: '沟通',
                                    data: data2
                                }, {
                                    name: '发布职位',
                                    data: data3
                                }],
                                yAxis: {
                                    title: '',
                                    min: 0
                                },
                                xAxis: {
                                    disableGrid: false,
                                    type: 'calibration',
                                    axisLine: false,
                                },
                                extra: {
                                    column: {
                                        width: 20
                                    }
                                },
                                enableScroll: true,
                                width: width,
                                height: 200,
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
        let that = this;
        let width = that.getWidth(750);
        that.setData({
            active1: false,
            active: true,
            active2: false
        })
        var name = [];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: app.data.apiPath + '/statistics/quertyDayWeekMonth',
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
                    for (let i = 0; i < infor.length; i++) {
                        name.push(infor[i].name)
                        data1.push(infor[i].browseCount)
                        data2.push(infor[i].communicateCount)
                        data3.push(infor[i].positionCount)
                    }
                    // console.log(name)
                    columnSales = new wxCharts({
                        canvasId: 'columnCanvas',
                        type: 'column',
                        dataPointShape: false,
                        animation: true,
                        categories: name,
                        series: [{
                            name: '被查看',
                            data: data1
                        }, {
                            name: '沟通',
                            data: data2
                        }, {
                            name: '发布职位',
                            data: data3
                        }],
                        yAxis: {
                            title: '',
                            min: 0
                        },
                        xAxis: {
                            disableGrid: false,
                            type: 'calibration',
                            axisLine: false,
                        },
                        extra: {
                            column: {
                                width: 20
                            }
                        },
                        enableScroll: true,
                        width: width,
                        height: 200,
                        dataLabel: true,
                    });
                }
            }
        })
    },
    onShow() { },
    changeSales(e) {
        console.log(e)
        this.setData({
            navon: e.currentTarget.dataset.navon,
            chartData: {
                dataY: [15, 20, 45, 37, 15, 100, 45, 37, 15, 20, 100, 100],
                categoriesX: ['张明', '王磊', '李俊峰', '张铁头', '米小圈', '王大江', '李长河', '红石榴', '青苹果', '大西瓜', '小番茄', '西红柿'],
            }
        })
        columnSales.updateData({
            categories: this.data.chartData.categoriesX,
            series: [{
                name: '今天',
                data: this.data.chartData.dataY
            }, {
                name: '昨天',
                data: this.data.chartData.dataY
            }, {
                name: '日均',
                data: this.data.chartData.dataY
            }]
        });

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
    echartSales(id, obj, data) {
        let width = this.getWidth(750);
        columnSales = new wxCharts({
            canvasId: id,
            type: 'column',
            dataPointShape: false,
            animation: true,
            categories: obj,
            series: [{
                name: '被查看',
                data: data
            }, {
                name:'沟通',
                data: data
            }, {
                name: '发布职位',
                data: data
            }],
            yAxis: {
                title: '',
                min: 0
            },
            xAxis: {
                disableGrid: false,
                type: 'calibration',
                axisLine: false,
            },
            extra: {
                column: {
                    width: 20
                }
            },
            enableScroll: true,
            width: width,
            height: 200,
            dataLabel: true,
        });
    },
    touchstartSales(e) {
        let that = this;
        // console.log(e)
        columnSales.scrollStart(e);
    },
    touchmoveSales(e) {
        columnSales.scroll(e);
    },
    touchendSales(e) {
        columnSales.scrollEnd(e);
    },
    //时间
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
        // console.log(y + "-" + m + "-" + d)
        return y + "-" + m + "-" + d;
    },
});