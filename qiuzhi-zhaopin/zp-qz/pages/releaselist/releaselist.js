const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // hidden: false, //控制按钮隐藏显示
        winHeight: "", //窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        state: '',
        type: '0',
        tab: {
            
        },
        curHdIndex: 0,
        curBdIndex: 0,
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
    },
    tabFun1:function(e){
        let that = this;
        console.log(e.currentTarget.dataset.index)
        that.setData({
            curHdIndex: e.currentTarget.dataset.index,
            // curBdIndex: e.currentTarget.dataset.index
        })
    },
    //点击感兴趣内跳转到聊天室
    navtochar: function (e) {
        let that = this;
        console.log(e.currentTarget.dataset.index);
        let index = e.currentTarget.dataset.index;
        console.log(that.data.interlist)
        wx.navigateTo({
            url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + that.data.interlist[index].otherUnionid + '&charid=' + that.data.interlist[index].charId + '&positionid=' + that.data.interlist[index].positionId,
        })
    },
    // 长按感兴趣内的移除/删除/举报
    ondelete: function (e) {
        let that = this;
        // console.log(e.currentTarget.dataset.index)
        that.setData({
            inDex: e.currentTarget.dataset.index
        })
    },
    // 点击别处隐藏按钮
    quxiaoall: function () {
        let that = this;
        that.setData({
            inDex: -1,
            inDex1: -1
        })
    },
    //
    //聊天室关注
    vae1: function (e) {
        let that = this;
        console.log(that.data.interlist);
        console.log(e.currentTarget.dataset.index);
        let iDx = e.currentTarget.dataset.index;
        //关注
        wx.request({
            url: app.data.apiPath + '/chat/updateChatViewState',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                charId: that.data.interlist[iDx].charId,
                flag: 1,
            },
            success: function (res) {
                console.log(res)
                if (JSON.parse(res.data).rstCode == "SUCCESS") {
                    wx.showToast({
                        title: '已关注',
                        icon: 'success',
                        duration: 2000
                    })
                    that.setData({
                        inDex: -1
                    })
                    //重新查询感兴趣列表
                    wx.request({
                        url: app.data.apiPath + '/position/queryCollectionList',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        data: {
                            positionId: that.data.positionId,
                            pageIdx: 1
                        },
                        success: function (res) {
                            console.log(res)
                            console.log(JSON.parse(res.data).data)
                            let interlist = JSON.parse(res.data).data;
                            interlist.forEach((item) => {
                                item.chatMessage.insertTiem = item.chatMessage.insertTiem.substring(11, 16)
                            })
                            that.setData({
                                interlist
                            })
                        }
                    })
                    //重新查询我关注列表
                    wx.request({
                        url: app.data.apiPath + '/position/queryMyCollectionList',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        data: {
                            positionId: that.data.positionId,
                            pageIdx: 1
                        },
                        success: function (res) {
                            console.log(res)
                            console.log(JSON.parse(res.data).data)
                            let concerlist = JSON.parse(res.data).data;
                            concerlist.forEach((item) => {
                                item.chatMessage.insertTiem = item.chatMessage.insertTiem.substring(11, 16)
                            })
                            that.setData({
                                concerlist
                            })
                        }
                    })
                }
            }
        })
    },
    //聊天室取消关注
    vae2: function (e) {
        let that = this;
        console.log(that.data.interlist);
        console.log(e.currentTarget.dataset.index);
        let iDx = e.currentTarget.dataset.index;
        //取消关注
        wx.showModal({
            title: '提示',
            content: '确定要取消关注吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.data.apiPath + '/chat/updateChatViewState',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        data: {
                            charId: that.data.interlist[iDx].charId,
                            flag: 0,
                        },
                        success: function (res) {
                            console.log(res)
                            if (JSON.parse(res.data).rstCode == "SUCCESS") {
                                wx.showToast({
                                    title: '已取消关注',
                                    icon: 'success',
                                    duration: 2000
                                })
                            }
                            that.setData({
                                inDex: -1
                            })
                            //重新查询感兴趣列表
                            wx.request({
                                url: app.data.apiPath + '/position/queryCollectionList',
                                method: "POST",
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                                },
                                data: {
                                    positionId: that.data.positionId,
                                    pageIdx: 1
                                },
                                success: function (res) {
                                    console.log(res)
                                    console.log(JSON.parse(res.data).data)
                                    let interlist = JSON.parse(res.data).data;
                                    interlist.forEach((item) => {
                                        item.chatMessage.insertTiem = item.chatMessage.insertTiem.substring(11, 16)
                                    })
                                    that.setData({
                                        interlist
                                    })
                                }
                            })
                            //重新查询我关注列表
                            wx.request({
                                url: app.data.apiPath + '/position/queryMyCollectionList',
                                method: "POST",
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                                },
                                data: {
                                    positionId: that.data.positionId,
                                    pageIdx: 1
                                },
                                success: function (res) {
                                    console.log(res)
                                    console.log(JSON.parse(res.data).data)
                                    let concerlist = JSON.parse(res.data).data;
                                    concerlist.forEach((item) => {
                                        item.chatMessage.insertTiem = item.chatMessage.insertTiem.substring(11, 16)
                                    })
                                    that.setData({
                                        concerlist
                                    })
                                }
                            })
                        }
                    })
                } else if (res.cancel) {
                    that.setData({
                        inDex: -1
                    })
                }
                
            }
        })
    },
    //点击查看简历
    vae0: function (e) {
        let that = this;
        console.log(that.data.interlist)
        console.log(e)
        let index = e.currentTarget.dataset.index;
        let otherunionid = that.data.interlist[index].otherUnionid;
        let charid = that.data.interlist[index].charId;
        console.log(index)
        console.log(otherunionid)
        console.log(charid)
        if (that.data.interlist[index].resumeIsFull == 1) {
            wx.navigateTo({
                url: '../redetails/redetails?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + otherunionid + '&charid=' + charid + '&positionid=' + that.data.positionId,
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
                            }
                        })
                        wx.navigateTo({
                            url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + that.data.interlist[index].otherUnionid + '&charid=' + that.data.interlist[index].charId + '&positionid=' + that.data.interlist[index].positionId,
                        })
                    } else if (res.cancel) {
                        return;
                    }
                }
            })
        }
        that.setData({
            inDex: -1
        })
    },
    // vae4:function(){
    //     let that = this;
    //     wx.request({
    //         url: app.data.apiPath + '/chat/saveUserGroupTags',
    //         method: "POST",
    //         header: {
    //             'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //         },
    //         data: {
    //             id: that.data.positionId,
    //             pageIdx: 1
    //         },
    //         success: function (res) {
    //             console.log(res)
    //             console.log(JSON.parse(res.data).data)
    //             let interlist = JSON.parse(res.data).data;
    //             interlist.forEach((item) => {
    //                 item.chatMessage.insertTiem = item.chatMessage.insertTiem.substring(11, 16)
    //             })
    //             that.setData({
    //                 interlist
    //             })
    //         }
    // },
    //点击我关注内跳转到聊天室
    navtochar1: function (e) {
        let that = this;
        console.log(e.currentTarget.dataset.index);
        let index = e.currentTarget.dataset.index;
        console.log(that.data.concerlist)
        wx.navigateTo({
            url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + that.data.concerlist[index].otherUnionid + '&charid=' + that.data.concerlist[index].charId + '&positionid=' + that.data.concerlist[index].positionId,
        })
    },
    // 长按我关注内的移除/删除/举报
    ondelete1: function (e) {
        let that = this;
        // console.log(e.currentTarget.dataset.index)
        that.setData({
            inDex1: e.currentTarget.dataset.index
        })
    },
    //点击查看简历
    vae5:function(e){
        let that = this;
        console.log(that.data.concerlist)
        console.log(e)
        let index = e.currentTarget.dataset.index;
        let otherunionid = that.data.concerlist[index].otherUnionid;
        let charid = that.data.concerlist[index].charId;
        if (that.data.concerlist[index].resumeIsFull == 1){
            wx.navigateTo({
                url: '../redetails/redetails?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + otherunionid + '&charid=' + charid + '&positionid=' + that.data.positionId,
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '对方还没有完善简历，请进入聊天室与他沟通',
                success(res){
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
                        wx.navigateTo({
                            url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + that.data.concerlist[index].otherUnionid + '&charid=' + that.data.concerlist[index].charId + '&positionid=' + that.data.concerlist[index].positionId,
                        })
                    } else if (res.cancel) {
                        return;
                    }
                }
            })
        }
        that.setData({
            inDex1: -1
        })
    },
    //点击取消关注
    vae6:function(e){
        let that = this;
        console.log(that.data.concerlist);
        console.log(e.currentTarget.dataset.index);
        let iDx = e.currentTarget.dataset.index;
        //取消关注
        wx.showModal({
            title: '提示',
            content: '确定要取消关注吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.data.apiPath + '/chat/updateChatViewState',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        data: {
                            charId: that.data.concerlist[iDx].charId,
                            flag: 0,
                        },
                        success: function (res) {
                            console.log(res)
                            if (JSON.parse(res.data).rstCode == "SUCCESS") {
                                wx.showToast({
                                    title: '已取消关注',
                                    icon: 'success',
                                    duration: 2000
                                })
                            }
                            that.setData({
                                inDex: -1
                            })
                            //重新查询我关注列表
                            wx.request({
                                url: app.data.apiPath + '/position/queryMyCollectionList',
                                method: "POST",
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                                },
                                data: {
                                    positionId: that.data.positionId,
                                    pageIdx: 1
                                },
                                success: function (res) {
                                    console.log(res)
                                    console.log(JSON.parse(res.data).data)
                                    let concerlist = JSON.parse(res.data).data;
                                    concerlist.forEach((item) => {
                                        item.chatMessage.insertTiem = item.chatMessage.insertTiem.substring(11, 16)
                                    })
                                    that.setData({
                                        concerlist
                                    })
                                }
                            })
                        }
                    })
                } else if (res.cancel) {
                    that.setData({
                        inDex: -1
                    })
                }

            }
        })
    },
    //联系他创建聊天室
    contacthim:function(e){
        let that = this;
        console.log(that.data.onlooklist)
        console.log(that.data.positionId)
        let onlooklistindex = e.currentTarget.dataset.index;
        console.log(e.currentTarget.dataset.index)
        //创建聊天室
        wx.request({
            url: app.data.apiPath + '/chat/createChat',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                positionId: that.data.positionId,
                unionid: wx.getStorageSync('unionid'),
                toUnionid: that.data.onlooklist[onlooklistindex].unionid,
                msgType:0
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let charid = JSON.parse(res.data).data
                wx.navigateTo({
                    url: '../chats/chats?myunionid=' + wx.getStorageSync("unionid") + '&otherunionid=' + that.data.onlooklist[onlooklistindex].unionid + '&charid=' + charid + '&positionid=' + that.data.positionId,
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        let that = this;
        //  高度自适应
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
        that.grouping()
        console.log(e)
        let positionId = JSON.parse(e.positionId)
        let idd = JSON.parse(e.idd)
        if(idd == 0){
            that.setData({
                positionId: positionId,
                currentTab: 0,
            })
        }
        if (idd == 1) {
            that.setData({
                positionId: positionId,
                currentTab: 1,
            })
        }
        if (idd == 2) {
            that.setData({
                positionId: positionId,
                currentTab: 2,
            })
        }
        console.log(positionId)
        //根据职位id查询详情
        wx.request({
            url: app.data.apiPath + '/position/queryPositionInfo',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                positionId: positionId
            },
            success: function (res) {
                // console.log(res)
                // console.log(JSON.parse(res.data))
                that.setData({
                    position: JSON.parse(res.data).data
                })
            }
        })
        //查询围观列表
        wx.request({
            url: app.data.apiPath + '/position/queryWatchList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                positionId: positionId,
                pageIdx: 1
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let onlooklist = JSON.parse(res.data).data;
                onlooklist.forEach((item)=>{
                    item.time = item.watchDatetime.substring(11, 19)
                    item.watchDatetime = item.watchDatetime.substring(0, 10)
                })
                console.log(onlooklist)
                that.setData({
                    onlooklist
                })
            }
        })
        //查询感兴趣列表
        wx.request({
            url: app.data.apiPath + '/position/queryCollectionList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                positionId: positionId,
                pageIdx: 1
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let interlist = JSON.parse(res.data).data;
                interlist.forEach((item) => {
                    if (item.chatMessage.insertTiem){
                        item.chatMessage.insertTiem = item.chatMessage.insertTiem.substring(11, 16)
                    }
                    else{}
                })
                that.setData({
                    interlist
                })
            }
        })
        //查询我关注列表
        wx.request({
            url: app.data.apiPath + '/position/queryMyCollectionList',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                positionId: positionId,
                pageIdx: 1
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let concerlist = JSON.parse(res.data).data;
                concerlist.forEach((item) => {
                    if (item.chatMessage.insertTiem){
                        item.chatMessage.insertTiem = item.chatMessage.insertTiem.substring(11, 16)
                    }
                    else{}
                })
                that.setData({
                    concerlist
                })
            }
        }) 
    },
    scrolltolower:function(e){

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
    // type == 0
    swichNav: function (e) {
        let that = this;
        // console.log(e)
        let cur = e.currentTarget.dataset.current;
        // if (cur == '0') {
        //     state = '0'
        // } else {
        //     state = '1'
        // }
        let type = that.data.type;
        type = '0'
        // idx = 0;
        if (that.data.currentTaB == cur) {
            return false;
        } else {
            that.setData({
                currentTab: cur,
                type: '0',
            })
        }
    },
    // type == 1
    swichNav1: function (e) {
        let that = this;
        // console.log(e)
        let cur = e.currentTarget.dataset.current;
        // if (cur == '0') {
        //     state = '0'
        // } else {
        //     state = '1'
        // }
        let type = that.data.type;
        type = '1'
        // idx = 0;
        if (that.data.currentTaB == cur) {
            return false;
        } else {
            that.setData({
                currentTab: cur,
                type: '1',
            })
        }
    },
    // type == 2
    swichNav2: function (e) {
        let that = this;
        // console.log(e)
        let cur = e.currentTarget.dataset.current;
        // if (cur == '0') {
        //     state = '0'
        // } else {
        //     state = '1'
        // }
        let type = that.data.type;
        type = '2'
        // idx = 0;
        if (that.data.currentTaB == cur) {
            return false;
        } else {
            that.setData({
                currentTab: cur,
                type: '2',
            })
        }
    },
    grouping:function(){
        let that = this;
        //查询我关注列表
        wx.request({
            url: app.data.apiPath + '/chat/queryGroupTags',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid')
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let all = {tagName:"全部"}
                let groupinglist = JSON.parse(res.data).data;
                groupinglist.unshift(all)
                console.log(groupinglist)
                that.setData({
                    groupinglist
                })
            }
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