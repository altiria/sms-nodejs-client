const AltiriaClient = require('../src/altiria-client');
const AltiriaGwException = require('../src/exception/altiria-gw-exception.js');


describe('GetCreditHttpTest', () => {

    //configurable parameters
    const login = 'user@mydomain.com';
    const password = 'mypassword';
    const apiKey = 'XXXXXXXXXX';
    const apiSecret = 'YYYYYYYYYY';

    /**
     * Basic case.
     */
    test('testOk', async () => {
        try {
            let altiriaClient = new AltiriaClient(login, password);
            let credit = await altiriaClient.getCredit();

            //Check your credit here
            //expect(credit).toEqual('100.00');

        } catch (error) {
            throw new Error('Error: '+error);
        }
    });

    /**
     * Basic case using apikey.
     */
    test('testOkApikey', async () => {
        try {
            let altiriaClient = new AltiriaClient(apiKey, apiSecret, true);
            let credit = await altiriaClient.getCredit();

            //Check your credit here
            //expect(credit).toEqual('100.00');

        } catch (error) {
            throw new Error('Error: '+error);
        }
    });

    /**
     * Invalid credentials.
     */
    test('testErrorInvalidCredentials', async () => {
        try {
            let altiriaClient = new AltiriaClient('unknown', password);
            await altiriaClient.getCredit();

            throw new Error('AltiriaGwException should have been thrown');
        } catch (error) {
            if(error instanceof AltiriaGwException){
                expect(error.getMessage).toEqual('AUTHENTICATION_ERROR');
                expect(error.getStatus).toEqual('020');
            }else 
                throw new Error('Error: '+error);
        }
    });
    
});