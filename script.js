"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
// Menu fade animation

const handleHover = (e, opacity) => {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    // const siblings = link.closest(".nav").querySelector(".nav__link");
    const siblings = document.querySelectorAll(".nav__link");
    const logo = document.querySelector(".nav__logo");

    // console.log(siblings);
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });

    logo.style.opacity = opacity;
  }
};

nav.addEventListener("mouseover", e => {
  handleHover(e, 0.5);
});

nav.addEventListener("mouseout", e => {
  handleHover(e, 1);
});

//sticky navigation

// const cordinates = section1.getBoundingClientRect();
// window.addEventListener("scroll",() => {

//   if (window.scrollY > cordinates.top) {
//     nav.classList.add("sticky");
//   }else{
//     nav.classList.remove("sticky");
//   }
// });

// sticky navigation with intersection observer
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickynav = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const headerObserver = new IntersectionObserver(stickynav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections

const allSections = document.querySelectorAll(".section");

const revealSection = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

// modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//scrolling

btnScrollTo.addEventListener("click", () => {
  const s1cords = section1.getBoundingClientRect();

  /////////////// old school smooth scrolling//////////////////
  // window.scrollTo({
  //   left: s1cords.left + window.pageXOffset,
  //   top: s1cords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });
  //////////////////////////////////////////////////////////

  // modern way of smooth scrolling
  section1.scrollIntoView({
    behavior: "smooth",
  });
});

// lazy loading

const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //replace the src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach(img => imgObserver.observe(img));

// page navigation
// document.querySelectorAll(".nav__link").forEach(el => {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({
//       behavior: "smooth",
//     });
//   });
// });

document.querySelector(".nav__links").addEventListener("click", function (e) {
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault();
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
});

//tabbed component
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", e => {
  const clicked = e.target.closest(".operations__tab");

  // if(clicked){
  //   clicked.classList.add("operations__tab--active");
  // }

  //or else use a gaurd clause

  if (!clicked) return;
  // active tab
  tabs.forEach(tab => tab.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  // active content
  tabsContent.forEach(tab =>
    tab.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// slider

const sliderComponent = () => {
  const slides = document.querySelectorAll(".slide");
  const slider = document.querySelector(".slider");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const maxSlide = slides.length;
  let currentSlide = 0;

  // three dots
  const dotContainer = document.querySelector(".dots");

  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activateDot = slide => {
    const dots = document.querySelectorAll(`.dots__dot`);
    dots.forEach(dot => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  dotContainer.addEventListener("click", e => {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  const init = () => {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  //next slide

  const goToSlide = slide => {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  };

  init();

  const nextSlide = () => {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  btnRight.addEventListener("click", nextSlide);

  btnLeft.addEventListener("click", prevSlide);

  // key board
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  });
};
sliderComponent();
