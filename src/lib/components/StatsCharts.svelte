<script>
    import { allData } from "../getData"
    import { toTitleCase } from "../helpers";

    const totalRecords = $allData.length

    //Get values for all relevant categories
    let races = Array.from(new Set($allData.map((d)=> d.Race)));
    races = races.filter((d)=> d != "PENDING" && d != "MULTI");
    races.push("OTHER");
    let sexes = Array.from(new Set($allData.map((d)=> d.Gender)));
    sexes = sexes.filter((d)=> d != "PENDING");
    let regions = Array.from(new Set($allData.map((d)=> d.Region)));
    regions = regions.filter((d)=> d != "PENDING");

    let raceCounts = {}
    races.forEach((r)=>{
        if (r == "OTHER") {
            raceCounts[r] = $allData.filter((d)=> {
                return !["WHITE",
                 "BLACK",
                 "ASIAN",
                 "AMERICAN INDIAN",
                 "HISPANIC"]
                 .includes(d.Race)}).length

        } else {
            raceCounts[r] = $allData.filter((d) => d.Race == r).length
        }
        
    })

    let sexCounts = {}
    sexes.forEach((s)=>{
        sexCounts[s] = $allData.filter((d) => d.Gender == s).length
    })

    let regionCounts = {}
    regions.forEach((r)=>{
        regionCounts[r] = $allData.filter((d) => d.Region == r).length
    })

    //From 2020 Census
    const mn_race_stats = {
        "WHITE": .79,
        "BLACK": .07,
        "HISPANIC": .06,
        "AMERICAN INDIAN": .01,
        "ASIAN": .05,
        "OTHER": .03
    }

    //From 2020 Census
    const mn_sex_stats = {
        "MALE": .5,
        "FEMALE": .5
    }

    //From 2020 Census
    const mn_regions_stats = {
        "Outstate": .42,
        "Minneapolis": .08,
        "Metro": .45,
        "St. Paul": .05
    }


</script>

<h3>Demographics</h3>
<div class="key">
    <div>
        <span class="demo"></span> Percent of people killed by police
    </div>
    <div>
        <span class="state"></span> Percent of Minnesota population
    </div>

</div>
<div class="demographic-charts">
    <h4>Race</h4>
    {#each races as race}
    <div class="stat-chart">
        <h5>{toTitleCase(race)}</h5>
        <div class="bar-group">
            <div class="stat-bar demo" style="width:{Math.round(raceCounts[race]/totalRecords*100)}%;"></div>
            {Math.round(raceCounts[race]/totalRecords*100)}% 
        </div>
        <div class="bar-group">
            <div class="stat-bar state" style="width: {Math.round(mn_race_stats[race]*100)}%;"></div>
            {Math.round(mn_race_stats[race]*100)}%
        </div>
    </div>
    {/each}

    <h4>Sex</h4>
    {#each sexes as sex}
    <div class="stat-chart">
        <h5>{toTitleCase(sex)}</h5>
        <div class="bar-group">
            <div class="stat-bar demo" style="width:{Math.round(sexCounts[sex]/totalRecords*100)}%;"></div>
            {Math.round(sexCounts[sex]/totalRecords*100)}% 
        </div>
        <div class="bar-group">
            <div class="stat-bar state" style="width: {Math.round(mn_sex_stats[sex]*100)}%;"></div>
            {Math.round(mn_sex_stats[sex]*100)}%
        </div>
    </div>
    {/each}

    <h4>Region</h4>
    {#each regions as region}
    <div class="stat-chart">
        <h5>{region}</h5>
        <div class="bar-group">
            <div class="stat-bar demo" style="width:{Math.round(regionCounts[region]/totalRecords*100)}%;"></div>
            {Math.round(regionCounts[region]/totalRecords*100)}% 
        </div>
        <div class="bar-group">
            <div class="stat-bar state" style="width: {Math.round(mn_regions_stats[region]*100)}%;"></div>
            {Math.round(mn_regions_stats[region]*100)}% 
        </div>
    </div>
    {/each}
</div>

<style>
    h3 {
        margin: 0.5em 0 0;
    }

    .key {
        font-size: 0.9em;
        margin: .5em 0;
    }

    .key div {
        display: inline-block;
        margin-right: 1em;
        vertical-align: middle;
    }

    .key span {
        height: 11px;
        width: 25px;
        display: inline-block;
    }

    .demographic-charts {
        display: flex;
        flex-wrap: wrap;
    }

    .demographic-charts h4 {
        flex-basis: 100%;
        margin: 0.4em 0 0.2em;
    }

    .stat-chart {
        flex-basis: 275px;
        font-size: .7em;
        margin: 0.4em 1em 0.4em 0;
    }

    .stat-chart h5 {
        font-size: 1.2em;
        margin:0;
    }

    .stat-chart .bar-group {
        display: flex;
        width: 100%;
    }

    .stat-bar {
        height: 11px;
        display: inline-block;
        margin-right: 2px;
    }

    .demo {
        background-color: #b9625f;
    }

    .state {
        background-color: #ccc;
    }

</style>