// pages/socks/socks.js
const app = getApp()
var websocket = require('../../utils/websocket.js');
var utils = require('../../utils/util.js');
//线下
// var url = 'ws://192.168.0.113:8112'; //服务器地址
// var url1 = 'http://192.168.0.113:8112'; //服务器地址
// 线上
var url = 'wss://websocket.shzqmanager.com'; //服务器地址
var url1 = 'https://websocket.shzqmanager.com'; //服务器地址
var socketOpen = false;
Page({
    /**
     * 页面的初始数据
     */

    data: {
        footadd: true,
        newslist: [],
        userInfo: {},
        scrollTop: "",
        increase: false, //图片添加区域隐藏
        aniStyle: true, //动画效果
        message: "",
        previewImgList: [],
        bol: true,
        send: false
    },
    //获取列表
    // obtionlist: function() {
    //     let that = this;
    //     wx.request({
    //         url: url1 + '/chat/getContent',
    //         method: "POST",
    //         header: {
    //             'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //         },
    //         data: {
    //             id: that.data.charid
    //         },
    //         success: function(res) {
    //             console.log(res)
    //             console.log(res.data)
    //             let sendcontentlist = res.data;
    //             sendcontentlist.forEach((item) => {
    //                 item.insertTiem.time = utils.formatTime(item.insertTiem.time, 'M/D h:m')
    //                 item.insertTiem.month = item.insertTiem.time.substring(5, 10).replace("\/", "-")
    //                 item.insertTiem.day = item.insertTiem.time.substring(10, 16)
    //             });
    //             that.setData({
    //                 sendcontentlist: sendcontentlist
    //             })
    //         }
    //     })
    // },
    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function(options) {
        console.log(options)
        let that = this;
        // 获取常用语
        wx.request({
            url: url1 + '/chat/queryShortcutList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync("unionid"),
                port: 2
            },
            success: function(res) {
                console.log(res.data.data)
                let commonlanguage = res.data.data;
                that.setData({
                    commonlanguage
                })
                // console.log(JSON.parse(res.data).data)
            }
        })
        //拿到职位id获取职位信息
        wx.request({
            url: app.data.apiPath + '/position/queryPositionInfo',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                positionId: options.positionid
            },
            success: function(res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let position = JSON.parse(res.data).data;
                that.setData({
                    position
                })
            }
        })
        console.log(that.data.scrollTop)
        console.log(options.myunionid)
        console.log(options.otherunionid)
        console.log(options.charid)
        console.log(options.positionid)
        that.setData({
            charid: options.charid,
            unionid: wx.getStorageSync('unionid'),
            otherunionid: options.otherunionid,
        })
        //获取别人的头像
        wx.request({
            url: app.data.apiPath + '/user/getWxUserInfo',
            method: "GET",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: options.otherunionid
            },
            success: function(res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let otherheadimg = JSON.parse(res.data).data.headimgurl;
                that.setData({
                    otherheadimg
                })
            }
        })
        //更新已读信息
        // wx.request({
        //     url: url1 + '/chat/updateReadState',
        //     method: "POST",
        //     header: {
        //         'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //     },
        //     data: {
        //         unionid: options.myunionid,
        //         target: options.otherunionid,
        //         chatid: options.charid,
        //     },
        //     success: function (res) {
        //         console.log(res)
        //加载消息内容列表
        wx.request({
            url: url1 + '/chat/getContent',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                id: that.data.charid,
                unionId: wx.getStorageSync('unionid')
            },
            success: function(res) {
                console.log(res)
                console.log(res.data)
                let sendcontentlist = res.data;
                // sendcontentlist.msgContent = JSON.parse(sendcontentlist.msgContent)
                console.log(sendcontentlist)
                sendcontentlist.forEach((item) => {
                    // item.msgContent = JSON.parse(item.msgContent);
                    // item.insertTiem.time = utils.formatTime(item.insertTiem.time, 'M/D h:m')
                    item.insertTiem.month = utils.formatTime(item.insertTiem.time, 'M/D h:m').substring(5, 10).replace("\/", "-")
                    item.insertTiem.day = utils.formatTime(item.insertTiem.time, 'M/D h:m').substring(10, 16)
                });
                console.log(sendcontentlist)
                for (let i = 0; i < sendcontentlist.length; i++) {
                    if (i > 0) {
                        sendcontentlist[i].insertTiem.time1 = (sendcontentlist[i].insertTiem.time - sendcontentlist[i - 1].insertTiem.time) / (60 * 1000);
                    }
                }
                that.setData({
                    sendcontentlist: sendcontentlist
                })
                //到最底部
                setTimeout(function() {
                    var len = that.data.sendcontentlist.length; //遍历的数组的长度
                    that.setData({
                        scrollTop: 1000 * len // 这里我们的单对话区域最高1000，取了最大值，应该有方法取到精确的
                    })
                }, 200)
            }
        })

        //     }
        // })
        //获取个人信息
        wx.request({
            url: app.data.apiPath + '/user/getWxUserInfo',
            method: "GET",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid')
            },
            success: function(res) {
                console.log(JSON.parse(res.data).data)
                that.setData({
                    userInfo: JSON.parse(res.data).data
                })
            }
        })
        //建立链接
        wx.connectSocket({
            url: url + "/websocket?id=" + options.myunionid + "&tid=" + options.otherunionid + "&chatId=" + options.charid,
            header: {
                'content-type': 'application/json'
            },
            success: function() {
                wx.showToast({
                    title: '已连接',
                    icon: "success",
                    duration: 2000
                })
                console.log('websocket连接成功~')
                socketOpen = true
            },

            fail: function() {
                console.log('websocket连接失败~')
            }
        })
        // 实时接收消息
        wx.onSocketOpen(function(res) {
            //接受服务器消息
            ///////////////////////////////
            let timestamp = Date.parse(new Date());
            console.log("当前时间戳为：" + timestamp);
            ///////////////////////////////
            var currenttime = utils.formatTime(new Date());
            var month = currenttime.substring(5, 10).replace("\/", "-")
            var day = currenttime.substring(10, 16)
            wx.onSocketMessage(function(res) {
                console.log(res.data)
                //一旦接受到消息说明对方已经接受了我的信息state =1
                that.data.sendcontentlist.forEach((item) => {
                    item.readState = 1
                });
                //////
                // that.data.sendcontentlist.push({ charId: JSON.parse(that.data.charid), msgContent: res.data, sendUnionid: that.data.otherunionid, receiveUnionid: that.data.unionid, readState: "1", insertTiem: { day: day, month: month, time: timestamp} });
                console.log(res)
                console.log(JSON.parse(res.data))
                that.data.sendcontentlist.push({
                    charId: JSON.parse(that.data.charid),
                    msgContent: JSON.parse(res.data).msgContent,
                    sendUnionid: that.data.otherunionid,
                    receiveUnionid: that.data.unionid,
                    readState: "1",
                    insertTiem: {
                        day: day,
                        month: month,
                        time: timestamp
                    },
                    msgType: JSON.parse(res.data).msgType
                });
                //时间差显示
                for (let i = 0; i < that.data.sendcontentlist.length; i++) {
                    if (i > 0) {
                        that.data.sendcontentlist[i].insertTiem.time1 = (that.data.sendcontentlist[i].insertTiem.time - that.data.sendcontentlist[i - 1].insertTiem.time) / (60 * 1000);
                    }
                }
                /////////////////
                that.setData({
                    sendcontentlist: that.data.sendcontentlist,
                })
                console.log(that.data.sendcontentlist)
                setTimeout(function() {
                    var len = that.data.sendcontentlist.length; //遍历的数组的长度
                    that.setData({
                        scrollTop: 1000 * len // 这里我们的单对话区域最高1000，取了最大值，应该有方法取到精确的
                    })
                }, 100)
            }); //func回调可以拿到服务器返回的数据
        });
    },

    // 页面卸载
    onUnload() {
        wx.closeSocket();
        wx.showToast({
            title: '连接已断开~',
            icon: "none",
            duration: 2000
        })
    },

    //事件处理函数
    formSubmit: function(e) {
        let that = this;
        console.log(e)
        console.log(e.detail.formId)
        app.collectFromidForWx(e.detail.formId);
        console.log(that.data.charid)
        var currenttime = utils.formatTime(new Date());
        var month = currenttime.substring(5, 10).replace("\/", "-")
        var day = currenttime.substring(10, 16)
        console.log(currenttime)
        console.log(month)
        console.log(day)
        console.log(that.data.message)
        ///////////////////////////////
        let timestamp = Date.parse(new Date());
        ///////////////////////////////
        if (that.data.message == "") {
            wx.showToast({
                title: '消息不能为空哦~',
                icon: "none",
                duration: 2000
            })
            return;
        } else {
            wx.sendSocketMessage({
                data: JSON.stringify({
                    "type": "0",
                    "data": {
                        "content": that.data.message,
                        "date": utils.formatTime(new Date())
                    }
                }),
                success: function(res) {
                    // { "msgType": 0, "msg": that.data.message }
                    console.log(res)
                    console.log(that.data.sendcontentlist)
                    that.data.sendcontentlist.push({
                        charId: JSON.parse(that.data.charid),
                        msgContent: that.data.message,
                        sendUnionid: that.data.unionid,
                        receiveUnionid: that.data.otherunionid,
                        msgType: "0",
                        readState: "0",
                        insertTiem: {
                            day: day,
                            month: month,
                            time: timestamp
                        }
                    });
                    //时间差显示
                    for (let i = 0; i < that.data.sendcontentlist.length; i++) {
                        if (i > 0) {
                            that.data.sendcontentlist[i].insertTiem.time1 = (that.data.sendcontentlist[i].insertTiem.time - that.data.sendcontentlist[i - 1].insertTiem.time) / (60 * 1000);
                        }
                    }
                    console.log(that.data.sendcontentlist)
                    that.setData({
                        sendcontentlist: that.data.sendcontentlist,
                        message: '',
                        bol: true,
                        send: false,
                    })
                    // console.log(that.data.sendcontentlist)
                    setTimeout(function() {
                        var len = that.data.sendcontentlist.length; //遍历的数组的长度
                        that.setData({
                            scrollTop: 1000 * len // 这里我们的单对话区域最高1000，取了最大值，应该有方法取到精确的
                        })
                    }, 100)
                    // that.bottom()
                },
                fail: function(res) {
                    console.log(res)
                },
                complete: function(res) {
                    console.log(res)
                    console.log(that.data.sendcontentlist)
                }
            })
        }
    },

    //监听input值的改变
    bindChange: function(e) {
        let that = this;
        console.log(e.detail.value)
        that.setData({
            // appear:false,
            bol: false,
            send: true,
            message: e.detail.value
        })
        if (e.detail.cursor == 0) {
            that.setData({
                bol: true,
                send: false
            })
        } else {
            that.setData({
                bol: false,
                send: true,
            })
        }
    },
    bindscroll: function() {
        this.setData({
            appear: false,
            language: false,
        })
    },
    //显示相机并隐藏
    addappear: function() {
        let that = this;
        var len = that.data.sendcontentlist.length;
        that.setData({
            language: false,
            appear: !that.data.appear
        })
    },
    // 显示常用于并隐藏
    clickcyy: function() {
        let that = this;
        that.setData({
            language: !that.data.language,
            appear:false
        })
    },
    //复制常用语到输入框
    copycyy: function(e) {
        let that = this;
        console.log(e.currentTarget.dataset.id)
        let idc = e.currentTarget.dataset.id;
        console.log(that.data.commonlanguage)
        let cyytext = that.data.commonlanguage[idc].text;
        console.log(cyytext)
        that.setData({
            message: cyytext,
            bol: false,
            send: true,
        })
    },
    // 新增
    addcyy:function(){
        let that = this;
        that.setData({
            editbox1: true,
        })
    },
    //点击设置
    sett: function() {
        let that = this;
        that.setData({
            footadd: false,
            carryout: true,
            delBj: true
        })
    },
    //点击删除和编辑
    copydel: function(e) {
        let that = this;
        let delidc = e.currentTarget.dataset.id;
        let shortcutId = that.data.commonlanguage[delidc].shortcutId
        wx.showModal({
            title: '温馨提示',
            content: '确定要删除吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: url1 + '/chat/deleteShortcutReply',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        data: {
                            shortcutId: shortcutId
                        },
                        success: function (res) {
                            // 获取常用语
                            wx.request({
                                url: url1 + '/chat/queryShortcutList',
                                method: "POST",
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                },
                                data: {
                                    unionid: wx.getStorageSync("unionid"),
                                    port: 2
                                },
                                success: function (res) {
                                    let commonlanguage = res.data.data;
                                    that.setData({
                                        commonlanguage
                                    })
                                }
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    copybj: function(e) {
        let that = this;
        console.log(e.currentTarget.dataset.id)
        let bjidc = e.currentTarget.dataset.id;
        console.log(that.data.commonlanguage)
        let textbj = that.data.commonlanguage[bjidc].text;
        let shortcutbjId = that.data.commonlanguage[bjidc].shortcutId;
        that.setData({
            shortcutbjId: shortcutbjId,
            editcontent: textbj,
            editbox:true,
        })
    },
    //点击完成
    carryout: function() {
        let that = this;
        that.setData({
            footadd: true,
            carryout: false,
            delBj: false
        })
    },
    //保存
    textareainput:function(e){
        let that = this;
        that.setData({
            editcontent: e.detail.value
        })
    },
    textareainput1: function (e) {
        let that = this;
        that.setData({
            editcontent1: e.detail.value
        })
    },
    baocun:function(){
        let that =this;
        console.log(that.data.shortcutbjId)
        console.log(that.data.editcontent)
        if (that.data.editcontent == "" || that.data.editcontent == undefined) {
            wx.showToast({
                title: '您还没有输入哦',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.request({
                url: url1 + '/chat/saveShortcutReply',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync("unionid"),
                    shortcutId: that.data.shortcutbjId,
                    port: 2,
                    text: that.data.editcontent
                },
                success: function (res) {
                    console.log(res)
                    // 获取常用语
                    wx.request({
                        url: url1 + '/chat/queryShortcutList',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        data: {
                            unionid: wx.getStorageSync("unionid"),
                            port: 2
                        },
                        success: function (res) {
                            let commonlanguage = res.data.data;
                            that.setData({
                                commonlanguage,
                                editbox: false
                            })
                        }
                    })
                }
            })
        }
    },
    baocun1: function () {
        let that = this;
        console.log(that.data.editcontent1)
        if (that.data.editcontent1 == "" || that.data.editcontent1 == undefined) {
            wx.showToast({
                title: '您还没有输入哦',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.request({
                url: url1 + '//chat/saveShortcutReply',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync("unionid"),
                    port: 2,
                    text: that.data.editcontent1
                },
                success: function (res) {
                    console.log(res.data)
                    console.log(res.data.rstCode)
                    if (res.data.rstCode == "400"){
                        wx.showToast({
                            title: res.data.rstMessage,
                            icon: 'none',
                            duration: 2000
                        })
                    }else{
                        // 获取常用语
                        wx.request({
                            url: url1 + '/chat/queryShortcutList',
                            method: "POST",
                            header: {
                                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                            data: {
                                unionid: wx.getStorageSync("unionid"),
                                port: 2
                            },
                            success: function (res) {
                                let commonlanguage = res.data.data;
                                that.setData({
                                    commonlanguage,
                                    editbox1: false
                                })
                            }
                        })
                    }
                }
            })
        }
    },
    quxiao: function () {
        this.setData({
            editbox: false,
        })
    },
    quxiao1: function () {
        this.setData({
            editbox1: false,
        })
    },
    //发送图片
    chooseImage() {
        var that = this
        var currenttime = utils.formatTime(new Date());
        var month = currenttime.substring(5, 10).replace("\/", "-")
        var day = currenttime.substring(10, 16)
        let timestamp = Date.parse(new Date());
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                console.log(res)
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: app.data.apiPath + '/upload/img', //自己的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'accept': 'application/json',
                    },
                    formData: ({ //上传图片所要携带的参数
                        path: "chart"
                    }),
                    success: function(res) {
                        var sendimg = res.data.replace(/\"/g, "");
                        console.log(sendimg)
                        wx.sendSocketMessage({
                            data: JSON.stringify({
                                "type": "1",
                                "data": {
                                    "content": sendimg,
                                    "date": utils.formatTime(new Date())
                                }
                            }),
                            success: function(res) {
                                console.log(res)
                                that.data.sendcontentlist.push({
                                    charId: JSON.parse(that.data.charid),
                                    msgContent: sendimg,
                                    sendUnionid: that.data.unionid,
                                    receiveUnionid: that.data.otherunionid,
                                    msgType: "1",
                                    readState: "0",
                                    insertTiem: {
                                        day: day,
                                        month: month,
                                        time: timestamp
                                    }
                                });
                                //时间差显示
                                for (let i = 0; i < that.data.sendcontentlist.length; i++) {
                                    if (i > 0) {
                                        that.data.sendcontentlist[i].insertTiem.time1 = (that.data.sendcontentlist[i].insertTiem.time - that.data.sendcontentlist[i - 1].insertTiem.time) / (60 * 1000);
                                    }
                                }
                                console.log(that.data.sendcontentlist)
                                that.setData({
                                    sendcontentlist: that.data.sendcontentlist,

                                })
                                //加载消息内容列表
                                setTimeout(function() {
                                    wx.request({
                                        url: url1 + '/chat/getContent',
                                        method: "POST",
                                        header: {
                                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                        },
                                        data: {
                                            id: that.data.charid,
                                            unionId: wx.getStorageSync('unionid')
                                        },
                                        success: function(res) {
                                            console.log(res)
                                            console.log(res.data)
                                            let sendcontentlist = res.data;
                                            sendcontentlist.forEach((item) => {
                                                // item.insertTiem.time = utils.formatTime(item.insertTiem.time, 'M/D h:m')
                                                item.insertTiem.month = utils.formatTime(item.insertTiem.time, 'M/D h:m').substring(5, 10).replace("\/", "-")
                                                item.insertTiem.day = utils.formatTime(item.insertTiem.time, 'M/D h:m').substring(10, 16)
                                            });
                                            for (let i = 0; i < sendcontentlist.length; i++) {
                                                if (i > 0) {
                                                    sendcontentlist[i].insertTiem.time1 = (sendcontentlist[i].insertTiem.time - sendcontentlist[i - 1].insertTiem.time) / (60 * 1000);
                                                }
                                            }
                                            that.setData({
                                                sendcontentlist: sendcontentlist,
                                                appear: false
                                            })
                                        }
                                    })
                                }, 100)
                                // console.log(that.data.sendcontentlist)
                                setTimeout(function() {
                                    var len = that.data.sendcontentlist.length; //遍历的数组的长度
                                    that.setData({
                                        scrollTop: 10000 * len // 这里我们的单对话区域最高1000，取了最大值，应该有方法取到精确的
                                    })
                                }, 200)
                                // that.bottom()
                            },
                            fail: function(res) {
                                console.log(res)
                            },
                            complete: function(res) {
                                console.log(res)
                            }
                        })
                    }
                })
            }
        })
    },

    //图片预览
    previewImg(e) {
        var that = this
        console.log(e)
        //必须给对应的wxml的image标签设置data-set=“图片路径”，否则接收不到
        var res = e.target.dataset.src
        var list = this.data.previewImgList //页面的图片集合数组
        //判断res在数组中是否存在，不存在则push到数组中, -1表示res不存在
        if (list.indexOf(res) == -1) {
            this.data.previewImgList.push(res)
        }

        wx.previewImage({
            current: res, // 当前显示图片的http链接
            urls: that.data.previewImgList // 需要预览的图片http链接列表
        })
    },

    //聊天消息始终显示最底端
    // bottom: function () {
    //     var query = wx.createSelectorQuery()
    //     query.select('#flag').boundingClientRect()
    //     query.selectViewport().scrollOffset()
    //     query.exec(function (res) {
    //         console.log(res)
    //         wx.pageScrollTo({
    //             scrollTop: res[0].bottom // #the-id节点的下边界坐标
    //         })
    //         res[1].scrollTop // 显示区域的竖直滚动位置
    //     })
    // },
    // bottom: function () {
    //     var that = this;
    //     that.setData({
    //         scrollTop: 603
    //     })
    // }
})