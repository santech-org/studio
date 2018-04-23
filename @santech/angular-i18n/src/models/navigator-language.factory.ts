export function navigatorLanguageFactory(navigator: Navigator) {
  const navLng = navigator.language
    ? navigator.language.substr(0, 2)
    : 'fr';
  return ['en', 'fr'].find((lg) => lg === navLng) ? navLng : 'fr';
}
