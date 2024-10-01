export const frameConeAnimation = (
  time,
  speedRef,
  outerConeRef,
  innerConeRef
) => {
  let scaleOuter = (1 + 0.2 * Math.sin(time * 100)) * speedRef.current;
  let scaleInner = (0.3 + 0.075 * Math.sin(time * 100)) * speedRef.current;
  let emissionIntensityOuter = 20 + 0.5 * Math.sin(time * 100);
  let emissionIntensityInner = 50 + 5 * Math.sin(time * 50);
  let opacityOuter = 0.1;
  let opacityInner = 0.1;

  if (speedRef.current <= 0) {
    opacityInner = 0;
    opacityOuter = 0;
  }

  if (speedRef.current < 0.01) {
    const factor = (speedRef.current / 0.5) * 1;
    emissionIntensityInner *= factor;
    opacityInner *= factor;
  }

  if (speedRef.current < 0.8) {
    const factor = (speedRef.current / 0.5) * 0.001;
    emissionIntensityInner *= factor;
    opacityInner *= factor;
  }

  if (outerConeRef.current) {
    outerConeRef.current.scale.set(1.5, scaleOuter, 1.5);
    outerConeRef.current.position.y = 1 * (scaleOuter - 1);
    outerConeRef.current.material.transparent = true;
    outerConeRef.current.material.emissiveIntensity = emissionIntensityOuter;
    outerConeRef.current.material.opacity = opacityOuter;
  }

  if (innerConeRef.current) {
    innerConeRef.current.scale.set(0.9, scaleInner, 0.9);
    innerConeRef.current.position.y = 0.3 * (scaleInner - 1) + 0.7;
    innerConeRef.current.material.transparent = true;
    innerConeRef.current.material.emissiveIntensity = emissionIntensityInner;
    innerConeRef.current.material.opacity = opacityInner;
  }
};
