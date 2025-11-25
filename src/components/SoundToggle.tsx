import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SoundToggleProps {
  isSoundEnabled: boolean;
  onToggle: () => void;
}

// Przycisk do włączania/wyłączania dźwięków
const SoundToggle = ({ isSoundEnabled, onToggle }: SoundToggleProps) => {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="icon"
      className="fixed top-4 right-4 z-50 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card shadow-lg"
      title={isSoundEnabled ? 'Wyłącz dźwięki' : 'Włącz dźwięki'}
    >
      {isSoundEnabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </Button>
  );
};

export default SoundToggle;
