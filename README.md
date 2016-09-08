# reef-cli

A command line util for talking with reef services.

##Usage:

Instalation:

    npm install -g @line64/reef-cli --registry http://npm.line64.com

Is also recomended to install bunyan for log viewing

    npm install -g bunyan

###Example script

    export AWS_REGION=awsRegion
    export AWS_SECRETACCESSKEY=secretAccessKey
    export AWS_ACCESSKEYID=accessKeyId
    
    export serviceDomain=serviceDomain
    export serviceLane=singleton
    export clientDomain=reef-cli
    export clientLane=singleton
    
    TEST_PAYLOAD='{"parameterOne":"fooOne", '
    TEST_PAYLOAD+='"parameterTwo": "fooTwo" }'

    reef --type C --command FOO_COMMAND --payload "${TEST_PAYLOAD}" | bunyan
    

--type paremter is used to tell the program to send a command (C) or a query (Q).

--command is used to send the name of the command or query that the service is listening to.

The response is printed in the screen and the programs shuts down.


