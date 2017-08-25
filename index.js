var fs = require('fs');

module.exports = function(homebridge) {
    if(!isConfig(homebridge.user.configPath(), "platforms", "MiAqaraPlatform")) {
        return;
    }
    
    require('./MiAqaraPlatform')(homebridge);
}

function isConfig(configFile, type, name) {
    var config = JSON.parse(fs.readFileSync(configFile));
    if("accessories" === type) {
        var accessories = config.accessories;
        for(var i in accessories) {
            if(accessories[i]['accessory'] === name) {
                return true;
            }
        }
    } else if("platforms" === type) {
        var platforms = config.platforms;
        for(var i in platforms) {
            if(platforms[i]['platform'] === name) {
                return true;
            }
        }
    } else {
    }
    
    return false;
}
