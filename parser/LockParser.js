const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class LockParser extends DeviceParser {
    constructor(platform) {
        super(platform);
    }

    getAccessoriesParserInfo() {
        var parserInfo = {
            'Lock_LockMechanism': LockLockMechanismParser
        };

        return parserInfo;
    }
}
LockParser.modelName = ['lock.aq1'];
module.exports = LockParser;

class LockLockMechanismParser extends AccessoryParser {
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
        
        var service = new that.Service.LockMechanism(accessoryName);
        result.push(service);
        
        var batteryService  = new that.Service.BatteryService(accessoryName);
        batteryService.getCharacteristic(that.Characteristic.StatusLowBattery);
        batteryService.getCharacteristic(that.Characteristic.BatteryLevel);
        batteryService.getCharacteristic(that.Characteristic.ChargingState);
        result.push(batteryService);
        
        // get Config
        var deviceSid = jsonObj['sid'];
        var accessoryConfig = that.platform.ConfigUtil.getAccessoryConfig(deviceSid);
        if (accessoryConfig) {
            for (var key in accessoryConfig) {
                if(key.indexOf('Lock_MotionSensor_') > -1) {
                    var id = key.substring('Lock_MotionSensor_'.length, key.length);
                    var uuid = that.getAccessoryUUID(deviceSid + 'Lock_MotionSensor_' + id);
                    var name = that.platform.ConfigUtil.getAccessoryName(deviceSid, 'Lock_MotionSensor_' + id);
                    var motionSensorService = new that.Service.MotionSensor(name, uuid, id);
                    result.push(motionSensorService);
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
            var service = accessory.getService(that.Service.LockMechanism);
            var lockCurrentStateCharacteristic = service.getCharacteristic(that.Characteristic.LockCurrentState);
            var lockTargetStateCharacteristic = service.getCharacteristic(that.Characteristic.LockTargetState);
            var value = that.getLockTargetStateCharacteristicValue(jsonObj, null);
            if(null != value) {
                lockTargetStateCharacteristic.updateValue(value ? that.Characteristic.LockTargetState.UNSECURED : that.Characteristic.LockTargetState.SECURED);
                setTimeout(() => {
                    lockCurrentStateCharacteristic.updateValue(value ? that.Characteristic.LockCurrentState.UNSECURED : that.Characteristic.LockCurrentState.SECURED);
                }, 100);
            }
            
            var value = that.getMotionSensorCharacteristicValue(jsonObj, null);
            if(null != value) {
                var motionSensorServiceUUID = that.getAccessoryUUID(deviceSid + 'Lock_MotionSensor_' + value);
                var motionSensorService = accessory.getServiceByUUIDAndSubType(motionSensorServiceUUID, value);
                if(motionSensorService) {
                    var motionDetectedCharacteristic = motionSensorService.getCharacteristic(that.Characteristic.MotionDetected);
                    motionDetectedCharacteristic.updateValue(true);
                    setTimeout(() => {
                        motionDetectedCharacteristic.updateValue(false);
                    }, 1 * 60 * 1000);
                }
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (lockTargetStateCharacteristic.listeners('get').length == 0) {
                    lockTargetStateCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getLockTargetStateCharacteristicValue(jsonObj, null);
                            if(null != value) {
                                callback(null, value ? that.Characteristic.LockTargetState.UNSECURED : that.Characteristic.LockTargetState.SECURED);
                                setTimeout(() => {
                                    lockCurrentStateCharacteristic.updateValue(value ? that.Characteristic.LockCurrentState.UNSECURED : that.Characteristic.LockCurrentState.SECURED);
                                }, 100);
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
            
            if(lockTargetStateCharacteristic.listeners('set').length == 0) {
                lockTargetStateCharacteristic.on("set", function(value, callback) {
                    setTimeout(() => {
                        lockTargetStateCharacteristic.updateValue(lockTargetStateCharacteristic.value);
                    }, 100);
                    callback(null);
                });
            }
            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
    
    getMotionSensorCharacteristicValue(jsonObj, defaultValue) {
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