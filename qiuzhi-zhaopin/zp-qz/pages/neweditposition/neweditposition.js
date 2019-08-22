const app = getApp();
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        disabled: false,
        comnameshow: false, //控制公司名称遮罩弹窗
        wordcount: 0, //初始化名称字数
        comName: '', //初始化
        textcount: 0, //初始化职责字数
        textcount1: 0, //初始化要求字数
        address: "", // 地址信息
        src: "",
        m_latitude: null,
        m_longitude: null, // 地址信息
        date: "请选择",
        // address:'请选择',
        educationIndex: "",
        // queryPositionIndex:[""],
        queryPositionIndex: [0, 0],
        // 工作年限
        workLife: ['不限', '1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年', '11年', '12年', '13年', '14年', '15年'],
        workLifeArray: [{
            id: 0,
            name: '1'
        },
        {
            id: 1,
            name: '应届生'
        },
        {
            id: 2,
            name: '2'
        },
        {
            id: 3,
            name: '3'
        },
        {
            id: 4,
            name: '5'
        },
        {
            id: 5,
            name: '8'
        },
        {
            id: 6,
            name: '10'
        },
        {
            id: 7,
            name: '15'
        },
        {
            id: 8,
            name: '20'
        },
        {
            id: 9,
            name: '30'
        },
        {
            id: 10,
            name: '经验不限'
        },
        ],
        // workLifeIndex:"2年",
        //薪酬多级联动
        multiArray: [
            // ['月薪制', '年薪制', '薪资面议'],
            ['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '12k', '15k', '20k', '25k', '30k'],
            ['3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '12k', '15k', '20k', '25k', '30k', '50k']
        ],
        multiIndex: [''],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.setData({
            options: options
        })
        // 获取学历
        wx.request({
            url: app.data.apiPath + '/dicJob/queryEducation',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (res) {
                console.log(JSON.parse(res.data).data);
                let eduarr = JSON.parse(res.data).data;
                // 赋值给educationArray
                that.setData({
                    educationArray: eduarr
                })
            }
        })
        //开始延迟渲染
        setTimeout(function () {
            if (options.positionId == undefined || options.positionId == '') {
                console.log('从新发布')
                that.setData({
                    qingxuanze1: true,
                    qingxuanze2: true,
                    qingxuanze3: true,
                })
                return;
            } else {
                var positionId = JSON.parse(options.positionId)
                //拿着id查询职位详情
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
                        //判断每项内容
                        // console.log(position.position_class)
                        // console.log(that.data.functionArray)
                        //职能
                        // for (let i = 0; i < that.data.functionArray.length;i++){
                        //     if (position.position_class == that.data.functionArray[i].positionNo){
                        //         that.setData({
                        //             queryPositionIndex: i
                        //         })
                        //     }
                        // }
                        //待遇
                        for (let u = 0; u < that.data.multiArray[0].length; u++) {
                            if (position.treatment_min_show == that.data.multiArray[0][u] || position.treatment_max_show == that.data.multiArray[1][u]) {
                                // console.log(1111)
                                console.log([u, u])
                                that.setData({
                                    multiIndex: [u, u]
                                })
                            }
                        }
                        //学历
                        for (let j = 0; j < that.data.educationArray.length; j++) {
                            if (position.education == that.data.educationArray[j].educationId) {
                                that.setData({
                                    educationIndex: j
                                })
                            }
                        }
                        console.log(position.positionBrightTagList)
                        that.setData({
                            position: position,
                            comName: position.position_name, //名称
                            // selected: position.positionName, //职能
                            workLifeIndex: position.working_life, //经验
                            address: position.address, //地点
                            word: position.duty, //职责
                            textcount: position.duty.length,
                            hidden1: true,
                            // textcount1: position.position_require.length,
                            defectarr: position.positionBrightTagList,
                            qingxuanze4: false,
                            qingxuanze5: false,
                        })
                    }
                })
            }
        }, 300)
    },
    // 招聘名称
    companyname: function (e) {
        let that = this;
        that.setData({
            comName: e.detail.value
        });
    },
    //经验
    bindWorkingLifeChange: function (e) {
        let that = this;
        console.log(e.detail.value)
        //拿着下标改变值
        that.setData({
            qingxuanze1:false,
            workLifeIndex: e.detail.value
        })
        //把值提取方便发布时获取
        that.setData({
            hqworklife: that.data.workLife[that.data.workLifeIndex]
        })
    },
    //学历
    bindEducationChange: function (e) {
        let that = this;
        // //拿着下标改变值
        that.setData({
            qingxuanze2: false,
            educationIndex: e.detail.value
        })
        // //把值提取方便发布时获取
        that.setData({
            hqeducation: that.data.educationArray[that.data.educationIndex].educationId
        })
    },
    //待遇
    bindMultiPickerChange: function (e) {
        let that = this;
        that.setData({
            hidden: false,
            hidden1: true,
            qingxuanze3: false,
        })
        that.setData({
            multiIndex: e.detail.value
        })

    },
    bindMultiPickerColumnChange: function (e) {
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        console.log(data.multiIndex[e.detail.column])
        data.multiIndex[e.detail.column] = e.detail.value;
        switch (e.detail.column) {
            case 0:
                switch (data.multiIndex[0]) {
                    // case 0:
                    //     data.multiArray[1] = ['3k', '4k', '5k', '6k', '7k', '8k', '9k', '1k0', '12k', '15k', '2k0', '25k', '3k0', '5k0'];
                    //     break;
                    case 1:
                        data.multiArray[1] = ['3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '12k', '15k', '20k', '25k', '30k', '50k'];
                        break;
                    case 2:
                        data.multiArray[1] = ['4k', '5k', '6k', '7k', '8k', '9k', '10k', '12k', '15k', '20k', '25k', '30k', '50k'];
                        break;
                    case 3:
                        data.multiArray[1] = ['5k', '6k', '7k', '8k', '9k', '10k', '12k', '15k', '20k', '25k', '30k', '50k'];
                        break;
                    case 4:
                        data.multiArray[1] = ['6k', '7k', '8k', '9k', '10k', '12k', '15k', '20k', '25k', '30k', '50k'];
                        break;
                    case 5:
                        data.multiArray[1] = ['7k', '8k', '9k', '10k', '12k', '15k', '20k', '25k', '30k', '50k'];
                        break;
                    case 6:
                        data.multiArray[1] = ['8k', '9k', '10k', '12k', '15k', '20k', '25k', '30k', '50k'];
                        break;
                    case 7:
                        data.multiArray[1] = ['9k', '10k', '12k', '15k', '20k', '25k', '30k', '50k'];
                        break;
                    case 8:
                        data.multiArray[1] = ['10k', '12k', '15k', '20k', '25k', '30k', '50k'];
                        break;
                    case 9:
                        data.multiArray[1] = ['12k', '15k', '20k', '25k', '30k', '50k'];
                        break;
                    case 10:
                        data.multiArray[1] = ['15k', '20k', '25k', '30k', '50k'];
                        break;
                    case 11:
                        data.multiArray[1] = ['20k', '25k', '30k', '50k'];
                        break;
                    case 12:
                        data.multiArray[1] = ['25k', '30k', '50k'];
                        break;
                    case 13:
                        data.multiArray[1] = ['30k', '50k'];
                        break;
                    case 14:
                        data.multiArray[1] = ['50k'];
                        break;
                }
                break;
        }

        this.setData(data);
    },
    //编辑职位描述
    bindTextwork: function (e) {
        let that = this;
        that.setData({
            word: e.detail.value,
            textcount: e.detail.value.length
        })
        if (that.data.textcount >= 3000) {
            wx.showToast({
                title: '最多不能超过3000个字哦',
                duration: 2000,
                icon: 'none'
            })
            return;
        }
    },
    //职位靓点
    navtopostdefect: function (e) {
        wx.navigateTo({
            url: '../postlist/postlist',
        })
    },
    //获取地理位置
    onChangeAddress: function () {
        wx.navigateTo({
            url: "../position/position"
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        let that = this;
        console.log(wx.getStorageSync('address'))
        if (wx.getStorageSync('address')) {
            that.setData({
                address: wx.getStorageSync('address'),
                qingxuanze5: false
            })
        } else {
            that.setData({
                qingxuanze5: true
            })
        }
        if (wx.getStorageSync('defectarr')) {
            that.setData({
                defectarr: wx.getStorageSync('defectarr'),
                qingxuanze4: false
            })
        } else { 
            that.setData({
                qingxuanze4: true
            })
        }
    },
    //发布
    formSubmit: function (e) {
        let that = this;
        console.log(e)
        app.collectFromidForWx(e.detail.formId);
        console.log(that.data.options.positionId)
        if (that.data.options.positionId == undefined || that.data.options.positionId == "") {
            console.log(that.data.comName); //职位名称
            // console.log(that.data.selected) //职能名称
            // console.log(that.data.hqqueryPosition)//职能id
            console.log(that.data.hqeducation); //学历id
            console.log(that.data.workLifeIndex); //年限/经验
            console.log(that.data.address); //地址
            console.log(that.data.word); //职责
            // console.log(that.data.word1); //要求
            console.log(that.data.defectarr); //职位靓点
            //1.职位名称
            if (that.data.comName == '' || that.data.comName == undefined) {
                wx.showToast({
                    title: '职位名称不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //2.职能id
            // if (that.data.hqqueryPosition == '' || that.data.hqqueryPosition == undefined) {
            //     wx.showToast({
            //         title: '职能不能为空',
            //         duration: 2000,
            //         icon: 'none'
            //     })
            //     return;
            // }
            //5.经验
            if (that.data.workLifeIndex == undefined || that.data.workLifeIndex == '') {
                wx.showToast({
                    title: '经验不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //4.学历
            if (that.data.hqeducation == undefined || that.data.hqeducation == '') {
                wx.showToast({
                    title: '学历不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //3.薪资
            if (that.data.multiArray[0][that.data.multiIndex[0]] == '' || that.data.multiArray[0][that.data.multiIndex[0]] == undefined) {
                wx.showToast({
                    title: '待遇不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            let treatmentMinShow = that.data.multiArray[0][that.data.multiIndex[0]];
            let treatmentMin = treatmentMinShow.replace(/[\k]+/g, '000')
            let treatmentMaxShow = that.data.multiArray[1][that.data.multiIndex[1]];
            let treatmentMax = treatmentMaxShow.replace(/[\k]+/g, '000')
            console.log(treatmentMinShow) //最小薪资
            console.log(treatmentMin) //最小薪资
            console.log(treatmentMaxShow) //最大薪资
            console.log(treatmentMax) //最大薪资
            console.log(that.data.defectarr)
            //7.工作描述
            if (that.data.word == undefined || that.data.word == '') {
                wx.showToast({
                    title: '工作描述不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //6.地址
            if (that.data.address == undefined || that.data.address == '' || that.data.address == '请选择') {
                wx.showToast({
                    title: '地址不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            
            let newarr = [];
            if (that.data.defectarr == undefined || that.data.defectarr == '') {
                console.log(newarr)
            } else {
                for (let i = 0; i < that.data.defectarr.length; i++) {
                    newarr.push(that.data.defectarr[i].id)
                }
                console.log(newarr)
            }
            console.log(newarr)
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                disabled: true
            })
            //发布
            wx.request({
                url: app.data.apiPath + '/position/saveOrUpdatePositionInfo',
                method: "POST",
                header: {
                    'content-type': 'application/json; charset=UTF-8'
                },
                data: {
                    positionInfo: {
                        positionInfo: {
                            unionid: wx.getStorageSync('unionid'),
                            positionName: that.data.comName,
                            // positionClass: that.data.hqqueryPosition,
                            treatmentMin: treatmentMin,
                            treatmentMinShow: treatmentMinShow,
                            treatmentMax: treatmentMax,
                            treatmentMaxShow: treatmentMaxShow,
                            education: that.data.hqeducation,
                            workingLife: that.data.workLifeIndex,
                            address: that.data.address,
                            duty: that.data.word,
                            city: wx.getStorageSync('city'),
                            addX: wx.getStorageSync('longitude'),
                            addY: wx.getStorageSync('latitude'),
                        },
                        brightTags: newarr
                    },
                },
                success: function (res) {
                    console.log(res)
                    console.log(JSON.parse(res.data))
                    if (JSON.parse(res.data).rstCode == "SUCCESS") {
                        wx.hideLoading()
                        console.log("发布成功")
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            duration: 2000
                        })
                        setTimeout(function () {
                            that.setData({
                                disabled: false
                            })
                            wx.navigateTo({
                                url: '../jianlilist/jianlilist?positionId=' + JSON.parse(res.data).data,
                            })
                        }, 800)
                    }
                }
            })
        } else {
            //职能判断
            let positionClass = '';
            if (that.data.hqqueryPosition == '' || that.data.hqqueryPosition == undefined) {
                positionClass = that.data.position.position_no
            } else {
                positionClass = that.data.hqqueryPosition
            }
            //学历判断
            let education = '';
            if (that.data.hqeducation == '' || that.data.hqeducation == undefined) {
                education = that.data.position.education
            } else {
                education = that.data.hqeducation
            }
            //经验判断
            let working_life = '';
            if (that.data.hqworklife == '' || that.data.hqworklife == undefined) {
                working_life = that.data.position.working_life
            } else {
                working_life = that.data.hqworklife
            }
            console.log(that.data.comName); //职位名称
            console.log(positionClass); //职能
            console.log(education); //学历id
            console.log(working_life); //年限/经验
            console.log(that.data.address); //地址
            console.log(that.data.word); //职责
            console.log(that.data.word1); //要求
            console.log(that.data.defectarr); //职位靓点
            console.log(that.data.multiArray[0][that.data.multiIndex[0]])
            let treatmentMinShow = that.data.multiArray[0][that.data.multiIndex[0]];
            let treatmentMin = treatmentMinShow.replace(/[\k]+/g, '000')
            let treatmentMaxShow = that.data.multiArray[1][that.data.multiIndex[1]];
            let treatmentMax = treatmentMaxShow.replace(/[\k]+/g, '000')
            console.log(treatmentMinShow) //最小薪资
            console.log(treatmentMin) //最小薪资
            console.log(treatmentMaxShow) //最大薪资
            console.log(treatmentMax) //最大薪资
            let newarr = [];
            if (that.data.defectarr.length != 0) {
                for (let i = 0; i < that.data.defectarr.length; i++) {
                    console.log(that.data.defectarr[i].bringtId)
                    if (that.data.defectarr[i].bringtId == undefined || that.data.defectarr[i].bringtId == null) {
                        newarr.push(that.data.defectarr[i].id)
                    } else {
                        newarr.push(that.data.defectarr[i].bringtId)
                    }
                }
            } else {
                console.log(newarr)
            }
            console.log(newarr)
            wx.showLoading({
                title: '加载中',
            })
            that.setData({
                disabled: true
            })
            //发布
            wx.request({
                url: app.data.apiPath + '/position/saveOrUpdatePositionInfo',
                method: "POST",
                header: {
                    'content-type': 'application/json; charset=UTF-8'
                },
                data: {
                    positionInfo: {
                        positionInfo: {
                            positionId: that.data.options.positionId,
                            unionid: wx.getStorageSync('unionid'),
                            positionName: that.data.comName,
                            positionClass: positionClass,
                            treatmentMin: treatmentMin,
                            treatmentMinShow: treatmentMinShow,
                            treatmentMax: treatmentMax,
                            treatmentMaxShow: treatmentMaxShow,
                            education: education,
                            workingLife: working_life,
                            address: that.data.address,
                            duty: that.data.word,
                            // require: that.data.word1,
                            city: wx.getStorageSync('city'),
                            addX: wx.getStorageSync('longitude'),
                            addY: wx.getStorageSync('latitude'),
                        },
                        brightTags: newarr
                    },
                },
                success: function (res) {
                    console.log(res)
                    if (JSON.parse(res.data).rstCode == "SUCCESS") {
                        wx.hideLoading()
                        that.setData({
                            disabled: false
                        })
                        console.log("发布成功")
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            duration: 2000
                        })
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 800)

                    }
                }
            })
        }
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
    onShareAppMessage: function () {

    }
})