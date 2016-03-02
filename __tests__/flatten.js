///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var I = require('immutable');
var jasmineCheck = require('jasmine-check');
jasmineCheck.install();
describe('flatten', function () {
    it('flattens sequences one level deep', function () {
        var nested = I.fromJS([[1, 2], [3, 4], [5, 6]]);
        var flat = nested.flatten();
        expect(flat.toJS()).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it('flattening a List returns a List', function () {
        var nested = I.fromJS([[1], 2, 3, [4, 5, 6]]);
        var flat = nested.flatten();
        expect(flat.toString()).toEqual("List [ 1, 2, 3, 4, 5, 6 ]");
    });
    it('gives the correct iteration count', function () {
        var nested = I.fromJS([[1, 2, 3], [4, 5, 6]]);
        var flat = nested.flatten();
        expect(flat.forEach(function (x) { return x < 4; })).toEqual(4);
    });
    it('flattens only Sequences (not sequenceables)', function () {
        var nested = I.Seq.of(I.Range(1, 3), [3, 4], I.List.of(5, 6, 7), 8);
        var flat = nested.flatten();
        expect(flat.toJS()).toEqual([1, 2, [3, 4], 5, 6, 7, 8]);
    });
    it('can be reversed', function () {
        var nested = I.Seq.of(I.Range(1, 3), [3, 4], I.List.of(5, 6, 7), 8);
        var flat = nested.flatten();
        var reversed = flat.reverse();
        expect(reversed.toJS()).toEqual([8, 7, 6, 5, [3, 4], 2, 1]);
    });
    it('can flatten at various levels of depth', function () {
        var deeplyNested = I.fromJS([
            [
                [
                    ['A', 'B'],
                    ['A', 'B'],
                ],
                [
                    ['A', 'B'],
                    ['A', 'B'],
                ],
            ],
            [
                [
                    ['A', 'B'],
                    ['A', 'B'],
                ],
                [
                    ['A', 'B'],
                    ['A', 'B'],
                ]
            ]
        ]);
        // deeply flatten
        expect(deeplyNested.flatten().toJS()).toEqual(['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B']);
        // shallow flatten
        expect(deeplyNested.flatten(true).toJS()).toEqual([
            [
                ['A', 'B'],
                ['A', 'B'],
            ],
            [
                ['A', 'B'],
                ['A', 'B'],
            ],
            [
                ['A', 'B'],
                ['A', 'B'],
            ],
            [
                ['A', 'B'],
                ['A', 'B'],
            ]
        ]);
        // flatten two levels
        expect(deeplyNested.flatten(2).toJS()).toEqual([
            ['A', 'B'],
            ['A', 'B'],
            ['A', 'B'],
            ['A', 'B'],
            ['A', 'B'],
            ['A', 'B'],
            ['A', 'B'],
            ['A', 'B']
        ]);
    });
    describe('flatMap', function () {
        it('first maps, then shallow flattens', function () {
            var numbers = I.Range(97, 100);
            var letters = numbers.flatMap(function (v) { return I.fromJS([
                String.fromCharCode(v),
                String.fromCharCode(v).toUpperCase(),
            ]); });
            expect(letters.toJS()).toEqual(['a', 'A', 'b', 'B', 'c', 'C']);
        });
        it('maps to sequenceables, not only Sequences.', function () {
            var numbers = I.Range(97, 100);
            // the map function returns an Array, rather than an Iterable.
            // Array is sequenceable, so this works just fine.
            var letters = numbers.flatMap(function (v) { return [
                String.fromCharCode(v),
                String.fromCharCode(v).toUpperCase()
            ]; });
            expect(letters.toJS()).toEqual(['a', 'A', 'b', 'B', 'c', 'C']);
        });
    });
});
//# sourceMappingURL=flatten.js.map