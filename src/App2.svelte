<script>

    import { isLoading, error, allData, filteredData } from "./lib/getData";

    import Card from "./lib/components/Card.svelte";
    import Filters from "./lib/components/Filters.svelte"
    import Search from "./lib/components/Search.svelte"
    import CountChart from "./lib/components/CountChart.svelte";
    import StatsCharts from "./lib/components/StatsCharts.svelte"
    
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
    <section id="count-chart">
        <CountChart />
    </section>
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
</style>