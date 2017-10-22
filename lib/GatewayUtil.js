class GatewayUtil {
    constructor() {
        this.gateways = {};
    }
    
    getBySid(sid) {
        return (sid in this.gateways) ? this.gateways[sid] : null;
    }
    
    add(gateway) {
        this.gateways[gateway.sid] = gateway;
    }
    
    update(sid, newGateway) {
        var gateway = this.getBySid(sid);
        if(null != gateway) {
            for(var item in newGateway) {
                gateway[item] = newGateway[item];
            }
        }
    }
    
    addOrUpdate(sid, newGateway) {
        var gateway = this.getBySid(sid);
        if(null == gateway) {
            this.add(newGateway);
        } else {
            this.update(sid, newGateway);
        }
    }
    
    remove(sid) {
        delete this.gateways[sid];
    }
}

module.exports = GatewayUtil;