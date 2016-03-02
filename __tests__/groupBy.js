///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var I = require('immutable');
describe('groupBy', function () {
    it('groups keyed sequence', function () {
        var grouped = I.Seq({ a: 1, b: 2, c: 3, d: 4 }).groupBy(function (x) { return x % 2; });
        expect(grouped.toJS()).toEqual({ 1: { a: 1, c: 3 }, 0: { b: 2, d: 4 } });
        // Each group should be a keyed sequence, not an indexed sequence
        expect(grouped.get(1).toArray()).toEqual([1, 3]);
    });
    it('groups indexed sequence', function () {
        console.log("I.Seq.of(1,2,3,4,5,6).groupBy(x => x % 2).toJS()", I.Seq.of(1, 2, 3, 4, 5, 6).groupBy(function (x) { return x % 2; }).toJS());
        expect(I.Seq.of(1, 2, 3, 4, 5, 6).groupBy(function (x) { return x % 2; }).toJS()).toEqual({ 1: [1, 3, 5], 0: [2, 4, 6] });
    });
    it('groups to keys', function () {
        expect(I.Seq.of(1, 2, 3, 4, 5, 6).groupBy(function (x) { return x % 2 ? 'odd' : 'even'; }).toJS()).toEqual({ odd: [1, 3, 5], even: [2, 4, 6] });
    });
    it('groups indexed sequences, maintaining indicies', function () {
        expect(I.Seq.of(1, 2, 3, 4, 5, 6).toKeyedSeq().groupBy(function (x) { return x % 2; }).toJS()).toEqual({ 1: [1, , 3, , 5, , ,], 0: [, 2, , 4, , 6] });
    });
    it('has groups that can be mapped', function () {
        expect(I.Seq.of(1, 2, 3, 4, 5, 6).groupBy(function (x) { return x % 2; }).map(function (group) { return group.map(function (value) { return value * 10; }); }).toJS()).toEqual({ 1: [10, 30, 50], 0: [20, 40, 60] });
    });
    it('returns an ordered map from an ordered collection', function () {
        var seq = I.Seq.of('Z', 'Y', 'X', 'Z', 'Y', 'X');
        expect(I.Iterable.isOrdered(seq)).toBe(true);
        var seqGroups = seq.groupBy(function (x) { return x; });
        expect(I.Iterable.isOrdered(seqGroups)).toBe(true);
        var map = I.Map({ x: 1, y: 2 });
        expect(I.Iterable.isOrdered(map)).toBe(false);
        var mapGroups = map.groupBy(function (x) { return x; });
        expect(I.Iterable.isOrdered(mapGroups)).toBe(false);
    });
});
//# sourceMappingURL=groupBy.js.map