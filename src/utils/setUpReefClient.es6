import bunyanLog from './bunyanLog';
import { SqsBrokerFacade, ReefClient } from 'reef-client';

export default class ReefConnectionClient {

    constructor(options) {

        bunyanLog.info('setting up Reef Client');

        let brokerFacade = new SqsBrokerFacade({
            region: options.region,
            accessKeyId: options.accessKeyId,
            secretAccessKey: options.secretAccessKey,
            clientDomain: options.clientDomain || "clientDomain-missing-configuration",
            clientLane: options.clientLane || "clientLane-missing-configuration"
        });

        this.client = new ReefClient(brokerFacade);

        this.serviceDomain = process.env.SERVICE_DOMAIN || "serviceDomain-missing-configuration";
        this.serviceLane = process.env.SERVICE_LANE || "serviceLane-missing-configuration";
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


    query(type, payload) {

        bunyanLog.info(type + " QUERY SENT:", payload);

        return new Promise((resolve, reject) => {

            this.client.query(this.serviceDomain, this.serviceLane, type, payload).then(data => {

                bunyanLog.info(type + " RESPONSE RECEIVED:", data);

                resolve(data);

            }).catch(err => {

                bunyanLog.info(type + " RESPONSE ERROR:", err);

                reject(err);

            });

        });

    }

    execute(type, payload) {

        bunyanLog.info(type + " COMMAND SENT:", payload);

        return new Promise((resolve, reject) => {

            this.client.execute(this.serviceDomain, this.serviceLane, type, payload).then(data => {

                bunyanLog.info(type + " RESPONSE RECEIVED:", data);

                resolve(data);

            }).catch(err => {

                bunyanLog.info(type + " RESPONSE ERROR:", err);

                reject(err);

            });

        });

    }

}
