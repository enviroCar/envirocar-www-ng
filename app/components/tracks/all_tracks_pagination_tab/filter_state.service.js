(function () {
    'use strict';

    function FilterStateService() {

        console.log("FilterStateService started.");

        var filterdata = {
            selectedTab: 1,
            filterOrder: [],
            distance: {
                name: 'distance',
                inUse: false,
                min: undefined,
                max: undefined
            },
            date: {
                name: 'date',
                inUse: false,
                min: undefined,
                max: undefined
            },
            duration: {
                name: 'duration',
                inUse: false,
                min: undefined,
                max: undefined
            },
            vehicle: {
                name: 'vehicle',
                inUse: false,
                all: [],
                set: []
            },
            spatial: {
                inUse: false,
                name: 'spatial',
                southwest: {
                    lat: undefined,
                    lng: undefined
                },
                northeast: {
                    lat: undefined,
                    lng: undefined
                },
                track_ids: []
            }
        };
        
        this.getFilterStateOrder = function(){
            return filterdata.filterOrder;
        };

        this.getFilterState = function(){
            return filterdata;
        };

        /**
         * returns the filterstate of the distance filter
         * @returns {filterdata.distance|filter_state_service_L1.FilterStateService.filterdata.distance}
         */
        this.getDistanceFilterState = function(){
            return filterdata.distance;
        };
        
        /**
         * returns the filterstate of the duration filter
         * @returns {filterdata.duration|filter_state_service_L1.FilterStateService.filterdata.duration}
         */
        this.getDurationFilterState = function(){
            return filterdata.duration;
        };
        
        /**
         *  returns the filterstate of the date filter
         * @returns {filterdata.date|filter_state_service_L1.FilterStateService.filterdata.date}
         */
        this.getDateFilterState = function(){
            return filterdata.date;
        };
        
        /**
         *  returns the filterstate of the vehicle filter
         * @returns {filter_state_service_L1.FilterStateService.filterdata.vehicle|filterdata.vehicle}
         */
        this.getVehicleFilterState = function(){
            return filterdata.vehicle;
        };
        
        /**
         *  returns the filterstate of the spatial filter
         * @returns {filter_state_service_L1.FilterStateService.filterdata.spatial|filterdata.spatial}
         */
        this.getSpatialFilterState = function(){
            return filterdata.spatial;
        };

        /**
         * 
         * @param {Boolean} inUse - inUse?
         * @param {number} minimum - minimum number
         * @param {number} maximum - maximum number
         * @returns {undefined}
         */
        this.setDistanceFilterState = function (inUse, minimum, maximum) {
            filterdata.distance.min = minimum;
            filterdata.distance.max = maximum;
            filterdata.distance.inUse = inUse;
        };

        /**
         * 
         * @param {Boolean} inUse - inUse?
         * @param {number} minimum - minimum number
         * @param {number} maximum - maximum number
         * @returns {undefined}
         */
        this.setDateFilterState = function (inUse, minimum, maximum) {
            filterdata.date.min = minimum;
            filterdata.date.max = maximum;
            filterdata.date.inUse = inUse;
        };

        /**
         * 
         * @param {Boolean} inUse - inUse?
         * @param {number} minimum - minimum number
         * @param {number} maximum - maximum number
         * @returns {undefined}
         */
        this.setDurationFilterState = function (inUse, minimum, maximum) {
            filterdata.duration.inUse = inUse;
            filterdata.duration.min = minimum;
            filterdata.duration.max = maximum;
        };

        /**
         * 
         * @param {type} inUse - inUse?
         * @param {type} all_cars - list of all cars
         * @param {type} checked_cars - list of all checked cars
         * @returns {undefined}
         */
        this.setVehicleFilterState = function (inUse, all_cars, checked_cars) {
            filterdata.vehicle.inUse = inUse;
            filterdata.vehicle.all = all_cars;
            filterdata.vehicle.set = checked_cars;
        };

        /**
         * 
         * @param {type} inUse - inUse?
         * @param {type} southwest_latitude - southwest_lat
         * @param {type} southwest_longitude - southwest_lon
         * @param {type} northeast_latitude - northeast_lat
         * @param {type} northeast_longitude - northeast_lon
         * @param {type} result_ids - list of result track id's
         * @returns {undefined}
         */
        this.setSpatialFilterState = function (
                inUse,
                southwest_latitude,
                southwest_longitude,
                northeast_latitude,
                northeast_longitude,
                result_ids) {
            filterdata.spatial.southwest.lat = southwest_latitude;
            filterdata.spatial.southwest.lng = southwest_longitude;
            filterdata.spatial.northeast.lat = northeast_latitude;
            filterdata.spatial.northeast.lng = northeast_longitude;
            filterdata.spatial.inUse = inUse;
            filterdata.spatial.track_ids = result_ids;
        };

        /**
         * 
         * @param {type} filterOrderList - list of inUse filters ordered by useradd
         * @returns {undefined}
         */
        this.setFilterStateOrder = function (filterOrderList) {
            filterdata.filterOrder = filterOrderList;
        };

        this.setFilterInUse = function(filtername, inUse){
            switch(filtername){
                case 'distance':
                    filterdata.distance.inUse = inUse;
                    break;
                case 'date':
                    filterdata.date.inUse = inUse;
                    break;
                case 'duration':
                    filterdata.duration.inUse = inUse;
                    break;
                case 'vehicle':
                    filterdata.vehicle.inUse = inUse;
                    break;
                case 'spatial':
                    filterdata.spatial.inUse = inUse;
                    break;
            }
        };

        /**
         * resets all filter states to initial values
         * @returns {undefined}
         */
        this.resetFilterStates = function () {
            filterdata = {
                selectedTab: 1,
                filterOrder: [],
                distance: {
                    name: 'distance',
                    inUse: false,
                    min: undefined,
                    max: undefined
                },
                date: {
                    name: 'date',
                    inUse: false,
                    min: undefined,
                    max: undefined
                },
                duration: {
                    name: 'duration',
                    inUse: false,
                    min: undefined,
                    max: undefined
                },
                vehicle: {
                    name: 'vehicle',
                    inUse: false,
                    all: [],
                    set: []
                },
                spatial: {
                    inUse: false,
                    name: 'spatial',
                    southwest: {
                        lat: undefined,
                        lng: undefined
                    },
                    northeast: {
                        lat: undefined,
                        lng: undefined
                    },
                    track_ids: []
                }
            };
        };


    }
    ;

    angular.module('enviroCar.tracks')
            .service('FilterStateService', FilterStateService);
})();
