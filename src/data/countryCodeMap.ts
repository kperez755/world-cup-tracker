/**
 * Maps country names to ISO 3166-1 alpha-2 codes (lowercase) for flag rendering.
 * Covers all 48 qualified nations for the 2026 FIFA World Cup.
 */
export const COUNTRY_CODE_MAP: Record<string, string> = {
  // Group A
  'Canada': 'ca',
  'Mexico': 'mx',
  'United States': 'us',
  'USA': 'us',

  // Group B–L qualified teams (all 48)
  'Argentina': 'ar',
  'Australia': 'au',
  'Austria': 'at',
  'Belgium': 'be',
  'Bosnia and Herzegovina': 'ba',
  'Bosnia-Herzegovina': 'ba',
  'Brazil': 'br',
  'Cameroon': 'cm',
  'Cape Verde': 'cv',
  'Chile': 'cl',
  'Colombia': 'co',
  'Costa Rica': 'cr',
  'Croatia': 'hr',
  'Czech Republic': 'cz',
  'Denmark': 'dk',
  'DR Congo': 'cd',
  'Ecuador': 'ec',
  'Egypt': 'eg',
  'England': 'gb-eng',
  'France': 'fr',
  'Germany': 'de',
  'Ghana': 'gh',
  'Honduras': 'hn',
  'Indonesia': 'id',
  'Iran': 'ir',
  'Israel': 'il',
  'Italy': 'it',
  'Ivory Coast': 'ci',
  'Jamaica': 'jm',
  'Japan': 'jp',
  'South Korea': 'kr',
  'Korea Republic': 'kr',
  'Mali': 'ml',
  'Morocco': 'ma',
  'Netherlands': 'nl',
  'New Zealand': 'nz',
  'Nigeria': 'ng',
  'Norway': 'no',
  'Panama': 'pa',
  'Paraguay': 'py',
  'Peru': 'pe',
  'Poland': 'pl',
  'Portugal': 'pt',
  'Qatar': 'qa',
  'Saudi Arabia': 'sa',
  'Scotland': 'gb-sct',
  'Senegal': 'sn',
  'Serbia': 'rs',
  'Slovenia': 'si',
  'South Africa': 'za',
  'Spain': 'es',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Algeria': 'dz',
  'Tunisia': 'tn',
  'Turkey': 'tr',
  'Ukraine': 'ua',
  'Uruguay': 'uy',
  'Venezuela': 've',
  'Wales': 'gb-wls',

  // Placeholders
  'TBD': '',
};

/**
 * Get the ISO country code for a given team name.
 * Returns empty string if not found.
 */
export function getCountryCode(teamName: string): string {
  return COUNTRY_CODE_MAP[teamName] ?? '';
}
