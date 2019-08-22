

function connect(user, func) {
    

    wx.onSocketOpen(function(res) {
        //接受服务器消息
        wx.onSocketMessage(func); //func回调可以拿到服务器返回的数据
    });

    wx.onSocketError(function(res) {
        wx.showToast({
            title: 'websocket连接失败，请检查！',
            icon: "none",
            duration: 2000
        })
    })
}

//发送消息
function send(msg) {
    wx.sendSocketMessage({
        data: msg,
        success: function (res) {
            console.log(res)
        },
        fail: function (res) {
            console.log(res)
        },
        complete: function (res) {
            console.log(res)
        }
    });
}

module.exports = {
    connect: connect,
    send: send
}