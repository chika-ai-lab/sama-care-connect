export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const countries: Country[] = [
  {
    code: 'SN',
    name: 'Sénégal',
    dialCode: '+221',
    flag: '🇸🇳'
  }
];

/**
 * Normalise un numéro de téléphone en ajoutant l'indicatif pays
 * @param phoneNumber - Le numéro de téléphone local (sans indicatif)
 * @param countryCode - Le code pays (ex: 'SN')
 * @returns Le numéro complet avec indicatif (ex: '+221701234567')
 */
export const phoneNormalizer = (phoneNumber: string, countryCode: string = 'SN'): string => {
  // Nettoyer le numéro : enlever espaces, tirets, parenthèses
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // Trouver le pays
  const country = countries.find(c => c.code === countryCode);
  if (!country) {
    throw new Error(`Code pays non supporté: ${countryCode}`);
  }
  
  // Si le numéro commence déjà par l'indicatif, le retourner tel quel
  if (cleanNumber.startsWith(country.dialCode)) {
    return cleanNumber;
  }
  
  // Si le numéro commence par +, le retourner tel quel (supposé déjà formaté)
  if (cleanNumber.startsWith('+')) {
    return cleanNumber;
  }
  
  // Si le numéro commence par 0, le retirer (format local)
  const numberWithoutZero = cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber;
  
  // Ajouter l'indicatif pays
  return `${country.dialCode}${numberWithoutZero}`;
};

/**
 * Formate un numéro pour l'affichage
 * @param phoneNumber - Le numéro complet avec indicatif
 * @returns Le numéro formaté pour affichage (ex: '+221 70 123 45 67')
 */
export const formatPhoneDisplay = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Pour le Sénégal (+221), formater en groupes de 2
  if (phoneNumber.startsWith('+221')) {
    const number = phoneNumber.slice(4); // Enlever '+221'
    const formatted = number.match(/.{1,2}/g)?.join(' ') || number;
    return `+221 ${formatted}`;
  }
  
  return phoneNumber;
};

/**
 * Valide un numéro de téléphone sénégalais
 * @param phoneNumber - Le numéro à valider
 * @returns true si le numéro est valide
 */
export const isValidSenegalPhone = (phoneNumber: string): boolean => {
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // Format avec indicatif: +221 suivi de 9 chiffres (70, 76, 77, 78)
  const withDialCodePattern = /^\+221[7][0678]\d{7}$/;
  
  // Format local: 9 chiffres commençant par 70, 76, 77, 78
  const localPattern = /^[7][0678]\d{7}$/;
  
  // Format local avec 0: 10 chiffres commençant par 070, 076, 077, 078
  const localWithZeroPattern = /^0[7][0678]\d{7}$/;
  
  return withDialCodePattern.test(cleanNumber) || 
         localPattern.test(cleanNumber) || 
         localWithZeroPattern.test(cleanNumber);
};
