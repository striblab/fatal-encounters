import { writable, derived } from 'svelte/store';


export default function getData() {
    const data = writable();
    const error = writable();
    const filteredData = writable();
    const isLoading = writable(false);

    async function fetchData() {
        isLoading.set(true);

        try {
            const response = await fetch("https://googlescript.startribune.com/?macro=AKfycbw_cqdXZADky_zHS3pi9aBL2S3-514vlxJkcnv5TJ1z9sxCqPY&id=1T-Du1geFfuspEYGF_U0531mLTJ0ehbA5YbaFCxgmkRA&sheet=mn_shootings");
            const {mn_shootings: deaths} = await response.json();
            data.set(deaths);
            filteredData.set(deaths);
            error.set();
        } catch(err) {
            data.set();
            filteredData.set();
            error.set(err);
        }
        isLoading.set(false);
    }
    fetchData();

    return {isLoading, error, data, filteredData}
}