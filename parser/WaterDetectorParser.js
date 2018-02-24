const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class WaterDetectorParser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'WaterDetector_LeakSensor': WaterDetectorLeakSensorParser
        }
    }
}

// 支持的设备：水浸传感器
WaterDetectorParser.modelName = 'sensor_wleak.aq1';
module.exports = WaterDetectorParser;

class WaterDetectorLeakSensorParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Water Detector',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.LeakSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.LeakDetected);
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
            var service = accessory.getService(that.Service.LeakSensor);
            var leakDetectedCharacteristic = service.getCharacteristic(that.Characteristic.LeakDetected);
            var value = that.getLeakDetectedCharacteristicValue(jsonObj, null);
            if(null != value) {
                leakDetectedCharacteristic.updateValue(value ? that.Characteristic.LeakDetected.LEAK_DETECTED : that.Characteristic.LeakDetected.LEAK_NOT_DETECTED);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (leakDetectedCharacteristic.listeners('get').length == 0) {
                    leakDetectedCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getLeakDetectedCharacteristicValue(result, null);
                            if(null != value) {
                                callback(null, value ? that.Characteristic.LeakDetected.LEAK_DETECTED : that.Characteristic.LeakDetected.LEAK_NOT_DETECTED);
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
    
    getLeakDetectedCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        if(value === 'leak') {
            return true;
        } else if(value === 'no_leak') {
            return false;
        } else {
            return false;
        }
    }
}
