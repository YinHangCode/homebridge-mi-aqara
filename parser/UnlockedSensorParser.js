const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class UnlockedSensorParser extends DeviceParser {
    constructor(model, platform, deviceSid) {
        super(model, platform, deviceSid);
    }

    getAccessoriesParserInfo() {
        //get Config
        var accessoryConfig = this.platform.ConfigUtil.getAccessoryConfig(this.deviceSid);
        console.log(accessoryConfig);
        return {
            'UnlockedSensor_UnlockedSensor': UnlockedSensorUnlockedSensorParser,
            '65536': VirtualBaseMotionParser
        }
    }
}

// 支持的设备：门锁
UnlockedSensorParser.modelName = ['lock.aq1'];
module.exports = UnlockedSensorParser;

class UnlockedSensorUnlockedSensorParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType);
    }

    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }

    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Unlocked Sensor',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];

        var service = new that.Service.MotionSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.MotionDetected);
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
            var service = accessory.getService(that.Service.MotionSensor);
            var motionDetectedCharacteristic = service.getCharacteristic(that.Characteristic.MotionDetected);
            var value = that.getMotionDetectedCharacteristicValue(jsonObj, null);
            if(null != value) {
                motionDetectedCharacteristic.updateValue(value);
            }

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

            that.parserBatteryService(accessory, jsonObj);
        }
    }

    getMotionDetectedCharacteristicValue(jsonObj, defaultValue) {
        var newObj = JSON.parse("{\"cmd\":\"report\",\"model\":\"sensor_motion\",\"sid\":\"65536\",\"data\":\"{\\\"status\\\":\\\"motion\\\"}\"}");
        this.platform.ParseUtil.parserAccessories(newObj);
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        return (null != value) ? (value === 'motion') : false;
    }
}

class VirtualBaseMotionParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }

    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }

    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Unlocked Sensor',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];

        var service = new that.Service.MotionSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.MotionDetected);
        result.push(service);

        return result;
    }

    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.MotionSensor);
            var motionDetectedCharacteristic = service.getCharacteristic(that.Characteristic.MotionDetected);
            var value = that.getMotionDetectedCharacteristicValue(jsonObj, null);
            if(null != value) {
                motionDetectedCharacteristic.updateValue(value);
            }
        }
    }

    getMotionDetectedCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        return (null != value) ? (value === 'motion') : false;
    }
}
