<script>
    import { toTitleCase } from "../helpers";
    import { apdate } from "journalize";
    import { slide } from "svelte/transition"
  import { construct_svelte_component } from "svelte/internal";
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

    const formatVitalsString = (record) => {
        let s = ""

        // Add age if we have an age
        if (record.AgeYears && record.AgeYears !== "PENDING") {
            s += record.AgeYears + "-year-old "
        }

        // Add race, capitalized correctly depending if there's an 
        // age or not and based on style rules.
        if (record.Race && record.Race !== "PENDING") {
            let race = toTitleCase(record.Race)
            if (race === "White") {race = "white"}
            if (race === "Multi") {race = "multiracial"}
            if (s) {
                s += " " + race + " "
            } else {
                s += toTitleCase(race)
            }
        }

        // Translate sex to man, woman or teen
        if (record.Gender !== "PENDING") {
            let gender = ""
            if (record.Gender === "MALE") {
                gender = "man"
            }
            if (record.Gender === "FEMALE") {
                gender = "woman"
            }
            if (record.AgeYears && parseInt(record.AgeYears) < 18) {
                gender = "teen"
            }

            if (s) {
                s += gender
            } else {
                s += toTitleCase(gender)
            }
        }

        return s
    }

    const formatDate = (date) => {
        let d = new Date(date + "T00:00:00");
        return apdate(d);
    }

</script>

<article class="card" class:expanded={record.expanded} id="record{record.index}">

    <h4>
        {record.FirstName ? record.FirstName : ""} 
        {record.LastName ? record.LastName : ""} 
        {record.Suffix ? record.Suffix : ""}
    </h4>
    <div class="flex-container">
        <div>
            <section class="vitals">
                {formatVitalsString(record)}
            </section>
            <section class="incident-details">
                <ul>
                    {#if record.InjuryCity}
                    <li>Died in {toTitleCase(record.InjuryCity).replace(/St\s/g, "St. ")} 
                        {#if record.DeathDate}
                        on {formatDate(record.DeathDate)}
                        {/if}
                    </li>
                    {/if}
                    {#if record.Agency}
                    <li>
                        Agenc{record.Agency.includes(",") ? "ies" : "y"} involved: 
                        {record.Agency.includes("MULTIPLE AGENCIES") ?
                            record.Agency.charAt(0) + record.Agency.slice(1).toLowerCase() :
                            toTitleCase(record.Agency)
                                .replace(/Pd/g, "Police Department")
                                .replace(/So([$\s,])?/g, "Sheriff's Office$1")
                                .replace(/St\s/g, "St. ")}
                    </li>
                    {/if}
                    {#if record.WeaponCategory &&
                         record.WeaponCategory != "PENDING" && 
                         record.WeaponCategory != "UNKNOWN" && 
                         record.WeaponCategory != "OTHER" &&
                         record.WeaponCategory != "UNDETERMINED"}
                        {#if record.WeaponCategory == "UNARMED"}
                            <li>Authorities said {record.LastName} was {record.WeaponCategory.toLowerCase()}.</li>
                        {:else}
                            <li>Authorities said {record.LastName} was armed with a {record.WeaponCategory.toLowerCase()}.</li>
                        {/if}
                    {/if}
                </ul>        
            </section>
        </div>
        <img 
        class="photo"
        src="https://static.startribune.com/news/projects/all/strib-fatal-encounters-db/img/{record.photo2}" 
        alt="{record.photo2.includes('placeholder') ? 
            'no photo available' : 
            `photo of ${record.FirstName} ${record.LastName}`}" 
        />
    </div>
    {#if record.expanded}
    <section class="narrative" transition:slide>
        <p>{record.StribNarrative}</p>
        {#if record.URL}
        <p><a href="{record.URL}" target="_blank" rel="noreferrer">Read more coverage...</a></p>
        {/if}
    </section>
    {/if}
    <button class="read-more" on:click={toggleNarrative}>{#if !record.expanded}Read more{:else}Show less <i class="strib-icon strib-arrow-value-up"></i>{/if}</button>
    <a 
        class="back-to-top-link"
        href="#count-chart" 
        on:click|preventDefault={scrollToTop}
    >Back to top <i class="strib-icon strib-arrow-value-up"></i></a>
</article>

<style>

.card {
    flex-basis: 575px;
    margin: 0.5rem;
    padding: 3rem;
    background-color: #f3f4f1;
    position: relative;
    box-sizing: border-box;
    border-radius:1em;
}

@media screen and (max-width: 650px) {
    .card {
        padding: 1rem;
        margin: 0.2rem;
    }

    .card img {
        max-width: 125px;
    }

}

h4 {
    margin-top: 0;
    font-size:1.1rem;
}

.photo {
    float: right;
    max-width: 175px;
    margin-left: 1rem;
}

ul {
    padding-left: 0;
    margin: 0;
}

li {
    list-style-type: none;
    margin-bottom: .55rem;
    line-height: 1.4rem;
}

.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.flex-container div section {
    margin-bottom: 1rem;
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
    font-size: 1rem;
    cursor: pointer;
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