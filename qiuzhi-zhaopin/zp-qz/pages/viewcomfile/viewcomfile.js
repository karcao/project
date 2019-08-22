const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ellipsis: true,
        hidden: true,
        imagesUrl: [
            // '../../images/combanner1.png',
            // '../../images/combanner2.png',
        ],
    },
    // 显示全部文字
    ellipsis: function () {
        let value = !this.data.ellipsis;
        this.setData({
            ellipsis: value,
            hidden: false
        })
    },
    //编辑公司信息
    editcompanyinfor:function(){
        let that = this;
        if (!that.data.companyDetail.companyId){
            wx.navigateTo({
                url: '../editcompany/editcompany',
            })
        }else{
            wx.navigateTo({
                url: '../editcompany/editcompany?companyid=' + that.data.companyDetail.companyId,
            })
        }
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
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
                console.log(JSON.parse(res.data).data)
                let companyDetail = JSON.parse(res.data).data;
                console.log(companyDetail)
                if (companyDetail.companyId){
                    that.setData({
                        addphoto:true
                    })
                }
                that.setData({
                    companyDetail,
                    imagesUrl: companyDetail.companyPictureList
                })
            }
        })
    },
    //编辑///添加图片
    addphoto:function(){
        let that = this;
        wx.navigateTo({
            url: '../working/working?linkName=' + that.data.companyDetail.linkName + '&phone=' + that.data.companyDetail.phone + '&companyName=' + that.data.companyDetail.companyName + '&companyType=' + that.data.companyDetail.companyType + '&companyScale=' + that.data.companyDetail.companyScale + '&industry=' + that.data.companyDetail.industry + '&logo=' + that.data.companyDetail.logo + '&unionid=' + wx.getStorageSync('unionid') + '&companyId=' + that.data.companyDetail.companyId + '&address=' + that.data.companyDetail.address,
        })
    },
    //添加或修改营业执照
    license:function(){
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
                // that.setData({
                //     imglogo: tempFilePaths,
                // })
                wx.uploadFile({
                    url: app.data.apiPath + '/upload/img', //自己的接口地址
                    filePath: tempFilePaths[0],
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
                        // that.setData({
                        //     uploadlogo: res.data
                        // })
                        wx.request({
                            url: app.data.apiPath + '/company/saveCompanyLicense',
                            method: "POST",
                            header: {
                                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                            data: {
                                licenseUrl: res.data,
                                companyId: that.data.companyDetail.companyId
                            },
                            success: function (res) {
                                console.log(res)
                                console.log(res.data)
                                console.log(JSON.parse(res.data))
                                // let companyDetail = JSON.parse(res.data).data;
                                // console.log(companyDetail)
                                // if (companyDetail.companyId) {
                                //     that.setData({
                                //         addphoto: true
                                //     })
                                // }
                                // that.setData({
                                //     companyDetail,
                                //     imagesUrl: companyDetail.companyPictureList
                                // })
                            }
                        })
                    }
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
        this.onLoad()
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