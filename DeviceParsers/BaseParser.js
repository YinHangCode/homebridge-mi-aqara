// Base parser
BaseParser = function() {
	this.platform = null;
}

BaseParser.prototype.init = function(platform) {
	this.platform = platform;
}

BaseParser.prototype.getLowBatteryByVoltage = function(voltage) {
	return isNaN(voltage) ? NaN : (voltage >= 2801 ? 0 : 1);
}

BaseParser.prototype.getBatteryLevelByVoltage = function(voltage) {
	return isNaN(voltage) ? NaN : ((voltage - 2800)/5);
}
