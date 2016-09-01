(function() {
    'use strict';

    function navService($q, $translate) {
        var dashboard;
        var tracks;
        var table;
        var segment;
        var tooltip_db;
        var tooltip_tracks;
        var tooltip_table;
        var tooltip_segment;
        $translate(['DASHBOARD', 'TRACKS', 'TABLE', 'SEGMENT', 
            'TT_SN_DASHBOARD_OPEN', 'TT_SN_TRACKS_OPEN', 
            'TT_SN_PROFILE_OPEN', 'TT_SN_SEGMENT_OPEN' ]).then(function(translations) {
            dashboard = 'DASHBOARD';
            tracks = 'TRACKS';
            table = 'TABLE';
            segment = 'SEGMENT';
            tooltip_db = 'TT_SN_DASHBOARD_OPEN';
            tooltip_tracks = 'TT_SN_TRACKS_OPEN';
            tooltip_table = 'TT_SN_PROFILE_OPEN';
            tooltip_segment = 'TT_SN_SEGMENT_OPEN';
        });
        var menuItems = [{
            name: 'DASHBOARD',
            icon: 'dashboard',
            sref: '.dashboard',
            tooltip: 'TT_SN_DASHBOARD_OPEN'
        }, {
            name: 'TRACKS',
            icon: 'directions_car',
            sref: '.tracks',
            tooltip: 'TT_SN_TRACKS_OPEN'
        }, {
            name: 'TABLE',
            icon: 'person',
            sref: '.table',
            tooltip: 'TT_SN_PROFILE_OPEN'
        }, {
            name: 'SEGMENT',
            icon: 'pie_chart',
            sref:  '.segment',
            tooltip: 'TT_SN_SEGMENT_OPEN'
        }];

        console.log(menuItems);
        return {
            loadAllItems: function() {
                return $q.when(menuItems);
            }
        };
    }

    angular.module('enviroCar')
        .service('navService', [
            '$q', 
            '$translate',
            navService
    ]);

})();
