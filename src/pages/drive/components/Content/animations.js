import { gsap } from 'gsap';

export const showCategoriesAnimation = () => {
  gsap.to(`[data-animation="drive-categories-animation-1"]`, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.5,
    delay: 0,
    ease: 'back.out(0.5)'
  });
};

export const showFilesListAnimation = () => {
  gsap.to(`[data-animation="drive-files-list-animation-1"]`, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.5,
    delay: 0,
    ease: 'back.out(0.5)'
  });
};

export const hideCategoriesAnimation = () => {
  gsap.to(`[data-animation="drive-categories-animation-1"]`, {
    opacity: 0,
    x: -500,
    y: 0,
    scale: 1,
    duration: 0.2,
    delay: 0,
    ease: 'back.in(1)'
  });
};

export const hideFilesListAnimation = () => {
  gsap.to(`[data-animation="drive-files-list-animation-1"]`, {
    opacity: 0,
    x: 500,
    y: 0,
    scale: 1,
    duration: 0.2,
    delay: 0,
    ease: 'back.in(1)'
  });
};
