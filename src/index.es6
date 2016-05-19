#!/usr/bin/env node

import _ from 'lodash';
import readline from 'readline';

import dotenv from 'dotenv';
import nconf from 'nconf';

import bunyanLog from './utils/bunyanLog';
import ReefClient from './utils/setUpReefClient';
import parseLine from './utils/parseLine'

dotenv.load();
nconf.argv()
    .env()
    .file({ file: './config.json' });


const SERVICE_DOMAIN = 'serviceDomain',
    SERVICE_LANE = 'serviceLane',
    CLIENT_DOMAIN = 'clientDomain',
    CLIENT_LANE = 'clientLane',
    TYPE = 'type',
    PAYLOAD = 'payload',
    COMMAND = 'command',
    INTERACTIVE = "i";


async function start() {

    let reefConfiguration = {
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESSKEYID,
        clientDomain: nconf.get(CLIENT_DOMAIN),
        clientLane: nconf.get(CLIENT_LANE)
    };

    let reefClient = await new ReefClient(reefConfiguration);

    return reefClient;
}

function interactive(reefClient){

    let serviceDomain = nconf.get(SERVICE_DOMAIN),
        serviceLane = nconf.get(SERVICE_LANE),
        rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

    bunyanLog.info(`Using ${serviceDomain}-${serviceLane} - If it is not the
        desired service domain and lane export 'serviceDomain' and 'serviceLane'
        variables with the desired values and restart the program`);

    console.log("Insert reef command (type;command;payload): ");
    rl.on('line', function(line){

        if(line == "exit"){
            bunyanLog.info("Stopping reef client");
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
            reefClient.query(parsedValues.command, parsedValues.payload)
            .then( (response) => {
                bunyanLog.info("Response: ", response);
            })
            .catch( (err) => {
                bunyanLog.info(`There was an error: `, err);
            });
        }
        else if ( parsedValues.type === 'C' ){
            reefClient.execute(parsedValues.command, parsedValues.payload)
            .then( (response) => {
                bunyanLog.info("Response: ", response);
            })
            .catch( (err) => {
                bunyanLog.info(`There was an error: `, err);
            });
        }
        else{
            console.log("Bad parameter");
        }
    });
}

function oneUse(reefClient){

    let type = nconf.get(TYPE).toUpperCase(),
        command = nconf.get(COMMAND).toUpperCase(),
        payload = JSON.parse( nconf.get(PAYLOAD) ),
        serviceDomain = nconf.get(SERVICE_DOMAIN),
        serviceLane = nconf.get(SERVICE_LANE);

    if( !serviceLane || !serviceDomain ){
        bunyanLog.info("Stopping reef client");
        reefClient.stop();
        throw new Error("Bad service lane or service domain");
    }

    let promise = null;

    if( type === 'Q'){
        promise = reefClient.query(serviceDomain, serviceLane, command, payload);
    }
    else if ( type === 'C' ){
        promise = reefClient.execute(serviceDomain, serviceLane, command, payload);
    }
    else{
        bunyanLog.info("Stopping reef client");
        reefClient.stop();
        throw new Error("No type found");
    }

    return promise
    .then( (response) =>{
        bunyanLog.info("Response: ", response);
        bunyanLog.info("Stopping reef client");
        reefClient.stop();
        process.exit();
    })
    .catch( (err) => {
        bunyanLog.error(err);
        reefClient.stop();
        process.exit();
    });
}

start()
.then( (reefClient) => {

    if(nconf.get(INTERACTIVE)){
        return interactive(reefClient);
    }
    else{
        return oneUse(reefClient);
    }
})
.catch( (err) => {
    console.log(err);
});
