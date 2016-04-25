'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = _bunyan2.default.createLogger({
  name: 'reef-cli',
  level: process.env.LOG_LEVEL || 'info',
  stream: process.stdout,
  serializers: _bunyan2.default.stdSerializers
});

exports.default = log;