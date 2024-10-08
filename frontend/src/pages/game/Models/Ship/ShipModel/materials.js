import { Color } from 'three';

export const setThemeMaterials = (theme, ref, accentRef) => {
  if (!ref.current || !theme) return;

  ref.current.traverse((child) => {
    if (child.isMesh) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      materials.forEach((material) => {
        switch (material.name) {
          case 'BaseMaterial':
            material.color.set(theme.colors.shipBase);
            material.metalness = theme.shipMetalness;
            material.roughness = theme.shipRoughness;
            break;
          case 'SecondaryColor':
            material.color.set(theme.colors.wing);
            material.metalness = theme.shipMetalness;
            material.roughness = theme.shipRoughness;
            break;
          case 'SecondaryColor2':
            material.color.set(theme.colors.wingAccent);
            material.metalness = theme.shipMetalness;
            material.roughness = theme.shipRoughness;
            break;
          case 'BaseEmission2':
            material.color.set(theme.colors.emission);
            material.emissive = new Color(theme.colors.emission);
            material.needsUpdate = true;
            break;
          case 'AccentDetailsEmission':
            material.color.set(theme.colors.accentEmission);
            material.emissive = new Color(theme.colors.accentEmission);
            material.emissiveIntensity = 8;
            material.needsUpdate = true;
            accentRef.current = material;
            break;
        }
      });
    }
  });
};
