require('./BaseParser');
const inherits = require('util').inherits;

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

GatewayParser = function(platform) {
    this.init(platform);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
}
inherits(GatewayParser, BaseParser);

GatewayParser.prototype.parse = function(json, rinfo) {
    this.platform.log.debug("[MiAqaraPlatform][DEBUG]" + JSON.stringify(json).trim());
    
    var data = JSON.parse(json['data']);
    var rgb = data['rgb'];
    var illumination = data['illumination'] / 1.0 - 279;
    var proto_version = data['proto_version'];
    var mid = data['mid'];

    var deviceSid = json['sid'];
    if(!isNaN(illumination)) {
        this.setIlluminationAccessory(deviceSid, illumination);
    }
    this.setLightAccessory(deviceSid, rgb);
}

GatewayParser.prototype.getUuidsByDeviceSid = function(deviceSid) {
    return [UUIDGen.generate('GW_LS' + deviceSid), UUIDGen.generate('GW_Light' + deviceSid)];
}

GatewayParser.prototype.setIlluminationAccessory = function(deviceSid, illumination) {
    var that = this;
    
    if(that.platform.getAccessoryDisableFrConfig(deviceSid, 'GW_LS')) {
        return;
    }
    
    var uuid = UUIDGen.generate('GW_LS' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'GW_LS');
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Light Sensor")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.LightSensor, accessoryName);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Light Sensor, deviceSid: " + deviceSid);
    }
    var illService = accessory.getService(Service.LightSensor);
    var illCharacteristic = illService.getCharacteristic(Characteristic.CurrentAmbientLightLevel);
    illCharacteristic.updateValue(illumination > 0 ? illumination : 0);
}

GatewayParser.prototype.setLightAccessory = function(deviceSid, rawRgb) {
    var that = this;
    
    if(that.platform.getAccessoryDisableFrConfig(deviceSid, 'GW_Light')) {
        return;
    }
    
    var uuid = UUIDGen.generate('GW_Light' + deviceSid);
    var accessory = this.platform.getAccessoryByUuid(uuid);
    if(null == accessory) {
        var accessoryName = that.platform.getAccessoryNameFrConfig(deviceSid, 'GW_Light');
        accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.LIGHTBULB);
        accessory.reachable = true;
        accessory.getService(Service.AccessoryInformation)
            .setCharacteristic(Characteristic.Manufacturer, "Aqara")
            .setCharacteristic(Characteristic.Model, "Gateway Light")
            .setCharacteristic(Characteristic.SerialNumber, deviceSid);
        accessory.addService(Service.Lightbulb, accessoryName);
        var service = accessory.getService(Service.Lightbulb);
        service.addCharacteristic(Characteristic.Hue);
        service.addCharacteristic(Characteristic.Saturation);
        service.addCharacteristic(Characteristic.Brightness);
        accessory.on('identify', function(paired, callback) {
            that.platform.log.debug("[MiAqaraPlatform][DEBUG]" + accessory.displayName + " Identify!!!");
            callback();
        });
        
        this.platform.registerAccessory(accessory);
        this.platform.log.info("[MiAqaraPlatform][INFO]create new accessory - UUID: " + uuid + ", type: Gateway Light, deviceSid: " + deviceSid);
    }

    if(0 != rawRgb) {
        var hexRawRgb = rawRgb.toString(16).length == 8 ? rawRgb.toString(16) : "0" + rawRgb.toString(16);
        var hexRgb = hexRawRgb.substring(2,8);
        var hsb = rgb2hsb([parseInt(hexRgb.substring(0,2), 16), parseInt(hexRgb.substring(2,4), 16), parseInt(hexRgb.substring(4,6), 16)]);
        accessory.yh_value_hue = hsb[0];
        accessory.yh_value_saturation = hsb[1] * 100;
        accessory.yh_value_brightness = parseInt(hexRawRgb.substring(0,2), 16);
    }
    
    var ligthService = accessory.getService(Service.Lightbulb);
    var switchCharacteristic = ligthService.getCharacteristic(Characteristic.On);
    switchCharacteristic.updateValue(!(rawRgb == 0));
    if (switchCharacteristic.listeners('set').length == 0) {
        switchCharacteristic.on("set", function(value, callback) {
            if(value == 1 || value == true) { // set by home is 0/1, set by siri is true/false
//              that.platform.log.debug("[MiAqaraPlatform][DEBUG]on - " + value);
                that.controlLight(deviceSid, true, accessory.yh_value_hue, accessory.yh_value_saturation, accessory.yh_value_brightness);
            } else {
                that.controlLight(deviceSid, false, null, null, null);
            }
            callback();
        });
    }
    
    var brightnessCharacteristic = ligthService.getCharacteristic(Characteristic.Brightness);
    brightnessCharacteristic.updateValue((rawRgb == 0) ? 0 : accessory.yh_value_brightness);
    if (brightnessCharacteristic.listeners('set').length == 0) {
        brightnessCharacteristic.on("set", function(value, callback) {
            accessory.yh_value_brightness = value;
//          that.platform.log.debug("[MiAqaraPlatform][DEBUG]brightness - " + value);
            if(value > 0) {
                that.controlLight(deviceSid, true, accessory.yh_value_hue, accessory.yh_value_saturation, accessory.yh_value_brightness);
            }
            callback();
        });
    }
    
    var hueCharacteristic = ligthService.getCharacteristic(Characteristic.Hue);
    hueCharacteristic.updateValue((rawRgb == 0) ? 0 : accessory.yh_value_hue);
    if (hueCharacteristic.listeners('set').length == 0) {
        hueCharacteristic.on("set", function(value, callback) {
            accessory.yh_value_hue = value;
//          that.platform.log.debug("[MiAqaraPlatform][DEBUG]hue - " + value);
            that.controlLight(deviceSid, true, accessory.yh_value_hue, accessory.yh_value_saturation, accessory.yh_value_brightness);
            callback();
        });
    }
    
    var saturationCharacteristic = ligthService.getCharacteristic(Characteristic.Saturation);
    saturationCharacteristic.updateValue((rawRgb == 0) ? 0 : accessory.yh_value_saturation);
    if (saturationCharacteristic.listeners('set').length == 0) {
        saturationCharacteristic.on("set", function(value, callback) {
            accessory.yh_value_saturation = value;
//          that.platform.log.debug("[MiAqaraPlatform][DEBUG]saturation - " + value);
            callback();
        });
    }
}

GatewayParser.prototype.controlLight = function(deviceSid, power, hue, saturation, brightness) {    
    var prepValue = 0;
    if(power) {
        if(!hue) {
            hue = 0;
        }
        if(!saturation) {
            saturation = 0 * 100;
        }
        if(!brightness) {
            brightness = 50;
        }
        var rgb = hsb2rgb([hue, saturation/100, 1]);
        prepValue = parseInt(dec2hex(brightness, 2) + dec2hex(rgb[0], 2) + dec2hex(rgb[1], 2) + dec2hex(rgb[2], 2), 16);
    }
    
    var key = this.platform.getWriteKeyByDeviceSid(deviceSid);
    var command = '{"cmd":"write","model":"gateway","sid":"' + deviceSid + '","data":"{\\"rgb\\":' + prepValue + ', \\"key\\": \\"' + key + '\\"}"}';
//  this.platform.log.debug("[MiAqaraPlatform][DEBUG]command: " + command);
    this.platform.sendCommandByDeviceSid(deviceSid, command);
}

// hsb2rgb([0, 1, 1]) => [255, 0, 0]
function hsb2rgb(hsb) {
    var rgb = [];        
    //先令饱和度和亮度为100%，调节色相h
    for(var offset=240,i=0;i<3;i++,offset-=120) {
        //算出色相h的值和三个区域中心点(即0°，120°和240°)相差多少，然后根据坐标图按分段函数算出rgb。但因为色环展开后，红色区域的中心点是0°同时也是360°，不好算，索性将三个区域的中心点都向右平移到240°再计算比较方便
        var x=Math.abs((hsb[0]+offset)%360-240);
        //如果相差小于60°则为255
        if(x<=60) rgb[i]=255;
        //如果相差在60°和120°之间，
        else if(60<x && x<120) rgb[i]=((1-(x-60)/60)*255);
        //如果相差大于120°则为0
        else rgb[i]=0;
    }
    //在调节饱和度s
    for(var i=0;i<3;i++)
        rgb[i]+=(255-rgb[i])*(1-hsb[1]);
    //最后调节亮度b
    for(var i=0;i<3;i++)
        rgb[i]*=hsb[2];
    // 取整
    for(var i=0;i<3;i++)
        rgb[i]=Math.round(rgb[i]);
    return rgb;
}

// rgb2hsb([255, 0, 0]) => [0, 1, 1]
function rgb2hsb(rgb) {
    var hsb = [];
    var rearranged = rgb.slice(0);
    var maxIndex = 0,minIndex = 0;
    var tmp;        
    //将rgb的值从小到大排列，存在rearranged数组里
    for(var i=0;i<2;i++) {
        for(var j=0;j<2-i;j++)
            if(rearranged[j]>rearranged[j+1]) {
                tmp=rearranged[j+1];
                rearranged[j+1]=rearranged[j];
                rearranged[j]=tmp;
            }                
    }
    //rgb的下标分别为0、1、2，maxIndex和minIndex用于存储rgb中最大最小值的下标
    for(var i=0;i<3;i++) {
        if(rearranged[0]==rgb[i]) minIndex=i;
        if(rearranged[2]==rgb[i]) maxIndex=i;
    }
    //算出亮度
    hsb[2]=rearranged[2]/255.0;
    //算出饱和度
    hsb[1]=1-rearranged[0]/rearranged[2];
    //算出色相
    hsb[0]=maxIndex*120+60* (rearranged[1]/hsb[1]/rearranged[2]+(1-1/hsb[1])) *((maxIndex-minIndex+3)%3==1?1:-1);
    //防止色相为负值
    hsb[0]=(hsb[0]+360)%360;
    return hsb;
}

function dec2hex(dec, len) {
    var hex = "";
    while(dec) {
        var last = dec & 15;
        hex = String.fromCharCode(((last>9)?55:48)+last) + hex;
        dec >>= 4;
    }
    if(len) {
        while(hex.length < len) hex = '0' + hex;
    }
    return hex;
}
