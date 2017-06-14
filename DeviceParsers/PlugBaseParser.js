require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

PlugBaseParser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(PlugBaseParser, BaseParser);

PlugBaseParser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug(JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var state = data['status'];
    
    var inuse = data['inuse'];
    var voltage = data['voltage'] / 1.0;

    var deviceSid = json['sid'];
    this.setPlugAccessory(deviceSid, state, inuse);
}

PlugBaseParser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('Plug' + deviceSid)];
}

PlugBaseParser.prototype.setPlugAccessory = function(deviceSid, state, inuse) {
    var that = this;
    
    var uuid = UUIDGen.generate('Plug' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4);
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.OUTLET);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Plug Base")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.Outlet, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Plug Base, deviceSid: " + deviceSid);
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
    
    var batService = accessory.getService(Service.BatteryService);
    var chargingStateCharacteristic = batService.getCharacteristic(Characteristic.ChargingState);
    chargingStateCharacteristic.updateValue(true);
    
    if (plugCharacteristic.listeners('set').length == 0) {
        var that = this;
        plugCharacteristic.on("set", function(value, callback) {
            var key = that.platform.getWriteKeyByDeviceSid(deviceSid);
            var command = '{"cmd":"write","model":"plug","sid":"' + deviceSid + '","data":"{\\"status\\":\\"' + (value ? 'on' : 'off') + '\\", \\"key\\": \\"' + key + '\\"}"}';
            that.platform.sendCommandByDeviceSid(deviceSid, command);
            var readCommand = '{"cmd":"read", "sid":"' + deviceSid + '"}';
            that.platform.sendCommandByDeviceSid(deviceSid, readCommand);
            
            callback();
        });
    }

}

