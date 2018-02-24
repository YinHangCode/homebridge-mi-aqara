const AccessoryParser = require('./AccessoryParser');

class SwitchVirtualBasePressParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SWITCH;
    }
    
    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.Switch(accessoryName);
        service.getCharacteristic(that.Characteristic.On);
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
            var service = accessory.getService(that.Service.Switch);
            var onCharacteristic = service.getCharacteristic(that.Characteristic.On);
            
            if(onCharacteristic.listeners('set').length == 0) {
                onCharacteristic.on("set", function(value, callback) {
                    var command = that.getWriteCommand(deviceSid, value);
                    if(that.platform.ConfigUtil.getAccessoryIgnoreWriteResult(deviceSid, that.accessoryType)) {
                        that.platform.sendWriteCommandWithoutFeedback(deviceSid, command);
                        that.callback2HB(deviceSid, this, callback, null);
                        that.doSomething(jsonObj);
                        setTimeout(() => {
                            onCharacteristic.updateValue(false);
                        }, 10);
                    } else {
                        that.platform.sendWriteCommand(deviceSid, command).then(result => {
                            that.callback2HB(deviceSid, this, callback, null);
                            that.doSomething(jsonObj);
                            setTimeout(() => {
                                onCharacteristic.updateValue(false);
                            }, 10);
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            that.callback2HB(deviceSid, this, callback, err);
                        });
                    }
                });
            }
            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
    
    doSomething(jsonObj) {
    }
}

module.exports = SwitchVirtualBasePressParser;
