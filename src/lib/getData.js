import { writable } from 'svelte/store';

export const {isLoading, error, allData, filteredData} = getData()


function getData() {
    const allData = writable();
    const error = writable();
    const filteredData = writable();
    const isLoading = writable(false);

    async function fetchData() {
        isLoading.set(true);

        try {
            const response = await fetch("https://static.startribune.com/news/projects/all/strib-fatal-encounters-db/data/data.json");
            const {mn_shootings: deaths} = await response.json();
            // @ts-ignore
            let sorted_data = deaths.sort((a,b) => {
                return new Date(a.DeathDate) > new Date(b.DeathDate) ? -1 :1
            })
            deaths.forEach(d => d["expanded"] = false)
            allData.set(sorted_data);
            filteredData.set(sorted_data);
            error.set();
        } catch(err) {
            allData.set();
            filteredData.set();
            error.set(err);
        }
        isLoading.set(false);
    }
    fetchData();

    return {isLoading, error, allData, filteredData}
}

export let toggleClearFilters = writable(false)