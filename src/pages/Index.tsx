import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SnowfallBackground from '@/components/SnowfallBackground';
import SoundToggle from '@/components/SoundToggle';
import DiceGame from '@/components/games/DiceGame';
import MatchingGame from '@/components/games/MatchingGame';
import ImageQuiz from '@/components/games/ImageQuiz';
import { useSound } from '@/hooks/useSound';
import { Dices, Puzzle, Image } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dice');
  const {
    isSoundEnabled,
    toggleSound,
    playCorrect,
    playWrong,
    playClick,
    playDiceRoll,
    playBackgroundAmbient,
    stopBackgroundAmbient,
  } = useSound();

  // Uruchom zimowy ambient przy załadowaniu
  useEffect(() => {
    if (isSoundEnabled) {
      const stopFn = playBackgroundAmbient();
      return () => {
        if (stopFn) stopFn();
        stopBackgroundAmbient();
      };
    }
  }, [isSoundEnabled, playBackgroundAmbient, stopBackgroundAmbient]);

  return (
    <>
      <SnowfallBackground />
      <SoundToggle isSoundEnabled={isSoundEnabled} onToggle={toggleSound} />
      
      <div className="min-h-screen bg-gradient-to-b from-background via-winter-sky to-winter-snow">
        {/* Nagłówek */}
        <header className="text-center py-8 md:py-12 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 animate-float">
            ❄️ Zimowa Nauka Hiszpańskiego ❄️
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Poznaj słówka zimowe po hiszpańsku! 🇪🇸
          </p>
        </header>

        {/* Główna zawartość z zakładkami */}
        <main className="container mx-auto px-4 pb-12">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full max-w-6xl mx-auto"
          >
            {/* Nawigacja zakładek */}
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/50 backdrop-blur-sm p-2 rounded-3xl h-auto">
              <TabsTrigger 
                value="dice"
                className="text-base md:text-lg py-3 md:py-4 px-2 md:px-4 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Dices className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">Gra w kości</span>
                <span className="sm:hidden">Kostka</span>
              </TabsTrigger>
              <TabsTrigger 
                value="matching"
                className="text-base md:text-lg py-3 md:py-4 px-2 md:px-4 rounded-2xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all"
              >
                <Puzzle className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">Dopasuj słowa</span>
                <span className="sm:hidden">Dopasuj</span>
              </TabsTrigger>
              <TabsTrigger 
                value="quiz"
                className="text-base md:text-lg py-3 md:py-4 px-2 md:px-4 rounded-2xl data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all"
              >
                <Image className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">Quiz obrazkowy</span>
                <span className="sm:hidden">Quiz</span>
              </TabsTrigger>
            </TabsList>

            {/* Zawartość zakładek */}
            <div className="bg-card/30 backdrop-blur-sm rounded-3xl shadow-xl min-h-[500px]">
              <TabsContent value="dice" className="mt-0">
                <DiceGame onDiceRoll={playDiceRoll} />
              </TabsContent>

              <TabsContent value="matching" className="mt-0">
                <MatchingGame 
                  onCorrectMatch={playCorrect}
                  onWrongMatch={playWrong}
                  onCardClick={playClick}
                />
              </TabsContent>

              <TabsContent value="quiz" className="mt-0">
                <ImageQuiz 
                  onCorrectAnswer={playCorrect}
                  onWrongAnswer={playWrong}
                  onCardClick={playClick}
                />
              </TabsContent>
            </div>
          </Tabs>
        </main>

        {/* Stopka */}
        <footer className="text-center py-8 text-muted-foreground">
          <p className="text-lg">
            ¡Muy bien! Ucz się i baw dobrze! 🎉
          </p>
        </footer>
      </div>
    </>
  );
};

export default Index;
