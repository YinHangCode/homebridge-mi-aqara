class DeviceUtil {
    constructor() {
        this.devices = {};
    }
    
    getBySid(sid) {
        return (sid in this.devices) ? this.devices[sid] : null;
    }
    
    add(device) {
        this.devices[device.sid] = device;
        return device;
    }
    
    update(sid, newDevice) {
        var device = this.getBySid(sid);
        if(null != device) {
            for(var item in newDevice) {
                device[item] = newDevice[item];
            }
        }
        return device;
    }
    
    addOrUpdate(sid, newDevice) {
        var device = this.getBySid(sid);
        if(null == device) {
            return this.add(newDevice);
        } else {
            return this.update(sid, newDevice);
        }
    }
    
    remove(sid) {
        delete this.devices[sid];
    }
    
    getAutoRemoveDevice(threshold) {
        var r = {}
        
        var nowTime = Date.now();
        for(var sid in this.devices) {
            var device = this.getBySid(sid);
            if ((nowTime - device.lastUpdateTime) > threshold) {
                r[sid] = device;
            }
        }
        
        return r;
    }
    
    getAll() {
        return this.devices;
    }
}

module.exports = DeviceUtil;