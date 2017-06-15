# homebridge-mi-aqara
[![npm version](https://badge.fury.io/js/homebridge-mi-aqara.svg)](https://badge.fury.io/js/homebridge-mi-aqara)

homebridge plugin for XiaoMi Aqara plugin.  
Thanks for [snOOrz](https://github.com/snOOrz)(the author of [homebridge-aqara](https://github.com/snOOrz/homebridge-aqara)), [licuhui](https://github.com/licuhui), all other developer and testers.   

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
ElectricCurtain(电动窗帘) --- coming soon   

## Pre-Requirements
1. Make sure you have V2 of the gateway. V1 has limited space so can't support this feature.  
2. Update gateway firmware to 1.4.1_141.0141 or later. You can contact [@babymoney666](https://github.com/babymoney666) if your firmware is not up to date.  

## Installation
1. Install HomeBridge, please follow it's [README](https://github.com/nfarina/homebridge/blob/master/README.md).  
If you are using Raspberry Pi, please read [Running-HomeBridge-on-a-Raspberry-Pi](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi).  
2. Make sure you can see HomeBridge in your iOS devices, if not, please go back to step 1.  
3. Download homebridge-mi-aqara to your local folder.  

## Configuration
1. Open Aqara gateway's settings, enable [local network protocol](https://github.com/louisZL/lumi-gateway-local-api).  
Please follow the steps in this thread: http://bbs.xiaomi.cn/t-13198850. It's in Chinese so you might need a translator to read it.  
2. To control the devices, put gateway's MAC address (lower case without colon) and password to ~/.homebridge/config.json.  
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
    
## Run it
homebridge -D  

## Version Logs
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
