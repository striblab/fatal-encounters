<script>
    import { allData } from "../getData"
    import { toTitleCase, raceOrder, regionOrder, translations } from "../helpers";

    const totalRecords = $allData.length

    //Size in pixels of each percentage point on bar charts
    const widthBasis = 3

    //Get values for all relevant categories
    let races = Array.from(new Set($allData.map((d)=> d.Race)));
    races = races.filter((d)=> d != "PENDING" && d != "MULTI" && d);
    races.push("OTHER");
    races.sort((a,b) => raceOrder.indexOf(a) - raceOrder.indexOf(b))
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

    let regionCounts = {}
    regions.forEach((r)=>{
        regionCounts[r] = $allData.filter((d) => d.Region == r).length
    })
    regions.sort((a,b) => regionOrder.indexOf(a) - regionOrder.indexOf(b))

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
    const mn_regions_stats = {
        "Outstate": .45,
        "Minneapolis": .08,
        "Metro": .42,
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
    
    <div class="chart-group">
        <h4>Race</h4>
    {#each races as race}
        <div class="stat-chart">
            <h5>{toTitleCase(race)}</h5>
            <div class="bar-group">
                <div class="stat-bar demo" style="width:{Math.round(raceCounts[race]/totalRecords*100)*widthBasis}px;"></div>
                {Math.round(raceCounts[race]/totalRecords*100)}% 
            </div>
            <div class="bar-group">
                <div class="stat-bar state" style="width: {Math.round(mn_race_stats[race]*100)*widthBasis}px;"></div>
                {Math.round(mn_race_stats[race]*100)}%
            </div>
        </div>
    {/each}
    </div>

    
    
    <div class="chart-group">
        <h4>Region</h4>
    {#each regions as region}
        <div class="stat-chart">
            <h5>{translations.get(region) ? translations.get(region) : toTitleCase(region)}</h5>
            <div class="bar-group">
                <div class="stat-bar demo" style="width:{Math.round(regionCounts[region]/totalRecords*100)*widthBasis}px;"></div>
                {Math.round(regionCounts[region]/totalRecords*100)}% 
            </div>
            <div class="bar-group">
                <div class="stat-bar state" style="width: {Math.round(mn_regions_stats[region]*100)*widthBasis}px;"></div>
                {Math.round(mn_regions_stats[region]*100)}% 
            </div>
        </div>
    {/each}
    </div>
</div>

<style>
    h3 {
        margin: 0.5rem 0 0;
    }

    .key {
        font-size: 0.9rem;
        margin: .5rem 0;
    }

    .key div {
        display: inline-block;
        margin-right: 1rem;
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
        flex-direction: row;
        align-items: flex-start;
    }

    .demographic-charts h4 {
        flex-basis: 100%;
        margin: 0.4rem 0 0.2rem;
    }

    .chart-group {
        display: flex;
        flex-direction: column;
    }

    .stat-chart {
        font-size: .8rem;
        margin: 0.4rem 3rem 0.4rem 0;
    }

    .stat-chart h5 {
        font-size: 0.8rem;
        margin:0;
    }

    .stat-chart .bar-group {
        display: flex;
        width: 100%;
        align-items: center;
    }

    .stat-bar {
        height: 0.8rem;
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