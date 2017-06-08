require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

TemperatureAndHumidityParser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(TemperatureAndHumidityParser, BaseParser);

TemperatureAndHumidityParser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug(JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var temperature = data['temperature'] / 100.0;
    var humidity = data['humidity'] / 100.0;
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
}

TemperatureAndHumidityParser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('Tem' + deviceSid), UUIDGen.generate('Hum' + deviceSid)];
}

TemperatureAndHumidityParser.prototype.setTemperatureAccessory = function(deviceSid, temperature, lowBattery, batteryLevel) {
	var that = this;
	
    var uuid = UUIDGen.generate('Tem' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4);
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
        accessory.reachable = true;

        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Temperature Sensor")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);

        accessory.addService(Service.TemperatureSensor, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        this.platform.api.registerPlatformAccessories("homebridge-mi-aqara", "MiAqaraPlatform", [accessory]);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });
        
        this.platform.accessories.push(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Temperature Sensor, deviceSid: " + deviceSid);
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

TemperatureAndHumidityParser.prototype.setHumidityAccessory = function(deviceSid, humidity, lowBattery, batteryLevel) {
	var that = this;
	
    var uuid = UUIDGen.generate('Hum' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4);
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
        accessory.reachable = true;

        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Humidity Sensor")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);

        accessory.addService(Service.HumiditySensor, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        this.platform.api.registerPlatformAccessories("homebridge-mi-aqara", "MiAqaraPlatform", [accessory]);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });
        
        this.platform.accessories.push(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Humidity Sensor, deviceSid: " + deviceSid);
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
