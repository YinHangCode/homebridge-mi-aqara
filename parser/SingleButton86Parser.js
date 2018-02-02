const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');
const SwitchVirtualBasePressParser = require('./SwitchVirtualBasePressParser');

class SingleButton86Parser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'SingleButton86_StatelessProgrammableSwitch': SingleButton86StatelessProgrammableSwitchParser,
            'SingleButton86_Switch_VirtualSinglePress': SingleButton86SwitchVirtualSinglePressParser
            // 'SingleButton86_Switch_VirtualDoublePress': SingleButton86SwitchVirtualDoublePressParser
            // 'SingleButton86_Switch_VirtualLongPress': SingleButton86SwitchVirtualLongPressParser
        }
    }
}

// 支持的设备：86型无线单按钮开关
SingleButton86Parser.modelName = ['86sw1', 'sensor_86sw1.aq1'];
module.exports = SingleButton86Parser;

class SingleButton86StatelessProgrammableSwitchParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.PROGRAMMABLE_SWITCH;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Single Button 86',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.StatelessProgrammableSwitch(accessoryName);
        service.getCharacteristic(that.Characteristic.ProgrammableSwitchEvent);
        result.push(service);
        
        var batteryService  = new that.Service.BatteryService(accessoryName);
        batteryService.getCharacteristic(that.Characteristic.StatusLowBattery);
        batteryService.getCharacteristic(that.Characteristic.BatteryLevel);
        batteryService.getCharacteristic(that.Characteristic.ChargingState);
        result.push(batteryService);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.StatelessProgrammableSwitch);
            var programmableSwitchEventCharacteristic = service.getCharacteristic(that.Characteristic.ProgrammableSwitchEvent);
            programmableSwitchEventCharacteristic.setProps({
                validValues: [0]
            });
            var value = that.getProgrammableSwitchEventCharacteristicValue(jsonObj, null);
            if(null != value) {
                programmableSwitchEventCharacteristic.updateValue(value);
            }
            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
    
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'channel_0');
        if(value === 'click') {
            return this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        } else if(value === 'double_click') {
            return this.Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS;
        } else if(value === 'long_click_release') {
            /* 'long_click_press' */
            return this.Characteristic.ProgrammableSwitchEvent.LONG_PRESS;
        } else {
            return defaultValue;
        }
    }
}

class SingleButton86SwitchVirtualBasePressParser extends SwitchVirtualBasePressParser {
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Button',
            'SerialNumber': deviceSid
        };
    }
}

class SingleButton86SwitchVirtualSinglePressParser extends SingleButton86SwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        return {cmd:"write",model:this.model,sid:deviceSid,data:{channel_0:"click"}};
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var newObj = JSON.parse("{\"cmd\":\"report\",\"model\":\"" + this.model + "\",\"sid\":\"" + deviceSid + "\",\"data\":\"{\\\"channel_0\\\":\\\"click\\\"}\"}");
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

// class SingleButton86SwitchVirtualDoublePressParser extends SingleButton86SwitchVirtualBasePressParser {
    // getWriteCommand(deviceSid, value) {
        // return '{"cmd":"write","model":"86sw1","sid":"' + deviceSid + '","data":"{\\"channel_0\\":\\"double_click\\", \\"key\\": \\"${key}\\"}"}';
    // }
// }

// class SingleButton86SwitchVirtualLongPressParser extends SingleButton86SwitchVirtualBasePressParser {
    // getWriteCommand(deviceSid, value) {
        // return '{"cmd":"write","model":"86sw1","sid":"' + deviceSid + '","data":"{\\"channel_0\\":\\"long_click_press\\", \\"key\\": \\"${key}\\"}"}';
    // }
// }
