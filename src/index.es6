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
        throw new Error("Bad parameters");
    }

    let values = line.split(';', 3);

    let parsedLine = {
        type: values[0].toUpperCase().trim(),
        command: values[1].toUpperCase().trim(),
        payload: JSON.parse(values[2].trim())
        }

    if( parsedLine.type == null || parsedLine.type == undefined
        || parsedLine.command == null || parsedLine.command == undefined
        || parsedLine.payload == null || parsedLine.command == undefined){
            throw new Error("Bad parameters");
        }

    return parsedLine;

}

async function start() {

    let reefClient = null;

    reefClient = new ReefClient({
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESSKEYID,
        clientDomain: process.env.CLIENT_DOMAIN,
        clientLane: process.env.CLIENT_LANE
    });

    return reefClient.connect();
}

dotenv.load();
start()
.then( (reefClient) => {
    console.log("Insert reef command (type;command;payload): ");
    rl.on('line', function(line){

        if(line == "exit"){
            rl.close();
            reefClient.stop();
            return;
        }

        let parsedValues = null;

        try{
            parsedValues = parseLine(line);
        }
        catch(err){
            console.log(err);
            return;
        }

        console.log("Type inserted: " + parsedValues.type);
        console.log("Command inserted: " + parsedValues.command);
        console.log("Payload inserted: " + parsedValues.payload);

        if( parsedValues.type === 'Q'){
            reefClient.query(parsedValues.command, parsedValues.payload);
        }
        else if ( parsedValues.type === 'C' ){
            reefClient.execute(parsedValues.command, parsedValues.payload);
        }
        else{
            console.log("Bad parameter");
        }
    });
})
.catch( (err) => {
    console.log(err);
});
