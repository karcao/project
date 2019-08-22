const app = getApp();
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
    data: {
        latitude: 0, //地图初次加载时的纬度坐标
        longitude: 0, //地图初次加载时的经度坐标
        name: "" //选择的位置名称
    },
    onLoad: function() {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'MNXBZ-G5TWD-GYF42-HHZJL-2W2J3-PVBX4'
        });

        this.moveToLocation();
    },
    //移动选点
    moveToLocation: function() {
        var that = this;
        // 打开地图选择位置
        wx.chooseLocation({
            success: function(res) {
                wx.navigateBack({
                    delta: 1
                });
                // res.name为地址名称
                console.log(res)
                wx.setStorageSync('address', res.address);
                wx.setStorageSync('latitude', res.latitude);
                wx.setStorageSync('longitude', res.longitude);
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: function (res) {
                        console.log(res)
                        wx.setStorageSync('city', res.result.address_component.city);
                        //选择地点之后返回到原来页面
                        
                    }
                })
                // ?address = " + res.address
            },
            fail: function(err) {
                wx.navigateBack({
                    delta: 1
                });
            }
        });
    }
});