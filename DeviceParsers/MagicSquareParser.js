require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

MagicSquareParser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(MagicSquareParser, BaseParser);

MagicSquareParser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug(JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var state = data['status'];
    var rotate = data['rotate'];
    var voltage = data['voltage'] / 1.0;
    var lowBattery = this.getLowBatteryByVoltage(voltage);
    var batteryLevel = this.getBatteryLevelByVoltage(voltage);

    var deviceSid = json['sid'];
    this.setFlip90Accessory(deviceSid, state, rotate, lowBattery, batteryLevel);
    this.setFlip180Accessory(deviceSid, state, rotate, lowBattery, batteryLevel);
    this.setMoveAccessory(deviceSid, state, rotate, lowBattery, batteryLevel);
    this.setTapTwiceAccessory(deviceSid, state, rotate, lowBattery, batteryLevel);
    this.setShakeAirAccessory(deviceSid, state, rotate, lowBattery, batteryLevel);
    this.setRotateAccessory(deviceSid, state, rotate, lowBattery, batteryLevel);
}

MagicSquareParser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('MS_Flip90' + deviceSid), 
        UUIDGen.generate('MS_Flip180' + deviceSid), 
        UUIDGen.generate('MS_Move' + deviceSid), 
        UUIDGen.generate('MS_TapTwice' + deviceSid), 
        UUIDGen.generate('MS_ShakeAir' + deviceSid),
        UUIDGen.generate('MS_Rotate' + deviceSid)];
}

MagicSquareParser.prototype.setFlip90Accessory = function(deviceSid, state, rotate, lowBattery, batteryLevel) {
    var that = this;
    
    var uuid = UUIDGen.generate('MS_Flip90' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4) + '_flip90';
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.PROGRAMMABLE_SWITCH);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Magic Square")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.StatelessProgrammableSwitch, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Magic Square Flip90, deviceSid: " + deviceSid);
    }
    var buttonService = accessory.getService(Service.StatelessProgrammableSwitch);
    var buttonCharacteristic = buttonService.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
    if(state === 'flip90') {
        buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
    }
    
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

MagicSquareParser.prototype.setFlip180Accessory = function(deviceSid, state, rotate, lowBattery, batteryLevel) {
    var that = this;
    
    var uuid = UUIDGen.generate('MS_Flip180' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4) + '_flip180';
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.PROGRAMMABLE_SWITCH);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Magic Square")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.StatelessProgrammableSwitch, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Magic Square Flip180, deviceSid: " + deviceSid);
    }
    var buttonService = accessory.getService(Service.StatelessProgrammableSwitch);
    var buttonCharacteristic = buttonService.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
    if(state === 'flip180') {
        buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
    }
    
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
MagicSquareParser.prototype.setMoveAccessory = function(deviceSid, state, rotate, lowBattery, batteryLevel) {
    var that = this;
    
    var uuid = UUIDGen.generate('MS_Move' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4) + '_move';
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.PROGRAMMABLE_SWITCH);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Magic Square")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.StatelessProgrammableSwitch, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Magic Square Move, deviceSid: " + deviceSid);
    }
    var buttonService = accessory.getService(Service.StatelessProgrammableSwitch);
    var buttonCharacteristic = buttonService.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
    if(state === 'move') {
        buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
    }
    
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
MagicSquareParser.prototype.setTapTwiceAccessory = function(deviceSid, state, rotate, lowBattery, batteryLevel) {
    var that = this;
    
    var uuid = UUIDGen.generate('MS_TapTwice' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4) + '_tapTwice';
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.PROGRAMMABLE_SWITCH);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Magic Square")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.StatelessProgrammableSwitch, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Magic Square Tap Twice, deviceSid: " + deviceSid);
    }
    var buttonService = accessory.getService(Service.StatelessProgrammableSwitch);
    var buttonCharacteristic = buttonService.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
    if(state === 'tap_twice') {
        buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
    }
    
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
MagicSquareParser.prototype.setShakeAirAccessory = function(deviceSid, state, rotate, lowBattery, batteryLevel) {
    var that = this;
    
    var uuid = UUIDGen.generate('MS_ShakeAir' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4) + '_shakeAir';
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.PROGRAMMABLE_SWITCH);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Magic Square")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.StatelessProgrammableSwitch, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Magic Square Shake Air, deviceSid: " + deviceSid);
    }
    var buttonService = accessory.getService(Service.StatelessProgrammableSwitch);
    var buttonCharacteristic = buttonService.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
    if(state === 'shake_air') {
        buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
    }
    
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
MagicSquareParser.prototype.setRotateAccessory = function(deviceSid, state, rotate, lowBattery, batteryLevel) {
    var that = this;
    
    var uuid = UUIDGen.generate('MS_Rotate' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4) + '_rotate';
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.PROGRAMMABLE_SWITCH);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Magic Square")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.StatelessProgrammableSwitch, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Magic Square Rotate, deviceSid: " + deviceSid);
    }
    var buttonService = accessory.getService(Service.StatelessProgrammableSwitch);
    var buttonCharacteristic = buttonService.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
    if(rotate != null) {
        buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
    }
    
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