require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

MotionParser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(MotionParser, BaseParser);

MotionParser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug(JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var motionDetected = (data['status'] === 'motion');
    var voltage = data['voltage'] / 1.0;
    var lowBattery = this.getLowBatteryByVoltage(voltage);
    var batteryLevel = this.getBatteryLevelByVoltage(voltage);

    var deviceSid = json['sid'];
    this.setMotionAccessory(deviceSid, motionDetected, lowBattery, batteryLevel);
}

MotionParser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('Mot' + deviceSid)];
}

MotionParser.prototype.setMotionAccessory = function(deviceSid, motionDetected, lowBattery, batteryLevel) {
    var uuid = UUIDGen.generate('Mot' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4);
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
        accessory.reachable = true;

        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Motion Sensor")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);

        accessory.addService(Service.MotionSensor, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        this.platform.api.registerPlatformAccessories("homebridge-mi-aqara", "MiAqaraPlatform", [accessory]);
        accessory.on('identify', function(paired, callback) {
            that.log(accessory.displayName, "Identify!!!");
            callback();
        });
        
        this.platform.accessories.push(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Motion Sensor, deviceSid: " + deviceSid);
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

