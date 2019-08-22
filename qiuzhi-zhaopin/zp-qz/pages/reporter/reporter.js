const app = getApp();
// var util = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        img_arr: [],
        imgs:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    // 点击选择图片上传至页面
    chooseImg: function(e) {
        let that = this;
        if (that.data.img_arr.length < 4) {
            wx.chooseImage({
                count:4,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    // console.log(res)
                    that.setData({
                        img_arr: that.data.img_arr.concat(res.tempFilePaths)
                    });
                    console.log(that.data.img_arr)
                }
            })
        } else {
            wx.showModal({
                content: '最多上传四张图片哦',
                showCancel: false,
                confirmText: "知道了",
                confirmColor: '#33cc99'
            });
        }
    },
    //点击删除当前图片
    deleteimg:function(e){
        let that = this;
        console.log(e)
        let img_arr = that.data.img_arr;
        let deleteid = e.currentTarget.dataset.index;
        wx.showModal({
            // title: '弹窗标题',
            content: '您确定要删除该图片吗',
            confirmText: "确定",
            confirmColor: '#33cc99',
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    img_arr.splice(deleteid, 1)
                    that.setData({
                        img_arr
                    })
                    console.log(that.data.img_arr)
                } else {
                }
            }
        });
    },
    //获取评价内容
    dutyChange: function(e) {
        var name = e.currentTarget.dataset.name;
        this.setData({
            [name]: e.detail.value.replace(/\s+/g, ''),
            dutyInput: e.detail.value
        })
    },
    //封装上传方法
    upload: function() {
        let that = this;
        let duty = that.data.dutyInput;
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
                success: function(res) {
                    console.log(res.data)
                    that.setData({
                        imgs: that.data.imgs.concat(res.data)
                    })
                    // that.data.imgs.concat(res.data)
                    console.log(that.data.imgs)
                    let imgs = that.data.imgs;
                    if (i == that.data.img_arr.length){
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
    // 举报
    reporter: function() { //这里触发图片上传的方法
        let that = this;
        let duty = that.data.dutyInput;
        console.log(duty)
        if(duty == "" || duty == undefined){
            wx.showModal({
                content: '请填写举报内容',
                showCancel: false,
                confirmText: "知道了",
                confirmColor: '#33cc99'
            });
            return;
        }
        console.log(that.data.img_arr)
        if (that.data.img_arr == ''){
            wx.request({
                url: app.data.apiPath + '/report/saveComplaintInfo',
                method: "POST",
                data: {
                    unionid: wx.getStorageSync('unionid'),
                    repType: 1,     //被举报类型(1人 2职位 3简历)
                    repContent: duty,   //举报内容
                    beRepId: 999,
                    imgs: that.data.img_arr
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
            return;
        }else{
            that.upload();
        }
        // if(duty == "" || duty == undefined){
        //     
        // }
        
        
        // var pics = this.data.pics;
        // util.uploadimg({
        //     url: app.data.apiPath + '/report/saveComplaintInfo', //这里是你图片上传的接口
        //     path: pics //这里是选取的图片的地址数组
        // });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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
    onShareAppMessage: function() {

    }
})