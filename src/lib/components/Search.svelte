<script>
    import { allData, filteredData } from "../getData";

    import MiniSearch from "minisearch";

    let searchTerm;

    let miniSearch = new MiniSearch({
        idField: "index",
        fields: ["FirstName", "MiddleName", "LastName", "InjuryCity"],
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
            "StribNarrative"
        ]
    })

    miniSearch.addAll($filteredData);

    const searchRaces = () => {
        $filteredData = miniSearch.search(searchTerm, {fuzzy: 0.3})
        if (searchTerm == "") {
            $filteredData = $allData;
        }
    }
</script>


<input id="searchBox" bind:value={searchTerm} on:keyup={searchRaces} />