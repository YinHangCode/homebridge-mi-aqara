const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');
const SwitchVirtualBasePressParser = require('./SwitchVirtualBasePressParser');

class DuplexButton862Parser extends DeviceParser {
    constructor(platform) {
        super(platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'DuplexButton862_StatelessProgrammableSwitch_Left': DuplexButton862StatelessProgrammableSwitchLeftParser,
            'DuplexButton862_Switch_VirtualSinglePress_Left': DuplexButton862SwitchVirtualSinglePressLeftParser,
            'DuplexButton862_Switch_VirtualDoublePress_Left': DuplexButton862SwitchVirtualDoublePressLeftParser,
         // 'DuplexButton862_Switch_VirtualLongPress_Left': DuplexButton862SwitchVirtualLongPressLeftParser,
            'DuplexButton862_StatelessProgrammableSwitch_Right': DuplexButton862StatelessProgrammableSwitchRightParser,
            'DuplexButton862_Switch_VirtualSinglePress_Right': DuplexButton862SwitchVirtualSinglePressRightParser,
            'DuplexButton862_Switch_VirtualDoublePress_Right': DuplexButton862SwitchVirtualDoublePressRightParser,
         // 'DuplexButton862_Switch_VirtualLongPress_Right': DuplexButton862SwitchVirtualLongPressRightParser,
            'DuplexButton862_StatelessProgrammableSwitch_Both': DuplexButton862StatelessProgrammableSwitchBothParser,
            'DuplexButton862_Switch_VirtualSinglePress_Both': DuplexButton862SwitchVirtualSinglePressBothPressParser
        }
    }
}
DuplexButton862Parser.modelName = ['remote.b286acn01'];
module.exports = DuplexButton862Parser;

class DuplexButton862StatelessProgrammableSwitchBaseParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.PROGRAMMABLE_SWITCH;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Duplex Button 86 2',
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
                validValues: [0, 1]
            });
            var value = that.getProgrammableSwitchEventCharacteristicValue(jsonObj, null);
            if(null != value) {
                programmableSwitchEventCharacteristic.updateValue(value);
            }
            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
}

class DuplexButton862StatelessProgrammableSwitchLeftParser extends DuplexButton862StatelessProgrammableSwitchBaseParser {
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(jsonObj['sid']));
        if(1 == proto_version_prefix) {
            value = this.getValueFrJsonObjData1(jsonObj, 'channel_0');
        } else if(2 == proto_version_prefix) {
            value = this.getValueFrJsonObjData2(jsonObj, 'button_0');
        } else {
        }
        
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

class DuplexButton862StatelessProgrammableSwitchRightParser extends DuplexButton862StatelessProgrammableSwitchBaseParser {
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(jsonObj['sid']));
        if(1 == proto_version_prefix) {
            value = this.getValueFrJsonObjData1(jsonObj, 'channel_1');
        } else if(2 == proto_version_prefix) {
            value = this.getValueFrJsonObjData2(jsonObj, 'button_1');
        } else {
        }
        
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

class DuplexButton862StatelessProgrammableSwitchBothParser extends DuplexButton862StatelessProgrammableSwitchBaseParser {
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'dual_channel');
        
        if(value === 'both_click' || value === 'click') {
            return this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        } else {
            return defaultValue;
        }
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
}

class DuplexButton862SwitchVirtualBasePressParser extends SwitchVirtualBasePressParser {
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Duplex Button 86 2',
            'SerialNumber': deviceSid
        };
    }
}

class DuplexButton862SwitchVirtualSinglePressLeftParser extends DuplexButton862SwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"channel_0":"click", "key": "${key}"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"button_0":"click"}], "key": "${key}"}';
        } else {
        }
        
        return command;
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"channel_0":"click"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"button_0":"click"}]}';
        } else {
        }
        var newObj = JSON.parse(command);
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

class DuplexButton862SwitchVirtualDoublePressLeftParser extends DuplexButton862SwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"channel_0":"double_click", "key": "${key}"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"button_0":"double_click"}], "key": "${key}"}';
        } else {
        }
        
        return command;
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"channel_0":"double_click"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"button_0":"double_click"}]}';
        } else {
        }
        var newObj = JSON.parse(command);
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

// class DuplexButton862SwitchVirtualLongPressLeftParser extends DuplexButton862SwitchVirtualBasePressParser {
    // getWriteCommand(deviceSid, value) {
        // var model = this.platform.getDeviceModelBySid(deviceSid);
        // var command = null;
        // var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        // if(1 == proto_version_prefix) {
            // command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"channel_0":"long_click_press", "key": "${key}"}}';
        // } else if(2 == proto_version_prefix) {
            // command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"button_0":"long_click_press"}], "key": "${key}"}';
        // } else {
        // }
        
        // return command;
    // }
    
    // doSomething(jsonObj) {
        // var deviceSid = jsonObj['sid'];
        // var model = this.platform.getDeviceModelBySid(deviceSid);
        // var command = null;
        // var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        // if(1 == proto_version_prefix) {
            // command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"channel_0":"long_click_press"}}';
        // } else if(2 == proto_version_prefix) {
            // command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"button_0":"long_click_press"}]}';
        // } else {
        // }
        // var newObj = JSON.parse(command);
        // this.platform.ParseUtil.parserAccessories(newObj);
    // }
// }

class DuplexButton862SwitchVirtualSinglePressRightParser extends DuplexButton862SwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"channel_1":"click", "key": "${key}"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"button_1":"click"}], "key": "${key}"}';
        } else {
        }
        
        return command;
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"channel_1":"click"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"button_1":"click"}]}';
        } else {
        }
        var newObj = JSON.parse(command);
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

class DuplexButton862SwitchVirtualDoublePressRightParser extends DuplexButton862SwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"channel_1":"double_click", "key": "${key}"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"button_1":"double_click"}], "key": "${key}"}';
        } else {
        }
        
        return command;
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"channel_1":"double_click"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"button_1":"double_click"}]}';
        } else {
        }
        var newObj = JSON.parse(command);
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

// class DuplexButton862SwitchVirtualLongPressRightParser extends DuplexButton862SwitchVirtualBasePressParser {
    // getWriteCommand(deviceSid, value) {
        // var model = this.platform.getDeviceModelBySid(deviceSid);
        // var command = null;
        // var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        // if(1 == proto_version_prefix) {
            // command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"channel_1":"long_click_press", "key": "${key}"}}';
        // } else if(2 == proto_version_prefix) {
            // command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"button_1":"long_click_press"}], "key": "${key}"}';
        // } else {
        // }
        
        // return command;
    // }
    
    // doSomething(jsonObj) {
        // var deviceSid = jsonObj['sid'];
        // var model = this.platform.getDeviceModelBySid(deviceSid);
        // var command = null;
        // var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        // if(1 == proto_version_prefix) {
            // command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"channel_1":"long_click_press"}}';
        // } else if(2 == proto_version_prefix) {
            // command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"button_1":"long_click_press"}]}';
        // } else {
        // }
        // var newObj = JSON.parse(command);
        // this.platform.ParseUtil.parserAccessories(newObj);
    // }
// }

class DuplexButton862SwitchVirtualSinglePressBothPressParser extends DuplexButton862SwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"dual_channel":"both_click", "key": "${key}"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"dual_channel":"both_click"}], "key": "${key}"}';
        } else {
        }
        
        return command;
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"dual_channel":"both_click"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"dual_channel":"both_click"}]}';
        } else {
        }
        var newObj = JSON.parse(command);
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}
