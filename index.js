const dgram = require('dgram');
const crypto = require('crypto');

const packageFile = require("./package.json");
const LogUtil = require('./lib/LogUtil');
const ConfigUtil = require('./lib/ConfigUtil');
const GatewayUtil = require('./lib/GatewayUtil');
const DeviceUtil = require('./lib/DeviceUtil');
const AccessoryUtil = require('./lib/AccessoryUtil');
const ParseUtil = require('./lib/ParseUtil');

const iv = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e]);
const serverSocket = dgram.createSocket({
    type: 'udp4',
    reuseAddr: true
});
const multicastAddress = '224.0.0.50';
const multicastPort = 4321;
const serverPort = 9898;

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
    if(null == config) {
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
    this.initServerSocket();

    this.doRestThings(api);
    
    this.log.info("**************************************************************");
    this.log.info("           MiAqaraPlatform v"+packageFile.version+" By YinHang");
    this.log.info("  GitHub: https://github.com/YinHangCode/homebridge-mi-aqara  ");
    this.log.info("                                         QQ Group: 107927710  ");
    this.log.info("**************************************************************");
    this.log.info("start success...");
}

MiAqaraPlatform.prototype.configureAccessory = function(accessory) {
    var that = this;
    
    // accessory.reachable = true;
    if(that.AccessoryUtil) {
        that.AccessoryUtil.add(accessory);
    }
}

MiAqaraPlatform.prototype.initServerSocket = function() {
    var that = this;
    
    // err - Error object, https://nodejs.org/api/errors.html
    serverSocket.on('error', function(err){
        that.log.error('error, msg - %s, stack - %s\n', err.message, err.stack);
    });
    
    serverSocket.on('listening', function(){
        that.log.info("server is listening on port 9898.");
        serverSocket.addMembership(multicastAddress);
    });
    
    serverSocket.on('message', this.parseMessage.bind(this));
    
    serverSocket.bind(serverPort);
}

MiAqaraPlatform.prototype.doRestThings = function(api) {
    var that = this;
    if (api) {
        that.api = api;

        that.api.on('didFinishLaunching', function() {
            that.sendWhoisCommand();

            setInterval(() => {
                that.sendWhoisCommand();
            }, 1 * 60 * 60 * 1000);
            
            setInterval(() => {
                that.autoRemoveAccessory();
            }, 1 * 60 * 60 * 1000);
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
    }
    
    if (accessoriesToRemove.length > 0) {
        that.unregisterPlatformAccessories(accessoriesToRemove);
    }
}

MiAqaraPlatform.prototype.sendWhoisCommand = function() {
    var whoisCommand = '{"cmd": "whois"}';
    this.log.debug("[Send]" + whoisCommand);
    serverSocket.send(whoisCommand, 0, whoisCommand.length, multicastPort, multicastAddress);
}

MiAqaraPlatform.prototype.initServerSocket = function() {
    var that = this;
    
    // err - Error object, https://nodejs.org/api/errors.html
    serverSocket.on('error', function(err){
        that.log.error('error, msg - %s, stack - %s\n', err.message, err.stack);
    });
    
    serverSocket.on('listening', function(){
        that.log.info("server is listening on port 9898.");
        serverSocket.addMembership(multicastAddress);
    });
    
    serverSocket.on('message', this.parseMessage.bind(this));
    
    serverSocket.bind(serverPort);
}

MiAqaraPlatform.prototype.parseMessage = function(msg, rinfo){
    var that = this;

//  that.log.debug(msg);
    var jsonObj;
    try {
        jsonObj = JSON.parse(msg);
    } catch (ex) {
        that.log.error("Bad msg %s", msg);
        return;
    }
    
    var cmd = jsonObj['cmd'];
    if (cmd === 'iam') {
        that.log.debug("[Revc]" + msg);
        var gatewaySid = jsonObj['sid'];
        if(that.ConfigUtil.isConfigGateway(gatewaySid)) {
            var ip = jsonObj['ip'];
            var port = jsonObj['port'];
            var listCmd = '{"cmd":"get_id_list"}';
            that.log.debug("[Send]" + listCmd);
            serverSocket.send(listCmd, 0, listCmd.length, port, ip);
        }
    } else if (cmd === 'get_id_list_ack') {
        that.log.debug("[Revc]" + msg);
        var gatewaySid = jsonObj['sid'];
        var gateway = that.GatewayUtil.getBySid(gatewaySid);
        if(!gateway) {
            gateway = {
                sid: gatewaySid,
                passwd: that.ConfigUtil.getGatewayPasswordByGatewaySid(gatewaySid),
                ip: rinfo.address,
                port: rinfo.port,
                token: jsonObj['token']
            }
            that.GatewayUtil.addOrUpdate(gatewaySid, gateway);
        }
        
        if(!that.DeviceUtil.getBySid(gatewaySid)) {
            var gatewayDevice = {
                sid: gatewaySid,
                gatewaySid: gatewaySid,
                lastUpdateTime: Date.now()
            }
            that.DeviceUtil.addOrUpdate(gatewaySid, gatewayDevice);
            
            var command1 = '{"cmd":"read", "sid":"' + gatewaySid + '"}';
            that.sendReadCommand(gatewaySid, command1, {timeout: 0.5 * 60 * 1000, retryCount: 12}).then(result => {
                that.DeviceUtil.update({model: result['model']});
                var createAccessories = that.ParseUtil.getCreateAccessories(result);
                that.registerPlatformAccessories(createAccessories);
                that.ParseUtil.parserAccessories(result);
                
                that.deleteDisableAccessories(result['sid'], result['model']);
            }).catch(function(err) {
                that.DeviceUtil.remove(gatewaySid);
                that.log.error(err);
            });
        }
        
        var data = JSON.parse(jsonObj['data']);
        var index = 0;
        var sendInterval = setInterval(() => {
            if(index >= data.length) {
                that.log.debug("read gateway device list finished. size: " + index);
                clearInterval(sendInterval);
                return;
            }
            
            var deviceSid = data[index];
            if(!that.DeviceUtil.getBySid(deviceSid)) {
                var device = {
                    sid: deviceSid,
                    gatewaySid: gatewaySid,
                    lastUpdateTime: Date.now()
                }
                that.DeviceUtil.addOrUpdate(deviceSid, device);
                
                var command2 = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                that.sendReadCommand(deviceSid, command2, {timeout: 3 * 1000, retryCount: 12}).then(result => {
                    that.DeviceUtil.update({model: result['model']});
                    var createAccessories = that.ParseUtil.getCreateAccessories(result);
                    that.registerPlatformAccessories(createAccessories);
                    that.ParseUtil.parserAccessories(result);
                    
                    that.deleteDisableAccessories(result['sid'], result['model']);
                }).catch(function(err) {
                    that.DeviceUtil.remove(deviceSid);
                    that.log.error(err);
                });
            }
            
            index++;
        }, 50);
    } else if (cmd === 'heartbeat') {
//      that.log.debug(msg);
        var model = jsonObj['model'];
        var sid = jsonObj['sid'];
        
        if (model === 'gateway') {
            that.GatewayUtil.update(sid, {token: jsonObj['token']});
        }

        var device = that.DeviceUtil.getBySid(sid);
        if(device) {
            var newLastUpdateTime = Date.now();
//          that.log.debug("update device: " + sid + ", lastUpdateTime " + device.lastUpdateTime + " to " + newLastUpdateTime);
            that.DeviceUtil.update(sid, {lastUpdateTime: newLastUpdateTime});
        } else {
        }
    } else if (cmd === 'write_ack') {
        var msgTag = 'write_' + jsonObj['sid'];
        const p = that.getPromises(msgTag);
        if(!p) {
            that.log.warn("[Revc]" + msg);
            return;
        } else {
            that.log.debug("[Revc]" + msg);
            if(jsonObj['data'] && jsonObj['data'].indexOf('error') > -1) {
                p.reject(new Error(JSON.parse(jsonObj['data'])['error']));
            } else if(jsonObj['data'] && jsonObj['data'].indexOf('unknown') > -1) {
                p.reject(new Error(jsonObj['data']));
            } else {
                p.resolve(jsonObj);
            }
        }
    } else if (cmd === 'read_ack') {
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
            serverSocket.send(msg, 0, msg.length, port, ip, err => err && reject(err));
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
        that.AccessoryUtil.remove(accessory);
    });
}
