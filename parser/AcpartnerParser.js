const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class AcpartnerParser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'Acpartner_Switch_JoinPermission': AcpartnerSwitchJoinPermissionParser
        }
    }
}

// 支持的设备：空调伴侣
AcpartnerParser.modelName = 'acpartner.v3';
module.exports = AcpartnerParser;

class AcpartnerSwitchJoinPermissionParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
        
        this.joinPermissionTimeout = {};
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SWITCH;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Gateway',
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
                    var command = {cmd:"write",model:that.model,sid:deviceSid,data:{join_permission:(value ? 'yes' : 'no')}};
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
        // var value = this.getValueFrJsonObjData(jsonObj, 'channel_0');
        // if(value === 'on') {
            // return true;
        // } else if(value === 'off') {
            // return false;
        // } else {
            // return defaultValue;
        // }
    // }
}