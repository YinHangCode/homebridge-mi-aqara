require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

ElectricCurtainParser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(ElectricCurtainParser, BaseParser);

ElectricCurtainParser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug("[MiAqaraPlatform][DEBUG]" + JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var state = data['status'];
    var curtainLevel = data['curtain_level'] / 1.0;

    var deviceSid = json['sid'];
    this.setCurtainAccessory(deviceSid, state, curtainLevel);
}

ElectricCurtainParser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('Curtain' + deviceSid)];
}

ElectricCurtainParser.prototype.setCurtainAccessory = function(deviceSid, state, curtainLevel) {
    var that = this;
    
    var uuid = UUIDGen.generate('Curtain' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'Curtain');
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.WINDOW_COVERING);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Electric Curtain")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.WindowCovering, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Electric Curtain, deviceSid: " + deviceSid);
    }
    var curtainService = accessory.getService(Service.WindowCovering);
    var stateCharacteristic = curtainService.getCharacteristic(Characteristic.PositionState);
    var curtainLevelCharacteristic = curtainService.getCharacteristic(Characteristic.CurrentPosition);
    if(state === 'open') {
        stateCharacteristic.updateValue(Characteristic.PositionState.INCREASING);
    } else if(state === 'close') {
        stateCharacteristic.updateValue(Characteristic.PositionState.DECREASING);
    } else if(state === 'stop') {
        stateCharacteristic.updateValue(Characteristic.PositionState.STOPPED);
    } else if(state === 'auto') {
//      stateCharacteristic.updateValue();
    } else {
    }
    curtainLevelCharacteristic.updateValue(curtainLevel);
    
    if (stateCharacteristic.listeners('set').length == 0) {
        var that = this;
        stateCharacteristic.on("set", function(value, callback) {
            var key = that.platform.getWriteKeyByDeviceSid(deviceSid);
            var command = '{"cmd":"write","model":"curtain","sid":"' + deviceSid + '","data":"{\\"status\\":\\"' + (value == Characteristic.PositionState.INCREASING ? 'open' : 'close') + '\\", \\"key\\": \\"' + key + '\\"}"}';
            that.platform.sendCommandByDeviceSid(deviceSid, command);
            
            callback();
        });
    }

    if (curtainLevelCharacteristic.listeners('set').length == 0) {
        var that = this;
        curtainLevelCharacteristic.on("set", function(value, callback) {
            var key = that.platform.getWriteKeyByDeviceSid(deviceSid);
            var command = '{"cmd":"write","model":"curtain","sid":"' + deviceSid + '","data":"{\\"curtain_level\\":\\"' + curtain_level + '\\", \\"key\\": \\"' + key + '\\"}"}';
            that.platform.sendCommandByDeviceSid(deviceSid, command);
            
            callback();
        });
    }
}

