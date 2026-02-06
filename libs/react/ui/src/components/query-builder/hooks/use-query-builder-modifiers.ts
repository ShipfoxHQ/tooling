import {useEffect, useState} from 'react';

export function useQueryBuilderModifiers() {
  const [isShiftHeld, setIsShiftHeld] = useState(false);
  const [isAltHeld, setIsAltHeld] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftHeld(true);
      if (e.key === 'Alt') setIsAltHeld(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftHeld(false);
      if (e.key === 'Alt') setIsAltHeld(false);
    };
    const handleBlur = () => {
      setIsShiftHeld(false);
      setIsAltHeld(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return {isShiftHeld, isAltHeld};
}
