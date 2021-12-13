const winston = require('winston');
const http = require('http');

const GeneralAltiriaException = require('./exception/general-altiria-exception.js');
const AltiriaGwException = require('./exception/altiria-gw-exception.js');
const JsonException = require('./exception/json-exception.js');
const ConnectionException = require('./exception/connection-exception.js');


module.exports = class AltiriaClient {

    constructor(login,password,timeout=10000) {
        this._login=login;
        this._password=password;
        this._timeout=timeout;

        // timeout values are defined here
        this._maxTimeout=30000;
        this._minTimeout=1000;

        // API URL
        this._urlBase=url.parse('https://www.altiria.net/apirest/ws');

        this._source='lib-nodejs-npm-1_0'

        // Logger configuration
        const logConfiguration = {
            transports: [
                new winston.transports.File({
                    filename: 'altiria-client.log',
                    level: 'debug'
                })
            ],
            exitOnError: false,
            format: winston.format.combine(
                winston.format.timestamp({
                   format: 'DD-MMM-YYYY HH:mm:ss'
               }),
                winston.format.printf(info => `${[info.timestamp]} ${info.level} - ${info.message}`)
            )
        };
        this._logger = winston.createLogger(logConfiguration);
    }

    /**
     * Set the response timeout
     */
    set setTimeout(timeout) {
        if (timeout > this._maxTimeout)
            this._timeout=10000;
        else if (timeout < this._minTimeout)
            this._timeout=10000;
        else
            this._timeout=timeout;    
    }
    
    /**
     * Send a SMS.
     * @param {*} textMessage SMS object
     */
    sendSms(textMessage) {
        const logger=this._logger;    
        logger.info('Altiria-sendSms CMD: '+textMessage.toString());

        try {
            let destinations=[];
            if (!textMessage.getDestination) {
                logger.error('ERROR: The destination parameter is mandatory');
                throw new AltiriaGwException('INVALID_DESTINATION', '015');
            } else 
                destinations.push(textMessage.getDestination);
            
            let messageObject={};
            if (!textMessage.getMessage) {
                logger.error('ERROR: The message parameter is mandatory');
                throw new AltiriaGwException('EMPTY_MESSAGE', '017');
            } else 
                messageObject.msg=textMessage.getMessage;
            
            if (textMessage.getSenderId) 
                messageObject.senderId=textMessage.getSenderId;
            
            if (textMessage.isAck && textMessage.isAck===true) {
                messageObject.ack=true;
                if (textMessage.getIdAck)
                    messageObject.idAck=textMessage.getIdAck;
            }
            
            if (textMessage.isConcat && textMessage.isConcat===true)
                messageObject.concat=true;

            if (textMessage.isCertDelivery && textMessage.isCertDelivery===true)
                messageObject.certDelivery=true;

            if (textMessage.getEncoding && textMessage.getEncoding=='unicode')
                messageObject.encoding='unicode';

            let credentialsObject={
                login: this._login,
                passwd: this._password
            };

            let jsonObject={
                credentials: credentialsObject,
                destination: destinations,
                message: messageObject,
                source: this._source
            };

            return new Promise((resolve, reject) => {
                let options = {
                    "method": "POST",
                    "host": this._urlBase.host,
                    "port": this._urlBase.port,
                    "path": [this._urlBase.path + '/sendSms'],
                    "headers": {
                        "content-type": "application/json; charset=utf-8"
                    }
                };
                let request =  http.request(options, function (response) {
                    let data = undefined;
                    response.on("data", function (body) {
                        logger.debug('HTTP status: '+response.statusCode);
                        logger.debug('HTTP body: '+body);
                        data=JSON.parse(body);
                    });
                    response.on("end", function () {
                        if (response.statusCode!=200) {
                            logger.error('ERROR: Invalid request: '+data);
                            reject(new JsonException(data.error));
                        } else if (data.status != '000') {
                            let errorMsg = getStatus(data.status);
                            logger.error('ERROR: Invalid parameter. Error message: '+errorMsg + ', Status: '+data.status);
                            reject(new AltiriaGwException(errorMsg,data.status));
                        }
                        resolve(data);
                    });
                });
                request.setTimeout(this._timeout, function( ) {
                    reject(new ConnectionException('TIMEOUT_ERROR'));
                });
                request.write(JSON.stringify(jsonObject));
                request.end();
            });

        }catch (err) {
            if(err instanceof GeneralAltiriaException) 
                throw err;
            else {
                console.log(err.stack);
                logger.error('ERROR: Unexpected error ',err);
                throw new AltiriaGwException("GENERAL_ERROR", '001');
            }
        }
    }

    /**
     * Get the user credit.
     */
    getCredit() {
      const logger=this._logger;    
      logger.info('Altiria-getCredit CMD');

      try {
          let credentialsObject={
              login: this._login,
              passwd: this._password
          };

          let jsonObject={
              credentials: credentialsObject,
              source: this._source
          };

          return new Promise((resolve, reject) => {
              let options = {
                  "method": "POST",
                  "host": this._urlBase.host,
                  "port": this._urlBase.port,
                  "path": [this._urlBase.path + '/getCredit'],
                  "headers": {
                      "content-type": "application/json; charset=utf-8"
                  }
              };
              let request =  http.request(options, function (response) {
                  let data = undefined;
                  response.on("data", function (body) {
                      logger.debug('HTTP status: '+response.statusCode);
                      logger.debug('HTTP body: '+body);
                      data=JSON.parse(body);
                  });
                  response.on("end", function () {
                      if (response.statusCode!=200) {
                          logger.error('ERROR: Invalid request: '+data);
                          reject(new JsonException(data.error));
                      } else if (data.status != '000') {
                          let errorMsg = getStatus(data.status);
                          logger.error('ERROR: Invalid parameter. Error message: '+errorMsg + ', Status: '+data.status);
                          reject(new AltiriaGwException(errorMsg,data.status));
                      }
                      resolve(data.credit);
                  });
              });
              request.setTimeout(this._timeout, function( ) {
                  reject(new ConnectionException('TIMEOUT_ERROR'));
              });
              request.write(JSON.stringify(jsonObject));
              request.end();
          });

      }catch (err) {
          if(err instanceof GeneralAltiriaException) 
              throw err;
          else {
              console.log(err.stack);
              logger.error('ERROR: Unexpected error ',err);
              throw new AltiriaGwException("GENERAL_ERROR", '001');
          }
      }
  }

}

/**
 * Private function that provides the status message through the status code.
 * @param {*} status status code
 */
function getStatus(status) {
    let errorMessage = 'GENERAL_ERROR';
    if (status=='001') {
      errorMessage = 'INTERNAL_SERVER_ERROR';
    } else if (status=='002') {
      errorMessage = 'SSL_PORT_ERROR';
    } else if (status=='010') {
      errorMessage = 'DESTINATION_FORMAT_ERROR';
    } else if (status=='013') {
      errorMessage = 'MESSAGE_IS_TOO_LONG';
    } else if (status=='014') {
      errorMessage = 'INVALID_HTTP_REQUEST_ENCODING';
    } else if (status=='015') {
      errorMessage = 'INVALID_DESTINATION';
    } else if (status=='016') {
      errorMessage = 'DUPLICATED_DESTINATION';
    } else if (status=='017') {
      errorMessage = 'EMPTY_MESSAGE';
    } else if (status=='018') {
      errorMessage = 'TOO_MANY_DESTINATIONS';
    } else if (status=='019') {
      errorMessage = 'TOO_MANY_MESSAGES';
    } else if (status=='020') {
      errorMessage = 'AUTHENTICATION_ERROR';
    } else if (status=='033') {
      errorMessage = 'INVALID_DESTINATION_SMS_PORT';
    } else if (status=='034') {
      errorMessage = 'INVALID_ORIGIN_SMS_PORT';
    } else if (status=='035') {
      errorMessage = 'INVALID_LANDING';
    } else if (status=='036') {
      errorMessage = 'LANDING_NOT_EXISTS';
    } else if (status=='037') {
      errorMessage = 'TOO_MANY_LANDINGS';
    } else if (status=='038') {
      errorMessage = 'SYNTAX_LANDING_ERROR';
    } else if (status=='039') {
      errorMessage = 'SYNTAX_WEB_PARAMS_ERROR';
    }
    return errorMessage;
}