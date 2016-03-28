import dotenv from 'dotenv';
import _ from 'lodash';
import bunyanLog from './utils/bunyanLog';
import ReefService from './utils/setUpReefService';

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function parseLine(line){

    if( line.search(/[^;]*/) ){
        return false;
    }

    let values = line.split(';', 2);

    return parsedLine = {
        command: values[0];
        payload: values[1];
    }

}

async function start() {

    let reefClient = null;

    reefClient = new ReefClient({
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESSKEYID
    });

    return reefClient.connect();
}

dotenv.load();
start()
.then( () => {
    console.log("Insert reef command \n");
    rl.on('line', function(line){
        console.log("Command inserted: " + line);

        if(line == "exit"){
            rl.close();
            return;
        }

        let parsedValues = parseLine(line);

        if( !parsedValues ){
            console.log("Incorrect format");
            return;
        }

        reefClient.execute(parsedValues.command, parsedValues.payload);
    });
});
