///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var jasmineCheck = require('jasmine-check');
jasmineCheck.install();
var Immutable = require('immutable');
describe('IndexedSequence', function () {
    it('maintains skipped offset', function () {
        var seq = Immutable.Seq(['A', 'B', 'C', 'D', 'E']);
        // This is what we expect for IndexedSequences
        var operated = seq.skip(1);
        expect(operated.entrySeq().toArray()).toEqual([
            [0, 'B'],
            [1, 'C'],
            [2, 'D'],
            [3, 'E']
        ]);
        expect(operated.first()).toEqual('B');
    });
    it('reverses correctly', function () {
        var seq = Immutable.Seq(['A', 'B', 'C', 'D', 'E']);
        // This is what we expect for IndexedSequences
        var operated = seq.reverse();
        expect(operated.get(0)).toEqual('E');
        expect(operated.get(1)).toEqual('D');
        expect(operated.get(4)).toEqual('A');
        expect(operated.first()).toEqual('E');
        expect(operated.last()).toEqual('A');
    });
});
//# sourceMappingURL=IndexedSeq.js.map