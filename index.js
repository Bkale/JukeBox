(() => {
  const submit = document.querySelector('.js-submit')
  const input = document.querySelector('.js-searchBar')


//Validates Search and Calls get
  function validateSearch() {
		const searchTerm = input.value;
		if (searchTerm.trim() === "") {
			alert('Please input a value!')
			return;
		}
		input.setAttribute('disabled', 'disabled');
		submit.setAttribute('disabled', 'disabled');


    spotifySearch(searchTerm)
	}

  function spotifySearch(searchTerm){
    console.log(searchTerm);
  }












//****************   ONCLICK   ********************
  submit.addEventListener('click', (e) => validateSearch(e))
  document.addEventListener('keydown', (e) => {
      if(e.keyCode === 13){
        validateSearch()
      }
    })

//################# END OF CODE ######################
})()//End
