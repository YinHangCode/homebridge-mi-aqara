class ConfigUtil {
    constructor(config) {
        this.config = config;
    }
    
    isConfigGateway(gatewaySid) {
        if(this.config['gateways'] && this.config['gateways'][gatewaySid]) {
            return true;
        } else {
            return false;
        }
    }
    
    getGatewayPasswordByGatewaySid(gatewaySid) {
        return this.config['gateways'][gatewaySid];
    }
    
    getAccessoryName(deviceSid, accessoryType) {
        var defaultValueCfg = this.config['defaultValue'];
        if(null != defaultValueCfg) {
            if(null != defaultValueCfg[deviceSid]) {
                if(null != defaultValueCfg[deviceSid][accessoryType]) {
                    if(null != defaultValueCfg[deviceSid][accessoryType]['name']) {
                        return defaultValueCfg[deviceSid][accessoryType]['name'];
                    }
                }
            }
        }
        
        return accessoryType + "_" + deviceSid.substring(deviceSid.length - 4);
    }

    getAccessoryDisable(deviceSid, accessoryType) {
        var defaultValueCfg = this.config['defaultValue'];
        if(null != defaultValueCfg) {
            if(null != defaultValueCfg[deviceSid]) {
                if(null != defaultValueCfg[deviceSid][accessoryType]) {
                    if(null != defaultValueCfg[deviceSid][accessoryType]['disable']) {
                        return defaultValueCfg[deviceSid][accessoryType]['disable'];
                    }
                }
            }
        }
        
        return false;
    }
    
    getAccessoryServiceType(deviceSid, accessoryType) {
        var defaultValueCfg = this.config['defaultValue'];
        if(null != defaultValueCfg) {
            if(null != defaultValueCfg[deviceSid]) {
                if(null != defaultValueCfg[deviceSid][accessoryType]) {
                    if(null != defaultValueCfg[deviceSid][accessoryType]['serviceType']) {
                        return defaultValueCfg[deviceSid][accessoryType]['serviceType'];
                    }
                }
            }
        }
        
        return null;
    }
}

module.exports = ConfigUtil;