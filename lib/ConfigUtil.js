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

    getBindAddress() {
        return this.config['bindAddress'];
    }

    getGatewayPasswordByGatewaySid(gatewaySid) {
        return this.config['gateways'][gatewaySid];
    }
    
    getAccessoryAttribute(deviceSid, accessoryType, attributeName, defaultValue) {
        var defaultValueCfg = this.config['defaultValue'];
        if(null != defaultValueCfg) {
            if(null != defaultValueCfg[deviceSid]) {
                if (null == accessoryType) {
                    return defaultValueCfg[deviceSid] || defaultValue;
                }
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
            if (null == accessoryType) {
                return defaultValue;
            }
            if(null != defaultValueCfg['Global']) {
                if(null != defaultValueCfg['Global'][attributeName]) {
                    return defaultValueCfg['Global'][attributeName];
                }
            }
            
        }
        
        return defaultValue;
    }

    getAccessoryConfig(deviceSid) {
        return this.getAccessoryAttribute(deviceSid, null, null, {});
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