const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class GatewayParser extends DeviceParser {
    constructor(model, platform) {
        super(model, platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'Gateway_Lightbulb': GatewayLightbulbParser,
            'Gateway_LightSensor': GatewayLightSensorParser,
            'Gateway_Switch_JoinPermission': GatewaySwitchJoinPermissionParser
        }
    }
}

// 支持的设备：网关
GatewayParser.modelName = ['gateway', 'gateway.v3'];
module.exports = GatewayParser;

class GatewayLightSensorParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Gateway',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.LightSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.CurrentAmbientLightLevel);
        result.push(service);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.LightSensor);
            
            var currentAmbientLightLevelCharacteristic = service.getCharacteristic(that.Characteristic.CurrentAmbientLightLevel);
            var value = that.getCurrentAmbientLightLevelCharacteristicValue(jsonObj, 0.0001);
            if(value) {
                currentAmbientLightLevelCharacteristic.updateValue(value);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (currentAmbientLightLevelCharacteristic.listeners('get').length == 0) {
                    currentAmbientLightLevelCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getCurrentAmbientLightLevelCharacteristicValue(result, 0.0001);
                            if(value) {
                                callback(null, value);
                            } else {
                                callback(new Error('get value fail: ' + result));
                            }
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            callback(err);
                        });
                    });
                }
            }
        }
    }
    
    getCurrentAmbientLightLevelCharacteristicValue(jsonObj, defaultValue) {
        var value = this.getValueFrJsonObjData(jsonObj, 'illumination');
        if(null != value) {
            var illumination = value / 1.0 - 279;
            if(!isNaN(illumination)) {
                return illumination > 0 ? illumination : 0.0001;
            } else {
                return 0.0001;
            }
        } else {
            return defaultValue;
        }
    }
}

class GatewayLightbulbParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.LIGHTBULB;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Gateway',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var ligthService = new that.Service.Lightbulb(accessoryName);
        ligthService.getCharacteristic(that.Characteristic.On);
        ligthService.getCharacteristic(that.Characteristic.Brightness);
        ligthService.getCharacteristic(that.Characteristic.Hue);
        ligthService.getCharacteristic(that.Characteristic.Saturation);
        
        result.push(ligthService);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var ligthService = accessory.getService(that.Service.Lightbulb);
            
            var switchCharacteristic = ligthService.getCharacteristic(that.Characteristic.On);
            var switchValue = that.getSwitchCharacteristicValue(jsonObj, null);
            if(null != switchCharacteristic) {
                switchCharacteristic.updateValue(switchValue);
            }
            
            var brightnessCharacteristic = ligthService.getCharacteristic(that.Characteristic.Brightness);
            var brightnessValue = that.getBrightnessCharacteristicValue(jsonObj, null);
            if(null != brightnessValue && brightnessValue > 0) {
                brightnessCharacteristic.updateValue(brightnessValue);
            }
            
            var hueCharacteristic = ligthService.getCharacteristic(that.Characteristic.Hue);
            var hueValue = that.getHueCharacteristicValue(jsonObj, null);
            if(null != hueValue && hueValue > 0) {
                hueCharacteristic.updateValue(hueValue);
            }
            
            var saturationCharacteristic = ligthService.getCharacteristic(that.Characteristic.Saturation);
            var saturationValue = that.getSaturationCharacteristicValue(jsonObj, null);
            if(null != saturationValue && saturationValue > 0) {
                saturationCharacteristic.updateValue(saturationValue);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (switchCharacteristic.listeners('get').length == 0) {
                    switchCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getSwitchCharacteristicValue(result, null);
                            if(null != value) {
                                callback(null, value);
                            } else {
                                callback(new Error('get value fail: ' + result));
                            }
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            callback(err);
                        });
                    });
                }
                
                if (brightnessCharacteristic.listeners('get').length == 0) {
                    brightnessCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getBrightnessCharacteristicValue(result, null);
                            if(null != value) {
                                if(value > 0) {
                                    callback(null, value);
                                } else {
                                    callback(null, brightnessCharacteristic.value);
                                }
                            } else {
                                callback(new Error('get value fail: ' + result));
                            }
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            callback(err);
                        });
                    });
                }
                
                if (hueCharacteristic.listeners('get').length == 0) {
                    hueCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getHueCharacteristicValue(result, null);
                            if(null != value) {
                                if(value > 0) {
                                    callback(null, value);
                                } else {
                                    callback(null, hueCharacteristic.value);
                                }
                            } else {
                                callback(new Error('get value fail: ' + result));
                            }
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            callback(err);
                        });
                    });
                }
                
                if (saturationCharacteristic.listeners('get').length == 0) {
                    saturationCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getSaturationCharacteristicValue(result, null);
                            if(null != value) {
                                if(value > 0) {
                                    callback(null, value);
                                } else {
                                    callback(null, saturationCharacteristic.value);
                                }
                            } else {
                                callback(new Error('get value fail: ' + result));
                            }
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            callback(err);
                        });
                    });
                }
            }
            
            if (switchCharacteristic.listeners('set').length == 0) {
                switchCharacteristic.on("set", function(value, callback) {
        //          that.platform.log.debug("[MiAqaraPlatform][DEBUG]switch: " + value);
                    if(value == 1 || value == true) { // set by home is 0/1, set by siri is true/false
                        that.controlLight(deviceSid, true, hueCharacteristic.value, saturationCharacteristic.value, brightnessCharacteristic.value).then(result => {
                            that.callback2HB(deviceSid, this, callback, null);
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            that.callback2HB(deviceSid, this, callback, err);
                        });
                    } else {
                        that.controlLight(deviceSid, false, null, null, null).then(result => {
                            that.callback2HB(deviceSid, this, callback, null);
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            that.callback2HB(deviceSid, this, callback, err);
                        });
                    }
                });
            }
            
            if (brightnessCharacteristic.listeners('set').length == 0) {
                brightnessCharacteristic.on("set", function(value, callback) {
        //          that.platform.log.debug("[MiAqaraPlatform][DEBUG]brightness: " + value);
                    if(value > 0) {
                        var tmp = brightnessCharacteristic.value;
                        brightnessCharacteristic.value = value;
                        that.controlLight(deviceSid, true, hueCharacteristic.value, saturationCharacteristic.value, value).then(result => {
                            that.callback2HB(deviceSid, this, callback, null);
                        }).catch(function(err) {
                            brightnessCharacteristic.value = tmp;
                            that.platform.log.error(err);
                            that.callback2HB(deviceSid, this, callback, err);
                        });
                    } else {
                        that.callback2HB(deviceSid, this, callback, null);
                    }
                });
            }
            
            if (hueCharacteristic.listeners('set').length == 0) {
                hueCharacteristic.on("set", function(value, callback) {
        //          that.platform.log.debug("[MiAqaraPlatform][DEBUG]hue: " + value);
                    var tmp = hueCharacteristic.value;
                    hueCharacteristic.value = value;
                    that.controlLight(deviceSid, true, value, saturationCharacteristic.value, brightnessCharacteristic.value).then(result => {
                        that.callback2HB(deviceSid, this, callback, null);
                    }).catch(function(err) {
                        hueCharacteristic.value = tmp;
                        that.platform.log.error(err);
                        that.callback2HB(deviceSid, this, callback, err);
                    });
                });
            }
            
            if (saturationCharacteristic.listeners('set').length == 0) {
                saturationCharacteristic.on("set", function(value, callback) {
        //          that.platform.log.debug("[MiAqaraPlatform][DEBUG]saturation: " + value);
                    var tmp = saturationCharacteristic.value;
                    saturationCharacteristic.value = value;
                    that.controlLight(deviceSid, true, hueCharacteristic.value, value, brightnessCharacteristic.value).then(result => {
                        that.callback2HB(deviceSid, this, callback, null);
                    }).catch(function(err) {
                        saturationCharacteristic.value = tmp;
                        that.platform.log.error(err);
                        that.callback2HB(deviceSid, this, callback, err);
                    });
                });
            }
        }
    }

    getSwitchCharacteristicValue(jsonObj, defaultValue) {
        var rawRgb = this.getValueFrJsonObjData(jsonObj, 'rgb');
        if((null != rawRgb)) {
            if(0 != rawRgb) {
                return true;
            } else {
                return false;
            }
        } else {
            return defaultValue;
        }
    }
    
    getBrightnessCharacteristicValue(jsonObj, defaultValue) {
        var rawRgb = this.getValueFrJsonObjData(jsonObj, 'rgb');
        if((null != rawRgb)) {
            if(0 != rawRgb) {
                var hexRawRgb = rawRgb.toString(16).length == 8 ? rawRgb.toString(16) : "0" + rawRgb.toString(16);
                return parseInt(hexRawRgb.substring(0,2), 16);
            } else {
                return 0;
            }
        } else {
            return defaultValue;
        }
    }
    
    getHueCharacteristicValue(jsonObj, defaultValue) {
        var rawRgb = this.getValueFrJsonObjData(jsonObj, 'rgb');
        if((null != rawRgb)) {
            if(0 != rawRgb) {
                var hexRawRgb = rawRgb.toString(16).length == 8 ? rawRgb.toString(16) : "0" + rawRgb.toString(16);
                var hexRgb = hexRawRgb.substring(2,8);
                var hsb = this.rgb2hsb([parseInt(hexRgb.substring(0,2), 16), parseInt(hexRgb.substring(2,4), 16), parseInt(hexRgb.substring(4,6), 16)]);
                return hsb[0];
            } else {
                return 0;
            }
        } else {
            return defaultValue;
        }
    }
    
    getSaturationCharacteristicValue(jsonObj, defaultValue) {
        var rawRgb = this.getValueFrJsonObjData(jsonObj, 'rgb');
        if((null != rawRgb)) {
            if(0 != rawRgb) {
                var hexRawRgb = rawRgb.toString(16).length == 8 ? rawRgb.toString(16) : "0" + rawRgb.toString(16);
                var hexRgb = hexRawRgb.substring(2,8);
                var hsb = this.rgb2hsb([parseInt(hexRgb.substring(0,2), 16), parseInt(hexRgb.substring(2,4), 16), parseInt(hexRgb.substring(4,6), 16)]);
                return hsb[1] * 100;
            } else {
                return 0;
            }
        } else {
            return defaultValue;
        }
    }
    
    controlLight(deviceSid, power, hue, saturation, brightness) {
        var that = this;
        return new Promise((resolve, reject) => {
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
                var rgb = that.hsb2rgb([hue, saturation/100, 1]);
                prepValue = parseInt(that.dec2hex(brightness, 2) + that.dec2hex(rgb[0], 2) + that.dec2hex(rgb[1], 2) + that.dec2hex(rgb[2], 2), 16);
            }
            
            var command = {cmd:"write",model:that.model,sid:deviceSid,data:{rgb:prepValue}};
            if(that.platform.ConfigUtil.getAccessoryIgnoreWriteResult(deviceSid, that.accessoryType)) {
                that.platform.sendWriteCommandWithoutFeedback(deviceSid, command);
                resolve(null);
            } else {
                that.platform.sendWriteCommand(deviceSid, command).then(result => {
                    resolve(result);
                }).catch(function(err) {
                    that.platform.log.error(err);
                    reject(err);
                });
            }
        })
    }

    // hsb2rgb([0, 1, 1]) => [255, 0, 0]
    hsb2rgb(hsb) {
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
    rgb2hsb(rgb) {
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

    dec2hex(dec, len) {
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
}

class GatewaySwitchJoinPermissionParser extends AccessoryParser {
    constructor(model, platform, accessoryType) {
        super(model, platform, accessoryType)
        
        this.joinPermissionTimeout = {};
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SWITCH;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Gateway',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.Switch(accessoryName);
        service.getCharacteristic(that.Characteristic.On);
        result.push(service);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.Switch);
            var onCharacteristic = service.getCharacteristic(that.Characteristic.On);
            // var value = that.getOnCharacteristicValue(jsonObj, null);
            // if(null != value) {
                // onCharacteristic.updateValue(value);
            // }
            
            // if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                // if (onCharacteristic.listeners('get').length == 0) {
                    // onCharacteristic.on("get", function(callback) {
                        // var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        // that.platform.sendReadCommand(deviceSid, command).then(result => {
                            // var value = that.getOnCharacteristicValue(result, null);
                            // if(null != value) {
                                // callback(null, value);
                            // } else {
                                // callback(new Error('get value fail: ' + result));
                            // }
                        // }).catch(function(err) {
                            // that.platform.log.error(err);
                            // callback(err);
                        // });
                    // });
                // }
            // }
            
            if(onCharacteristic.listeners('set').length == 0) {
                onCharacteristic.on("set", function(value, callback) {
                    clearTimeout(that.joinPermissionTimeout[deviceSid]);
                    var command = {cmd:"write",model:that.model,sid:deviceSid,data:{join_permission:(value ? 'yes' : 'no')}};
                    if(that.platform.ConfigUtil.getAccessoryIgnoreWriteResult(deviceSid, that.accessoryType)) {
                        that.platform.sendWriteCommandWithoutFeedback(deviceSid, command);
                        that.callback2HB(deviceSid, this, callback, null);
                        if(value) {
                            that.joinPermissionTimeout[deviceSid] = setTimeout(() => {
                                onCharacteristic.updateValue(false);
                            }, 30 * 1000);
                        }
                    } else {
                        that.platform.sendWriteCommand(deviceSid, command).then(result => {
                            that.callback2HB(deviceSid, this, callback, null);
                            if(value) {
                                that.joinPermissionTimeout[deviceSid] = setTimeout(() => {
                                    onCharacteristic.updateValue(false);
                                }, 30 * 1000);
                            }
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            that.callback2HB(deviceSid, this, callback, err);
                        });
                    }
                });
            }
        }
    }
    
    // getOnCharacteristicValue(jsonObj, defaultValue) {
        // var value = this.getValueFrJsonObjData(jsonObj, 'channel_0');
        // if(value === 'on') {
            // return true;
        // } else if(value === 'off') {
            // return false;
        // } else {
            // return defaultValue;
        // }
    // }
}
