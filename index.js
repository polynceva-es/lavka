const products = [
  { name: "wine", id: 1, src: "./images/Wine.svg" },
  { name: "milk", id: 2, src: "./images/Milk.svg" },
  { name: "jam", id: 3, src: "./images/Jam.svg" },
  { name: "cheese", id: 4, src: "./images/Cheese.svg" },
  { name: "meat", id: 5, src: "./images/Meat.svg" },
  { name: "chicken", id: 6, src: "./images/Chicken.svg" },
  { name: "chips", id: 7, src: "./images/Chips.svg" },
  { name: "pinaple", id: 8, src: "./images/Pinaple.svg" },
  { name: "bananas", id: 9, src: "./images/Bananas.svg" },
  { name: "apple", id: 10, src: "./images/Apple.svg" },
  { name: "salad", id: 11, src: "./images/Salad.svg" },
];

const contentSection = document.querySelector(".content");
const button = contentSection.querySelector(".content__button");
const cabinet = contentSection.querySelector(".content__cabinet"); //шкаф
const cart = contentSection.querySelector(".content__cart"); //корзина
const productsList = cabinet.querySelectorAll(".content__product");

const fillCabinet = (array) => {
    array.map((item) => {
    cabinet.insertAdjacentHTML(
      "beforeend",
      `<li class="content__product" id=${item.name} key=${item.name}><img src=${item.src} alt=${item.name}/></li>`
    );
  });
};
fillCabinet(products);

    // find the element that you want to drag.
    var wine = document.getElementById('wine');
    
    /* listen to the touchMove event,
    every time it fires, grab the location
    of touch and assign it to box */
    
    wine.addEventListener('touchmove', function(e) {
      // grab the location of touch
      var touchLocation = e.targetTouches[0];
      
      // assign box new coordinates based on the touch.
      wine.style.left = touchLocation.pageX + 'px';
      wine.style.top = touchLocation.pageY + 'px';
    })
    
    /* record the position of the touch
    when released using touchend event.
    This will be the drop position. */
    
    wine.addEventListener('touchend', function(e) {
      // current box position.
      var x = parseInt(wine.style.left);
      var y = parseInt(wine.style.top);
    })
    








button.addEventListener("click", () =>
  location.assign("https://lavka.yandex.ru/")
);
