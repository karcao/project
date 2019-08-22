const app = getApp();
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        modalShow1: false, //授权状态显示和隐藏
        address: "", // 地址信息
        callshow: false,//控制称谓遮罩弹窗
        callcount: 0,//初始化称谓字数
        callName: '',//初始化

        phoneshow: false,//控制电话号码遮罩弹窗
        phonecount: 0,//初始化电话号码字数
        // phoneName: '',//初始化

        comnameshow: false,//控制公司名称遮罩弹窗
        wordcount: 0,//初始化公司名称字数
        comName: '',//初始化

        src: "",
        m_latitude: null,
        m_longitude: null, // 地址信息
        date: "请选择",

    },
    //点击获取用户手机号
    hqphone:function(){
        let that = this;
        that.setData({
            modalShow1:true
        })
    },
    //获取地理位置
    onChangeAddress: function () {
        wx.navigateTo({
            url: "../composition/composition"
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.queryCompanyParamLIst()
        //判断是第一次加载还是从position页面返回
        //如果从position页面返回，会传递用户选择的地点
        //如果不是从position页面返回，而是第一次进入，则会自动定位用户的位置，显示用户的位置
        // console.log(options.address)
        // console.log(wx.getStorageSync('address'))
        // if(wx.getStorageSync(address))
        if (wx.getStorageSync('comaddress')) {
            //设置变量 address 的值
            that.setData({
                address: wx.getStorageSync('comaddress')
            });
        } else {
            qqmapsdk = new QQMapWX({
                key: 'WPRBZ-EAN3U-WS2VM-2PTHS-BL2EF-ZMBWZ' //这里自己的key秘钥进行填充
            });
            qqmapsdk.reverseGeocoder({
                // 这里没有写location选项，是因为默认就是当前位置
                success: function (res) {
                    console.log(res)
                    // 获取默认下的地址
                    that.setData({
                        address: ''
                    });
                },
                fail: function (res) {
                    //console.log(res);
                    // that.onLoad()
                },
                complete: function (res) {
                    //console.log(res);
                }
            });
        }
        //判断用户手机号是否存在数据库
        wx.request({
            url: app.data.apiPath + '/user/getWxUserInfo',
            method: "GET",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                unionid: wx.getStorageSync('unionid')
            },
            success: function (res) {
                console.log(JSON.parse(res.data).data.tel)
                if (JSON.parse(res.data).data.tel) {
                    wx.setStorageSync('phone', JSON.parse(res.data).data.tel)
                    that.setData({
                        userphone: false,
                        phoneName: JSON.parse(res.data).data.tel
                    })
                } else {
                    that.setData({
                        userphone: true
                    })
                }
            }
        })
        //上个页面带过来的参数
        console.log(options)
        that.setData({
            options: options,
            phoneName:wx.getStorageSync('phone')
        })
        setTimeout(function(){
            if (options.companyid == undefined || options.companyid == '') {
                console.log(111)
                // return;
            } else {
                var companyid = JSON.parse(options.companyid)
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
                        // console.log(JSON.parse(res.data).data)
                        let companyDetail = JSON.parse(res.data).data;
                        console.log(companyDetail)
                        console.log(that.data.companyTypeList)
                        console.log(that.data.companyScaleList)
                        console.log(that.data.industryList)
                        //如果之前保存过的话不用填直接赋值
                        if (companyDetail) {
                            //赋值性质
                            for (let i = 0; i < that.data.companyTypeList.length; i++) {
                                if (companyDetail.companyTypeName == that.data.companyTypeList[i].companyTypeName) {
                                    that.setData({
                                        companyTypeindex: i
                                    })
                                }
                            }
                            //赋值规模
                            for (let o = 0; o < that.data.companyScaleList.length; o++) {
                                if (companyDetail.companyScaleName == that.data.companyScaleList[o].companyScaleName) {
                                    that.setData({
                                        companyScaleIndex: o
                                    })
                                }
                            }
                            //赋值行业
                            for (let p = 0; p < that.data.industryList.length; p++) {
                                if (companyDetail.industryName == that.data.industryList[p].industryName) {
                                    that.setData({
                                        industryIndex: p
                                    })
                                }
                            }
                            that.setData({
                                companyDetail: companyDetail,//全部信息
                                callName: companyDetail.linkName,//联系人称谓
                                address: companyDetail.address,//联系人电话
                                comName: companyDetail.companyName,//联系人电话
                                companyTypeName: companyDetail.companyTypeName,//公司性质
                                imglogo: companyDetail.logo,//公司logo
                                // imagesUrl: companyDetail.companyPictureList
                            })
                        } else {

                        }
                    }
                })
            }
        },500)
    },
    queryCompanyParamLIst:function(){
        let that = this;
        //获取性质/规模/行业接口
        wx.request({
            url: app.data.apiPath + '/dicJob/queryCompanyParamLIst',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (res) {
                console.log(res)
                console.log(JSON.parse(res.data).data)
                let allarr = JSON.parse(res.data).data;
                that.setData({
                    companyTypeList: allarr.companyTypeList,//性质
                    companyScaleList: allarr.companyScaleList,//规模
                    industryList: allarr.industryList//行业
                })
            }
        })
    },
    //性质
    bindcompanyTypeChange: function(e) {
        let that = this;
        console.log(e)
        // //拿着下标改变值
        that.setData({
            companyTypeindex: e.detail.value
        })
        // //把值提取方便发布时获取
        that.setData({
            companyTypeId: that.data.companyTypeList[that.data.companyTypeindex].companyTypeId
        })
    },
    //规模
    bindcompanyScaleChange: function(e) {
        let that = this;
        //拿着下标改变值
        that.setData({
            companyScaleIndex: e.detail.value
        })
        //把值提取方便发布时获取
        that.setData({
            companyScaleId: that.data.companyScaleList[that.data.companyScaleIndex].companyScaleId
        })
    },
    //行业
    bindindustryChange: function (e) {
        let that = this;
        //拿着下标改变值
        that.setData({
            industryIndex: e.detail.value
        })
        //把值提取方便发布时获取
        that.setData({
            industryNo: that.data.industryList[that.data.industryIndex].industryNo
        })
    },
    //跳转下一步判断
    formSubmit: function(e) {
        let that = this;
        console.log(e)
        app.collectFromidForWx(e.detail.formId);
        console.log(that.data.options.companyid);
        if (that.data.options.companyid == undefined || that.data.options.companyid == ''){
            console.log(that.data.imglogo)
            //1.称谓
            if (that.data.callName == '' || that.data.callName == undefined) {
                wx.showToast({
                    title: '称谓不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //2.电话号码
            if (that.data.phoneName == '' || that.data.phoneName == undefined) {
                wx.showToast({
                    title: '请点击获取电话号码',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //3.公司名称
            if (that.data.comName == '' || that.data.comName == undefined) {
                wx.showToast({
                    title: '公司名称不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //4.性质
            if (that.data.companyTypeindex == undefined || that.data.companyTypeindex == '') {
                wx.showToast({
                    title: '请选择贵公司性质',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //5.规模
            if (that.data.companyScaleIndex == undefined || that.data.companyScaleIndex == '') {
                wx.showToast({
                    title: '请选择贵公司规模',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //6.行业
            if (that.data.industryIndex == undefined || that.data.industryIndex == '') {
                wx.showToast({
                    title: '请选择贵公司行业',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //7.地址
            if (that.data.address == undefined || that.data.address == '' || that.data.address == '请选择') {
                wx.showToast({
                    title: '地址不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //7.logo
            // if (that.data.imglogo == undefined || that.data.imglogo == '') {
            //     wx.showToast({
            //         title: '请选择公司logo',
            //         duration: 2000,
            //         icon: 'none'
            //     })
            //     return;
            // }
            let uploadlogo = '';
            if (!that.data.imglogo){
                uploadlogo = ''
            }else{
                uploadlogo = that.data.uploadlogo
            }
            console.log(uploadlogo)
            console.log(that.data.address)
            wx.navigateTo({
                url: '../working/working?linkName=' + that.data.callName + '&phone=' + that.data.phoneName + '&companyName=' + that.data.comName + '&companyType=' + that.data.companyTypeId + '&companyScale=' + that.data.companyScaleId + '&industry=' + that.data.industryNo + '&logo=' + uploadlogo + '&unionid=' + wx.getStorageSync('unionid') + '&address=' + that.data.address,
            })
        }else{
            console.log(that.data.companyDetail)
            console.log(that.data.callName)
            console.log(that.data.phoneName)
            console.log(that.data.comName)
            console.log(that.data.address)
            //性质判断
            let companyTypeId = '';
            if (that.data.companyTypeId == undefined || that.data.companyTypeId == '' ){
                companyTypeId = that.data.companyDetail.companyType
            }else{
                companyTypeId = that.data.companyTypeId
            }
            console.log(companyTypeId)
            //规模判断
            let companyScaleId = '';
            if (that.data.companyScaleId == undefined || that.data.companyScaleId == '') {
                companyScaleId = that.data.companyDetail.companyScale
            } else {
                companyScaleId = that.data.companyScaleId
            }
            console.log(companyScaleId)
            //规模行业
            let industryNo = '';
            if (that.data.industryNo == undefined || that.data.industryNo == '') {
                industryNo = that.data.companyDetail.industry
            } else {
                industryNo = that.data.industryNo
            }
            //图片判断
            let uploadlogo = '';
            if (that.data.uploadlogo == undefined || that.data.uploadlogo ==''){
                uploadlogo = that.data.companyDetail.logo
            }else{
                uploadlogo = that.data.uploadlogo
            }
            //地址判断
            let address = '';
            if (that.data.address == undefined || that.data.address == '' || that.data.address == '请选择'){
                address = that.data.companyDetail.address
            }else{
                address = that.data.address
            }
            console.log(uploadlogo)
            console.log(address)
            wx.navigateTo({
                url: '../working/working?linkName=' + that.data.callName + '&phone=' + that.data.phoneName + '&companyName=' + that.data.comName + '&companyType=' + companyTypeId + '&companyScale=' + companyScaleId + '&industry=' + industryNo + '&logo=' + uploadlogo + '&unionid=' + wx.getStorageSync('unionid') + '&companyId=' + that.data.options.companyid + '&address=' + address,
            })
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
    onShow: function(options) {
        let that = this;
        console.log(wx.getStorageSync('comaddress'))
        if (wx.getStorageSync('comaddress')) {
            that.setData({
                address: wx.getStorageSync('comaddress')
            })
        } else {
            that.setData({
                address: "请选择"
            })
        }
    },
    // 获取用户手机号码
    getPhoneNumber: function (e) {
        console.log(e)
        let that = this;
        // 用户拒绝时
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
            console.log(e)
            that.getPhoneNumber();
        }
        // 用户同意时
        else if (e.detail.errMsg == 'getPhoneNumber:ok') {
            console.log(e)
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '同意授权',
                success: function (res) {
                    // 用户同意获取手机号码
                    wx.request({
                        url: app.data.apiPath + '/user/saveWxPhone',
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            unionid: wx.getStorageSync('unionid'),
                            sessionid: wx.getStorageSync('sessionId'),
                            iv: e.detail.iv,
                            encryptedData: e.detail.encryptedData
                        },
                        success: function (res) {
                            //让手机弹窗消失
                            let phone = JSON.parse(res.data).data;
                            wx.setStorageSync('phone', phone)
                            that.setData({
                                modalShow1: false,
                                userphone: false,
                                phoneName: phone
                            })
                        },
                    })
                }
            })
        }
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
    // onShareAppMessage: function() {

    // },
    //编辑称谓
    clickcall: function () {
        let that = this;
        that.setData({
            callshow: true
        })
    },
    // 称谓
    callname: function (e) {
        let that = this;
        var name = e.currentTarget.dataset.name;
        that.setData({
            [name]: e.detail.value.replace(/\s+/g, ''),
            callname: e.detail.value,
            callcount: e.detail.value.length
        });
        if (that.data.callcount >= 20) {
            wx.showToast({
                title: '最多不能超过20个字哦',
                duration: 2000,
                icon: 'none'
            })
            return;
        }
    },
    //关闭称谓弹窗
    closecallname: function (e) {
        let that = this;
        that.setData({
            callshow: false
        })
    },
    //保存称谓
    savecallname: function (e) {
        let that = this;
        if (that.data.callname == undefined || that.data.callname == '') {
            wx.showToast({
                title: '请输入称谓',
                duration: 2000,
                icon: 'none'
            })
            return;
        } else {
            that.setData({
                callshow: false,
                callName: that.data.callname
            })
        }
    },
    //编辑公司名称
    editcomname: function () {
        let that = this;
        that.setData({
            comnameshow: true
        })
    },
    // 公司名称
    companyname: function (e) {
        let that = this;
        var name = e.currentTarget.dataset.name;
        that.setData({
            [name]: e.detail.value.replace(/\s+/g, ''),
            companyname: e.detail.value,
            wordcount: e.detail.value.length
        });
        if (that.data.wordcount >= 40) {
            wx.showToast({
                title: '最多不能超过40个字哦',
                duration: 2000,
                icon: 'none'
            })
            return;
        }
    },
    //关闭公司名称弹窗
    closecomname: function (e) {
        let that = this;
        that.setData({
            comnameshow: false
        })
    },
    //保存公司名称
    savecomname: function (e) {
        let that = this;
        console.log(that.data.companyname)
        if (that.data.companyname == undefined || that.data.companyname == '') {
            wx.showToast({
                title: '请输入公司名称',
                duration: 2000,
                icon: 'none'
            })
            return;
        } else {
            that.setData({
                comnameshow: false,
                comName: that.data.companyname
            })
        }
    },
    // 点击选择图片上传至页面
    chooseImg: function (e) {
        let that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                console.log(res)
                let tempFilePaths = res.tempFilePaths;
                let files = res.tempFiles;
                that.setData({
                    imglogo: tempFilePaths,
                })
                wx.uploadFile({
                    url: app.data.apiPath + '/upload/img', //自己的接口地址
                    filePath: that.data.imglogo[0],
                    name: 'file',
                    header: {
                        "Content-Type": "multipart/form-data",
                        'accept': 'application/json',
                    },
                    formData: ({ //上传图片所要携带的参数
                        path: "logo"
                    }),
                    success: function (res) {
                        console.log(res)
                        console.log(res.data)
                        that.setData({
                            uploadlogo: res.data
                        })
                    }
                })
            }
        })
    },
})