const { equal } = require('assert');
const { calculateFuel1, calculateFuel2 } = require('../solution');

describe('Issue #1', function () {
    describe('#1', function () {
        it('should return 2 for 12', function () {
            equal(calculateFuel1([12]), 2);
        });

        it('should return 2 for 14', function () {
            equal(calculateFuel1([14]), 2);
        });

        it('should return 654 for 1969', function () {
            equal(calculateFuel1([1969]), 654);
        });

        it('should return 33583 for 100756', function () {
            equal(calculateFuel1([100756]), 33583);
        });
    });

    describe('#2', function () {
        it('should return 2 for 14', function () {
            equal(calculateFuel2([14]), 2);
        });

        it('should return 966 for 1969', function () {
            equal(calculateFuel2([1969]), 966);
        });

        it('should return 50346 for 100756', function () {
            equal(calculateFuel2([100756]), 50346);
        });
    });
});