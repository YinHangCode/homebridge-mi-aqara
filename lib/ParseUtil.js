const GatewayParser = require('./../parser/GatewayParser');
const ContactSensorParser = require('./../parser/ContactSensorParser');
const MotionSensorParser = require('./../parser/MotionSensorParser');
const ButtonParser = require('./../parser/ButtonParser');
const TemperatureAndHumiditySensorParser = require('./../parser/TemperatureAndHumiditySensorParser');
const SingleSwitchParser = require('./../parser/SingleSwitchParser');
const DuplexSwitchParser = require('./../parser/DuplexSwitchParser');
const SingleSwitchLNParser = require('./../parser/SingleSwitchLNParser');
const DuplexSwitchLNParser = require('./../parser/DuplexSwitchLNParser');
const SingleButton86Parser = require('./../parser/SingleButton86Parser');
const DuplexButton86Parser = require('./../parser/DuplexButton86Parser');
const PlugBaseParser = require('./../parser/PlugBaseParser');
const PlugBase86Parser = require('./../parser/PlugBase86Parser');
const MagicSquareParser = require('./../parser/MagicSquareParser');
const SmokeDetectorParser = require('./../parser/SmokeDetectorParser');
const NatgasDetectorParser = require('./../parser/NatgasDetectorParser');
const ElectricCurtainParser = require('./../parser/ElectricCurtainParser');
const ContactSensor2Parser = require('./../parser/ContactSensor2Parser');
const MotionSensor2Parser = require('./../parser/MotionSensor2Parser');
const Button2Parser = require('./../parser/Button2Parser');
const TemperatureAndHumiditySensor2Parser = require('./../parser/TemperatureAndHumiditySensor2Parser');
const WaterDetectorParser = require('./../parser/WaterDetectorParser');

class ParseUtil {
    constructor(platform) {
        this.platform = platform;
        this.parsers = {
            'gateway': new GatewayParser(platform), // 网关
            'magnet': new ContactSensorParser(platform), // 门磁感应
            'motion': new MotionSensorParser(platform), // 人体感应
            'switch': new ButtonParser(platform), // 按钮
            'sensor_ht': new TemperatureAndHumiditySensorParser(platform), // 温度湿度传感器
            'ctrl_neutral1': new SingleSwitchParser(platform), // 单按钮墙壁开关
            'ctrl_neutral2': new DuplexSwitchParser(platform), // 双按钮墙壁开关
            'ctrl_ln1': new SingleSwitchLNParser(platform), // 单按钮墙壁开关零火版
            'ctrl_ln2': new DuplexSwitchLNParser(platform), // 双按钮墙壁开关零火版
            '86sw1': new SingleButton86Parser(platform), // 86型无线单按钮开关
            '86sw2': new DuplexButton86Parser(platform), // 86型无线双按钮开关
            'plug': new PlugBaseParser(platform), // 插座
            '86plug': new PlugBase86Parser(platform), // 86型墙壁插座
            'cube': new MagicSquareParser(platform), // 魔方
            'smoke': new SmokeDetectorParser(platform), // 烟雾警报器
            'natgas': new NatgasDetectorParser(platform), // 天然气警报器
            'curtain': new ElectricCurtainParser(platform), // 电动窗帘
            'sensor_magnet.aq2': new ContactSensor2Parser(platform), // 门磁感应 第二代
            'sensor_motion.aq2': new MotionSensor2Parser(platform), // 人体感应 第二代
            'sensor_switch.aq2': new Button2Parser(platform), // 按钮 第二代
            'weather.v1': new TemperatureAndHumiditySensor2Parser(platform), // 温度湿度传感器 第二代
            'sensor_wleak.aq1': new WaterDetectorParser(platform) // 水浸传感器
        }
    }
    
    getByModel(model) {
        return (model in this.parsers) ? this.parsers[model]: null;
    }
    
    getCreateAccessories(jsonObj) {
        var result = [];
        
        var model = jsonObj['model'];
        var parser = this.getByModel(model);
        if(parser) {
            result = parser.getCreateAccessories(jsonObj);
        }
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var result = [];
        
        var model = jsonObj['model'];
        var parser = this.getByModel(model);
        if(parser) {
            result = parser.parserAccessories(jsonObj);
        }
        
        return result;
    }
    
    getAccessoriesUUID(sid, deviceModel) {
        var result = [];
        
        var parser = this.getByModel(deviceModel);
        if(parser) {
            result = parser.getAccessoriesUUID(sid);
        }
        
        return result;
    }
}

module.exports = ParseUtil;