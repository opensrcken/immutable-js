///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var Immutable = require('immutable');
describe('Seq', function () {
    it('can be empty', function () {
        expect(Immutable.Seq().size).toBe(0);
    });
    it('accepts an array', function () {
        expect(Immutable.Seq([1, 2, 3]).size).toBe(3);
    });
    it('accepts an object', function () {
        expect(Immutable.Seq({ a: 1, b: 2, c: 3 }).size).toBe(3);
    });
    it('accepts an iterable string', function () {
        expect(Immutable.Seq('foo').size).toBe(3);
    });
    it('accepts arbitrary objects', function () {
        function Foo() {
            this.bar = 'bar';
            this.baz = 'baz';
        }
        expect(Immutable.Seq(new Foo()).size).toBe(2);
    });
    it('of accepts varargs', function () {
        expect(Immutable.Seq.of(1, 2, 3).size).toBe(3);
    });
    it('accepts another sequence', function () {
        var seq = Immutable.Seq.of(1, 2, 3);
        expect(Immutable.Seq(seq).size).toBe(3);
    });
    it('accepts a string', function () {
        var seq = Immutable.Seq('abc');
        expect(seq.size).toBe(3);
        expect(seq.get(1)).toBe('b');
        expect(seq.join('')).toBe('abc');
    });
    it('accepts an array-like', function () {
        var alike = { length: 2, 0: 'a', 1: 'b' };
        var seq = Immutable.Seq(alike);
        expect(Immutable.Iterable.isIndexed(seq)).toBe(true);
        expect(seq.size).toBe(2);
        expect(seq.get(1)).toBe('b');
    });
    it('does not accept a scalar', function () {
        expect(function () {
            Immutable.Seq(3);
        }).toThrow('Expected Array or iterable object of values, or keyed object: 3');
    });
    it('temporarily warns about iterable length', function () {
        this.spyOn(console, 'warn');
        var seq = Immutable.Seq.of(1, 2, 3);
        // Note: `length` has been removed from the type definitions.
        var length = seq.length;
        expect(console.warn.mostRecentCall.args[0]).toContain('iterable.length has been deprecated, ' +
            'use iterable.size or iterable.count(). ' +
            'This warning will become a silent error in a future version.');
        expect(length).toBe(3);
    });
    it('detects sequences', function () {
        var seq = Immutable.Seq.of(1, 2, 3);
        expect(Immutable.Seq.isSeq(seq)).toBe(true);
        expect(Immutable.Iterable.isIterable(seq)).toBe(true);
    });
    it('Does not infinite loop when sliced with NaN', function () {
        var list = Immutable.Seq([1, 2, 3, 4, 5]);
        expect(list.slice(0, NaN).toJS()).toEqual([]);
        expect(list.slice(NaN).toJS()).toEqual([1, 2, 3, 4, 5]);
    });
    it('Does not infinite loop when spliced with negative number #559', function () {
        var dog = Immutable.Seq(['d', 'o', 'g']);
        var dg = dog.filter(function (c) { return c !== 'o'; });
        var dig = dg.splice(-1, 0, 'i');
        expect(dig.toJS()).toEqual(['d', 'i', 'g']);
    });
    it('Does not infinite loop when an undefined number is passed to take', function () {
        var list = Immutable.Seq([1, 2, 3, 4, 5]);
        expect(list.take(NaN).toJS()).toEqual([]);
    });
});
//# sourceMappingURL=Seq.js.map