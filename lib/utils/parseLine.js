'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (line) {

    if (line.search('[;]') === -1) {
        throw new Error("Bad parameters");
    }

    var values = line.split(';', 3);

    var parsedLine = {
        type: values[0].toUpperCase().trim(),
        command: values[1].toUpperCase().trim(),
        payload: JSON.parse(values[2].trim())
    };

    if (parsedLine.type == null || parsedLine.type == undefined || parsedLine.command == null || parsedLine.command == undefined || parsedLine.payload == null || parsedLine.command == undefined) {
        throw new Error("Bad parameters");
    }

    return parsedLine;
};