const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');
const EveUtil = require('../lib/EveUtil.js');
const moment = require('moment');

const history = [];

class MotionSensorParser extends DeviceParser {
    constructor(platform) {
        super(platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'MotionSensor_MotionSensor': MotionSensorMotionSensorParser
        }
    }
}
MotionSensorParser.modelName = ['motion'];
module.exports = MotionSensorParser;

class MotionSensorMotionSensorParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
        
        this.FakeGatoHistoryService = require('fakegato-history')(platform.api);        
        this.HBpath = platform.api.user.storagePath()+'/accessories';
        this.log = platform.log.log
        
        //EVE
        EveUtil.registerWith(platform.api.hap);
        
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
            
            if(!service.testCharacteristic(that.Characteristic.LastActivation))
              service.addCharacteristic(that.Characteristic.LastActivation);
              
            if(!service.testCharacteristic(that.Characteristic.Sensitivity))
              service.addCharacteristic(that.Characteristic.Sensitivity);
              
            service.getCharacteristic(that.Characteristic.Sensitivity)
              .on('get', callback => callback(null, 0))
              .on('set', (value, callback) => callback())
              .updateValue(0);
              
            if(!service.testCharacteristic(that.Characteristic.Duration))
              service.addCharacteristic(that.Characteristic.Duration);
              
            service.getCharacteristic(that.Characteristic.Duration)
              .on('get', callback => callback(null, 5))
              .on('set', (value, callback) => callback())
              .updateValue(5);
            
           if(!history[accessory.displayName]){
            
              history[accessory.displayName] = new this.FakeGatoHistoryService('motion', accessory, {storage:'fs',path:this.HBpath, disableTimer: false, disableRepeatLastData:false});
              
              history[accessory.displayName].log = this.log;
          
            } 
            
            var value = that.getMotionDetectedCharacteristicValue(jsonObj, null);
            if(null != value) {
                motionDetectedCharacteristic.updateValue(value);
                
                if(value && !accessory.context.cacheValue){
                
                  accessory.context.cacheValue = true;
                
                  let lastActivation = moment().unix() - history[accessory.displayName].getInitialTime();
                  service.getCharacteristic(that.Characteristic.LastActivation)
                  .updateValue(lastActivation);
                
                }
                
                if(!value)
                  accessory.context.cacheValue = false;
           
                history[accessory.displayName].addEntry({time: moment().unix(), status:value});
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
        var value = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(jsonObj['sid']));
        if(1 == proto_version_prefix) {
            value = this.getValueFrJsonObjData1(jsonObj, 'status');
        } else if(2 == proto_version_prefix) {
            value = this.getValueFrJsonObjData2(jsonObj, 'motion_status');
        } else {
        }
        
        return (null != value) ? (value === 'motion') : false;
    }
}
