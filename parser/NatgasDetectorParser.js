const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class NatgasDetectorParser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'NatgasDetector_SmokeSensor': NatgasDetectorSmokeSensorParser
        }
    }
}

// 支持的设备：天然气警报器
NatgasDetectorParser.modelName = ['natgas', 'sensor_natgas'];
module.exports = NatgasDetectorParser;

class NatgasDetectorSmokeSensorParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Natgas Detector',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.SmokeSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.SmokeDetected);
        result.push(service);
        
        var batteryService  = new that.Service.BatteryService(accessoryName);
        batteryService.getCharacteristic(that.Characteristic.StatusLowBattery);
        batteryService.getCharacteristic(that.Characteristic.BatteryLevel);
        batteryService.getCharacteristic(that.Characteristic.ChargingState);
        result.push(batteryService);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.SmokeSensor);
            var smokeDetectedCharacteristic = service.getCharacteristic(that.Characteristic.SmokeDetected);
            var value = that.getSmokeDetectedCharacteristicValue(jsonObj, null);
            if(null != value) {
                smokeDetectedCharacteristic.updateValue(value ? that.Characteristic.SmokeDetected.SMOKE_DETECTED : that.Characteristic.SmokeDetected.SMOKE_NOT_DETECTED);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (smokeDetectedCharacteristic.listeners('get').length == 0) {
                    smokeDetectedCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getSmokeDetectedCharacteristicValue(result, null);
                            if(null != value) {
                                callback(null, value ? that.Characteristic.SmokeDetected.SMOKE_DETECTED : that.Characteristic.SmokeDetected.SMOKE_NOT_DETECTED);
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
            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
    
    getSmokeDetectedCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'alarm');
        if(value === '1' || value === '2') {
            return true;
        } else if(value === '0') {
            return false;
        } else {
            return false;
        }
    }
}
