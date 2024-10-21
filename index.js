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

let productsInCart = [];

const contentSection = document.querySelector(".content");
const button = contentSection.querySelector(".content__button");
const cabinet = contentSection.querySelector(".content__cabinet"); //шкаф
const cart = contentSection.querySelector(".content__cart"); //корзина

const navigateToLavka = () => {
  location.assign("https://lavka.yandex.ru/");
};

const showButton = () => {
  if (productsInCart.length >= 3) {
    button.classList.add("content__button_visible");
  } else {
    button.classList.remove("content__button_visible");
  }
};

const handleButtonClick = (array) => {
  console.log(array);
  // navigateToLavka();
};

const addProductInCart = (product) => {
  const newElem = productsInCart.find((el) => product.id === el.name);
  if (!newElem) {
    productsInCart.push({ name: product.id });
  }
  showButton();
};

const deleteProductFromCart = (product) => {
  const deletedElem = productsInCart.find((el) => product.id === el.name);
  const filteredProducts = productsInCart.filter((elem) => {
    return elem.name !== deletedElem.name;
  });
  productsInCart = filteredProducts;
  showButton();
};

const handleMouseMove = (evt, element) => {
  console.log(evt);
  element.style.position = "absolute";
  element.style.top = evt.clientY + "px";
  element.style.left = evt.clientX + "px";
};

const handleMouseDown = (evt, element) => {
  //   console.log(element);
  //   addProductInCart(element);
};

const fillCabinet = (array) => {
  array.map((item) => {
    cabinet.insertAdjacentHTML(
      "beforeend",
      `<li class="content__product" id=${item.name} key=${item.name}><img src=${item.src} alt=${item.name}></li>`
    );
  });
};
fillCabinet(products);

let moveTouchObject = [];

const productsList = cabinet.querySelectorAll(".content__product");
productsList.forEach((product) => {

  product.addEventListener("touchend", (e) => {
    e.preventDefault();
    moveTouchObject=moveTouchObject.filter((el) => el.name !== e.target.alt) 
  }, false);

  product.addEventListener("touchstart", (e) => {
    e.preventDefault();
    let touch = e.targetTouches[0];
    if (
      moveTouchObject.find((el) => el.name === e.target.alt) === undefined
    ) {
      let shiftX = touch.clientX - product.getBoundingClientRect().left;
      let shiftY = touch.clientY - product.getBoundingClientRect().top;
      const shiftObject = { name: e.target.alt, shiftX, shiftY, currentDroppable: null }
      moveTouchObject.push(shiftObject);

      product.style.position = "absolute";
      product.style.zIndex = 5;
      document.body.append(product);
      product.style.left = `${touch.pageX - shiftObject.shiftX}px`;
      product.style.top = `${touch.pageY - shiftObject.shiftY}px`;
    } 
  }, false);

  product.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      let touch = e.targetTouches[0];
      const shiftObject = moveTouchObject.find((el) => el.name === e.target.alt)
      product.style.left = `${touch.pageX - shiftObject.shiftX}px`;
      product.style.top = `${touch.pageY - shiftObject.shiftY}px`;
      
      let currentDroppable = shiftObject.currentDroppable;

      product.hidden = true;
      let elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      product.hidden = false;

      // событие mousemove может произойти и когда указатель за пределами окна
      // (мяч перетащили за пределы экрана)

      // если clientX/clientY за пределами окна, elementFromPoint вернёт null
      if (!elemBelow) return;

      // потенциальные цели переноса помечены классом 'content__cart' (может быть и другая логика)
      let droppableBelow = elemBelow.closest(".content__cart");

      if (currentDroppable != droppableBelow) {
        // мы либо залетаем на цель, либо улетаем из неё
        // внимание: оба значения могут быть null
        //   currentDroppable=null,
        //     если мы были не над droppable до этого события (например, над пустым пространством)
        //   droppableBelow=null,
        //     если мы не над droppable именно сейчас, во время этого события

        if (currentDroppable) {
          // логика обработки процесса "вылета" из droppable (удаляем подсветку)
          deleteProductFromCart(product);
        }
        currentDroppable = droppableBelow;
        shiftObject.currentDroppable = droppableBelow
        if (currentDroppable) {
          // логика обработки процесса, когда мы "влетаем" в элемент droppable
          addProductInCart(product);
        }
      }
    },
    false
  );

  product.onmousedown = function (event) {
    let shiftX = event.clientX - product.getBoundingClientRect().left;
    let shiftY = event.clientY - product.getBoundingClientRect().top;

    product.style.position = "absolute";
    product.style.zIndex = 5;
    document.body.append(product);

    moveAt(event.pageX, event.pageY);

    // переносит продукт на координаты (pageX, pageY),
    // дополнительно учитывая изначальный сдвиг относительно указателя мыши
    function moveAt(pageX, pageY) {
      product.style.left = pageX - shiftX + "px";
      product.style.top = pageY - shiftY + "px";
    }

    // потенциальная цель переноса, над которой мы пролетаем прямо сейчас
    let currentDroppable = null;

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);

      product.hidden = true;
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      product.hidden = false;

      // событие mousemove может произойти и когда указатель за пределами окна
      // (мяч перетащили за пределы экрана)

      // если clientX/clientY за пределами окна, elementFromPoint вернёт null
      if (!elemBelow) return;

      // потенциальные цели переноса помечены классом 'content__cart' (может быть и другая логика)
      let droppableBelow = elemBelow.closest(".content__cart");

      if (currentDroppable != droppableBelow) {
        // мы либо залетаем на цель, либо улетаем из неё
        // внимание: оба значения могут быть null
        //   currentDroppable=null,
        //     если мы были не над droppable до этого события (например, над пустым пространством)
        //   droppableBelow=null,
        //     если мы не над droppable именно сейчас, во время этого события

        if (currentDroppable) {
          // логика обработки процесса "вылета" из droppable (удаляем подсветку)
          deleteProductFromCart(product);
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          // логика обработки процесса, когда мы "влетаем" в элемент droppable
          addProductInCart(product);
        }
      }
    }

    // передвигаем продукт при событии mousemove
    document.addEventListener("mousemove", onMouseMove);

    // отпустить продукт, удалить ненужные обработчики
    product.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      product.onmouseup = null;
    };
  };

  product.ondragstart = () => {
    return false;
  };
});

button.addEventListener("click", () => handleButtonClick(productsInCart));
