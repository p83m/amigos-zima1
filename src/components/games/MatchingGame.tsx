import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { winterWords, shuffleArray } from '@/data/winterWords';
import { Check } from 'lucide-react';

interface MatchingGameProps {
  onCorrectMatch?: () => void;
  onWrongMatch?: () => void;
  onCardClick?: () => void;
}

const MatchingGame = ({ onCorrectMatch, onWrongMatch, onCardClick }: MatchingGameProps) => {
  const [polishWords, setPolishWords] = useState(shuffleArray([...winterWords]));
  const [spanishWords, setSpanishWords] = useState(shuffleArray([...winterWords]));
  const [selectedPolish, setSelectedPolish] = useState<number | null>(null);
  const [selectedSpanish, setSelectedSpanish] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [wrongAnimation, setWrongAnimation] = useState<number | null>(null);

  // Przetasuj na początku
  useEffect(() => {
    setPolishWords(shuffleArray([...winterWords]));
    setSpanishWords(shuffleArray([...winterWords]));
  }, []);

  const handlePolishClick = (index: number) => {
    // Jeśli para już dopasowana, ignoruj
    if (matchedPairs.has(polishWords[index].pl)) return;
    
    onCardClick?.(); // Dźwięk kliknięcia
    setSelectedPolish(index);
    
    // Jeśli już wybrano hiszpańskie słowo, sprawdź dopasowanie
    if (selectedSpanish !== null) {
      checkMatch(index, selectedSpanish);
    }
  };

  const handleSpanishClick = (index: number) => {
    // Jeśli para już dopasowana, ignoruj
    if (matchedPairs.has(spanishWords[index].pl)) return;
    
    onCardClick?.(); // Dźwięk kliknięcia
    setSelectedSpanish(index);
    
    // Jeśli już wybrano polskie słowo, sprawdź dopasowanie
    if (selectedPolish !== null) {
      checkMatch(selectedPolish, index);
    }
  };

  const checkMatch = (plIndex: number, esIndex: number) => {
    const polishWord = polishWords[plIndex];
    const spanishWord = spanishWords[esIndex];
    
    if (polishWord.pl === spanishWord.pl) {
      // Poprawne dopasowanie! 🎉
      onCorrectMatch?.(); // Odtwórz dźwięk sukcesu
      setTimeout(() => {
        setMatchedPairs(new Set([...matchedPairs, polishWord.pl]));
        setSelectedPolish(null);
        setSelectedSpanish(null);
      }, 500);
    } else {
      // Złe dopasowanie 😢
      onWrongMatch?.(); // Odtwórz dźwięk błędu
      setWrongAnimation(Date.now());
      setTimeout(() => {
        setSelectedPolish(null);
        setSelectedSpanish(null);
        setWrongAnimation(null);
      }, 800);
    }
  };

  const isMatched = (word: string) => matchedPairs.has(word);

  return (
    <div className="p-4 md:p-8">
      {/* Nagłówek */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Dopasuj słówka! 🎯</h2>
        <p className="text-lg md:text-xl text-muted-foreground">
          Kliknij polskie słowo, a potem hiszpańskie
        </p>
        <div className="mt-4 text-xl">
          Dopasowano: <span className="text-2xl font-bold text-primary">{matchedPairs.size}</span> / {winterWords.length}
        </div>
      </div>

      {/* Congratulations message */}
      {matchedPairs.size === winterWords.length && (
        <div className="text-center mb-6 animate-bounce-in">
          <div className="bg-primary text-primary-foreground px-8 py-4 rounded-3xl inline-block text-2xl font-bold">
            🎉 Świetnie! Dopasowałeś wszystkie słówka! 🎉
          </div>
        </div>
      )}

      {/* Siatka z kafelkami */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Kolumna polska */}
        <div className="space-y-3">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-4 text-foreground">Polski 🇵🇱</h3>
          {polishWords.map((word, index) => (
            <Card
              key={`pl-${index}`}
              onClick={() => handlePolishClick(index)}
              className={`p-4 md:p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                isMatched(word.pl)
                  ? 'bg-primary text-primary-foreground opacity-60'
                  : selectedPolish === index
                  ? 'bg-winter-ice scale-105 shadow-lg'
                  : wrongAnimation && selectedPolish === index
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-winter-mint hover:bg-winter-ice'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl md:text-4xl">{word.emoji}</span>
                  <span className="text-xl md:text-2xl font-semibold">{word.pl}</span>
                </div>
                {isMatched(word.pl) && (
                  <Check className="h-6 w-6 md:h-8 md:w-8 animate-pop" />
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Kolumna hiszpańska */}
        <div className="space-y-3">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-4 text-foreground">Español 🇪🇸</h3>
          {spanishWords.map((word, index) => (
            <Card
              key={`es-${index}`}
              onClick={() => handleSpanishClick(index)}
              className={`p-4 md:p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                isMatched(word.pl)
                  ? 'bg-primary text-primary-foreground opacity-60'
                  : selectedSpanish === index
                  ? 'bg-winter-lavender scale-105 shadow-lg'
                  : wrongAnimation && selectedSpanish === index
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-winter-pink hover:bg-winter-lavender'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl md:text-2xl font-semibold">{word.es}</span>
                {isMatched(word.pl) && (
                  <Check className="h-6 w-6 md:h-8 md:w-8 animate-pop" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingGame;
