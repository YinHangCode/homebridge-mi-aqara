class LogUtil {
    constructor(flag, log) {
        this.flag = flag;
        this.log = log;
    }
    
    debug(str) {
        this.log.debug(this.flag ? "[" + this.flag + "]" : "" + "[DEBUG]" + str);
    }
    
    info(str) {
        this.log.info(this.flag ? "[" + this.flag + "]" : "" + "[INFO]" + str);
    }
    
    warn(str) {
        this.log.warn(this.flag ? "[" + this.flag + "]" : "" + "[WARN]" + str);
    }
    
    error(str) {
        this.log.error(this.flag ? "[" + this.flag + "]" : "" + "[ERROR]" + str);
        if(str instanceof Error) {
            this.log.debug(this.flag ? "[" + this.flag + "]" : "" + "[ERROR]" + str.stack);
        }
    }
}

module.exports = LogUtil;