var expect = require('chai').expect;
var Remdb = require('../lib/remdb');
var remdb = new Remdb();

describe('Basics', function() {
    describe('SET', function() {
        it('should save key-value pairs in remdb', function() {
            remdb.SET('Name', 'Priscilla');
            remdb.SET('Phone', '626-123-4567');
            remdb.SET('', 'asdf');
            remdb.SET('SETNULL', 'NULL');

            // No remdb.CLEAR() for upcoming test.
        });
    });

    describe('GET', function() {
        it('should retrieve values from remdb', function() {
            expect(remdb.GET('Name')).to.equal('Priscilla');
            expect(remdb.GET('Phone')).to.equal('626-123-4567');
            expect(remdb.GET('')).to.equal('asdf');
            expect(remdb.GET('SETNULL')).to.equal('NULL');
            expect(remdb.GET('blahblah')).to.equal('NULL');

            // No remdb.CLEAR() for upcoming test.
        });
    });

    describe('UNSET', function() {
        it('should unset any saved key-value pairs', function() {
            remdb.UNSET('Name');
            remdb.UNSET('Phone');
            remdb.UNSET('');
            remdb.UNSET('SETNULL');
            remdb.UNSET('blahblah');

            expect(remdb.GET('Name')).to.equal('NULL');
            expect(remdb.GET('Phone')).to.equal('NULL');
            expect(remdb.GET('')).to.equal('NULL');
            expect(remdb.GET('SETNULL')).to.equal('NULL');
            expect(remdb.GET('blahblah')).to.equal('NULL');

            remdb.CLEAR();
        });
    });

    describe('NUMEQUALTO', function() {
        it('should return the number of keys with a certain value', function() {
            remdb.SET('MyIQ', 99);
            remdb.SET('CheckingBalance', 99);
            remdb.SET('NumProblems', 99);
            remdb.SET('StarbucksBalance', 99);

            expect(remdb.NUMEQUALTO(99)).to.equal(4);

            remdb.CLEAR();
        });
    });
});

describe('Transactions', function() {
    describe('BEGIN', function() {
        it('should begin a new transaction block', function() {
            remdb.BEGIN();
            remdb.SET('a', 10);
            expect(remdb.GET('a')).to.equal(10);

            remdb.BEGIN();
            expect(remdb.GET('a')).to.equal(10);
            remdb.SET('a', 20);
            expect(remdb.GET('a')).to.equal(20);

            remdb.CLEAR();
        });
    });

    describe('ROLLBACK', function() {
        it('should return status of operation', function() {
            expect(remdb.ROLLBACK()).to.equal('NO TRANSACTION');
            remdb.CLEAR();
        });
    });

    describe('COMMIT', function() {
        it('should return status of operation', function() {
            expect(remdb.COMMIT()).to.equal('NO TRANSACTION');
            remdb.CLEAR();
        });
    });

    describe('Test 1', function() {
        it('should handle ROLLBACKs', function() {
            remdb.BEGIN();
            remdb.SET('a', 10);
            expect(remdb.GET('a')).to.equal(10);
            remdb.BEGIN();
            remdb.SET('a', 20);
            expect(remdb.GET('a')).to.equal(20);
            expect(remdb.ROLLBACK()).to.equal(0);
            expect(remdb.GET('a')).to.equal(10);
            expect(remdb.ROLLBACK()).to.equal(0);
            expect(remdb.GET('a')).to.equal('NULL');

            remdb.CLEAR();
        });
    });

    describe('Test 2', function() {
        it('should handle COMMITs', function() {
            remdb.BEGIN();
            remdb.SET('a', 30);
            remdb.BEGIN();
            remdb.SET('a', 40);
            remdb.COMMIT();
            expect(remdb.GET('a')).to.equal(40);
            expect(remdb.ROLLBACK()).to.equal('NO TRANSACTION');

            remdb.CLEAR();
        });
    });

    describe('Test 3', function() {
        it('should handle UNSET with transactions', function() {
            remdb.SET('a', 50);
            remdb.BEGIN();
            expect(remdb.GET('a')).to.equal(50);
            remdb.SET('a', 60);
            remdb.BEGIN();
            remdb.UNSET('a');
            expect(remdb.GET('a')).to.equal('NULL');
            expect(remdb.ROLLBACK()).to.equal(0);
            expect(remdb.GET('a')).to.equal(60);
            remdb.COMMIT();
            expect(remdb.GET('a')).to.equal(60);

            remdb.CLEAR();
        });
    });

    describe('Test 4', function() {
        it('should handle NUMEQUALTO with transactions', function() {
            remdb.SET('a', 10);
            remdb.BEGIN();
            expect(remdb.NUMEQUALTO(10)).to.equal(1);
            remdb.BEGIN();
            remdb.UNSET('a');
            expect(remdb.NUMEQUALTO(10)).to.equal(0);
            expect(remdb.ROLLBACK()).to.equal(0);
            expect(remdb.NUMEQUALTO(10)).to.equal(1);
            remdb.COMMIT();

            remdb.CLEAR();
        });
    });
});
