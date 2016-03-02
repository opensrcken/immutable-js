///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var Immutable = require('immutable');
var Repeat = Immutable.Repeat;
describe('Repeat', function () {
    it('fixed repeat', function () {
        var v = Repeat('wtf', 3);
        expect(v.size).toBe(3);
        expect(v.first()).toBe('wtf');
        expect(v.rest().toArray()).toEqual(['wtf', 'wtf']);
        expect(v.last()).toBe('wtf');
        expect(v.butLast().toArray()).toEqual(['wtf', 'wtf']);
        expect(v.toArray()).toEqual(['wtf', 'wtf', 'wtf']);
        expect(v.join()).toEqual('wtf,wtf,wtf');
    });
});
//# sourceMappingURL=Repeat.js.map