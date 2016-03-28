import bunyanLog from './bunyanLog';
import { SqsBrokerFacade, ReefClient } from 'reef-client';

export default class ReefConnectionClient {

    constructor(options) {

        bunyanLog.info('setting up Reef Client');

        let brokerFacade = new SqsBrokerFacade({
            region: options.region,
            accessKeyId: options.accessKeyId,
            secretAccessKey: options.secretAccessKey,
            serviceDomain: options.serviceDomain || "serviceDomain-missing-configuration",
            serviceLane: options.serviceLane || "serviceLane-missing-configuration",
            clientDomain: options.clientDomain || "clientDomain-missing-configuration",
            clientLane: options.clientLane || "clientLane-missing-configuration"
        });

        this.client = new ReefClient(brokerFacade);

    }

    connect() {
        return new Promise((resolve, reject) => {

            this.client.setup()
            .then(() => {
                bunyanLog.info('starting up Reef Client');
                this.client.start();
                return resolve(this);
            })
            .catch(err => {
                bunyanLog.error('error setting up Reef Client: ', err);
                return reject();
            });

        });
    }

    stop() {
        this.client.stop();
    }

    execute(type, payload) {

        bunyanLog.info(type + " COMMAND SENT:", payload);

        return new Promise((resolve, reject) => {

            this.client.execute(type, payload).then(data => {

                bunyanLog.info(type + " RESPONSE RECEIVED:", data);

                resolve(data);

            }).catch(err => {

                bunyanLog.info(type + " RESPONSE ERROR:", err);

                reject(err);

            });

        });

    }

}
