#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var start = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var reefConfiguration, reefClient;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        reefConfiguration = {
                            secretAccessKey: process.env.AWS_SECRETACCESSKEY,
                            region: process.env.AWS_REGION,
                            accessKeyId: process.env.AWS_ACCESSKEYID,
                            clientDomain: _nconf2.default.get(CLIENT_DOMAIN),
                            clientLane: _nconf2.default.get(CLIENT_LANE)
                        };
                        _context.next = 3;
                        return new _setUpReefClient2.default(reefConfiguration);

                    case 3:
                        reefClient = _context.sent;
                        return _context.abrupt('return', reefClient);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function start() {
        return _ref.apply(this, arguments);
    };
}();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _nconf = require('nconf');

var _nconf2 = _interopRequireDefault(_nconf);

var _bunyanLog = require('./utils/bunyanLog');

var _bunyanLog2 = _interopRequireDefault(_bunyanLog);

var _setUpReefClient = require('./utils/setUpReefClient');

var _setUpReefClient2 = _interopRequireDefault(_setUpReefClient);

var _parseLine = require('./utils/parseLine');

var _parseLine2 = _interopRequireDefault(_parseLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.load();
_nconf2.default.argv().env().file({ file: './config.json' });

var SERVICE_DOMAIN = 'serviceDomain',
    SERVICE_LANE = 'serviceLane',
    CLIENT_DOMAIN = 'clientDomain',
    CLIENT_LANE = 'clientLane',
    TYPE = 'type',
    PAYLOAD = 'payload',
    COMMAND = 'command',
    INTERACTIVE = "i";

function interactive(reefClient) {

    var serviceDomain = _nconf2.default.get(SERVICE_DOMAIN),
        serviceLane = _nconf2.default.get(SERVICE_LANE),
        rl = _readline2.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    _bunyanLog2.default.info('Using ' + serviceDomain + '-' + serviceLane + ' - If it is not the\n        desired service domain and lane export \'serviceDomain\' and \'serviceLane\'\n        variables with the desired values and restart the program');

    console.log("Insert reef command (type;command;payload): ");
    rl.on('line', function (line) {

        if (line == "exit") {
            _bunyanLog2.default.info("Stopping reef client");
            rl.close();
            reefClient.stop();
            return;
        }

        var parsedValues = null;

        try {
            parsedValues = (0, _parseLine2.default)(line);
        } catch (err) {
            console.log(err);
            return;
        }

        console.log("Type inserted: " + parsedValues.type);
        console.log("Command inserted: " + parsedValues.command);
        console.log("Payload inserted: " + parsedValues.payload);

        if (parsedValues.type === 'Q') {
            reefClient.query(parsedValues.command, parsedValues.payload).then(function (response) {
                _bunyanLog2.default.info("Response: ", response);
            }).catch(function (err) {
                _bunyanLog2.default.info('There was an error: ', err);
            });
        } else if (parsedValues.type === 'C') {
            reefClient.execute(parsedValues.command, parsedValues.payload).then(function (response) {
                _bunyanLog2.default.info("Response: ", response);
            }).catch(function (err) {
                _bunyanLog2.default.info('There was an error: ', err);
            });
        } else {
            console.log("Bad parameter");
        }
    });
}

function oneUse(reefClient) {

    var type = _nconf2.default.get(TYPE).toUpperCase(),
        command = _nconf2.default.get(COMMAND).toUpperCase(),
        payload = JSON.parse(_nconf2.default.get(PAYLOAD)),
        serviceDomain = _nconf2.default.get(SERVICE_DOMAIN),
        serviceLane = _nconf2.default.get(SERVICE_LANE);

    if (!serviceLane || !serviceDomain) {
        _bunyanLog2.default.info("Stopping reef client");
        reefClient.stop();
        throw new Error("Bad service lane or service domain");
    }

    var promise = null;

    if (type === 'Q') {
        promise = reefClient.query(serviceDomain, serviceLane, command, payload);
    } else if (type === 'C') {
        promise = reefClient.execute(serviceDomain, serviceLane, command, payload);
    } else {
        _bunyanLog2.default.info("Stopping reef client");
        reefClient.stop();
        throw new Error("No type found");
    }

    return promise.then(function (response) {
        _bunyanLog2.default.info("Response: ", response);
        _bunyanLog2.default.info("Stopping reef client");
        reefClient.stop();
        process.exit();
    }).catch(function (err) {
        _bunyanLog2.default.error(err);
        reefClient.stop();
        process.exit();
    });
}

start().then(function (reefClient) {

    if (_nconf2.default.get(INTERACTIVE)) {
        return interactive(reefClient);
    } else {
        return oneUse(reefClient);
    }
}).catch(function (err) {
    console.log(err);
});