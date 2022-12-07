<script>
    import { allData, filteredData, toggleClearFilters } from "../getData";

    import MiniSearch from "minisearch";

    let searchTerm;

    let typingTimer;
    let doneTypingInterval = 750; //Time between last keyup and firing of search

    let miniSearch = new MiniSearch({
        idField: "index",
        fields: ["FirstName", "LastName", "InjuryCity"],
        storeFields: [
            "FirstName", 
            "MiddleName",
            "LastName", 
            "Suffix",
            "InjuryCity",
            "AgeYears",
            "Race",
            "Gender",
            "Agency",
            "WeaponCategory",
            "InjuryDate",
            "photo2",
            "StribNarrative",
            "expanded",
            "Region",
            "index",
            "Latitude",
            "Longitude"
        ]
    })

    miniSearch.addAll($allData);

    const startTimer = (event) => {
        if(event.key == "Enter") {
            searchData()
        } else {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(searchData, doneTypingInterval)
        }
        
    }

    const clearTimer = () => {
        clearTimeout(typingTimer);
    }

    const searchData = () => {
        $filteredData = miniSearch.search(searchTerm);
        if (searchTerm == "") {
            $filteredData = $allData;
        }
    }

    const clearSearch = () => {
        searchTerm = "";
        searchData();
    }

    $: if (searchTerm) {
        $toggleClearFilters = true
    }

</script>

<div id="search-container">
    <span id="delete-container">
        <input 
            id="search-box" 
            bind:value={searchTerm} 
            on:keyup={(event)=>{startTimer(event)}}
            on:keydown={clearTimer} 
            placeholder="Search for a name or location&hellip;" 
        />
        {#if searchTerm}
        <button 
            on:click={clearSearch} 
            id="delete" 
            aria-label="clear search"
            title="Clear search"
        >
            <i class="fa fa-times"></i>
        </button>
        {/if}
    </span>
</div>
{#if searchTerm && $filteredData.length===0}
<div id="search-results">
    Your search did not match any records. 
    <button on:click={clearSearch}>Clear search.</button>
</div>
{/if}

<style>

    #search-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #delete-container {
        position: relative;
        flex-basis: 1000px;
    }

    #search-box {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        font-size:1rem;
        line-height: 1.6rem;
        padding: .25rem;
    }

    #delete {
        position: absolute;
        cursor: pointer;
        right: 6px;
        top: 3px;
        font-size: 1.4rem;
        line-height: 1.4rem;
        border: 0;
        background-color: transparent;
        padding: 0.25rem;
    }

    #search-results {
        text-align: center;
        padding: 2rem;
        font-size: 1rem;
        font-weight: 700;
    }

    #search-results button {
        background-color: transparent;
        border: 0;
        color: rgb(0,100,200);
        padding: 0;
        font-size: 1rem;
        cursor: pointer;
        font-weight: 700;
    }

</style>