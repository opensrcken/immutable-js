///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var Immutable = require('immutable');
describe('IterableSequence', function () {
    it('creates a sequence from an iterable', function () {
        var i = new SimpleIterable();
        var s = Immutable.Seq(i);
        expect(s.take(5).toArray()).toEqual([0, 1, 2, 3, 4]);
    });
    it('is stable', function () {
        var i = new SimpleIterable();
        var s = Immutable.Seq(i);
        expect(s.take(5).toArray()).toEqual([0, 1, 2, 3, 4]);
        expect(s.take(5).toArray()).toEqual([0, 1, 2, 3, 4]);
        expect(s.take(5).toArray()).toEqual([0, 1, 2, 3, 4]);
    });
    it('counts iterations', function () {
        var i = new SimpleIterable(10);
        var s = Immutable.Seq(i);
        expect(s.forEach(function (x) { return x; })).toEqual(10);
        expect(s.take(5).forEach(function (x) { return x; })).toEqual(5);
        expect(s.forEach(function (x) { return x < 3; })).toEqual(4);
    });
    it('creates a new iterator on every operations', function () {
        var mockFn = jest.genMockFunction();
        var i = new SimpleIterable(3, mockFn);
        var s = Immutable.Seq(i);
        expect(s.toArray()).toEqual([0, 1, 2]);
        expect(mockFn.mock.calls).toEqual([[0], [1], [2]]);
        // The iterator is recreated for the second time.
        expect(s.toArray()).toEqual([0, 1, 2]);
        expect(mockFn.mock.calls).toEqual([[0], [1], [2], [0], [1], [2]]);
    });
    it('can be iterated', function () {
        var mockFn = jest.genMockFunction();
        var i = new SimpleIterable(3, mockFn);
        var seq = Immutable.Seq(i);
        var entries = seq.entries();
        expect(entries.next()).toEqual({ value: [0, 0], done: false });
        // The iteration is lazy
        expect(mockFn.mock.calls).toEqual([[0]]);
        expect(entries.next()).toEqual({ value: [1, 1], done: false });
        expect(entries.next()).toEqual({ value: [2, 2], done: false });
        expect(entries.next()).toEqual({ value: undefined, done: true });
        expect(mockFn.mock.calls).toEqual([[0], [1], [2]]);
        // The iterator is recreated for the second time.
        entries = seq.entries();
        expect(entries.next()).toEqual({ value: [0, 0], done: false });
        expect(entries.next()).toEqual({ value: [1, 1], done: false });
        expect(entries.next()).toEqual({ value: [2, 2], done: false });
        expect(entries.next()).toEqual({ value: undefined, done: true });
        expect(mockFn.mock.calls).toEqual([[0], [1], [2], [0], [1], [2]]);
    });
    it('can be mapped and filtered', function () {
        var mockFn = jest.genMockFunction();
        var i = new SimpleIterable(undefined, mockFn); // infinite
        var seq = Immutable.Seq(i)
            .filter(function (x) { return x % 2 === 1; })
            .map(function (x) { return x * x; });
        var entries = seq.entries();
        expect(entries.next()).toEqual({ value: [0, 1], done: false });
        expect(entries.next()).toEqual({ value: [1, 9], done: false });
        expect(entries.next()).toEqual({ value: [2, 25], done: false });
        expect(mockFn.mock.calls).toEqual([[0], [1], [2], [3], [4], [5]]);
    });
    describe('IteratorSequence', function () {
        it('creates a sequence from a raw iterable', function () {
            var i = new SimpleIterable(10);
            var s = Immutable.Seq(i[ITERATOR_SYMBOL]());
            expect(s.take(5).toArray()).toEqual([0, 1, 2, 3, 4]);
        });
        it('is stable', function () {
            var i = new SimpleIterable(10);
            var s = Immutable.Seq(i[ITERATOR_SYMBOL]());
            expect(s.take(5).toArray()).toEqual([0, 1, 2, 3, 4]);
            expect(s.take(5).toArray()).toEqual([0, 1, 2, 3, 4]);
            expect(s.take(5).toArray()).toEqual([0, 1, 2, 3, 4]);
        });
        it('counts iterations', function () {
            var i = new SimpleIterable(10);
            var s = Immutable.Seq(i[ITERATOR_SYMBOL]());
            expect(s.forEach(function (x) { return x; })).toEqual(10);
            expect(s.take(5).forEach(function (x) { return x; })).toEqual(5);
            expect(s.forEach(function (x) { return x < 3; })).toEqual(4);
        });
        it('memoizes the iterator', function () {
            var mockFn = jest.genMockFunction();
            var i = new SimpleIterable(10, mockFn);
            var s = Immutable.Seq(i[ITERATOR_SYMBOL]());
            expect(s.take(3).toArray()).toEqual([0, 1, 2]);
            expect(mockFn.mock.calls).toEqual([[0], [1], [2]]);
            // Second call uses memoized values
            expect(s.take(3).toArray()).toEqual([0, 1, 2]);
            expect(mockFn.mock.calls).toEqual([[0], [1], [2]]);
            // Further ahead in the iterator yields more results.
            expect(s.take(5).toArray()).toEqual([0, 1, 2, 3, 4]);
            expect(mockFn.mock.calls).toEqual([[0], [1], [2], [3], [4]]);
        });
        it('can be iterated', function () {
            var mockFn = jest.genMockFunction();
            var i = new SimpleIterable(3, mockFn);
            var seq = Immutable.Seq(i[ITERATOR_SYMBOL]());
            var entries = seq.entries();
            expect(entries.next()).toEqual({ value: [0, 0], done: false });
            // The iteration is lazy
            expect(mockFn.mock.calls).toEqual([[0]]);
            expect(entries.next()).toEqual({ value: [1, 1], done: false });
            expect(entries.next()).toEqual({ value: [2, 2], done: false });
            expect(entries.next()).toEqual({ value: undefined, done: true });
            expect(mockFn.mock.calls).toEqual([[0], [1], [2]]);
            // The iterator has been memoized for the second time.
            entries = seq.entries();
            expect(entries.next()).toEqual({ value: [0, 0], done: false });
            expect(entries.next()).toEqual({ value: [1, 1], done: false });
            expect(entries.next()).toEqual({ value: [2, 2], done: false });
            expect(entries.next()).toEqual({ value: undefined, done: true });
            expect(mockFn.mock.calls).toEqual([[0], [1], [2]]);
        });
        it('can iterate an skipped seq based on an iterator', function () {
            var i = new SimpleIterable(4);
            var seq = Immutable.Seq(i[ITERATOR_SYMBOL]());
            expect(seq.size).toBe(undefined);
            var skipped = seq.skip(2);
            expect(skipped.size).toBe(undefined);
            var iter = skipped[ITERATOR_SYMBOL]();
            // The first two were skipped
            expect(iter.next()).toEqual({ value: 2, done: false });
            expect(iter.next()).toEqual({ value: 3, done: false });
            expect(iter.next()).toEqual({ value: undefined, done: true });
        });
    });
});
// Helper for this test
var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator || '@@iterator';
function SimpleIterable(max, watcher) {
    this.max = max;
    this.watcher = watcher;
}
SimpleIterable.prototype[ITERATOR_SYMBOL] = function () {
    return new SimpleIterator(this);
};
function SimpleIterator(iterable) {
    this.iterable = iterable;
    this.value = 0;
}
SimpleIterator.prototype.next = function () {
    if (this.value >= this.iterable.max) {
        return { value: undefined, done: true };
    }
    this.iterable.watcher && this.iterable.watcher(this.value);
    return { value: this.value++, done: false };
};
SimpleIterator.prototype[ITERATOR_SYMBOL] = function () {
    return this;
};
//# sourceMappingURL=IterableSeq.js.map