import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const DEFAULT_IMAGE = "../public/images/Screenshot_11.png";

const SIZE = 4;

function createShuffledTiles() {
  const tiles = Array.from({ length: SIZE * SIZE }, (_, index) => index);
  do {
    for (let index = tiles.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [tiles[index], tiles[randomIndex]] = [tiles[randomIndex], tiles[index]];
    }
  } while (tiles.every((tile, index) => tile === index));
  return tiles;
}

function App() {
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [tiles, setTiles] = useState(createShuffledTiles);
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [startedAt]);

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [elapsed]);

  const restart = () => {
    setTiles(createShuffledTiles());
    setMoves(0);
    setElapsed(0);
    setStartedAt(Date.now());
    setShowComplete(false);
  };

  const moveTile = (tileIndex) => {
    const emptyIndex = tiles.indexOf(15);
    const row = Math.floor(tileIndex / SIZE);
    const column = tileIndex % SIZE;
    const emptyRow = Math.floor(emptyIndex / SIZE);
    const emptyColumn = emptyIndex % SIZE;
    const isAdjacent =
      Math.abs(row - emptyRow) + Math.abs(column - emptyColumn) === 1;
    if (!isAdjacent) return;

    const nextTiles = [...tiles];
    [nextTiles[tileIndex], nextTiles[emptyIndex]] = [
      nextTiles[emptyIndex],
      nextTiles[tileIndex],
    ];
    setTiles(nextTiles);
    setMoves((current) => current + 1);
    if (nextTiles.every((tile, index) => tile === index)) setShowComplete(true);
  };

  const onImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
    restart();
  };

  return (
    <main className="app-shell">
      <section className="game-layout">
        <div className="board-wrap">
          <div className="board-heading">
            <div>
              <span className="section-label">Iu Mơ, iu Mơ</span>
              <h2>Ai thông minh hơn học sinh lớp 5?</h2>
            </div>
          </div>
          <div
            className="puzzle-board"
            role="grid"
            aria-label="Bảng xếp hình 4x4"
          >
            {tiles.map((tile, index) =>
              tile === 15 ? (
                <div key={tile} className="empty-tile" />
              ) : (
                <button
                  key={tile}
                  className="tile"
                  onClick={() => moveTile(index)}
                  aria-label={`Mảnh ghép ${tile + 1}`}
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `${(tile % SIZE) * 33.3333}% ${Math.floor(tile / SIZE) * 33.3333}%`,
                  }}
                />
              ),
            )}
          </div>
          <div className="board-footer">
            <span>
              <b>{moves}</b> MOVES
            </span>
            <span className="footer-divider">·</span>
            <span>
              <b>{formattedTime}</b> TIME
            </span>
          </div>
        </div>
      </section>

      {showComplete && (
        <div className="modal-backdrop">
          <div className="celebration">
            <button
              className="close-button"
              onClick={() => setShowComplete(false)}
            >
              ×
            </button>
            <div
              className="complete-image"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="eyebrow">Giỏi lắm Mơ oi</div>

            <p>Quà tối anh đưa sau nha (Nhớ chụp màn hình gửi anh)</p>
            <div className="result">
              <span>{moves} MOVES</span>
              <span>{formattedTime} TIME</span>
            </div>
            <button className="play-again" onClick={restart}>
              PLAY AGAIN <span>→</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
