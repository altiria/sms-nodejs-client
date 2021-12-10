const AltiriaClient = require('../src/altiria-client');
const AltiriaGwException = require('../src/exception/altiria-gw-exception.js');


describe('GetCreditHttpTest', () => {

    //configurable parameters
    const login = 'user@mydomain.com';
    const password = 'mypassword';

    /**
     * Basic case.
     */
    test('testOk', async (done) => {
        try {
            let altiriaClient = new AltiriaClient(login, password);
            let credit = await altiriaClient.getCredit();

            //Check your credit here
            //expect(credit).toEqual('100.00');

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
            let altiriaClient = new AltiriaClient('unknown', password);
            await altiriaClient.getCredit();

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
    
});