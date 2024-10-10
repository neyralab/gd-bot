import { Color } from "three";

export const setThemeMaterials = (theme, ref) => {
  if (!ref.current || !theme) return;

  ref.current.traverse((child) => {
    if (child.isMesh) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      materials.forEach((material) => {
        material.transparent = true; 
        material.opacity = 0;

        switch (material.name) {
          case 'BaseMaterial':
            material.color.set(theme.colors.shipBase);
            material.metalness = theme.shipMetalness;
            material.roughness = theme.shipRoughness;
            break;

          case 'BaseEmission2':
            material.color.set(theme.colors.emission);
            material.emissive = new Color(theme.colors.emission);
            material.needsUpdate = true;
            break;
        }
      });
    }
  });
};
