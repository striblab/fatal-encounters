<script>

    import { isLoading, error, allData, filteredData } from "./lib/getData";

    import Card from "./lib/components/Card.svelte";
    import Filters from "./lib/components/Filters.svelte"
    import Search from "./lib/components/Search.svelte"

    // const {isLoading, error, data: allData, filteredData: filteredData} = getData();

    
    
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
    #cardSpill {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
    }
</style>