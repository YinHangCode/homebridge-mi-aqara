const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class LockParser extends DeviceParser {
    constructor(model, platform, deviceSid) {
        super(model, platform, deviceSid);
    }

    getAccessoriesParserInfo() {
        var parserInfo = {
            'UnlockedSensor_UnlockedSensor': UnlockedSensorUnlockedSensorParser
        };
        //get Config
        var accessoryConfig = this.platform.ConfigUtil.getAccessoryConfig(this.deviceSid);
        if (accessoryConfig) {
            for (var key in accessoryConfig) {
                parserInfo[key] = VirtualBaseMotionParser;
            }
        }
        return parserInfo;
    }
}
//LockParser.modelName = ['lock.aq1'];
//module.exports = LockParser;
