//上传图片
function uploadimg(data) {
    var that = this,
        i = data.i ? data.i : 0, //当前上传的哪张图片
        success = data.success ? data.success : 0, //上传成功的个数
        fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'file', //这里根据自己的实际情况改
        header: {
            'Content-Type': 'multipart/form-data',
            'accept': '*/*',
        },
        cache: false,
        contentType: false,
        processData: false,
        // formData: {
        //     unionid: wx.getStorageInfoSync("unionid"),
        //     repType: 1,
        //     beRepId: wx.getStorageInfoSync("unionid"),
        //     repContent: 'asdiaydyiyi'
            
        // }, //这里是上传图片时一起上传的数据
        success: (res) => {
            success++; //图片上传成功，图片上传成功的变量+1
            console.log(res)
            console.log(i);
            //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        },
        fail: (res) => {
            fail++; //图片上传失败，图片上传失败的变量+1
            console.log('fail:' + i + "fail:" + fail);
        },
        complete: () => {
            console.log(i);
            i++; //这个图片执行完上传后，开始上传下一张
            if (i == data.path.length) { //当图片传完时，停止调用          
                console.log('执行完毕');
                console.log('成功：' + success + " 失败：" + fail);
            } else { //若图片还没有传完，则继续调用函数
                console.log(i);
                data.i = i;
                data.success = success;
                data.fail = fail;
                that.uploadimg(data);
            }

        }
    });
}

function formatTime(date) {
    var date = new Date(date)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
//得到时间格式2018-10-02
const formatDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')

}
//todate默认参数是当前日期，可以传入对应时间 todate格式为2018-10-05
function getDates(days, todate) {
    var dateArry = [];
    for (var i = 0; i < days; i++) {
        var dateObj = dateLater(todate, i);
        dateArry.push(dateObj)
    }
    return dateArry;
}
function dateLater(dates, later) {
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay();
    let yearDate = date.getFullYear();
    let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.time = yearDate + '-' + month + '-' + dayFormate;
    dateObj.week = show_day[day];
    return dateObj;
}
function getTime(n) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDay(); //返回星期几的某一天;
    n = day == 0 ? n + 6 : n + (day - 1)
    now.setDate(now.getDate() - n);
    date = now.getDate();
    var s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
    return s;
}
/**
 * 获取上周一到上周日
 *
 * @date 格式为日期格式
 * 返回格式为 yyyy-mm-dd的日期的数组，如：['2014-01-25']
 */
var getProWeekList = (date) => {
    var dateTime = date.getTime(); // 获取现在的时间
    var dateDay = date.getDay();
    var oneDayTime = 24 * 60 * 60 * 1000;
    var proWeekList = [];

    for (var i = 0; i < 7; i++) {
        var time = dateTime - (dateDay + (7 - 1 - i)) * oneDayTime;
        proWeekList[i] = format(new Date(time)); //date格式转换为yyyy-mm-dd格式的字符串
    }
    
    return proWeekList;
}
module.exports = {
    formatTime: formatTime,
    uploadimg: uploadimg,
    formatDate: formatDate,
    getDates: getDates,
    getProWeekList: getProWeekList,
    getTime: getTime
}