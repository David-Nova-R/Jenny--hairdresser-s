import { Lang } from '../_context/language-context';

/**
 * Mapping des services de la BD vers leur affichage multilingue.
 * La clé = nom exact retourné par la BD (espagnol). Ne pas modifier les clés.
 * Modifier uniquement : title et description dans chaque langue.
 */
export interface HairStyleDisplay {
  title: string;
  description: string;
}

export type HairStyleConfig = Record<Lang, HairStyleDisplay>;

export const hairstyleConfig: Record<string, HairStyleConfig> = {
  'Tinte permanente': {
    es: { title: 'Tinte permanente',       description: 'Color duradero formulado para realzar tu tono natural.' },
    fr: { title: 'Couleur permanente',     description: 'Couleur longue durée pour sublimer votre teint naturel.' },
    en: { title: 'Permanent Colour',       description: 'Long-lasting colour crafted to match your unique tone.' },
  },
  'Tinte demipermanente': {
    es: { title: 'Tinte semipermanente',   description: 'Color vibrante con fórmula suave para un acabado luminoso.' },
    fr: { title: 'Couleur semi-permanente', description: 'Couleur vibrante avec une formule douce et lumineuse.' },
    en: { title: 'Semi-Permanent Colour',  description: 'Vibrant, fade-resistant colour with a gentle formula.' },
  },
  'Baño de color': {
    es: { title: 'Baño de color',          description: 'Reaviva tu color entre citas con un baño tonalizante.' },
    fr: { title: 'Bain de couleur',        description: 'Ravivez votre couleur entre les rendez-vous.' },
    en: { title: 'Colour Refresh',         description: 'Revive your colour between appointments with a toning bath.' },
  },
  'Técnicas de mechas y efectos de luz': {
    es: { title: 'Mechas y efectos de luz', description: 'Técnicas personalizadas para añadir dimensión y brillo.' },
    fr: { title: 'Mèches & effets de lumière', description: 'Techniques sur mesure pour apporter dimension et éclat.' },
    en: { title: 'Highlights & Lighting',  description: 'Custom highlight techniques for dimension and natural glow.' },
  },
  'Balayage': {
    es: { title: 'Balayage',              description: 'Color pintado a mano para un efecto natural y luminoso.' },
    fr: { title: 'Balayage',             description: 'Couleur peinte à la main pour un effet naturel et solaire.' },
    en: { title: 'Balayage',             description: 'Hand-painted colour for a seamless, sun-kissed effect.' },
  },
  'Baby Lights': {
    es: { title: 'Baby Lights',           description: 'Mechas ultrafinas para una iluminación delicada y luminosa.' },
    fr: { title: 'Baby Lights',          description: 'Mèches ultra-fines pour un résultat délicat et lumineux.' },
    en: { title: 'Baby Lights',          description: 'Ultra-fine highlights for a delicate, luminous look.' },
  },
  'Ombré': {
    es: { title: 'Ombré',                description: 'Degradado de raíces oscuras a puntas claras para un look atrevido.' },
    fr: { title: 'Ombré',               description: 'Dégradé de la racine sombre vers des pointes claires.' },
    en: { title: 'Ombré',               description: 'Gradient from dark roots to light ends for a bold finish.' },
  },
  'Californianas': {
    es: { title: 'Californianas',         description: 'Mechas cálidas y naturales inspiradas en el sol californiano.' },
    fr: { title: 'Mèches californiennes', description: 'Mèches chaudes et naturelles inspirées du soleil californien.' },
    en: { title: 'Californian Highlights', description: 'Warm, lived-in highlights inspired by the California sun.' },
  },
  'Cortes dama': {
    es: { title: 'Corte dama',            description: 'Corte de precisión adaptado a tu estilo y morfología.' },
    fr: { title: 'Coupe femme',          description: 'Coupe précise adaptée à votre style et morphologie.' },
    en: { title: "Women's Haircut",      description: 'Precision cut tailored to your style and face shape.' },
  },
  'Permanente hombres': {
    es: { title: 'Permanente hombre',     description: 'Rizos y ondas texturizados a tu gusto.' },
    fr: { title: 'Permanente homme',     description: 'Boucles et ondulations texturées selon vos préférences.' },
    en: { title: "Men's Perm",           description: 'Textured curls and waves shaped to your desired look.' },
  },
  'Keratina': {
    es: { title: 'Keratina',             description: 'Tratamiento alisador para eliminar el frizz y añadir brillo.' },
    fr: { title: 'Kératine',            description: 'Soin lissant pour éliminer le frizz et apporter de l\'éclat.' },
    en: { title: 'Keratin Treatment',   description: 'Smoothing treatment to eliminate frizz and add lasting shine.' },
  },
  'Aminoácido': {
    es: { title: 'Aminoácido',           description: 'Tratamiento reparador profundo para restaurar fuerza y suavidad.' },
    fr: { title: 'Acides aminés',       description: 'Soin réparateur profond pour restaurer force et douceur.' },
    en: { title: 'Amino Acid Treatment', description: 'Deep repair treatment to restore strength and softness.' },
  },
  'Terapia capilar': {
    es: { title: 'Terapia capilar',      description: 'Cuidado nutritivo intensivo para cabello dañado o seco.' },
    fr: { title: 'Thérapie capillaire', description: 'Soin nourrissant intensif pour cheveux abîmés ou secs.' },
    en: { title: 'Hair Therapy',        description: 'Intensive nourishing care for damaged or dry hair.' },
  },
  'Cepillados': {
    es: { title: 'Cepillado',            description: 'Brushing profesional para un acabado liso y voluminoso.' },
    fr: { title: 'Brushing',            description: 'Brushing professionnel pour un résultat lisse et volumineux.' },
    en: { title: 'Blowout',             description: 'Professional blowout for a smooth, voluminous finish.' },
  },
  'Peinados': {
    es: { title: 'Peinados',             description: 'Recogidos y estilos elegantes para tus ocasiones especiales.' },
    fr: { title: 'Coiffures',           description: 'Coiffures élégantes pour vos occasions spéciales.' },
    en: { title: 'Hairstyling',         description: 'Elegant updos and styling for your special occasions.' },
  },
};

export const defaultDisplay: Record<Lang, HairStyleDisplay> = {
  es: { title: 'Servicio de cabello',  description: 'Servicio profesional de peluquería en estudio privado.' },
  fr: { title: 'Service capillaire',   description: 'Service de coiffure professionnel en studio privé.' },
  en: { title: 'Hair Service',         description: 'Professional hair service in a private studio setting.' },
};

export function getHairStyleDisplay(name: string, lang: Lang): HairStyleDisplay {
  return hairstyleConfig[name]?.[lang] ?? defaultDisplay[lang];
}
