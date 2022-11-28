<script>
    import getData from "./lib/getData";
    import Card from "./lib/components/Card.svelte";

    const {isLoading, error, data: deaths} = getData();
</script>

{#if $isLoading }
    <div class="appinfo">
        Loading…
    </div>
{:else if $error}
    <div class="appinfo">
        An error occurred while loading the data. {console.log(error)}
    </div>
{:else if $deaths}
    <section id="cardSpill">
        {#each $deaths as record}
            <Card {record}/>
        {/each}
    </section>
    
{/if}