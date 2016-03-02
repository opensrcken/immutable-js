///<reference path='../resources/jest.d.ts'/>
jest.autoMockOff();
var jasmineCheck = require('jasmine-check');
jasmineCheck.install();
var Immutable = require('immutable');
var Map = Immutable.Map;
var OrderedMap = Immutable.OrderedMap;
var List = Immutable.List;
describe('Conversion', function () {
    beforeEach(function () {
        this.addMatchers({
            is: function (expected) {
                return Immutable.is(this.actual, expected);
            }
        });
    });
    // Note: order of keys based on Map's hashing order
    var js = {
        deepList: [
            {
                position: "first"
            },
            {
                position: "second"
            },
            {
                position: "third"
            },
        ],
        deepMap: {
            a: "A",
            b: "B"
        },
        emptyMap: Object.create(null),
        point: { x: 10, y: 20 },
        string: "Hello",
        list: [1, 2, 3]
    };
    var Point = Immutable.Record({ x: 0, y: 0 }, 'Point');
    var immutableData = Map({
        deepList: List.of(Map({
            position: "first"
        }), Map({
            position: "second"
        }), Map({
            position: "third"
        })),
        deepMap: Map({
            a: "A",
            b: "B"
        }),
        emptyMap: Map(),
        point: Map({ x: 10, y: 20 }),
        string: "Hello",
        list: List.of(1, 2, 3)
    });
    var immutableOrderedData = OrderedMap({
        deepList: List.of(OrderedMap({
            position: "first"
        }), OrderedMap({
            position: "second"
        }), OrderedMap({
            position: "third"
        })),
        deepMap: OrderedMap({
            a: "A",
            b: "B"
        }),
        emptyMap: OrderedMap(),
        point: new Point({ x: 10, y: 20 }),
        string: "Hello",
        list: List.of(1, 2, 3)
    });
    var immutableOrderedDataString = 'OrderedMap { ' +
        '"deepList": List [ ' +
        'OrderedMap { ' +
        '"position": "first"' +
        ' }, ' +
        'OrderedMap { ' +
        '"position": "second"' +
        ' }, ' +
        'OrderedMap { ' +
        '"position": "third"' +
        ' }' +
        ' ], ' +
        '"deepMap": OrderedMap { ' +
        '"a": "A", ' +
        '"b": "B"' +
        ' }, ' +
        '"emptyMap": OrderedMap {}, ' +
        '"point": Point { "x": 10, "y": 20 }, ' +
        '"string": "Hello", ' +
        '"list": List [ 1, 2, 3 ]' +
        ' }';
    var nonStringKeyMap = OrderedMap().set(1, true).set(false, "foo");
    var nonStringKeyMapString = 'OrderedMap { 1: true, false: "foo" }';
    it('Converts deep JS to deep immutable sequences', function () {
        expect(Immutable.fromJS(js)).is(immutableData);
    });
    it('Converts deep JSON with custom conversion', function () {
        var seq = Immutable.fromJS(js, function (key, sequence) {
            if (key === 'point') {
                return new Point(sequence);
            }
            return Array.isArray(this[key]) ? sequence.toList() : sequence.toOrderedMap();
        });
        expect(seq).is(immutableOrderedData);
        expect(seq.toString()).is(immutableOrderedDataString);
    });
    it('Prints keys as JSON values', function () {
        expect(nonStringKeyMap.toString()).is(nonStringKeyMapString);
    });
    it('Converts deep sequences to JSON', function () {
        var json = immutableData.toJS();
        expect(json).not.is(js); // raw JS is not immutable.
        expect(json).toEqual(js); // but should be deep equal.
    });
    it('JSON.stringify() works equivalently on immutable sequences', function () {
        expect(JSON.stringify(js)).toBe(JSON.stringify(immutableData));
    });
    it('JSON.stringify() respects toJSON methods on values', function () {
        var Model = Immutable.Record({});
        Model.prototype.toJSON = function () { return 'model'; };
        expect(Immutable.Map({ a: new Model() }).toJS()).toEqual({ "a": {} });
        expect(JSON.stringify(Immutable.Map({ a: new Model() }))).toEqual('{"a":"model"}');
    });
    it('is conservative with array-likes, only accepting true Arrays.', function () {
        expect(Immutable.fromJS({ 1: 2, length: 3 })).is(Immutable.Map().set('1', 2).set('length', 3));
        expect(Immutable.fromJS('string')).toEqual('string');
    });
    check.it('toJS isomorphic value', { maxSize: 30 }, [gen.JSONValue], function (js) {
        var imm = Immutable.fromJS(js);
        expect(imm && imm.toJS ? imm.toJS() : imm).toEqual(js);
    });
});
//# sourceMappingURL=Conversion.js.map