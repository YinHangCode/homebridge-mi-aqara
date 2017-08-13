require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

NatgasDetectorParser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(NatgasDetectorParser, BaseParser);

NatgasDetectorParser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug("[MiAqaraPlatform][DEBUG]" + JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var NatgasDetected = ((data['alarm']/1.0) >= 1 );
    var voltage = data['voltage'] / 1.0;
    var lowBattery = this.getLowBatteryByVoltage(voltage);
    var batteryLevel = this.getBatteryLevelByVoltage(voltage);

    var deviceSid = json['sid'];
    this.setNatgasAccessory(deviceSid, NatgasDetected, lowBattery, batteryLevel);
}

NatgasDetectorParser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('natgas' + deviceSid)];
}

NatgasDetectorParser.prototype.setNatgasAccessory = function(deviceSid, NatgasDetected, lowBattery, batteryLevel) {
    var that = this;
    
    if(that.platform.getAccessoryDisableFrConfig(deviceSid, 'natgas')) {
        return;
    }
    
    var uuid = UUIDGen.generate('natgas' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'natgas');
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Natgas Detector")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.SmokeSensor, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Natgas Detector, deviceSid: " + deviceSid);
    }
    var motService = accessory.getService(Service.SmokeSensor);
    var motCharacteristic = motService.getCharacteristic(Characteristic.SmokeDetected);
    motCharacteristic.updateValue(SmokeDetected ? true : false);
    
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