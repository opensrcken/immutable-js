///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var I = require('immutable');
describe('updateIn', function () {
    it('deep get', function () {
        var m = I.fromJS({ a: { b: { c: 10 } } });
        expect(m.getIn(['a', 'b', 'c'])).toEqual(10);
    });
    it('deep get with list as keyPath', function () {
        var m = I.fromJS({ a: { b: { c: 10 } } });
        expect(m.getIn(I.fromJS(['a', 'b', 'c']))).toEqual(10);
    });
    it('deep get throws without list or array-like', function () {
        // need to cast these as TypeScript first prevents us from such clownery.
        expect(function () {
            return I.Map().getIn(undefined);
        }).toThrow('Expected iterable or array-like: undefined');
        expect(function () {
            return I.Map().getIn({ a: 1, b: 2 });
        }).toThrow('Expected iterable or array-like: [object Object]');
    });
    it('deep has throws without list or array-like', function () {
        // need to cast these as TypeScript first prevents us from such clownery.
        expect(function () {
            return I.Map().hasIn(undefined);
        }).toThrow('Expected iterable or array-like: undefined');
        expect(function () {
            return I.Map().hasIn({ a: 1, b: 2 });
        }).toThrow('Expected iterable or array-like: [object Object]');
    });
    it('deep get returns not found if path does not match', function () {
        var m = I.fromJS({ a: { b: { c: 10 } } });
        expect(m.getIn(['a', 'b', 'z'])).toEqual(undefined);
        expect(m.getIn(['a', 'b', 'c', 'd'])).toEqual(undefined);
    });
    it('deep edit', function () {
        var m = I.fromJS({ a: { b: { c: 10 } } });
        expect(m.updateIn(['a', 'b', 'c'], function (value) { return value * 2; }).toJS()).toEqual({ a: { b: { c: 20 } } });
    });
    it('deep edit with list as keyPath', function () {
        var m = I.fromJS({ a: { b: { c: 10 } } });
        expect(m.updateIn(I.fromJS(['a', 'b', 'c']), function (value) { return value * 2; }).toJS()).toEqual({ a: { b: { c: 20 } } });
    });
    it('deep edit throws without list or array-like', function () {
        // need to cast these as TypeScript first prevents us from such clownery.
        expect(function () {
            return I.Map().updateIn(undefined, function (x) { return x; });
        }).toThrow('Expected iterable or array-like: undefined');
        expect(function () {
            return I.Map().updateIn({ a: 1, b: 2 }, function (x) { return x; });
        }).toThrow('Expected iterable or array-like: [object Object]');
    });
    it('deep remove', function () {
        var m = I.fromJS({ a: { b: { c: 10 } } });
        expect(m.updateIn(['a', 'b'], function (map) { return map.remove('c'); }).toJS()).toEqual({ a: { b: {} } });
    });
    it('deep set', function () {
        var m = I.fromJS({ a: { b: { c: 10 } } });
        expect(m.updateIn(['a', 'b'], function (map) { return map.set('d', 20); }).toJS()).toEqual({ a: { b: { c: 10, d: 20 } } });
    });
    it('deep push', function () {
        var m = I.fromJS({ a: { b: [1, 2, 3] } });
        expect(m.updateIn(['a', 'b'], function (list) { return list.push(4); }).toJS()).toEqual({ a: { b: [1, 2, 3, 4] } });
    });
    it('deep map', function () {
        var m = I.fromJS({ a: { b: [1, 2, 3] } });
        expect(m.updateIn(['a', 'b'], function (list) { return list.map(function (value) { return value * 10; }); }).toJS()).toEqual({ a: { b: [10, 20, 30] } });
    });
    it('creates new maps if path contains gaps', function () {
        var m = I.fromJS({ a: { b: { c: 10 } } });
        expect(m.updateIn(['a', 'z'], I.Map(), function (map) { return map.set('d', 20); }).toJS()).toEqual({ a: { b: { c: 10 }, z: { d: 20 } } });
    });
    it('throws if path cannot be set', function () {
        var m = I.fromJS({ a: { b: { c: 10 } } });
        expect(function () {
            m.updateIn(['a', 'b', 'c', 'd'], function (v) { return 20; }).toJS();
        }).toThrow();
    });
    it('updates self for empty path', function () {
        var m = I.fromJS({ a: 1, b: 2, c: 3 });
        expect(m.updateIn([], function (map) { return map.set('b', 20); }).toJS()).toEqual({ a: 1, b: 20, c: 3 });
    });
    it('does not perform edit when new value is the same as old value', function () {
        var m = I.fromJS({ a: { b: { c: 10 } } });
        var m2 = m.updateIn(['a', 'b', 'c'], function (id) { return id; });
        expect(m2).toBe(m);
    });
    it('does not perform edit when notSetValue is what you return from updater', function () {
        var m = I.Map();
        var spiedOnID;
        var m2 = m.updateIn(['a', 'b', 'c'], I.Set(), function (id) { return (spiedOnID = id); });
        expect(m2).toBe(m);
        expect(spiedOnID).toBe(I.Set());
    });
    it('provides default notSetValue of undefined', function () {
        var m = I.Map();
        var spiedOnID;
        var m2 = m.updateIn(['a', 'b', 'c'], function (id) { return (spiedOnID = id); });
        expect(m2).toBe(m);
        expect(spiedOnID).toBe(undefined);
    });
    describe('setIn', function () {
        it('provides shorthand for updateIn to set a single value', function () {
            var m = I.Map().setIn(['a', 'b', 'c'], 'X');
            expect(m.toJS()).toEqual({ a: { b: { c: 'X' } } });
        });
        it('accepts a list as a keyPath', function () {
            var m = I.Map().setIn(I.fromJS(['a', 'b', 'c']), 'X');
            expect(m.toJS()).toEqual({ a: { b: { c: 'X' } } });
        });
        it('returns value when setting empty path', function () {
            var m = I.Map();
            expect(m.setIn([], 'X')).toBe('X');
        });
        it('can setIn undefined', function () {
            var m = I.Map().setIn(['a', 'b', 'c'], undefined);
            expect(m.toJS()).toEqual({ a: { b: { c: undefined } } });
        });
    });
    describe('removeIn', function () {
        it('provides shorthand for updateIn to remove a single value', function () {
            var m = I.fromJS({ a: { b: { c: 'X', d: 'Y' } } });
            expect(m.removeIn(['a', 'b', 'c']).toJS()).toEqual({ a: { b: { d: 'Y' } } });
        });
        it('accepts a list as a keyPath', function () {
            var m = I.fromJS({ a: { b: { c: 'X', d: 'Y' } } });
            expect(m.removeIn(I.fromJS(['a', 'b', 'c'])).toJS()).toEqual({ a: { b: { d: 'Y' } } });
        });
        it('does not create empty maps for an unset path', function () {
            var m = I.Map();
            expect(m.removeIn(['a', 'b', 'c']).toJS()).toEqual({});
        });
        it('removes itself when removing empty path', function () {
            var m = I.Map();
            expect(m.removeIn([])).toBe(undefined);
        });
    });
    describe('mergeIn', function () {
        it('provides shorthand for updateIn to merge a nested value', function () {
            var m1 = I.fromJS({ x: { a: 1, b: 2, c: 3 } });
            var m2 = I.fromJS({ d: 10, b: 20, e: 30 });
            expect(m1.mergeIn(['x'], m2).toJS()).toEqual({ x: { a: 1, b: 20, c: 3, d: 10, e: 30 } });
        });
        it('accepts a list as a keyPath', function () {
            var m1 = I.fromJS({ x: { a: 1, b: 2, c: 3 } });
            var m2 = I.fromJS({ d: 10, b: 20, e: 30 });
            expect(m1.mergeIn(I.fromJS(['x']), m2).toJS()).toEqual({ x: { a: 1, b: 20, c: 3, d: 10, e: 30 } });
        });
        it('does not create empty maps for a no-op merge', function () {
            var m = I.Map();
            expect(m.mergeIn(['a', 'b', 'c'], I.Map()).toJS()).toEqual({});
        });
        it('merges into itself for empty path', function () {
            var m = I.Map({ a: 1, b: 2, c: 3 });
            expect(m.mergeIn([], I.Map({ d: 10, b: 20, e: 30 })).toJS()).toEqual({ a: 1, b: 20, c: 3, d: 10, e: 30 });
        });
    });
    describe('mergeDeepIn', function () {
        it('provides shorthand for updateIn to merge a nested value', function () {
            var m1 = I.fromJS({ x: { a: 1, b: 2, c: 3 } });
            var m2 = I.fromJS({ d: 10, b: 20, e: 30 });
            expect(m1.mergeDeepIn(['x'], m2).toJS()).toEqual({ x: { a: 1, b: 20, c: 3, d: 10, e: 30 } });
        });
        it('accepts a list as a keyPath', function () {
            var m1 = I.fromJS({ x: { a: 1, b: 2, c: 3 } });
            var m2 = I.fromJS({ d: 10, b: 20, e: 30 });
            expect(m1.mergeDeepIn(I.fromJS(['x']), m2).toJS()).toEqual({ x: { a: 1, b: 20, c: 3, d: 10, e: 30 } });
        });
        it('does not create empty maps for a no-op merge', function () {
            var m = I.Map();
            expect(m.mergeDeepIn(['a', 'b', 'c'], I.Map()).toJS()).toEqual({});
        });
        it('merges into itself for empty path', function () {
            var m = I.Map({ a: 1, b: 2, c: 3 });
            expect(m.mergeDeepIn([], I.Map({ d: 10, b: 20, e: 30 })).toJS()).toEqual({ a: 1, b: 20, c: 3, d: 10, e: 30 });
        });
    });
});
//# sourceMappingURL=updateIn.js.map