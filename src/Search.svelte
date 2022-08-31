<script>
	export let searchTerm;
</script>


<div id="filter">
      <input type="search" 
            id="filter_box" 
            placeholder="Search list of all deaths by name, year or keyword"
            autocomplete="off"
            on:input />
</div> 

<div id="resultsBlock"><span class="results"></span></div>