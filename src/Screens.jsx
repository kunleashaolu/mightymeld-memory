import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <>
      <div className="flex flex-col h-screen bg-purple-500 justify-center">
        <div className="grid justify-center text-center max-h-min gap-14">
          <div className="grid gap-4">
            <h1 className="font-bold text-slate-100 text-7xl max-h-min animate__animated animate__bounceInDown">
              Memory
            </h1>
            <p className="text-lg font-semibold text-slate-100 text-nowrap animate__animated animate__fadeInRight animate__delay-1s">
              Flip over tiles looking for pairs
            </p>
          </div>
          <button
            onClick={start}
            className="bg-gradient-to-b from-pink-300 to-pink-400 text-white py-3 px-16 max-w-60 justify-self-center text-xl font-bold rounded-se-2xl rounded-es-2xl hover:shadow-xl shadow-pink-200 animate__animated animate__flash animate__infinite animate__slower animate__delay-2s"
          >
            Play
          </button>
        </div>
      </div>
    </>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [matchesMade, setMatchesMade] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 1000,
        });
        newState = "matched";

        setMatchesMade((m) => m + 1);
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
            setMatchesMade(0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  function reset() {
    setTiles(null);
    setTryCount(0);
    setMatchesMade(0);
  }

  return (
    <>
      <div className="h-screen bg-purple-100 animate__animated animate__fadeIn">
        <div className="flex p-4 justify-between">
          <button
            onClick={reset}
            className="bg-purple-400 rounded-md text-white font-semibold text-lg px-3 hover:bg-purple-500"
          >
            Reset
          </button>
          <div className="flex gap-3 animate__animated animate__zoomInDown">
            <h1 className="flex gap-2 font-medium text-purple-500 justify-center text-xl border-2 rounded-md border-white pl-2">
              Tries{" "}
              <p className="px-3 font-bold text-xl text-purple-500 border-l-2 border-white">
                {tryCount}
              </p>
            </h1>
            <h1 className="flex gap-2 font-medium text-purple-500 justify-center text-xl border-2 rounded-md border-white pl-2">
              Matches made{" "}
              <p className="px-3 font-bold text-xl text-purple-500 border-l-2 border-white">
                {matchesMade}
              </p>
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-4 bg-pink-100 rounded-lg m-auto gap-2 p-4 justify-items-center max-w-96 mt-16 animate__animated animate__zoomIn">
          {getTiles(16).map((tile, i) => (
            <Tile key={i} flip={() => flip(i)} {...tile} />
          ))}
        </div>
      </div>
    </>
  );
}
