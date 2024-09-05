import { gsap } from 'gsap';

const setDisplayProperty = (selector, displayValue) => {
  document.querySelector(selector).style.display = displayValue;
};

export const showCategoriesAnimation = () => {
  const selector = `[data-animation="drive-categories-animation-1"]`;
  const displayValue = document.querySelector(selector).getAttribute('data-animation-display');
  
  gsap.to(selector, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.5,
    delay: 0,
    ease: 'back.out(0.5)',
    onStart: () => setDisplayProperty(selector, displayValue)
  });
};

export const showFilesListAnimation = () => {
  const selector = `[data-animation="drive-files-list-animation-1"]`;
  const displayValue = document.querySelector(selector).getAttribute('data-animation-display');
  
  gsap.to(selector, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.5,
    delay: 0,
    ease: 'back.out(0.5)',
    onStart: () => setDisplayProperty(selector, displayValue)
  });
};

export const hideCategoriesAnimation = () => {
  const selector = `[data-animation="drive-categories-animation-1"]`;
  
  gsap.to(selector, {
    opacity: 0,
    x: -500,
    y: 0,
    scale: 1,
    duration: 0.2,
    delay: 0,
    ease: 'back.in(1)',
    onComplete: () => setDisplayProperty(selector, 'none')
  });
};

export const hideFilesListAnimation = () => {
  const selector = `[data-animation="drive-files-list-animation-1"]`;
  
  gsap.to(selector, {
    opacity: 0,
    x: 500,
    y: 0,
    scale: 1,
    duration: 0.2,
    delay: 0,
    ease: 'back.in(1)',
    onComplete: () => setDisplayProperty(selector, 'none')
  });
};
