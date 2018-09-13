class AccessoryUtil {
    constructor() {
        this.accessories = {};
    }
    
    getByUUID(uuid) {
        return (uuid in this.accessories) ? this.accessories[uuid] : null;
    }

    add(accessory) {
        this.accessories[accessory.UUID] = accessory;
        return accessory;
    }
    
    remove(uuid) {
        delete this.accessories[uuid];
    }
    
    getAll() {
        return this.accessories;
    }
}

module.exports = AccessoryUtil;