const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class LockParser extends DeviceParser {
    constructor(platform) {
        super(platform);
    }

    getAccessoriesParserInfo() {
        var parserInfo = {
            'Lock_MotionSensor': LockMotionSensorParser
        };

        return parserInfo;
    }
}
LockParser.modelName = ['lock.aq1'];
module.exports = LockParser;

class LockMotionSensorParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Lock',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var deviceSid = jsonObj['sid'];
        
        var mainMotionSensorService = new that.Service.MotionSensor(accessoryName);
        mainMotionSensorService.subtype = 'main';
        mainMotionSensorService.getCharacteristic(that.Characteristic.MotionDetected);
        result.push(mainMotionSensorService);
        
        var batteryService  = new that.Service.BatteryService(accessoryName);
        batteryService.getCharacteristic(that.Characteristic.StatusLowBattery);
        batteryService.getCharacteristic(that.Characteristic.BatteryLevel);
        batteryService.getCharacteristic(that.Characteristic.ChargingState);
        result.push(batteryService);
        
        // get Config
        var accessoryConfig = that.platform.ConfigUtil.getAccessoryConfig(deviceSid);
        if (accessoryConfig) {
            for (var key in accessoryConfig) {
                if(key.indexOf('Lock_MotionSensor_') > -1) {
                    var id = key.substring('Lock_MotionSensor_'.length, key.length);
                    var subMotionSensorName = that.platform.ConfigUtil.getAccessoryName(deviceSid, 'Lock_MotionSensor_' + id);
                    var subMotionSensorService = new that.Service.MotionSensor(subMotionSensorName);
                    subMotionSensorService.subtype = id;
                    result.push(subMotionSensorService);
                }
            }
        }
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var mainMotionSensorService = accessory.getServiceByUUIDAndSubType(uuid, 'main');
            var mainMotionSensorService = mainMotionSensorService.getCharacteristic(that.Characteristic.MotionDetected);
            var value = that.getMotionDetectedCharacteristicValue(jsonObj, null);
            if(null != value) {
                mainMotionSensorService.updateValue(true);
                setTimeout(() => {
                    mainMotionSensorService.updateValue(false);
                }, 1 * 60 * 1000);
                
                var subMotionSensorService = accessory.getServiceByUUIDAndSubType(uuid, value);
                if(subMotionSensorService) {
                    var subMotionDetectedCharacteristic = subMotionSensorService.getCharacteristic(that.Characteristic.MotionDetected);
                    subMotionDetectedCharacteristic.updateValue(true);
                    setTimeout(() => {
                        subMotionDetectedCharacteristic.updateValue(false);
                    }, 1 * 60 * 1000);
                }
            }
/*            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (motionDetectedCharacteristic.listeners('get').length == 0) {
                    motionDetectedCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getMotionDetectedCharacteristicValue(result, null);
                            if(null != value) {
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
*/            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
    
    getMotionDetectedCharacteristicValue(jsonObj, defaultValue) {
        var success_value = null;
        var wrong_value = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(jsonObj['sid']));
        if(1 == proto_version_prefix) {
            success_value = this.getValueFrJsonObjData1(jsonObj, 'fing_verified') || this.getValueFrJsonObjData1(jsonObj, 'card_verified') || this.getValueFrJsonObjData1(jsonObj, 'psw_verified');
            wrong_value = this.getValueFrJsonObjData1(jsonObj, 'verified_wrong');
        } else if(2 == proto_version_prefix) {
            success_value = this.getValueFrJsonObjData2(jsonObj, 'fing_verified') || this.getValueFrJsonObjData2(jsonObj, 'card_verified') || this.getValueFrJsonObjData2(jsonObj, 'psw_verified');
            wrong_value = this.getValueFrJsonObjData2(jsonObj, 'verified_wrong');
        } else {
        }
        
        return wrong_value ? defaultValue : success_value;
    }
}