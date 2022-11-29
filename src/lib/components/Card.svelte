<script>
    import { toTitleCase } from "../helpers";

    export let record;

</script>

<section class="card" id="record{record.index}">

    <h4>{record.FirstName} {record.MiddleName} {record.LastName} {record.Suffix}</h4>
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
            <li>Killed in {toTitleCase(record.InjuryCity)}</li>
            <li>Agency involved: {toTitleCase(record.Agency)}</li>
            {#if record.WeaponCategory != "PENDING" && record.WeaponCategory != "UNKNOWN"}
                {#if record.WeaponCategory == "UNARMED"}
                    <li>Authorities said {record.LastName} was {record.WeaponCategory.toLowerCase()}</li>
                {:else}
                    <li>Authorities said {record.LastName} was armed with a {record.WeaponCategory.toLowerCase()}</li>
                {/if}
            {/if}
        </ul>
        
    </section>

</section>

    <!-- <div class='x {hidden[d.index]}' on:click={() => closespand(d.index)}>&#10006;</div>

<div class='leftSide'>
    <div class='photos'><img height='150' src='./img/{d.photo2}' rel='photo' alt='photo' /></div>
</div>
<div class='rightSide'>
    <div class='name'>{d.FirstName} {d.LastName}</div>
    <div class='vitals'><span class='race'>{d.Race}</span> – <span class='gender'>{d.Gender}</span> – {d.AgeYears}</div>
    <div class='location'>{d.InjuryCity} <span class='region'>{d.Region}</span></div>
    <div>Weapon: {d.Weapon} <span class="weapon">{d.WeaponCategory}</span></div>
    <div>Agencies involved: {d.Agency}</div>
</div>
    <div class="bottomSide {hidden[d.index]}">
          <div class='narrative'>{d.StribNarrative}</div>
          <div class='scrollTop'><a href="#count">&#8679; return to top</a></div>
    </div>
    <div class='readmore'><a href='{d.URL}'>Read more coverage</a></div>

    <div class='expand {show[d.index]}' on:click={() => clickspand(d.index)}>&#8690;</div>
</div> -->