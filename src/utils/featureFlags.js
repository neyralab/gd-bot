const isEnabledPartners = JSON.parse(import.meta.env.VITE_FEATUE_PARTNERS_ENABLED || false);
const isEnabledConverter = JSON.parse(import.meta.env.VITE_FEATUE_CONVERTER_ENABLED || false);
const isEnabledMultilanguage = JSON.parse(import.meta.env.VITE_FEATUE_MULTILANGUAGE_ENABLED || false);

export { isEnabledPartners, isEnabledConverter, isEnabledMultilanguage }