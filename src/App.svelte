<script>
	import { onMount } from 'svelte';
	import * as jq from 'jquery';
	import * as d3 from 'd3';
      import * as c3 from 'c3';
	import * as _ from 'underscore';
      import tooltip from 'svelte-tooltip-action';

      import MapMain from './Map.svelte';
      import Search from './Search.svelte';

    var sortedYears;
    var countsByYears;
    var sortedRace;
    var countsByRace;
    var datalength;
    var dataShootings;

	function buildChart(data) {
            dataShootings = data;

            var padding = {
                  top: 20,
                  right: 40,
                  bottom: 20,
                  left: 40
            };

            sortedYears = _.sortBy(_.uniq(_.map(dataShootings, d => parseInt(d.year, 10))));
            countsByYears = _.map(_.sortBy(_.groupBy(dataShootings, d => parseInt(d.year, 10)),(d, di) => di), 'length');

            sortedRace = _.sortBy(_.uniq(_.map(dataShootings, d => d.Race, 10)));
            countsByRace = _.map(_.sortBy(_.groupBy(dataShootings, d => d.Race),(d, di) => di), 'length');

            datalength = dataShootings.length;

            jq("#wcount").html(countsByRace[6]);
            jq("#wstat").html(d3.format(".0%")(countsByRace[6] / datalength));

            jq("#bcount").html(countsByRace[2]);
            jq("#bstat").html(d3.format(".0%")(countsByRace[2] / datalength));

            jq("#hcount").html(countsByRace[3]);
            jq("#hstat").html(d3.format(".0%")(countsByRace[3] / datalength));

            jq("#ncount").html(countsByRace[0]);
            jq("#nstat").html(d3.format(".0%")(countsByRace[0] / datalength));

            jq("#acount").html(countsByRace[1]);
            jq("#astat").html(d3.format(".0%")(countsByRace[1] / datalength));

            jq("#ocount").html(countsByRace[4]);
            jq("#ostat").html(d3.format(".0%")(countsByRace[4] / datalength));

            var chartCounts = c3.generate({
                  bindto: '#mchart',
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


 async function getDeaths() {
    let response = await fetch("https://googlescript.startribune.com/?macro=AKfycbw_cqdXZADky_zHS3pi9aBL2S3-514vlxJkcnv5TJ1z9sxCqPY&id=1T-Du1geFfuspEYGF_U0531mLTJ0ehbA5YbaFCxgmkRA&sheet=mn_shootings");
    let deaths = await response.json();
	let cards = deaths.mn_shootings;
	jq("#bigNum").text(cards.length);
	buildChart(cards);

      console.log(cards);
    
    return cards;
  }

  const promise = getDeaths();

  //TRIGGER CARD EXPANSION AND RETRACTION
  let clicked = [];
  let hidden = Array.apply(null, Array(300)).map(function() { return 'hidden' });
  let show = Array.apply(null, Array(300)).map(function() { return '' });

  function clickspand(i){
      clicked[i] = 'cardspand';
      hidden[i] = '';
      show[i] = 'hidden';
      document.getElementById("card" + i).scrollIntoView();
  }
  function closespand(i){
      clicked[i] = '';
      hidden[i] = 'hidden';
      show[i] = '';
      document.getElementById("card" + i).scrollIntoView();
  }

  let active = {button1: false, button2: false, button3: false};

  function vizToggle(id) {
      document.getElementsByClassName('viz')[0].style.display='none';
      document.getElementsByClassName('viz')[1].style.display='none';
      document.getElementsByClassName('viz')[2].style.display='none';
      document.getElementsByClassName('viz')[3].style.display='none';
      document.getElementsByClassName('viz')[id].style.display='block';
  }

  const style = 'margin-top:20px;';

  let searchTerm = '';

  function search(filterbox) {
            jq(this).attr('placeholder', 'Search list of all deaths by name, year or keyword');
            jq('.card').hide();
            var txt = filterbox;
            jq('.card').each(function() {
                  if (jq(this).text().toUpperCase() .indexOf(txt.toUpperCase()) != -1) {
                          jq(this).show();
                  }
            });
            var count = jq('.card:visible').length;
            jq('.results').html(count + "(" + Math.round((count / Number(jq("#bigNum").text())) * 100) + "%)");
   }


   function rFilter(term) {
            jq('.card').hide();
            var txt = term;
            jq('.race').each(function() {
                  if (jq(this).text().toUpperCase().indexOf(txt.toUpperCase()) != -1) {
                          jq(this).parent().parent().parent().show();
                  }
            });
            var count = jq('.card:visible').length;
            jq('.results').html(count + "(" + Math.round((count / Number(jq("#bigNum").text())) * 100) + "%)");
   }

   function gFilter(term) {
            jq('.card').hide();
            var txt = term;
            jq('.gender').each(function() {
                  if (jq(this).text().toUpperCase() == txt.toUpperCase()) {
                          jq(this).parent().parent().parent().show();
                  }
            });
            var count = jq('.card:visible').length;
            jq('.results').html(count + "(" + Math.round((count / Number(jq("#bigNum").text())) * 100) + "%)"); 
   }

   function cFilter(term) {
            jq('.card').hide();
            var txt = term;
            jq('.card').each(function() {
                  if (jq(this).text().toUpperCase() .indexOf(txt.toUpperCase()) != -1) {
                          jq(this).show();
                  }
            });
            var count = jq('.card:visible').length;
            jq('.results').html(count + "(" + Math.round((count / Number(jq("#bigNum").text())) * 100) + "%)");
   }

   function lFilter(term) {
            jq('.card').hide();
            var txt = term;
            jq('.region').each(function() {
                  if (jq(this).text().toUpperCase() == txt.toUpperCase()) {
                          jq(this).parent().parent().parent().show();
                  }
            });
            var count = jq('.card:visible').length;
            jq('.results').html(count + "(" + Math.round((count / Number(jq("#bigNum").text())) * 100) + "%)");
   }

   function wFilter(term) {
            jq('.card').hide();
            var txt = term;
            jq('.weapon').each(function() {
                  if (jq(this).text().toUpperCase() == txt.toUpperCase()) {
                          jq(this).parent().parent().parent().show();
                  }
            });
            var count = jq('.card:visible').length;
            jq('.results').html(count + "(" + Math.round((count / Number(jq("#bigNum").text())) * 100) + "%)");
   }

//https://svelte.dev/repl/e67e1a90ef3945ec988bf39f6a10b6b3?version=3.32.3

onMount(() => {


    jq('#filter_box').keyup(function(i) {   
          var term = jq(this).val();   
            search(term);
      });
});
	
</script>

<div id="count">
	<div id="bigNum">0</div>
	<div id="deathLabel">deaths since 2000</div>
</div>

<div id="vizbuttons">
      <button class="vizToggle" on:click={() => vizToggle(0)}>Trend</button>
      <button class="vizToggle" on:click={() => vizToggle(1)}>Filters</button>
      <button class="vizToggle" on:click={() => vizToggle(2)}>Map</button>
</div>
<div id="vizbox">
      <div id="chart" class="viz">
            {#await promise}
                  <p>Loading...</p>
            {:then d}
                  {#each sortedYears as y, yearIndex}
                  <div class='year'><span class="ylabel">{sortedYears[yearIndex]}</span>
                        {#each [...d].reverse() as d}
                              {#if d.year == sortedYears[yearIndex]}
                                    <span class="block" name="{d.FirstName} {d.LastName}" race="{d.Race}" weapon="{d.WeaponCategory}" region="{d.Region}" gender="{d.Gender}" manner="{d.MannerDeath}" on:click={() => clickspand(d.index)} use:tooltip={{ text: d.FirstName + " " + d.LastName, style: style }}></span>
                              {/if}
                        {/each}
                  </div>
                  {/each}
            {:catch error}
                  <p style="color: red">{error.message}</p>
            {/await}
            </div>
            <div id="stats" class="viz">
                  <div class="minichart" on:click={() => rFilter('white')}>
                        <div class="miniTitle">White: <span class="countstat" id="wcount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="wstat"></span> of police-involved deaths</div>
                        <div class="mnlabel">79% of Minnesota residents</div>
                  </div>
                  <div class="minichart" on:click={() => rFilter('black')}>
                        <div class="miniTitle">Black: <span class="countstat"  id="bcount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="bstat"></span> of police-involved deaths</div>
                        <div class="mnlabel">7% of Minnesota residents</div>
                  </div>
                  <div class="minichart" on:click={() => rFilter('hispanic')}>
                        <div class="miniTitle">Hispanic: <span class="countstat"  id="hcount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="hstat"></span> of police-involved deaths</div>
                        <div class="mnlabel">6% of Minnesota residents</div>
                  </div>
                  <div class="minichart" on:click={() => rFilter('american indian')}>
                        <div class="miniTitle">Native American: <span class="countstat"  id="ncount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="nstat"></span> of police-involved deaths</div>
                        <div class="mnlabel">1% of Minnesota residents</div>
                  </div>
                  <div class="minichart" on:click={() => rFilter('asian')}>
                        <div class="miniTitle">Asian: <span class="countstat" id="acount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="astat"></span> of police-involved deaths</div>
                        <div class="mnlabel">5% of Minnesota residents</div>
                  </div>
                  <div class="minichart" on:click={() => rFilter('multi')}>
                        <div class="miniTitle">Others: <span class="countstat" id="other"></span></div>
                        <div class="statlabel"><span class="pctstat" id="ostat"></span> of police-involved deaths</div>
                        <div class="mnlabel">3% of Minnesota residents</div>
                  </div>


                  <div class="minichart" on:click={() => gFilter('male')}>
                        <div class="miniTitle">Male: <span class="countstat" id="male"></span></div>
                        <div class="statlabel"><span class="pctstat" id="astat"></span> of police-involved deaths</div>
                  </div>
                  <div class="minichart" on:click={() => gFilter('female')}>
                        <div class="miniTitle">Female: <span class="countstat" id="female"></span></div>
                        <div class="statlabel"><span class="pctstat" id="ostat"></span> of police-involved deaths</div>
                  </div>


                  <div class="minichart" on:click={() => lFilter('minneapolis')}>
                        <div class="miniTitle">Minneapolis: <span class="countstat" id="mcount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="astat"></span> of police-involved deaths</div>
                        <div class="mnlabel">5% of Minnesota residents</div>
                  </div>
                  <div class="minichart" on:click={() => lFilter('st. paul')}>
                        <div class="miniTitle">St. Paul: <span class="countstat" id="spcount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="ostat"></span> of police-involved deaths</div>
                        <div class="mnlabel">3% of Minnesota residents</div>
                  </div>
                  <div class="minichart" on:click={() => lFilter('metro')}>
                        <div class="miniTitle">Metro suburbs: <span class="countstat" id="scount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="astat"></span> of police-involved deaths</div>
                        <div class="mnlabel">5% of Minnesota residents</div>
                  </div>
                  <div class="minichart" on:click={() => lFilter('outstate')}>
                        <div class="miniTitle">Greater Minnesota: <span class="countstat" id="mncount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="ostat"></span> of police-involved deaths</div>
                        <div class="mnlabel">3% of Minnesota residents</div>
                  </div>

                  <div class="minichart" on:click={() => wFilter('gun')}>
                        <div class="miniTitle">Firearm: <span class="countstat" id="fcount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="astat"></span> of police-involved deaths</div>
                  </div>
                  <div class="minichart" on:click={() => wFilter('bladed weapon')}>
                        <div class="miniTitle">Bladed weapon: <span class="countstat" id="bcount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="ostat"></span> of police-involved deaths</div>
                  </div>
                  <div class="minichart" on:click={() => wFilter('other')}>
                        <div class="miniTitle">Other weapon: <span class="countstat" id="acount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="astat"></span> of police-involved deaths</div>
                  </div>
                  <div class="minichart" on:click={() => wFilter('unarmed')}>
                        <div class="miniTitle">Unarmed: <span class="countstat" id="ucount"></span></div>
                        <div class="statlabel"><span class="pctstat" id="ostat"></span> of police-involved deaths</div>
                  </div>
            </div>
            <div id="map" class="viz"><MapMain/></div>
            <div id="mchart" class="viz"></div>
      </div>

<Search bind:searchTerm on:input={search} />

<div>
{#await promise}
	<p>Loading...</p>
{:then d}
	{#each d as d}
      	<div class='card {clicked[d.index]}' id="card{d.index}" name="{d.FirstName} {d.LastName}" race="{d.Race}" weapon="{d.WeaponCategory}" region="{d.Region}" gender="{d.Gender}" manner="{d.MannerDeath}">
                  <div class='x {hidden[d.index]}' on:click={() => closespand(d.index)}>&#10006;</div>
                  <div class='expand {show[d.index]}' on:click={() => clickspand(d.index)}>&#8690;</div>


      		<div class='leftSide'>
      			<div class='photos'><img height='150' src='./img/{d.photo2}' rel='photo' alt='photo' /></div>
      		</div>
      		<div class='rightSide'>
      			<div class='name'>{d.FirstName} {d.LastName}</div>
      			<div class='vitals'><span class='race'>{d.Race}</span> <span class='gender'>{d.Gender}</span> {d.AgeYears}</div>
      			<div class='location'>{d.InjuryCity} <span class='region'>{d.Region}</span></div>
                        <div>Weapon: {d.Weapon} (<span class="weapon">{d.WeaponCategory}</span>)</div>
      			<div>Agencies involved: {d.Agency}</div>
      		</div>
                  <div class="bottomSide {hidden[d.index]}">
                        <div class='narrative'>{d.StribNarrative}</div>
                        <div class='scrollTop'><a href="#count">&#8679; return to top</a></div>
                  </div>
                  <div class='readmore'><a href='{d.URL}'>Read more coverage</a></div>
      	</div>
	{/each}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
</div>

<div class='scrollTop'><a href="#count">&#8679; return to top</a></div>