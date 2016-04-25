'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _bunyanLog = require('./bunyanLog');

var _bunyanLog2 = _interopRequireDefault(_bunyanLog);

var _reefClient = require('reef-client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReefConnectionClient = function () {
    function ReefConnectionClient(options) {
        (0, _classCallCheck3.default)(this, ReefConnectionClient);


        _bunyanLog2.default.info('setting up Reef Client');

        var brokerFacade = new _reefClient.SqsBrokerFacade({
            region: options.region,
            accessKeyId: options.accessKeyId,
            secretAccessKey: options.secretAccessKey,
            clientDomain: options.clientDomain || "clientDomain-missing-configuration",
            clientLane: options.clientLane || "clientLane-missing-configuration"
        });

        this.client = new _reefClient.ReefClient(brokerFacade);

        this.serviceDomain = options.serviceDomain || "serviceDomain-missing-configuration";
        this.serviceLane = options.serviceLane || "serviceLane-missing-configuration";
    }

    (0, _createClass3.default)(ReefConnectionClient, [{
        key: 'connect',
        value: function connect() {
            var _this = this;

            return new _promise2.default(function (resolve, reject) {

                _this.client.setup().then(function () {
                    _bunyanLog2.default.info('starting up Reef Client');
                    _this.client.start();
                    return resolve(_this);
                }).catch(function (err) {
                    _bunyanLog2.default.error('error setting up Reef Client: ', err);
                    return reject();
                });
            });
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.client.stop();
        }
    }, {
        key: 'query',
        value: function query(serviceDomain, serviceLane, type, payload) {
            var _this2 = this;

            _bunyanLog2.default.info(type + " QUERY SENT:", payload);

            return new _promise2.default(function (resolve, reject) {

                _this2.client.query(serviceDomain, serviceLane, type, payload).then(function (data) {

                    _bunyanLog2.default.info(type + " RESPONSE RECEIVED:", data);

                    resolve(data);
                }).catch(function (err) {

                    _bunyanLog2.default.info(type + " RESPONSE ERROR:", err);

                    reject(err);
                });
            });
        }
    }, {
        key: 'execute',
        value: function execute(serviceDomain, serviceLane, type, payload) {
            var _this3 = this;

            _bunyanLog2.default.info(type + " COMMAND SENT:", payload);

            return new _promise2.default(function (resolve, reject) {

                _this3.client.execute(serviceDomain, serviceLane, type, payload).then(function (data) {

                    _bunyanLog2.default.info(type + " RESPONSE RECEIVED:", data);

                    resolve(data);
                }).catch(function (err) {

                    _bunyanLog2.default.info(type + " RESPONSE ERROR:", err);

                    reject(err);
                });
            });
        }
    }]);
    return ReefConnectionClient;
}();

exports.default = ReefConnectionClient;