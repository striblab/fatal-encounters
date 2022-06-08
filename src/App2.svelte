<script>

      //https://svelte.dev/repl/d7e00ca4868e44358553010d7291db65?version=3.48.0
      
	import { onMount } from 'svelte';
	import * as jq from 'jquery';
	import * as d3 from 'd3';
      import * as c3 from 'c3';
      import * as _ from 'underscore';

      let raceF = ["","White","Black","Asian","Native American","Hispanic","Multiracial"];
      let genderF = ["","Male","Female","Other"];
      let mannerF = ["","Homicide","Suicide","Accidental","Natural Causes","NA"];
      let locationF = ["","Minneapolis","St. Paul","Metro Suburbs","Greater Minnesota"];
      let weaponF = ["","Gun","Bladed","Other","Unarmed"];
      raceF[99] = "All";
      genderF[99] = "All";
      mannerF[99] = "All";
      locationF[99] = "All";
      weaponF[99] = "All";

	function getData(callback) {
		var dataLoad = "default";
		jq.getJSON('https://googlescript.startribune.com/?macro=AKfycbw_cqdXZADky_zHS3pi9aBL2S3-514vlxJkcnv5TJ1z9sxCqPY&id=1T-Du1geFfuspEYGF_U0531mLTJ0ehbA5YbaFCxgmkRA&sheet=mn_shootings', function (jsonData) {
			dataLoad = jsonData;
			callback(jsonData);
		});
	}

	function cardSpill(data) {
            jq("#bigNum").text(data.mn_shootings.length);
            
           var nodes = d3.select('#cards')
                  .selectAll('.card')
                  .data(data.mn_shootings)
                  .enter()
                  .append('div')
                  .attr('id', function(d) {
                        return d.doch;
                  })
                  .attr('class', 'card')
                  .html(function(d) { 
                        var img = "https://chorus.stimg.co/";
                        if (d.photoSource == 2) {
                              img = "img/";
                        }
                        return "<div class='leftSide'>" +
                        "<div class='photos'><img width='150' src='" + img + d.photo + "' rel='photo' alt='photo' />" + 
                        "</div><div class='rightSide'>" + 
                        "<div class='name'>" + d.FirstName + " " + d.LastName + "</div>" +
                        "<div class='date'>Died " + d3.timeFormat("%B %e, %Y")(new Date(d.DeathDate)) + "</div>" +
                        "<div class='vitals'>" + d.Race + " " + d.Gender + ", " + d.AgeYears + "</div>" + 
                        "<div>" + d.InjuryCity + " | " + d.Region + "</div>" +
                        "<div>Agencies involved: " + d.Agency + "</div>" +
                        "<div class='narrative'>" + d.StribNarrative + "</div>" + 
                        "</div>" +
                        "<div class='readmore'><a href='" + d.URL + "'>Read more coverage</div>";
            });

            return nodes;
	}

	function search(filterbox) {
                  jq(this).attr('placeholder', 'Search list of all deaths by name, year or keyword');
                  jq('.card').hide();
                  var txt = jq(filterbox).val();
                  jq('.card').each(function() {
                     if (jq(this).text().toUpperCase() .indexOf(txt.toUpperCase()) != -1) {
                          jq(this).show();
                     }
                  });
                  var count = jq('.card:visible').length;
                  jq('.results').html(count);
	}

	function filterToggle(i, nodes, data) {

            console.log(nodes);
            
            var rfilter = raceF[i];
            var gfilter = genderF[i];
            var mfilter = mannerF[i];         
            var lfilter = locationF[i];
            var wfilter = weaponF[i];  
            
            /*** jq('.card').hide();
            var txt = rfilter;
            jq('.vitals').each(function() {
                  if (jq(this).text().toUpperCase().indexOf(txt.toUpperCase()) != -1) {
                          jq(this).parent().parent().parent().show();
                     }
                  });
            var count = jq('.card:visible').length;
            var percentage = d3.format("0.0%")(count / jq('.card').length);
            jq('.results').html(count + " (" + percentage + ")"); ***/

            d3.select('#cards')
                  .selectAll('.card')
                  .remove()
                  .exit();

           var nodes = d3.select('#cards')
                  .selectAll('.card')
                  .data(data.mn_shootings.filter(function(d) { 
                        return d.Race == rfilter
                  }))
                  .enter()
                  //.transition()
                  .append('div')
                  .attr('id', function(d) {
                        return d.doch;
                  })
                  .attr('class', 'card')
                  .html(function(d) { 
                        var img = "https://chorus.stimg.co/";
                        if (d.photoSource == 2) {
                              img = "img/";
                        }
                        return "<div class='leftSide'>" +
                        "<div class='photos'><img width='150' src='" + img + d.photo + "' rel='photo' alt='photo' />" + 
                        "</div><div class='rightSide'>" + 
                        "<div class='name'>" + d.FirstName + " " + d.LastName + "</div>" +
                        "<div class='date'>Died " + d3.timeFormat("%B %e, %Y")(new Date(d.DeathDate)) + "</div>" +
                        "<div class='vitals'>" + d.Race + " " + d.Gender + ", " + d.AgeYears + "</div>" + 
                        "<div>" + d.InjuryCity + " | " + d.Region + "</div>" +
                        "<div>Agencies involved: " + d.Agency + "</div>" +
                        "<div class='narrative'>" + d.StribNarrative + "</div>" + 
                        "</div>" +
                        "<div class='readmore'><a href='" + d.URL + "'>Read more coverage</div>";
            });

          
	}

      function buildChart(data) {
            var dataShootings = data.mn_shootings;

            console.log(data.mn_shootings);

            var padding = {
                  top: 20,
                  right: 40,
                  bottom: 20,
                  left: 40
            };

            var sortedYears = _.sortBy(_.uniq(_.map(dataShootings, d => parseInt(d.year, 10))));
            var countsByYears = _.map(_.sortBy(_.groupBy(dataShootings, d => parseInt(d.year, 10)),(d, di) => di), 'length');

            /** https://c3js.org/samples/chart_scatter.html
            var axisLong = ['x'];
            var incidents = ['Incident'];
            var k = 0;
            var yearCheck = 2022;
            var namesMap = {};

             * for (var i=0; i < dataShootings.length; i++){
                  if (dataShootings[i].Year != yearCheck) {
                        yearCheck--;
                        k = 0
                  }
                  axisLong.concat(dataShootings[i].Year);
                  incidents.concat(k + 1);
                  namesMap[axisLong[i]] = incidents[i];
             * }
             * 
             * 
             **/

            var chartCounts = c3.generate({
                  bindto: '#chart',
                  padding: padding,
                        data: {
                              x: 'x',
                              columns: [
                                    ['x'].concat(sortedYears),
                                    ['Incident'].concat(countsByYears)
                              ],
                              type: 'bar',
                              labels: {
                              format: {
                                    Incident: d3.format(',.0f')
                              }
                              }
                        },
                        tooltip: { show: false },
                        legend: { show: false },
                        color: { pattern: ['#b75b60'] },
                        axis: { rotated: true,
                        y: {
                              max: 20,
                              min: 0,
                              padding: {
                                    bottom: 0,
                                    top: 0
                              },
                              tick: {
                                    count: 4,
                                    values: [0, 10, 20, 30],
                                    format: d3.format(',.0f')
                              }
                        },
                        x: {
                              tick: {
                                    count: sortedYears.length,
                                    values: sortedYears,
                                    format: d3.format('.0f')
                              }
                        }
                  }
            });
      }

	onMount(() => {
        getData(function(data) {
 			 console.log(data);
                   cardSpill(data);
                   buildChart(data);
                  jq('select').change(function() {
                        filterToggle(jq(this).val(), cardSpill(data), data);
                  });
		});

            jq('#filter_box').keyup(function(i) {      
                  search(this);
            });

    });
</script>

<div id="count">
	<div id="bigNum">0</div>
	<div id="deathLabel">deaths since 2000</div>
</div>

<div id="chart"></div>

<div id="map"></div>

<div id="filters">
      <div class="custom-select" id="rfilter">
            <select>
            <option class="select" value="99">All races</option>
            <option class="select" value="0">White</option>
            <option class="select" value="1">Black</option>
            <option class="select" value="2">Asian</option>
            <option class="select" value="3">Native American</option>
            <option class="select" value="4">Hispanic</option>
            <option class="select" value="5">Multiracial</option>
            </select>
      </div>
      <div class="custom-select" id="gfilter">
            <select>
            <option class="select" value="99">All genders</option>
            <option class="select" value="0">Male</option>
            <option class="select" value="1">Female</option>
            <option class="select" value="2">Other</option>
            </select>
      </div>
      <div class="custom-select" id="mfilter">
            <select>
            <option class="select" value="99">All causes</option>
            <option class="select" value="0">Homicide</option>
            <option class="select" value="1">Suicide</option>
            <option class="select" value="2">Accidental Death</option>
            <option class="select" value="3">Natural Causes</option>
            <option class="select" value="4">NA</option>
            </select>
      </div>
      <div class="custom-select" id="lfilter">
            <select>
            <option class="select" value="99">All locations</option>
            <option class="select" value="0">Minneapolis</option>
            <option class="select" value="1">St. Paul</option>
            <option class="select" value="2">Metro Suburbs</option>
            <option class="select" value="3">Greater Minnesota</option>
            </select>
      </div>
      <div class="custom-select" id="wfilter">
            <select>
            <option class="select" value="99">All weapons</option>
            <option class="select" value="0">Gun</option>
            <option class="select" value="1">Bladed</option>
            <option class="select" value="2">Other</option>
            <option class="select" value="3">Unarmed</option>
            </select>
      </div>
</div>

<div id="search">
      <div id="resultBar"><span>Results: </span> <span class="results"></span></div>

      <div class="smallerBreak"></div>

      <div id="filter"><input type="search" id="filter_box" placeholder="Search list of all deaths by name, year or keyword" /></div>
</div>

<div id="cards"></div>

<div class="dataline">
    <div>Map: Jeff Hargarten, Star Tribune • Source: Minneapolis Police Department</div>
</div>