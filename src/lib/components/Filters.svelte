<script>
    import { toTitleCase } from "../helpers";

    import { allData, filteredData } from "../getData";

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
</script>

Show only: 
{#each races as race}
    <input 
        id="race-{race}" 
        type="checkbox" 
        bind:checked={raceFilters[race]} 
        on:change={filterData}
    />
    <label for="race-{race}">{toTitleCase(race)}</label>
{/each}
{#each sexes as sex}
    <input 
        id="sex-{sex}" 
        type="checkbox" 
        bind:checked={sexFilters[sex]} 
        on:change={filterData}
    />
    <label for="sex-{sex}">{toTitleCase(sex)}</label>
{/each}
{#each regions as region}
    <input 
        id="region-{region}" 
        type="checkbox" 
        bind:checked={regionFilters[region]} 
        on:change={filterData}
    />
    <label for="region-{region}">{toTitleCase(region)}</label>
{/each}

{#if $filteredData.length !== $allData.length}
    <section class="filter-info">
        <p>Showing {$filteredData.length} of {$allData.length} total records.</p>
    </section>
{/if}

<style>
    .filter-info p {
        font-weight: 700;
    }
</style>