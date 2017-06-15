require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

DuplexButton86Parser = function(platform) {
    this.init(platform);

    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(DuplexButton86Parser, BaseParser);

DuplexButton86Parser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug(JSON.stringify(json).trim());

    var data = JSON.parse(json['data']);
    var clickWay0 = data['channel_0'];
    var clickWay1 = data['channel_1'];
    var voltage = data['voltage'] / 1.0;
    var lowBattery = this.getLowBatteryByVoltage(voltage);
    var batteryLevel = this.getBatteryLevelByVoltage(voltage);
    var deviceSid = json['sid'];

    this.setButton0Accessory(deviceSid, clickWay0, lowBattery, batteryLevel);
    this.setButton1Accessory(deviceSid, clickWay1, lowBattery, batteryLevel);
}

DuplexButton86Parser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('DuplexButton86_1' + deviceSid), UUIDGen.generate('DuplexButton86_2' + deviceSid)];
}

DuplexButton86Parser.prototype.setButton0Accessory = function(deviceSid, clickWay, lowBattery, batteryLevel) {
    var that = this;

    var uuid = UUIDGen.generate('DuplexButton86_1' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4) + "_L";
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.PROGRAMMABLE_SWITCH);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Duplex Button 86")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.StatelessProgrammableSwitch, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });

        this.platform.registerAccessory(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Duplex Button 86, deviceSid: " + deviceSid);
    }
    var buttonService = accessory.getService(Service.StatelessProgrammableSwitch);
    var buttonCharacteristic = buttonService.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
    if(clickWay === 'click') {
//      buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
        buttonCharacteristic.updateValue(Characteristic.ProgrammableSwitchEvent.CLICK);
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

DuplexButton86Parser.prototype.setButton1Accessory = function(deviceSid, clickWay, lowBattery, batteryLevel) {
    var that = this;

    var uuid = UUIDGen.generate('DuplexButton86_2' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = deviceSid.substring(deviceSid.length - 4) + "_R";
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.PROGRAMMABLE_SWITCH);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Duplex Button 86")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.StatelessProgrammableSwitch, accessoryName);
        accessory.addService(Service.BatteryService, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log(accessory.displayName, "Identify!!!");
            callback();
        });

        this.platform.registerAccessory(accessory);
        this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Duplex Button 86, deviceSid: " + deviceSid);
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
