import React, { createContext, useContext, useState } from "react";
import { DBEntity, GameEntity } from "../types";
import { useNirvanaLifesDB } from "../hooks/useDBHook";
import { useNirvanaLifesGame } from "../hooks/useUserHook";

export interface NirvanaLifesGameState {
  db: DBEntity | null;
  setDb: (gameState: DBEntity | null) => void;
  game: GameEntity | null;
  setGame: (gameState: GameEntity | null) => void;
  refreshDatabase: () => Promise<void>;
}

const NirvanaLifesGameContext = createContext<NirvanaLifesGameState | undefined>(undefined);

export const NirvanaLifesGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const { db, setDb, isInitializing, refreshDatabase } = useNirvanaLifesDB();
  const { game, setGame } = useNirvanaLifesGame();

  return (
    <NirvanaLifesGameContext.Provider value={{ db, setDb, game, setGame, refreshDatabase }}>
      {children}
    </NirvanaLifesGameContext.Provider>
  );
};

export function useNirvanaLifesGameContext() {
  const ctx = useContext(NirvanaLifesGameContext);
  if (!ctx) throw new Error("useNirvanaLifesGameContext must be used within NirvanaLifesGameProvider");
  return ctx;
}
