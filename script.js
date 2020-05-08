
//https://www.themealdb.com/api.php

const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals');
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');
  errorMssg = document.getElementById('error');


//Search meal and fetch from API , loop through all meals 
function searchMeal(e) {
  e.preventDefault();

  //Clear single meal 
  single_mealEl.innerHTML = "";

  //Get  search input item
  const term = search.value;
  
  // Check for empty 
  if(term.trim()){
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    .then(res => res.json())
    .then(data=> {
      console.log(data);
      resultHeading.innerHTML=`<h2>Search results for '${term}'<h2>`

      if(data.meals == null){
        resultHeading.innerHTML=`<p> There are no search results please try again </p>`
      } else {
        // Map through meals we get back
        mealsEl.innerHTML = data.meals.map(meal => `
        <div class="meal">
          <img src= "${meal.strMealThumb}"  alt="${meal.strMeal}">
          <div class="meal-info" data-mealID="${meal.idMeal}">
          <h3>${meal.strMeal}<h3>
          </div>
          </div>
          `)
          .join('');   
      }
    });
    //Clear search text 
    search.value = '';

  } else {
    errorMssg.innerHTML=`<p>Please enter a search term</p>`;

    setTimeout(function(){
      errorMssg.innerHTML = ''
    }, 1000);
    console.log(errorMssg.innerHTML)
    //alert('Please enter a search term');
  }

}
//Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
  .then(res => res.json())
  .then(data => {
    const meal= data.meals[0];
    console.log(data);

    addMealToDOM(meal);
  });

}

// Fetch Random meal from API 
function getRandomMeal() {
  //Clear meals and heading already existing in the DOM
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)

  .then(res => res.json())
  .then(data => {
    const randomMeal = data.meals[0];
    console.log(randomMeal);

    addMealToDOM(randomMeal);
  })


}

// Add meal to DOM - function details below 
function addMealToDOM(meal){
  const ingredients =[];

  for(let i=1; i <= 20; i++) {
    if(meal[`strIngredient${i}`]){
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }else {
      break;
    }
    }
    single_mealEl.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
    <p>${meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul> 
    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
    </div>
    </div>

    `;
 
  }


 // Event listeners for search
submit.addEventListener('submit', searchMeal);

random.addEventListener('click', getRandomMeal);


// click and have the info shown below; add event listener 
mealsEl.addEventListener('click', e => {
// goes through all child items from the event 
  const mealInfo = e.path.find(item =>{
  if(item.classList) {
    return item.classList.contains('meal-info');
  } else{
    return false;
  }
  });
  if(mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');

    getMealById(mealID);

    console.log(mealID);
  }
  
  console.log(mealInfo);
})
































