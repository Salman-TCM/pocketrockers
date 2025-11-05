import { useState, useCallback } from 'react';

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UndoRedoActions<T> {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  set: (newState: T) => void;
  clear: () => void;
}

export function useUndoRedo<T>(initialState: T): [T, UndoRedoActions<T>] {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setState(prevState => {
      const [newPresent, ...newPast] = prevState.past;
      return {
        past: newPast,
        present: newPresent,
        future: [prevState.present, ...prevState.future]
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setState(prevState => {
      const [newPresent, ...newFuture] = prevState.future;
      return {
        past: [prevState.present, ...prevState.past],
        present: newPresent,
        future: newFuture
      };
    });
  }, [canRedo]);

  const set = useCallback((newState: T) => {
    setState(prevState => ({
      past: [prevState.present, ...prevState.past].slice(0, 50), // Limit history to 50 items
      present: newState,
      future: []
    }));
  }, []);

  const clear = useCallback(() => {
    setState({
      past: [],
      present: initialState,
      future: []
    });
  }, [initialState]);

  return [
    state.present,
    {
      canUndo,
      canRedo,
      undo,
      redo,
      set,
      clear
    }
  ];
}