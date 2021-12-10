module.exports = class AltiriaModelTextMessage{

    constructor(destination,message,senderId=undefined) {
        this._destination=destination;
        this._message=message;
        this._senderId=senderId;
    }

    set setDestination(destination) {
        this._destination=destination;
    }

    get getDestination() {
        return this._destination;
    }

    set setMessage(message) {
        this._message=message;
    }

    get getMessage() {
        return this._message;
    }

    set setSenderId(senderId) {
        this._senderId=senderId;
    }

    get getSenderId() {
        return this._senderId;
    }

    set setAck(ack) {
        this._ack=ack;
    }

    get isAck() {
        return this._ack;
    }

    set setIdAck(idAck) {
        this._idAck=idAck;
    }

    get getIdAck() {
        return this._idAck;
    }

    set setConcat(concat) {
        this._concat=concat;
    }

    get isConcat() {
        return this._concat;
    }

    set setCertDelivery(certDelivery) {
        this._certDelivery=certDelivery;
    }

    get isCertDelivery() {
        return this._certDelivery;
    }

    set setEncoding(encoding) {
        this._encoding=encoding;
    }

    get getEncoding() {
        return this._encoding;
    }

    toString() {
        return 'AltiriaModelTextMessage [destination='+this._destination+', message='+this._message+', senderId='+this._senderId
        +", ack="+this._ack+", idAck="+this._idAck+", concat="+this._concat+", certDelivery="+this._certDelivery+", encoding="+this._encoding+']';
    }

}