(function () {
    'use strict';

    function TrackChartCtrl($scope) {
        var renderArea;
        var chart;
        var data;
        nv.addGraph(function () {
            chart = nv.models.lineWithFocusChart();
            chart.brushExtent([2, 3]);
            chart.xAxis.tickFormat(d3.format(',f')).axisLabel("Stream - 3,128,.1");
            chart.x2Axis.tickFormat(d3.format(',f'));
            chart.yTickFormat(d3.format(',.2f'));
            chart.useInteractiveGuideline(true);
            chart.data = testData();
            d3.select('#chart1')
                    .datum(testData())
                    .call(chart);
            nv.utils.windowResize(chart.update);
            return chart;
        });

        function testData() {
            return stream_layers(3, 128, .1).map(function (data, i) {
                return {
                    key: 'Stream' + i,
                    area: i === 1,
                    values: data
                };
            });
        }
        
        function init() {
            /// init graph
            //randomizeFillOpacity();
        }

        $scope.attach = function (ra) {
            renderArea = ra;

            init();
        }


    }
    ;

    angular.module('enviroCar')
            .controller('TrackChartCtrl', TrackChartCtrl);
})();