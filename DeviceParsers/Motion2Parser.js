require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

Motion2Parser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(Motion2Parser, BaseParser);

Motion2Parser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug("[MiAqaraPlatform][DEBUG]" + JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var motionDetected = (data['status'] === 'motion') && (json['cmd'] === 'report');
    var lux = data['lux'] / 1.0;
    var voltage = data['voltage'] / 1.0;
    var lowBattery = this.getLowBatteryByVoltage(voltage);
    var batteryLevel = this.getBatteryLevelByVoltage(voltage);

    var deviceSid = json['sid'];
    this.setMotionAccessory(deviceSid, motionDetected, lowBattery, batteryLevel);
    if(!isNaN(lux)) {
        this.setLuxAccessory(deviceSid, lux, lowBattery, batteryLevel);
    }
}

Motion2Parser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('Mot2' + deviceSid), UUIDGen.generate('Mot2LS' + deviceSid)];
}

Motion2Parser.prototype.setMotionAccessory = function(deviceSid, motionDetected, lowBattery, batteryLevel) {
    var that = this;
    
    if(that.platform.getAccessoryDisableFrConfig(deviceSid, 'Mot2')) {
        return;
    }
    
    var uuid = UUIDGen.generate('Mot2' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'Mot2');
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Motion Sensor v2")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.MotionSensor, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Motion Sensor v2, deviceSid: " + deviceSid);
    }
    var motService = accessory.getService(Service.MotionSensor);
    var motCharacteristic = motService.getCharacteristic(Characteristic.MotionDetected);
    motCharacteristic.updateValue(motionDetected);
    
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

Motion2Parser.prototype.setLuxAccessory = function(deviceSid, lux, lowBattery, batteryLevel) {
    var that = this;
    
    if(that.platform.getAccessoryDisableFrConfig(deviceSid, 'Mot2LS')) {
        return;
    }
    
    var uuid = UUIDGen.generate('Mot2LS' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'Mot2LS');
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Motion v2 Light Sensor")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.LightSensor, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Motion v2 Light Sensor, deviceSid: " + deviceSid);
    }
    var luxService = accessory.getService(Service.LightSensor);
    var luxCharacteristic = luxService.getCharacteristic(Characteristic.CurrentAmbientLightLevel);
    luxCharacteristic.updateValue(lux > 0 ? lux : 0.0001);
    
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

