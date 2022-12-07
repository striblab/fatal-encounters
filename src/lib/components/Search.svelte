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

    $: if (searchTerm) {
        $toggleClearFilters = true
    }

</script>

<div id="searchContainer">
    <input 
        id="searchBox" 
        bind:value={searchTerm} 
        on:keyup={searchRaces} 
        placeholder="Search for a name or location&hellip;" 
    />
</div>

<style>

    #searchContainer {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #searchBox {
        flex-basis: 1000px;
        font-size:1rem;
        line-height: 1.6rem;
        padding: .25rem;
        margin: 0 1rem;
    }
</style>