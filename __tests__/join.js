///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var I = require('immutable');
var jasmineCheck = require('jasmine-check');
jasmineCheck.install();
describe('join', function () {
    it('string-joins sequences with commas by default', function () {
        expect(I.Seq.of(1, 2, 3, 4, 5).join()).toBe('1,2,3,4,5');
    });
    it('string-joins sequences with any string', function () {
        expect(I.Seq.of(1, 2, 3, 4, 5).join('foo')).toBe('1foo2foo3foo4foo5');
    });
    it('string-joins sequences with empty string', function () {
        expect(I.Seq.of(1, 2, 3, 4, 5).join('')).toBe('12345');
    });
    it('joins sparse-sequences like Array.join', function () {
        var a = [1, , 2, , 3, , 4, , 5, , ,];
        expect(I.Seq(a).join()).toBe(a.join());
    });
    check.it('behaves the same as Array.join', [gen.array(gen.primitive), gen.primitive], function (array, joiner) {
        expect(I.Seq(array).join(joiner)).toBe(array.join(joiner));
    });
});
//# sourceMappingURL=join.js.map