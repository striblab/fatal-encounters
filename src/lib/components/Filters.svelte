<script>
    import { toTitleCase } from "../helpers";
    import { allData, filteredData } from "../getData";
    let filtering = false;



    let raceFilters = {};
    let races = Array.from(new Set($allData.map((d)=> d.Race)));
    races = races.filter((d)=> d != "PENDING");
    races.forEach(r => raceFilters[r] = false);

    let sexFilters = {};
    let sexes = Array.from(new Set($allData.map((d)=> d.Gender)));
    sexes = sexes.filter((d)=> d != "PENDING");
    sexes.forEach(r => sexFilters[r] = false);

    let regionFilters = {};
    let regions = Array.from(new Set($allData.map((d)=> d.Region)));
    regions = regions.filter((d)=> d != "PENDING");
    regions.forEach(r => regionFilters[r] = false);

    const filterData = () => {

        $filteredData = $allData;

        applyFilter(races, raceFilters, "Race");
        applyFilter(sexes, sexFilters, "Gender");
        applyFilter(regions, regionFilters, "Region");
        
    }

    function applyFilter(filterList, filterObject, filterField) {
        let activeFilters = []
        filterList.forEach((r) => {
            if (filterObject[r] == true) {
                activeFilters.push(r)
            }
        });
        if (activeFilters.length > 0) {
            $filteredData = $filteredData.filter((d) => activeFilters.indexOf(d[filterField]) != -1);
        }
    }
    
    const clearFilters = () => {
        let checks = document.getElementsByClassName("filter")
        Array.prototype.forEach.call(checks, (c)=>{
            c.checked = false
        });
        raceFilters = {}
        sexFilters = {}
        regionFilters = {}
        filterData();
    }

    $: filtering = (Object.values(raceFilters).concat(Object.values(sexFilters)).concat(Object.values(regionFilters))).includes(true)

</script>

<h3>Filter records by&hellip;</h3>

<div class="filter-group">
    <span class="filter-group-label">Race:</span>
    {#each races as race}
        <div>
            <input 
                class="visually-hidden filter"
                id="race-{race}" 
                type="checkbox" 
                bind:checked={raceFilters[race]} 
                on:change={filterData}
            />
            <label for="race-{race}" class="race-filter">{race === "MULTI" ? "Multiracial" : toTitleCase(race)}</label>
        </div>
    {/each}
</div>

<div class="filter-group">
    <span class="filter-group-label">Sex:</span> 
    {#each sexes as sex}
        <div>
            <input 
                class="visually-hidden filter"
                id="sex-{sex}" 
                type="checkbox" 
                bind:checked={sexFilters[sex]} 
                on:change={filterData}
            />
            <label for="sex-{sex}" class="sex-filter">{toTitleCase(sex)}</label>
        </div>
    {/each}
</div>

<div class="filter-group">
    <span class="filter-group-label">Region:</span>
    {#each regions as region}
        <div>
            <input
                class="visually-hidden filter"
                id="region-{region}" 
                type="checkbox" 
                bind:checked={regionFilters[region]} 
                on:change={filterData}
            />
            <label for="region-{region}" class="region-filter">{toTitleCase(region)}</label>
        </div>
    {/each}
    {#if filtering}
    <input
        class="visually-hidden"
        id="clear"
        type="checkbox"
        on:change={clearFilters}
    />
    <label for="clear" class="clear"><span class="x">&#10060;</span>Clear filters</label>
    {/if}
</div>

<section class="filter-info">
    {#if filtering}
    <p>Showing {$filteredData.length} of {$allData.length} total records.</p>
    {:else}
    <p>&nbsp;</p>
    {/if}
</section>


<style>
    .filter-info p {
        font-weight: 700;
    }

    .filter-group {
        display: block;
    }

    .filter-group-label{
        font-weight: 700;
    }

    div {
        display: inline-block;
        margin: 3px;
    }

    label {
        border: 1px solid #ccc;
        padding: 5px 12px;
        border-radius: 15px;
        display:inline-block;
        cursor: pointer;
    }

    label.clear {
        border: none;
        color: #9b4242;
        padding-left:0;
        margin-left:2rem;
    }

    .x {
        font-size: .5rem;
        vertical-align: middle;
        margin-right:2px;
    }

    .filter:checked ~ label {
        color: #555555;
    }

    .filter:checked ~ label.race-filter, .filter:hover ~ label.race-filter {
        background-color: #eaa99e;
    }
    .filter:checked ~ label.sex-filter, .filter:hover ~ label.sex-filter {
        background-color: #b3afca;
    }
    .filter:checked ~ label.region-filter, .filter:hover ~ label.region-filter {
        background-color: #e1b79c;
    }
</style>