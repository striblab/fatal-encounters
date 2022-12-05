<script>

    import { isLoading, error, allData, filteredData } from "./lib/getData";

    import Card from "./lib/components/Card.svelte";
    import Filters from "./lib/components/Filters.svelte"
    import Search from "./lib/components/Search.svelte"
    import CountChart from "./lib/components/CountChart.svelte";
    import StatsCharts from "./lib/components/StatsCharts.svelte";
    import Map from "./lib/components/Map.svelte";
    import { fade } from "svelte/transition"

    let topComponent = "countchart";
    const toggler = (event) => {
        topComponent = event.detail.topComponent;
    }
    
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
    <div class="flex-container">
        <section class="overall-count">
            <div>Since 2000, at least</div> 
                <div class="big-number">{$allData.length}</div> 
            <div>people have been killed after encounters law enforcement in Minnesota.</div>
        </section>
    </div>

    {#if topComponent == "countchart"}
    <section id="count-chart" transition:fade>
        <CountChart on:toggle={toggler}/>
    </section>
    {/if}
    {#if topComponent == "map"}
    <section id="encounters-map" transition:fade>
        <Map on:toggle={toggler}/>
    </section>
    {/if}
    <section id="stats-charts">
        <StatsCharts />
    </section>
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
    section {
        margin: 2em 0 2em;
    }

    #cardSpill {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        justify-content: space-between;
    }

    .flex-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
    }

    .overall-count {
        text-align: center;
        max-width:16em;
        margin-bottom:1.5em;

    }

    .big-number {
        font-size: 7em;
        font-weight: 700;
    }

</style>