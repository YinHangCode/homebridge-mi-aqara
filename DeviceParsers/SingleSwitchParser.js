require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

SingleSwitchParser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(SingleSwitchParser, BaseParser);

SingleSwitchParser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug("[MiAqaraPlatform][DEBUG]" + JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var state0 = data['channel_0'];

    var deviceSid = json['sid'];
    this.setSwitchAccessory(deviceSid, state0);
}

SingleSwitchParser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('SingleSwitch' + deviceSid)];
}

SingleSwitchParser.prototype.setSwitchAccessory = function(deviceSid, state0) {
    var that = this;
    
    if(that.platform.getAccessoryDisableFrConfig(deviceSid, 'SingleSwitch')) {
        return;
    }
    
    var aAccessoryCategories = Accessory.Categories.SWITCH;
    var aServiceType = Service.Switch;
    var serviceType = that.platform.getAccessoryServiceTypeFrConfig(deviceSid, 'SingleSwitch');
    if(serviceType == 'Lightbulb') {
        var aAccessoryCategories = Accessory.Categories.LIGHTBULB;
        var aServiceType = Service.Lightbulb;
    }
    
    var uuid = UUIDGen.generate('SingleSwitch' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'SingleSwitch');
        accessory = new PlatformAccessory(accessoryName, uuid, aAccessoryCategories);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Single Switch")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(aServiceType, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.debug("[MiAqaraPlatform][DEBUG]create new accessories - UUID: " + uuid + ", type: Single Switch, deviceSid: " + deviceSid);
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
            var command = '{"cmd":"write","model":"ctrl_neutral1","sid":"' + deviceSid + '","data":"{\\"channel_0\\":\\"' + (value ? 'on' : 'off') + '\\", \\"key\\": \\"' + key + '\\"}"}';
            that.platform.sendCommandByDeviceSid(deviceSid, command);
            
            callback();
        });
    }
}

