<script>
    import { allData, filteredData } from "../getData";
    import { group } from "d3"
    import tooltip from "svelte-tooltip-action";

    let activeIndices;
    const style = "margin-top: 20px;";

    let deathYears = group($allData, d => d.year)
    deathYears.forEach(function(deaths, year){
        // Change sort order so latest deaths appear at end of bar
        // @ts-ignore
        let d = deaths.sort((a,b) => new Date(a.InjuryDate) - new Date(b.InjuryDate))
        deathYears.set(year, d)
    });

    const scrollToRecord = (index) => {
        const el = document.getElementById("record"+index);
        el.scrollIntoView({
            behavior: "smooth"
        });
    }

    $: activeIndices = $filteredData.map((d)=>d.index)

    
</script>

<section class="flex-container">


    <section class="by-year-chart">
        <div class="chart-header">
            <h3>Deaths by year</h3>
        </div>
        {#each [...deathYears] as [year, records]}
        <div class="year">
            <span class="ylabel">{year}</span>
            {#each records as record}
                <span 
                    class="block" 
                    class:active={activeIndices.indexOf(record.index)!= -1}
                    use:tooltip={{ 
                        text: record.FirstName + " " + record.LastName, 
                        style: style 
                    }}
                    on:click|preventDefault={()=>scrollToRecord(record.index)}
                    on:keydown={()=>scrollToRecord(record.index)}
                >
                </span>
            {/each}
        </div>
        {/each}
    </section>
</section>

<style>

    .flex-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
    }

    .by-year-chart {
        align-self: flex-start;
    }

    .chart-header {
        display: flex;
        align-items: center;
        height: 3em;
    }

    h3 {
        margin: 0 0.5em 0 0;
    }

    .ylabel {
        display:inline-block;
        width:40px;
        font-size:15px;
        color:#888;
    }

    .year {
        height:21px;
        display: flex;
    }

    .block {
        width:25px;
        height:11px;
        margin-right:2px;
        background-color:#cccccc;
        display:inline-block;
    }

    .active {
        background-color: #b9625f;
    }

    .block:hover {
        cursor:pointer;
        background-color:#e1b79c;
    }

</style>