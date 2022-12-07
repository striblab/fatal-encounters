<script>
    import { allData, filteredData, toggleClearFilters } from "../getData";

    import MiniSearch from "minisearch";

    let searchTerm;

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

    const searchRaces = () => {
        $filteredData = miniSearch.search(searchTerm);
        if (searchTerm == "") {
            $filteredData = $allData;
        }
    }

    const clearSearch = () => {
        searchTerm = "";
        searchRaces();
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
            on:keyup={searchRaces} 
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

</style>