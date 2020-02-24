
// 时间格式(s)转换 (xxxx -> x:xx:xx)
export function time2Str(duration = 0) {
	if (!duration) return '0:00:00'
	var hour, hourStr, minute, minuteStr, second, secondStr
	hour      =  duration / 3600 | 0
	hourStr   =  hour? `${hour}:`: ''
	duration  -= hour * 3600
	minute    =  duration / 60 | 0
	minuteStr =  ('0' + minute).slice(-2) + ':'
	duration  -= minute * 60
	second    =  duration | 0
	secondStr =  ('0' + second).slice(-2)
	return `${hourStr}${minuteStr}${secondStr}`
}

export function bbbb() {
	
}
