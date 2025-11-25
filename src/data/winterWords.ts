// Słówka zimowe do nauki hiszpańskiego
export interface WinterWord {
  pl: string;
  es: string;
  emoji: string;
}

export const winterWords: WinterWord[] = [
  { pl: "śnieg", es: "la nieve", emoji: "❄️" },
  { pl: "bałwan", es: "el muñeco de nieve", emoji: "⛄" },
  { pl: "rękawiczki", es: "los guantes", emoji: "🧤" },
  { pl: "szalik", es: "la bufanda", emoji: "🧣" },
  { pl: "czapka", es: "el gorro", emoji: "🧢" },
  { pl: "kurtka", es: "el abrigo", emoji: "🧥" },
  { pl: "łyżwy", es: "los patines", emoji: "⛸️" },
  { pl: "śnieżka", es: "la bola de nieve", emoji: "⚪" },
];

// Funkcja pomocnicza do losowania słówka
export const getRandomWord = (exclude?: WinterWord): WinterWord => {
  const available = exclude 
    ? winterWords.filter(w => w.pl !== exclude.pl)
    : winterWords;
  return available[Math.floor(Math.random() * available.length)];
};

// Funkcja do przetasowania tablicy
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
