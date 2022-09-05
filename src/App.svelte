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
    var datalength;
    var dataShootings;

    //GENERATE SUMMARY DATA FOR CHARTS AND STATS
	function buildChart(data) {
            dataShootings = data;

          var sortedRace;
          var countsByRace;
          var sortedGender;
          var countsByGender;
          var sortedLocation;
          var countsByLocation;
          var sortedWeapon;
          var countsByWeapon;

            sortedYears = _.sortBy(_.uniq(_.map(dataShootings, d => parseInt(d.year, 10))));
            countsByYears = _.map(_.sortBy(_.groupBy(dataShootings, d => parseInt(d.year, 10)),(d, di) => di), 'length');

            sortedRace = _.sortBy(_.uniq(_.map(dataShootings, d => d.Race, 10)));
            countsByRace = _.map(_.sortBy(_.groupBy(dataShootings, d => d.Race),(d, di) => di), 'length');

            sortedGender = _.sortBy(_.uniq(_.map(dataShootings, d => d.Gender, 10)));
            countsByGender = _.map(_.sortBy(_.groupBy(dataShootings, d => d.Gender),(d, di) => di), 'length');

            sortedLocation = _.sortBy(_.uniq(_.map(dataShootings, d => d.Region, 10)));
            countsByLocation = _.map(_.sortBy(_.groupBy(dataShootings, d => d.Region),(d, di) => di), 'length');

            sortedWeapon = _.sortBy(_.uniq(_.map(dataShootings, d => d.WeaponCategory, 10)));
            countsByWeapon = _.map(_.sortBy(_.groupBy(dataShootings, d => d.WeaponCategory),(d, di) => di), 'length');

            datalength = dataShootings.length;

            function miniCharts(target,labels,counts,mn,show) {
                  var length = target.length;
                  var sline = "";

                  for (var i=0; i < length; i++){
                        var pct = d3.format(".0%")(counts[i] / datalength);
                        if (show) { sline =  '<div class="mnlabel">' + mn[i] + ' of Minnesota residents</div> \
                        <div class="sline" style="width:' + mn[i] + ';"></div>' }

                        jq('#'+target[i]).html('<div class="miniTitle">' + labels[i] + ' <span class="countstat">' + counts[i] + '</span></div> \
                        <div class="statlabel"><span class="pctstat">' + pct + '</span> of police-involved deaths</div> \
                        <div class="cline" style="width:' + pct + '"></div>' + sline);
                  }
            }

            var raceTargets = ["white", "black", "hispanic", "native", "asian", "other"];
            var raceLabels = ["White", "Black", "Hispanic", "Native American", "Asian", "Other races"];
            var raceCounts = [countsByRace[6], countsByRace[2], countsByRace[3], countsByRace[0], countsByRace[1], countsByRace[4]];
            var raceMN = ["79%", "7%", "6%", "1%", "5%", "3%"];
            miniCharts(raceTargets,raceLabels,raceCounts,raceMN,true);

            var genderTargets = ["male", "female"];
            var genderLabels = ["Male", "Female"];
            var genderCounts = [countsByGender[1], countsByGender[0]];
            var genderMN = ["50%", "50%"];
            miniCharts(genderTargets,genderLabels,genderCounts,genderMN,false);

            var locationTargets = ["minneapolis", "stpaul", "suburbs", "greater"];
            var locationLabels = ["Minneapolis", "St. Paul", "Metro suburbs", "Greater Minnesota"];
            var locationCounts = [countsByLocation[1], countsByLocation[3], countsByLocation[0], countsByWeapon[2]];
            var locationMN = ["8%", "5%", "45%", "42%"];
            miniCharts(locationTargets,locationLabels,locationCounts,locationMN,true);

            var weaponTargets = ["firearm", "bladed", "weapons", "unarmed"];
            var weaponLabels = ["Firearm", "Bladed weapon", "Other weapon", "Unarmed"];
            var weaponCounts = [countsByWeapon[2], countsByWeapon[1], countsByWeapon[3], countsByWeapon[5]];
            var weaponMN = ["0%", "0%", "0%", "0%"];
            miniCharts(weaponTargets,weaponLabels,weaponCounts,weaponMN,false);

      }


//FETCH DEATHS DATA
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


  //TOGGLE VISUAL ANALYSIS VIEWS
  function vizToggle(id) {
      document.getElementsByClassName('viz')[0].style.display='none';
      document.getElementsByClassName('viz')[1].style.display='none';
      document.getElementsByClassName('viz')[2].style.display='none';
      document.getElementsByClassName('viz')[3].style.display='none';
      document.getElementsByClassName('viz')[id].style.display='block';
  }

  const style = 'margin-top:20px;';

  //SEARCH AND FILTER FUNCTIONALITY

  function found(count, term) {
      jq('.results').html(term + ": " + count + " (" + Math.round((count / Number(jq("#bigNum").text())) * 100) + "%)");
  }

  var timeout = null;

  function search(filterbox) {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
                  jq('.card').hide();
                  var txt = filterbox;
                  jq('.card').each(function() {
                        if (jq(this).text().toUpperCase() .indexOf(txt.toUpperCase()) != -1) {
                                jq(this).show();
                        }
                  });
                  var count = jq('.card:visible').length;
                  found(count, txt);
      }, 500);
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
            found(count, txt);
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
            found(count, txt); 
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
            found(count, txt);
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
            found(count, txt);
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
            found(count, txt);
   }

//https://svelte.dev/repl/e67e1a90ef3945ec988bf39f6a10b6b3?version=3.32.3

onMount(() => {

    jq('#filter_box').on("keyup search", function(i) {   
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
                  <div id="white" class="minichart" on:click={() => rFilter('white')}></div>
                  <div id="black" class="minichart" on:click={() => rFilter('black')}></div>
                  <div id="hispanic" class="minichart" on:click={() => rFilter('hispanic')}></div>
                  <div id="native" class="minichart" on:click={() => rFilter('american indian')}></div>
                  <div  id="asian" class="minichart" on:click={() => rFilter('asian')}></div>
                  <div  id="other" class="minichart" on:click={() => rFilter('multi')}></div>


                  <div id="male" class="minichart" on:click={() => gFilter('male')}></div>
                  <div id="female" class="minichart" on:click={() => gFilter('female')}></div>


                  <div id="minneapolis" class="minichart" on:click={() => lFilter('minneapolis')}></div>
                  <div id="stpaul" class="minichart" on:click={() => lFilter('st. paul')}></div>
                  <div id="suburbs" class="minichart" on:click={() => lFilter('metro')}></div>
                  <div id="greater" class="minichart" on:click={() => lFilter('outstate')}></div>

                  <div id="firearm" class="minichart" on:click={() => wFilter('gun')}></div>
                  <div id="bladed" class="minichart" on:click={() => wFilter('bladed weapon')}></div>
                  <div id="weapons" class="minichart" on:click={() => wFilter('other')}></div>
                  <div id="unarmed" class="minichart" on:click={() => wFilter('unarmed')}></div>
            </div>
            <div id="map" class="viz"><MapMain/></div>
            <div id="mchart" class="viz"></div>
      </div>

<Search on:input={search} />

<div id="cardSpill">
{#await promise}
	<p>Loading...</p>
{:then d}
	{#each d as d}
      	<div class='card {clicked[d.index]}' id="card{d.index}" name="{d.FirstName} {d.LastName}" race="{d.Race}" weapon="{d.WeaponCategory}" region="{d.Region}" gender="{d.Gender}" manner="{d.MannerDeath}">

                  <div class='x {hidden[d.index]}' on:click={() => closespand(d.index)}>&#10006;</div>

      		<div class='leftSide'>
      			<div class='photos'><img height='150' src='./img/{d.photo2}' rel='photo' alt='photo' /></div>
      		</div>
      		<div class='rightSide'>
      			<div class='name'>{d.FirstName} {d.LastName}</div>
      			<div class='vitals'><span class='race'>{d.Race}</span> – <span class='gender'>{d.Gender}</span> – {d.AgeYears}</div>
      			<div class='location'>{d.InjuryCity} <span class='region'>{d.Region}</span></div>
                        <div>Weapon: {d.Weapon} <span class="weapon">{d.WeaponCategory}</span></div>
      			<div>Agencies involved: {d.Agency}</div>
      		</div>
                  <div class="bottomSide {hidden[d.index]}">
                        <div class='narrative'>{d.StribNarrative}</div>
                        <div class='scrollTop'><a href="#count">&#8679; return to top</a></div>
                  </div>
                  <div class='readmore'><a href='{d.URL}'>Read more coverage</a></div>

                  <div class='expand {show[d.index]}' on:click={() => clickspand(d.index)}>&#8690;</div>
      	</div>
	{/each}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
</div>

<div class='scrollTop'><a href="#count">&#8679; return to top</a></div>