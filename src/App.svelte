<script>

    import { isLoading, error, allData, filteredData } from "./lib/getData";

    import Card from "./lib/components/Card.svelte";
    import Filters from "./lib/components/Filters.svelte"
    import Search from "./lib/components/Search.svelte"
    import CountChart from "./lib/components/CountChart.svelte";
    import Demographics from "./lib/components/Demographics.svelte";
    import Map from "./lib/components/Map.svelte";

    
</script>

{#if $isLoading }
    <div class="appinfo">
        Loading…
    </div>
{:else if $error}
    <div class="appinfo">
        An error occurred while loading the data. {console.log(error)}
    </div>
{:else if $filteredData}
    <div class="flex-container-c">
        <section class="overall-count">
            <div>Since 2000, at least</div> 
                <div class="big-number">{$allData.length}</div> 
            <div>people have been killed after encounters law enforcement in Minnesota.</div>
        </section>
    </div>
    <div class="flex-container-r" style="justify-content: center;">
        <section id="demographics">
            <Demographics />
        </section>
    </div>
    
    <div class="flex-container-r">
        <section id="count-chart">
            <CountChart />
        </section>
        <section id="encounters-map">
            <Map />
        </section>
    </div>
    <section id="filters">
        <Filters />
    </section>
    <section id="search">
        <Search />
    </section>
    <section id="cardSpill">
        {#each $filteredData as record}
            <Card {record}/>
        {/each}
    </section>
    
{/if}

<style>
    .overall-count {
        text-align: center;
        max-width:16em;
        margin-bottom:1.5em;

    }

    .big-number {
        font-size: 7em;
        font-weight: 700;
    }
    
    section {
        margin: 2em 0 2em;
    }

    .flex-container-c {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
    }
    
    .flex-container-r {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    #count-chart {
        flex-grow: 1;
        flex-basis: 250px;
    }

    #encounters-map {
        flex-grow: 2;
        flex-basis: 350px;
    }

    #cardSpill {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        justify-content: center;
        box-sizing: border-box;
    }


</style>