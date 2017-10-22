class AccessoryUtil {
    constructor() {
        this.accessories = {};
    }
    
    getByUUID(uuid) {
        return (uuid in this.accessories) ? this.accessories[uuid] : null;
    }

    add(accessory) {
        this.accessories[accessory.UUID] = accessory;
    }
    
    remove(uuid) {
        delete this.accessories[uuid];
    }
}

module.exports = AccessoryUtil;