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

	var equipmentSid = json['sid'];
	this.setMotionAccessory(equipmentSid, motionDetected, lowBattery, batteryLevel);
}

MotionParser.prototype.getUuidsByEquipmentSid = function(equipmentSid) {
	return [UUIDGen.generate('Mot' + equipmentSid)];
}

MotionParser.prototype.setMotionAccessory = function(equipmentSid, motionDetected, lowBattery, batteryLevel) {
	var uuid = UUIDGen.generate('Mot' + equipmentSid);
	var accessory = this.platform.getAccessoryByUuid(uuid);
	if(null == accessory) {
		var accessoryName = equipmentSid.substring(equipmentSid.length - 4);
		accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
		accessory.reachable = true;

		accessory.getService(Service.AccessoryInformation)
			.setCharacteristic(Characteristic.Manufacturer, "Aqara")
			.setCharacteristic(Characteristic.Model, "Motion Sensor")
			.setCharacteristic(Characteristic.SerialNumber, equipmentSid);

		accessory.addService(Service.MotionSensor, accessoryName);
		accessory.addService(Service.BatteryService, accessoryName);
		this.platform.api.registerPlatformAccessories("homebridge-mi-aqara", "MiAqaraPlatform", [accessory]);
		accessory.on('identify', function(paired, callback) {
			that.log(accessory.displayName, "Identify!!!");
			callback();
		});
		
		this.platform.accessories.push(accessory);
		this.platform.log.debug("create new accessories - UUID: " + uuid + ", type: Motion Sensor, equipmentSid: " + equipmentSid);
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

