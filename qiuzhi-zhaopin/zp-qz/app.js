//app.js
App({
    data: {
        //线下
        // apiPath: "http://192.168.0.108:8711", //本地接口
        // formidPath: "http://192.168.0.108:8112",//formid接口地址
        // canvas:"https://ssl.shzqmanager.com/images",//canvas背景图
        // //线上
        apiPath: "https://zpservice.shzqmanager.com", //本地接口
        formidPath: "https://websocket.shzqmanager.com",//formid接口地址
        canvas: "https://ssl.shzqmanager.com/images",//canvas背景图
    },
    onLaunch: function (options) {
        console.log("[onShow] 场景值:", options)
        console.log("启动")
        const updateManager = wx.getUpdateManager()
        updateManager.onUpdateReady(function () {
            console.log('新版本')
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    },
    //获取formid
    collectFromidForWx: function (formId) {
        let that = this;
        wx.request({
            url: that.data.formidPath + '/chat/collectFromidForWx',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                formid: formId,
                port:2,
                unionid: wx.getStorageSync('unionid')
            },
            success: function (res) {
                console.log(res)
            }
        })
    },
    onShow:function(options){
        let option = JSON.stringify(options);
        var resultScene = this.sceneInfo(options.scene);
        console.log(resultScene)
        // this.setData({
        //     resultScene
        // })
        this.globalData.resultScene = resultScene
    },
    globalData: {
        resultScene:null
    },
    sceneInfo: function (s) {
        var scene = [];
        switch (s) {
            case 1001:
                scene.push(s, "发现栏小程序主入口");
                break;
            case 1005:
                scene.push(s, "顶部搜索框的搜索结果页");
                break;
            case 1006:
                scene.push(s, "发现栏小程序主入口搜索框的搜索结果页");
                break;
            case 1007:
                scene.push(s, "单人聊天会话中的小程序消息卡片");
                break;
            case 1008:
                scene.push(s, "群聊会话中的小程序消息卡片");
                break;
            case 1011:
                scene.push(s, "扫描二维码");
                break;
            case 1012:
                scene.push(s, "长按图片识别二维码");
                break;
            case 1014:
                scene.push(s, "手机相册选取二维码");
                break;
            case 1017:
                scene.push(s, "前往体验版的入口页");
                break;
            case 1019:
                scene.push(s, "微信钱包");
                break;
            case 1020:
                scene.push(s, "公众号profile页相关小程序列表");
                break;
            case 1022:
                scene.push(s, "聊天顶部置顶小程序入口");
                break;
            case 1023:
                scene.push(s, "安卓系统桌面图标");
                break;
            case 1024:
                scene.push(s, "小程序profile页");
                break;
            case 1025:
                scene.push(s, "扫描一维码");
                break;
            case 1026:
                scene.push(s, "附近小程序列表");
                break;
            case 1027:
                scene.push(s, "顶部搜索框搜索结果页“使用过的小程序”列表");
                break;
            case 1028:
                scene.push(s, "我的卡包");
                break;
            case 1029:
                scene.push(s, "卡券详情页");
                break;
            case 1031:
                scene.push(s, "长按图片识别一维码");
                break;
            case 1032:
                scene.push(s, "手机相册选取一维码");
                break;
            case 1034:
                scene.push(s, "微信支付完成页");
                break;
            case 1035:
                scene.push(s, "公众号自定义菜单");
                break;
            case 1036:
                scene.push(s, "App分享消息卡片");
                break;
            case 1037:
                scene.push(s, "小程序打开小程序");
                break;
            case 1038:
                scene.push(s, "从另一个小程序返回");
                break;
            case 1039:
                scene.push(s, "摇电视");
                break;
            case 1042:
                scene.push(s, "添加好友搜索框的搜索结果页");
                break;
            case 1044:
                scene.push(s, "带shareTicket的小程序消息卡片");
                break;
            case 1047:
                scene.push(s, "扫描小程序码");
                break;
            case 1048:
                scene.push(s, "长按图片识别小程序码");
                break;
            case 1049:
                scene.push(s, "手机相册选取小程序码");
                break;
            case 1052:
                scene.push(s, "卡券的适用门店列表");
                break;
            case 1053:
                scene.push(s, "搜一搜的结果页");
                break;
            case 1054:
                scene.push(s, "顶部搜索框小程序快捷入口");
                break;
            case 1056:
                scene.push(s, "音乐播放器菜单");
                break;
            case 1058:
                scene.push(s, "公众号文章");
                break;
            case 1059:
                scene.push(s, "体验版小程序绑定邀请页");
                break;
            case 1064:
                scene.push(s, "微信连Wifi状态栏");
                break;
            case 1067:
                scene.push(s, "公众号文章广告");
                break;
            case 1068:
                scene.push(s, "附近小程序列表广告");
                break;
            case 1072:
                scene.push(s, "二维码收款页面");
                break;
            case 1073:
                scene.push(s, "客服消息列表下发的小程序消息卡片");
                break;
            case 1074:
                scene.push(s, "公众号会话下发的小程序消息卡片");
                break;
            case 1089:
                scene.push(s, "微信聊天主界面下拉");
                break;
            case 1090:
                scene.push(s, "长按小程序右上角菜单唤出最近使用历史");
                break;
            case 1092:
                scene.push(s, "城市服务入口");
                break;
            default:
                scene.push("未知入口");
                break;
        }
        return scene;
    }
})
