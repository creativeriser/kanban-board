import { useState, useEffect } from 'react';

export function TypewriterText({ text }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    let isDeleting = false;
    let timeoutId;

    const type = () => {
      if (!isDeleting && i <= text.length) {
        setDisplayedText(text.slice(0, i));
        i++;
        timeoutId = setTimeout(type, 100); // Typing speed
      } else if (!isDeleting && i > text.length) {
        isDeleting = true;
        timeoutId = setTimeout(type, 3000); // Wait 3 seconds for user to read
      } else if (isDeleting && i > 0) {
        i--;
        setDisplayedText(text.slice(0, i));
        timeoutId = setTimeout(type, 50); // Deleting speed (faster)
      } else if (isDeleting && i === 0) {
        isDeleting = false;
        timeoutId = setTimeout(type, 800); // Brief pause before restarting
      }
    };

    timeoutId = setTimeout(type, 100);

    return () => clearTimeout(timeoutId);
  }, [text]);

  return <>{displayedText}</>;
}
