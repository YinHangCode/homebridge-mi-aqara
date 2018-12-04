# homebridge-mi-aqara
[![npm version](https://badge.fury.io/js/homebridge-mi-aqara.svg)](https://badge.fury.io/js/homebridge-mi-aqara)

homebridge plugin for XiaoMi Aqara plugin.   

Thanks for 
[nfarina](https://github.com/nfarina)(the author of [homebridge](https://github.com/nfarina/homebridge)), 
[snOOrz](https://github.com/snOOrz)(the author of [homebridge-aqara](https://github.com/snOOrz/homebridge-aqara)), 
[licuhui](https://github.com/licuhui), 
[攀旺智能](https://pwzn.taobao.com/), 
[瀚思彼岸论坛](https://bbs.hassbian.com/), 
[magaHH](https://github.com/magaHH), 
[isundaylee](https://github.com/isundaylee), 
[ileler](https://github.com/ileler), 
all other developer and testers.   

**Note: I have only a part of these devices, so some devices don't have tested. If you find bugs, please submit them to [issues](https://github.com/YinHangCode/homebridge-mi-aqara/issues) or [QQ Group: 107927710](//shang.qq.com/wpa/qunwpa?idkey=8b9566598f40dd68412065ada24184ef72c6bddaa11525ca26c4e1536a8f2a3d).**
   
**Note: According to aqara local network protocol use UDP port 9898, please notice the relevant configuration of firewall.**   
   
**Note: 0.5.x update to 0.6.x must be [clear register accessories](#clear-register-accessories) and update [configuration](#configuration) file content.**   
   
**Note: About AcPartner, This project only provides gateway functionality. If you want the use air conditioning function, please refer to the project for [homebridge-mi-acPartner](https://github.com/LASER-Yi/homebridge-mi-acPartner).**   
   
This repository contains the Aqara plugin for homebridge.   
Aqara is a ZigBee gateway with a few sensors.   

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

## Supported Devices
||Device Name|Protocol Model Value|
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
|20|Button2(按钮第二代)|sensor_switch.aq2|
|21|TemperatureAndHumiditySensor2(温度湿度传感器第二代)|weather.v1<br>weather|
|22|WaterDetector(水浸传感器)|sensor_wleak.aq1|
|23|Lock(门锁)|lock.aq1|
|24|AcPartner(空调伴侣升级版)|acpartner.v3|
|25|Button3(按钮第二代升级版)|sensor_switch.aq3|
|26|DuplexButton862(86型无线双按钮开关升级版)|remote.b286acn01|
|27|VibrationSensor(动静贴)|vibration|


## Pre-Requirements
1. Make sure your IOS version is ios11 or later.   
2. Make sure you have gateway v2 or acpartner v3. gateway v1 has limited space so can't support this feature.   
3. Update gateway firmware to **1.4.1_155.0143(gateway v2)**, **1.4.1_148.019(acpartner v3)** or later.   

## Installation
1. Install HomeBridge, please follow it's [README](https://github.com/nfarina/homebridge/blob/master/README.md).   
If you are using Raspberry Pi, please read [Running-HomeBridge-on-a-Raspberry-Pi](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi).   
2. Make sure you can see HomeBridge in your iOS devices, if not, please go back to step 1.   
3. Download homebridge-mi-aqara to your HomeBridge path or installation through NPM:
```
npm install -g homebridge-mi-aqara
```
   

## Configuration
||Name|Required|Value Type|Description|Value Example|
|:-:|:-|:-|:-|:-|:-|
|1|platform|True|String||It must be 'MiAqaraPlatform'|
|2|[gateways](#gateways-configuration)|True|Object|set gateway information.|{ "6409802da3b3": "02i44k56zrgg578b" }|
|3|[bindAddress](#bindaddress-configuration)|False|String|specified network.|"10.0.1.1"|
|4|[defaultValue](#defaultvalue-configuration)|False|Object|set device default value.||
|5|[manage](#manage-configuration)|False|Object|open manage and manage configs.|{ "port": 11128, "password": "107927710" }|
|6|[mqtt](#mqtt-configuration)|False|Object|open mqtt and mqtt configs.|{ "username": "mqtt", "password": "107927710" }|

For more information about config, Please refer to file `sampleConfig.json`.   

### gateways configuration
Open aqara gateway's settings, enable [local network protocol](https://github.com/louisZL/lumi-gateway-local-api).  
Please follow the steps in this thread: http://wiki.yinhh.com/Wiki.jsp?page=Homebridge-mi-aqara or http://bbs.xiaomi.cn/t-13198850. It's in Chinese so you might need a translator to read it.  
To control the devices, put gateway's MAC address (**lower case without colon**) and password (**keep original and case sensitive**) to ~/.homebridge/config.json.   
   
Warning: gateway's MAC address (**lower case without colon**) and password (**keep original and case sensitive**).   
Warning: gateway's MAC address (**lower case without colon**) and password (**keep original and case sensitive**).   
Warning: gateway's MAC address (**lower case without colon**) and password (**keep original and case sensitive**).   
Important things are to be repeated for 3 times.
   
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
If you have more than one gateways, fill them in right order, like below.  
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
That is to say, we can config the IP address of the gateway to replace search gateway by multicast.   
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

### bindAddress configuration
If your device(which running homebridge) has multiple network, please add the bindAddress configuration item to decide to listen which network, like below.   
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

### defaultValue configuration
If you want to specify the default value, such as specify the name of the accessory, hide the accessory, any other configs. You can add a defaultValue mapping table to your config.json.   
The config supported are as follows:   

||Name|Value Type|Description|Default Value|Recommended Value|Value Example|
|:-:|:-|:-|:-|:-|:-|:-|
|1|[name](#defaultvalue-name-configuration)|String|set accessory name.|DeviceAccessoryType_device SID last four bits||"living room temperature"|
|2|[serviceType](#defaultvalue-servicetype-configuration)|String|set accessory type for Switch or Lightbulb. <br>Currently only supported: SingleSwitch, DuplexSwitch, SingleSwitchLN, DuplexSwitchLN.|"Switch"|"Switch"|"Lightbulb"|
|3|[disable](#defaultvalue-disable-configuration)|Boolean|disable accessory|false|the accessories that do not need to be set to true, such as virtual press.|true|
|4|[syncValue](#defaultvalue-syncvalue-configuration)|Boolean|accessory will synchronization value when homebridge call the get function, if it's true.|false|fasle|false|
|5|[ignoreWriteResult](#defaultvalue-ignorewriteresult-configuration)|Boolean|if set to true, the result of control is not detected.|true|If your network is awful, it's recommended to be set true.|false|
|6|[disableNoResponse](#defaultvalue-disablenoresponse-configuration)|Boolean|use jump back the last value to replace show NoResponse, you can set it true.|false|false|true|

The rules are as follows:
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
```
DeviceName_HomeBridgeAccessoryType(_ExtraMessage)
```
detail:   

||Device Name|DeviceAccessoryType|
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


About Global:   
Some similar configurations and repeated multiple copies are boring things. So I provided a global writing method.   
The following two methods of writing are equivalent:   
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

### defaultValue name configuration
If you want to specify the default name of the device, add a mapping table to your config.json like this.
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

### defaultValue serviceType configuration
If you like to use Light Bulb type for Light Switch to make grandma Siri happy, like snOOrz, you can set the following in the config.   
Currently only supported: SingleSwitch, DuplexSwitch, SingleSwitchLN, DuplexSwitchLN.   
**If you changed serviceType config, Please [clear register accessories](#clear-register-accessories).**   
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

### defaultValue disable configuration
If you want to disable accessories, you can add disable attribute to config.   
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

### defaultValue syncValue configuration
If you want to accessory value exact, you can set syncValue is true.   
when syncValue is true, accessory will synchronization value when homebridge call the get function. At the same time, it's going to waste more time.   
when syncValue is false, accessory will use the device last reported value. It's going to respond quickly.   
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

### defaultValue ignoreWriteResult configuration
If you control device always timeout, but in fact it's already working.   
you can set ignoreWriteResult is true.   
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
   
### defaultValue disableNoResponse configuration
If you don't like "No Response", you can set disableNoResponse is true.   
When the device is no pesponse and disableNoResponse is true, the accessory value will auto jump back to before the control.   
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

### defaultValue other configuration
If you want to use Aqara lock,you need add some configuration like this:   
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
The value can get from `Aqara Lock Plugin` in `MIHOME` APP. The user ID contains the ID type.   
The integer value obtained by dividing the user ID by 65536 is the ID type. The ID type value is:   
1 fingerprint   
2 password   
3 proximity card   
5 check-in password   
Example:   
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
   
### manage configuration
Before version 0.7.x, the addition and deletion of accessories are automatic. The rules are as follows:   
**find new accessories every one hour, delete accessories which did not receive heartbeat over 7 days.**   
Obviously, this is not easy to use. So version 0.7.0 added http web manage(if you do not set manage item, then http web manage is close.). config add these:   
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
Config items description:   

||Name|Required|Value Type|Description|Recommended Value|Value Example|
|:-:|:-|:-|:-|:-|:-|:-|
|1|port|True|Integer|set manage web port.|11128|11128|
|2|password|True|String|set manage web password.|"107927710"|"107927710"|
    
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-aqara/master/images/httpWebManage.png)
    
### mqtt configuration
config add these:   
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
Config items description:   

||Name|Required|Value Type|Description|Default Value|Value Example|
|:-:|:-|:-|:-|:-|:-|:-|
|1|server|False|String|set mqtt server ip.|"127.0.0.1"|"10.0.1.1"|
|2|username|False|String|set mqtt username.|"mqtt"|"mqtt"|
|3|password|False|String|set mqtt password.|"mqtt"|"mqtt"|
    
plugin will send these topic:   
1. `/homebridge-mi-aqara`: all message.   
2. `/homebridge-mi-aqara/{cmd}`: all message after {cmd} filter.   
3. `/homebridge-mi-aqara/{sid}`: all message after {sid} filter.   
4. `/homebridge-mi-aqara/{sid}/{cmd}`: all message after {sid} and {cmd} filter.   
   
`{cmd}` is iam/get_id_list_ack/discovery_rsp/write_ack/write_rsp/read_ack/read_rsp/report.   
`{sid}` is device's sid.   
   
plugin will accept these topic:   
1. `/homebridge-mi-aqara/write`: write device.   
about write key, send the ${key} is okay, this plugin will automatically calculate the key value, for example:   
`{"cmd": "write", "model": "ctrl_neutral2", "sid": "158d00014a1bcd", "params": [{"channel_0": "off"}],"key": "${key}"}`
    
## Some explanation
Button/Button2 StatelessProgrammableSwitch support SinglePress, DoublePress, LongPress.   
SingleButton86/DuplexButton86(Left, Right, Both) StatelessProgrammableSwitch only support SinglePress.   
MagicSquare(Flip90, Flip180, Move, TapTwice, ShakeAir, Rotate) StatelessProgrammableSwitch only support SinglePress.   
   
## Run it
homebridge -D   
   
## Clear register accessories
cd ~/.homebridge/accessories/   
mv cachedAccessories cachedAccessories_\`date '+%Y%m%d_%H%M%S'\`.bak   
echo [] > cachedAccessories   

## Version Logs
### 0.8.0 (2018-11-04)
1. add mqtt support.   
### 0.7.3 (2018-10-27)
1. add support for VibrationSensor.   
### 0.7.2 (2018-10-09)
1. fixed bug that move 'sensor_switch' type form Button2 to Button.   
2. add support for Button3(sensor_switch.aq3).   
3. add support for DuplexButton862(remote.b286acn01).   
### 0.7.1 (2018-09-14)
1. fixed bug that delete orphan accessory list item fail in http web manage.   
### 0.7.0 (2018-09-13)
1. fixed bug that DuplexSwitchLN right switch not work.   
2. fixed bug that sometimes Gateway, AcPartner and MotionSensor2 light senor no response.   
3. fixed bug that MagicSquare Rotate StatelessProgrammableSwitch not work.   
4. fixed bug that crash when auto remove accessory.   
5. add http web manage.   
### 0.6.9 (2018-06-23)
1. fixed bug that config 'defaultValue' can not support: Button2, MotionSensor2, ContactSensor2, PlugBase86.   
2. fixed bug that MotionSensor not work in aqara local network protocol 2.x version.   
3. support config gateway ip feature.   
### 0.6.9_beta (2018-03-26)
1. optimized some of the basic code to facilitate the subsequent support of new hardware.   
2. supports aqara local network protocol 2.x version.   
3. add support for lock device.   
4. add support for acpartner accessory.   
### 0.6.8 (2018-01-21)
1. fixed bug that sometimes DuplexSwitchLN and DuplexSwitch no response.   
2. fixed bug that it still show battery low power after replacing the battery.   
3. fixed bug that TemperatureAndHumiditySensor and TemperatureAndHumiditySensor2 temperature sensor accessory can't show the negative number.   
4. remove a duplicated function.   
5. add the choice bindAddress feature.
### 0.6.7 (2017-12-10)
1. optimizing log content.   
### 0.6.6 (2017-12-10)
1. fixed bug that sometimes DuplexSwitchLN and DuplexSwitch no response.   
2. fixed bug that sometimes Gateway and MotionSensor2 light senor no response.   
3. fixed bug that global config not work in some cases.   
4. add setting "ignoreWriteResult" feature.   
5. remove the SingleButton86, DuplexButton86, MagicSquare redundant event action.   
### 0.6.5 (2017-10-31)
1. optimizing log content.   
2. optimizing read/write device response timeout rules.   
3. optimizing read/write device no response rules.   
4. add gateway join permission switch accessory.   
5. add setting disable "No Response" feature.   
### 0.6.4 (2017-10-27)
1. add virtual switch accessory can trigger homekit click events.   
2. optimizing log content.   
3. optimizing HomeBridge startup read device info algorithm.   
### 0.6.3 (2017-10-26)
1. fixed bug that ElectricCurtain can't work.   
2. remove synchronization value when homebridge call the get function(only electrify device) and add setting synchronization value feature.   
3. add config Global mode.   
### 0.6.2 (2017-10-25)
1. fixed bug that MotionSensor motion sonser accessory status is error.   
2. fixed bug that MotionSensor2 motion sonser accessory status is error.   
### 0.6.1 (2017-10-23)
1. fixed bug that MotionSensor2 light sonser accessory value is error.   
### 0.6.0 (2017-10-22)
1. refactoring code.   
2. add feedback when control accessory.   
3. synchronization value when homebridge call the get function. (only electrify device)   
4. optimizing program structure, send fewer packets.   
5. optimizing config item name, easier to read.   
6. fixed some bug.   
7. add Button(single press, double press) virtual switch accessory.   
8. add Button2(single press, double press) virtual switch accessory.   
9. add SingleButton86(single press) virtual switch accessory.   
10. add DuplexButton86(left button single press, right button single press, both press) virtual switch accessory.   
11. add MagicSquare(flip90, flip180, move, tapTwice, shakeAir) virtual switch accessory.   
### 0.5.3 (2017-08-26)
1. optimized code.   
### 0.5.2 (2017-08-23)
1. fixed bug that gateway light brightness is 100 when it light up.   
### 0.5.1 (2017-08-14)
1. fixed bug that natgas detector is not alarm.   
### 0.5.0 (2017-08-13)
1. add support for water detector accessory.   
2. fixed bug that natgas detector is not alarm.   
3. fixed bug that smoke detector is not alarm.   
### 0.4.4 (2017-08-09)
1. add log content that show plugin version when homebridge started.   
2. fixed bug that run homebridge error there is no MiAqaraPlatform in config.json file.   
### 0.4.3 (2017-08-01)
1. fixed bug that gateway light sensor not support when value is 0;   
2. fixed bug that motion sensor version 2 light sensor not support when value is 0;   
### 0.4.2 (2017-07-29)
1. adjustment gateway light sensor value(subtract 279).   
2. delete PlugBase, PlugBase86, SingleSwitch, DuplexSwitch, SingleSwitchLN, DuplexSwitchLN battery information.   
3. add motion sensor version 2 light sensor battery information.   
4. add setting accessory disable feature.   
5. fixed bug that electric curtain can't work, but there is no current operation state information now.   
### 0.4.1 (2017-07-26)
1. code collation.   
### 0.4.0 (2017-07-26)
1. add support for electric curtain accessory.   
2. add support for contact sensor version 2 accessory.   
3. add support for motion sensor version 2 accessory.   
4. add support for button version 2 accessory.   
5. add support for temperature and humidity sensor version 2 accessory.   
6. optimize log content.   
7. add setting default name feature.   
8. add setting default service type feature.   
9. fixed motion sensor bug that wrong trigger when homebridge start.   
10.adjustment gateway light sensor value(subtract 300).   
### 0.3.3 (2017-06-16)
1. add single button 86 long press event.   
2. add duplex button 86 long press event.   
3. changed button click event value from Characteristic.ProgrammableSwitchEvent.CLICK back to Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS.   
4. changed single button 86 click event value from Characteristic.ProgrammableSwitchEvent.CLICK back to Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS.   
5. changed duplex button 86 click event value from Characteristic.ProgrammableSwitchEvent.CLICK back to Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS.   
### 0.3.2 (2017-06-15)
1. fixed bug that duplex switch LN charging state.   
2. fixed bug that single switch LN charging state.   
3. fixed bug that single button 86 charging state.   
4. changed button click event value from Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS to Characteristic.ProgrammableSwitchEvent.CLICK.   
5. changed single button 86 click event value from Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS to Characteristic.ProgrammableSwitchEvent.CLICK.   
6. changed duplex button 86 click event value from Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS to Characteristic.ProgrammableSwitchEvent.CLICK.   
7. fixed bug that natgas detector is not alarm.   
8. fixed bug that smoke detector is not alarm.   
### 0.3.1 (2017-06-14)
1. code collation.   
### 0.3.0 (2017-06-14)
1. add support for single switch LN accessory.   
2. add support for duplex switch LN accessory.   
3. add support for plug base 86 accessory.   
4. add support for smoke detector accessory.   
5. add support for natgas detector accessory.   
### 0.2.1 (2017-06-14)
1. change accessory registration mechanism, fixed bug that new accessory can't correlate associated with gateway.   
### 0.2.0 (2017-06-14)
1. add support for duplex switch accessory.   
2. add support for single button 86 accessory.   
3. add support for duplex button 86 accessory.   
### 0.1.0 (2017-06-13)
1. add support for plug base accessory.   
2. add support for magic square accessory.   
### 0.0.6 (2017-06-12)
1. add some logs.
### 0.0.5 (2017-06-08)
1. fixed bug.
### 0.0.4 (2017-06-08)
1. fixed bug.
### 0.0.3 (2017-06-08)
1. add support for gateway accessory: light sensor, hue light.
### 0.0.2 (2017-06-07)
1. add support for single switch accessory.   
### 0.0.1 (2017-06-07)
1. supported contact sensor accessory.   
2. supported motion sensor accessory.   
3. supported button accessory.   
4. supported temperature and humidity sensor accessory.   
