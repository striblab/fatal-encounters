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
        {#each [...deathYears].reverse() as [year, records]}
        <div class="year">
            <span class="ylabel">{year}</span>
            <div class="bars-container">
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
        </div>
        {/each}
        <div class="year">
            <span class="ylabel"></span>
            <div class="bars-container axis">
                <span class="block empty"></span>
                <span class="block empty"></span>
                <span class="block empty"></span>
                <span class="block empty"></span>
                <span class="block empty">5</span>
                <span class="block empty"></span>
                <span class="block empty"></span>
                <span class="block empty"></span>
                <span class="block empty"></span>
                <span class="block empty">10</span>
                <span class="block empty"></span>
                <span class="block empty"></span>
                <span class="block empty"></span>
                <span class="block empty"></span>
            </div>

        </div>
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
        height: 3rem;
    }

    h3 {
        margin: 0 0.5rem 0 0;
    }

    .ylabel {
        display:inline-block;
        width:40px;
        font-size:0.9rem;
        color:#888;
    }

    .ylabel:nth-last-child(1) {
        border-right: 1px solid #888;
    }

    .year {
        height: 1.2rem;
        display:flex;
        align-items: center;
    }

    .bars-container.axis {
        border-top: 1px solid #888;
    }

    .axis .block {
        align-self: flex-start;
    }

    .bars-container {
        display: flex;
        align-items: center;
    }

    .block {
        width:1.6rem;
        height:.85rem;
        margin-right:2px;
        background-color:#cccccc;
        display:inline-block;
        box-sizing: border-box;
    }

    .active {
        background-color: #b9625f;
    }

    .empty {
        background-color: transparent;
        text-align: right;
        font-size: .8rem;
        padding-right: 4px;
        padding-top: 2px;
        color: #888;
    }

    .empty:nth-child(5n) {
        border-right: 1px solid #888;
    }

    .block:hover {
        cursor:pointer;
        background-color:#e1b79c;
    }

    .empty:hover {
        cursor: auto;
        background-color: transparent;
    }

</style>