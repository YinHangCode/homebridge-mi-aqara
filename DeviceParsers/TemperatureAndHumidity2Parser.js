require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

TemperatureAndHumidity2Parser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(TemperatureAndHumidity2Parser, BaseParser);

TemperatureAndHumidity2Parser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug("[MiAqaraPlatform][DEBUG]" + JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var temperature = data['temperature'] / 100.0;
    var humidity = data['humidity'] / 100.0;
    var pressure = data['pressure'] / 1.0;
    var voltage = data['voltage'] / 1.0;
    var lowBattery = this.getLowBatteryByVoltage(voltage);
    var batteryLevel = this.getBatteryLevelByVoltage(voltage);

    var deviceSid = json['sid'];
    if(!isNaN(temperature)) {
        this.setTemperatureAccessory(deviceSid, temperature, lowBattery, batteryLevel);
    }
    if(!isNaN(humidity)) {
        this.setHumidityAccessory(deviceSid, humidity, lowBattery, batteryLevel);
    }
    if(!isNaN(pressure)) {
        this.setPressureAccessory(deviceSid, pressure, lowBattery, batteryLevel);
    }
}

TemperatureAndHumidity2Parser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('Tem2' + deviceSid), UUIDGen.generate('Hum2' + deviceSid)];
}

TemperatureAndHumidity2Parser.prototype.setTemperatureAccessory = function(deviceSid, temperature, lowBattery, batteryLevel) {
    var that = this;
    
    var uuid = UUIDGen.generate('Tem2' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'Tem2');
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Temperature Sensor v2")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.TemperatureSensor, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Temperature Sensor v2, deviceSid: " + deviceSid);
    }
    var temService = accessory.getService(Service.TemperatureSensor);
    var temCharacteristic = temService.getCharacteristic(Characteristic.CurrentTemperature);
    temCharacteristic.updateValue(temperature);
    
    if(!isNaN(lowBattery) && !isNaN(batteryLevel)) {
        var batService = accessory.getService(Service.BatteryService);
        var lowBatCharacteristic = batService.getCharacteristic(Characteristic.StatusLowBattery);
        var batLevelCharacteristic = batService.getCharacteristic(Characteristic.BatteryLevel);
        lowBatCharacteristic.updateValue(lowBattery);
        batLevelCharacteristic.updateValue(batteryLevel);
    }
}

TemperatureAndHumidity2Parser.prototype.setHumidityAccessory = function(deviceSid, humidity, lowBattery, batteryLevel) {
    var that = this;
    
    var uuid = UUIDGen.generate('Hum2' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'Hum2');
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Humidity Sensor v2")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.HumiditySensor, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Humidity Sensor v2, deviceSid: " + deviceSid);
    }
    var humService = accessory.getService(Service.HumiditySensor);
    var humCharacteristic = humService.getCharacteristic(Characteristic.CurrentRelativeHumidity);
    humCharacteristic.updateValue(humidity);
    
    if(!isNaN(lowBattery) && !isNaN(batteryLevel)) {
        var batService = accessory.getService(Service.BatteryService);
        var lowBatCharacteristic = batService.getCharacteristic(Characteristic.StatusLowBattery);
        var batLevelCharacteristic = batService.getCharacteristic(Characteristic.BatteryLevel);
        var chargingStateCharacteristic = batService.getCharacteristic(Characteristic.ChargingState);
        lowBatCharacteristic.updateValue(lowBattery);
        batLevelCharacteristic.updateValue(batteryLevel);
        chargingStateCharacteristic.updateValue(false);
    }
}

TemperatureAndHumidity2Parser.prototype.setPressureAccessory = function(deviceSid, pressure, lowBattery, batteryLevel) {
    var that = this;

}
