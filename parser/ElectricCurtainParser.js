const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class ElectricCurtainParser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'ElectricCurtain_WindowCovering': ElectricCurtainWindowCoveringParser
        }
    }
}

// 支持的设备：电动窗帘
ElectricCurtainParser.modelName = 'curtain';
module.exports = ElectricCurtainParser;

class ElectricCurtainWindowCoveringParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Electric Curtain',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.WindowCovering(accessoryName);
        service.getCharacteristic(that.Characteristic.PositionState);
        service.getCharacteristic(that.Characteristic.CurrentPosition);
        service.getCharacteristic(that.Characteristic.TargetPosition);
        result.push(service);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.WindowCovering);
            var positionStateCharacteristic = service.getCharacteristic(that.Characteristic.PositionState);
            var currentPositionCharacteristic = service.getCharacteristic(that.Characteristic.CurrentPosition);
            var targetPositionCharacteristic = service.getCharacteristic(that.Characteristic.TargetPosition);
            var value = that.getCurrentPositionCharacteristicValue(jsonObj, null);
            if(null != value) {
                positionStateCharacteristic.updateValue(that.Characteristic.PositionState.STOPPED);
                currentPositionCharacteristic.updateValue(value);
                targetPositionCharacteristic.updateValue(value);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (currentPositionCharacteristic.listeners('get').length == 0) {
                    currentPositionCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getCurrentPositionCharacteristicValue(result, null);
                            if(null != value) {
                                positionStateCharacteristic.updateValue(that.Characteristic.PositionState.STOPPED);
                                targetPositionCharacteristic.updateValue(value);
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
            
            if (targetPositionCharacteristic.listeners('set').length == 0) {
                targetPositionCharacteristic.on("set", function(value, callback) {
                    var command = {cmd:"write",model:that.model ,sid:deviceSid,data:{curtain_level:value}};
                    if(that.platform.ConfigUtil.getAccessoryIgnoreWriteResult(deviceSid, that.accessoryType)) {
                        that.platform.sendWriteCommandWithoutFeedback(deviceSid, command);
                        that.callback2HB(deviceSid, this, callback, null);
                    } else {
                        that.platform.sendWriteCommand(deviceSid, command).then(result => {
                            that.callback2HB(deviceSid, this, callback, null);
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            that.callback2HB(deviceSid, this, callback, err);
                        });
                    }
                });
            }
        }
    }
    
    getCurrentPositionCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'curtain_level');
        if(value / 1.0 > 100) {
            return defaultValue;
        } else {
            return value / 1.0;
        }
    }
}
