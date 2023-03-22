import '@fortawesome/fontawesome-free/js/all.js';
import '@fortawesome/fontawesome-free/css/all.css';
import debounce from 'lodash.debounce';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Notiflix from 'notiflix';
import './css/styles.css';

const Notify = Notiflix.Notify;

Notiflix.Notify.init({useFontAwesome: true, fontAwesomeIconStyle: 'shadow', fontAwesomeIconSize: '14px',});

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const nameForSearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

nameForSearch.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {

    const countryName = e.target.value.trim();

// calling a fetch function
    if (countryName.length !== 0) {
        fetchCountries(countryName)
        .then(sortCountries)
        .catch(onFetchError);  
    }
      
};

// sorting web query results
function sortCountries(name) {

    countryList.innerHTML = '';
    countryInfo.innerHTML = '';

    if (name.status === 404) {

        Notify.failure('Oops, there is no country with that name',{useFontAwesome: true, fontAwesomeIconStyle: 'shadow', fontAwesomeClassName: 'fas fa-times-circle ', fontAwesomeIconSize: '14px',});
        
    } else if (name.length > 10) {

        countryList.innerHTML = '';
        countryInfo.innerHTML = '';

        moreThenTenCountriesInList();

    } else if (name.length >= 2 && name.length <= 10) {

        countryInfo.innerHTML = '';

        TwoTenCountriesInList(name);

    } else if (name.length === 1) {

        countryList.innerHTML = '';

        onlyOneCountryInList(name);
    };
};

// more then 10 countries found
function moreThenTenCountriesInList() {

    Notify.info('Too many matches found. Please enter a more specific name.', { fontAwesomeClassName: 'fas fa-info-circle', });

        // Notify.info('Too many matches found. Please enter a more specific name.', { useFontAwesome: true, fontAwesomeIconStyle: 'shadow', fontAwesomeIconSize: '14px', fontAwesomeClassName: 'fas fa-info-circle', })
   };

// 2 - 10 countries found
function TwoTenCountriesInList(shortArr) {

    const listOfItems = shortArr.map((shortArr ) => {
        
        return `<li class="list-item list"><img class="item-img" src="${shortArr.flags.svg}" alt="${shortArr.flags.alt}" width="35"></img>${shortArr.name.official}</li>`
    }).join('');

    return countryList.innerHTML = listOfItems;
};

// 1 country found
function onlyOneCountryInList(singleArr) {
    
    return countryInfo.innerHTML = 
    `<div class="heading-box">
    <img class="item-img" src="${singleArr[0].flags.svg}" alt="${singleArr[0].flags.alt}" width="35"></img>
    <h1 class="title">${singleArr[0].name.official}</h1>
    </div>
    <ul class="list">
    <li class="list-item"><p><b>Capital:</b> ${singleArr[0].capital[0]}</p></li>
    <li class="list-item"><p><b>Population:</b> ${singleArr[0].population}</p></li>
    <li class="list-item"><p><b>Languages:</b> ${Object.values(singleArr[0].languages).join(', ')}</p></li>
    </ul>`
};

// error was caught
function onFetchError() {
    console.error(error);
};