import { writable, derived } from 'svelte/store';
import { values } from 'underscore';

export const {isLoading, error, allData, filteredData} = getData()


function getData() {
    const allData = writable();
    const error = writable();
    const filteredData = writable();
    const isLoading = writable(false);

    async function fetchData() {
        isLoading.set(true);

        try {
            const response = await fetch("https://googlescript.startribune.com/?macro=AKfycbw_cqdXZADky_zHS3pi9aBL2S3-514vlxJkcnv5TJ1z9sxCqPY&id=1T-Du1geFfuspEYGF_U0531mLTJ0ehbA5YbaFCxgmkRA&sheet=mn_shootings");
            const {mn_shootings: deaths} = await response.json();
            // @ts-ignore
            let sorted_data = deaths.sort((a,b) => new Date(b.InjuryDate) - new Date(a.InjuryDate))
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