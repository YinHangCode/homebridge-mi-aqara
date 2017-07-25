require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

Button2Parser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(Button2Parser, BaseParser);

Button2Parser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug("[MiAqaraPlatform][DEBUG]" + JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var clickWay = data['status'];
    var voltage = data['voltage'] / 1.0;
    var lowBattery = this.getLowBatteryByVoltage(voltage);
    var batteryLevel = this.getBatteryLevelByVoltage(voltage);

    var deviceSid = json['sid'];
    this.setButtonAccessory(deviceSid, clickWay, lowBattery, batteryLevel);
}

Button2Parser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('Button2' + deviceSid)];
}

Button2Parser.prototype.setButtonAccessory = function(deviceSid, clickWay, lowBattery, batteryLevel) {
    var that = this;
    
    var uuid = UUIDGen.generate('Button2' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'Button2');
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.PROGRAMMABLE_SWITCH);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Button v2")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.StatelessProgrammableSwitch, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Button v2, deviceSid: " + deviceSid);
    }
    var buttonService = accessory.getService(Service.StatelessProgrammableSwitch);
    var buttonCharacteristic = buttonService.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
    if(clickWay === 'click') {
        buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
//      buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.CLICK);
    } else if(clickWay === 'double_click') {
        buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS);
    } else if(clickWay === 'long_click_release') {
        /* 'long_click_press' */
        buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.LONG_PRESS);
    } else {
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

