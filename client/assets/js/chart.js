$(function() {
    var series = [];
    var years = [];
    var percYears = [];
    var metros = [];
    var cityData = [];
    var city = [];
    $.getJSON("https://open-data-demo.mtc.ca.gov/resource/xs98-vx7j.json?$order=year", function(data) {
        cityData = data;
        //Get unique cities and years
        $.each(cityData, function(key, val) {
            metros.push(val.metro);
            years.push(val.year);
            if (val.median_list_rent_ia_percentchg_2011) {
                percYears.push(val.year);
            }
        });
        metros = _.uniqBy(metros);
        years = _.uniqBy(years);
        percYears = _.uniqBy(percYears);
        console.log(percYears);

        //Build data series
        $.each(metros, function(key, val) {
            for (var index = 0; index < cityData.length; index++) {
                if (cityData[index].metro === val) {
                    city.push(Number(cityData[index].median_list_rent))
                }
            }
            series.push({
                name: val,
                data: city
            });
            city = [];
        });


        Highcharts.chart('container', {
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: years
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                seriesuffix: '°C'
            },
            legend: {
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: series
        });

    });

});