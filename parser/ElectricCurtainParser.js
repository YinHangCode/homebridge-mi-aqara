const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class ElectricCurtainParser extends DeviceParser {
    constructor(platform) {
        super(platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'ElectricCurtain_WindowCovering': ElectricCurtainWindowCoveringParser
        }
    }
}
module.exports = ElectricCurtainParser;

class ElectricCurtainWindowCoveringParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
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
        service.getCharacteristic(Characteristic.PositionState);
        service.getCharacteristic(Characteristic.CurrentPosition);
        service.getCharacteristic(Characteristic.TargetPosition);
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
            var positionStateCharacteristic = curtainService.getCharacteristic(Characteristic.PositionState);
            var currentPositionCharacteristic = curtainService.getCharacteristic(Characteristic.CurrentPosition);
            var targetPositionCharacteristic = curtainService.getCharacteristic(Characteristic.TargetPosition);
            var value = that.getCurrentPositionCharacteristicValue(jsonObj, null);
            if(null != value) {
                positionStateCharacteristic.updateValue(Characteristic.PositionState.STOPPED);
                currentPositionCharacteristic.updateValue(curtainLevel);
                targetPositionCharacteristic.updateValue(curtainLevel);
            }
            
            if (currentPositionCharacteristic.listeners('get').length == 0) {
                currentPositionCharacteristic.on("get", function(callback) {
                    var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                    that.platform.sendReadCommand(deviceSid, command).then(result => {
                        var value = that.getCurrentPositionCharacteristicValue(result, null);
                        if(null != value) {
                            positionStateCharacteristic.updateValue(Characteristic.PositionState.STOPPED);
                            targetPositionCharacteristic.updateValue(curtainLevel);
                            callback(null, curtainLevel);
                        } else {
                            callback(new Error('get value file: ' + result));
                        }
                    }).catch(function(err) {
                        that.platform.log.error(err);
                        callback(err);
                    });
                });
            }
            
            if (targetPositionCharacteristic.listeners('set').length == 0) {
                    targetPositionCharacteristic.on("set", function(value, callback) {
                    var command = '{"cmd":"write","model":"curtain","sid":"' + deviceSid + '","data":"{\\"curtain_level\\":\\"' + value + '\\", \\"key\\": \\"${key}\\"}"}';
                    that.platform.sendReadCommand(deviceSid, command).then(result => {
                        callback(null);
                    }).catch(function(err) {
                        that.platform.log.error(err);
                        callback(err);
                    });
                });
            }
            
            that.parserBatteryService(accessory, jsonObj);
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
