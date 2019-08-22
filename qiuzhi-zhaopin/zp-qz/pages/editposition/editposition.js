const app = getApp();
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        disabled:false,
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
        // workLifeIndex: 0,
        //薪酬多级联动
        multiArray: [
            // ['月薪制', '年薪制', '薪资面议'],
            ['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '12k', '15k', '20k', '25k', '30k'],
            ['3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '12k', '15k', '20k', '25k', '30k', '50k']
        ],
        multiIndex: [''],
    },
    //获取地理位置
    onChangeAddress: function() {
        wx.navigateTo({
            url: "../position/position"
        });
    },
    // 获取名称
    bindnametitle: function(e) {
        let that = this;
        console.log(e.detail.value)
        that.setData({
            usertitle: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            hidden: true,
            hidden1: false,
            options: options
        })
        //判断是第一次加载还是从position页面返回
        //如果从position页面返回，会传递用户选择的地点
        //如果不是从position页面返回，而是第一次进入，则会自动定位用户的位置，显示用户的位置
        // console.log(options.address)
        console.log(wx.getStorageSync('address'))
        // if(wx.getStorageSync(address))
        if (wx.getStorageSync('address')) {
            //设置变量 address 的值
            that.setData({
                address: wx.getStorageSync('address')
            });
        } else {
            qqmapsdk = new QQMapWX({
                key: 'WPRBZ-EAN3U-WS2VM-2PTHS-BL2EF-ZMBWZ' //这里自己的key秘钥进行填充
            });
            qqmapsdk.reverseGeocoder({
                // 这里没有写location选项，是因为默认就是当前位置
                success: function(res) {
                    console.log(res)
                    // 获取默认下的地址
                    that.setData({
                        address: ''
                    });
                },
                fail: function(res) {
                    //console.log(res);
                    // that.onLoad()
                },
                complete: function(res) {
                    //console.log(res);
                }
            });
        }
        //获取职能
        wx.request({
            url: app.data.apiPath + '/dicJob/queryPositionByParent',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                parentId: 1170
            },
            success: function(res) {
                var arrleft = [];
                var arrleft1 = [];
                var arrleft2 = [];
                var arrright = [];
                // console.log(JSON.parse(res.data).data)
                let query = JSON.parse(res.data).data;
                console.log(query)
                that.setData({
                    query
                })
                query.forEach((item) => {
                    arrleft1.push(item.positionName)
                });
                for (let i = 0; i < query[0].positionList.length; i++) {
                    arrleft2.push(query[0].positionList[i].positionName)
                }
                //遍历二维数组
                for (let j = 0; j < query.length; j++) {
                    let arrright1 = [];
                    for (let p = 0; p < query[j].positionList.length; p++) {
                        arrright1.push(query[j].positionList[p].positionName)
                    }
                    arrright.push(arrright1)
                }

                arrleft.push(arrleft1)
                arrleft.push(arrleft2)
                console.log(arrleft)
                console.log(arrright)
                that.setData({
                    arrleft: arrleft,
                    arrright: arrright
                })
            }
        })
        // 获取学历
        wx.request({
            url: app.data.apiPath + '/dicJob/queryEducation',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function(res) {
                console.log(JSON.parse(res.data).data);
                let eduarr = JSON.parse(res.data).data;
                // 赋值给educationArray
                that.setData({
                    educationArray: eduarr
                })
            }
        })
        console.log(options)
        setTimeout(function(){
            if (options.positionId == undefined || options.positionId == '') {
                console.log('从新发布')
                // wx.removeStorageSync('address');
                // wx.removeStorageSync('defectarr');
                return;
            } else {
                that.setData({
                    hidden1: true
                })
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
                        console.log(position.position_class)
                        console.log(that.data.functionArray)
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
                                console.log(1111)
                                console.log([u,u])
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
                            selected: position.positionName, //职能
                            workLifeIndex: position.working_life, //经验
                            address: position.address, //地点
                            word: position.duty, //职责
                            textcount: position.duty.length,
                            // word1: position.position_require, //要求
                            // textcount1: position.position_require.length,
                            defectarr: position.positionBrightTagList
                        })
                    }
                })
            }
        },300)
    },
    //职能二级联动
    queryPositionByParent: function(e) {
        // console.log(e)
        let p = e.detail.value[0];
        let m = e.detail.value[1];
        console.log(p)
        console.log(m)
        this.setData({
            // selected: this.data.arrleft[0][p] + '+' + this.data.arrright[p][m]
            selected: this.data.arrright[p][m],
            //向后台传递的职位id
            hqqueryPosition: this.data.query[p].positionList[m].positionNo
        })
        console.log(this.data.query)
        console.log(this.data.query[p].positionList[m].positionNo)
    },
    queryPositionBycolumnParent: function(e) {
        // console.log(e)
        let column = e.detail.column;
        let v = e.detail.value;
        if (column === 0) {
            let arrleft = this.data.arrleft;
            arrleft[1] = this.data.arrright[v];
            this.setData({
                arrleft: arrleft,
                queryPositionIndex: [v, 0]
            })
        }
    },
    //学历
    bindEducationChange: function(e) {
        let that = this;
        console.log(e)
        console.log(that.data.educationArray)
        // //拿着下标改变值
        that.setData({
            educationIndex: e.detail.value
        })
        // console.log(that.data.educationArray[that.data.educationIndex].educationId)
        // //把值提取方便发布时获取
        that.setData({
            hqeducation: that.data.educationArray[that.data.educationIndex].educationId
        })
    },
    //工作年限
    bindWorkingLifeChange: function(e) {
        let that = this;
        // console.log(that.data.workLife)
        //拿着下标改变值
        that.setData({
            workLifeIndex: e.detail.value
        })
        //把值提取方便发布时获取
        that.setData({
            hqworklife: that.data.workLife[that.data.workLifeIndex]
        })
    },
    //待遇
    bindMultiPickerChange: function(e) {
        let that = this;
        that.setData({
            hidden: false,
            hidden1: true
        })
        that.setData({
            multiIndex: e.detail.value
        })

    },
    bindMultiPickerColumnChange: function(e) {
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
        console.log(wx.getStorageSync('address'))
        if (wx.getStorageSync('address')) {
            that.setData({
                address: wx.getStorageSync('address')
            })
        } else {
            that.setData({
                address: "请选择"
            })
        }
        if (wx.getStorageSync('defectarr')) {
            that.setData({
                defectarr: wx.getStorageSync('defectarr')
            })
        } else {}
    },
    //发布
    formSubmit: function(e) {
        let that = this;
        console.log(e)
        app.collectFromidForWx(e.detail.formId);
        console.log(that.data.options.positionId)
        if (that.data.options.positionId == undefined || that.data.options.positionId == "") {
            console.log(that.data.comName); //职位名称
            console.log(that.data.selected) //职能名称
            console.log(that.data.hqqueryPosition)//职能id
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
            if (that.data.hqqueryPosition == '' || that.data.hqqueryPosition == undefined) {
                wx.showToast({
                    title: '职能不能为空',
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
            //4.学历
            if (that.data.hqeducation == undefined || that.data.hqeducation == '') {
                wx.showToast({
                    title: '学历不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //5.经验
            if (that.data.workLifeIndex == undefined || that.data.workLifeIndex == '') {
                wx.showToast({
                    title: '经验不能为空',
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
            //7.职责
            //7.工作描述
            if (that.data.word == undefined || that.data.word == '') {
                wx.showToast({
                    title: '工作描述不能为空',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            //8.要求
            // if (that.data.word1 == undefined || that.data.word1 == '') {
            //     wx.showToast({
            //         title: '要求不能为空',
            //         duration: 2000,
            //         icon: 'none'
            //     })
            //     return;
            // }
            //9.靓点
            // if (that.data.defectarr == undefined || that.data.defectarr == '') {
            //     wx.showToast({
            //         title: '靓点不能为空',
            //         duration: 2000,
            //         icon: 'none'
            //     })
            //     return;
            // }
            let treatmentMinShow = that.data.multiArray[0][that.data.multiIndex[0]];
            let treatmentMin = treatmentMinShow.replace(/[\k]+/g, '000')
            let treatmentMaxShow = that.data.multiArray[1][that.data.multiIndex[1]];
            let treatmentMax = treatmentMaxShow.replace(/[\k]+/g, '000')
            console.log(treatmentMinShow) //最小薪资
            console.log(treatmentMin) //最小薪资
            console.log(treatmentMaxShow) //最大薪资
            console.log(treatmentMax) //最大薪资
            console.log(that.data.defectarr)
            let newarr = [];
            if (that.data.defectarr == undefined || that.data.defectarr == ''){
                console.log(newarr)
            }else{
                for (let i = 0; i < that.data.defectarr.length; i++) {
                    newarr.push(that.data.defectarr[i].id)
                }
                console.log(newarr)
            }
            console.log(newarr)
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
                            positionClass: that.data.hqqueryPosition,
                            treatmentMin: treatmentMin,
                            treatmentMinShow: treatmentMinShow,
                            treatmentMax: treatmentMax,
                            treatmentMaxShow: treatmentMaxShow,
                            education: that.data.hqeducation,
                            workingLife: that.data.workLifeIndex,
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
                success: function(res) {
                    console.log(res)
                    if (JSON.parse(res.data).rstCode == "SUCCESS") {
                        console.log("发布成功")
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            duration: 2000
                        })
                        setTimeout(function() {
                            that.setData({
                                disabled: false
                            })
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 800)

                    }
                }
            })
        }else{
            //职能判断
            let positionClass = '';
            if (that.data.hqqueryPosition == '' || that.data.hqqueryPosition == undefined){
                positionClass = that.data.position.position_no
            }else{
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
            if (that.data.defectarr.length != 0){
                for (let i = 0; i < that.data.defectarr.length; i++) {
                    console.log(that.data.defectarr[i].bringtId)
                    if (that.data.defectarr[i].bringtId == undefined || that.data.defectarr[i].bringtId == null){
                        newarr.push(that.data.defectarr[i].id)
                    }else{
                        newarr.push(that.data.defectarr[i].bringtId)
                    }
                }
            }else{
                console.log(newarr)
            }
            console.log(newarr)
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
    //编辑岗位职责
    bindTextwork: function(e) {
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
    //编辑任职要求
    bindTextwork1: function(e) {
        let that = this;
        that.setData({
            word1: e.detail.value,
            textcount1: e.detail.value.length
        })
        if (that.data.textcount1 >= 500) {
            wx.showToast({
                title: '最多不能超过3000个字哦',
                duration: 2000,
                icon: 'none'
            })
            return;
        }
    },
    //编辑公司名称
    editcomname: function() {
        let that = this;
        that.setData({
            comnameshow: true
        })
    },
    // 公司名称
    companyname: function(e) {
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
    closecomname: function(e) {
        let that = this;
        that.setData({
            comnameshow: false
        })
    },
    //保存公司名称
    savecomname: function(e) {
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
    //智联地址
    //编辑智联地址
    editcomname1: function () {
        let that = this;
        that.setData({
            comnameshow1: true
        })
    },
    // 智联地址
    companyname1: function (e) {
        let that = this;
        var name = e.currentTarget.dataset.name;
        that.setData({
            [name]: e.detail.value.replace(/\s+/g, ''),
            companyname1: e.detail.value,
            wordcount1: e.detail.value.length
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
    //关闭智联地址弹窗
    closecomname1: function (e) {
        let that = this;
        that.setData({
            comnameshow1: false
        })
    },
    //保存智联地址
    savecomname1: function (e) {
        let that = this;
        // console.log(that.data.companyname1)
        if (that.data.companyname1 == undefined || that.data.companyname1 == '') {
            wx.showToast({
                title: '请输入职位网址',
                duration: 2000,
                icon: 'none'
            })
            return;
        } else {
            console.log(that.data.companyname1)
            wx.request({
                url: app.data.apiPath + '/position/parsePositionByUrl',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    url: that.data.companyname1
                },
                success: function (res) {
                    console.log(res)
                    console.log(res.data)
                    console.log(JSON.parse(res.data.positionBrightTagList))
                    let positionurl = res.data;
                    //待遇
                    for (let u = 0; u < that.data.multiArray[0].length; u++) {
                        if (positionurl.treatmentMinShow == that.data.multiArray[0][u] || positionurl.treatmentMaxShow == that.data.multiArray[1][u]) {
                            console.log(1111)
                            console.log([u, u])
                            that.setData({
                                multiIndex: [u, u]
                            })
                        }
                    }
                    //学历
                    for (let j = 0; j < that.data.educationArray.length; j++) {
                        if (positionurl.educationName == that.data.educationArray[j].educationName) {
                            that.setData({
                                educationIndex: j
                            })
                        }
                    }
                    that.setData({
                        comnameshow1: false,
                        comName1: that.data.companyname1,
                        // position: position,
                        comName: positionurl.positionName, //名称
                        // selected: positionurl.positionName, //职能
                        workLifeIndex: positionurl.workingLife, //经验
                        address: positionurl.address, //地点
                        word: positionurl.duty, //职责
                        textcount: positionurl.duty.length,
                        hidden1: true,
                        // word1: position.position_require, //要求
                        // textcount1: position.position_require.length,
                        defectarr: JSON.parse(positionurl.positionBrightTagList)
                    })
                }
            })
        }
    },
    //跳转到编辑岗位靓点
    navtopostdefect: function(e) {
        wx.navigateTo({
            url: '../postlist/postlist',
        })
    },
})