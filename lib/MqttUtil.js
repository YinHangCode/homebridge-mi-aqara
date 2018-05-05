const mqtt = require("mqtt");

class MqttUtil {
    constructor(platform) {
        this.log = platform.log;

        this.host = platform.ConfigUtil.getMqttHost() || 'mqtt://localhost';

        this.options = {
            keepalive: 10,
            clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            will: {
                topic: 'WillMsg',
                payload: 'Connection Closed abnormally..!',
                qos: 0,
                retain: false
            },
            username: platform.ConfigUtil.getMqttUsername(),
            password: platform.ConfigUtil.getMqttPassword(),
            rejectUnauthorized: false
        };

        this.prefix = platform.ConfigUtil.getMqttTopicPrefix();
        this.client = mqtt.connect(this.host, this.options);

        this.client.on('error', this.onError);

        this.onSuccess = this.onSuccess.bind(this);

    }

    options() {
        return { reatil: true, qos : 1 };
    }

    onError() {
        this.log.debug('Error event on MQTT');
    }

    onSuccess() {
        this.log.info('[MQTT] did published!');
    }

    topicPrefix() {
        // defulat prefix 'homebridge/{model}/{sid}/{key}/'
        return this.prefix || "homebridge/";
    }

    getPrefix(model, sid) {
        return this.topicPrefix() + model + '/' + sid + '/';
    }

    makeTopic(model, sid, key) {
        return this.getPrefix(model, sid) + key;
    }

    parseMessage(msg) {
    
        var data = JSON.parse(msg.data);

        var that = this;
        Object.keys(data).forEach(function(key) {
            var value = (data[key] / 100).toString();
            that.publish(that.makeTopic(msg.model, msg.short_id, key), value, that.options, that.onSuccess);
        });
    }
    
    publish(topic, msg) {
        this.log.info('[MQTT] will send topic -> ' + topic + ' msg -> ' + msg);
        this.client.publish(topic, msg, this.options, this.onSuccess);
    }
}

module.exports = MqttUtil;