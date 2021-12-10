const AltiriaClient = require('../src/altiria-client');
const AltiriaModelTextMessage = require('../src/altiria-model-text-message');
const AltiriaGwException = require('../src/exception/altiria-gw-exception.js');


/**
 * Running this test suite supposes a consumption of credits (between 3 and 5 credits).
 */
describe('SendSmsHttpTest', () => {

    //configurable parameters
    const login = 'user@mydomain.com';
    const password = 'mypassword';
    //set to undefined if there is no sender
    const sender = 'mySender';
    const destination = '346XXXXXXXX';

    /**
     * Only mandatory parameters are sent.
     */
    test('testOkMandatoryParams', async (done) => {
        try {
            const message = 'Lorem Ipsum is simply dummy text';

            let altiriaClient = new AltiriaClient(login, password);
            let textMessage = new AltiriaModelTextMessage(destination, message);
            let data = await altiriaClient.sendSms(textMessage);

            expect(data.status).toEqual('000');
            expect(data.details[0].destination).toEqual(destination);
            expect(data.details[0].status).toEqual('000');

            done();
        } catch (error) {
            done.fail(new Error('Error: '+error));
        }
    });

    /**
     * All params are sent.
     * Features:
     * - sender
     * - delivery confirmation with identifier
     * - concatenated
     * - set unicode encoding
     * - request delivery certificate
     */
    test('testOkAllParams', async (done) => {
        try {
            const message = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry €';
            const idAck = 'myAlias';
            const encoding = 'unicode';

            let altiriaClient = new AltiriaClient(login, password);
            let textMessage = new AltiriaModelTextMessage(destination, message, sender);

            // You can also assign the sender here
            //textMessage.setSenderId=sender;

            // Need to configure a callback URL to use it. Contact comercial@altiria.com. 
            //textMessage.setAck=true;
            //textMessage.setIdAck=idAck;

            textMessage.setConcat=true;
            textMessage.setEncoding=encoding;
      
            // If it is uncommented, additional credit will be consumed.
            //textMessage.setCertDelivery=true;

            let data = await altiriaClient.sendSms(textMessage);

            expect(data.status).toEqual('000');
            
            expect(data.details[0].destination).toEqual(destination+'(0)');
            expect(data.details[0].status).toEqual('000');
            //Uncomment if idAck is used.
            //expect(data.details[0].idAck).toEqual(idAck);

            expect(data.details[1].destination).toEqual(destination+'(1)');
            expect(data.details[1].status).toEqual('000');
            //Uncomment if idAck is used.
            //expect(data.details[1].idAck).toEqual(idAck);

            done();
        } catch (error) {
            done.fail(new Error('Error: '+error));
        }
    });
    
    /**
     * Invalid credentials.
     */
    test('testErrorInvalidCredentials', async (done) => {
        try {
            const message = 'Lorem Ipsum is simply dummy text';

            let altiriaClient = new AltiriaClient('unknown', password);
            let textMessage = new AltiriaModelTextMessage(destination, message);
            await altiriaClient.sendSms(textMessage);

            done.fail(new Error('AltiriaGwException should have been thrown'));
        } catch (error) {
            if(error instanceof AltiriaGwException){
                expect(error.getMessage).toEqual('AUTHENTICATION_ERROR');
                expect(error.getStatus).toEqual('020');
                done();
            }else 
                done.fail(new Error('Error: '+error));
        }
    });

    /**
     * The destination parameter is invalid.
     */
    test('testErrorInvalidDestination', async (done) => {
        try {
            const message = 'Lorem Ipsum is simply dummy text';
            const invalidDestination = 'invalid';

            let altiriaClient = new AltiriaClient(login, password);
            let textMessage = new AltiriaModelTextMessage(invalidDestination, message);
            await altiriaClient.sendSms(textMessage);

            done.fail(new Error('AltiriaGwException should have been thrown'));
        } catch (error) {
            if(error instanceof AltiriaGwException){
                expect(error.getMessage).toEqual('INVALID_DESTINATION');
                expect(error.getStatus).toEqual('015');
                done();
            }else 
                done.fail(new Error('Error: '+error));
        }
    });

    /**
     * The message parameter is empty.
     */
    test('testErrorEmptyMessage', async (done) => {
        try {
            const message = '';

            let altiriaClient = new AltiriaClient(login, password);
            let textMessage = new AltiriaModelTextMessage(destination, message);
            await altiriaClient.sendSms(textMessage);

            done.fail(new Error('AltiriaGwException should have been thrown'));
        } catch (error) {
            if(error instanceof AltiriaGwException){
                expect(error.getMessage).toEqual('EMPTY_MESSAGE');
                expect(error.getStatus).toEqual('017');
                done();
            }else 
                done.fail(new Error('Error: '+error));
        }
    });
    
});