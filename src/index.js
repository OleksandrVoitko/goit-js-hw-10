import './css/styles.css';
import countryInfoTpl from './templates/country-info-card.hbs';
import countryListTpl from './templates/country-card.hbs';
import debounce from 'lodash/debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  searchBox: document.querySelector('#search-box'),
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};

refs.searchBox.addEventListener('input', debounce(onSearchBox, DEBOUNCE_DELAY));

function onSearchBox(e) {
  if (e.target.value === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(e.target.value).then(renderCountries).catch(onFetchError);
}

function renderCountries(countries) {
  if (countries.length > 10) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    Notify.info(`Too many matches found. Please enter a more specific name.`);
    // console.log('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countries.length > 2 && countries.length < 10) {
    refs.countryInfo.innerHTML = '';
    const markupList = countryListTpl(countries);
    refs.countryList.innerHTML = markupList;
  } else {
    refs.countryList.innerHTML = '';
    const markupInfo = countryInfoTpl(countries);
    refs.countryInfo.innerHTML = markupInfo;
  }
}

function onFetchError(error) {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  Notify.failure(`Oops, there is no country with that name.`);
  //   console.log('Oops, there is no country with that name. ', error);
}
