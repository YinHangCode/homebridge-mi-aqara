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
        return defaultValueCfg && defaultValueCfg[deviceSid] && defaultValueCfg[deviceSid][accessoryType] && defaultValueCfg[deviceSid][accessoryType]['name'] ||
            defaultValueCfg && defaultValueCfg[deviceSid] && defaultValueCfg[deviceSid]['Global'] && defaultValueCfg[deviceSid]['Global']['name'] ||
            defaultValueCfg && defaultValueCfg['Global'] && defaultValueCfg['Global']['name'] ||
            accessoryType + "_" + deviceSid.substring(deviceSid.length - 4);
    }

    getAccessoryDisable(deviceSid, accessoryType) {
        var defaultValueCfg = this.config['defaultValue'];
        return defaultValueCfg && defaultValueCfg[deviceSid] && defaultValueCfg[deviceSid][accessoryType] && defaultValueCfg[deviceSid][accessoryType]['disable'] ||
            defaultValueCfg && defaultValueCfg[deviceSid] && defaultValueCfg[deviceSid]['Global'] && defaultValueCfg[deviceSid]['Global']['disable'] ||
            defaultValueCfg && defaultValueCfg['Global'] && defaultValueCfg['Global']['disable'] ||
            false;
    }
    
    getAccessoryServiceType(deviceSid, accessoryType) {
        var defaultValueCfg = this.config['defaultValue'];
        return defaultValueCfg && defaultValueCfg[deviceSid] && defaultValueCfg[deviceSid][accessoryType] && defaultValueCfg[deviceSid][accessoryType]['serviceType'] ||
            defaultValueCfg && defaultValueCfg[deviceSid] && defaultValueCfg[deviceSid]['Global'] && defaultValueCfg[deviceSid]['Global']['serviceType'] ||
            defaultValueCfg && defaultValueCfg['Global'] && defaultValueCfg['Global']['serviceType'] ||
            null;
    }
    
    getAccessorySyncValue(deviceSid, accessoryType) {
        var defaultValueCfg = this.config['defaultValue'];
        return defaultValueCfg && defaultValueCfg[deviceSid] && defaultValueCfg[deviceSid][accessoryType] && defaultValueCfg[deviceSid][accessoryType]['syncValue'] ||
            defaultValueCfg && defaultValueCfg[deviceSid] && defaultValueCfg[deviceSid]['Global'] && defaultValueCfg[deviceSid]['Global']['syncValue'] ||
            defaultValueCfg && defaultValueCfg['Global'] && defaultValueCfg['Global']['syncValue'] ||
            false;
    }
    
    getAccessoryNoResponse(deviceSid, accessoryType) {
        var defaultValueCfg = this.config['defaultValue'];
        return defaultValueCfg && defaultValueCfg[deviceSid] && defaultValueCfg[deviceSid][accessoryType] && defaultValueCfg[deviceSid][accessoryType]['disableNoResponse'] ||
            defaultValueCfg && defaultValueCfg[deviceSid] && defaultValueCfg[deviceSid]['Global'] && defaultValueCfg[deviceSid]['Global']['disableNoResponse'] ||
            defaultValueCfg && defaultValueCfg['Global'] && defaultValueCfg['Global']['disableNoResponse'] ||
            false;
    }
}

module.exports = ConfigUtil;