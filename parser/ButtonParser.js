const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');
const SwitchVirtualBasePressParser = require('./SwitchVirtualBasePressParser');

class ButtonParser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'Button_StatelessProgrammableSwitch': ButtonStatelessProgrammableSwitchParser,
            'Button_Switch_VirtualSinglePress': ButtonSwitchVirtualSinglePressParser,
            'Button_Switch_VirtualDoublePress': ButtonSwitchVirtualDoublePressParser
            // 'Button_Switch_VirtualLongPress': ButtonSwitchVirtualLongPressParser
        }
    }
}

// 支持的设备：按钮
ButtonParser.modelName = ['switch', 'sensor_switch', 'sensor_switch.aq2'];
module.exports = ButtonParser;

class ButtonStatelessProgrammableSwitchParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.PROGRAMMABLE_SWITCH;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Button',
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
            var value = that.getProgrammableSwitchEventCharacteristicValue(jsonObj, null);
            if(null != value) {
                programmableSwitchEventCharacteristic.updateValue(value);
            }
            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
    
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, this.platform.isProtoVersionByDid(jsonObj['sid'], 2) ? 'channel_0' : 'status');
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

class ButtonSwitchVirtualBasePressParser extends SwitchVirtualBasePressParser {
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Button',
            'SerialNumber': deviceSid
        };
    }
}

class ButtonSwitchVirtualSinglePressParser extends ButtonSwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        var data = this.platform.isProtoVersionByDid(deviceSid, 2) ? {channel_0: 'click'} : {status: 'click'};
        return {cmd:"write",model:this.model,sid:deviceSid,data:data};
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var newObj = JSON.parse("{\"cmd\":\"report\",\"model\":\"" + this.model + "\",\"sid\":\"" + deviceSid + "\",\"data\":\"{\\\"status\\\":\\\"click\\\"}\"}");
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

class ButtonSwitchVirtualDoublePressParser extends ButtonSwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        var data = this.platform.isProtoVersionByDid(deviceSid, 2) ? {channel_0: 'double_click'} : {status: 'double_click'};
        return {cmd:"write",model:this.model,sid:deviceSid,data:data};
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var newObj = JSON.parse("{\"cmd\":\"report\",\"model\":\"" + this.model + "\",\"sid\":\"" + deviceSid + "\",\"data\":\"{\\\"status\\\":\\\"double_click\\\"}\"}");
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

// class ButtonSwitchVirtualLongPressParser extends ButtonSwitchVirtualBasePressParser {
    // getWriteCommand(deviceSid, value) {
        // return '{"cmd":"write","model":"switch","sid":"' + deviceSid + '","data":"{\\"status\\":\\"long_click_press\\", \\"key\\": \\"${key}\\"}"}';
    // }
// }
