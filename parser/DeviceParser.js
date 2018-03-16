class DeviceParser {
    constructor(model, platform, deviceSid) {
        this.model = model;
        this.platform = platform;
        this.deviceSid = deviceSid;
        
        this.initAccessoriesParser();
    }

    getAccessoriesUUID(deviceSid) {
        var r = {};
        
        var parsers = this.accessoriesParsers;
        for(var item in parsers) {
            r[item] = parsers[item].getAccessoryUUID(deviceSid);
        }
        
        return r;
    }

    getAccessoriesParserInfo() {
        return {};
    }
    
    initAccessoriesParser() {
        this.accessoriesParsers = {};
        
        var accessoriesParserInfo = this.getAccessoriesParserInfo();
        for(var key in accessoriesParserInfo) {
            this.accessoriesParsers[key] = new (accessoriesParserInfo[key])(this.model, this.platform, key);
        }
    }
    
    getCreateAccessories(jsonObj) {
        var r = [];
        
        var parsers = this.accessoriesParsers;
        for(var item in parsers) {
            var accessory = parsers[item].getCreateAccessories(jsonObj);
            if(accessory) {
                r.push(accessory);
            }
        }
        
        return r;
    }
    
    parserAccessories(jsonObj) {
        var parsers = this.accessoriesParsers;
        for(var item in parsers) {
            parsers[item].parserAccessories(jsonObj);
        }
    }
}

module.exports = DeviceParser;