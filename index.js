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
    button.removeAttribute("disabled");
    button.classList.add("content__button_visible");
  } else {
    button.setAttribute("disabled", true);
    button.classList.remove("content__button_visible");
  }
};

const handleButtonClick = (array) => {
  console.log(array);
  navigateToLavka();
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

const handleMove = (product, x, y, currentDroppable) => {
  product.hidden = true;
  let elemBelow = document.elementFromPoint(x, y);
  product.hidden = false;
  if (!elemBelow) return;

  let cart = elemBelow.closest(".content__cart");
  let cartList = contentSection.querySelector(".content__cart-list")

  if (currentDroppable != cart) {
    if (currentDroppable) {
      //убрать из корзины
      deleteProductFromCart(product);
    }
    currentDroppable = cart;
    if (currentDroppable) {
      //положить в корзину
      addProductInCart(product);
      cartList.append(product);
      product.classList.remove('content__product_absolute');
      product.style.position = "";
      product.classList.add('content__product_static');
      product.style.top="";
      product.style.left = "";
    }
  }
};

const fillCabinet = (array) => {
  array.map((item) => {
    cabinet.insertAdjacentHTML(
      "beforeend",
      `<li class="content__product content__product_absolute" id=${item.name} key=${item.name}><img class="content__img" src=${item.src} alt=${item.name}></li>`
    );
  });
};
fillCabinet(products);

let moveTouchObject = [];

const productsList = cabinet.querySelectorAll(".content__product");
productsList.forEach((product) => {
  product.addEventListener("dragstart", (event) => event.preventDefault());
  const onTouchend = (event) => {
    event.preventDefault();
    moveTouchObject = moveTouchObject.filter(
      (el) => el.name !== event.target.alt
    );
  };

  const onTouchstart = (event) => {
    event.preventDefault();
    let touch = event.targetTouches[0];
    if (
      moveTouchObject.find((el) => el.name === event.target.alt) === undefined
    ) {
      let shiftX = touch.clientX - product.getBoundingClientRect().left;
      let shiftY = touch.clientY - product.getBoundingClientRect().top;
      const shiftObject = {
        name: event.target.alt,
        shiftX,
        shiftY,
        currentDroppable: null,
      };
      moveTouchObject.push(shiftObject);

      product.style.position = "absolute";
      product.style.zIndex = 5;
      document.body.append(product);
      product.style.left = `${touch.pageX - shiftObject.shiftX}px`;
      product.style.top = `${touch.pageY - shiftObject.shiftY}px`;
    }
  };

  const onTouchmove = (event) => {
    event.preventDefault();
    let touch = event.targetTouches[0];
    const shiftObject = moveTouchObject.find(
      (el) => el.name === event.target.alt
    );
    product.style.left = `${touch.pageX - shiftObject.shiftX}px`;
    product.style.top = `${touch.pageY - shiftObject.shiftY}px`;

    let currentDroppable = shiftObject.currentDroppable;

    handleMove(product, touch.clientX, touch.clientY, currentDroppable);
  };

  const onMouseDown = (event) => {
    let shiftX = event.clientX - product.getBoundingClientRect().left;
    let shiftY = event.clientY - product.getBoundingClientRect().top;

    product.style.position = "absolute";
    product.style.zIndex = 5;
    document.body.append(product);

    // переносит продукт на координаты (pageX, pageY), учитывая изначальный сдвиг относительно указателя мыши
    const moveAt = (pageX, pageY) => {
      product.style.left = pageX - shiftX + "px";
      product.style.top = pageY - shiftY + "px";
    };

    moveAt(event.pageX, event.pageY);

    // потенциальная цель переноса, над которой мы пролетаем прямо сейчас
    let currentDroppable = null;

    const onMouseMove = (event) => {
      moveAt(event.pageX, event.pageY);
      handleMove(product, event.clientX, event.clientY, currentDroppable);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  product.addEventListener("touchmove", onTouchmove);
  product.addEventListener("mousedown", onMouseDown);
  product.addEventListener("touchstart", onTouchstart);
  product.addEventListener("touchend", onTouchend);
});

button.addEventListener("click", () => handleButtonClick(productsInCart));
