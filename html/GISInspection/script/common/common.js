
/**
 * 合并对象重写
 * @param 任意
 * @return 对象
 */
Object.prototype.assignNew = function() {
    var obj = arguments[0]
    for (var i = 1; i < arguments.length; i++) {
        for (var prop in arguments[i]) {
            obj[prop] = arguments[i][prop]
        }
    }
    return obj
}
