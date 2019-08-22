const app = getApp();
var countnum = 0;
var utils = require('../../utils/util.js');
var systemInfo = wx.getSystemInfoSync();
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ////
        isShow: false, //是否已经弹出
        animMain: {}, //旋转动画
        animAdd: {}, //item位移,透明度
        animDelLots: {}, //item位移,透明度
        animmyrec:{},
        ////
        ellipsis: true,
        hidden: true,
        windowWidth: 0,
        windowHeight: 0,
        //控制朋友圈转发
        hidden1: true,
        footer: true,
        footbtn: true,
        //控制保存按钮和授权
        saveImgBtnHidden: false,
        openSettingBtnHidden: true,
        modalShow: false, //授权状态显示和隐藏
    },
    ellipsis: function () {
        let value = !this.data.ellipsis;
        this.setData({
            ellipsis: value,
            hidden: false
        })
    },
    //跳转公司信息
    navtocominfor: function () {
        let that = this;
        console.log(that.data.company_id)
        wx.navigateTo({
            url: '../cominfor/cominfor?companyid=' + JSON.stringify(that.data.company_id),
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        console.log(options)
        //地图
        qqmapsdk = new QQMapWX({
            key: 'WPRBZ-EAN3U-WS2VM-2PTHS-BL2EF-ZMBWZ' //这里自己的key秘钥进行填充
        });
        //获取当前时间
        let timestamp = Date.parse(new Date());
        that.setData({
            timestamp: timestamp
        })
        //页面进入加载动画
        wx.showLoading({
            title: '加载中',
        })
        ////
        //存在即分享小程序码进
        if (options.scene) {
            console.log('分享进入')
            var positionId = options.scene;
        }else{
            console.log('页面跳转进入')
            var positionId = options.positionId;
        }
        console.log(positionId)
        that.setData({
            positionId
        })
        console.log(wx.getStorageSync('unionid'))
        if (wx.getStorageSync('unionid')){
            wx.request({
                url: app.data.apiPath + '/position/sharePositionInfo',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    positionId: positionId,
                    unionid: wx.getStorageSync('unionid'),
                },
                success: function (res) {
                    console.log(res)
                    let positioninfo = JSON.parse(res.data).data;
                    console.log(positioninfo)
                    positioninfo.relase_date = utils.formatTime(positioninfo.relase_date, 'M/D h:m').substring(5, 10).replace('\/', "月")
                    console.log(positioninfo)
                    that.setData({
                        positioninfo,
                        positionId,
                        company_id: positioninfo.company_id
                    })
                    // 页面加载职位详情后加载canvas图片
                    let promise1 = new Promise(function (resolve, reject) {
                        // 先获取canvas背景图
                        wx.getImageInfo({
                            src: app.data.canvas + '/template/canvas-bg.png',
                            success: function (res) {
                                console.log(res);
                                resolve(res);
                                countnum += 1;
                            },
                            fail: function (res) {
                                console.log(res)
                            }
                        })
                    });
                    let promise2 = new Promise(function (resolve, reject) {
                        // 获取矩形靓点背景
                        wx.getImageInfo({
                            src: app.data.canvas + '/template/juxing.png',
                            success: function (res) {
                                console.log(res);
                                resolve(res);
                                countnum += 1;
                            },
                            fail: function (res) {
                                console.log(res)
                            }
                        })
                    });
                    let promise3 = new Promise(function (resolve, reject) {
                        // 获取公司logo
                        wx.getImageInfo({
                            src: positioninfo.logo,
                            success: function (res) {
                                console.log(res);
                                resolve(res);
                                countnum += 1;
                            }
                        })
                    });
                    let promise4 = new Promise(function (resolve, reject) {
                        // 获取发布者头像
                        wx.getImageInfo({
                            src: positioninfo.headimgurl,
                            success: function (res) {
                                console.log(res);
                                resolve(res);
                                countnum += 1;
                            }
                        })
                    });
                    let promise5 = new Promise(function (resolve, reject) {
                        // 获取小程序码
                        wx.getImageInfo({
                            src: positioninfo.qrimg_url,
                            success: function (res) {
                                console.log(res);
                                resolve(res);
                                countnum += 1;
                            }
                        })
                    });
                    Promise.all([
                        promise1, promise2, promise3, promise4, promise5
                    ]).then(res => {
                        const ctx = wx.createCanvasContext('shareImg');
                        ctx.save(); //开始绘制
                        // ctx.setStrokeStyle('#fff');
                        ctx.drawImage(res[0].path, 0, 0, 375, 667); //背景
                        // 画圆形头像
                        // ctx.setStrokeStyle('#fff');//头像边框颜色
                        ctx.beginPath();
                        ctx.arc(45, 420, 20, 0, 2 * Math.PI);
                        ctx.clip();
                        ctx.drawImage(res[3].path, 23, 400, 45, 45);
                        ctx.restore();
                        //职位名称
                        ctx.setFontSize(22);
                        ctx.setFillStyle('#000');
                        ctx.fillText(positioninfo.position_name, 50, 130);
                        //薪资待遇
                        ctx.setFontSize(18);
                        ctx.setFillStyle('#ff3333');
                        ctx.fillText(positioninfo.treatment_min_show + '-' + positioninfo.treatment_max_show + '/' + '月', 50, 170);
                        // 竖杠
                        ctx.setFontSize(18);
                        ctx.setFillStyle('#ccc');
                        ctx.fillText('|', 150, 170);
                        //城市
                        ctx.setFontSize(18);
                        ctx.setFillStyle('#353535');
                        ctx.fillText(positioninfo.city.substring(0, 2), 165, 170);
                        // 竖杠
                        ctx.setFontSize(18);
                        ctx.setFillStyle('#ccc');
                        ctx.fillText('|', 210, 170);
                        //学历
                        ctx.setFontSize(18);
                        ctx.setFillStyle('#353535');
                        ctx.fillText(positioninfo.education_name, 220, 170);
                        // 职位靓点 判断职位靓点的个数(0 1 2最多职能放下俩)
                        if (positioninfo.positionBrightTagList.length == 0) {
                            //直线
                            ctx.beginPath()
                            ctx.setLineWidth(1)
                            ctx.moveTo(50, 210)
                            ctx.lineTo(315, 210)
                            ctx.setStrokeStyle('#dcdcdc')
                            ctx.stroke()
                            //公司logo
                            ctx.drawImage(res[2].path, 50, 230, 35, 35);
                            //公司名称
                            ctx.setFontSize(18);
                            ctx.setFillStyle('#000');
                            ctx.fillText(positioninfo.company_name, 90, 255);
                        } else if (positioninfo.positionBrightTagList.length == 1) {
                            ctx.drawImage(res[1].path, 50, 187, 100, 35); //方形
                            ctx.setFontSize(18);
                            ctx.setFillStyle('#353535');
                            ctx.fillText(position.positionBrightTagList[0].bright, 60, 210);
                            //直线
                            ctx.beginPath()
                            ctx.setLineWidth(1)
                            ctx.moveTo(50, 240)
                            ctx.lineTo(315, 240)
                            ctx.setStrokeStyle('#dcdcdc')
                            ctx.stroke()
                            //公司logo
                            ctx.drawImage(res[2].path, 50, 248, 35, 35);
                            //公司名称
                            ctx.setFontSize(18);
                            ctx.setFillStyle('#000');
                            ctx.fillText(positioninfo.company_name, 90, 275);
                        } else if (positioninfo.positionBrightTagList.length >= 2) {
                            ctx.drawImage(res[1].path, 50, 187, 100, 35); //方形
                            ctx.setFontSize(18);
                            ctx.setFillStyle('#353535');
                            ctx.fillText(positioninfo.positionBrightTagList[0].bright, 60, 210);
                            ctx.drawImage(res[1].path, 170, 187, 100, 35); //方形
                            ctx.setFontSize(18);
                            ctx.setFillStyle('#353535');
                            ctx.fillText(positioninfo.positionBrightTagList[1].bright, 181, 210);
                            //直线
                            ctx.beginPath()
                            ctx.setLineWidth(1)
                            ctx.moveTo(50, 240)
                            ctx.lineTo(315, 240)
                            ctx.setStrokeStyle('#dcdcdc')
                            ctx.stroke()
                            //公司logo
                            ctx.drawImage(res[2].path, 50, 248, 35, 35);
                            //公司名称
                            ctx.setFontSize(18);
                            ctx.setFillStyle('#000');
                            ctx.fillText(positioninfo.company_name, 90, 275);
                        }
                        //长按了解职位详情
                        ctx.setFontSize(15);
                        ctx.setFillStyle('#000');
                        ctx.fillText('长按了解职位详情', 130, 600);
                        //我觉得这份工作很不错，去看看吧
                        ctx.setFontSize(18);
                        ctx.setFillStyle('#000');
                        ctx.fillText('我觉得这份工作很不错,去看看吧!', 80, 425);
                        // 画圆形小程序码
                        ctx.setStrokeStyle('#fff');//头像边框颜色
                        ctx.beginPath();
                        ctx.arc(190, 515, 50, 0, 2 * Math.PI);
                        ctx.clip();
                        ctx.drawImage(res[4].path, 140, 465, 100, 100);
                        ctx.restore();
                        // 结束
                        ctx.stroke();
                        ctx.draw();
                        wx.hideLoading();
                    })
                }
            })
        }else{
            that.setData({
                modalShow: true,
            })
            wx.hideLoading();
        }
    },
    //点击切换收藏状态
    clicksollect: function () {
        let that = this;
        console.log(that.data.positionId)
        // wx.showModal({
            // title: '提示',
            // showCancel: false,
            // content: '即将跳转到找工作小程序',
            // success: function (res) {
                // console.log(res)
                wx.navigateToMiniProgram({
                    appId: 'wx03dc8a63866ea187', // 要跳转的小程序的appid
                    path: 'pages/jobdetails/jobdetails?positionId=' + that.data.positionId, // 跳转的目标页面
                    envVersion: 'release',
                    success(res) {
                        // 打开成功 
                        console.log(res) 
                    },
                    fail:function(){

                    }
                })
            // }
        // })
    },
    //点击投递/申请简历
    submitresume: function () {
        let that = this;
        // wx.showModal({
        //     title: '提示',
        //     showCancel: false,
        //     content: '即将跳转到找工作小程序',
        //     success: function (res) {
                wx.navigateToMiniProgram({
                    appId: 'wx03dc8a63866ea187', // 要跳转的小程序的appid
                    path: 'pages/jobdetails/jobdetails?positionId=' + that.data.positionId, // 跳转的目标页面
                    envVersion: 'release',
                    success(res) {
                        // 打开成功 
                        console.log(res) 
                    },
                    fail: function () {

                    }
                })
            // }
        // })
    },
    //和他聊聊
    withhechat: function () {
        let that = this;
        // wx.showModal({
        //     title: '提示',
        //     showCancel: false,
        //     content: '即将跳转到找工作小程序',
        //     success: function (res) {
                wx.navigateToMiniProgram({
                    appId: 'wx03dc8a63866ea187', // 要跳转的小程序的appid
                    path: 'pages/jobdetails/jobdetails?positionId=' + that.data.positionId, // 跳转的目标页面
                    envVersion: 'release',
                    success(res) {
                        // 打开成功  
                    },
                    fail: function () {

                    }
                })
        //     }
        // })
    },
    //返回首页
    returnindex: function () {
        wx.switchTab({
            url: '/index'
        })
    },
    //点击获取公司位置
    viewlocation: function () {
        let that = this;
        let latitude = that.data.positioninfo.add_y;    //当前店铺位置纬度
        let longitude = that.data.positioninfo.add_x;    //当前店铺位置经度
        console.log(latitude);
        console.log(longitude);
        wx.openLocation({
            latitude: latitude,
            longitude: longitude
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
     * 用户分享朋友
     */
    onShareAppMessage: function (res) {
        let that = this;
        console.log(that.data.positionId)
        let positionId = that.data.positionId;
        return {
            title: '我觉得这个职位不错，快来围观吧',
            path: `/pages/jobdetails/jobdetails1?positionId=${positionId}`,
            success: function (res) {
                console.log(res)
                var shareTickets = res.shareTickets;
                if (shareTickets.length == 0) {
                    return false;
                }
                //可以获取群组信息
                wx.getShareInfo({
                    shareTicket: shareTickets[0],
                    success: function (res) {
                    }
                })
                that.setData({
                    friendShow: false
                })
            },
            fail: function (res) {
                wx.showToast({
                    title: '分享失败',
                    duration: 1000,
                    mask: true
                })
            }
        }
    },
    //分享按钮封装
    showOrHide: function () {
        if (this.data.isShow) {
            //缩回动画
            this.takeback();
            this.setData({
                isShow: false,
            })
        } else {
            //弹出动画
            this.popp();
            this.setData({
                isShow: true,
            })
        }
    },
    navtoappid:function(){
        let that = this;
        this.showOrHide()
        wx.switchTab({
            url: '../index/index'
        })
    },
    add: function () {
        let that = this;
        // this.triggerEvent("addEvent")
        this.showOrHide()
    },
    deleteLots: function () {
        // this.triggerEvent("deleteLotsEvent")
        this.showOrHide();
        let that = this;
        console.log(countnum)
        if (countnum == 0 || countnum == 1 || countnum == 2 || countnum == 3 || countnum == 4) {
            wx.showToast({
                title: '图片正在加载',
                icon: 'loading',
                duration: 1000
            })
            that.setData({
                hidden1: true,
                footbtn: true
            })
        } else {
            that.setData({
                footbtn: false,
                hidden1: false,
                footer: false
            })
            wx.showLoading({
                title: '努力生成中...',
                duration: 800
            })
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 375,
                height: 667,
                destWidth: 375 * 2,
                destHeight: 667 * 2,
                canvasId: 'shareImg',
                success: function (res) {
                    console.log(res);
                    that.setData({
                        prurl: res.tempFilePath,
                    })
                    wx.hideLoading()
                },
                fail: function (res) {
                    // console.log(res)
                }
            })
        }
    },
    // 点击保存到相册
    save: function () {
        let that = this;
        wx.getSetting({
            success: function (res) {
                console.log(res)
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            wx.saveImageToPhotosAlbum({
                                filePath: that.data.prurl,
                                success() {
                                    wx.showModal({
                                        content: '图片已保存到相册，赶紧晒一下吧~',
                                        showCancel: false,
                                        confirmText: '好哒',
                                        confirmColor: '#72B9C3',
                                        success: function (res) {
                                            if (res.confirm) {
                                                // console.log('用户点击确定');
                                                that.setData({
                                                    hidden1: true,
                                                    footer: true,
                                                    footbtn: true
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        },
                        fail() {
                            that.setData({
                                saveImgBtnHidden: true,
                                openSettingBtnHidden: false
                            })
                        }
                    })
                } else {
                    wx.saveImageToPhotosAlbum({
                        filePath: that.data.prurl,
                        success() {
                            wx.showModal({
                                content: '图片已保存到相册，赶紧晒一下吧~',
                                showCancel: false,
                                confirmText: '好哒',
                                confirmColor: '#72B9C3',
                                success: function (res) {
                                    if (res.confirm) {
                                        // console.log('用户点击确定');
                                        that.setData({
                                            hidden1: true,
                                            footer: true,
                                            footbtn: true
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    nosave: function () {
        let that = this;
        that.setData({
            hidden1: true,
            footer: true,
            footbtn: true
        })
    },
    //获取图片授权
    handleSetting: function (e) {
        let that = this;
        console.log(e)
        // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
        if (!e.detail.authSetting['scope.writePhotosAlbum']) {
            wx.showModal({
                title: '警告',
                content: '若不打开授权，则无法将图片保存在相册中！',
                showCancel: false
            })
            that.setData({
                saveImgBtnHidden: true,
                openSettingBtnHidden: false
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '您已授权，赶紧将图片保存在相册中吧！',
                showCancel: false
            })
            that.setData({
                saveImgBtnHidden: false,
                openSettingBtnHidden: true
            })
        }
    },
    //弹出动画
    popp: function () {
        //main按钮顺时针旋转
        var animmyrec = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var animationMain = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var animationDelLots = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var text1 = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var animationAdd = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var text2 = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        animationMain.rotateZ(180).step();
        animmyrec.translate(0, -340 / 750 * systemInfo.windowWidth).opacity(1).step();
        animationDelLots.translate(0, -220 / 750 * systemInfo.windowWidth).opacity(1).step();
        // text1.translate(0, -210 / 750 * systemInfo.windowWidth).opacity(1).step();
        animationAdd.translate(0, -100 / 750 * systemInfo.windowWidth).opacity(1).step();
        // text2.translate(0, -80 / 750 * systemInfo.windowWidth).opacity(1).step();
        this.setData({
            animmyrec: animmyrec.export(),
            animMain: animationMain.export(),
            animDelLots: animationDelLots.export(),
            animAdd: animationAdd.export(),
            text1: text1.export(),
            text2: text2.export(),
        })
    },
    //
    //收回动画
    takeback: function () {
        //main按钮逆时针旋转
        var animmyrec = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var animationMain = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var animationDelLots = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var animationAdd = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var text1 = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var text2 = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        animationMain.rotateZ(0).step();
        animmyrec.translate(0, 0).rotateZ(0).opacity(0).step();
        animationDelLots.translate(0, 0).rotateZ(0).opacity(0).step();
        animationAdd.translate(0, 0).rotateZ(0).opacity(0).step();
        text1.translate(0, 0).rotateZ(0).opacity(0).step();
        text2.translate(0, 0).rotateZ(0).opacity(0).step();
        this.setData({
            animmyrec: animmyrec.export(),
            animMain: animationMain.export(),
            animDelLots: animationDelLots.export(),
            animAdd: animationAdd.export(),
            text1: text1.export(),
            text2: text2.export(),
        })
    },
    /**
     * 获取用户信息
     */
    getUserDetails(e) {
        let that = this;
        console.log(e)
        let detail = e.detail;
        let userInfo = e.detail.userInfo;
        if (userInfo) {
            that.setData({
                modalShow: false,
            })
            wx.showLoading({
                title: '加载中',
            })
            wx.setStorageSync('detail', detail);
            wx.setStorageSync('userInfo', userInfo);
            that.getsessionkey();
        }
    },
    //进入小程序判断unionid系列操作
    getsessionkey: function () {
        let that = this;
        //首先登陆
        wx.login({
            success: function (res) {
                console.log(res)
                //拿到code发送给后端
                wx.request({
                    url: app.data.apiPath + '/user/setCode',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: {
                        code: res.code
                    },
                    success: function (res) {
                        console.log(JSON.parse(res.data))
                        let sessionId = JSON.parse(res.data).id;
                        let openId = JSON.parse(res.data).wxid;
                        wx.setStorageSync('sessionId', sessionId);
                        wx.setStorageSync('openId', openId);
                        that.saveWxInfo();
                    }
                })
            }
        })
    },
    //将获取到的微信信息保存到数据库并且拿到unionid
    saveWxInfo: function (e) {
        let that = this;
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        withCredentials: true,
                        lang: "zh_CN",
                        success: function (res) {
                            console.log(res)
                            var unionid = wx.getStorageSync('unionid');
                            var opid = wx.getStorageSync('opid');
                            var sessionId = wx.getStorageSync('sessionId');
                            var encryptedData = res.encryptedData;
                            var iv = res.iv;
                            wx.request({
                                url: app.data.apiPath + '/user/saveWxUser',
                                method: "POST",
                                header: {
                                    'content-type': 'application/json;charset=UTF-8'
                                    //'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                },
                                data: {
                                    nickname: res.userInfo.nickName,
                                    sex: res.userInfo.gender,
                                    country: res.userInfo.country,
                                    province: res.userInfo.province,
                                    city: res.userInfo.city,
                                    headimgurl: res.userInfo.avatarUrl,
                                    unionid: unionid,
                                    openid: opid,
                                    sessionId: sessionId,
                                    encryptedData: encryptedData,
                                    iv: iv,
                                },
                                success: function (res) {
                                    console.log(JSON.parse(res.data).unionid)
                                    var unionid = JSON.parse(res.data).unionid;
                                    wx.setStorageSync("unionid", unionid);
                                    ////加载内容
                                    wx.request({
                                        url: app.data.apiPath + '/position/sharePositionInfo',
                                        method: "POST",
                                        header: {
                                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                        },
                                        data: {
                                            positionId: that.data.positionId,
                                            unionid: unionid,
                                        },
                                        success: function (res) {
                                            console.log(res)
                                            let positioninfo = JSON.parse(res.data).data;
                                            console.log(positioninfo)
                                            positioninfo.relase_date = utils.formatTime(positioninfo.relase_date, 'M/D h:m').substring(5, 10).replace('\/', "月")
                                            console.log(positioninfo)
                                            that.setData({
                                                positioninfo,
                                                company_id: positioninfo.company_id
                                            })
                                            // 页面加载职位详情后加载canvas图片
                                            let promise1 = new Promise(function (resolve, reject) {
                                                // 先获取canvas背景图
                                                wx.getImageInfo({
                                                    src: app.data.canvas + '/template/canvas-bg.png',
                                                    success: function (res) {
                                                        console.log(res);
                                                        resolve(res);
                                                        countnum += 1;
                                                    },
                                                    fail: function (res) {
                                                        console.log(res)
                                                    }
                                                })
                                            });
                                            let promise2 = new Promise(function (resolve, reject) {
                                                // 获取矩形靓点背景
                                                wx.getImageInfo({
                                                    src: app.data.canvas + '/template/juxing.png',
                                                    success: function (res) {
                                                        console.log(res);
                                                        resolve(res);
                                                        countnum += 1;
                                                    },
                                                    fail: function (res) {
                                                        console.log(res)
                                                    }
                                                })
                                            });
                                            let promise3 = new Promise(function (resolve, reject) {
                                                // 获取公司logo
                                                wx.getImageInfo({
                                                    src: positioninfo.logo,
                                                    success: function (res) {
                                                        console.log(res);
                                                        resolve(res);
                                                        countnum += 1;
                                                    }
                                                })
                                            });
                                            let promise4 = new Promise(function (resolve, reject) {
                                                // 获取发布者头像
                                                wx.getImageInfo({
                                                    src: positioninfo.headimgurl,
                                                    success: function (res) {
                                                        console.log(res);
                                                        resolve(res);
                                                        countnum += 1;
                                                    }
                                                })
                                            });
                                            let promise5 = new Promise(function (resolve, reject) {
                                                // 获取小程序码
                                                wx.getImageInfo({
                                                    src: positioninfo.qrimg_url,
                                                    success: function (res) {
                                                        console.log(res);
                                                        resolve(res);
                                                        countnum += 1;
                                                    }
                                                })
                                            });
                                            Promise.all([
                                                promise1, promise2, promise3, promise4, promise5
                                            ]).then(res => {
                                                const ctx = wx.createCanvasContext('shareImg');
                                                ctx.save(); //开始绘制
                                                // ctx.setStrokeStyle('#fff');
                                                ctx.drawImage(res[0].path, 0, 0, 375, 667); //背景
                                                // 画圆形头像
                                                // ctx.setStrokeStyle('#fff');//头像边框颜色
                                                ctx.beginPath();
                                                ctx.arc(45, 420, 20, 0, 2 * Math.PI);
                                                ctx.clip();
                                                ctx.drawImage(res[3].path, 23, 400, 45, 45);
                                                ctx.restore();
                                                //职位名称
                                                ctx.setFontSize(22);
                                                ctx.setFillStyle('#000');
                                                ctx.fillText(positioninfo.position_name, 50, 130);
                                                //薪资待遇
                                                ctx.setFontSize(18);
                                                ctx.setFillStyle('#ff3333');
                                                ctx.fillText(positioninfo.treatment_min_show + '-' + positioninfo.treatment_max_show + '/' + '月', 50, 170);
                                                // 竖杠
                                                ctx.setFontSize(18);
                                                ctx.setFillStyle('#ccc');
                                                ctx.fillText('|', 150, 170);
                                                //城市
                                                ctx.setFontSize(18);
                                                ctx.setFillStyle('#353535');
                                                ctx.fillText(positioninfo.city.substring(0, 2), 165, 170);
                                                // 竖杠
                                                ctx.setFontSize(18);
                                                ctx.setFillStyle('#ccc');
                                                ctx.fillText('|', 210, 170);
                                                //学历
                                                ctx.setFontSize(18);
                                                ctx.setFillStyle('#353535');
                                                ctx.fillText(positioninfo.education_name, 220, 170);
                                                // 职位靓点 判断职位靓点的个数(0 1 2最多职能放下俩)
                                                if (positioninfo.positionBrightTagList.length == 0) {
                                                    //直线
                                                    ctx.beginPath()
                                                    ctx.setLineWidth(1)
                                                    ctx.moveTo(50, 210)
                                                    ctx.lineTo(315, 210)
                                                    ctx.setStrokeStyle('#dcdcdc')
                                                    ctx.stroke()
                                                    //公司logo
                                                    ctx.drawImage(res[2].path, 50, 230, 35, 35);
                                                    //公司名称
                                                    ctx.setFontSize(18);
                                                    ctx.setFillStyle('#000');
                                                    ctx.fillText(positioninfo.company_name, 90, 255);
                                                } else if (positioninfo.positionBrightTagList.length == 1) {
                                                    ctx.drawImage(res[1].path, 50, 187, 100, 35); //方形
                                                    ctx.setFontSize(18);
                                                    ctx.setFillStyle('#353535');
                                                    ctx.fillText(position.positionBrightTagList[0].bright, 60, 210);
                                                    //直线
                                                    ctx.beginPath()
                                                    ctx.setLineWidth(1)
                                                    ctx.moveTo(50, 240)
                                                    ctx.lineTo(315, 240)
                                                    ctx.setStrokeStyle('#dcdcdc')
                                                    ctx.stroke()
                                                    //公司logo
                                                    ctx.drawImage(res[2].path, 50, 248, 35, 35);
                                                    //公司名称
                                                    ctx.setFontSize(18);
                                                    ctx.setFillStyle('#000');
                                                    ctx.fillText(positioninfo.company_name, 90, 275);
                                                } else if (positioninfo.positionBrightTagList.length >= 2) {
                                                    ctx.drawImage(res[1].path, 50, 187, 100, 35); //方形
                                                    ctx.setFontSize(18);
                                                    ctx.setFillStyle('#353535');
                                                    ctx.fillText(positioninfo.positionBrightTagList[0].bright, 60, 210);
                                                    ctx.drawImage(res[1].path, 170, 187, 100, 35); //方形
                                                    ctx.setFontSize(18);
                                                    ctx.setFillStyle('#353535');
                                                    ctx.fillText(positioninfo.positionBrightTagList[1].bright, 181, 210);
                                                    //直线
                                                    ctx.beginPath()
                                                    ctx.setLineWidth(1)
                                                    ctx.moveTo(50, 240)
                                                    ctx.lineTo(315, 240)
                                                    ctx.setStrokeStyle('#dcdcdc')
                                                    ctx.stroke()
                                                    //公司logo
                                                    ctx.drawImage(res[2].path, 50, 248, 35, 35);
                                                    //公司名称
                                                    ctx.setFontSize(18);
                                                    ctx.setFillStyle('#000');
                                                    ctx.fillText(positioninfo.company_name, 90, 275);
                                                }
                                                //长按了解职位详情
                                                ctx.setFontSize(15);
                                                ctx.setFillStyle('#000');
                                                ctx.fillText('长按了解职位详情', 130, 600);
                                                //我觉得这份工作很不错，去看看吧
                                                ctx.setFontSize(18);
                                                ctx.setFillStyle('#000');
                                                ctx.fillText('我觉得这份工作很不错,去看看吧!', 80, 425);
                                                // 画圆形小程序码
                                                ctx.setStrokeStyle('#fff');//头像边框颜色
                                                ctx.beginPath();
                                                ctx.arc(190, 515, 50, 0, 2 * Math.PI);
                                                ctx.clip();
                                                ctx.drawImage(res[4].path, 140, 465, 100, 100);
                                                ctx.restore();
                                                // 结束
                                                ctx.stroke();
                                                ctx.draw();
                                                wx.hideLoading();
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    },
})