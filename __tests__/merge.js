///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var I = require('immutable');
describe('merge', function () {
    beforeEach(function () {
        this.addMatchers({
            is: function (expected) {
                return I.is(this.actual, expected);
            }
        });
    });
    it('merges two maps', function () {
        var m1 = I.Map({ a: 1, b: 2, c: 3 });
        var m2 = I.Map({ d: 10, b: 20, e: 30 });
        expect(m1.merge(m2)).is(I.Map({ a: 1, b: 20, c: 3, d: 10, e: 30 }));
    });
    it('can merge in an explicitly undefined value', function () {
        var m1 = I.Map({ a: 1, b: 2 });
        var m2 = I.Map({ a: undefined });
        expect(m1.merge(m2)).is(I.Map({ a: undefined, b: 2 }));
    });
    it('merges two maps with a merge function', function () {
        var m1 = I.Map({ a: 1, b: 2, c: 3 });
        var m2 = I.Map({ d: 10, b: 20, e: 30 });
        expect(m1.mergeWith(function (a, b) { return a + b; }, m2)).is(I.Map({ a: 1, b: 22, c: 3, d: 10, e: 30 }));
    });
    it('provides key as the third argument of merge function', function () {
        var m1 = I.Map({ id: 'temp', b: 2, c: 3 });
        var m2 = I.Map({ id: 10, b: 20, e: 30 });
        var add = function (a, b) { return a + b; };
        expect(m1.mergeWith(function (a, b, key) { return key !== 'id' ? add(a, b) : b; }, m2)).is(I.Map({ id: 10, b: 22, c: 3, e: 30 }));
    });
    it('deep merges two maps', function () {
        var m1 = I.fromJS({ a: { b: { c: 1, d: 2 } } });
        var m2 = I.fromJS({ a: { b: { c: 10, e: 20 }, f: 30 }, g: 40 });
        expect(m1.mergeDeep(m2)).is(I.fromJS({ a: { b: { c: 10, d: 2, e: 20 }, f: 30 }, g: 40 }));
    });
    it('deep merges raw JS', function () {
        var m1 = I.fromJS({ a: { b: { c: 1, d: 2 } } });
        var js = { a: { b: { c: 10, e: 20 }, f: 30 }, g: 40 };
        expect(m1.mergeDeep(js)).is(I.fromJS({ a: { b: { c: 10, d: 2, e: 20 }, f: 30 }, g: 40 }));
    });
    it('deep merges raw JS with a merge function', function () {
        var m1 = I.fromJS({ a: { b: { c: 1, d: 2 } } });
        var js = { a: { b: { c: 10, e: 20 }, f: 30 }, g: 40 };
        expect(m1.mergeDeepWith(function (a, b) { return a + b; }, js)).is(I.fromJS({ a: { b: { c: 11, d: 2, e: 20 }, f: 30 }, g: 40 }));
    });
    it('returns self when a deep merges is a no-op', function () {
        var m1 = I.fromJS({ a: { b: { c: 1, d: 2 } } });
        expect(m1.mergeDeep({ a: { b: { c: 1 } } })).toBe(m1);
    });
    it('returns arg when a deep merges is a no-op', function () {
        var m1 = I.fromJS({ a: { b: { c: 1, d: 2 } } });
        expect(I.Map().mergeDeep(m1)).toBe(m1);
    });
    it('can overwrite existing maps', function () {
        expect(I.fromJS({ a: { x: 1, y: 1 }, b: { x: 2, y: 2 } })
            .merge({ a: null, b: { x: 10 } })
            .toJS()).toEqual({ a: null, b: { x: 10 } });
        expect(I.fromJS({ a: { x: 1, y: 1 }, b: { x: 2, y: 2 } })
            .mergeDeep({ a: null, b: { x: 10 } })
            .toJS()).toEqual({ a: null, b: { x: 10, y: 2 } });
    });
    it('can overwrite existing maps with objects', function () {
        var m1 = I.fromJS({ a: { x: 1, y: 1 } }); // deep conversion.
        var m2 = I.Map({ a: { z: 10 } }); // shallow conversion to Map.
        // raw object simply replaces map.
        expect(m1.merge(m2).get('a')).toEqual({ z: 10 }); // raw object.
        expect(m1.mergeDeep(m2).get('a')).toEqual({ z: 10 }); // raw object.
    });
    it('merges map entries with Vector values', function () {
        expect(I.fromJS({ a: [1] }).merge({ b: [2] })).is(I.fromJS({ a: [1], b: [2] }));
        expect(I.fromJS({ a: [1] }).mergeDeep({ b: [2] })).is(I.fromJS({ a: [1], b: [2] }));
    });
    it('maintains JS values inside immutable collections', function () {
        var m1 = I.fromJS({ a: { b: [{ imm: 'map' }] } });
        var m2 = m1.mergeDeep(I.Map({ a: I.Map({ b: I.List.of({ plain: 'obj' }) }) }));
        expect(m1.getIn(['a', 'b', 0])).is(I.Map([['imm', 'map']]));
        expect(m2.getIn(['a', 'b', 0])).toEqual({ plain: 'obj' });
    });
});
//# sourceMappingURL=merge.js.map