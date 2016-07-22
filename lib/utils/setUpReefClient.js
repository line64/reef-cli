'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _bunyanLog = require('./bunyanLog');

var _bunyanLog2 = _interopRequireDefault(_bunyanLog);

var _reefClient = require('@line64/reef-client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(options) {
        var brokerFacade, reefClient;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        brokerFacade = new _reefClient.SqsBrokerFacade({
                            region: options.region,
                            accessKeyId: options.accessKeyId,
                            secretAccessKey: options.secretAccessKey,
                            clientDomain: "reef-cli",
                            clientLane: "singleton"
                        });
                        reefClient = new _reefClient.ReefClient(brokerFacade);


                        _bunyanLog2.default.info('Set up parameters: ' + (0, _stringify2.default)(options));

                        reefClient.on('info', function (info) {
                            _bunyanLog2.default.info(info);
                        });

                        reefClient.on('error', function (error) {
                            _bunyanLog2.default.error(error);
                        });

                        _context.next = 7;
                        return reefClient.setup();

                    case 7:
                        _context.next = 9;
                        return reefClient.start();

                    case 9:
                        return _context.abrupt('return', reefClient);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();