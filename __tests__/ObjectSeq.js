///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var Immutable = require('immutable');
describe('ObjectSequence', function () {
    it('maps', function () {
        var i = Immutable.Seq({ 'a': 'A', 'b': 'B', 'c': 'C' });
        var m = i.map(function (x) { return x + x; }).toObject();
        expect(m).toEqual({ 'a': 'AA', 'b': 'BB', 'c': 'CC' });
    });
    it('reduces', function () {
        var i = Immutable.Seq({ 'a': 'A', 'b': 'B', 'c': 'C' });
        var r = i.reduce(function (r, x) { return r + x; }, '');
        expect(r).toEqual('ABC');
    });
    it('extracts keys', function () {
        var i = Immutable.Seq({ 'a': 'A', 'b': 'B', 'c': 'C' });
        var k = i.keySeq().toArray();
        expect(k).toEqual(['a', 'b', 'c']);
    });
    it('is reversable', function () {
        var i = Immutable.Seq({ 'a': 'A', 'b': 'B', 'c': 'C' });
        var k = i.reverse().toArray();
        expect(k).toEqual(['C', 'B', 'A']);
    });
    it('can double reversable', function () {
        var i = Immutable.Seq({ 'a': 'A', 'b': 'B', 'c': 'C' });
        var k = i.reverse().reverse().toArray();
        expect(k).toEqual(['A', 'B', 'C']);
    });
    it('can be iterated', function () {
        var obj = { a: 1, b: 2, c: 3 };
        var seq = Immutable.Seq(obj);
        var entries = seq.entries();
        expect(entries.next()).toEqual({ value: ['a', 1], done: false });
        expect(entries.next()).toEqual({ value: ['b', 2], done: false });
        expect(entries.next()).toEqual({ value: ['c', 3], done: false });
        expect(entries.next()).toEqual({ value: undefined, done: true });
    });
    it('cannot be mutated after calling toObject', function () {
        var seq = Immutable.Seq({ a: 1, b: 2, c: 3 });
        var obj = seq.toObject();
        obj['c'] = 10;
        var seq2 = Immutable.Seq(obj);
        expect(seq.get('c')).toEqual(3);
        expect(seq2.get('c')).toEqual(10);
    });
});
//# sourceMappingURL=ObjectSeq.js.map