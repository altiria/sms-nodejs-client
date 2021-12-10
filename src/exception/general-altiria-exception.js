module.exports = class GeneralAltiriaException extends Error{

    constructor(message,status) {
        super(message);
        this._message=message;
        this._status=status;
    }

    set setMessage(message) {
        this._message=message;
    }

    get getMessage() {
        return this._message;
    }

    set setStatus(status) {
        this._status=status;
    }

    get getStatus() {
        return this._status;
    }

    toString() {
        return 'Message='+this._message+', status='+this._status;
    }
}