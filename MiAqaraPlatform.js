require('./DeviceParsers/GatewayParser');
require('./DeviceParsers/ContactParser');
require('./DeviceParsers/MotionParser');
require('./DeviceParsers/ButtonParser');
require('./DeviceParsers/TemperatureAndHumidityParser');
require('./DeviceParsers/SingleSwitchParser');
require('./DeviceParsers/DuplexSwitchParser');
require('./DeviceParsers/SingleButton86Parser');
require('./DeviceParsers/DuplexButton86Parser');
require('./DeviceParsers/PlugBaseParser');
require('./DeviceParsers/MagicSquareParser');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

const dgram = require('dgram');
const crypto = require('crypto');

const iv = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e]);
const serverSocket = dgram.createSocket({
    type: 'udp4',
    reuseAddr: true
});
const multicastAddress = '224.0.0.50';
const multicastPort = 4321;
const serverPort = 9898;

module.exports = function(homebridge) {
    Accessory = homebridge.hap.Accessory;
    PlatformAccessory = homebridge.platformAccessory;

    // Service and Characteristic are from hap-nodejs
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    // Register
    homebridge.registerPlatform("homebridge-mi-aqara", "MiAqaraPlatform", MiAqaraPlatform, true);
}

function MiAqaraPlatform(log, config, api) {
    // Initialize
    this.log = log;
    
    this.Accessory = Accessory;
    this.PlatformAccessory = PlatformAccessory;
    this.Service = Service;
    this.Characteristic = Characteristic;
    this.UUIDGen = UUIDGen;
    
    this.parsers = {
        'gateway' : new GatewayParser(this), // 网关
        'magnet' : new ContactParser(this), // 门磁感应
        'motion' : new MotionParser(this), // 人体感应
        'switch' : new ButtonParser(this), // 按钮
        'sensor_ht' : new TemperatureAndHumidityParser(this), // 温度湿度传感器
        'ctrl_neutral1' : new SingleSwitchParser(this), // 单按钮墙壁开关
        'ctrl_neutral2' : new DuplexSwitchParser(this), // 双按钮墙壁开关
        '86sw1' : new SingleButton86Parser(this), // 86型无线单按钮开关
        '86sw2' : new DuplexButton86Parser(this), // 86型无线双按钮开关
        'plug' : new PlugBaseParser(this), // 插座
        'cube' : new MagicSquareParser(this) // 魔方
    };
        
    this.accessories = [];
    
    // A lookup table to get cipher password from gateway/device sid.
    this.gatewayPasswords = {};
   
    var that = this;
   
    this.Gateways = {
        gateways: {},
        getGatewayBySid: function(sid) {
            return this.gateways[sid];
        },
        addGateway: function(gateway) {
            that.log.debug("add Gateway %s", gateway.sid);
            this.gateways[gateway.sid] = gateway;
        },
        updateGateway: function(sid, newGateway) {
            var gateway = this.getGatewayBySid(sid);
            if(null != gateway) {
                for(item in newGateway) {
                    gateway[item] = newGateway[item];
                }
            }
        },
        addOrUpdateGateway: function(sid, newGateway) {
            var gateway = this.getGatewayBySid(sid);
            if(null == gateway) {
                this.addGateway(newGateway);
            } else {
                this.updateGateway(sid, newGateway);
            }
        }
    };
    
    this.Devices = {
        devices: {},
        getDeviceBySid: function(sid) {
            return this.devices[sid];
        },
        addDevice: function(device) {
            that.log.debug("add Device %s", device.sid);
            this.devices[device.sid] = device;
        },
        updateDevice: function(sid, newDevice) {
            var device = this.getDeviceBySid(sid);
            if(null != device) {
                for(item in newDevice) {
                    device[item] = newDevice[item];
                }
            }
        },
        addOrUpdateDevice: function(sid, newDevice) {
            var device = this.getDeviceBySid(sid);
            if(null == device) {
                this.addDevice(newDevice);
            } else {
                this.updateDevice(sid, newDevice);
            }
        }
    };
    
    // Load passwords from config.json
    this.loadConfig(config);

    // Start UDP server to communicate with Aqara gateways
   this.startServer();

    // Something else to do
    this.doRestThings(api);
}

MiAqaraPlatform.prototype.configureAccessory = function(accessory) {
    // this.log(accessory.displayName, "Configure Accessory");
    var that = this;

    // set the accessory to reachable if plugin can currently process the accessory
    // otherwise set to false and update the reachability later by invoking
    // accessory.updateReachability()
    accessory.reachable = true;
    accessory.on('identify', function(paired, callback) {
        that.log(accessory.displayName + "* Identify!!!" );
        callback();
    });
    
/*    
//  delete accessory
    if(accessory.displayName == 'fc8a') {
        this.api.unregisterPlatformAccessories("homebridge-mi-aqara", "MiAqaraPlatform", [accessory]);
        this.log.debug("remove accessory");
        return;
    }
*/    

    this.accessories.push(accessory);
}

MiAqaraPlatform.prototype.loadConfig = function(config) {
    // Load cipher password for each gateway from HomeBridge's config.json
    var sid = config['sid'];
    var password = config['password'];
    if (sid.length !== password.length) {
        throw new Error('Number of SIDs must equal to the one of passwords.');
    }
    this.gatewayPasswords = password.reduce(function (gatewayPasswords, password, index) {
        gatewayPasswords[sid[index]] = password;
        // log.debug("Load password %s:%s from config.json file", sid[index], password);
        return gatewayPasswords;
    }, {});
}

MiAqaraPlatform.prototype.startServer = function() {
    var that = this;

    // Initialize a server socket for Aqara gateways.
    serverSocket.on('message', this.parseMessage.bind(this));

    // err - Error object, https://nodejs.org/api/errors.html
    serverSocket.on('error', function(err){
        that.log.error('error, msg - %s, stack - %s\n', err.message, err.stack);
    });

    // Show some message
    serverSocket.on('listening', function(){
        that.log.debug("Aqara server is listening on port 9898.");
        serverSocket.addMembership(multicastAddress);
    });

    // Start server
    serverSocket.bind(serverPort);
}

MiAqaraPlatform.prototype.doRestThings = function(api) {
    var that = this;
    if (api) {
        // Save the API object as plugin needs to register new accessory via this object.
        this.api = api;

        this.api.on('didFinishLaunching', function() {
                // Send whois to discovery Aqara gateways and resend every 300 seconds
                var whoisCommand = '{"cmd": "whois"}';
                // log.debug("send %s to %s:%d", whoisCommand, multicastAddress, multicastPort);
                serverSocket.send(whoisCommand, 0, whoisCommand.length, multicastPort, multicastAddress);

                setInterval(function() {
                    // log.debug("send %s to %s:%d", whoisCommand, multicastAddress, multicastPort);
                    serverSocket.send(whoisCommand, 0, whoisCommand.length, multicastPort, multicastAddress);
                }, 300000);
        });
        
        setInterval(function(){
            that.autoRemoveAccessory();
        }, 1800000);
    } else {
        this.log.error("Homebridge's version is too old, please upgrade!");
    }
}

MiAqaraPlatform.prototype.getAccessoryByUuid = function(uuid) {
    for (var index in this.accessories) {
        var accessory = this.accessories[index];
        if (accessory.UUID === uuid) {
            return accessory;
        }
    }
}

MiAqaraPlatform.prototype.getWriteKeyByDeviceSid = function(deviceSid) {
    var device = this.Devices.getDeviceBySid(deviceSid);
    var gatewaySid = device.gatewaySid;
    var cipher = crypto.createCipheriv('aes-128-cbc', this.gatewayPasswords[gatewaySid], iv);
    var gatewayToken = this.Gateways.getGatewayBySid(gatewaySid).token;
    var key = cipher.update(gatewayToken, "ascii", "hex");
    cipher.final('hex'); // Useless data, don't know why yet.
    
    return key;
}

MiAqaraPlatform.prototype.sendCommandByDeviceSid = function(deviceSid, command) {
    var device = this.Devices.getDeviceBySid(deviceSid);
    var gateway = this.Gateways.getGatewayBySid(device.gatewaySid);
    
    var remoteAddress = gateway.address;
    var remotePort = gateway.port;

    serverSocket.send(command, 0, command.length, remotePort, remoteAddress);
}

const AccessoryAutoRemoveDelta = 12 * 60 * 60 * 1000;
MiAqaraPlatform.prototype.autoRemoveAccessory = function(uuid) {
    var accessoriesToRemove = [];

    var nowTime = Date.now();
    for (var index in this.Devices.devices) {
        var device = this.Devices.devices[index];
        if ((nowTime - device.lastUpdateTime) > AccessoryAutoRemoveDelta) {
            this.log.debug("remove Device " + device.sid + ", nowTime:" + nowTime + ", lastUpdateTime: " + device.lastUpdateTime + ", Delta: " + (nowTime - device.lastUpdateTime));
            if (device.model in this.parsers) {
                var uuids = this.parsers[device.model].getUuidsByDeviceSid(device.sid);
                for(var i in uuids) {
                    this.log.debug("remove accessory %s", uuids[i]);
                    var accessory = this.getAccessoryByUuid(uuids[i]);
                    accessoriesToRemove.push(accessory);
                    this.accessories.splice(this.accessories.indexOf(accessory), 1);
                }
            }
            delete this.Devices.devices[index];
        }
    }
    
    if (accessoriesToRemove.length > 0) {
        this.api.unregisterPlatformAccessories("homebridge-mi-aqara", "MiAqaraPlatform", accessoriesToRemove);
    }
}

// Parse message which is sent from Aqara gateways
MiAqaraPlatform.prototype.parseMessage = function(msg, rinfo){
    var platform = this;
    // platform.log.debug('recv %s(%d bytes) from client %s:%d\n', msg, msg.length, rinfo.address, rinfo.port);
    var json;
    try {
        json = JSON.parse(msg);
    } catch (ex) {
        platform.log.error("Bad json %s", msg);
        return;
    }

    var cmd = json['cmd'];
    if (cmd === 'iam') {
        var address = json['ip'];
        var port = json['port'];
        var response = '{"cmd":"get_id_list"}';
        // platform.log.debug("send %s to %s:%d", response, address, port);
        serverSocket.send(response, 0, response.length, port, address);
    } else if (cmd === 'get_id_list_ack') {
        var gatewaySid = json['sid'];
        var gateway = {
            sid: gatewaySid,
            address: rinfo.address,
            port: rinfo.port,
            token: json['token']
        }
        this.Gateways.addOrUpdateGateway(gatewaySid, gateway);
        
        var gatewayDevice = {
            sid: gatewaySid,
            gatewaySid: gatewaySid,
            lastUpdateTime: Date.now()
        }
        this.Devices.addOrUpdateDevice(gatewaySid, gatewayDevice);
        var response = '{"cmd":"read", "sid":"' + gatewaySid + '"}';
        serverSocket.send(response, 0, response.length, gateway.port, gateway.address);

        var data = JSON.parse(json['data']);
        for(var index in data) {
            var deviceSid = data[index];
            var device = {
                sid: deviceSid,
                gatewaySid: gatewaySid,
                lastUpdateTime: Date.now()
            }
            this.Devices.addOrUpdateDevice(deviceSid, device);

            var response = '{"cmd":"read", "sid":"' + deviceSid + '"}';
            serverSocket.send(response, 0, response.length, gateway.port, gateway.address);
        }
    } else if (cmd === 'heartbeat') {
        var model = json['model'];
        if (model === 'gateway') {
            this.Gateways.updateGateway(json['sid'], {token: json['token']});
        }
        
        var sid = json['sid'];
        var device = this.Devices.getDeviceBySid(sid);
        if(null != device) {
            var newLastUpdateTime = Date.now();
            this.log.debug("update " + sid + " lastUpdateTime: " + device.lastUpdateTime + " to " + newLastUpdateTime);
            this.Devices.updateDevice(sid, {lastUpdateTime: newLastUpdateTime});
        }
    } else if (cmd === 'write_ack') {
    } else {
        var deviceSid = json['sid'];
        var model = json['model'];
        var device = {
            model: model
        }
        this.Devices.updateDevice(deviceSid, device);
            
        if (model in this.parsers) {
           this.parsers[model].parse(json, rinfo);
        }        
    }
}
