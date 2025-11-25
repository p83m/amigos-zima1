import { useEffect } from 'react';

// Komponent tła z opadającymi płatkami śniegu
const SnowfallBackground = () => {
  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.textContent = '❄';
      snowflake.style.left = Math.random() * 100 + '%';
      snowflake.style.animationDuration = Math.random() * 3 + 5 + 's';
      snowflake.style.fontSize = Math.random() * 0.8 + 0.8 + 'rem';
      document.body.appendChild(snowflake);

      // Usuń płatek po zakończeniu animacji
      setTimeout(() => {
        snowflake.remove();
      }, 8000);
    };

    // Twórz płatki co jakiś czas
    const interval = setInterval(createSnowflake, 300);

    return () => {
      clearInterval(interval);
      // Wyczyść istniejące płatki
      document.querySelectorAll('.snowflake').forEach(el => el.remove());
    };
  }, []);

  return null;
};

export default SnowfallBackground;
