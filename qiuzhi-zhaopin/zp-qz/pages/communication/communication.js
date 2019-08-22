const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0, //预设当前项的值
        winHeight: "", //窗口高度
        scrollLeft: 0, //tab标题的滚动条位置
        state: '',
        type: '0',
        tab: {
            curHdIndex: 0,
            curBdIndex: 0,
        },
    },
    tabFun: function (e) {
        let that = this;
        // 获取下标
        let _datasetId = e.target.dataset.id;
        let _obj = {};
        _obj.curHdIndex = _datasetId;
        _obj.curBdIndex = _datasetId;
        that.setData({
            tab: _obj
        });
        // if (_datasetId == 0) {
        //     console.log(that.data.ksyIndex)
        //     if (that.data.ksyIndex == 0) {
        //         that.setData({
        //             biaoqianshow: true
        //         })
        //     }
        //     else {
        //         that.setData({
        //             biaoqianshow: false
        //         })
        //     }
        // } else if (_datasetId == 1) {
        //     console.log(that.data.ysyIndex)
        //     if (that.data.ysyIndex == 0) {
        //         that.setData({
        //             biaoqianshow: true
        //         })
        //     }
        //     else {
        //         that.setData({
        //             biaoqianshow: false
        //         })
        //     }
        // } else if (_datasetId == 2) {
        //     console.log(that.data.ygqIndex)
        //     if (that.data.ygqIndex == 0) {
        //         that.setData({
        //             biaoqianshow: true
        //         })
        //     }
        //     else {
        //         that.setData({
        //             biaoqianshow: false
        //         })
        //     }
        // }

    },
    // tab切换0
    processing: function (e) {
        let that = this;
        // console.log(e)
        let cur = e.target.dataset.current;
        // let type = that.data.type;
        // type = '0';
        if (that.data.currentTaB == cur) {
            return false;
        } else {
            that.setData({
                currentTab: cur,
                // type: '0',
            })
        }
    },
    // tab切换1
    over: function (e) {
        let that = this;
        let cur = e.target.dataset.current;
        // let type = that.data.type;
        // type = '1';
        if (that.data.currentTaB == cur) {
            return false;
        } else {
            that.setData({
                currentTab: cur,
                // type: '1',
            })
        }
    },
    // 滚动切换标签样式/////////////////////////////////////
    switchTab: function (e) {
        let that = this;
        let unionid = wx.getStorageSync("unionid");
        // console.log(unionid)
        // if (e.detail.current == '0') {
        //     state = '0'
        // } else {
        //     state = '1'
        // }
        let idx = 0;
        // getPositionList(types, state)

        that.setData({
            currentTab: e.detail.current
        });
        // this.checkCor();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        //  高度自适应
        that.noread();//消息
        wx.getSystemInfo({
            success: function (res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR;
                that.setData({
                    winHeight: calc
                });
            }
        });
        that.fzchatlist();
        that.fzattentionlist();
    },
    //封装
    fzchatlist:function(){
        let that = this;
        wx.showLoading({
            title: '加载中',
        })
        //获取聊天室全部列表
        wx.request({
            url: app.data.apiPath + '/chat/queryChatList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                flag: 0,    //类型:0全部 1我的关注 2关注我的 3发布者删除 4发布者黑名单
                pageIdx: 1
            },
            success: function (res) {
                wx.hideLoading();
                console.log(JSON.parse(res.data).data)
                let chatlist = JSON.parse(res.data).data;
                chatlist.forEach((item) => {
                    // item.chatMessage.msgContent = JSON.parse(item.chatMessage.msgContent);
                    if (item.chatMessage.insertTiem) {
                        item.chatMessage.insertTiem = item.chatMessage.insertTiem.substring(11, 16)
                    } else {
                        item.chatMessage.insertTiem = ''
                    }
                    if(item.positionInfo.relaseDate){
                        item.positionInfo.relaseDate = item.positionInfo.relaseDate.substring(5, 10).replace(/-/, '月')
                    }
                })
                console.log(chatlist)
                that.setData({
                    chatlist
                })
            }
        })
    },
    fzattentionlist: function () {
        let that = this;
        wx.showLoading({
            title: '加载中',
        })
        //获取聊天室关注列表
        wx.request({
            url: app.data.apiPath + '/chat/queryChatList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
                flag: 1,    //类型:0全部 1我的关注 2关注我的 3发布者删除 4发布者黑名单
                pageIdx: 1
            },
            success: function (res) {
                wx.hideLoading();
                console.log(JSON.parse(res.data).data)
                let attentionlist = JSON.parse(res.data).data;
                attentionlist.forEach((item) => {
                    // item.chatMessage.msgContent = JSON.parse(item.chatMessage.msgContent);
                    if (item.chatMessage.insertTiem) {
                        item.chatMessage.insertTiem = item.chatMessage.insertTiem.substring(11, 16)
                    } else {
                        item.chatMessage.insertTiem = ''
                    } 
                    if (item.positionInfo.relaseDate) {
                        item.positionInfo.relaseDate = item.positionInfo.relaseDate.substring(5, 10).replace(/-/, '月')
                    }
                })
                console.log(attentionlist)
                that.setData({
                    attentionlist
                })
            }
        })
    },
    //点击查看简历
    vae0: function (e) {
        let that = this;
        console.log(that.data.chatlist)
        console.log(e)
        let index = e.currentTarget.dataset.index;
        let otherunionid = that.data.chatlist[index].otherUnionid;
        let charid = that.data.chatlist[index].charId;
        let positionId = that.data.chatlist[index].positionId;
        console.log(index)
        console.log(otherunionid)
        console.log(charid)
        if (that.data.chatlist[index].resumeIsFull == 1) {
            wx.navigateTo({
                url: '../redetails/redetails?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + otherunionid + '&charid=' + charid + '&positionid=' + positionId,
            })
            that.setData({
                bgcolor: false,
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '对方还没有完善简历，请进入聊天室与他沟通',
                success(res) {
                    if (res.confirm) {
                        //发送模板消息
                        wx.request({
                            url: app.data.apiPath + '/resume/resumeFull',
                            method: "POST",
                            header: {
                                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                            },
                            data: {
                                unionid: wx.getStorageSync('unionid'),
                                tounionid: otherunionid
                            },
                            success: function (res) {
                                console.log(res)
                                console.log(JSON.parse(res.data).data)
                                that.setData({
                                    bgcolor: false,
                                })
                            }
                        })
                        wx.navigateTo({
                            url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + that.data.chatlist[index].otherUnionid + '&charid=' + that.data.chatlist[index].charId + '&positionid=' + that.data.chatlist[index].positionId,
                        })
                    } else if (res.cancel) {
                        that.setData({
                            bgcolor: false,
                        })
                        return;
                    }
                }
            })
        }
        that.setData({
            inDex: -1
        })
    },
    //点击查看简历
    vae4: function (e) {
        let that = this;
        console.log(that.data.attentionlist)
        console.log(e)
        let index = e.currentTarget.dataset.index;
        let otherunionid = that.data.attentionlist[index].otherUnionid;
        let charid = that.data.attentionlist[index].charId;
        let positionId = that.data.attentionlist[index].positionId;
        console.log(index)
        console.log(otherunionid)
        console.log(charid)
        if (that.data.attentionlist[index].resumeIsFull == 1) {
            wx.navigateTo({
                url: '../redetails/redetails?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + otherunionid + '&charid=' + charid + '&positionid=' + positionId,
            })
            that.setData({
                bgcolor1: false,
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '对方还没有完善简历，请进入聊天室与他沟通',
                success(res) {
                    if (res.confirm) {
                        //发送模板消息
                        wx.request({
                            url: app.data.apiPath + '/resume/resumeFull',
                            method: "POST",
                            header: {
                                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                            },
                            data: {
                                unionid: wx.getStorageSync('unionid'),
                                tounionid: otherunionid
                            },
                            success: function (res) {
                                console.log(res)
                                console.log(JSON.parse(res.data).data)
                            }
                        })
                        that.setData({
                            bgcolor1: false,
                        })
                        wx.navigateTo({
                            url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + that.data.attentionlist[index].otherUnionid + '&charid=' + that.data.attentionlist[index].charId + '&positionid=' + that.data.attentionlist[index].positionId,
                        })
                    } else if (res.cancel) {
                        that.setData({
                            bgcolor1: false,
                        })
                        return;
                    }
                }
            })
        }
        that.setData({
            inDex1: -1
        })
    },
    //进入聊天室
    navtochats:function(e){
        let that = this;
        let chatindex = e.currentTarget.dataset.index;
        console.log(e.currentTarget.dataset.index)
        console.log(that.data.chatlist)
        // console.log(that.data.chatlist[chatindex].unionid)//自己的id
        let myunionid = that.data.chatlist[chatindex].unionid;
        // console.log(that.data.chatlist[chatindex].otherUnionid)//别人的id
        let otherunionid = that.data.chatlist[chatindex].otherUnionid;
        // console.log(that.data.chatlist[chatindex].charId)//聊天室id
        let charid = that.data.chatlist[chatindex].charId;
        let positionid = that.data.chatlist[chatindex].positionId;
        //判断unionid
        if (myunionid == wx.getStorageSync("unionid")){
            otherunionid = otherunionid
        }else{
            otherunionid = myunionid
        }
        console.log(wx.getStorageSync("unionid"))
        console.log(otherunionid)
        wx.navigateTo({
            url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + otherunionid + '&charid=' + charid + '&positionid=' + positionid,
        })
    },
    //进入聊天室1
    navtochats1: function (e) {
        let that = this;
        let chatindex = e.currentTarget.dataset.index;
        console.log(e.currentTarget.dataset.index)
        console.log(that.data.attentionlist)
        // console.log(that.data.chatlist[chatindex].unionid)//自己的id
        let myunionid = that.data.attentionlist[chatindex].unionid;
        // console.log(that.data.chatlist[chatindex].otherUnionid)//别人的id
        let otherunionid = that.data.attentionlist[chatindex].otherUnionid;
        // console.log(that.data.chatlist[chatindex].charId)//聊天室id
        let charid = that.data.attentionlist[chatindex].charId;
        let positionid = that.data.attentionlist[chatindex].positionId;
        //判断unionid
        if (myunionid == wx.getStorageSync("unionid")) {
            otherunionid = otherunionid
        } else {
            otherunionid = myunionid
        }
        wx.navigateTo({
            url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + otherunionid + '&charid=' + charid + '&positionid=' + positionid,
        })
    },
    // 点击别处隐藏按钮
    bgcolor: function () {
        let that = this;
        that.setData({
            bgcolor: false,
            inDex: -1,
            inDex1: -1
        })
    },
    //长按全部列表出现弹窗
    xuanze: function (e) {
        console.log(e)
        let that = this;
        that.setData({
            inDex: e.currentTarget.dataset.index,
            bgcolor: true
        })
    },
    // 点击别处隐藏按钮
    bgcolor1: function () {
        let that = this;
        that.setData({
            bgcolor1: false,
            inDex: -1,
            inDex1: -1
        })
    },
    //长按全部列表出现弹窗
    xuanze1: function (e) {
        console.log(e)
        let that = this;
        that.setData({
            inDex1: e.currentTarget.dataset.index,
            bgcolor1: true
        })
    },
    // ondelete1: function (e) {
    //     let that = this;
    //     that.setData({
    //         inDex1: e.currentTarget.dataset.index
    //     })
    // },
    //点击全部下的关注
    vae1: function (e) {
        let that = this;
        console.log(that.data.chatlist)
        let index = e.currentTarget.dataset.index;
        wx.request({
            url: app.data.apiPath + '/chat/updateChatViewState',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                charId: that.data.chatlist[index].charId,
                flag: 1    //参与者标志: 0不处理 1关注 2删除 3黑名单
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).rstCode)
                if (JSON.parse(res.data).rstCode == "SUCCESS") {
                    wx.showToast({
                        title: '关注成功',
                        icon: 'success',
                        duration: 2000
                    })
                }
                that.setData({
                    inDex: -1,
                    bgcolor: false,
                })
                that.fzchatlist();
                that.fzattentionlist();
            }
        })
    },
    //点击全部下的取消关注
    vae2: function (e) {
        let that = this;
        console.log(that.data.chatlist)
        let index = e.currentTarget.dataset.index;
        wx.showModal({
            title: '提示',
            content: '确定要取消关注吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.data.apiPath + '/chat/updateChatViewState',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        data: {
                            charId: that.data.chatlist[index].charId,
                            flag: 2    //参与者标志: 0不处理 1关注 2删除 3黑名单
                        },
                        success: function (res) {
                            console.log(res)
                            console.log(JSON.parse(res.data).rstCode)
                            if (JSON.parse(res.data).rstCode == "SUCCESS") {
                                wx.showToast({
                                    title: '已取消关注',
                                    icon: 'success',
                                    duration: 2000
                                })
                            }
                            that.setData({
                                inDex: -1,
                                bgcolor: false,
                            })
                            that.fzchatlist();
                            that.fzattentionlist();
                        }
                    })
                } else if (res.cancel) {
                    that.setData({
                        inDex: -1,
                        bgcolor: false,
                    })
                }
            }
        })
    },
    //点击关注下的取消关注
    vae3: function (e) {
        let that = this;
        console.log(that.data.attentionlist)
        let index = e.currentTarget.dataset.index;
        wx.showModal({
            title: '提示',
            content: '确定要取消关注吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.data.apiPath + '/chat/updateChatViewState',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        data: {
                            charId: that.data.attentionlist[index].charId,
                            flag: 2    //参与者标志: 0不处理 1关注 2删除 3黑名单
                        },
                        success: function (res) {
                            console.log(res)
                            console.log(JSON.parse(res.data).rstCode)
                            if (JSON.parse(res.data).rstCode == "SUCCESS") {
                                wx.showToast({
                                    title: '已取消关注',
                                    icon: 'success',
                                    duration: 2000
                                })
                            }
                            that.setData({
                                inDex1: -1,
                                bgcolor1: false,
                            })
                            that.fzchatlist();
                            that.fzattentionlist();
                        }
                    })
                } else if (res.cancel) {
                    that.setData({
                        inDex1: -1,
                        bgcolor1: false,
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.noread();//消息
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that =this;
        that.noread();//消息
        that.fzchatlist();
        that.fzattentionlist();
    },
    //聊天室未读信息
    noread: function () {
        let that = this;
        wx.request({
            url: app.data.apiPath + '/chat/queryChatState',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid'),
            },
            success: function (res) {
                console.log(JSON.parse(res.data).data)
                // console.log(JSON.parse(res.data).data.hasNoRead)
                // console.log((JSON.parse(res.data).data.hasNoRead).toString())
                let weidunum = (JSON.parse(res.data).data.hasNoRead).toString();
                if (JSON.parse(res.data).data.hasNoRead != 0) {
                    console.log('有未读消息')
                    // wx.showTabBarRedDot({
                    //     index: 1
                    // });
                    wx.setTabBarBadge({
                        index: 1,
                        text: weidunum
                    })
                } else {
                    wx.removeTabBarBadge({
                        index: 1,
                    })
                    // wx.hideTabBarRedDot({
                    //     index: 1
                    // })
                }
            }
        })
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
    // 下拉刷新
    onPullDownRefresh: function () {
        let that = this;
        wx.showNavigationBarLoading()
        console.log('下拉刷新')
        that.onLoad();
        setTimeout(function () {
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1200);
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