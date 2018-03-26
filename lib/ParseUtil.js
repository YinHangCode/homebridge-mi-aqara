var fs = require("fs");
var path = require('path');

class ParseUtil {
    constructor(platform) {
        this.platform = platform;
        this.log = platform.log;
        this.parsers = {};
        this.loadParser();
    }
    
    loadParser() {
        var that = this;
        var parsersPath = path.resolve(__dirname, './../parser/');
        that.log.debug('loading parsers from %s', parsersPath);
        fs.readdir(parsersPath, function (err, files) {
            if (err) {
                return;
            }
            files.forEach(function (filename) {
                var parserPath = path.join(parsersPath, filename);
                try {
                    var parser = require(parserPath);
                    var parserSupportModel = parser && parser.modelName;
                    if (!parserSupportModel) return;
                    if (parserSupportModel instanceof Array) {
                        parserSupportModel.forEach(function (model) {
                            that.parsers[model] = parser;
                            that.log.debug(model);
                        });
                    } else {
                        that.parsers[parserSupportModel] = parser;
                        that.log.debug(parserSupportModel);
                    }
                } catch (error) {
                    that.log.error(error);
                }
            });
        });
    }
    
    getByModel(sid, model) {
        var parser = (model in this.parsers) ? this.parsers[model]: null;
        return parser ? new parser( model, this.platform, sid) : null;
    }
    
    getCreateAccessories(jsonObj) {
        var result = [];
        
        var model = jsonObj['model'];
        var parser = this.getByModel(jsonObj['sid'], model);
        if(parser) {
            result = parser.getCreateAccessories(jsonObj);
        }
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var result = [];
        
        var model = jsonObj['model'];
        var parser = this.getByModel(jsonObj['sid'], model);
        if(parser) {
            result = parser.parserAccessories(jsonObj);
        }
        
        return result;
    }
    
    getAccessoriesUUID(sid, deviceModel) {
        var result = [];
        
        var parser = this.getByModel(sid, deviceModel);
        if(parser) {
            result = parser.getAccessoriesUUID(sid);
        }
        
        return result;
    }
}

module.exports = ParseUtil;