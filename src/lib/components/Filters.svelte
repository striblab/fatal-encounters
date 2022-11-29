<script>
    import { toTitleCase } from "../helpers";

    export let filteredData;
    export let allData;

    let raceFilters = {};
    let races = Array.from(new Set(allData.map((d)=> d.Race)))
    races = races.filter((d)=> d != "PENDING");
    races.forEach(r => raceFilters[r] = false)

    const filterData = () => {

        filteredData = allData;

        let activeRaceFilters = []
        races.forEach((r) => {
            if (raceFilters[r] == true) {
                activeRaceFilters.push(r)
            }
        });
        if (activeRaceFilters.length > 0) {
            filteredData = filteredData.filter((d) => activeRaceFilters.indexOf(d.Race) != -1);
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