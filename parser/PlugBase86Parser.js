const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class PlugBase86Parser extends DeviceParser {
    constructor(platform) {
        super(platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'PlugBase86_Outlet': PlugBase86OutletParser
        }
    }
}
module.exports = PlugBase86Parser;

class PlugBase86OutletParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.OUTLET;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Plug Base 86',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.Outlet(accessoryName);
        service.getCharacteristic(that.Characteristic.On);
        service.getCharacteristic(that.Characteristic.OutletInUse);
        result.push(service);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.Outlet);
            var onCharacteristic = service.getCharacteristic(that.Characteristic.On);
            var outletInUseCharacteristic = service.getCharacteristic(that.Characteristic.OutletInUse);
            var value = that.getOnCharacteristicValue(jsonObj, null);
            if(null != value) {
                onCharacteristic.updateValue(value);
                outletInUseCharacteristic.updateValue(value);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (onCharacteristic.listeners('get').length == 0) {
                    onCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getOnCharacteristicValue(result, null);
                            if(null != value) {
                                outletInUseCharacteristic.updateValue(value);
                                callback(null, value);
                            } else {
                                callback(new Error('get value fail: ' + result));
                            }
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            callback(err);
                        });
                    });
                }
            }
            
            if (onCharacteristic.listeners('set').length == 0) {
                onCharacteristic.on("set", function(value, callback) {
                    var command = '{"cmd":"write","model":"86plug","sid":"' + deviceSid + '","data":"{\\"status\\":\\"' + (value ? 'on' : 'off') + '\\", \\"key\\": \\"${key}\\"}"}';
                    that.platform.sendWriteCommand(deviceSid, command).then(result => {
                        that.callback2HB(deviceSid, this, callback, null);
                    }).catch(function(err) {
                        that.platform.log.error(err);
                        that.callback2HB(deviceSid, this, callback, err);
                    });
                });
            }
        }
    }
    
    getOnCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        if(value === 'on') {
            return true;
        } else if(value === 'off') {
            return false;
        } else {
            return defaultValue;
        }
    }
}
