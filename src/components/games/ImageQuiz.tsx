import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { winterWords, getRandomWord, type WinterWord } from '@/data/winterWords';
import { Sparkles, RotateCw } from 'lucide-react';

const ImageQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState<WinterWord | null>(null);
  const [options, setOptions] = useState<WinterWord[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Generuj nowe pytanie
  const generateQuestion = () => {
    const correctWord = getRandomWord();
    const wrongWords: WinterWord[] = [];
    
    // Wybierz 3 inne słówka jako nieprawidłowe odpowiedzi
    while (wrongWords.length < 3) {
      const word = getRandomWord();
      if (word.pl !== correctWord.pl && !wrongWords.find(w => w.pl === word.pl)) {
        wrongWords.push(word);
      }
    }
    
    // Przetasuj opcje
    const allOptions = [correctWord, ...wrongWords].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion(correctWord);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  // Inicjalizuj pierwsze pytanie
  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return; // Już odpowiedziano
    
    setSelectedAnswer(index);
    const correct = options[index].pl === currentQuestion?.pl;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    setQuestionsAnswered(prev => prev + 1);
    
    // Przejdź do następnego pytania po 2 sekundach
    setTimeout(() => {
      generateQuestion();
    }, 2000);
  };

  const resetGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    generateQuestion();
  };

  if (!currentQuestion) return null;

  return (
    <div className="p-4 md:p-8">
      {/* Nagłówek z wynikiem */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Quiz obrazkowy! 🎨</h2>
        <div className="flex justify-center gap-8 mb-4">
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl">
            <div className="text-sm md:text-base">Poprawne</div>
            <div className="text-2xl md:text-3xl font-bold">{score}</div>
          </div>
          <div className="bg-secondary text-secondary-foreground px-6 py-3 rounded-2xl">
            <div className="text-sm md:text-base">Razem</div>
            <div className="text-2xl md:text-3xl font-bold">{questionsAnswered}</div>
          </div>
        </div>
        <Button 
          onClick={resetGame}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Zacznij od nowa
        </Button>
      </div>

      {/* Pytanie */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 bg-winter-lavender p-6 rounded-3xl">
          <p className="text-xl md:text-2xl font-semibold mb-2">Kliknij:</p>
          <p className="text-3xl md:text-4xl font-bold text-primary">
            {currentQuestion.pl}
          </p>
          <p className="text-xl md:text-2xl text-muted-foreground mt-2">
            ({currentQuestion.es})
          </p>
        </div>

        {/* Opcje odpowiedzi - siatka obrazków */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = option.pl === currentQuestion.pl;
            const showResult = selectedAnswer !== null;
            
            return (
              <Card
                key={index}
                onClick={() => handleAnswerClick(index)}
                className={`
                  p-6 md:p-8 cursor-pointer transition-all duration-300
                  hover:scale-105 active:scale-95
                  ${!showResult && 'hover:bg-winter-ice'}
                  ${isSelected && isCorrect && 'bg-primary text-primary-foreground animate-pop'}
                  ${isSelected && !isCorrect && 'bg-destructive text-destructive-foreground'}
                  ${showResult && !isSelected && isCorrectAnswer && 'bg-primary/20'}
                  ${showResult && 'cursor-default'}
                `}
              >
                <div className="flex flex-col items-center gap-3">
                  {/* Emoji */}
                  <div className="text-5xl md:text-6xl">
                    {option.emoji}
                  </div>
                  
                  {/* Nazwa polska (małym tekstem) */}
                  <div className="text-center">
                    <p className="text-sm md:text-base font-medium">
                      {option.pl}
                    </p>
                  </div>
                  
                  {/* Ikonka wyniku */}
                  {showResult && isSelected && (
                    <div className="absolute top-2 right-2">
                      {isCorrect ? '✅' : '❌'}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Komunikat po odpowiedzi */}
        {isCorrect !== null && (
          <div className="text-center mt-8 animate-bounce-in">
            {isCorrect ? (
              <div className="bg-primary text-primary-foreground px-8 py-4 rounded-3xl inline-flex items-center gap-3 text-xl md:text-2xl font-bold">
                <Sparkles className="h-6 w-6" />
                Świetnie! To był {currentQuestion.es}!
                <Sparkles className="h-6 w-6" />
              </div>
            ) : (
              <div className="bg-secondary text-secondary-foreground px-8 py-4 rounded-3xl inline-block text-xl md:text-2xl font-bold">
                Spróbuj jeszcze raz! 💪
              </div>
            )}
          </div>
        )}

        {/* Komunikat gratulacyjny */}
        {questionsAnswered >= 5 && score >= 3 && (
          <div className="text-center mt-8 animate-bounce-in">
            <div className="bg-winter-lavender px-8 py-6 rounded-3xl inline-block">
              <p className="text-2xl md:text-3xl font-bold mb-2">
                🎉 Świetnie! 🎉
              </p>
              <p className="text-lg md:text-xl">
                Znasz już <span className="text-primary font-bold">{score}</span> słówek!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageQuiz;
