const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');
const moment = require('moment');
const inherits = require('util').inherits;

var Accessory, Service, Characteristic, PlatformAccessory;

class MotionSensorParser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'MotionSensor_MotionSensor': MotionSensorMotionSensorParser
        }
    }
}

// 支持的设备：人体感应
MotionSensorParser.modelName = ['motion', 'sensor_motion'];
module.exports = MotionSensorParser;

class MotionSensorMotionSensorParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
        PlatformAccessory = platform.PlatformAccessory;
        Accessory = platform.Accessory;
        Service = platform.Service;
        Characteristic = platform.Characteristic;
        
       /// /////////////////////////////////////////////////////////////////////////
       // LastActivation Characteristic
       /// ///////////////////////////////////////////////////////////////////////// 
       Characteristic.LastActivation = function() {
         Characteristic.call(this, 'Last Activation', 'E863F11A-079E-48FF-8F27-9C2605A29F52');
         this.setProps({
           format: Characteristic.Formats.UINT32,
           unit: Characteristic.Units.SECONDS,
           perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
         });
         this.value = this.getDefaultValue();
       };
       inherits(Characteristic.LastActivation, Characteristic);
       Characteristic.LastActivation.UUID = 'E863F11A-079E-48FF-8F27-9C2605A29F52';  
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Motion Sensor',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.MotionSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.MotionDetected);
        service.addCharacteristic(that.Characteristic.LastActivation);
        service.getCharacteristic(that.Characteristic.LastActivation);
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
            if(!service.testCharacteristic(that.Characteristic.LastActivation))service.addCharacteristic(that.Characteristic.LastActivation);
            service.getCharacteristic(that.Characteristic.LastActivation);
            var motionDetectedCharacteristic = service.getCharacteristic(that.Characteristic.MotionDetected);
            var value = that.getMotionDetectedCharacteristicValue(jsonObj, null);
            if(null != value) {
                let totallength = accessory.context.loggingService.history.length - 1; 
                let latestTime = accessory.context.loggingService.history[totallength].time;
                let latestStatus = accessory.context.loggingService.history[totallength].status;
                let lastActivation = 0;
                let motionDetected = 0;
                if(value){
                  motionDetected = 1;
                  lastActivation = moment().unix();
                } else {
                  motionDetected = 0;
                  lastActivation = latestTime - accessory.context.loggingService.getInitialTime();
                }
                service.getCharacteristic(that.Characteristic.LastActivation).updateValue(lastActivation);
                motionDetectedCharacteristic.updateValue(value);
                if(motionDetected != latestStatus){
                  accessory.context.loggingService.addEntry({
                    time: moment().unix(),
                    status: motionDetected
                  });
                }
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
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        return (null != value) ? (value === 'motion') : false;
    }
}
