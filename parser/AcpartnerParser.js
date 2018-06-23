const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class AcPartnerParser extends DeviceParser {
    constructor(platform) {
        super(platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'AcPartner_LightSensor': AcPartnerLightSensorParser,
            'AcPartner_Switch_JoinPermission': AcPartnerSwitchJoinPermissionParser
        }
    }
}
AcPartnerParser.modelName = ['acpartner.v3'];
AcPartnerParser.isGateway = true;
module.exports = AcPartnerParser;

class AcPartnerLightSensorParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'AcPartner',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.LightSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.CurrentAmbientLightLevel);
        result.push(service);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.LightSensor);
            
            var currentAmbientLightLevelCharacteristic = service.getCharacteristic(that.Characteristic.CurrentAmbientLightLevel);
            var value = that.getCurrentAmbientLightLevelCharacteristicValue(jsonObj, 0.0001);
            if(value) {
                currentAmbientLightLevelCharacteristic.updateValue(value);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (currentAmbientLightLevelCharacteristic.listeners('get').length == 0) {
                    currentAmbientLightLevelCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getCurrentAmbientLightLevelCharacteristicValue(result, 0.0001);
                            if(value) {
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
        }
    }
    
    getCurrentAmbientLightLevelCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData2(jsonObj, 'illumination');
        if(null != value) {
            var illumination = value / 1.0;
//            var illumination = value / 1.0 - 279;
            if(!isNaN(illumination)) {
                return illumination > 0 ? illumination : 0.0001;
            } else {
                return 0.0001;
            }
        } else {
            return defaultValue;
        }
    }
}

class AcPartnerSwitchJoinPermissionParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
        
        this.joinPermissionTimeout = {};
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SWITCH;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'AcPartner',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.Switch(accessoryName);
        service.getCharacteristic(that.Characteristic.On);
        result.push(service);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.Switch);
            var onCharacteristic = service.getCharacteristic(that.Characteristic.On);
            // var value = that.getOnCharacteristicValue(jsonObj, null);
            // if(null != value) {
                // onCharacteristic.updateValue(value);
            // }
            
            // if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                // if (onCharacteristic.listeners('get').length == 0) {
                    // onCharacteristic.on("get", function(callback) {
                        // var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        // that.platform.sendReadCommand(deviceSid, command).then(result => {
                            // var value = that.getOnCharacteristicValue(result, null);
                            // if(null != value) {
                                // callback(null, value);
                            // } else {
                                // callback(new Error('get value fail: ' + result));
                            // }
                        // }).catch(function(err) {
                            // that.platform.log.error(err);
                            // callback(err);
                        // });
                    // });
                // }
            // }
            
            if(onCharacteristic.listeners('set').length == 0) {
                onCharacteristic.on("set", function(value, callback) {
                    clearTimeout(that.joinPermissionTimeout[deviceSid]);
                    var model = that.platform.getDeviceModelBySid(deviceSid);
                    var command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"join_permission":"' + (value ? 'yes' : 'no') + '"}], "key": "${key}"}';
                    if(that.platform.ConfigUtil.getAccessoryIgnoreWriteResult(deviceSid, that.accessoryType)) {
                        that.platform.sendWriteCommandWithoutFeedback(deviceSid, command);
                        that.callback2HB(deviceSid, this, callback, null);
                        if(value) {
                            that.joinPermissionTimeout[deviceSid] = setTimeout(() => {
                                onCharacteristic.updateValue(false);
                            }, 30 * 1000);
                        }
                    } else {
                        that.platform.sendWriteCommand(deviceSid, command).then(result => {
                            that.callback2HB(deviceSid, this, callback, null);
                            if(value) {
                                that.joinPermissionTimeout[deviceSid] = setTimeout(() => {
                                    onCharacteristic.updateValue(false);
                                }, 30 * 1000);
                            }
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            that.callback2HB(deviceSid, this, callback, err);
                        });
                    }
                });
            }
        }
    }
    
    // getOnCharacteristicValue(jsonObj, defaultValue) {
        // var value = this.getValueFrJsonObjData2(jsonObj, 'join_permission');
        // if(value === 'on') {
            // return true;
        // } else if(value === 'off') {
            // return false;
        // } else {
            // return defaultValue;
        // }
    // }
}