# homebridge-mi-aqara
[![npm version](https://badge.fury.io/js/homebridge-mi-aqara.svg)](https://badge.fury.io/js/homebridge-mi-aqara)

homebridge plugin for XiaoMi Aqara plugin.  
Thanks for [nfarina](https://github.com/nfarina)(the author of [homebridge](https://github.com/nfarina/homebridge)), [snOOrz](https://github.com/snOOrz)(the author of [homebridge-aqara](https://github.com/snOOrz/homebridge-aqara)), [licuhui](https://github.com/licuhui), [攀旺智能](https://pwzn.taobao.com/), [瀚思彼岸论坛](https://bbs.hassbian.com/), all other developer and testers.   

**Note: I have only a part of these devices, so some devices don't have tested. If you find bugs, please submit them to [issues](https://github.com/YinHangCode/homebridge-mi-aqara/issues).**

This repository contains the Aqara plugin for homebridge.  
Aqara is a ZigBee gateway with a few sensors.  

![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/Gateway.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/ContactSensor.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/MotionSensor.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/Button.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/TemperatureAndHumiditySensor.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/SingleSwitch.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/DuplexSwitch.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/SingleSwitchLN.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/DuplexSwitchLN.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/SingleButton86.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/DuplexButton86.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/PlugBase.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/PlugBase86.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/MagicSquare.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/SmokeDetector.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/NatgasDetector.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/ElectricCurtain.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/ContactSensor2.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/MotionSensor2.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/Button2.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/TemperatureAndHumiditySensor2.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/WaterDetector.jpg)

## Supported Devices
Gateway(网关)   
ContactSensor(门磁感应)   
MotionSensor(人体感应)   
Button(按钮)   
TemperatureAndHumiditySensor(温度湿度传感器)   
SingleSwitch(单按钮墙壁开关)   
DuplexSwitch(双按钮墙壁开关)   
SingleSwitchLN(单按钮墙壁开关零火版)   
DuplexSwitchLN(双按钮墙壁开关零火版)   
SingleButton86(86型无线单按钮开关)   
DuplexButton86(86型无线双按钮开关)   
PlugBase(插座)   
PlugBase86(86型墙壁插座)   
MagicSquare(魔方)   
SmokeDetector(烟雾报警器)   
NatgasDetector(天然气报警器)   
ElectricCurtain(电动窗帘)   
ContactSensor2(门磁感应第二代)   
MotionSensor2(人体感应第二代)   
Button2(按钮第二代)   
TemperatureAndHumiditySensor2(温度湿度传感器第二代)   
WaterDetector(水浸传感器) --- coming soon   

## Pre-Requirements
1. Make sure you have V2 of the gateway. V1 has limited space so can't support this feature.  
2. Update gateway firmware to **1.4.1_148.0143** or later. You can contact [@babymoney666](https://github.com/babymoney666) if your firmware is not up to date.  

## Installation
1. Install HomeBridge, please follow it's [README](https://github.com/nfarina/homebridge/blob/master/README.md).  
If you are using Raspberry Pi, please read [Running-HomeBridge-on-a-Raspberry-Pi](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi).  
2. Make sure you can see HomeBridge in your iOS devices, if not, please go back to step 1.  
3. Download homebridge-mi-aqara to your local folder.  

## Configuration
1. Open Aqara gateway's settings, enable [local network protocol](https://github.com/louisZL/lumi-gateway-local-api).  
Please follow the steps in this thread: http://bbs.xiaomi.cn/t-13198850. It's in Chinese so you might need a translator to read it.  
2. To control the devices, put gateway's MAC address (**lower case without colon**) and password to ~/.homebridge/config.json.   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "sid": ["6409802da3b3"],
        "password": ["02i44k56zrgg578b"]
    }]
}
```
If you have more than one gateways, fill them in right order, like below.  
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "sid": ["6409802da3b3", "f0b4299a5b2b", "f0b4299a77dd"],
        "password": ["02i44k56zrgg578b", "g250s2vtne8q9qhv", "syu3oasva3uqd5qd"]
    }]
}
```
If you want to specify the default name of the device, add a mapping table to your config.json like this.   
For more information about default name, Please refer to file `sampleConfig.json`.   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "sid": ["6409802da3b3", "f0b4299a5b2b", "f0b4299a77dd"],
        "password": ["02i44k56zrgg578b", "g250s2vtne8q9qhv", "syu3oasva3uqd5qd"],
        "defaultValue": {
            "158d0001000001": {
                "Mag": {
                    "name": "entrance door"
                }
            },
            "158d0001000002": {
                "Mot": {
                    "name": "living room motion sensor"
                }
            },
            "158d0001000004": {
                "Tem": {
                    "name": "living room temperature"
                },
                "Hum": {
                    "name": "living room humidity"
                }
            }
        }
    }]
}
```
If you like to use Light Bulb type for Light Switch to make grandma Siri happy, like snOOrz, you can set the following in the config.   
Currently only supported: SingleSwitch, DuplexSwitch, SingleSwitchLN, DuplexSwitchLN.   
**If you changed serviceType config, Please [clear register accessories](#clear-register-accessories).**   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "sid": ["6409802da3b3", "f0b4299a5b2b", "f0b4299a77dd"],
        "password": ["02i44k56zrgg578b", "g250s2vtne8q9qhv", "syu3oasva3uqd5qd"],
        "defaultValue": {
            "158d0001000007": {
                "SingleSwitch": {
                    "name": "living room light",
                    "serviceType": "Lightbulb"
                }
            },
            "158d0001000008": {
                "DuplexSwitch_1": {
                    "name": "master bedroom room light",
                    "serviceType": "Lightbulb"
                },
                "DuplexSwitch_2": {
                    "name": "study room light",
                    "serviceType": "Lightbulb"
                }
            }
        }
    }]
}
```
If you want to disable accessories, you can add disable attribute to config.   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "sid": ["6409802da3b3", "f0b4299a5b2b", "f0b4299a77dd"],
        "password": ["02i44k56zrgg578b", "g250s2vtne8q9qhv", "syu3oasva3uqd5qd"],
        "defaultValue": {
            "158d0001000007": {
                "SingleSwitch": {
                    "name": "living room light",
                    "serviceType": "Lightbulb",
                    "disable": true
                }
            },
            "158d0001000008": {
                "DuplexSwitch_1": {
                    "name": "master bedroom room light",
                    "serviceType": "Lightbulb"
                },
                "DuplexSwitch_2": {
                    "name": "study room light",
                    "serviceType": "Lightbulb",
                    "disable": true
                }
            },
            "158d0001000004": {
                "Tem": {
                    "name": "living room temperature",
                    "disable": true
                },
                "Hum": {
                    "name": "living room humidity"
                }
            }
        }
    }]
}
```
    
## Run it
homebridge -D   

## Clear register accessories
cd ~/.homebridge/accessories/   
mv cachedAccessories cachedAccessories_\`date '+%Y%m%d_%H%M%S'\`.bak   
echo [] > cachedAccessories   

## Version Logs
### 0.4.3
1.fixed bug that gateway light sensor not support when value is 0;   
2.fixed bug that motion sensor version 2 light sensor not support when value is 0;   
### 0.4.2
1.adjustment gateway light sensor value(subtract 279).   
2.delete PlugBase, PlugBase86, SingleSwitch, DuplexSwitch, SingleSwitchLN, DuplexSwitchLN battery information.   
3.add motion sensor version 2 light sensor battery information.   
4.add setting accessory disable feature.   
5.fixed bug that electric curtain can't work, but there is no current operation state information now.   
### 0.4.1
1.code collation.   
### 0.4.0
1.add electric curtain accessory.   
2.add contact sensor version 2 accessory.   
3.add motion sensor version 2 accessory.   
4.add button version 2 accessory.   
5.add temperature and humidity sensor version 2 accessory.   
6.optimize log content.   
7.add setting default name feature.   
8.add setting default service type feature.   
9.fixed motion sensor bug that wrong trigger when homebridge start.   
10.adjustment gateway light sensor value(subtract 300).   
### 0.3.3
1.add single button 86 long press event.   
2.add duplex button 86 long press event.   
3.changed button click event value from Characteristic.ProgrammableSwitchEvent.CLICK back to Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS.   
4.changed single button 86 click event value from Characteristic.ProgrammableSwitchEvent.CLICK back to Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS.   
5.changed duplex button 86 click event value from Characteristic.ProgrammableSwitchEvent.CLICK back to Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS.   
### 0.3.2
1.fixed bug that duplex switch LN charging state.   
2.fixed bug that single switch LN charging state.   
3.fixed bug that single button 86 charging state.   
4.changed button click event value from Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS to Characteristic.ProgrammableSwitchEvent.CLICK.   
5.changed single button 86 click event value from Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS to Characteristic.ProgrammableSwitchEvent.CLICK.   
6.changed duplex button 86 click event value from Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS to Characteristic.ProgrammableSwitchEvent.CLICK.   
7.fixed bug that natgas detector is not alarm.   
8.fixed bug that smoke detector is not alarm.   
### 0.3.1
1.code collation.   
### 0.3.0
1.add single switch LN accessory.   
2.add duplex switch LN accessory.   
3.add plug base 86 accessory.   
4.add smoke detector accessory.   
5.add natgas detector accessory.   
### 0.2.1
1.change accessory registration mechanism, fixed bug that new accessory can't correlate associated with gateway.   
### 0.2.0
1.add duplex switch accessory.   
2.add single button 86 accessory.   
3.add duplex button 86 accessory.   
### 0.1.0
1.add plug base accessory.   
2.add magic square accessory.   
### 0.0.6
1.add some logs.
### 0.0.5
1.fixed bug.
### 0.0.4
1.fixed bug.
### 0.0.3
1.add gateway accessory: light sensor, hue light.
### 0.0.2
1.add single switch accessory.   
### 0.0.1
1.supported contact sensor accessory.   
2.supported motion sensor accessory.   
3.supported button accessory.   
4.supported temperature and humidity sensor accessory.   
