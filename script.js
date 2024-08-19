'use strict';

///////////////////////////////////////
// Selection

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');
const section1 = document.getElementById('section--1');
const nav = document.querySelector('.nav');
//selecting tabs
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//as btnsOpenModal is nodel list let use for each method to loop over it
btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
/// Buton scroll

btnScrollTo.addEventListener('click', function (e) {
  //the old way
  // const s1Cords = section1.getBoundingClientRect();
  // console.log(s1Cords); ///we first get coordinates of element

  //   //we take current scroll coordinates + cordinates from element
  // window.scrollTo({
  //   left: s1Cords.left + window.pageXOffset,
  //   top: s1Cords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //the morden way
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
///Page navigation

//it isn't good idea to attach same event listiner to multiple elements
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//but we can havedo it by event delegation by put event listener to the common parent element
//we first define the common parent
//second we check for the target element
document.querySelector('.nav__links').addEventListener('click', function (el) {
  el.preventDefault();

  //for third we do the matching  strategy
  if (el.target.classList.contains('nav__link')) {
    const id = el.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//////////////////////////////////
////////////tabbed component

// //without using event delegation
// tabs.forEach(function (t) {
//   return t.addEventListener('click', function () {
//     console.log('whats up');
//   });
// });

//but the better practice is using event delegation
tabsContainer.addEventListener('click', function (t) {
  const clicked = t.target.closest('.operations__tab');
  console.log(clicked);

  //Guard close is morden way
  if (!clicked) return;

  // //old way
  // if (close) {
  //   clicked.classList.add('.operations__tab--active');
  // }

  //removing class
  tabs.forEach(function (t) {
    return t.classList.remove('operations__tab--active');
  });

  tabsContent.forEach(function (c) {
    return c.classList.remove('operations__content--active');
  });

  //activate the tab area
  clicked.classList.add('operations__tab--active');

  //activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////Menu Fade Animation////

//Dry
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(function (el) {
      if (el !== link) el.style.opacity = opacity;
    });

    logo.style.opacity = opacity;
  }
};

//as the event listener expect function to be passed in we better passing an argument to  the handler function
//add hover event
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

///remove the hover event
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

// ///implementing sticky navigation by using scroll event
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// //scroll event are on window not document
// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);
//   if (initialCoords.top < window.scrollY) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//the bettter of implementing sticky nabvigation is using intersecting api
// const observerCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOption = {
//   root: null,
//   threshold: [0, 0.5],
// };

// //the way of define our intersecting API
// const observer = new IntersectionObserver(observerCallback, obsOption);
// observer.observe(section1);

//real example
const header = document.querySelector('header');

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const sticyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerElement = new IntersectionObserver(sticyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerElement.observe(header);

/////using intersection obsever API to reveal section
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.12,
});

allSection.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

///implementing lazy loading images using intersection observer API
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); //it better to remove the after the looding event happen
  });

  observer.unobserve(entry.target); //stoping the task of keep looding
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-150px',
});

imgTargets.forEach(function (img) {
  imageObserver.observe(img);
});

//implementing slider

//we put all codes in one function so that we dont pollute the global anme space
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  let curSlide = 0;
  const maxSlide = slides.length;

  //Functions
  const createDot = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class= "dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDots = function (slide) {
    //first we remove the class for all dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dots => dots.classList.remove('dots__dot--active'));

    //we activate on the slide we want
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activeDots(curSlide);
  };

  const prevSlide = function () {
    if (curSlide == 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activeDots(curSlide);
  };

  //initialization
  const init = function () {
    createDot();
    activeDots(0);
    goToSlide(0);
    // 0%,100%,200%,300%
  };
  init();
  //handle eventlistener
  btnRight.addEventListener('click', nextSlide);
  //let curSlide=1: -100%,0%,100%,200%

  btnLeft.addEventListener('click', prevSlide);
  //keyboard
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log('Dot');
      // const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset; // similar to above but distracted
      goToSlide(slide);
      activeDots(slide);
    }
  });
};
slider();
/////////////////////////////////////////////
/////////////
/*

//selecting element using Js

//there special element that doesn't need a selector
console.log(document.documentElement); //for selecting the entire HTML(enetire page)
console.log(document.head);
console.log(document.body);

//other elemment by selecting them we need to use the point
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section'); // this one it return the nodelist which can't change after
console.log(allSections);

//by selecting element using this method we don't need the selector('.')
console.log(document.getElementById('section--1')); //return nodelist
const allButton = document.getElementsByClassName('btn'); //return HTML collection(code life collection)
console.log(allButton);

console.log(document.getElementsByTagName('button')); //this also retunt HTML collection means it can be changed

//creating and insert ht element

//1.insertAdjecentHTML() this methtod need two string argument
//the first is the position of the element the last is the html templete string to be inserted

//other method are to build from scracth

const message = document.createElement('div'); //here we just create a DOM element and store it but not yet in DOM
message.classList.add('cookie-message');
// message.textContent = `Cookies are little files that we save on your device to remember your preferences. We use necessary cookies to make our site work. We use site usage measurement cookies to analyse anonymised usage patterns, to make our websites better for you`;
message.innerHTML = `Cookies are little files that we save on your device to remember 
  your preferences.We use necessary cookies to make 
  our site work.<button class="btn  btn--close-coockie">Got It!</buttton>`;

//we goin to insert it to our DOM and this method add element as child element
// header.prepend(message);
header.append(message); //DOM element are unique can't happen at different place
//unless we can also insert multiple element by copy it
// header.append(message.cloneNode(true));

//other insert method but it insert element as sibling element
// header.before(message);
// header.after(message);

//removing the element

document
  .querySelector('.btn--close-coockie')
  .addEventListener('click', function () {
    // message.remove();
    //befero we use to select parenet element and remove the child element fom there
    message.parentElement.removeChild(message);
  });

//style
//1. how to set style for inline styles(meaning style we define manually = setted at dom)
message.style.backgroundColor = '#37383d'; //the value usaaly has to be a string
message.style.width = '120%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
///2.to read inline style
console.log(message.style.height);
console.log(message.style.backgroundColor);

///3.how to set real style or computed style
document.documentElement.style.setProperty('--color-primary', 'orangered'); //we can also use this method for inline styles

//4.we can also read the computed styles
console.log(getComputedStyle(message).height);
console.log(getComputedStyle(message).color);

//attribute
//1. how to read standard attribute=defaute property
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);

//2.set a standard attribute
logo.alt = 'Beautifull Minimalist Logo';

//3.to read Non-standard atttribute
console.log(logo.designer); //we can read them as standard
console.log(logo.getAttribute('designer'));

//4. to set a nion standard attribute
logo.setAttribute('company', 'Bankist');

//5.data attribute are special type of attribute used when we need to store data in UI
console.log(logo.dataset.versionNumber);

//note that there are absolute url and href  and (relative url and href from html)
//for url
console.log(logo.src); //absolute url
console.log(logo.getAttribute('src')); //relative url

//for links
const link = document.querySelector('.nav__link--btn');
console.log(link.href); //absolute href
console.log(link.getAttribute('href')); //relatve href

//classes
//best way to deal with class without interfering with other class were there
logo.classList.add('g'); // we use this method to set a classor classes
logo.classList.remove('g'); //for removing class
logo.classList.toggle('g');
logo.classList.contains('g'); //check if it includes a certain class

console.log(logo.className); //for reading value
//we can also se a classname property to set a value
// logo.className = 'Uwayezu'; //but don't use this cause it can override whatever we have


//implemanting scrollo btn



//eventListiner
//other event can be used for listinening
const h1 = document.querySelector('h1');

//to remove an event listiner we do have to have function from outside
const alertFunction = function (e) {
  alert("what's Up with you");

  //other way of removing help us to listiner to event one time
  // h1.removeEventListener('mouseenter', alertFunction);
};
//this event is similar t hover in css
h1.addEventListener('mouseenter', alertFunction);

//remove evnent listiner for howlong we have specify the duration
setTimeout(() => h1.removeEventListener('mouseenter', alertFunction), 5000);

// //the old way of adding eventlistiner directluy on element
// h1.onmouseenter = function (e) {
//   alert('hello there');
// };


//capture phase,target phase and bubbbling phase
//let first create a random color from 0-255
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
// console.log(randomInt(0, 255));
const randomColor = () => `rgb(
  ${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)}
)`;

//by defaut add event listeners method recieve events from target element
//and also for bubbling phase where it usually come from target up to parent element
document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Link', e.target); //target is an element where the event is orginated from
  console.log(e.currentTarget); //is same as this.keyword as it is the element on event handler are attached

  //for stopping propagation for event to go from down to up(target element to parent element)
  //and we advised to not use it often
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Container', e.target);
  console.log(e.currentTarget);
});

//in order to have capturing event for add event listener we have define third argumnent by set to true
//capture phase is when event comes from parent all the way to target element
//this element is listening event from DOM to target while the above one still bubbling
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('Nav', e.target);
    console.log(e.currentTarget);
  },
  true
);


//DOm Traversing means selecting element by using another element and also neeeded for doing complex event delegation

////by direct child element(Downward)
//read it
const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight')); ///used for children
console.log(h1);
console.log(h1.childNodes);
console.log(h1.children);

//define/set it
h1.firstElementChild.style.color = '#fff';
h1.lastElementChild.style.color = 'orangered';
////by direct parent element(Upward)
//read it
console.log(h1.parentElement);
console.log(h1.parentNode);
//define/set it
h1.closest('header').style.background = 'var(--gradient-secondary)'; //closest parent element for define element
h1.closest('h1').style.background = 'var(--gradient-primary)'; //closest element to the same element is the element itself

////by direct sibling(sideways) mostly we have previous and next sibling
//read it
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

//set/define it
//but when we want alll siblings of element
console.log(h1.parentElement.children); //as it is html colllection
[...h1.parentElement.children].forEach(function (el) {
  console.log(el);

  // if (el !== h1) el.style.scale = '0.5';
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

///lifecycle DOM events

//1.DOM content loaded is fired ondocument as soon as HTML completely parsed
//this event shouldn't be sused when we have a script tag in HTMl
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('the loading of HTML and JavaScript are done', e);
});

//but when we are using vanilla JavaScript from JQuery it more advised to use
// document.ready; as an equivalent to DOM contenet loaded event

//2.load event which is fired on window not noly the HTML parsed but all image and external source
window.addEventListener('load', function (e) {
  console.log('The whole page is full loaded', e);
});
//as this one requires to download and excute all code it will appear afer DOM  content loaded event

// //3.before Unload event also this one fired on window but before the user leave the page
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); //which is required to many browser but no chrome
//   // console.log(e);
//   e.returnValue = ''; //we leave it as empty string
// });
