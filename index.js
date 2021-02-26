const dgram = require('dgram');
const crypto = require('crypto');

const fs = require('fs');
const path=require('path');

const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');

const mqtt = require("mqtt");

const packageFile = require("./package.json");
const LogUtil = require('./lib/LogUtil');
const ConfigUtil = require('./lib/ConfigUtil');
const GatewayUtil = require('./lib/GatewayUtil');
const DeviceUtil = require('./lib/DeviceUtil');
const AccessoryUtil = require('./lib/AccessoryUtil');
const ParseUtil = require('./lib/ParseUtil');

const iv = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e]);

const serverAqaraLANProtocolSocket = dgram.createSocket({
    type: 'udp4',
    reuseAddr: true
});
const serverAqaraLANProtocolMulticastAddress = '224.0.0.50';
const serverAqaraLANProtocolMulticastPort = 4321;
const serverAqaraLANProtocolServerPort = 9898;

const serverMQTTClientPrefix = "/homebridge-mi-aqara";

var PlatformAccessory, Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
    PlatformAccessory = homebridge.platformAccessory;
    Accessory = homebridge.hap.Accessory;
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;
    
    homebridge.registerPlatform("homebridge-mi-aqara", "MiAqaraPlatform", MiAqaraPlatform, true);
}

function MiAqaraPlatform(log, config, api) {
    if (null == config) {
        return;
    }
    
    // Initialize
    this.Accessory = Accessory;
    this.PlatformAccessory = PlatformAccessory;
    this.Service = Service;
    this.Characteristic = Characteristic;
    this.UUIDGen = UUIDGen;
    
    this.api = api;
    this.log = new LogUtil(null, log);
    this.ConfigUtil = new ConfigUtil(config);
    
    this.GatewayUtil = new GatewayUtil();
    this.DeviceUtil = new DeviceUtil();
    this.AccessoryUtil = new AccessoryUtil();
    this.ParseUtil = new ParseUtil(this);
    
    this._promises = {};
    this.initServerAqaraLANProtocol();
    this.initServerMiAqaraManage();
    this.initServerMQTTClient();

    this.doRestThings(api);
    
    this.log.info("**************************************************************");
    this.log.info("           MiAqaraPlatform v"+packageFile.version+" By YinHang");
    this.log.info("  GitHub: https://github.com/YinHangCode/homebridge-mi-aqara  ");
    this.log.info("                                         QQ Group: 107927710  ");
    this.log.info("**************************************************************");
    this.log.info("start success...");
    this.log.info("config gateways: " + this.log.objKey2Str(config['gateways']));
    if (null == this.ConfigUtil.getBindAddress()) {
        this.log.info("binding to the default interface");
    } else {
        this.log.info("bind address is: " + this.ConfigUtil.getBindAddress());
    }
}

MiAqaraPlatform.prototype.configureAccessory = function(accessory) {
    var that = this;
    
    accessory.reachable = true;
    accessory.on('identify', function(paired, callback) {
        that.log.debug(accessory.displayName + " Identify!!!");
    });

    if(that.AccessoryUtil) {
        that.AccessoryUtil.add(accessory);
    }
}

MiAqaraPlatform.prototype.doRestThings = function(api) {
    var that = this;
    if (api) {
        that.api = api;

        that.api.on('didFinishLaunching', function() {
            that.sendWhoisCommand();

            setInterval(() => {
                that.sendWhoisCommand();
            }, that.ConfigUtil.getSendWhoisCmdInterval());
            
            var autoRemoveAccessoryInterval = that.ConfigUtil.getAutoRemoveAccessoryInterval();
            if(null != autoRemoveAccessoryInterval) {
                setInterval(() => {
                    that.autoRemoveAccessory();
                }, autoRemoveAccessoryInterval);
            }
        });
    } else {
        that.log.error("Homebridge's version is too old, please upgrade!");
    }
}

MiAqaraPlatform.prototype.deleteDisableAccessories = function(sid, model) {
    var that = this;
    var accessoriesToRemove = [];
    
    var uuids = that.ParseUtil.getAccessoriesUUID(sid, model);
    for(var accessoryType in uuids) {
        if(that.ConfigUtil.getAccessoryDisable(sid, accessoryType)) {
            var accessory = that.AccessoryUtil.getByUUID(uuids[accessoryType]);
            if(accessory) {
                accessoriesToRemove.push(accessory);
            }
        }
    }
    
    if (accessoriesToRemove.length > 0) {
        that.unregisterPlatformAccessories(accessoriesToRemove);
    }
}

MiAqaraPlatform.prototype.autoRemoveAccessory = function() {
    var that = this;
    var accessoriesToRemove = [];
    
    const autoRemoveDelta = 7 * 24 * 60 * 60 * 1000;
    var autoRemoveDevice = that.DeviceUtil.getAutoRemoveDevice(autoRemoveDelta);
    for(var sid in autoRemoveDevice) {
        var device = autoRemoveDevice[sid];
        var deviceModel = device.model;
        var uuids = that.ParseUtil.getAccessoriesUUID(sid, deviceModel);
        for(var accessoryType in uuids) {
            var accessory = that.AccessoryUtil.getByUUID(uuids[accessoryType]);
            if(accessory) {
                accessoriesToRemove.push(accessory);
            }
        }
        that.DeviceUtil.remove(sid);
    }
    
    if (accessoriesToRemove.length > 0) {
        that.unregisterPlatformAccessories(accessoriesToRemove);
        
    }
}

MiAqaraPlatform.prototype.sendWhoisCommand = function() {
    var that = this;
    var hosts = that.ConfigUtil.getHosts();
    var gateways = that.ConfigUtil.getGateways();
    if(Object.getOwnPropertyNames(hosts).length > 0) {
        for (var key in hosts) {
            var vMsg = '{"cmd":"virtual_iam","sid":"' + key + '","port":"' + hosts[key]['port'] + '","ip":"' + hosts[key]['ip'] + '"}';
            that.parseMessage(vMsg, null);
        }
    }
    if(Object.getOwnPropertyNames(hosts).length < Object.getOwnPropertyNames(gateways).length) {
        var whoisCommand = '{"cmd": "whois"}';
        that.log.debug("[Send]" + whoisCommand);
        serverAqaraLANProtocolSocket.send(whoisCommand, 0, whoisCommand.length, serverAqaraLANProtocolMulticastPort, serverAqaraLANProtocolMulticastAddress);
    }
}

MiAqaraPlatform.prototype.initServerAqaraLANProtocol = function() {
    var that = this;
    
    // err - Error object, https://nodejs.org/api/errors.html
    serverAqaraLANProtocolSocket.on('error', (err) => {
        that.log.error('error, msg - %s, stack - %s\n', err.message, err.stack);
    });
    
    serverAqaraLANProtocolSocket.on('listening', () => {
        if (null == that.ConfigUtil.getBindAddress()) {
            serverAqaraLANProtocolSocket.addMembership(serverAqaraLANProtocolMulticastAddress);
        } else {
            serverAqaraLANProtocolSocket.setMulticastInterface(that.ConfigUtil.getBindAddress());
            serverAqaraLANProtocolSocket.addMembership(serverAqaraLANProtocolMulticastAddress, that.ConfigUtil.getBindAddress());
        }
        that.log.info("Aqara LAN protocol server is listening on port: " + serverAqaraLANProtocolServerPort);
    });
    serverAqaraLANProtocolSocket.on('message', this.parseMessage.bind(this));

    serverAqaraLANProtocolSocket.bind(serverAqaraLANProtocolServerPort);
}

MiAqaraPlatform.prototype.initServerMQTTClient = function() {
    var that = this;
    
    var mqttCfg = that.ConfigUtil.getMQTTConfig();
    if(mqttCfg) {
        var mqttHost = "mqtt://" + (mqttCfg && mqttCfg['server'] || "127.0.0.1");
        var mqttUsername = mqttCfg && mqttCfg['username'] || "mqtt";
        var mqttPassword = mqttCfg && mqttCfg['password'] || "mqtt";
        var mqttOptions = {
            clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
            username: mqttUsername,
            password: mqttPassword
        };
        try {
            that.mqttClient = mqtt.connect(mqttHost, mqttOptions);
            that.mqttClient.subscribe(serverMQTTClientPrefix + "/write");
            that.mqttClient.on('message', (topic, message) => {
                if(topic === serverMQTTClientPrefix + "/write") {
                    try {
                        var msgObj = JSON.parse(message);
                        var msg = message.toString();

                        var cmd = msgObj['cmd'];
                        var sid = msgObj['sid'];
                        if(cmd === "write" && sid) {
                            that.sendWriteCommandWithoutFeedback(sid, msg, {});
                            that.log.debug("(MQTT)(Revc Success)Topic: " + topic + ", Message: " + message);
                        } else {
                            that.log.error("(MQTT)(Revc Fail: cmd or sid is empty)Topic: " + topic + ", Message: " + message);
                        }
                    } catch (ex) {
                        that.log.error("(MQTT)(Revc Fail: " + ex + ")Topic: " + topic + ", Message: " + message);
                    }
                }
            });
            that.log.info('MQTT client connect success.');
        } catch(e) {
            that.mqttClient = null;
            that.log.error('MQTT client connect fail: ' + e);
        }
    }
}

MiAqaraPlatform.prototype.initServerMiAqaraManage = function() {
    var that = this;

    var serverMiAqaraManagePassword = that.ConfigUtil.getManagePassword();
    var serverMiAqaraManagePort = that.ConfigUtil.getManagePort();
    if(serverMiAqaraManagePort && serverMiAqaraManagePassword) {
        const serverMiAqaraManageHttp = express();
        serverMiAqaraManageHttp.use(session({
            secret: '***cb01fb4a-b6fb-11e8-96f8-529269fb1459_homebridge-mi-aqara_by_Mr.Yin_-_QQ_Group:107927710_c355a982-b6fb-11e8-96f8-529269fb1459*',
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 30 * 60 * 1000
            },
            rolling: true // 只要页面由刷新，session值就会被保存，如果为false则只要半小时以后不管有没有操作，session都会消失
        }));
        
        serverMiAqaraManageHttp.use('/login', express.static(path.join(__dirname, './manage/login/')));
        
        serverMiAqaraManageHttp.get('*', (request, response) => {
            try {
                var url = request.url;
                if(request.session.isLogin) {
                    if(url === '/healthyList.action') {
                        var result = [];
                        for(var gatewaySid in that.GatewayUtil.getAll()) {
                            var gateway = that.GatewayUtil.getBySid(gatewaySid);
                            var resultItem = {};
                            resultItem['type'] = 'Gateway';
                            resultItem['id'] = 'Gateway_' + gatewaySid;
                            resultItem['name'] = '[Gateway]' + gatewaySid;
                            resultItem['ip'] = gateway['ip'];
                            resultItem['proto_version'] = gateway['proto_version'];
                            resultItem['deviceModel'] = that.ParseUtil.getByModelName(gateway['model']);
                            var gChildren = [];
                            for(var deviceSid in that.DeviceUtil.getAll()) {
                                var device = that.DeviceUtil.getBySid(deviceSid);
                                if(device['gatewaySid'] == gatewaySid) {
                                    var deviceItem = {};
                                    deviceItem['type'] = 'Device';
                                    deviceItem['id'] = 'Device_' + deviceSid;
                                    deviceItem['name'] = '[Device]' + deviceSid;
                                    deviceItem['model'] = device['model'];
                                    deviceItem['lastUpdateTime'] = device['lastUpdateTime'];
                                    deviceItem['deviceModel'] = that.ParseUtil.getByModelName(device['model']);
                                    var dChildren = [];
                                    var uuids = that.ParseUtil.getAccessoriesUUID(deviceSid, device['model']);
                                    for(var accessoryType in uuids) {
                                        var accessory = that.AccessoryUtil.getByUUID(uuids[accessoryType]);
                                        if(accessory) {
                                            var accessoryItem = {};
                                            accessoryItem['type'] = 'Accessory';
                                            accessoryItem['id'] = 'Accessory_' + accessory.UUID;
                                            accessoryItem['name'] = '[Accessory]' + accessory.displayName;
                                            accessoryItem['uuid'] = accessory.UUID;
                                            dChildren.push(accessoryItem);
                                        }
                                    }
                                    deviceItem['children'] = dChildren;
                                    gChildren.push(deviceItem);
                                }
                            }
                            resultItem['children'] = gChildren;
                            result.push(resultItem);
                        }
                        response.writeHead(200, {'Content-type': 'application/json;charset=utf-8'});
                        response.write(JSON.stringify(result));
                        response.end();
                    } else if(url.indexOf("/discovery.action?") == 0) {
                        that.sendWhoisCommand();
                        response.writeHead(200, {'Content-type': 'application/json;charset=utf-8'});
                        response.write('{"result": "success", "date": "' + new Date().Format("yyyy-MM-dd hh:mm:ss") + '"}');
                        response.end();
                    } else if(url.indexOf("/deleteAccessory.action?") == 0) {
                        var uuid = request.query.uuid;
                        var accessory = that.AccessoryUtil.getByUUID(uuid);
                        if(accessory) {
                            that.unregisterPlatformAccessories([accessory]);
                            response.writeHead(200, {'Content-type': 'application/json;charset=utf-8'});
                            response.write('{"result": "success", "date": "' + new Date().Format("yyyy-MM-dd hh:mm:ss") + '"}');
                            response.end();
                        } else {
                            response.writeHead(200, {'Content-type': 'application/json;charset=utf-8'});
                            response.write('{"result": "fail", "date": "' + new Date().Format("yyyy-MM-dd hh:mm:ss") + '"}');
                            response.end();
                        }
                    } else if(url === '/orphanList.action') {
                        var accessories = JSON.parse(JSON.stringify(that.AccessoryUtil.getAll()));
                        for(var deviceSid in that.DeviceUtil.getAll()) {
                            var device = that.DeviceUtil.getBySid(deviceSid);
                            var uuids = that.ParseUtil.getAccessoriesUUID(deviceSid, device['model']);
                            for(var accessoryType in uuids) {
                                if(accessories[uuids[accessoryType]]) {
                                    delete accessories[uuids[accessoryType]];
                                }
                            }
                        }
                        var result = [];
                        for(var uuid in accessories) {
                            var accessory = accessories[uuid];
                            var accessoryItem = {};
                            accessoryItem['type'] = 'Accessory';
                            accessoryItem['id'] = 'Accessory_' + accessory.UUID;
                            accessoryItem['name'] = '[Accessory]' + accessory.displayName;
                            accessoryItem['uuid'] = accessory.UUID;
                            result.push(accessoryItem);
                        }
                        response.writeHead(200, {'Content-type': 'application/json;charset=utf-8'});
                        response.write(JSON.stringify(result));
                        response.end();
                    } else {
                        var file = path.join(__dirname, './manage/' + url);
                        if(fs.existsSync(file)) {
                            response.sendFile(file);
                        } else {
                            response.status(404).end('404');
                        }
                    }
                } else {
                    response.redirect('/login/login.html');
                }
            } catch(err) {
                that.log.error(err);
            }
        });
        
        serverMiAqaraManageHttp.post('/login.action', bodyParser.urlencoded({extended: false}), (request, response) => {
            var requestPassword = request.body['password'];
            if(serverMiAqaraManagePassword == requestPassword) {
                request.session.isLogin = true;
                response.redirect('/index.html');
            } else {
                response.redirect('/login/login.html');
            }
        });

        setTimeout(() => {
            serverMiAqaraManageHttp.listen(serverMiAqaraManagePort, () => {
                that.log.info("MiAqara Manage server is listening on port: " + serverMiAqaraManagePort);
            });
        }, 12 * 1000);
    }
}

MiAqaraPlatform.prototype.sendMQTTMessage4ParseMessage = function(msg, rinfo) {
    var that = this;
    
    var jsonObj = JSON.parse(msg);
    var cmd = jsonObj['cmd'];
    var sid = jsonObj['sid'];
    
    // delete this filter if you need heartbeat
    if (cmd === 'heartbeat') {
        return;
    }
    
    that.mqttClient.publish(serverMQTTClientPrefix, msg);
    that.log.debug("(MQTT)(Send Success)Topic: " + serverMQTTClientPrefix + ", Message: " + msg);
    
    that.mqttClient.publish(serverMQTTClientPrefix + "/" + cmd, msg);
    that.log.debug("(MQTT)(Send Success)Topic: " + serverMQTTClientPrefix + "/" + cmd + ", Message: " + msg);
    
    if(sid) {
        that.mqttClient.publish(serverMQTTClientPrefix + "/" + sid, msg);
        that.log.debug("(MQTT)(Send Success)Topic: " + serverMQTTClientPrefix + "/" + sid + ", Message: " + msg);
        
        that.mqttClient.publish(serverMQTTClientPrefix + "/" + sid + "/" + cmd, msg);
        that.log.debug("(MQTT)(Send Success)Topic: " + serverMQTTClientPrefix + "/" + sid + "/" + cmd + ", Message: " + msg);
    }
}

MiAqaraPlatform.prototype.parseMessage = function(msg, rinfo) {
    var that = this;

    //  that.log.debug(msg);
    
    // check message
    var jsonObj;
    try {
        jsonObj = JSON.parse(msg);
    } catch (ex) {
        that.log.error("Bad msg: " + msg);
        return;
    }
    
    // send mqtt message
    if(that.mqttClient) {
        that.sendMQTTMessage4ParseMessage(msg, rinfo);
    }
    
    // parse message
    var cmd = jsonObj['cmd'];
    if (cmd === 'iam' || cmd === 'virtual_iam') {
        that.log.debug("[Revc]" + msg);
        var gatewaySid = jsonObj['sid'];
        if(that.ConfigUtil.isConfigGateway(gatewaySid)) {
            if(that.ConfigUtil.isHostGateway(gatewaySid) && cmd != 'virtual_iam') {
                return;
            }
            
            var gateway = that.GatewayUtil.getBySid(gatewaySid);
            if(!gateway) {
                // add gateway
                gateway = {
                    sid: gatewaySid,
                    passwd: that.ConfigUtil.getGatewayPasswordByGatewaySid(gatewaySid),
                    ip: jsonObj['ip'], // rinfo.address,
                    port: jsonObj['port'] // rinfo.port,
                }
                gateway = that.GatewayUtil.addOrUpdate(gatewaySid, gateway);
            
                // add device
                if(!that.DeviceUtil.getBySid(gatewaySid)) {
                    var gatewayDevice = {
                        sid: gatewaySid,
                        gatewaySid: gatewaySid,
                        lastUpdateTime: Date.now()
                    }
                    that.DeviceUtil.addOrUpdate(gatewaySid, gatewayDevice);
                    
                    var command1 = '{"cmd":"read", "sid":"' + gatewaySid + '"}';
                    that.sendReadCommand(gatewaySid, command1, {timeout: 0.5 * 60 * 1000, retryCount: 12}).then(result => {
                        that.DeviceUtil.addOrUpdate(result['sid'], {model: result['model']});
                        var createAccessories = that.ParseUtil.getCreateAccessories(result);
                        that.registerPlatformAccessories(createAccessories);
                        that.ParseUtil.parserAccessories(result);
                        
                        that.deleteDisableAccessories(result['sid'], result['model']);
                        
                        // set gateway proto_version
                        var proto_version = null;
                        try {
                            if('read_ack' === result['cmd']) {
                                var data = result['data'];
                                proto_version = data && JSON.parse(data)['proto_version'];
                            } else if('read_rsp' === result['cmd']) {
                                var params = result['params'];
                                if(params) {
                                    for(var i in params) {
                                        if(params[i]['proto_version']) {
                                            proto_version = params[i]['proto_version'];
                                            break;
                                        }
                                    }
                                }
                            } else {
                            }
                            
                            gateway = that.GatewayUtil.addOrUpdate(gatewaySid, {
                                proto_version: proto_version,
                                model: result['model']
                            });
                            
                            // send list cmd
                            var listCmd = that.getCmdListByProtoVersion(proto_version);
                            if(listCmd) {
                                that.log.debug("[Send]" + listCmd);
                                serverAqaraLANProtocolSocket.send(listCmd, 0, listCmd.length, jsonObj['port'], jsonObj['ip']);
                            }
                        } catch(e) {
                            that.log.debug(e);
                        }
                    }).catch(function(err) {
                        that.DeviceUtil.remove(gatewaySid);
                        that.log.error(err);
                    });
                } 
            } else {
                // send list cmd
                var proto_version = gateway['proto_version'];
                var listCmd = that.getCmdListByProtoVersion(proto_version);
                if(listCmd) {
                    that.log.debug("[Send]" + listCmd);
                    serverAqaraLANProtocolSocket.send(listCmd, 0, listCmd.length, jsonObj['port'], jsonObj['ip']);
                }
            }
        }
    } else if (cmd === 'get_id_list_ack' || cmd === 'discovery_rsp') {
        that.log.debug("[Revc]" + msg);
        var gatewaySid = jsonObj['sid'];
        
        // update gateway token
        var gateway = that.GatewayUtil.getBySid(gatewaySid);
        if(gateway) {
            that.GatewayUtil.addOrUpdate(gatewaySid, {token: jsonObj['token']});
        
            // add gateway sub device
            var deviceSids = that.getDeviceListByJsonObj(jsonObj, gateway.proto_version);
            var index = 0;
            var sendInterval = setInterval(() => {
                if(index >= deviceSids.length) {
                    that.log.debug("read gateway(" + gatewaySid + ") device list finished. size: " + index);
                    clearInterval(sendInterval);
                    return;
                }
                
                var deviceSid = deviceSids[index];
                if(!that.DeviceUtil.getBySid(deviceSid)) {
                    var device = {
                        sid: deviceSid,
                        gatewaySid: gatewaySid,
                        model: jsonObj['model'],
                        lastUpdateTime: Date.now()
                    }
                    that.DeviceUtil.addOrUpdate(deviceSid, device);
                }
                
                var command2 = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                that.sendReadCommand(deviceSid, command2, {timeout: 3 * 1000, retryCount: 12}).then(result => {
                    that.DeviceUtil.addOrUpdate(result['sid'], {model: result['model']});
                    var createAccessories = that.ParseUtil.getCreateAccessories(result);
                    that.registerPlatformAccessories(createAccessories);
                    that.ParseUtil.parserAccessories(result);
                    
                    that.deleteDisableAccessories(result['sid'], result['model']);
                }).catch(function(err) {
                    that.DeviceUtil.remove(deviceSid);
                    that.log.error(err);
                });
                
                index++;
            }, 50);
        }
    } else if (cmd === 'heartbeat') {
//      that.log.debug("[Revc]" + msg);
        var model = jsonObj['model'];
        var sid = jsonObj['sid'];
        
        if (that.ParseUtil.isGatewayModel(model)) {
            that.GatewayUtil.update(sid, {token: jsonObj['token']});
        }

        var device = that.DeviceUtil.getBySid(sid);
        if(device) {
            var newLastUpdateTime = Date.now();
//          that.log.debug("update device: " + sid + ", lastUpdateTime " + device.lastUpdateTime + " to " + newLastUpdateTime);
            that.DeviceUtil.update(sid, {lastUpdateTime: newLastUpdateTime});
            if(!that.ParseUtil.isGatewayModel(model) && (jsonObj['data'] || jsonObj['params'])) {
                that.ParseUtil.parserAccessories(jsonObj);
            }
        } else {
        }
    } else if (cmd === 'write_ack' || cmd === 'write_rsp') {
        var msgTag = 'write_' + jsonObj['sid'];
        const p = that.getPromises(msgTag);
        if(!p) {
            that.log.warn("[Revc]" + msg);
            return;
        } else {
            that.log.debug("[Revc]" + msg);
            if(jsonObj['data'] && jsonObj['data'].indexOf('error') > -1) {
                p.reject(new Error(JSON.parse(jsonObj['data'])['error']));
            } else if(jsonObj['data'] && jsonObj['data'].indexOf('\"unknown\"') > -1 && jsonObj['data'].indexOf('\"on\"') == -1 && jsonObj['data'].indexOf('\"off\"') == -1) {
                p.reject(new Error(jsonObj['data']));
            } else {
                p.resolve(jsonObj);
            }
        }
    } else if (cmd === 'read_ack' || cmd === 'read_rsp') {
        var msgTag = 'read_' + jsonObj['sid'];
        const p = that.getPromises(msgTag);
        if(!p) {
            that.log.warn("[Revc]" + msg);
            return;
        } else {
            that.log.debug("[Revc]" + msg);
            if(jsonObj['data'] && jsonObj['data'].indexOf('error') > -1) {
                p.reject(new Error(JSON.parse(jsonObj['data'])['error']));
            // } else if(jsonObj['data'] && jsonObj['data'].indexOf('unknown') > -1) {
                // p.reject(new Error(jsonObj['data']));
            } else {
                p.resolve(jsonObj);
            }
        }
    } else if (cmd === 'report') {
        that.log.debug("[Revc]" + msg);
        that.ParseUtil.parserAccessories(jsonObj);
    } else {
        that.log.warn("[Revc]" + msg);
    }
}

MiAqaraPlatform.prototype.getProtoVersionPrefixByProtoVersion = function(proto_version) {
    if(proto_version) {
        var dotIndex = proto_version.indexOf('.');
        if(dotIndex > 0) {
            return proto_version.substring(0, dotIndex);
        }
    }
    
    return null;
}

MiAqaraPlatform.prototype.getCmdListByProtoVersion = function(proto_version) {
    var listCmd = null;
    var proto_version_prefix = this.getProtoVersionPrefixByProtoVersion(proto_version);
    if(1 == proto_version_prefix) {
        listCmd = '{"cmd":"get_id_list"}';
    } else if(2 == proto_version_prefix) {
        listCmd = '{"cmd":"discovery"}';
    } else {
    }
    
    return listCmd;
}

MiAqaraPlatform.prototype.getDeviceListByJsonObj = function(jsonObj, proto_version) {
    var deviceList = [];
    var proto_version_prefix = this.getProtoVersionPrefixByProtoVersion(proto_version);
    if(1 == proto_version_prefix) {
        deviceList = JSON.parse(jsonObj['data']);
    } else if(2 == proto_version_prefix) {
        for(var i in jsonObj['dev_list']) {
            deviceList.push(jsonObj['dev_list'][i]['sid']);
        }
    } else {
    }
    
    return deviceList;
}

MiAqaraPlatform.prototype.getDeviceProtoVersionBySid = function(sid) {
    var that = this;
    var device = that.DeviceUtil.getBySid(sid);
    if(device) {
        var gateway = that.GatewayUtil.getBySid(device.gatewaySid);
        if(gateway) {
            return gateway.proto_version;
        }
    }
    
    return null;
}

MiAqaraPlatform.prototype.getDeviceModelBySid = function(sid) {
    var that = this;
    var device = that.DeviceUtil.getBySid(sid);
    if(device) {
        return device.model;
    }
    
    return null;
}

MiAqaraPlatform.prototype.getPromises = function(msgTag) {
    var resultTag = null;
    for(var promisesTag in this._promises) {
        if(promisesTag.indexOf(msgTag) > -1) {
            if(null == resultTag || Number(resultTag.slice(resultTag.indexOf('_t')+2)) > Number(promisesTag.slice(promisesTag.indexOf('_t')+2))) {
                resultTag = promisesTag;
            }
        }
    }
    return this._promises[resultTag];
}

Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

MiAqaraPlatform.prototype.getPromisesTagSerialNumber = function() {
    if(null == this.PromisesTagSerialNumber) {
        this.PromisesTagSerialNumber = {
            time: new Date().Format("yyyyMMddhhmmss"),
            num: 0
        }
    } else {
        if(new Date().Format("yyyyMMddhhmmss") != this.PromisesTagSerialNumber.time) {
            this.PromisesTagSerialNumber.time = new Date().Format("yyyyMMddhhmmss");
            this.PromisesTagSerialNumber.num = 0;
        }
    }
    return this.PromisesTagSerialNumber.time + (this.PromisesTagSerialNumber.num++);
}

MiAqaraPlatform.prototype.sendCommand = function(ip, port, msgTag, msg, options) {
    var that = this;
    return new Promise((resolve, reject) => {
        if(!that.PromisesSendCommand) {
            that.PromisesSendCommand = {};
        }
        
        const triggerCorrelationPromises = (fun, res) => {
            var promisesSendCommands = that.PromisesSendCommand[ip + port + msg];
            if(promisesSendCommands) {
                promisesSendCommands = promisesSendCommands.concat();
                delete that.PromisesSendCommand[ip + port + msg];
                promisesSendCommands.forEach(function(promisesSendCommand, index, arr) {
                    const p = that._promises[promisesSendCommand];
                    if(p) {
                        p[fun](res);
                    }
                });
            }
        }
        
        let retryLeft = (options && options.retryCount) || 3;
        const send = () => {
            retryLeft --;
            that.log.debug("[Send]" + msg);
            serverAqaraLANProtocolSocket.send(msg, 0, msg.length, port, ip, err => err && reject(err));
        }
        const _sendTimeout = setInterval(() => {
            if(retryLeft > 0) {
                send();
            } else {
                clearInterval(_sendTimeout);
                delete that._promises[msgTag];
                var err = new Error('timeout: ' + msg);
                triggerCorrelationPromises('reject', err);
                reject(err);
            }
        }, (options && options.timeout) || 1 * 1000);
            
        that._promises[msgTag] = {
            resolve: res => {
                clearInterval(_sendTimeout);
                delete that._promises[msgTag];
                triggerCorrelationPromises('resolve', res);
                resolve(res);
            },
            reject: err => {
                clearInterval(_sendTimeout);
                delete that._promises[msgTag];
                triggerCorrelationPromises('reject', err);
                reject(err);
            }
        };
        
        if(that.PromisesSendCommand[ip + port + msg]) {
            that.PromisesSendCommand[ip + port + msg].push(msgTag);
        } else {
            that.PromisesSendCommand[ip + port + msg] = [];
            send();
        }
    })
}

MiAqaraPlatform.prototype.sendReadCommand = function(deviceSid, command, options) {
    var that = this;
    return new Promise((resolve, reject) => {
        var device = that.DeviceUtil.getBySid(deviceSid);
        var gateway = that.GatewayUtil.getBySid(device.gatewaySid);
        var msgTag = 'read_' + deviceSid + "_t" + that.getPromisesTagSerialNumber();
        that.sendCommand(gateway.ip, gateway.port, msgTag, command, options).then(result => {
            resolve(result);
        }).catch(function(err) {
            // that.log.error(err);
            reject(err);
        });
    })
}

MiAqaraPlatform.prototype.sendWriteCommand = function(deviceSid, command, options) {
    var that = this;
    return new Promise((resolve, reject) => {
        var device = that.DeviceUtil.getBySid(deviceSid);
        var gateway = that.GatewayUtil.getBySid(device.gatewaySid);
        
        var cipher = crypto.createCipheriv('aes-128-cbc', that.ConfigUtil.getGatewayPasswordByGatewaySid(gateway['sid']), iv);
        var gatewayToken = gateway['token'];
        var key = cipher.update(gatewayToken, "ascii", "hex");
        cipher.final('hex'); // Useless data, don't know why yet.
        
        command = command.replace('${key}', key);
        var msgTag = 'write_' + deviceSid + "_t" + that.getPromisesTagSerialNumber();
        that.sendCommand(gateway.ip, gateway.port, msgTag, command, options).then(result => {
            resolve(result);
        }).catch(function(err) {
            // that.log.error(err);
            reject(err);
        });
    })
}

MiAqaraPlatform.prototype.sendWriteCommandWithoutFeedback = function(deviceSid, command, options) {
    var that = this;
    var device = that.DeviceUtil.getBySid(deviceSid);
    var gateway = that.GatewayUtil.getBySid(device.gatewaySid);
    
    var cipher = crypto.createCipheriv('aes-128-cbc', that.ConfigUtil.getGatewayPasswordByGatewaySid(gateway['sid']), iv);
    var gatewayToken = gateway['token'];
    var key = cipher.update(gatewayToken, "ascii", "hex");
    cipher.final('hex'); // Useless data, don't know why yet.
    
    command = command.replace('${key}', key);
    that.log.debug("[Send]" + command);
    serverAqaraLANProtocolSocket.send(command, 0, command.length, gateway.port, gateway.ip, err => err && reject(err));
}

MiAqaraPlatform.prototype.registerPlatformAccessories = function(accessories) {
    var that = this;
    that.api.registerPlatformAccessories("homebridge-mi-aqara", "MiAqaraPlatform", accessories);
    accessories.forEach(function(accessory, index, arr) {
        that.log.info("create accessory - UUID: " + accessory.UUID);
        that.AccessoryUtil.add(accessory);
    });
}

MiAqaraPlatform.prototype.unregisterPlatformAccessories = function(accessories) {
    var that = this;
    that.api.unregisterPlatformAccessories("homebridge-mi-aqara", "MiAqaraPlatform", accessories);
    accessories.forEach(function(accessory, index, arr) {
        that.log.info("delete accessory - UUID: " + accessory.UUID);
        that.AccessoryUtil.remove(accessory.UUID);
    });
}
