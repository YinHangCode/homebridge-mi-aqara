const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');
const EveUtil = require('../lib/EveUtil.js');
const moment = require('moment');

const history = [];

class ContactSensor2Parser extends DeviceParser {
    constructor(platform) {
        super(platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'ContactSensor2_ContactSensor': ContactSensor2ContactSensorParser
        }
    }
}
ContactSensor2Parser.modelName = ['sensor_magnet.aq2'];
module.exports = ContactSensor2Parser;

class ContactSensor2ContactSensorParser extends AccessoryParser {
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
            'Model': 'Contact Sensor 2',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.ContactSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.ContactSensorState);
        
        service.addCharacteristic(that.Characteristic.LastActivation);
        service.addCharacteristic(that.Characteristic.TimesOpened);
        service.addCharacteristic(that.Characteristic.OpenDuration);
        service.addCharacteristic(that.Characteristic.ClosedDuration);
        
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
            
            if(!history[accessory.displayName]){
            
              history[accessory.displayName] = new this.FakeGatoHistoryService('door', accessory, {storage:'fs',path:this.HBpath, disableTimer: false, disableRepeatLastData:false});              
              history[accessory.displayName].log = this.log;
          
            } 
            
            if(null != value) {
                contactSensorStateCharacteristic.updateValue(value ? that.Characteristic.ContactSensorState.CONTACT_DETECTED : that.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
                
                value = value ? 0 : 1;
                
                if(value && !accessory.context.cacheValue){
                
                  accessory.context.timesOpened = accessory.context.timesOpened ? accessory.context.timesOpened : 0;                  
                  accessory.context.timesOpened += 1;                
                  accessory.context.cacheValue = true;
                  
                  let lastActivation = moment().unix() - history[accessory.displayName].getInitialTime();          
                  let closeDuration = moment().unix() - history[accessory.displayName].getInitialTime();
                
                  service.getCharacteristic(that.Characteristic.LastActivation)
                    .updateValue(lastActivation);
                  
                  service.getCharacteristic(that.Characteristic.ClosedDuration)
                    .updateValue(closeDuration);
                  
                  service.getCharacteristic(that.Characteristic.TimesOpened)
                    .updateValue(accessory.context.timesOpened);
                
                }
                
                if(!value && accessory.context.cacheValue){
                  accessory.context.cacheValue = false;
                  
                  let openDuration = moment().unix() - history[accessory.displayName].getInitialTime();
                  
                  service.getCharacteristic(that.Characteristic.OpenDuration)
                    .updateValue(openDuration);
                }
                
                history[accessory.displayName].addEntry({time: moment().unix(), status:value});
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
        var value = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(jsonObj['sid']));
        if(1 == proto_version_prefix) {
            value = this.getValueFrJsonObjData1(jsonObj, 'status');
        } else if(2 == proto_version_prefix) {
            value = this.getValueFrJsonObjData2(jsonObj, 'window_status');
        } else {
        }
        
        return (null != value) ? (value === 'close') : defaultValue;
    }
}
