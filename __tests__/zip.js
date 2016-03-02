///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var I = require('immutable');
var jasmineCheck = require('jasmine-check');
jasmineCheck.install();
describe('zip', function () {
    it('zips lists into a list of tuples', function () {
        expect(I.Seq.of(1, 2, 3).zip(I.Seq.of(4, 5, 6)).toArray()).toEqual([[1, 4], [2, 5], [3, 6]]);
    });
    it('zips with infinite lists', function () {
        expect(I.Range().zip(I.Seq.of('A', 'B', 'C')).toArray()).toEqual([[0, 'A'], [1, 'B'], [2, 'C']]);
    });
    it('has unknown size when zipped with unknown size', function () {
        var seq = I.Range(0, 10);
        var zipped = seq.zip(seq.filter(function (n) { return n % 2 === 0; }));
        expect(zipped.size).toBe(undefined);
        expect(zipped.count()).toBe(5);
    });
    check.it('is always the size of the smaller sequence', [gen.notEmpty(gen.array(gen.posInt))], function (lengths) {
        var ranges = lengths.map(function (l) { return I.Range(0, l); });
        var first = ranges.shift();
        var zipped = first.zip.apply(first, ranges);
        var shortestLength = Math.min.apply(Math, lengths);
        expect(zipped.size).toBe(shortestLength);
    });
    describe('zipWith', function () {
        it('zips with a custom function', function () {
            expect(I.Seq.of(1, 2, 3).zipWith(function (a, b) { return a + b; }, I.Seq.of(4, 5, 6)).toArray()).toEqual([5, 7, 9]);
        });
        it('can zip to create immutable collections', function () {
            expect(I.Seq.of(1, 2, 3).zipWith(function () { return I.List(Array.prototype.slice.apply(arguments)); }, I.Seq.of(4, 5, 6), I.Seq.of(7, 8, 9)).toJS()).toEqual([[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
        });
    });
    describe('interleave', function () {
        it('interleaves multiple collections', function () {
            expect(I.Seq.of(1, 2, 3).interleave(I.Seq.of(4, 5, 6), I.Seq.of(7, 8, 9)).toArray()).toEqual([1, 4, 7, 2, 5, 8, 3, 6, 9]);
        });
        it('stops at the shortest collection', function () {
            var i = I.Seq.of(1, 2, 3).interleave(I.Seq.of(4, 5), I.Seq.of(7, 8, 9));
            expect(i.size).toBe(6);
            expect(i.toArray()).toEqual([1, 4, 7, 2, 5, 8]);
        });
        it('with infinite lists', function () {
            var r = I.Range();
            var i = r.interleave(I.Seq.of('A', 'B', 'C'));
            expect(i.size).toBe(6);
            expect(i.toArray()).toEqual([0, 'A', 1, 'B', 2, 'C']);
        });
    });
});
//# sourceMappingURL=zip.js.map