const AltiriaClient = require('../src/altiria-client');
const JsonException = require('../src/exception/json-exception.js');


describe('GetCreditAuthTest', () => {

    //configurable parameters
    const login = 'user@mydomain.com';
    const password = 'mypassword';

    /**
     * The login parameter is missed.
     */
    test('testErrorNoLogin', async () => {
        try {
            let altiriaClient = new AltiriaClient(undefined, password);
            await altiriaClient.getCredit();

            throw new Error('JsonException should have been thrown');
        } catch (error) {
            if(error instanceof JsonException){
                expect(error.getMessage).toEqual('LOGIN_NOT_NULL');
            }else 
                throw new Error('Error: '+error);
        }
    });

    /**
     * The password parameter is missed.
     */
    test('testErrorNoPassword', async () => {
        try {
            let altiriaClient = new AltiriaClient(login, undefined);
            await altiriaClient.getCredit();

            throw new Error('JsonException should have been thrown');
        } catch (error) {
            if(error instanceof JsonException){
                expect(error.getMessage).toEqual('PASSWORD_NOT_NULL');
            }else 
                throw new Error('Error: '+error);
        }
    });
    
});