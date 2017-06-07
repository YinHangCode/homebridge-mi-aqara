# homebridge-mi-aqara
homebridge plugin for XiaoMi Aqara plugin.  
This repository based [homebridge-aqara](https://github.com/snOOrz/homebridge-aqara).  

This repository contains the Aqara plugin for homebridge.  
Aqara is a ZigBee gateway with a few sensors.  

![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/gateway2.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/magnet.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/motion.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/switch.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/sensor_ht.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/1switch.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/2switch.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/chazuo.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/mofang.jpg)
![](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/yanwu.jpg)

## Supported Devices And Povide HomeKit Accessory
Gateway v2(第二代网关) --- coming soon  
ContactSensor(门磁感应)  
MotionSensor(人体感应)  
Button(按钮)  
TemperatureAndHumiditySensor(温度湿度传感器)  
SingleSwitch(单按钮墙壁开关)  
DuplexSwitch(双按钮墙壁开关) --- coming soon  
PlugBase(插座) --- coming soon  
MagicSquare(魔方) --- coming soon  
SmokeDetector(烟雾报警器) --- coming soon  

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
