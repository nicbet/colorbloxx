export interface Tetromino {
  rotations: boolean[][][];
  color: string;
}

export interface Piece {
  shape: boolean[][];
  color: string;
}

const O: Tetromino = {
  color: "#f0f000",
  rotations: [
    [
      [true, true],
      [true, true],
    ],
  ],
};

const I: Tetromino = {
  color: "#00f0f0",
  rotations: [
    [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ],
    [
      [false, false, true, false],
      [false, false, true, false],
      [false, false, true, false],
      [false, false, true, false],
    ],
    [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
    ],
    [
      [false, true, false, false],
      [false, true, false, false],
      [false, true, false, false],
      [false, true, false, false],
    ],
  ],
};

const Z: Tetromino = {
  color: "#f00000",
  rotations: [
    [
      [true, true, false],
      [false, true, true],
      [false, false, false],
    ],
    [
      [false, false, true],
      [false, true, true],
      [false, true, false],
    ],
    [
      [false, false, false],
      [true, true, false],
      [false, true, true],
    ],
    [
      [false, true, false],
      [true, true, false],
      [true, false, false],
    ],
  ],
};

const T: Tetromino = {
  color: "#a000f0",
  rotations: [
    [
      [false, true, false],
      [true, true, true],
      [false, false, false],
    ],
    [
      [false, true, false],
      [false, true, true],
      [false, true, false],
    ],
    [
      [false, false, false],
      [true, true, true],
      [false, true, false],
    ],
    [
      [false, true, false],
      [true, true, false],
      [false, true, false],
    ],
  ],
};

const L: Tetromino = {
  color: "#f0a000",
  rotations: [
    [
      [false, true, false],
      [false, true, false],
      [false, true, true],
    ],
    [
      [false, false, false],
      [true, true, true],
      [true, false, false],
    ],
    [
      [true, true, false],
      [false, true, false],
      [false, true, false],
    ],
    [
      [false, false, true],
      [true, true, true],
      [false, false, false],
    ],
  ],
};

const J: Tetromino = {
  color: "#0000f0",
  rotations: [
    [
      [false, true, false],
      [false, true, false],
      [true, true, false],
    ],
    [
      [true, false, false],
      [true, true, true],
      [false, false, false],
    ],
    [
      [false, true, true],
      [false, true, false],
      [false, true, false],
    ],
    [
      [false, false, false],
      [true, true, true],
      [false, false, true],
    ],
  ],
};

const S: Tetromino = {
  color: "#00f000",
  rotations: [
    [
      [false, true, true],
      [true, true, false],
      [false, false, false],
    ],
    [
      [false, true, false],
      [false, true, true],
      [false, false, true],
    ],
    [
      [false, false, false],
      [false, true, true],
      [true, true, false],
    ],
    [
      [true, false, false],
      [true, true, false],
      [false, true, false],
    ],
  ],
};

export const TETROMINOES: Tetromino[] = [O, I, Z, S, T, L, J];

export function randomTetromino(): Tetromino {
  return TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
}
