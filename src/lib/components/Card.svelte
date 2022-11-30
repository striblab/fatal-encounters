<script>
    import { toTitleCase } from "../helpers";
    import { apdate } from "journalize";
    import { slide } from "svelte/transition"
    export let record;

    function toggleNarrative(){
        if (!record.expanded) {
            record.expanded = true
        } else {
            record.expanded = false
        }
    }

    const scrollToTop = () => {
        let top = document.getElementById("count-chart")
        top.scrollIntoView({
            behavior: "smooth"
        })
    }

</script>

<section class="card" class:expanded={record.expanded} id="record{record.index}">

    <h3>{record.FirstName} {record.LastName} {record.Suffix}</h3>
    <section class="flex-container">
        <section>
            <section class="vitals">
                {#if record.AgeYears != "PENDING"}
                    {record.AgeYears} year-old
                {/if}
                {#if record.Race != "PENDING"}
                    {record.Race == "WHITE" ? 
                    record.Race.toLowerCase() : 
                    record.Race == "MULTI" ?
                    "multiracial" :
                    toTitleCase(record.Race)}
                {/if}
                {#if record.Gender != "PENDING"}
                    {record.Gender.toLowerCase()}
                {/if}
            </section>
            <section class="incident-details">
                <ul>
                    <li>Killed in {toTitleCase(record.InjuryCity)} 
                        {#if record.InjuryDate}
                        on {apdate(new Date(record.InjuryDate))}
                        {/if}
                    </li>
                    <li>Agency involved: {toTitleCase(record.Agency).replace("Pd","Police Department").replace("So", "Sheriff's Office")}</li>
                    {#if record.WeaponCategory != "PENDING" && record.WeaponCategory != "UNKNOWN" && record.WeaponCategory != "OTHER"}
                        {#if record.WeaponCategory == "UNARMED"}
                            <li>Authorities said {record.LastName} was {record.WeaponCategory.toLowerCase()}.</li>
                        {:else}
                            <li>Authorities said {record.LastName} was armed with a {record.WeaponCategory.toLowerCase()}.</li>
                        {/if}
                    {/if}
                </ul>
                
            </section>
        </section>
        <img 
        class="photo"
        src="img/{record.photo2}" 
        alt="{record.photo2.includes('placeholder') ? 
            'no photo available' : 
            `photo of ${record.FirstName} ${record.LastName}`}" 
        />
    </section>
    {#if record.expanded}
    <section class="narrative" transition:slide>
        <p>{record.StribNarrative}</p>
        {#if record.URL}
        <p><a href="{record.URL}" target="_blank" rel="noreferrer">Read more coverage...</a></p>
        {/if}
    </section>
    {/if}
    <button class="read-more" on:click={toggleNarrative}>{#if !record.expanded}Read more...{:else}Show less &uArr;{/if}</button>
    <a 
        class="back-to-top-link"
        href="#count-chart" 
        on:click|preventDefault={scrollToTop}
    >Back to top &uArr;</a>
</section>

<style>

.card {
    flex-basis: 500px;
    margin: 1em 0 1em;
    padding: 2em;
    background-color: #f0f0f0;
    font-family: "Benton Sans",Helvetica,Arial,sans-serif;
    position: relative;
}

h3 {
    margin-top: 0;
    padding-left: 5px;
}

.photo {
    float: right;
    max-width: 175px;
    margin-left: 1em;
}

.vitals {
    padding-left: 5px;
}

ul {
    padding-left: 5px;
}

li {
    list-style-type: none;
    margin-bottom: .75em;
    line-height: 1.4em;
}

.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.read-more {
    background-color: none;
    border: 1px solid #666666;
    border-radius: 10px;
    color: #333333;
    padding: 5px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1em;
}

.narrative {
    padding: 1em 1em 1em 5px;
}

.narrative p {
    line-height: 1.6em;
}

.back-to-top-link {
    position: absolute;
    bottom: 15px;
    right: 15px;
}

</style>