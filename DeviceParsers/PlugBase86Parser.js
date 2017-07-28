require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

PlugBase86Parser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(PlugBase86Parser, BaseParser);

PlugBase86Parser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug("[MiAqaraPlatform][DEBUG]" + JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var state = data['status'];
    var inuse = data['inuse'];

    var deviceSid = json['sid'];
    this.setPlugAccessory(deviceSid, state, inuse);
}

PlugBase86Parser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('Plug86' + deviceSid)];
}

PlugBase86Parser.prototype.setPlugAccessory = function(deviceSid, state, inuse) {
    var that = this;
    
    if(that.platform.getAccessoryDisableFrConfig(deviceSid, 'Plug86')) {
        return;
    }
    
    var uuid = UUIDGen.generate('Plug86' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'Plug86');
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.OUTLET);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Plug Base 86")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.Outlet, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Plug Base 86, deviceSid: " + deviceSid);
    }
    var plugService = accessory.getService(Service.Outlet);
    var plugCharacteristic = plugService.getCharacteristic(Characteristic.On);
    var inuseCharacteristic = plugService.getCharacteristic(Characteristic.OutletInUse);
    if(state === 'on') {
        plugCharacteristic.updateValue(true);
        inuseCharacteristic.updateValue(true);
    } else if(state === 'off') {
        plugCharacteristic.updateValue(false);
        inuseCharacteristic.updateValue(false);
    } else {
    }
    
    if (plugCharacteristic.listeners('set').length == 0) {
        var that = this;
        plugCharacteristic.on("set", function(value, callback) {
            var key = that.platform.getWriteKeyByDeviceSid(deviceSid);
            var command = '{"cmd":"write","model":"86plug","sid":"' + deviceSid + '","data":"{\\"status\\":\\"' + (value ? 'on' : 'off') + '\\", \\"key\\": \\"' + key + '\\"}"}';
            that.platform.sendCommandByDeviceSid(deviceSid, command);
            var readCommand = '{"cmd":"read", "sid":"' + deviceSid + '"}';
            that.platform.sendCommandByDeviceSid(deviceSid, readCommand);
            
            callback();
        });
    }

}
