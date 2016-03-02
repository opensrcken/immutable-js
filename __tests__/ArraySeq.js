///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var Immutable = require('immutable');
describe('ArraySequence', function () {
    it('every is true when predicate is true for all entries', function () {
        expect(Immutable.Seq([]).every(function () { return false; })).toBe(true);
        expect(Immutable.Seq([1, 2, 3]).every(function (v) { return v > 0; })).toBe(true);
        expect(Immutable.Seq([1, 2, 3]).every(function (v) { return v < 3; })).toBe(false);
    });
    it('some is true when predicate is true for any entry', function () {
        expect(Immutable.Seq([]).some(function () { return true; })).toBe(false);
        expect(Immutable.Seq([1, 2, 3]).some(function (v) { return v > 0; })).toBe(true);
        expect(Immutable.Seq([1, 2, 3]).some(function (v) { return v < 3; })).toBe(true);
        expect(Immutable.Seq([1, 2, 3]).some(function (v) { return v > 1; })).toBe(true);
        expect(Immutable.Seq([1, 2, 3]).some(function (v) { return v < 0; })).toBe(false);
    });
    it('maps', function () {
        var i = Immutable.Seq([1, 2, 3]);
        var m = i.map(function (x) { return x + x; }).toObject();
        expect(m).toEqual([2, 4, 6]);
    });
    it('reduces', function () {
        var i = Immutable.Seq([1, 2, 3]);
        var r = i.reduce(function (r, x) { return r + x; });
        expect(r).toEqual(6);
    });
    it('efficiently chains iteration methods', function () {
        var i = Immutable.Seq('abcdefghijklmnopqrstuvwxyz'.split(''));
        function studly(letter, index) {
            return index % 2 === 0 ? letter : letter.toUpperCase();
        }
        var result = i.reverse().take(10).reverse().take(5).map(studly).toArray().join('');
        expect(result).toBe('qRsTu');
    });
    it('counts from the end of the sequence on negative index', function () {
        var i = Immutable.Seq.of(1, 2, 3, 4, 5, 6, 7);
        expect(i.get(-1)).toBe(7);
        expect(i.get(-5)).toBe(3);
        expect(i.get(-9)).toBe(undefined);
        expect(i.get(-999, 1000)).toBe(1000);
    });
    it('handles trailing holes', function () {
        var a = [1, 2, 3];
        a.length = 10;
        var seq = Immutable.Seq(a);
        expect(seq.size).toBe(10);
        expect(seq.toArray().length).toBe(10);
        expect(seq.map(function (x) { return x * x; }).size).toBe(10);
        expect(seq.map(function (x) { return x * x; }).toArray().length).toBe(10);
        expect(seq.skip(2).toArray().length).toBe(8);
        expect(seq.take(2).toArray().length).toBe(2);
        expect(seq.take(5).toArray().length).toBe(5);
        expect(seq.filter(function (x) { return x % 2 == 1; }).toArray().length).toBe(2);
        expect(seq.toKeyedSeq().flip().size).toBe(10);
        expect(seq.toKeyedSeq().flip().flip().size).toBe(10);
        expect(seq.toKeyedSeq().flip().flip().toArray().length).toBe(10);
    });
    it('can be iterated', function () {
        var a = [1, 2, 3];
        var seq = Immutable.Seq(a);
        var entries = seq.entries();
        expect(entries.next()).toEqual({ value: [0, 1], done: false });
        expect(entries.next()).toEqual({ value: [1, 2], done: false });
        expect(entries.next()).toEqual({ value: [2, 3], done: false });
        expect(entries.next()).toEqual({ value: undefined, done: true });
    });
    it('cannot be mutated after calling toArray', function () {
        var seq = Immutable.Seq(['A', 'B', 'C']);
        var firstReverse = Immutable.Seq(seq.toArray().reverse());
        var secondReverse = Immutable.Seq(seq.toArray().reverse());
        expect(firstReverse.get(0)).toEqual('C');
        expect(secondReverse.get(0)).toEqual('C');
    });
});
//# sourceMappingURL=ArraySeq.js.map