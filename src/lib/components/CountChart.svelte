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
    <section class="overall-count">
        <div>Since 2000, at least</div> 
        <div class="big-number">{$allData.length}</div> 
        <div>people have been killed by law enforcement in Minnesota.</div>
    </section>

    <section class="by-year-chart">
        <h4>Deaths by year</h4>
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

    h4 {
        margin-top: 0;
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

    .ylabel {
        display:inline-block;
        width:40px;
        font-size:15px;
        color:#888;
    }

    .year {
        height:21px;
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