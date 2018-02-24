const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');
const SwitchVirtualBasePressParser = require('./SwitchVirtualBasePressParser');

class MagicSquareParser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'MagicSquare_StatelessProgrammableSwitch_Flip90': MagicSquareStatelessProgrammableSwitchFlip90Parser,
            'MagicSquare_StatelessProgrammableSwitch_Flip180': MagicSquareStatelessProgrammableSwitchFlip180Parser,
            'MagicSquare_StatelessProgrammableSwitch_Move': MagicSquareStatelessProgrammableSwitchMoveParser,
            'MagicSquare_StatelessProgrammableSwitch_TapTwice': MagicSquareStatelessProgrammableSwitchTapTwiceParser,
            'MagicSquare_StatelessProgrammableSwitch_ShakeAir': MagicSquareStatelessProgrammableSwitchShakeAirParser,
            'MagicSquare_StatelessProgrammableSwitch_Rotate': MagicSquareStatelessProgrammableSwitchRotateParser,
            'MagicSquare_Switch_VirtualFlip90': MagicSquareSwitchVirtualFlip90Parser,
            'MagicSquare_Switch_VirtualFlip180': MagicSquareSwitchVirtualFlip180Parser,
            'MagicSquare_Switch_VirtualMove': MagicSquareSwitchVirtualMoveParser,
            'MagicSquare_Switch_VirtualTapTwice': MagicSquareSwitchVirtualTapTwiceParser,
            'MagicSquare_Switch_VirtualShakeAir': MagicSquareSwitchVirtualShakeAirParser
        }
    }
}

// 支持的设备：魔方
MagicSquareParser.modelName = ['cube', 'sensor_cube'];
module.exports = MagicSquareParser;

class MagicSquareStatelessProgrammableSwitchBaseParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.PROGRAMMABLE_SWITCH;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Magic Square',
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
}

class MagicSquareStatelessProgrammableSwitchFlip90Parser extends MagicSquareStatelessProgrammableSwitchBaseParser {
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        if(value === 'flip90') {
            return this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        } else {
            return defaultValue;
        }
    }
}

class MagicSquareStatelessProgrammableSwitchFlip180Parser extends MagicSquareStatelessProgrammableSwitchBaseParser {
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        if(value === 'flip180') {
            return this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        } else {
            return defaultValue;
        }
    }
}

class MagicSquareStatelessProgrammableSwitchMoveParser extends MagicSquareStatelessProgrammableSwitchBaseParser {
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        if(value === 'move') {
            return this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        } else {
            return defaultValue;
        }
    }
}

class MagicSquareStatelessProgrammableSwitchTapTwiceParser extends MagicSquareStatelessProgrammableSwitchBaseParser {
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        if(value === 'tap_twice') {
            return this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        } else {
            return defaultValue;
        }
    }
}

class MagicSquareStatelessProgrammableSwitchShakeAirParser extends MagicSquareStatelessProgrammableSwitchBaseParser {
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'status');
        if(value === 'shake_air') {
            return this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        } else {
            return defaultValue;
        }
    }
}

class MagicSquareStatelessProgrammableSwitchRotateParser extends MagicSquareStatelessProgrammableSwitchBaseParser {
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'rotate');
        if(null != value) {
            return this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        } else {
            return defaultValue;
        }
    }
}

class MagicSquareSwitchVirtualBaseParser extends SwitchVirtualBasePressParser {
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Magic Square',
            'SerialNumber': deviceSid
        };
    }
}

class MagicSquareSwitchVirtualFlip90Parser extends MagicSquareSwitchVirtualBaseParser {
    getWriteCommand(deviceSid, value) {
        return {cmd:"write",model:this.model,sid:deviceSid,data:{tatus:"flip90"}};
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var newObj = JSON.parse("{\"cmd\":\"report\",\"model\":\"" + this.model + "\",\"sid\":\"" + deviceSid + "\",\"data\":\"{\\\"status\\\":\\\"flip90\\\"}\"}");
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

class MagicSquareSwitchVirtualFlip180Parser extends MagicSquareSwitchVirtualBaseParser {
    getWriteCommand(deviceSid, value) {
        return {cmd:"write",model:this.model,sid:deviceSid,data:{tatus:"flip180"}};
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var newObj = JSON.parse("{\"cmd\":\"report\",\"model\":\"" + this.model + "\",\"sid\":\"" + deviceSid + "\",\"data\":\"{\\\"status\\\":\\\"flip180\\\"}\"}");
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

class MagicSquareSwitchVirtualMoveParser extends MagicSquareSwitchVirtualBaseParser {
    getWriteCommand(deviceSid, value) {
        return {cmd:"write",model:this.model,sid:deviceSid,data:{tatus:"move"}};
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var newObj = JSON.parse("{\"cmd\":\"report\",\"model\":\"" + this.model + "\",\"sid\":\"" + deviceSid + "\",\"data\":\"{\\\"status\\\":\\\"move\\\"}\"}");
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

class MagicSquareSwitchVirtualTapTwiceParser extends MagicSquareSwitchVirtualBaseParser {
    getWriteCommand(deviceSid, value) {
        return {cmd:"write",model:this.model,sid:deviceSid,data:{tatus:"tap_twice"}};
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var newObj = JSON.parse("{\"cmd\":\"report\",\"model\":\"" + this.model + "\",\"sid\":\"" + deviceSid + "\",\"data\":\"{\\\"status\\\":\\\"tap_twice\\\"}\"}");
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

class MagicSquareSwitchVirtualShakeAirParser extends MagicSquareSwitchVirtualBaseParser {
    getWriteCommand(deviceSid, value) {
        return {cmd:"write",model:this.model,sid:deviceSid,data:{tatus:"shake_air"}};
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var newObj = JSON.parse("{\"cmd\":\"report\",\"model\":\"" + this.model + "\",\"sid\":\"" + deviceSid + "\",\"data\":\"{\\\"status\\\":\\\"shake_air\\\"}\"}");
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}
