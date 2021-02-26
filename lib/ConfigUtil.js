class ConfigUtil {
    constructor(config) {
        this.config = config;
    }
    
    isConfigGateway(gatewaySid) {
        if(this.config['gateways'] && this.config['gateways'][gatewaySid]) {
            return true;
        }
        
        return false;
    }
    
    isHostGateway(gatewaySid) {
        if(this.config['gateways'] && this.config['gateways'][gatewaySid]) {
            if(this.config['gateways'][gatewaySid] instanceof Object) {
                if(this.config['gateways'][gatewaySid]['ip']) {
                    return true;
                }
            }
        }
        
        return false;
    }

    getHosts() {
        var hosts = {};
        
        var gateways = this.getGateways();
        if(gateways) {
            for(var gatewaySid in gateways) {
                if(gateways[gatewaySid] instanceof Object) {
                    if(gateways[gatewaySid]['ip']) {
                        hosts[gatewaySid] = new Object();
                        hosts[gatewaySid].ip = gateways[gatewaySid]['ip'];
                        if(!gateways[gatewaySid]['port']) {
                            hosts[gatewaySid].port = '9898';
                        } else {
                            hosts[gatewaySid].port = gateways[gatewaySid]['port'];
                        }
                    }
                }
            }
        }
        
        return hosts;
    }
    
    getGateways() {
        return this.config['gateways'];
    }
    
    getBindAddress() {
        return this.config['bindAddress'];
    }
    
    getSendWhoisCmdInterval() {
        return this.config['sendWhoisCmdInterval'] || 1 * 60 * 60 * 1000;
    }
    
    getAutoRemoveAccessoryInterval() {
        return this.config['autoRemoveAccessoryInterval'];
    }

    getMQTTConfig() {
        if(this.config['mqtt'] instanceof Object) {
            return this.config['mqtt'];
        }
        return null;
    }
    
    getManagePort() {
        if(this.config['manage'] instanceof Object) {
            return this.config['manage']['port'];
        }
        return null;
    }
    
    getManagePassword() {
        if(this.config['manage'] instanceof Object) {
            return this.config['manage']['password'];
        }
        return null;
    }
    
    getGatewayPasswordByGatewaySid(gatewaySid) {
        if(this.config['gateways'][gatewaySid] instanceof Object) {
            return this.config['gateways'][gatewaySid]['password'];
        } else {
            return this.config['gateways'][gatewaySid];
        }
    }
    
    getAccessoryConfig(deviceSid) {
        var result = {};
        if(this.config['defaultValue']) {
            result = this.config['defaultValue'][deviceSid];
        }
        return result;
    }
    
    getAccessoryAttribute(deviceSid, accessoryType, attributeName, defaultValue) {
        var defaultValueCfg = this.config['defaultValue'];
        if(null != defaultValueCfg) {
            if(null != defaultValueCfg[deviceSid]) {
                if(null != defaultValueCfg[deviceSid][accessoryType]) {
                    if(null != defaultValueCfg[deviceSid][accessoryType][attributeName]) {
                        return defaultValueCfg[deviceSid][accessoryType][attributeName];
                    }
                }
                if(null != defaultValueCfg[deviceSid]['Global']){
                    if(null != defaultValueCfg[deviceSid]['Global'][attributeName]) {
                        return defaultValueCfg[deviceSid]['Global'][attributeName];
                    }
                }
            }
            if(null != defaultValueCfg['Global']) {
                if(null != defaultValueCfg['Global'][attributeName]) {
                    return defaultValueCfg['Global'][attributeName];
                }
            }
            
        }
        
        return defaultValue;
    }
    
    getAccessoryName(deviceSid, accessoryType) {
        var defaultValue = accessoryType + "_" + deviceSid.substring(deviceSid.length - 4);
        return this.getAccessoryAttribute(deviceSid, accessoryType, 'name', defaultValue);
    }

    getAccessoryDisable(deviceSid, accessoryType) {
        return this.getAccessoryAttribute(deviceSid, accessoryType, 'disable', false);
    }
    
    getAccessoryServiceType(deviceSid, accessoryType) {
        return this.getAccessoryAttribute(deviceSid, accessoryType, 'serviceType', null);
    }
    
    getAccessorySyncValue(deviceSid, accessoryType) {
        return this.getAccessoryAttribute(deviceSid, accessoryType, 'syncValue', false);
    }
    
    getAccessoryNoResponse(deviceSid, accessoryType) {
        return this.getAccessoryAttribute(deviceSid, accessoryType, 'disableNoResponse', false);
    }
    
    getAccessoryIgnoreWriteResult(deviceSid, accessoryType) {
        return this.getAccessoryAttribute(deviceSid, accessoryType, 'ignoreWriteResult', false);
    }
}

module.exports = ConfigUtil;