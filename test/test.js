if(typeof location === 'undefined'){
    // FIXME :: Do not work without DOM at new Image()
    var chai = require('chai');
    var geomapConfig = require('./geomap-config.js');
    var GeoMapping = require('../dist/GeoMapping.min.js');
}

const expect = chai.expect;

describe('API', function() {
    it('exist', function() {
        expect(GeoMapping).to.exist;
    });
    it('instantiate', function() {
        let _myTest = new GeoMapping(geomapConfig);
        expect(_myTest).to.exist;
    });
});

describe('Methods', function () {
    it('getPoints', function () {
        let _myTest = new GeoMapping(geomapConfig);
        return new Promise((resolve, reject) => {
            _myTest.on(GeoMapping.EVENTS.READY, function () {
                let points = _myTest.getPoints();
                expect(Object.keys(points).length).equal(3);
                resolve();
            });
        });
    });
    it('getPointById', function () {
        let _myTest = new GeoMapping(geomapConfig);
        return new Promise((resolve, reject) => {
            _myTest.on(GeoMapping.EVENTS.READY, function() {
                let point = _myTest.getPointById('Marseille');
                expect(point.id).equal("Marseille");
                expect(point.lat).equal(43.296482);
                expect(point.lng).equal(5.36978);
                expect(Math.floor(point.x)).equal(1448);
                expect(Math.floor(point.y)).equal(1593);
                resolve();
            });
        });
    });
    it('filterPointsByData', function () {
        let _myTest = new GeoMapping(geomapConfig);
        return new Promise((resolve, reject) => {
            _myTest.on(GeoMapping.EVENTS.READY, function() {
                let points = _myTest.filterPointsByData('test', 'findMe');
                expect(Object.keys(points).length).equal(2);
                let pointsIds = Object.values(points).map((_p)=>{return _p.id;});
                expect(pointsIds.indexOf('Rennes') !== -1).to.be.true;
                expect(pointsIds.indexOf('Strasbourg') !== -1).to.be.true;
                resolve();
            });
        });
    });
    it('addPoint', function () {
        let _myTest = new GeoMapping(geomapConfig);
        return new Promise((resolve, reject) => {
            _myTest.on(GeoMapping.EVENTS.READY, function() {
                _myTest.on(GeoMapping.EVENTS.ADD , function() {
                    expect(true).to.be.true;
                });
                _myTest.addPoint(48.856614, 2.3522219, "Paris", {
                    postal: 75000
                });
                let points = _myTest.getPoints();
                expect(Object.keys(points).length).equal(4);
                let point = _myTest.getPointById('Paris');
                expect(point.id).equal("Paris");
                expect(point.lat).equal(48.856614);
                expect(point.lng).equal(2.3522219);
                expect(Math.floor(point.x)).equal(1035);
                expect(Math.floor(point.y)).equal(494);
                resolve();
            });
        });
    });
    it('removePoint', function () {
        let _myTest = new GeoMapping(geomapConfig);
        return new Promise((resolve, reject) => {
            _myTest.on(GeoMapping.EVENTS.READY, function() {
                _myTest.on(GeoMapping.EVENTS.REMOVE , function() {
                    expect(true).to.be.true;
                });
                _myTest.removePoint("Marseille");
                let points = _myTest.getPoints();
                expect(Object.keys(points).length).equal(2);
                let pointsIds = Object.values(points).map((_p)=>{return _p.id;});
                expect(pointsIds.indexOf('Rennes') !== -1).to.be.true;
                expect(pointsIds.indexOf('Strasbourg') !== -1).to.be.true;
                expect(pointsIds.indexOf('Marseille') !== -1).to.be.false;
                resolve();
            });
        });
    });
    it('getLatLngOnMap', function () {
        let _myTest = new GeoMapping(geomapConfig);
        return new Promise((resolve, reject) => {
            _myTest.on(GeoMapping.EVENTS.READY, function() {
                let LatLng = _myTest.getLatLngOnMap(45, 475);
                expect(LatLng.lat).equal(48.94996261134864);
                expect(LatLng.lng).equal(-4.880353733894579);
                resolve();
            });
        });
    });
    it('getPointXYOnMap', function () {
        let _myTest = new GeoMapping(geomapConfig);
        return new Promise((resolve, reject) => {
            _myTest.on(GeoMapping.EVENTS.READY, function() {
                let LatLng = _myTest.getPointXYOnMap(48.94996261134864, -4.880353733894579);
                expect(Math.floor(LatLng.x)).equal(45);
                expect(Math.floor(LatLng.y)).equal(474);
                resolve();
            });
        });
    });
});

describe('Tracking GPS', function () {
    let _myTest = new GeoMapping(geomapConfig);
    it('trackPosition', function () {
        return new Promise((resolve, reject) => {
            _myTest.on(GeoMapping.EVENTS.UPDATE_POSITION , function() {
                expect(true).to.be.true;
                resolve();
            });
            _myTest.trackPosition((err) => {
                expect(true).to.be.false;
                reject();
            });
        });
    });
    it('stopTrackPosition', function () {
        return new Promise((resolve, reject) => {
            _myTest.on(GeoMapping.EVENTS.STOP_POSITION , function() {
                expect(true).to.be.true;
                resolve();
            });
            _myTest.stopTrackPosition();
        });
    });
});
