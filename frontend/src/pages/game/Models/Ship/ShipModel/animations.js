import gsap from 'gsap';

export const stopAnimation = (context, timeout) => {
  if (timeout && timeout.current) {
    clearTimeout(timeout.current);
  }
  if (context.current) {
    context.current.kill();
    context.current = null;
  }
};

export const initialAnimationContext = (context, ref, onComplete) => {
  if (!ref.current) return;

  context.current = gsap.context(() => {
    if (ref) {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        }
      });
      tl.to(ref.current.position, {
        y: 0,
        duration: 1.4,
        ease: 'back.out(0.7)'
      }).to(ref.current.rotation, {
        y: -Math.PI / 2,
        duration: 1.5,
        ease: 'power4.inOut'
      });
    }
  });
};

export const pushAnimationContext = (context, ref) => {
  if (!ref.current) return;

  context.current = gsap.context(() => {
    gsap.to(ref.current.position, {
      keyframes: [
        { z: -0.3, duration: 0.1, ease: 'power1.out' },
        { z: 0, duration: 0.1, ease: 'power1.inOut' }
      ]
    });
    gsap.to(ref.current.rotation, {
      x: -0.3,
      duration: 0.5,
      ease: 'power4.out'
    });
  });
};

export const themeChangeAnimationContext = (context, ref, onComplete) => {
  if (!ref.current) return;

  context.current = gsap.context(() => {
    gsap.to(ref.current.rotation, {
      x: 0,
      duration: 1,
      ease: `power1.inOut`
    });

    /** New */
    gsap.to(ref.current.position, {
      y: 30,
      duration: 1,
      ease: 'back.in(1)',
      delay: 0.2,
      onComplete: () => {
        ref.current.rotation.y = -Math.PI * 2.5;
        ref.current.position.y = -20;
        ref.current.position.z = 0;
        onComplete?.();
      }
    });
  });
};

export const floatingAnimationContext = (context, ref, cleanupPower) => {
  if (!ref.current) return;

  context.current = gsap.context(() => {
    /** Cleanup */
    gsap.to(ref.current.position, {
      z: 0,
      y: 0,
      x: 0,
      duration: 1,
      ease: `power${cleanupPower}.inOut`
    });

    gsap.to(ref.current.rotation, {
      y: -Math.PI / 2,
      x: 0,
      duration: 2,
      ease: `power${cleanupPower}.inOut`
    });

    /** New */
    gsap.to(ref.current.position, {
      keyframes: [
        { z: -0.2, duration: 2, ease: 'sine.inOut' },
        { z: 0.2, duration: 2, ease: 'sine.inOut' }
      ],
      yoyo: true,
      repeat: -1,
      delay: 1.01
    });

    gsap.to(ref.current.rotation, {
      keyframes: [
        { y: -Math.PI / 1.9, duration: 2, ease: 'sine.inOut' },
        { y: -Math.PI / 2.1, duration: 2, ease: 'sine.inOut' }
      ],
      yoyo: true,
      delay: 2.01,
      repeat: -1,
      repeatDelay: 0
    });
  });
};

export const finishAnimationContext = (context, ref) => {
  if (!ref.current) return;

  context.current = gsap.context(() => {
    /** Cleanup */
    gsap.to(ref.current.position, {
      z: 0,
      duration: 0.1,
      ease: 'power1.out'
    });

    gsap.to(ref.current.rotation, {
      y: -Math.PI / 2,
      x: 0,
      duration: 0.1,
      ease: 'power1.out'
    });
  });
};

export const flyAnimationContext = (context, ref) => {
  if (!ref.current) return;

  context.current = gsap.context(() => {
    /** Cleanup */
    gsap.to(ref.current.rotation, {
      y: -Math.PI / 2,
      duration: 0.2
    });
    gsap.to(ref.current.position, {
      y: 0,
      duration: 0.5,
      ease: 'power4.out'
    });

    gsap.to(ref.current.rotation, {
      keyframes: [
        { y: -Math.PI / 2 - Math.PI, duration: 5, ease: 'power1.inOut' },
        { y: -Math.PI / 2 + Math.PI, duration: 2.5, ease: 'power4.inOut' }
      ],
      repeat: -1,
      repeatDelay: 4,
      delay: 2,
      yoyo: true
    });
  });
};
