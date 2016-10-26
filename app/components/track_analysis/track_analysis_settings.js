(function () {
    'use strict';

    var trackAnalysisSettings = {
        // value break points for color interpolations:
        yellow_break: [ // 100% pure yellow break point;
            60, // speed
            6, // consumption
            15, // co2
            2000, // rpm
            44      // engine load
        ],
        red_break: [ // 100% pure red break point;
            130, // speed
            12, // consumption
            30, // co2
            3500, // rpm
            80     // engine load
        ],
        max_values: [ // 100% black break point;
            255, // speed
            25, // consumption
            45, // co2
            5000, // rpm
            110     // engine load
        ],
        errorColor: '#ff00ff'
    };
    
angular.module('enviroCar.track')
        .value('trackAnalysisSettings', trackAnalysisSettings);
})();