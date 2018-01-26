const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class ContactSensorParser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'ContactSensor_ContactSensor': ContactSensorContactSensorParser
        }
    }
}

// 支持的设备：门磁感应
ContactSensorParser.modelName = ['magnet', 'sensor_magnet', 'sensor_magnet.aq2'];
module.exports = ContactSensorParser;

class ContactSensorContactSensorParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Contact Sensor',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.ContactSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.ContactSensorState);
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
            var service = accessory.getService(that.Service.ContactSensor);
            var contactSensorStateCharacteristic = service.getCharacteristic(that.Characteristic.ContactSensorState);
            var value = that.getContactSensorStateCharacteristicValue(jsonObj, null);
            if(null != value) {
                contactSensorStateCharacteristic.updateValue(value ? that.Characteristic.ContactSensorState.CONTACT_DETECTED : that.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (contactSensorStateCharacteristic.listeners('get').length == 0) {
                    contactSensorStateCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getContactSensorStateCharacteristicValue(result, null);
                            if(null != value) {
                                callback(null, value ? that.Characteristic.ContactSensorState.CONTACT_DETECTED : that.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
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
    
    getContactSensorStateCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        return (null != value) ? (value === 'close') : defaultValue;
    }
}
