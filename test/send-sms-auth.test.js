const AltiriaClient = require('../src/altiria-client');
const AltiriaModelTextMessage = require('../src/altiria-model-text-message');
const AltiriaGwException = require('../src/exception/altiria-gw-exception.js');
const JsonException = require('../src/exception/json-exception.js');


describe('SendSmsAuthTest', () => {

    //configurable parameters
    const login = 'user@mydomain.com';
    const password = 'mypassword';
    //set to undefined if there is no sender
    const sender = 'mySender';
    const destination = '346XXXXXXXX';

    /**
     * The login parameter is missed.
     */
    test('testErrorNoLogin', async (done) => {
        try {
            const message = 'Lorem Ipsum is simply dummy text';

            let altiriaClient = new AltiriaClient(undefined, password);
            let textMessage = new AltiriaModelTextMessage(destination, message);
            await altiriaClient.sendSms(textMessage);

            done.fail(new Error('JsonException should have been thrown'));
        } catch (error) {
            if(error instanceof JsonException){
                expect(error.getMessage).toEqual('LOGIN_NOT_NULL');
                done();
            }else 
                done.fail(new Error('Error: '+error));
        }
    });

    /**
     * The password parameter is missed.
     */
    test('testErrorNoPassword', async (done) => {
        try {
            const message = 'Lorem Ipsum is simply dummy text';

            let altiriaClient = new AltiriaClient(login, undefined);
            let textMessage = new AltiriaModelTextMessage(destination, message);
            await altiriaClient.sendSms(textMessage);

            done.fail(new Error('JsonException should have been thrown'));
        } catch (error) {
            if(error instanceof JsonException){
                expect(error.getMessage).toEqual('PASSWORD_NOT_NULL');
                done();
            }else 
                done.fail(new Error('Error: '+error));
        }
    });

    /**
     * The destination parameter is missed.
     */
    test('testErrorNoDestination', async (done) => {
        try {
            const message = 'Lorem Ipsum is simply dummy text';

            let altiriaClient = new AltiriaClient(login, password);
            let textMessage = new AltiriaModelTextMessage(undefined, message);
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
     * The message parameter is missed.
     */
    test('testErrorNoMessage', async (done) => {
        try {
            let altiriaClient = new AltiriaClient(login, password);
            let textMessage = new AltiriaModelTextMessage(destination, undefined);
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