require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

DuplexSwitchLNParser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(DuplexSwitchLNParser, BaseParser);

DuplexSwitchLNParser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug("[MiAqaraPlatform][DEBUG]" + JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var state0 = data['channel_0'];
    var state1 = data['channel_1'];

    var deviceSid = json['sid'];
    this.setSwitch1Accessory(deviceSid, state0);
    this.setSwitch2Accessory(deviceSid, state1);
}

DuplexSwitchLNParser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('DuplexSwitchLN_1' + deviceSid), UUIDGen.generate('DuplexSwitchLN_2' + deviceSid)];
}

DuplexSwitchLNParser.prototype.setSwitch1Accessory = function(deviceSid, state0) {
    var that = this;
    
    if(that.platform.getAccessoryDisableFrConfig(deviceSid, 'DuplexSwitchLN_1')) {
        return;
    }
    
    var aAccessoryCategories = Accessory.Categories.SWITCH;
    var aServiceType = Service.Switch;
    var serviceType = that.platform.getAccessoryServiceTypeFrConfig(deviceSid, 'DuplexSwitchLN_1');
    if(serviceType == 'Lightbulb') {
        var aAccessoryCategories = Accessory.Categories.LIGHTBULB;
        var aServiceType = Service.Lightbulb;
    }
    
    var uuid = UUIDGen.generate('DuplexSwitchLN_1' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'DuplexSwitchLN_1');
        accessory = new PlatformAccessory(accessoryName, uuid, aAccessoryCategories);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Duplex Switch LN")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(aServiceType, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Duplex Switch LN, deviceSid: " + deviceSid);
    }
    var switchService = accessory.getService(aServiceType);
    var switchCharacteristic = switchService.getCharacteristic(Characteristic.On);
    if(state0 === 'on') {
        switchCharacteristic.updateValue(true);
    } else if(state0 === 'off') {
        switchCharacteristic.updateValue(false);
    } else {
    }
    
    if (switchCharacteristic.listeners('set').length == 0) {
        var that = this;
        switchCharacteristic.on("set", function(value, callback) {
            var key = that.platform.getWriteKeyByDeviceSid(deviceSid);
            var command = '{"cmd":"write","model":"ctrl_ln2","sid":"' + deviceSid + '","data":"{\\"channel_0\\":\\"' + (value ? 'on' : 'off') + '\\", \\"key\\": \\"' + key + '\\"}"}';
            that.platform.sendCommandByDeviceSid(deviceSid, command);
            
            callback();
        });
    }
}

DuplexSwitchLNParser.prototype.setSwitch2Accessory = function(deviceSid, state1) {
    var that = this;

    if(that.platform.getAccessoryDisableFrConfig(deviceSid, 'DuplexSwitchLN_2')) {
        return;
    }
    
    var aAccessoryCategories = Accessory.Categories.SWITCH;
    var aServiceType = Service.Switch;
    var serviceType = that.platform.getAccessoryServiceTypeFrConfig(deviceSid, 'DuplexSwitchLN_2');
    if(serviceType == 'Lightbulb') {
        var aAccessoryCategories = Accessory.Categories.LIGHTBULB;
        var aServiceType = Service.Lightbulb;
    }
    
    var uuid = UUIDGen.generate('DuplexSwitchLN_2' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'DuplexSwitchLN_2');
        accessory = new PlatformAccessory(accessoryName, uuid, aAccessoryCategories);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Duplex Switch LN")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(aServiceType, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Duplex Switch LN, deviceSid: " + deviceSid);
    }
    var switchService = accessory.getService(aServiceType);
    var switchCharacteristic = switchService.getCharacteristic(Characteristic.On);
    if(state1 === 'on') {
        switchCharacteristic.updateValue(true);
    } else if(state1 === 'off') {
        switchCharacteristic.updateValue(false);
    } else {
    }
    
    if (switchCharacteristic.listeners('set').length == 0) {
        var that = this;
        switchCharacteristic.on("set", function(value, callback) {
            var key = that.platform.getWriteKeyByDeviceSid(deviceSid);
            var command = '{"cmd":"write","model":"ctrl_ln2","sid":"' + deviceSid + '","data":"{\\"channel_1\\":\\"' + (value ? 'on' : 'off') + '\\", \\"key\\": \\"' + key + '\\"}"}';
            that.platform.sendCommandByDeviceSid(deviceSid, command);
            
            callback();
        });
    }
}