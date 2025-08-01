import { useState, useEffect } from "react";
import { StorageUtil } from "../../../util/storageUtils";
import { GameEntity } from "../types";

export const useNirvanaLifesGame = () => {
  const [game, setGame] = useState<GameEntity | null>(null);

  useEffect(() => {
    (async () => {
      const storedGame = await StorageUtil.load("nirvanalives_game_context", null);
      console.log("[NirvanaLifesGame] stored game:", storedGame);
      if (storedGame) 
        setGame(JSON.parse(storedGame));
    })();
  }, []);
  

  useEffect(() => {
    console.log('[NirvanaLifesGame] saved game:', game);
    // Save game to storage
    StorageUtil.save("nirvanalives_game_context", JSON.stringify(game));
  }, [game]);

  return {
    game,
    setGame
  };
};
