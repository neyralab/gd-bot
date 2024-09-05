import gsap from 'gsap';

export const runItemsAnimation = (visibleStartIndex, visibleStopIndex, highestAnimatedIndex) => {
  const newItems = [];
  for (let i = visibleStartIndex; i <= visibleStopIndex; i++) {
    if (i > highestAnimatedIndex.current && i < history.length) {
      highestAnimatedIndex.current = i;
      newItems.push(
        `[data-animation="drive-file-animation-1"][data-index="${i}"]`
      );
    }
  }

  if (newItems.length > 0) {
    gsap.killTweensOf(newItems);

    gsap.fromTo(
      newItems,
      {
        opacity: 0,
        x: 280,
        y: -40,
        scale: 0
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(0.5)'
      }
    );
  }
};
