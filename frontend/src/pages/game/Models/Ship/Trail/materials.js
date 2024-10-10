import { Color } from 'three';

export const setTrailMaterials = (theme, outerConeRef, innerConeRef) => {
  if (!outerConeRef.current || !innerConeRef.current || !theme) return;

  const outerMaterial = outerConeRef.current.material;
  outerMaterial.color.set(theme.colors.shipTrailEmission);
  outerMaterial.emissive = new Color(theme.colors.shipTrailEmission);
  outerMaterial.transparent = true;
  outerMaterial.opacity = 0;
  outerMaterial.emissiveIntensity = 0;

  const innerMaterial = innerConeRef.current.material;
  innerMaterial.color.set('#FFFFFF');
  innerMaterial.emissive = new Color('#FFFFFF');
  innerMaterial.transparent = true;
  innerMaterial.opacity = 0;
  innerMaterial.emissiveIntensity = 0;
  innerMaterial.depthTest = false;
};
