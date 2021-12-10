const GeneralAltiriaException = require('./general-altiria-exception.js');

module.exports = class JsonException extends GeneralAltiriaException{

    constructor(message) {
        super(message,undefined);
        this._message=message;
    }

    set setMessage(message) {
        this._message=message;
    }

    get getMessage() {
        return this._message;
    }

    toString() {
        return 'Message='+this._message;
    }
}