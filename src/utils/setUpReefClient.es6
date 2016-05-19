import bunyanLog from './bunyanLog';
import { SqsBrokerFacade, ReefClient } from '@line64/reef-client';

export default async function(options) {

    let brokerFacade = new SqsBrokerFacade({
        region: options.region,
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        clientDomain: options.clientDomain || "clientDomain-missing-configuration",
        clientLane: options.clientLane || "clientLane-missing-configuration"
    });

    let reefClient = new ReefClient(brokerFacade);

    bunyanLog.info(`Set up parameters: ${JSON.stringify(options)}`)

    reefClient.on('info', (info) => { bunyanLog.info(info); });

    reefClient.on('error', (error) => { bunyanLog.error(error); });

    await reefClient.setup();

    await reefClient.start();

    return reefClient;

}
