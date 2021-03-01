# homebridge-mi-aqara
[![npm version](https://badge.fury.io/js/homebridge-mi-aqara.svg)](https://badge.fury.io/js/homebridge-mi-aqara)
[![npm version](https://img.shields.io/badge/releases-0.8.1-blue.svg)](https://github.com/YinHangCode/homebridge-mi-aqara)
[![npm version](https://img.shields.io/badge/dev-0.8.1-yellow.svg)](https://github.com/YinHangCode/homebridge-mi-aqara/tree/dev)
[![npm version](https://img.shields.io/badge/donate-AliPay-green.svg)](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/Donate-AliPay.jpg)
[![npm version](https://img.shields.io/badge/donate-WeChat-green.svg)](https://github.com/YinHangCode/homebridge-mi-aqara/blob/master/images/Donate-WeChat.jpg)
[![npm version](https://img.shields.io/badge/donate-PayPal-green.svg)](https://www.paypal.me/yhdeserteagle)

homebridge plugin for XiaoMi Aqara plugin.   
小米/绿米网关的HomeBridge插件。   

Thanks for 
[nfarina](https://github.com/nfarina)(the author of [homebridge](https://github.com/nfarina/homebridge)), 
[snOOrz](https://github.com/snOOrz)(the author of [homebridge-aqara](https://github.com/snOOrz/homebridge-aqara)), 
[licuhui](https://github.com/licuhui), 
[攀旺智能](https://pwzn.taobao.com/), 
[magaHH](https://github.com/magaHH), 
[isundaylee](https://github.com/isundaylee), 
[ileler](https://github.com/ileler), 
[myriky](https://github.com/myriky), 
[Runc2333](https://github.com/Runc2333), 
[yangliu](https://github.com/yangliu), 
[wonderfullay](https://github.com/wonderfullay), 
[BrianHenryIE](https://github.com/BrianHenryIE), 
all other developer and testers.   
感谢 
[nfarina](https://github.com/nfarina)([homebridge](https://github.com/nfarina/homebridge)的作者), 
[snOOrz](https://github.com/snOOrz)([homebridge-aqara](https://github.com/snOOrz/homebridge-aqara)的作者), 
[licuhui](https://github.com/licuhui), 
[攀旺智能](https://pwzn.taobao.com/), 
[magaHH](https://github.com/magaHH), 
[isundaylee](https://github.com/isundaylee), 
[ileler](https://github.com/ileler), 
[myriky](https://github.com/myriky), 
[Runc2333](https://github.com/Runc2333), 
[yangliu](https://github.com/yangliu), 
[wonderfullay](https://github.com/wonderfullay), 
[BrianHenryIE](https://github.com/BrianHenryIE), 
以及每一位开发者和测试者.   

**Note: I have only a part of these devices, so some devices don't have tested. If you find bugs, please submit them to [issues](https://github.com/YinHangCode/homebridge-mi-aqara/issues) or [QQ Group: 107927710](//shang.qq.com/wpa/qunwpa?idkey=8b9566598f40dd68412065ada24184ef72c6bddaa11525ca26c4e1536a8f2a3d).**   
**注意: 我只有一部分设备, 所以一些设备没有得到充分的测试。 如果你发现Bug，请提交到 [issues](https://github.com/YinHangCode/homebridge-mi-aqara/issues) 或 [QQ群: 107927710](//shang.qq.com/wpa/qunwpa?idkey=8b9566598f40dd68412065ada24184ef72c6bddaa11525ca26c4e1536a8f2a3d)。**   

**Note: According to aqara local network protocol use UDP port 9898, please notice the relevant configuration of firewall.**   
**注意: 绿米的局域网协议使用的是UDP的9898端口，请配置好防火墙的相关配置。**   
   
**Note: 0.5.x update to 0.6.x must be [clear register accessories](#clear-register-accessories清除注册配件) and update [configuration](#configuration配置说明) file content.**   
**注意: 0.5.x版本升级到0.6.x版本必须[清空注册设备信息](#clear-register-accessories清除注册配件)并且更新[配置文件](#configuration配置说明)内容.**   
   
**Note: About AcPartner, This project only provides gateway functionality. If you want the use air conditioning function, please refer to the project for [homebridge-mi-acPartner](https://github.com/LASER-Yi/homebridge-mi-acPartner).**   
**注意: 有关空调伴侣，这个项目只提供网关的功能，如果你需要使用空调的功能，请参考项目[homebridge-mi-acPartner](https://github.com/LASER-Yi/homebridge-mi-acPartner)。**   
   
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/Gateway.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/ContactSensor.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/MotionSensor.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/Button.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/TemperatureAndHumiditySensor.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/SingleSwitch.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/DuplexSwitch.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/SingleSwitchLN.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/DuplexSwitchLN.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/SingleButton86.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/DuplexButton86.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/PlugBase.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/PlugBase86.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/MagicSquare.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/SmokeDetector.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/NatgasDetector.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/ElectricCurtain.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/ContactSensor2.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/MotionSensor2.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/Button2.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/TemperatureAndHumiditySensor2.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/WaterDetector.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/Lock.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/AcPartner.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/Button3.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/DuplexButton862.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/Vibration.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/ElectricCurtainBattery.jpg)

## Supported Devices(支持的设备)
||Device Name<br>设备名称|Protocol Model Value<br>协议Model值|
|:-:|:-|:-|
|1|Gateway(网关)|gateway<br>gateway.v3|
|2|ContactSensor(门磁感应)|magnet<br>sensor_magnet|
|3|MotionSensor(人体感应)|motion|
|4|Button(按钮)|switch<br>sensor_switch|
|5|TemperatureAndHumiditySensor(温度湿度传感器)|sensor_ht|
|6|SingleSwitch(单按钮墙壁开关)|ctrl_neutral1|
|7|DuplexSwitch(双按钮墙壁开关)|ctrl_neutral2|
|8|SingleSwitchLN(单按钮墙壁开关零火版)|ctrl_ln1<br>ctrl_ln1.aq1|
|9|DuplexSwitchLN(双按钮墙壁开关零火版)|ctrl_ln2<br>ctrl_ln2.aq1|
|10|SingleButton86(86型无线单按钮开关)|86sw1<br>sensor_86sw1.aq1<br>sensor_86sw1|
|11|DuplexButton86(86型无线双按钮开关)|86sw2<br>sensor_86sw2.aq1<br>sensor_86sw2|
|12|PlugBase(插座)|plug|
|13|PlugBase86(86型墙壁插座)|86plug<br>ctrl_86plug<br>ctrl_86plug.aq1|
|14|MagicSquare(魔方)|cube<br>sensor_cube<br>sensor_cube.aqgl01|
|15|SmokeDetector(烟雾报警器)|smoke<br>sensor_smoke|
|16|NatgasDetector(天然气报警器)|natgas<br>sensor_natgas|
|17|ElectricCurtain(电动窗帘)|curtain|
|18|ContactSensor2(门磁感应第二代)|sensor_magnet.aq2|
|19|MotionSensor2(人体感应第二代)|sensor_motion.aq2|
|20|Button2(按钮第二代)|sensor_switch.aq2<br>remote.b1acn01|
|21|TemperatureAndHumiditySensor2(温度湿度传感器第二代)|weather.v1<br>weather|
|22|WaterDetector(水浸传感器)|sensor_wleak.aq1|
|23|Lock(门锁)|lock.aq1|
|24|AcPartner(空调伴侣升级版)|acpartner.v3|
|25|Button3(按钮第二代升级版)|sensor_switch.aq3|
|26|DuplexButton862(86型无线双按钮开关升级版)|remote.b286acn01|
|27|VibrationSensor(动静贴)|vibration|
|28|ElectricCurtainBattery(电动窗帘锂电池版)|curtain.hagl04|


## Pre-Requirements(前置要求)
1. Make sure your IOS version is IOS11 or later.   
确保你的IOS设备版本高于IOS11。   
2. Make sure you have gateway v2 or acpartner v3. gateway v1 has limited space so can't support this feature.   
确保你的小米网关是二代版本/空调伴侣是三代。小米网关一代不支持此插件。   
3. Update gateway firmware to **1.4.1_155.0143(gateway v2)**, **1.4.1_148.019(acpartner v3)** or later.   
确保你的网关的固件版本高于**1.4.1_155.0143(小米网关二代)**, **1.4.1_148.019(空调伴侣三代)。**   
   
   
## Installation(安装)
1. Install HomeBridge, please follow it's [README](https://github.com/nfarina/homebridge/blob/master/README.md).   
安装HomeBridge，请参考如下：[README](https://github.com/nfarina/homebridge/blob/master/README.md)。   
If you are using Raspberry Pi, please read [Running-HomeBridge-on-a-Raspberry-Pi](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi).   
如果你使用树莓派安装，可以参考文章：[在树莓派运行HomeBridge](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi).   
2. Make sure you can see HomeBridge in your iOS devices, if not, please go back to step 1.   
确保在你的IOS设备的家挺app中添加设备里能看到HomeBridge的桥，如果看不到请重复第一步。   
3. Download homebridge-mi-aqara to your HomeBridge path or installation through NPM:   
下载homebridge-mi-aqara插件到你的HomeBridge上，使用如下NPM命令安装：   
```
npm install -g homebridge-mi-aqara
```
   

## Configuration(配置说明)
||Name<br>名称|Required<br>是否必填|Value Type<br>值的数据类型|Description<br>功能描述|Value Example<br>参考值|
|:-:|:-|:-|:-|:-|:-|
|1|platform|True<br>是|String<br>字符串||It must be 'MiAqaraPlatform'<br>必须写'MiAqaraPlatform'|
|2|[gateways](#gateways-configuration网关配置)|True<br>是|Object<br>对象|set gateway information.<br>网关的信息|{ "6409802da3b3": "02i44k56zrgg578b" }|
|3|[bindAddress](#bindaddress-configuration监听地址配置)|False<br>否|String<br>字符串|specified network.<br>指定工作网络|"10.0.1.1"|
|4|[sendWhoisCmdInterval](#sendWhoisCmdInterval-configuration自动发送whois命令间隔时间配置)|False<br>否|Integer<br>整型|set send whois cmd interval.<br>设置多久自动发送一次whois命令|3600000|
|5|[autoRemoveAccessoryInterval](#autoRemoveAccessoryInterval-configuration自动删除配件检测间隔时间配置)|False<br>否|Integer<br>整型|set auto remove accessory interval.<br>指定自动删除配件检测间隔时间|3600000|
|6|[defaultValue](#defaultvalue-configuration默认值配置)|False<br>否|Object<br>对象|set device default value.<br>默认值的配置||
|7|[manage](#manage-configuration设备web管理界面配置)|False<br>否|Object<br>对象|open manage and manage configs.<br>管理页面的配置|{ "port": 11128, "password": "107927710" }|
|8|[mqtt](#mqtt-configurationmqtt配置)|False<br>否|Object<br>对象|open mqtt and mqtt configs.<br>mqtt相关配置|{ "username": "mqtt", "password": "107927710" }|
   
For more information about config, Please refer to file `sampleConfig.json`.   
有关配置，可以参考配置文件 `sampleConfig.json`。   
   
### gateways configuration(网关配置)
Open aqara gateway's settings, enable [local network protocol](https://github.com/louisZL/lumi-gateway-local-api).   
在网关的设置页面，打开 [局域网控制协议](https://github.com/louisZL/lumi-gateway-local-api)。   
Please follow the steps in this thread: http://wiki.yinhh.com/Wiki.jsp?page=Homebridge-mi-aqara or http://bbs.xiaomi.cn/t-13198850. It's in Chinese so you might need a translator to read it.  
可以参考如下教程：http://wiki.yinhh.com/Wiki.jsp?page=Homebridge-mi-aqara 或 http://bbs.xiaomi.cn/t-13198850   

On iPhone:   
步骤可参考：   
* Open the app   
打开米家app   
* Select the gateway   
选择网关设备   
* Press the top right `(…)` Settings button   
点击右上角的`(…)`按钮   
* Select `About`   
选择`关于`   
* Tap five times in the blank area to reveal the hidden menu items   
在空白区域中点击五次以显示隐藏菜单项   
* Below the version numbers, choose the first: `LAN Communication Protocol`   
在版本号下面，选择第一个：`局域网通信协议`   
* Toggle the `LAN Communication Protocol` switch to on   
将“LAN通信协议”开关切换到开   
* Take note of the alphanumeric code beside `Password`   
记下`密码`旁边的字母数字代码   
* Press `OK`   
点击`OK`   
* Go back to the previous menu (About) and select the next option: `Gateway Information`   
返回上一个菜单（关于）并选择下一个选项：`网关信息`   
* Take note of the MAC address at `mac=`   
记下`mac=`上的MAC地址   
   
To control the devices, put gateway's MAC address (**lower case without colon**) and password (**keep original and case sensitive**) to ~/.homebridge/config.json.   
将网关的mac地址(**小写字母 去掉冒号**)和密码(**保持原始 区分大小写**)写入到配置文件 ~/.homebridge/config.json。   
   
Warning: gateway's MAC address (**lower case without colon**) and password (**keep original and case sensitive**).   
警告: 网关的MAC地址 (**全部小写 去掉冒号**) 密码 (**保持原始 区分大小写**) 。   
Warning: gateway's MAC address (**lower case without colon**) and password (**keep original and case sensitive**).   
警告: 网关的MAC地址 (**全部小写 去掉冒号**) 密码 (**保持原始 区分大小写**) 。   
Warning: gateway's MAC address (**lower case without colon**) and password (**keep original and case sensitive**).   
警告: 网关的MAC地址 (**全部小写 去掉冒号**) 密码 (**保持原始 区分大小写**) 。   
Important things are to be repeated for 3 times.   
重要的事情说三遍。   
   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b"
        }
    }]
}
```
If you have more than one gateways, fill them in right order, like below:   
如果你有多个网关，可以这样填写：   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        }
    }]
}
```
Here is a way to search for gateways instead of multicast, because of some friends do not respond to information from gateway in their network environment.   
有一些朋友的网络环境有一些问题，无法正常使用组播，这里提供一种配置方式来替代通过组播的方式寻找网关。   
That is to say, we can config the IP address of the gateway to replace search gateway by multicast.   
也就是说，可以通过配置网关的IP来替换通过组播的方式寻找网关。   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": {
                "password": "02i44k56zrgg578b",
                "ip": "10.3.3.1"
            },
            "f0b4299a5b2b": {
                "password": "2F92E7DA90C66B86",
                "ip": "10.3.3.2"
            },
            "f0b4299a77dd": {
                "password": "syu3oasva3uqd5qd",
                "ip": "10.3.3.3"
            }
        }
    }]
}
```
It can also be mixed config, but without full configuration of ip, multicast packets will still be sent to search for other gateways which do not config ip.   
也可以混合配置，不过只要有一个网关没有配置IP，程序就会发送组播信息来寻找未配置IP的网关。若所有网关全部配置了IP，则程序不发送组播包寻找网关。
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": {
                "password": "2F92E7DA90C66B86",
                "ip": "10.3.3.2"
            },
            "f0b4299a77dd": {
                "password": "syu3oasva3uqd5qd",
                "ip": "10.3.3.3"
            }
        }
    }]
}
```

### bindAddress configuration(监听地址配置)
If your device(which running homebridge) has multiple network, please add the bindAddress configuration item to decide to listen which network, like below:   
如果你运行HomeBridge的设备有多块网卡并且在多个网络中，可以通过这个配置来指定使用哪一个网络，配置如下：   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "bindAddress": "10.0.1.1",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        }
    }]
}
```

### sendWhoisCmdInterval configuration(自动发送whois命令间隔时间配置)
If this configuration item is not to configure, it will be send whois command every hour by default.   
如果该配置项不填写，默认情况下，每小时发送一次。   
If your network has some problems and you can't receive the heartbeat packet, you can use send whois command to replace the heartbeat function. If you use it in this way, you can set the value of the configuration item to 5 seconds, that is 5000. example:   
如果你的网络有一些问题，无法收到心跳包，那么你可以使用发送a来替代心跳功能，如果这样使用，可以将配置项的值设为5秒，即5000，例子如下：    
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "bindAddress": "10.0.1.1",
        "sendWhoisCmdInterval": 5000,
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        }
    }]
}
```

### autoRemoveAccessoryInterval configuration(自动删除配件检测间隔时间配置)
If you want the plugin to help you automatically delete devices that have not received heartbeat for a long time, you can configure this item. The value is how often to detect. If you don't need to automatically delete accessories, you can not configure this configuration.   
如果你希望插件帮你自动删除长时间收不到心跳的设备，则可以配置此项目，该值为多久检测一次。如果不需要自动删除配件功能，可以不配置此配置。    
**note: long time is defined as: no heartbeat received in more than 7 days.**    
**注：长时间的定义为：超过7天未收到心跳。**    
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "bindAddress": "10.0.1.1",
        "autoRemoveAccessoryInterval": 3600000,
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        }
    }]
}
```

### defaultValue configuration(默认值配置)
If you want to specify the default value, such as specify the name of the accessory, hide the accessory, any other configs. You can add a defaultValue mapping table to your config.json.   
如果你想要指定默认值，比如配件的名字，是否隐藏配件以及其他一些配置，你可以在你的配置文件config.json中增加defaultValue配置项。
The config supported are as follows:   
这个配置支持如下功能：   

||Name<br>名称|Value Type<br>数据类型|Description<br>描述|Default Value<br>默认值|Recommended Value<br>建议值|Value Example<br>值举例|
|:-:|:-|:-|:-|:-|:-|:-|
|1|[name](#defaultvalue-name-configuration默认值-名称配置)|String<br>字符串|set accessory name.<br>名字|DeviceAccessoryType_device SID last four bits<br>设备配件类型_设备SID的后四位||"living room temperature"<br>"卧室的温度"|
|2|[serviceType](#defaultvalue-servicetype-configuration默认值-类型配置)|String<br>字符串|set accessory type for Switch or Lightbulb.<br>设置配件类型是开关或者灯。<br>Currently only supported: SingleSwitch, DuplexSwitch, SingleSwitchLN, DuplexSwitchLN.<br>当前只支持如下设备：单火线单键墙壁开关，单火线双键墙壁开关，零火单键墙壁开关，零火双键墙壁开关。|"Switch"|"Switch"|"Lightbulb"|
|3|[disable](#defaultvalue-disable-configuration默认值-隐藏配件配置)|Boolean<br>布尔|disable accessory<br>隐藏设备|false|the accessories that do not need to be set to true, such as virtual press.<br>如果配件不需要时设置为true，如一些设备的虚拟按键。|true|
|4|[syncValue](#defaultvalue-syncvalue-configuration默认值-同步值配置)|Boolean<br>布尔|accessory will synchronization value when homebridge call the get function, if it's true.<br>如果设为true，配件会在HomeBridge每次调用get方法时同步一次值。|false|fasle|false|
|5|[ignoreWriteResult](#defaultvalue-ignorewriteresult-configuration默认值-忽略控制反馈配置)|Boolean<br>布尔|if set to true, the result of control is not detected.<br>如果设为true，则忽略控制结果检测。|true|If your network is awful, it's recommended to be set true.<br>如果网络环境不是很好，建议设为true|false|
|6|[disableNoResponse](#defaultvalue-disablenoresponse-configuration默认值-隐藏未响应状态配置)|Boolean<br>布尔|use jump back the last value to replace show NoResponse, you can set it true.<br>如果设为true，当设备未响应时配件通过自动跳回上一个值的方式来替代显示未响应|false|false|true|

The rules are as follows:   
配置规则如下：   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "device1 sid": {
                "DeviceAccessoryType1": {
                    "config1": "config1 value"
                }
            },
            "device2 sid": {
                "DeviceAccessoryType1": {
                    "config1": "config1 value"
                    "config2": "config2 value"
                },
                "DeviceAccessoryType2": {
                    "config1": "config1 value"
                }
            }
        }
    }]
}
```
examples:   
例子:   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "158d0001000001": {
                "ContactSensor_ContactSensor": {
                    "name": "entrance door"
                }
            },
            "158d0001000002": {
                "MotionSensor2_MotionSensor": {
                    "name": "study room motion sensor"
                },
                "MotionSensor2_LightSensor": {
                    "name": "study room light sensor"
                }
            }
        }
    }]
}
```
   
The rules of A DeviceAccessoryType:   
设备配件类型的规则如下：   
```
DeviceName_HomeBridgeAccessoryType(_ExtraMessage)   
设备名称_HomeBridge的配件类型(_附加信息)
```
detail:   
具体如下：    

||Device Name<br>设备名称|DeviceAccessoryType<br>设备包含的设备配件类型|
|:-:|:-|:-|
|1|Gateway(网关)|Gateway_Lightbulb<br>Gateway_LightSensor<br>Gateway_Switch_JoinPermission|
|2|ContactSensor(门磁感应)|ContactSensor_ContactSensor|
|3|MotionSensor(人体感应)|MotionSensor_MotionSensor|
|4|Button(按钮)|Button_StatelessProgrammableSwitch<br>Button_Switch_VirtualSinglePress<br>Button_Switch_VirtualDoublePress|
|5|TemperatureAndHumiditySensor(温度湿度传感器)|TemperatureAndHumiditySensor_TemperatureSensor<br>TemperatureAndHumiditySensor_HumiditySensor|
|6|SingleSwitch(单按钮墙壁开关)|SingleSwitch_Switch|
|7|DuplexSwitch(双按钮墙壁开关)|DuplexSwitch_Switch_Left<br>DuplexSwitch_Switch_Right|
|8|SingleSwitchLN(单按钮墙壁开关零火版)|SingleSwitchLN_Switch|
|9|DuplexSwitchLN(双按钮墙壁开关零火版)|DuplexSwitchLN_Switch_Left<br>DuplexSwitchLN_Switch_Right|
|10|SingleButton86(86型无线单按钮开关)|SingleButton86_StatelessProgrammableSwitch<br>SingleButton86_Switch_VirtualSinglePress|
|11|DuplexButton86(86型无线双按钮开关)|DuplexButton86_StatelessProgrammableSwitch_Left<br>DuplexButton86_Switch_VirtualSinglePress_Left<br>DuplexButton86_StatelessProgrammableSwitch_Right<br>DuplexButton86_Switch_VirtualSinglePress_Right<br>DuplexButton86_StatelessProgrammableSwitch_Both<br>DuplexButton86_Switch_VirtualSinglePress_Both|
|12|PlugBase(插座)|PlugBase_Outlet|
|13|PlugBase86(86型墙壁插座)|PlugBase86_Outlet|
|14|MagicSquare(魔方)|MagicSquare_StatelessProgrammableSwitch_Flip90<br>MagicSquare_StatelessProgrammableSwitch_Flip180<br>MagicSquare_StatelessProgrammableSwitch_Move<br>MagicSquare_StatelessProgrammableSwitch_TapTwice<br>MagicSquare_StatelessProgrammableSwitch_ShakeAir<br>MagicSquare_StatelessProgrammableSwitch_Rotate<br>MagicSquare_Switch_VirtualFlip90<br>MagicSquare_Switch_VirtualFlip180<br>MagicSquare_Switch_VirtualMove<br>MagicSquare_Switch_VirtualTapTwice<br>MagicSquare_Switch_VirtualShakeAir|
|15|SmokeDetector(烟雾报警器)|SmokeDetector_SmokeSensor|
|16|NatgasDetector(天然气报警器)|NatgasDetector_SmokeSensor|
|17|ElectricCurtain(电动窗帘)|ElectricCurtain_WindowCovering|
|18|ContactSensor2(门磁感应第二代)|ContactSensor2_ContactSensor|
|19|MotionSensor2(人体感应第二代)|MotionSensor2_MotionSensor<br>MotionSensor2_LightSensor|
|20|Button2(按钮第二代)|Button2_StatelessProgrammableSwitch<br>Button2_Switch_VirtualSinglePress<br>Button2_Switch_VirtualDoublePress|
|21|TemperatureAndHumiditySensor2(温度湿度传感器第二代)|TemperatureAndHumiditySensor2_TemperatureSensor<br>TemperatureAndHumiditySensor2_HumiditySensor|
|22|WaterDetector(水浸传感器)|WaterDetector_LeakSensor|
|23|Lock(门锁)|Lock_MotionSensor<br>Lock_MotionSensor_{UserID}|
|24|AcPartner(空调伴侣升级版)|AcPartner_LightSensor<br>AcPartner_Switch_JoinPermission|
|25|Button3(按钮第二代升级版)|Button3_StatelessProgrammableSwitch<br>Button3_StatelessProgrammableSwitch_Shake<br>Button3_Switch_VirtualSinglePress<br>Button3_Switch_VirtualDoublePress<br>Button3_Switch_VirtualShare|
|26|DuplexButton862(86型无线双按钮开关升级版)|DuplexButton862_StatelessProgrammableSwitch_Left<br>DuplexButton862_Switch_VirtualSinglePress_Left<br>DuplexButton862_Switch_VirtualDoublePress_Left<br>DuplexButton862_StatelessProgrammableSwitch_Right<br>DuplexButton862_Switch_VirtualSinglePress_Right<br>DuplexButton862_Switch_VirtualDoublePress_Right<br>DuplexButton862_StatelessProgrammableSwitch_Both<br>DuplexButton862_Switch_VirtualSinglePress_Both|
|27|VibrationSensor(动静贴)|VibrationSensor_MotionSensor_Vibrate<br>VibrationSensor_MotionSensor_Tilt<br>VibrationSensor_MotionSensor_FreeFall|
|28|ElectricCurtainBattery(电动窗帘锂电池版)|ElectricCurtainBattery_WindowCovering|
   
About Global:   
有关全局配置方式：   
Some similar configurations and repeated multiple copies are boring things. So I provided a global writing method.   
一些类似的配置和重复的多次拷贝是件比较烦的事情，所以我提供了一个全局的功能：   
The following two methods of writing are equivalent:   
下面两段配置的效果是等同的：   
```
....
"158d0001000008": {
    "DuplexSwitch_Switch_Left": {
        "name": "master bedroom room light",
        "serviceType": "Lightbulb"
    },
    "DuplexSwitch_Switch_Right": {
        "name": "study room light",
        "serviceType": "Lightbulb"
    }
}
....
```
```
....
"158d0001000008": {
    "Global": {
        "serviceType": "Lightbulb"
    },
    "DuplexSwitch_Switch_Left": {
        "name": "master bedroom room light"
    },
    "DuplexSwitch_Switch_Right": {
        "name": "study room light"
    }
}
....
```
In the same way, the following two kinds of writing are alse equivalent:   
同样的方式，下面两段配置的效果也是等同的：   
```
....
"158d0001000003": {
    "Button_StatelessProgrammableSwitch": {
        "name": "living room button"
    },
    "Button_Switch_VirtualSinglePress": {
        "name": "living room button virtual single press",
        "disable": true
    },
    "Button_Switch_VirtualDoublePress": {
        "name": "living room button virtual double press",
        "disable": true
    }
}
....
```
```
....
"158d0001000003": {
    "Global": {
        "disable": true 
    },
    "Button_StatelessProgrammableSwitch": {
        "name": "living room button",
        "disable": false
    },
    "Button_Switch_VirtualSinglePress": {
        "name": "living room button virtual single press"
    },
    "Button_Switch_VirtualDoublePress": {
        "name": "living room button virtual double press"
    }
}
....
```
It also provides a higher level of way, the following three kinds of writing are alse equivalent:   
更高层级的配置也可适用，如下三段配置的效果均是等同的：   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "158d0001000007": {
                "SingleSwitch_Switch": {
                    "name": "living room light",
                    "ignoreWriteResult": true
                }
            },
            "158d0001000008": {
                "DuplexSwitch_Switch_Left": {
                    "name": "master bedroom room light",
                    "ignoreWriteResult": true
                },
                "DuplexSwitch_Switch_Right": {
                    "name": "study room light",
                    "ignoreWriteResult": true
                }
            }
        }
    }]
}
```
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "158d0001000007": {
                "SingleSwitch_Switch": {
                    "name": "living room light",
                    "ignoreWriteResult": true
                }
            },
            "158d0001000008": {
                "Global": {
                    "ignoreWriteResult": true
                },
                "DuplexSwitch_Switch_Left": {
                    "name": "master bedroom room light"
                },
                "DuplexSwitch_Switch_Right": {
                    "name": "study room light"
                }
            }
        }
    }]
}
```
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "Global": {
                "ignoreWriteResult": true
            },
            "158d0001000007": {
                "SingleSwitch_Switch": {
                    "name": "living room light"
                }
            },
            "158d0001000008": {
                "DuplexSwitch_Switch_Left": {
                    "name": "master bedroom room light"
                },
                "DuplexSwitch_Switch_Right": {
                    "name": "study room light"
                }
            }
        }
    }]
}
```

### defaultValue name configuration(默认值 名称配置)
If you want to specify the default name of the device, add a mapping table to your config.json like this:   
如果你想给设备指定名称，可以像这样配置：   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "158d0001000001": {
                "ContactSensor_ContactSensor": {
                    "name": "entrance door"
                }
            },
            "158d0001000002": {
                "MotionSensor2_MotionSensor": {
                    "name": "study room motion sensor"
                },
                "MotionSensor2_LightSensor": {
                    "name": "study room light sensor"
                }
            },
            "158d0001000004": {
                "TemperatureAndHumiditySensor_TemperatureSensor": {
                    "name": "living room temperature"
                },
                "TemperatureAndHumiditySensor_HumiditySensor": {
                    "name": "living room humidity"
                }
            }
        }
    }]
}
```

### defaultValue serviceType configuration(默认值 类型配置)
If you like to use Light Bulb type for Light Switch to make grandma Siri happy, like snOOrz, you can set the following in the config:   
如果你想用灯泡类型来替换开关类型使你的奶奶开心，就像snoorz那样，你可以像如下这样设置：   
Currently only supported: SingleSwitch, DuplexSwitch, SingleSwitchLN, DuplexSwitchLN.   
目前只支持：单火线单键墙壁开关，单火线双键墙壁开关，零火单键墙壁开关，零火双键墙壁开关。   
**If you changed serviceType config, Please [clear register accessories](#clear-register-accessories).**   
**如果你修改过配件类型配置, 请[清除注册配件](#clear-register-accessories).**   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "158d0001000007": {
                "SingleSwitch_Switch": {
                    "name": "living room light",
                    "serviceType": "Lightbulb"
                }
            },
            "158d0001000008": {
                "Global": {
                    "serviceType": "Lightbulb"
                },
                "DuplexSwitch_Switch_Left": {
                    "name": "master bedroom room light"
                },
                "DuplexSwitch_Switch_Right": {
                    "name": "study room light"
                }
            },
            "158d10010000001": {
                "DuplexSwitch_Switch_Left": {
                    "name": "master bedroom room light",
                    "serviceType": "Lightbulb"
                },
                "DuplexSwitch_Switch_Right": {
                    "name": "study room light"
                }
            }
        }
    }]
}
```

### defaultValue disable configuration(默认值 隐藏配件配置)
If you want to disable accessories, you can add disable attribute to config.   
如果你想隐藏一些配件，你可以增加disable属性到你的配置。   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "158d0001000007": {
                "SingleSwitch_Switch": {
                    "name": "living room light",
                    "serviceType": "Lightbulb"
                }
            },
            "158d0001000008": {
                "DuplexSwitch_Switch_Left": {
                    "name": "master bedroom room light",
                    "serviceType": "Lightbulb",
                    "disable": false
                },
                "DuplexSwitch_Switch_Right": {
                    "name": "study room light",
                    "serviceType": "Lightbulb",
                    "disable": true
                }
            },
            "158d0001000004": {
                "TemperatureAndHumiditySensor_TemperatureSensor": {
                    "name": "living room temperature"
                },
                "TemperatureAndHumiditySensor_HumiditySensor": {
                    "name": "living room humidity",
                    "disable": true
                }
            },
            "158d0001000012": {
                "Global": {
                    "disable": true
                }
            },
            "158d0001000015": {
                "Global": {
                    "disable": true
                },
                "MagicSquare_StatelessProgrammableSwitch_Flip90": {
                    "name": "study room magic square flip90",
                    "disable": false
                }
            }
        }
    }]
}
```

### defaultValue syncValue configuration(默认值 同步值配置)
If you want to accessory value exact, you can set syncValue is true.   
如果您想要附件值精确，您可以设置syncValue为true。   
when syncValue is true, accessory will synchronization value when homebridge call the get function. At the same time, it's going to waste more time.   
当syncValue为true时，附件将在homebridge调用get函数时同步一次值。同时，也会浪费更多的时间。   
when syncValue is false, accessory will use the device last reported value. It's going to respond quickly.   
当syncValue为false时，附件将使用设备上次报告的值。它会很快做出反应。   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "158d0001000007": {
                "SingleSwitch_Switch": {
                    "name": "living room light",
                    "serviceType": "Lightbulb",
                    "syncValue": true
                }
            }
        }
    }]
}
```

### defaultValue ignoreWriteResult configuration(默认值 忽略控制反馈配置)
If you control device always timeout, but in fact it's already working.   
如果你控制设备时总是显示超时，但事实上设备已经被控制了。   
you can set ignoreWriteResult is true.   
您可以将ignoreWriteResult设置为true。   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "Global": {
                "ignoreWriteResult": true
            },
            "158d0001000007": {
                "SingleSwitch_Switch": {
                    "name": "living room light",
                    "serviceType": "Lightbulb",
                    "syncValue": true
                }
            }
        }
    }]
}
```
   
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/syncValue.png)
   
### defaultValue disableNoResponse configuration(默认值 隐藏未响应状态配置)
If you don't like "No Response", you can set disableNoResponse is true.   
如果你像渣渣米那样不喜欢设备显示“无响应”，可以将disableoresponse设置为true。   
When the device is no pesponse and disableNoResponse is true, the accessory value will auto jump back to before the control.   
当设备无响应且disableNoResponse为设为true时，配件的值将自动跳回控制前的值。   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "Global": {
                "disableNoResponse": true
            },
            "158d0001000007": {
                "SingleSwitch_Switch": {
                    "name": "living room light",
                    "serviceType": "Lightbulb",
                    "syncValue": true
                }
            }
        }
    }]
}
```

### defaultValue other configuration(默认值 其它配置)
If you want to use Aqara lock, you need add some configuration like this:   
如果你使用门锁，你需要增加如下配置：   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "LockDeviceID": {
                "Lock_MotionSensor": {
                    "name": "door"
                },
                "Lock_MotionSensor_{User1ID}": {
                    "name": "User1Name"
                },
                "Lock_MotionSensor_{User2ID}": {
                    "name": "User2Name"
                }
            }
        }
    }]
}
```
`{UserID}` is user identification from lock.   
`{UserID}` 是来自锁的用户标识。   
The value can get from `Aqara Lock Plugin` in `MIHOME` APP. The user ID contains the ID type.   
该值可以从“米家”应用程序中的“门锁插件”获取。用户ID包含ID类型。   
The integer value obtained by dividing the user ID by 65536 is the ID type. The ID type value is:   
通过将用户ID除以65536而获得的整数值是ID类型。ID类型值为：   
1. fingerprint 指纹   
2. password 密码   
3. proximity card 卡   
5. check-in password 登记密码   
Example:   
例子：   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        },
        "defaultValue": {
            "158d0001dd0289": {
                "Lock_MotionSensor": {
                    "name": "door"
                },
                "Lock_MotionSensor_65536": {
                    "name": "Administrator"
                },
                "Lock_MotionSensor_65537": {
                    "name": "Finger"
                },
                "Lock_MotionSensor_196608": {
                    "name": "Card"
                }
            }
        }
    }]
}
```  
   
### manage configuration(设备WEB管理界面配置)
Before version 0.7.x, the addition and deletion of accessories are automatic. The rules are as follows:   
在版本0.7.x之前，附件的添加和删除是自动的。规则如下：   
**find new accessories every one hour, delete accessories which did not receive heartbeat over 7 days.**   
**每1小时查找一次新配件，删除7天内未收到心跳的配件**   
Obviously, this is not easy to use. So version 0.7.0 added http web manage(if you do not set manage item, then http web manage is close.). config add these:   
显然，这并不容易使用。所以版本0.7.0添加了HTTP Web 管理(如果您没有设置管理项，那么Web管理默认是关闭的)。若要开启，配置添加这些：   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "manage": {
            "port": 11128,
            "password": "107927710"
        },
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        }
    }]
}
```
Config items description(配置项描述):   

||Name<br>名称|Required<br>是否必填|Value Type<br>值的数据类型|Description<br>功能描述|Recommended Value<br>建议值|Value Example<br>值举例|
|:-:|:-|:-|:-|:-|:-|:-|
|1|port|True<br>是|Integer<br>整型|set manage web port.<br>设置web管理的端口号。|11128|11128|
|2|password|True<br>是|String<br>字符串|set manage web password.<br>设置web管理的访问密码。|"107927710"|"107927710"|
    
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/httpWebManage.png)
    
### mqtt configuration(MQTT配置)
config add these:   
配置增加这些：   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "mqtt": {
        },
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        }
    }]
}
```
Or   
或   
```
{
    "platforms": [{
        "platform": "MiAqaraPlatform",
        "mqtt": {
            "server": "10.0.1.1",
            "username": "mqtt",
            "password": "mqtt"
        },
        "gateways": {
            "6409802da3b3": "02i44k56zrgg578b",
            "f0b4299a5b2b": "2F92E7DA90C66B86",
            "f0b4299a77dd": "syu3oasva3uqd5qd"
        }
    }]
}
```
Config items description(配置项描述):   

||Name<br>名称|Required<br>是否必填|Value Type<br>值的数据类型|Description<br>功能描述|Default Value<br>默认值|Value Example<br>值举例|
|:-:|:-|:-|:-|:-|:-|:-|
|1|server|False<br>否|String<br>字符串|set mqtt server ip.<br>设置mqtt服务器的地址|"127.0.0.1"|"10.0.1.1"|
|2|username|False<br>否|String<br>字符串|set mqtt username.<br>设置mqtt的用户名|"mqtt"|"mqtt"|
|3|password|False<br>否|String<br>字符串|set mqtt password.<br>设置mqtt的密码|"mqtt"|"mqtt"|
    
plugin will send these topic:   
插件会发送如下主题:   
1. `/homebridge-mi-aqara`: all message. 所有信息。   
2. `/homebridge-mi-aqara/{cmd}`: all message after `{cmd}` filter. 所有信息并按cmd过滤。   
3. `/homebridge-mi-aqara/{sid}`: all message after `{sid}` filter. 所有信息并按sid过滤。   
4. `/homebridge-mi-aqara/{sid}/{cmd}`: all message after `{sid}` and `{cmd}` filter.所有信息并按cmd和sid过滤。   
   
`{cmd}` is iam/get_id_list_ack/discovery_rsp/write_ack/write_rsp/read_ack/read_rsp/report.   
`{sid}` is device's sid.   
   
plugin will accept these topic:   
插件会接受如下主题：   
1. `/homebridge-mi-aqara/write`: write device. 控制设备。   
about write key, send the `${key}` is okay, this plugin will automatically calculate the key value, for example:   
关于控制密钥，直接发送 `${key}` 即可，程序会自动填写计算好的key值。例子如下：   
`{"cmd": "write", "model": "ctrl_neutral2", "sid": "158d00014a1bcd", "params": [{"channel_0": "off"}], "key": "${key}"}`
    
## Some explanation(一些说明)
Button/Button2 StatelessProgrammableSwitch support SinglePress, DoublePress, LongPress.   
SingleButton86/DuplexButton86(Left, Right, Both) StatelessProgrammableSwitch only support SinglePress.   
MagicSquare(Flip90, Flip180, Move, TapTwice, ShakeAir, Rotate) StatelessProgrammableSwitch only support SinglePress.   
   
## Run it(运行)
```
homebridge
```

run by debug   
Debug模式运行   
```
homebridge -D
```
   
## Clear register accessories(清除注册配件)
```
cd ~/.homebridge/accessories/   
mv cachedAccessories cachedAccessories_\`date '+%Y%m%d_%H%M%S'\`.bak   
echo [] > cachedAccessories   
```

## Version Logs(版本更新日志)
### 0.8.1 (2021-02-26)
1. add support Button2(remote.b1acn01).   
增加按钮二代(remote.b1acn01)的支持。   
2. add support ElectricCurtainBattery.   
增加电动窗帘锂电池版的支持。   
3. Chinese README.MD coming.   
期待已久的中文说明文件来了。因为绿米几乎不怎么更新局域网协议了，所以本插件未来也许也不会经常更新了。对于喜欢智能家居的朋友可以加QQ群多交流。   
### 0.8.0 (2018-11-04)
1. add MQTT support.   
增加MQTT的支持。   
### 0.7.3 (2018-10-27)
1. add support for VibrationSensor.   
增加动静贴的支持。   
### 0.7.2 (2018-10-09)
1. fixed bug that move 'sensor_switch' type form Button2 to Button.   
修复了sensor_switch类型应该对应按钮一代设备而不是按钮二代设备的问题。   
2. add support for Button3(sensor_switch.aq3).   
增加按钮三代的支持。   
3. add support for DuplexButton862(remote.b286acn01).   
增加双键86墙贴二代(remote.b286acn01)的支持。   
### 0.7.1 (2018-09-14)
1. fixed bug that delete orphan accessory list item fail in http web manage.   
修复了在web管理页面中删除孤儿附件项失败的问题。   
### 0.7.0 (2018-09-13)
1. fixed bug that DuplexSwitchLN right switch not work.   
修复了零火双键墙壁开关右键无法工作的问题。   
2. fixed bug that sometimes Gateway, AcPartner and MotionSensor2 light senor no response.   
修复了有时网关，空调伴侣，人体传感器二代的亮度传感器没响应的问题。   
3. fixed bug that MagicSquare Rotate StatelessProgrammableSwitch not work.   
修复了魔方旋转动作的一些问题。   
4. fixed bug that crash when auto remove accessory.   
修复了当自动删除配件可能会导致程序崩溃的问题。   
5. add http web manage.   
增加web管理功能。   
### 0.6.9 (2018-06-23)
1. fixed bug that config 'defaultValue' can not support: Button2, MotionSensor2, ContactSensor2, PlugBase86.   
修复了默认值不支持按钮二代，人体传感器二代，门磁传感器二代，86墙壁插座的一些问题。   
2. fixed bug that MotionSensor not work in aqara local network protocol 2.x version.   
修复了人体传感器一代在局域网协议2.x版本下不能正常工作的问题。   
3. support config gateway ip feature.   
增加通过配置指定网关IP的功能。   
### 0.6.9_beta (2018-03-26)
1. optimized some of the basic code to facilitate the subsequent support of new hardware.   
优化了一些基本代码，便于后续对新硬件的支持。   
2. supports aqara local network protocol 2.x version.   
支持2.x版本的局域网协议。   
3. add support for lock device.   
增加对门锁设备的支持。   
4. add support for acpartner accessory.   
增加对空调伴侣设备的支持。   
### 0.6.8 (2018-01-21)
1. fixed bug that sometimes DuplexSwitchLN and DuplexSwitch no response.   
修复了某些时候零火双键墙壁开关和单火线双键墙壁开关没有响应的问题。   
2. fixed bug that it still show battery low power after replacing the battery.   
修复了电池设备提示低电量后更换电池后仍然提示低电量的问题。   
3. fixed bug that TemperatureAndHumiditySensor and TemperatureAndHumiditySensor2 temperature sensor accessory can't show the negative number.   
修复了温湿度传感器一代和温湿度传感器二代的温度配件的值不能显示负数的问题。   
4. remove a duplicated function.   
删除一些过时的函数。   
5. add the choice bindAddress feature.   
增加多网络环境下指定网络的功能。   
### 0.6.7 (2017-12-10)
1. optimizing log content.   
优化日志内容。   
### 0.6.6 (2017-12-10)
1. fixed bug that sometimes DuplexSwitchLN and DuplexSwitch no response.   
修复了某些时候零火双键墙壁开关和单火线双键墙壁开关没有响应的问题。   
2. fixed bug that sometimes Gateway and MotionSensor2 light senor no response.   
修复了某些时候网关和人体传感器二代没有响应的问题。   
3. fixed bug that global config not work in some cases.   
修复了全局配置不工作的一些问题。   
4. add setting "ignoreWriteResult" feature.   
增加忽略写入结果检测的功能。   
5. remove the SingleButton86, DuplexButton86, MagicSquare redundant event action.   
删除单键86墙贴，双键86墙贴，魔方中一些冗余的动作。   
### 0.6.5 (2017-10-31)
1. optimizing log content.   
优化日志内容。   
2. optimizing read/write device response timeout rules.    
优化读写设备响应超时的规则。   
3. optimizing read/write device no response rules.   
优化读写设备未响应的判定规则。   
4. add gateway join permission switch accessory.   
增加网关添加新设备功能的按钮配件。   
5. add setting disable "No Response" feature.   
增加隐藏未响应的功能。   
### 0.6.4 (2017-10-27)
1. add virtual switch accessory can trigger homekit click events.   
增加虚拟按钮来触发homekit单击事件。   
2. optimizing log content.   
优化日志内容。   
3. optimizing HomeBridge startup read device info algorithm.   
优化插件启动时读取网关设备信息的方式。
### 0.6.3 (2017-10-26)
1. fixed bug that ElectricCurtain can't work.   
修复了电动窗帘不工作的问题。   
2. remove synchronization value when homebridge call the get function(only electrify device) and add setting synchronization value feature.   
删除了常电设备当homebridge调用get方法自动同步值的功能。
3. add config Global mode.   
增加全局配置模式。   
### 0.6.2 (2017-10-25)
1. fixed bug that MotionSensor motion sonser accessory status is error.   
修复了人体传感器一代状态错误的问题。   
2. fixed bug that MotionSensor2 motion sonser accessory status is error.   
修复了人体传感器二代状态错误的问题。   
### 0.6.1 (2017-10-23)
1. fixed bug that MotionSensor2 light sonser accessory value is error.   
修复了人体传感器二代亮度配件值的一些错误问题。   
### 0.6.0 (2017-10-22)
1. refactoring code.   
重构代码。   
2. add feedback when control accessory.   
增加设备控制时的反馈。   
3. synchronization value when homebridge call the get function. (only electrify device)   
当homebridge调用get方法时，同步设备当前最新的值(仅常电设备)。   
4. optimizing program structure, send fewer packets.   
优化程序结构，发送更少的网络数据包。   
5. optimizing config item name, easier to read.   
优化了配置项目名称。   
6. fixed some bug.   
修复了一些问题。   
7. add Button(single press, double press) virtual switch accessory.   
增加按钮一代(单击，双击)的虚拟开关配件。   
8. add Button2(single press, double press) virtual switch accessory.   
增加按钮二代(单击，双击)的虚拟开关配件。   
9. add SingleButton86(single press) virtual switch accessory.   
增加单键86墙贴(单击)的虚拟开关配件。   
10. add DuplexButton86(left button single press, right button single press, both press) virtual switch accessory.   
增加双键86墙贴(左键单击，右键单击，左右键同时单击)的虚拟开关配件。   
11. add MagicSquare(flip90, flip180, move, tapTwice, shakeAir) virtual switch accessory.   
增加魔方(旋转90度，旋转180度，移动，双击，摇晃)的虚拟开关配件。   
### 0.5.3 (2017-08-26)
1. optimized code.   
优化代码。   
### 0.5.2 (2017-08-23)
1. fixed bug that gateway light brightness is 100 when it light up.   
修复了当网关的夜灯打开亮度就被重置为100的问题。   
### 0.5.1 (2017-08-14)
1. fixed bug that natgas detector is not alarm.   
修复了天然气传感器不报警的问题。   
### 0.5.0 (2017-08-13)
1. add support for water detector accessory.   
增加水浸传感器的支持。   
2. fixed bug that natgas detector is not alarm.   
修复了天然气传感器不报警的问题。   
3. fixed bug that smoke detector is not alarm.   
增加了天然气报警器的支持。   
### 0.4.4 (2017-08-09)
1. add log content that show plugin version when homebridge started.   
增加了homebridge启动时显示插件版本的日志内容。   
2. fixed bug that run homebridge error there is no MiAqaraPlatform in config.json file.   
修复了当config.json中没有MiAqaraPlatform相关配置时运行homebridge错误的问题。   
### 0.4.3 (2017-08-01)
1. fixed bug that gateway light sensor not support when value is 0.   
修复了当网关的亮度传感器值为0时配件显示不支持的问题。   
2. fixed bug that motion sensor version 2 light sensor not support when value is 0.   
修复了当人体传感器二代的亮度传感器值为0时配件显示不支持的问题。   
### 0.4.2 (2017-07-29)
1. adjustment gateway light sensor value(subtract 279).   
调整网关的亮度照传感器值(减去279)。   
2. delete PlugBase, PlugBase86, SingleSwitch, DuplexSwitch, SingleSwitchLN, DuplexSwitchLN battery information.   
删除插座，墙壁插座，单火线单键墙壁开关，单火线双键墙壁开关，零火单键墙壁开关，零火双键的墙壁开关的电池信息。   
3. add motion sensor version 2 light sensor battery information.   
增加人体传感器二代的亮度传感器中电池信息。   
4. add setting accessory disable feature.   
增加隐藏配件的功能。   
5. fixed bug that electric curtain can't work, but there is no current operation state information now.   
修正了电动窗帘不能工作的问题，但是现在没有当前的操作状态信息。   
### 0.4.1 (2017-07-26)
1. code collation.   
代码整理。   
### 0.4.0 (2017-07-26)
1. add support for electric curtain accessory.   
增加了电动窗帘的支持。   
2. add support for contact sensor version 2 accessory.   
增加了门磁传感器二代的支持。   
3. add support for motion sensor version 2 accessory.   
增加了人体传感器二代的支持。   
4. add support for button version 2 accessory.   
增加了按钮二代的支持。   
5. add support for temperature and humidity sensor version 2 accessory.   
增加了温湿度传感器二代的支持。   
6. optimize log content.   
优化日志内容。   
7. add setting default name feature.   
增加默认名称的功能。   
8. add setting default service type feature.   
增加默认配件类型的功能。   
9. fixed motion sensor bug that wrong trigger when homebridge start.   
修正了homebridge启动时错误触发的人体传感器的问题。   
10.adjustment gateway light sensor value(subtract 300).   
调整网关的亮度传感器值(减去300)。   
### 0.3.3 (2017-06-16)
1. add single button 86 long press event.   
增加单键86墙贴长按事件。   
2. add duplex button 86 long press event.   
增加双键86墙贴长按事件。   
3. changed button click event value from Characteristic.ProgrammableSwitchEvent.CLICK back to Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS.   
修改按钮一代单击事件由Characteristic.ProgrammableSwitchEvent.CLICK到Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS。   
4. changed single button 86 click event value from Characteristic.ProgrammableSwitchEvent.CLICK back to Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS.   
修改单键86墙贴单击事件由Characteristic.ProgrammableSwitchEvent.CLICK到Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS。   
5. changed duplex button 86 click event value from Characteristic.ProgrammableSwitchEvent.CLICK back to Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS.   
修改双键86墙贴单击事件由Characteristic.ProgrammableSwitchEvent.CLICK到Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS。   
### 0.3.2 (2017-06-15)
1. fixed bug that duplex switch LN charging state.   
修复了双键零火墙壁开关充电状态显示错误的问题。   
2. fixed bug that single switch LN charging state.   
修复了单键零火墙壁开关充电状态显示错误的问题。   
3. fixed bug that single button 86 charging state.   
修复了单键86墙贴充电状态显示错误的问题。   
4. changed button click event value from Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS to Characteristic.ProgrammableSwitchEvent.CLICK.   
修改按钮一代单击事件由Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS到Characteristic.ProgrammableSwitchEvent.CLICK。   
5. changed single button 86 click event value from Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS to Characteristic.ProgrammableSwitchEvent.CLICK.   
修改单键86墙贴单击事件由Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS到Characteristic.ProgrammableSwitchEvent.CLICK。   
6. changed duplex button 86 click event value from Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS to Characteristic.ProgrammableSwitchEvent.CLICK.   
修改双键86墙贴单击事件由Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS到Characteristic.ProgrammableSwitchEvent.CLICK。   
7. fixed bug that natgas detector is not alarm.   
修复了天然气传感器不报警的问题。   
8. fixed bug that smoke detector is not alarm.   
修复了烟雾传感器不报警的问题。   
### 0.3.1 (2017-06-14)
1. code collation.   
代码整理。   
### 0.3.0 (2017-06-14)
1. add support for single switch LN accessory.   
增加了零火单键墙壁开关的支持。  
2. add support for duplex switch LN accessory.   
增加了零火双键墙壁开关的支持。  
3. add support for plug base 86 accessory.   
增加了墙壁插座的支持。   
4. add support for smoke detector accessory.   
增加了烟雾报警器的支持。   
5. add support for natgas detector accessory.   
增加了天然气报警器的支持。   
### 0.2.1 (2017-06-14)
1. change accessory registration mechanism, fixed bug that new accessory can't correlate associated with gateway.   
更改附件注册机制，修复了新附件无法与网关关联的错误。   
### 0.2.0 (2017-06-14)
1. add support for duplex switch accessory.   
增加了单火线双键墙壁开关的支持。  
2. add support for single button 86 accessory.   
增加了单键86墙贴的支持。  
3. add support for duplex button 86 accessory.   
增加了双键86墙贴的支持。  
### 0.1.0 (2017-06-13)
1. add support for plug base accessory.   
增加了插座的支持。  
2. add support for magic square accessory.   
增加了魔方的支持。  
### 0.0.6 (2017-06-12)
1. add some logs.   
增加了一些日志。   
### 0.0.5 (2017-06-08)
1. fixed bug.   
修复了一些问题。   
### 0.0.4 (2017-06-08)
1. fixed bug.   
修复了一些问题。   
### 0.0.3 (2017-06-08)
1. add support for gateway accessory: light sensor, hue light.   
增加了网关配件：亮度传感器，彩色灯泡。   
### 0.0.2 (2017-06-07)
1. add support for single switch accessory.   
增加了单火线单键墙壁开关的支持。   
### 0.0.1 (2017-06-07)
1. supported contact sensor accessory.   
增加了门磁传感器一代的支持。   
2. supported motion sensor accessory.   
增加了人体传感器一代的支持。   
3. supported button accessory.   
增加了按钮一代的支持。   
4. supported temperature and humidity sensor accessory.   
增加了温湿度传感器一代的支持。   
