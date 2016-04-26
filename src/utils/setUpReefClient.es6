import bunyanLog from './bunyanLog';
import { SqsBrokerFacade, ReefClient } from '@line64/reef-client';

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

        this.serviceDomain = options.serviceDomain || "serviceDomain-missing-configuration";
        this.serviceLane = options.serviceLane || "serviceLane-missing-configuration";
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
        process.exit();
    }


    query(serviceDomain, serviceLane, type, payload) {

        bunyanLog.info(type + " QUERY SENT:", payload);

        return new Promise((resolve, reject) => {

            this.client.query(serviceDomain, serviceLane, type, payload).then(data => {

                bunyanLog.info(type + " RESPONSE RECEIVED:", data);

                resolve(data);

            }).catch(err => {

                bunyanLog.info(type + " RESPONSE ERROR:", err);

                reject(err);

            });

        });

    }

    execute(serviceDomain, serviceLane, type, payload) {

        bunyanLog.info(type + " COMMAND SENT:", payload);

        return new Promise((resolve, reject) => {

            this.client.execute(serviceDomain, serviceLane, type, payload).then(data => {

                bunyanLog.info(type + " RESPONSE RECEIVED:", data);

                resolve(data);

            }).catch(err => {

                bunyanLog.info(type + " RESPONSE ERROR:", err);

                reject(err);

            });

        });

    }

}
