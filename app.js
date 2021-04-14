// base URL for gathering all 151 pokemon 
const urlAllPokemon = "https://pokeapi.co/api/v2/pokemon?limit=151";
// other URL needed to get further details on the pokemon, since the above URL only gets pokemon name  and url
const urlPokeInfo = "https://pokeapi.co/api/v2/pokemon/";
// pokemon search form
const form = document.getElementById("searchForm");
// user input field 
const pokeId = document.getElementById("pokeId");

// Event listener that is validating user input anytime the user types 
pokeId.addEventListener("input", function (e) {

    if (pokeId.validity.valueMissing) {
        pokeId.setCustomValidity("");
    } else {
        showPokeIdError();
    }
});

// Event listener for when the user submits their search value 
form.addEventListener("submit", function (e) {
    // double checks the user input after submission:
    // if their input is invalid then the user will be prompted with a detailed error
    // else their input is valid, any existing pokemon on the screen are cleared, and new pokemon 
    // information is fetched 
    if (!pokeId.validity.valid) {
        showPokeIdError();
        e.preventDefault();
    } else {
        clearPokemon();
        e.preventDefault();
        fetchKantoPokemon(pokeId.value);
    }
});

/*
    The function: showPokeIdError() function is to create custom validity messages for the user 
*/
function showPokeIdError() {
    if (pokeId.validity.valueMissing) {
        pokeId.setCustomValidity('Please enter a pokemon id!');
        pokeId.reportValidity();
    }

    else if (pokeId.validity.rangeUnderflow || pokeId.validity.rangeOverflow) {
        pokeId.setCustomValidity('Please only enter number between 1-151');
        pokeId.reportValidity();
    }
    else {
        pokeId.setCustomValidity('');
    }
}

/*
    The function: fetchKantoPokemon() is to retrieve all 151 pokemon names and their corresponding
                  urls. These urls provide access to additional information for each pokemon (i.e. their img src, type, id, etc)
    Parameters: 
                @id - user specified pokemon to search for 
*/
function fetchKantoPokemon(id) {
    fetch(urlAllPokemon)
        .then(response => response.json())
        .then(function (allPokemon) {
            fetchPokemonData(id);
        });
}

/*
    The function: fetchPokemonData() is to retrieve additional information about the pokemon such as:
                  - Type 
                  - Moves 
                  - Img src url 
                  - etc 
    Parameters: 
                @id - user specified pokemon to search for 
*/
function fetchPokemonData(id) {
    let pokeUrl = urlPokeInfo;
    // url adds in user's specified pokemon 
    let url = `${pokeUrl}${id}/`;

    fetch(url)
        .then(response => response.json())
        .then(function (pokeData) {
            renderPokemon(pokeData);
            console.log(pokeData);
        });
}

/* 
    The function: createTypes() function is to create a li for each type of the user specified pokemon.
                  i.e: electric, bug, etc.
    Parameters: 
                @types: getting type value of specified pokemon 
                @ul: passing in which element to create    
*/
function createTypes(types, ul) {
    types.forEach(function (type) {
        let typeLi = document.createElement("li");
        typeLi.innerText = type["type"]["name"];
        ul.append(typeLi);
    })
}

/*
    The function: clearPokemon() function is to clear the previously user selected pokemon and replace it with
                  the new pokemon they wish to search 
*/
function clearPokemon() {
    let pokeNameCtnr = document.getElementById("poke-name-container");
    let pokeTypesCtnr = document.getElementById("poke-types-container");

    while (pokeNameCtnr.firstChild && pokeTypesCtnr.firstChild) {
        pokeNameCtnr.removeChild(pokeNameCtnr.firstChild);
        pokeTypesCtnr.removeChild(pokeTypesCtnr.firstChild);
    }
}

/*
    The function: renderPokemon() is to create the elements containing 
                  the pokemon information and appened them to the corresponding containers

    Parameters: 
                @pokeData - passing in which user specified pokemon information to get 
*/
function renderPokemon(pokeData) {

    let allPokemonContainer = document.getElementById("poke-info-container");
    let pokeNameCtnr = document.getElementById("poke-name-container");
    let pokeTypesCtnr = document.getElementById("poke-types-container");

    // getting pokemon ID and name 
    let pokeInfo = document.createElement("h4");
    pokeInfo.innerText = "#" + pokeData.id + " " + pokeData.name[0].toUpperCase() + pokeData.name.substring(1);
    pokeInfo.setAttribute("id", "poke-name");
    pokeInfo.classList.add("type-writer");

    // // getting pokemon sprite 
    const pokeSpriteImg = document.createElement("img");
    pokeSpriteImg.src = pokeData.sprites.front_default;
    pokeSpriteImg.setAttribute("id", "poke-img");

    pokeNameCtnr.append(pokeInfo, pokeSpriteImg);

    // Creating a label for the pokemon types  
    let type = document.createElement("h4");
    type.setAttribute("id", "type-label");
    type.innerText = "Type(s):"

    // getting all the pokemon types 
    let pokeTypes = document.createElement("ul");
    pokeTypes.setAttribute("id", "poke-types");
    pokeTypes.classList.add("type-writer");

    pokeTypesCtnr.append(type, pokeTypes);

    createTypes(pokeData.types, pokeTypes);

    // appends all poke information to parent container 
    allPokemonContainer.append(pokeNameCtnr, pokeTypesCtnr);
}
