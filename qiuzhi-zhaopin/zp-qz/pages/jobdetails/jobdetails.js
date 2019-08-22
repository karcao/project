var countnum = 0;
const app = getApp();
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// let time1 = require('../../utils/util.js');
let qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        windowWidth: 0,
        windowHeight: 0,
        hidden:true,
        footer:true,
        saveImgBtnHidden:false,
        openSettingBtnHidden:true
    },
    //跳转到全网搜简历页面
    btnrelease: function () {
        console.log(this.data.position)
        wx.navigateTo({
            url: '../jianlilist/jianlilist?position= ' + JSON.stringify(this.data.position),
        })
        
    },
    //编辑
    edit:function(){
        let that = this;
        console.log(that.data.positionId)
        wx.navigateTo({
            url: '../neweditposition/neweditposition?positionId=' + that.data.positionId,
        })
    },
    //下线
    offline:function(){
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确定要关闭并下线此岗位吗',
            success(res) {
                if (res.confirm) {
                    //职位下线
                    wx.request({
                        url: app.data.apiPath + '/position/updatePositionState',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        data: {
                            positionId: that.data.positionId,
                            state: 2
                        },
                        success: function (res) {
                            wx.navigateBack({
                                delta:1
                            })
                        }
                    })
                } else if (res.cancel) {
                    return;
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let that = this;
        qqmapsdk = new QQMapWX({
            key: 'WPRBZ-EAN3U-WS2VM-2PTHS-BL2EF-ZMBWZ' //这里自己的key秘钥进行填充
        });
        //首先获取设备尺寸
        wx.getSystemInfo({
            success: function (res) {
                console.log(res);
                // 屏幕宽度、高度
                // 高度,宽度 单位为px
                that.setData({
                    windowWidth: res.windowWidth * 2,
                    windowHeight: res.windowHeight * 2
                })
            }
        })
        let positionId = options.positionId
        // let positionId = JSON.parse(options.positionId);
        that.setData({
            positionId
        })
        //查询职位详情
        wx.request({
            url: app.data.apiPath + '/position/queryPositionInfo',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                positionId: positionId,
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let position = JSON.parse(res.data).data;
                // 内容显示换行
                // let obj = position.duty;
                // let tips = "";
                // Object.keys(obj).forEach(function (index) {
                //     tips += obj[index] + '\n'
                // })
                // tips = tips.substring(0, tips.length - 1)
                // console.log(tips)
                // 内容显示换行
                that.setData({
                    position
                })
                console.log(position.duty)
                console.log(position.qrimg_url) //x小程序码
                console.log(position.headimgurl) //发布者头像
                console.log(position.logo) //公司logo
                // let scale = that.data.windowWidth / 375.0;
                // that.setData({ totalHeight: 667 * scale })
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
                        src: position.logo,
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
                        src: position.headimgurl,
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
                        src: position.qrimg_url,
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
                    ctx.fillText(position.position_name, 50, 130);
                    //薪资待遇
                    ctx.setFontSize(18);
                    ctx.setFillStyle('#ff3333');
                    ctx.fillText(position.treatment_min_show + '-' + position.treatment_max_show + '/' +'月', 50, 170);
                    // 竖杠
                    ctx.setFontSize(18);
                    ctx.setFillStyle('#ccc');
                    ctx.fillText('|', 150, 170);
                    //城市
                    ctx.setFontSize(18);
                    ctx.setFillStyle('#353535');
                    ctx.fillText(position.city.substring(0, 2), 165, 170);
                    // 竖杠
                    ctx.setFontSize(18);
                    ctx.setFillStyle('#ccc');
                    ctx.fillText('|', 210, 170);
                    //学历
                    ctx.setFontSize(18);
                    ctx.setFillStyle('#353535');
                    ctx.fillText(position.education_name, 220, 170);
                    // 职位靓点 判断职位靓点的个数(0 1 2最多职能放下俩)
                    if (position.positionBrightTagList.length == 0){
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
                        ctx.fillText(position.company_name, 90, 255);
                    } else if (position.positionBrightTagList.length == 1){
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
                        ctx.fillText(position.company_name, 90, 275);
                    } else if (position.positionBrightTagList.length >= 2){
                        ctx.drawImage(res[1].path, 50, 187, 100, 35); //方形
                        ctx.setFontSize(18);
                        ctx.setFillStyle('#353535');
                        ctx.fillText(position.positionBrightTagList[0].bright, 60, 210);
                        ctx.drawImage(res[1].path, 170, 187, 100, 35); //方形
                        ctx.setFontSize(18);
                        ctx.setFillStyle('#353535');
                        ctx.fillText(position.positionBrightTagList[1].bright, 181, 210);
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
                        ctx.fillText(position.company_name, 90, 275);
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
    },
    //查看公司详情
    navtocompany:function(){
        wx.navigateTo({
            url: '../viewcomfile/viewcomfile',
        })
    },
    // 点击生成截图
    generateCardEnv: function () {
        let that = this;
        // 获取小程序码
        // wx.getImageInfo({
        //     src: that.data.position.qrimg_url,
        //     success: function (res) {
        //         console.log(res);
        //         countnum += 1;
        //     }
        // })
        console.log(countnum)
        if (countnum < 5) {
            wx.showToast({
                title: '图片正在加载',
                icon: 'loading',
                duration: 1000
            })
            that.setData({
                hidden: true
            })
            
        } else {
            that.setData({
                hidden: false,
                footer:false
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
            success:function(res){
                console.log(res)
                if (!res.authSetting['scope.writePhotosAlbum']){
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success(){
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
                                                // 添加分享记录
                                                wx.request({
                                                    url: app.data.apiPath + '/share/add',
                                                    method: "POST",
                                                    header: {
                                                        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                                                    },
                                                    data: {
                                                        unionid:wx.getStorageSync("unionid"),
                                                        positionId: that.data.positionId,
                                                        shareType:1
                                                    },
                                                    success: function (res) {
                                                        console.log(res)
                                                    }
                                                })
                                                // 添加分享记录
                                                that.setData({
                                                    hidden: true,
                                                    footer: true
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        },
                        fail(){
                            that.setData({
                                saveImgBtnHidden: true,
                                openSettingBtnHidden: false
                            })
                        }
                    })
                }else{
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
                                        // 添加分享记录
                                        wx.request({
                                            url: app.data.apiPath + '/share/add',
                                            method: "POST",
                                            header: {
                                                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                                            },
                                            data: {
                                                unionid: wx.getStorageSync("unionid"),
                                                positionId: that.data.positionId,
                                                shareType: 1
                                            },
                                            success: function (res) {
                                                console.log(res)
                                            }
                                        })
                                        // 添加分享记录
                                        that.setData({
                                            hidden: true,
                                            footer: true
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
            hidden: true,
            footer:true
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
    //点击获取公司位置
    viewlocation: function () {
        let that = this;
        let latitude = that.data.position.add_y;    //当前店铺位置纬度
        let longitude = that.data.position.add_x;    //当前店铺位置经度
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
        let that = this;
        wx.request({
            url: app.data.apiPath + '/position/queryPositionInfo',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                positionId: that.data.positionId,
            },
            success:function(res){
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let position = JSON.parse(res.data).data;
                that.setData({
                    position
                })
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
        countnum = 0
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
    onShareAppMessage: function () {
        let that = this;
        console.log(that.data.positionId)
        let positionId = that.data.positionId;
        return {
            title: '伯乐已经在这里恭候多时了！作为千里马的你呢',
            path: `/pages/sharejob/sharejob?positionId=${positionId}`,
            imageUrl: '../../images/fengmian.jpg',
            success: function (res) {
                console.log(res)
                // 添加分享记录
                wx.request({
                    url: app.data.apiPath + '/share/add',
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    data: {
                        unionid: wx.getStorageSync("unionid"),
                        positionId: that.data.positionId,
                        shareType: 2
                    },
                    success: function (res) {
                        console.log(res)
                    }
                })
                // 添加分享记录
                
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
    }
})