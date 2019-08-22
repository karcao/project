const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        introcount: 0,//初始化电话号码字数
        introName: '',//初始化

        img_arr: [],
        imgs: [],
        imagesUrl:[]
    },
    //编辑公司简介
    intro:function(e){
        let that = this;
        var name = e.currentTarget.dataset.name;
        that.setData({
            [name]: e.detail.value.replace(/\s+/g, ''),
            introname: e.detail.value,
            introcount: e.detail.value.length
        });
        if (that.data.introcount >= 3000) {
            wx.showToast({
                title: '最多不能超过3000个字哦',
                duration: 2000,
                icon: 'none'
            })
            return;
        }
    },
    // 点击选择图片上传至页面
    chooseImg: function (e) {
        let that = this;
        let status = [];
        console.log(that.data.imagesUrl)
        for (let p = 0;p<that.data.imagesUrl.length;p++){
            if (that.data.imagesUrl[p].status == 0){
                status.push(that.data.imagesUrl[p])
                console.log(status.length)
                if (status.length == 3){
                    wx.showModal({
                        content: '最多上传三张图片哦',
                        showCancel: false,
                        confirmText: "知道了",
                        confirmColor: '#33cc99'
                    });
                    return;
                }
            }
        }
        if (that.data.imagesUrl.length >= 3) {
            for (let i = 0; i < that.data.imagesUrl.length; i++) {
                if (that.data.imagesUrl[i].status == 1) {
                    wx.chooseImage({
                        count: 3,
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            console.log(res.tempFilePaths)
                            wx.uploadFile({
                                url: app.data.apiPath + '/upload/img', //自己的接口地址
                                filePath: res.tempFilePaths[0],
                                name: 'file',
                                header: {
                                    "Content-Type": "multipart/form-data",
                                    'accept': 'application/json',
                                },
                                formData: ({ //上传图片所要携带的参数
                                    path: "report"
                                }),
                                success: function (res) {
                                    console.log(res)
                                    console.log(res.data.replace(/\"/g, ""))
                                    that.setData({
                                        imagesUrl: that.data.imagesUrl.concat({ "picUrl": res.data.replace(/\"/g, ""), "status": 0 }),
                                    })
                                    console.log(that.data.imagesUrl)
                                }
                            })
                            // that.setData({
                            //     imagesUrl: that.data.imagesUrl.concat({ "picUrl": res.tempFilePaths[0].replace(/\"/g, ""), "status": 0 }),
                            //     imgs: that.data.imgs.concat({ "picUrl": res.tempFilePaths.replace(/\"/g, "") ,"status":0})
                            // });
                            // console.log(that.data.imagesUrl)
                            // console.log(that.data.img_arr)
                        }
                    })
                    return;
                }
            }
        }
        if (that.data.imagesUrl.length < 3) {
            wx.chooseImage({
                count: 3,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    console.log(res.tempFilePaths)
                    wx.uploadFile({
                        url: app.data.apiPath + '/upload/img', //自己的接口地址
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        header: {
                            "Content-Type": "multipart/form-data",
                            'accept': 'application/json',
                        },
                        formData: ({ //上传图片所要携带的参数
                            path: "report"
                        }),
                        success: function (res) {
                            console.log(res)
                            console.log(res.data.replace(/\"/g, ""))
                            that.setData({
                                imagesUrl: that.data.imagesUrl.concat({ "picUrl": res.data.replace(/\"/g, ""), "status": 0 }),
                            })
                            console.log(that.data.imagesUrl)
                        }
                    })
                    // that.setData({
                    //     imagesUrl: that.data.imagesUrl.concat({ "picUrl": res.tempFilePaths[0].replace(/\"/g, ""), "status": 0 }),
                    //     imgs: that.data.imgs.concat({ "picUrl": res.tempFilePaths.replace(/\"/g, "") ,"status":0})
                    // });
                    // console.log(that.data.imagesUrl)
                    // console.log(that.data.img_arr)
                }
            })
        } else {
            wx.showModal({
                content: '最多上传三张图片哦',
                showCancel: false,
                confirmText: "知道了",
                confirmColor: '#33cc99'
            });
        }
        
    },
    //点击删除当前图片
    deleteimg: function (e) {
        let that = this;
        console.log(e)
        console.log(that.data.imagesUrl)
        // let imagesUrl = that.data.imagesUrl;
        let deleteid = e.currentTarget.dataset.index;
        wx.showModal({
            // title: '弹窗标题',
            content: '您确定要删除该图片吗',
            confirmText: "确定",
            confirmColor: '#33cc99',
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    if (that.data.imagesUrl[deleteid].compPicId){
                        console.log('有compPicId的情况下')
                        that.data.imagesUrl[deleteid].status = 1
                    }else{
                        console.log('没有id')
                        that.data.imagesUrl.splice(deleteid, 1)
                    }
                    that.setData({
                        imagesUrl:that.data.imagesUrl
                    })
                    console.log(that.data.imagesUrl)
                } else {
                }
            }
        });
    },
    //封装上传方法
    upload: function () {
        let that = this;
        let intro = that.data.introname;
        for (var i = 0; i < that.data.img_arr.length; i++) { //循环遍历图片 
            wx.uploadFile({
                url: app.data.apiPath + '/upload/img', //自己的接口地址
                filePath: that.data.img_arr[i],
                name: 'file',
                header: {
                    "Content-Type": "multipart/form-data",
                    'accept': 'application/json',
                },
                formData: ({ //上传图片所要携带的参数
                    path: "report"
                }),
                success: function (res) {
                    console.log(res)
                    console.log(res.data)
                    that.setData({
                        imgs: that.data.imgs.concat(res.data)
                    })
                    // that.data.imgs.concat(res.data)
                    console.log(that.data.imgs)
                    let imgs = that.data.imgs;
                    if (i == that.data.img_arr.length) {
                        wx.request({
                            url: app.data.apiPath + '/report/saveComplaintInfo',
                            method: "POST",
                            data: {
                                unionid: wx.getStorageSync('unionid'),
                                repType: 1,     //被举报类型(1人 2职位 3简历)
                                repContent: duty,   //举报内容
                                beRepId: 999,
                                imgs: imgs
                            },
                            success: function (res) {
                                // console.log(img_arr)
                                console.log(res)
                                // console.log(JSON.parse(res.data).data)
                                // let companyDetail = JSON.parse(res.data).data;
                                // that.setData({
                                //     companyDetail,
                                //     imagesUrl: companyDetail.companyPictureList
                                // })
                            }
                        })
                    }
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let that = this;
        that.setData({
            options: options
        })
        if (options.companyId){
            //查询公司信息接口
            wx.request({
                url: app.data.apiPath + '/userCenter/queryCompanyDetail',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    unionid: wx.getStorageSync('unionid'),
                },
                success: function (res) {
                    let companyDetail = JSON.parse(res.data).data;
                    console.log(companyDetail)
                    console.log(companyDetail.companyPictureList)
                    // let arr = [];
                    // for (let i = 0; i < companyDetail.companyPictureList.length;i++){
                    //     arr.push(companyDetail.companyPictureList[i].picUrl)
                    // }
                    if (companyDetail.introduction){
                        that.setData({
                            cominformation: options,
                            introname: companyDetail.introduction,//全部信息
                            introcount: companyDetail.introduction.length,
                            // img_arr: arr
                            imagesUrl: companyDetail.companyPictureList
                        })
                    }else{
                        console.log(companyDetail.introduction)
                        that.setData({
                            cominformation: options,
                            introname: "",//全部信息
                            introcount: 0,
                            // img_arr: arr
                            imagesUrl: companyDetail.companyPictureList
                        })
                    }
                }
            })
        }else{
            that.setData({
                cominformation: options
            })
            console.log(that.data.cominformation)
        }
    },
    //保存一切信息[{picUrl:awdwadadwad},{}]
    save:function(){
        let that = this;
        console.log(that.data.imagesUrl)
        console.log(that.data.cominformation)
        console.log(that.data.introname)
        //点击保存得话 必须填公司简介  可以不传图片
        if (that.data.introname == undefined || that.data.introname == ''){
            wx.showToast({
                title: '公司简介不能为空',
                duration: 2000,
                icon: 'none'
            })
            return;
        }
        console.log(that.data.introname)
        let cominformation = that.data.cominformation;
        if (cominformation.logo != ''){
            cominformation.logo = cominformation.logo.replace(/\"/g, "")
        }else{
            console.log(cominformation.logo)
        }
        that.setData({
            ['cominformation.introduction']: that.data.introname,
            // ['cominformation.picUrl']:that.data.imagesUrl
        })
        console.log(cominformation)
        console.log(that.data.imagesUrl)
        // 如果是带着公司id 进来走下
        if (that.data.options.companyId){
            console.log(that.data.imagesUrl)
            console.log(that.data.imagesUrl.length)
            if (that.data.imagesUrl.length != 0){
                wx.request({
                    url: app.data.apiPath + '/company/saveCompany',
                    method: "POST",
                    data: {
                        companyStr: cominformation,
                        companyPictureList: that.data.imagesUrl
                    },
                    header: {
                        'content-type': 'application/json; charset=UTF-8'
                    },
                    success: function (res) {
                        console.log(res)
                        if (JSON.parse(res.data).rstCode == "SUCCESS") {
                            wx.showToast({
                                title: '保存成功',
                                duration: 2000,
                                icon: 'success'
                            })
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }, 100)
                            return;
                        }
                    }
                })
            }else{
                wx.request({
                    url: app.data.apiPath + '/company/saveCompany',
                    method: "POST",
                    data: {
                        companyStr: cominformation
                    },
                    header: {
                        'content-type': 'application/json; charset=UTF-8'
                    },
                    success: function (res) {
                        console.log(res)
                        console.log(JSON.parse(res.data))
                        if (JSON.parse(res.data).rstCode == "SUCCESS") {
                            wx.showToast({
                                title: '保存成功',
                                duration: 2000,
                                icon: 'success'
                            })
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }, 100)
                            return;
                        }
                    }
                })
            }
        }
        //如果没有公司id 走下
        else{
            //可以不填图片如果没有图片直接走
            if (that.data.imagesUrl.length == 0){
                wx.request({
                    url: app.data.apiPath + '/company/saveCompany',
                    method: "POST",
                    data: {
                        companyStr: cominformation
                    },
                    header: {
                        'content-type': 'application/json; charset=UTF-8'
                    },
                    success: function (res) {
                        console.log(res)
                        console.log(JSON.parse(res.data))
                        if (JSON.parse(res.data).rstCode == "SUCCESS") {
                            wx.showToast({
                                title: '保存成功',
                                duration: 2000,
                                icon: 'success'
                            })
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }, 100)
                            return;
                        }
                    }
                })
            }
            //如果有图片走下
            else{
                wx.request({
                    url: app.data.apiPath + '/company/saveCompany',
                    method: "POST",
                    data: {
                        companyStr: cominformation,
                        companyPictureList: that.data.imagesUrl
                    },
                    header: {
                        'content-type': 'application/json; charset=UTF-8'
                    },
                    success: function (res) {
                        console.log(res)
                        if (JSON.parse(res.data).rstCode == "SUCCESS") {
                            wx.showToast({
                                title: '保存成功',
                                duration: 2000,
                                icon: 'success'
                            })
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }, 100)
                            return;
                        }
                    }
                })
            }
        }
    },
    //跳过，直接保存
    directsave:function(){
        let that = this;
        let cominformation = that.data.cominformation;
        console.log(cominformation)
        if (cominformation.logo == "null"){
            console.log(111)
        }else{
            cominformation.logo = cominformation.logo.replace(/\"/g, "")
        }
        console.log(cominformation)
        //获取性质/规模/行业接口
        wx.request({
            url: app.data.apiPath + '/company/saveCompany',
            method: "POST",
            data:{
               companyStr:cominformation
            },
            header: {
                'content-type': 'application/json; charset=UTF-8'
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data))
                if (JSON.parse(res.data).rstCode == "SUCCESS"){
                    wx.showToast({
                        title: '保存成功',
                        duration: 2000,
                        icon: 'success'
                    })
                    setTimeout(function(){
                        wx.navigateBack({
                            delta: 2
                        })
                    },100)
                    return;
                }
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