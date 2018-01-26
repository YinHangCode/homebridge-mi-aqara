const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class TemperatureAndHumiditySensor2Parser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'TemperatureAndHumiditySensor2_TemperatureSensor': TemperatureAndHumiditySensor2TemperatureSensorParser,
            'TemperatureAndHumiditySensor2_HumiditySensor': TemperatureAndHumiditySensor2HumiditySensorParser
//          'TemperatureAndHumiditySensor2_BarometricSensor': TemperatureAndHumiditySensor2BarometricSensorParser
        }
    }
}

// 支持的设备：温度湿度传感器 第二代
TemperatureAndHumiditySensor2Parser.modelName = ['weather.v1', 'weather'];
module.exports = TemperatureAndHumiditySensor2Parser;

class TemperatureAndHumiditySensor2TemperatureSensorParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Temperature And Humidity Sensor 2',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.TemperatureSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.CurrentTemperature);
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
            var service = accessory.getService(that.Service.TemperatureSensor);
            var currentTemperatureCharacteristic = service.getCharacteristic(that.Characteristic.CurrentTemperature);
            currentTemperatureCharacteristic.setProps({
                maxValue: 80,
                minValue: -40
            });
            var value = that.getCurrentTemperatureCharacteristicValue(jsonObj, null);
            if(null != value) {
                currentTemperatureCharacteristic.updateValue(value);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (currentTemperatureCharacteristic.listeners('get').length == 0) {
                    currentTemperatureCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getCurrentTemperatureCharacteristicValue(result, null);
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
    
    getCurrentTemperatureCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'temperature');
        return (null != value) ? (value / 100.0) : defaultValue;
    }
}

class TemperatureAndHumiditySensor2HumiditySensorParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Temperature And Humidity Sensor 2',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.HumiditySensor(accessoryName);
        service.getCharacteristic(that.Characteristic.CurrentRelativeHumidity);
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
            var service = accessory.getService(that.Service.HumiditySensor);
            var currentRelativeHumidityCharacteristic = service.getCharacteristic(that.Characteristic.CurrentRelativeHumidity);
            var value = that.getCurrentRelativeHumidityCharacteristicValue(jsonObj, null);
            if(null != value) {
                currentRelativeHumidityCharacteristic.updateValue(value);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (currentRelativeHumidityCharacteristic.listeners('get').length == 0) {
                    currentRelativeHumidityCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getCurrentRelativeHumidityCharacteristicValue(result, null);
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
    
    getCurrentRelativeHumidityCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'humidity');
        return (null != value) ? (value / 100.0) : defaultValue;
    }
}
/*
class TemperatureAndHumiditySensor2BarometricSensorParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Temperature And Humidity Sensor 2',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.BarometricSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.CurrentBarometric);
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
            var service = accessory.getService(that.Service.BarometricSensor);
            var currentBarometricCharacteristic = service.getCharacteristic(that.Characteristic.CurrentBarometric);
            var value = that.getCurrentBarometricCharacteristicValue(jsonObj, null);
            if(null != value) {
                currentBarometricCharacteristic.updateValue(value);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (currentBarometricCharacteristic.listeners('get').length == 0) {
                    currentBarometricCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getCurrentBarometricCharacteristicValue(result, null);
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
    
    getCurrentBarometricCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'pressure');
        return (null != value) ? (value / 1.0) : defaultValue;
    }
}
*/