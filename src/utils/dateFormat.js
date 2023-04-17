// 计算两个日期之间相隔的天数
function DateDiff(sDate1, sDate2) {
  //sDate1和sDate2是2006-12-18格式
  var aDate1, aDate2, oDate1, oDate2, iDays;
  aDate1 = sDate1.split("-");
  oDate1 = new Date(aDate1[1] + "/" + aDate1[2] + "/" + aDate1[0]);
  aDate2 = sDate2.split("-");
  oDate2 = new Date(aDate2[1] + "/" + aDate2[2] + "/" + aDate2[0]);
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
  return iDays;
}

// 将日期格式化为特定格式
function formatDate(date, fmt) {
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return fmt;
  }

export { DateDiff,formatDate };
