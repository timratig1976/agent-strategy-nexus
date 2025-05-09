
import { useState, useCallback } from 'react';

/**
 * A hook for managing boolean toggle state.
 * 
 * @param initialState - Initial toggle state
 * @returns [state, toggle function, set function]
 */
export const useToggle = (initialState: boolean = false): [boolean, () => void, (value: boolean) => void] => {
  const [state, setState] = useState<boolean>(initialState);
  
  const toggle = useCallback(() => {
    setState(prevState => !prevState);
  }, []);
  
  return [state, toggle, setState];
};
