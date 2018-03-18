const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class UnlockedSensorParser extends DeviceParser {
    constructor(model, platform, deviceSid) {
        super(model, platform, deviceSid);
    }

    getAccessoriesParserInfo() {
        var parserInfo = {
            'UnlockedSensor_UnlockedSensor': UnlockedSensorUnlockedSensorParser
        };
        //get Config
        var accessoryConfig = this.platform.ConfigUtil.getAccessoryConfig(this.deviceSid);
        if (accessoryConfig) {
            for (var key in accessoryConfig) {
                parserInfo[key] = VirtualBaseMotionParser;
            }
        }
        return parserInfo;
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
        var value = that.getValueFrJsonObjData(jsonObj, 'unlocked');
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(!value && accessory) {
            var service = accessory.getService(that.Service.MotionSensor);
            var motionDetectedCharacteristic = service.getCharacteristic(that.Characteristic.MotionDetected);
            var value = that.getMotionDetectedCharacteristicValue(jsonObj, null);
            if(null != value) {
                motionDetectedCharacteristic.updateValue(value);
            }

            that.parserBatteryService(accessory, jsonObj);
        }
    }

    getMotionDetectedCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'fing_verified') || this.getValueFrJsonObjData(jsonObj, 'card_verified') || this.getValueFrJsonObjData(jsonObj, 'psw_verified');
        this.platform.ParseUtil.parserAccessories({
            "cmd": "report",
            "model": this.model,
            "sid": jsonObj['sid'],
            "data": JSON.stringify({
                "unlocked": "true",
                "user_id": value
            })});
        return (null != value) ? this.getValueFrJsonObjData(jsonObj, 'verified_wrong') : false;
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
        var value = this.getValueFrJsonObjData(jsonObj, 'user_id');
        return (null != value) ? (value === this.accessoryType) : false;
    }
}
