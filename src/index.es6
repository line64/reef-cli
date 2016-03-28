import dotenv from 'dotenv';
import _ from 'lodash';
import bunyanLog from './utils/bunyanLog';
import ReefClient from './utils/setUpReefClient';

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function parseLine(line){

    if( line.search('[;]') === -1 ){
        return undefined;
    }

    let values = line.split(';', 2);

    let parsedLine = {
        command: values[0].toUpperCase().trim(),
        payload: values[1].trim()
        }

    return parsedLine;

}

async function start() {

    let reefClient = null;

    reefClient = new ReefClient({
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESSKEYID,
        serviceDomain: process.env.SERVICE_DOMAIN,
        serviceLane: process.env.SERVICE_LANE,
        clientDomain: process.env.CLIENT_DOMAIN,
        clientLane: process.env.CLIENT_LANE
    });

    return reefClient.connect();
}

dotenv.load();
start()
.then( (reefClient) => {
    console.log("Insert reef command \n");
    rl.on('line', function(line){

        if(line == "exit"){
            rl.close();
            reefClient.stop();
            return;
        }

        let parsedValues = parseLine(line);

        if( parsedValues == undefined ){
            console.log("Incorrect format");
            return;
        }

        console.log("Command inserted: " + parsedValues.command);
        console.log("Payload inserted: " + parsedValues.payload);

        reefClient.execute(parsedValues.command, parsedValues.payload);
    });
})
.catch( (err) => {
    bunyanLog.info(err);
});
