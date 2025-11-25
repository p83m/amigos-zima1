import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getRandomWord, type WinterWord } from '@/data/winterWords';
import { Dices } from 'lucide-react';

interface DiceGameProps {
  onDiceRoll?: () => void;
}

const DiceGame = ({ onDiceRoll }: DiceGameProps) => {
  const [currentWord, setCurrentWord] = useState<WinterWord | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());

  const rollDice = () => {
    setIsRolling(true);
    onDiceRoll?.(); // Odtwórz dźwięk rzutu kostką
    
    // Animacja trwa 500ms
    setTimeout(() => {
      const newWord = getRandomWord();
      setCurrentWord(newWord);
      setIsRolling(false);
      
      // Dodaj słówko do poznanych
      if (!learnedWords.has(newWord.pl)) {
        setLearnedWords(new Set([...learnedWords, newWord.pl]));
        setLearnedCount(prev => prev + 1);
      }
    }, 500);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      {/* Przycisk kostki */}
      <Button
        onClick={rollDice}
        disabled={isRolling}
        size="lg"
        className={`text-2xl md:text-3xl px-8 md:px-12 py-6 md:py-8 rounded-3xl bg-primary hover:bg-primary/90 transition-all ${
          isRolling ? 'animate-shake' : 'hover:scale-105'
        }`}
      >
        <Dices className="mr-3 h-8 w-8 md:h-10 md:w-10" />
        {isRolling ? 'Rzucam...' : 'Rzuć kostką!'}
      </Button>

      {/* Licznik poznanych słówek */}
      <div className="text-center bg-winter-lavender px-6 py-3 rounded-2xl">
        <p className="text-lg md:text-xl font-semibold">
          Poznałeś już <span className="text-2xl md:text-3xl text-primary">{learnedCount}</span> słówek zimowych! ❄️
        </p>
      </div>

      {/* Wylosowane słówko */}
      {currentWord && (
        <Card className="w-full max-w-md animate-bounce-in bg-card shadow-lg">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            {/* Emoji */}
            <div className="text-7xl md:text-8xl animate-float">
              {currentWord.emoji}
            </div>
            
            {/* Hiszpańskie słowo */}
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                {currentWord.es}
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground">
                ({currentWord.pl})
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Komunikat startowy */}
      {!currentWord && !isRolling && (
        <div className="text-center text-muted-foreground text-lg md:text-xl p-8">
          <p>👆 Kliknij przycisk, aby poznać słówko po hiszpańsku!</p>
        </div>
      )}
    </div>
  );
};

export default DiceGame;
