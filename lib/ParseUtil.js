var fs = require("fs");
var path = require('path');

class ParseUtil {
    constructor(platform) {
        this.platform = platform;
        this.parsers = {};
        this.gatewayModels = [];
        
        this.loadParser();
    }
    
    loadParser() {
        var that = this;
        var parsersPath = path.resolve(__dirname, './../parser/');
        that.platform.log.debug('loading parsers from: ' + parsersPath);
        fs.readdir(parsersPath, function (err, files) {
            if (err) {
                return;
            }
            files.forEach(function (filename) {
                if(filename == null || filename == '') {
                    return;
                }
                if('.js' != filename.substring(filename.lastIndexOf('.'), filename.length)) {
                    return;
                }
                if('AccessoryParser.js' == filename) {
                    return;
                }
                if('DeviceParser.js' == filename) {
                    return;
                }
//                that.platform.log.debug(filename);
                
                var parserPath = path.join(parsersPath, filename);
                try {
                    var parserFile = require(parserPath);
                    var parserModel = parserFile && parserFile.modelName;
                    if (!parserModel) {
                        return;
                    }
                    
                    var parser = new parserFile(that.platform);
                    if (parserModel instanceof Array) {
                        parserModel.forEach(function (model) {
                            that.parsers[model] = parser;
                            if(parserFile.isGateway) {
                                that.gatewayModels.push(model);
                            }
//                            that.platform.log.debug(model);
                        });
                    } else {
                        that.parsers[parserModel] = parser;
                        if(parserFile.isGateway) {
                            that.gatewayModels.push(parserModel);
                        }
//                        that.platform.log.debug(parserModel);
                    }
                } catch (error) {
                    that.platform.log.error(error);
                }
            });
        });
    }
    
    isGatewayModel(modelName) {
        if (this.gatewayModels.indexOf(modelName) > -1) {
            return true;
        } else {
            return false;
        }
    }
    
    getByModel(model) {
        return (model in this.parsers) ? this.parsers[model]: null;
    }
    
    getByModelName(model) {
        function getFnName(fn){
            return typeof fn !== "function" ?
                undefined:
                fn.name || 
                /function (.+?)\(/.exec(fn + "")[1];
        }
        var parse = this.getByModel(model);
        if(parse) {
            return getFnName(parse.constructor).replace("Parser", "");
        } else {
            return "";
        }
    }
    
    getCreateAccessories(jsonObj) {
        var result = [];
        
        var model = jsonObj['model'];
        var parser = this.getByModel(model);
        if(parser) {
            result = parser.getCreateAccessories(jsonObj);
        }
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var result = [];
        
        var model = jsonObj['model'];
        var parser = this.getByModel(model);
        if(parser) {
            result = parser.parserAccessories(jsonObj);
        }
        
        return result;
    }
    
    getAccessoriesUUID(sid, deviceModel) {
        var result = [];
        
        var parser = this.getByModel(deviceModel);
        if(parser) {
            result = parser.getAccessoriesUUID(sid);
        }
        
        return result;
    }
}

module.exports = ParseUtil;