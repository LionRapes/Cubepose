import { LevelConfig } from '../types';
import * as Shapes from './shapes';

export const levels: LevelConfig[] = [
  {
    id: 'level1',
    containers: [
      {
        id: 'box',
        size: [3, 2, 2],
        outlineColor: 'yellow',
        position: [0, 0, 0],
        blockedCells: [[1, 0, 0], [2, 0, 0], [2, 1, 0]]
      }
    ],
    pieces: [
      {id: 1, shape: Shapes.SMALL_L_SHAPE, color: '#ff9c9c'},
      {id: 2, shape: Shapes.L_SHAPE, color: '#c5a363'},
      {id: 3, shape: Shapes.SMALL_LINE_SHAPE, color: '#5a84c0'},
    ]
  },
  {
    id: 'level2',
    containers: [
      {
        id: 'box',
        size: [3, 3, 3],
        outlineColor: 'cyan',
        position: [0, 0, 0],
        blockedCells: [
          [0, 0, 0], [1, 0, 0], [0, 0, 1], [1, 0, 1],
          [0, 1, 0], [1, 1, 0], [0, 1, 1], [1, 1, 1]]
      }
    ],
    pieces: [
      { id: 1, shape: Shapes.T_SHAPE, color: '#f9a8d4' },
      { id: 2, shape: Shapes.L_SHAPE, color: '#6ee7b7' },
      { id: 3, shape: Shapes.SMALL_LINE_SHAPE, color: '#fcd34d' },
      { id: 4, shape: Shapes.SMALL_WALL_SHAPE, color: '#93c5fd' },
      { id: 5, shape: Shapes.SMALL_WALL_SHAPE, color: '#d8b4fe' },
    ]
  },
  {
    id: 'level3',
    containers: [
      {
        id: 'box',
        size: [2, 5, 2],
        outlineColor: 'indianred',
        position: [0, 0, 0],
        blockedCells: []
      }
    ],
    pieces: [
      { id: 1, shape: Shapes.SMALL_T_SHAPE, color: '#fca5a5' },
      { id: 2, shape: Shapes.SMALL_L_SHAPE, color: '#86efac' },
      { id: 3, shape: Shapes.SMALL_WALL_SHAPE, color: '#fdba74' },
      { id: 4, shape: Shapes.Z_SHAPE, color: '#fde047' },
      { id: 5, shape: Shapes.SMALL_L_SHAPE, color: '#6ee7b7' },
      { id: 6, shape: Shapes.SMALL_LINE_SHAPE, color: '#67e8f9' },
    ]
  },
  {
    id: 'level4',
    containers: [
      {
        id: 'box',
        size: [3, 5, 2],
        outlineColor: '#b3d9ff',
        position: [0, 0, 0],
        blockedCells: [[1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1]]
      }
    ],
    pieces: [
      { id: 1, shape: Shapes.WALL_SHAPE, color: '#fca5a5' },
      { id: 2, shape: Shapes.SMALL_L_SHAPE, color: '#86efac' },
      { id: 3, shape: Shapes.SMALL_L_SHAPE, color: '#fde047' },
      { id: 4, shape: Shapes.SMALL_WALL_SHAPE, color: '#7dd3fc' },
      { id: 5, shape: Shapes.LINE_SHAPE, color: '#c084fc' },
      { id: 6, shape: Shapes.SMALL_LINE_SHAPE, color: '#f472b6' },
    ]
  },
  {
    id: 'level5',
    containers: [
      {
        id: 'box',
        size: [5, 3, 3],
        outlineColor: '#d8b4fe',
        position: [0, 0, 0],
        blockedCells: [
          [1, 0, 2], [2, 0, 2], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2],
          [4, 0, 2], [4, 1, 2], [4, 2, 2]]
      }
    ],
    pieces: [
      { id: 1, shape: Shapes.Z_SHAPE, color: '#f9a8d4' },
      { id: 2, shape: Shapes.SMALL_L_SHAPE, color: '#a7f3d0' },
      { id: 3, shape: Shapes.L_SHAPE, color: '#fcd34d' },
      { id: 4, shape: Shapes.SMALL_WALL_SHAPE, color: '#93c5fd' },
      { id: 5, shape: Shapes.O_SHAPE, color: '#d8b4fe' },
      { id: 6, shape: Shapes.LINE_SHAPE, color: '#fbcfe8' },
      { id: 7, shape: Shapes.LINE_SHAPE, color: '#6ee7b7' },
      { id: 8, shape: Shapes.L_SHAPE, color: '#fde68a' },
      { id: 9, shape: Shapes.LINE_SHAPE, color: '#c4b5fd' },
    ]
  },
  {
    id: 'level6',
    containers: [
      {
        id: 'box',
        size: [4, 4, 3],
        outlineColor: '#f9a8d4',
        position: [0, 0, 0],
        blockedCells: [
          [1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0],
          [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1]
        ]
      }
    ],
    pieces: [
      { id: 1, shape: Shapes.WALL_SHAPE, color: '#fda4af' },
      { id: 2, shape: Shapes.L_SHAPE, color: '#86efac' },
      { id: 3, shape: Shapes.LINE_SHAPE, color: '#fcd34d' },
      { id: 4, shape: Shapes.Z_SHAPE, color: '#93c5fd' },
      { id: 5, shape: Shapes.SMALL_L_SHAPE, color: '#d8b4fe' },
      { id: 6, shape: Shapes.SMALL_T_SHAPE, color: '#fbcfe8' },
      { id: 7, shape: Shapes.SMALL_L_SHAPE, color: '#5eead4' },
      { id: 8, shape: Shapes.LINE_SHAPE, color: '#fde047' },
      { id: 9, shape: Shapes.SMALL_LINE_SHAPE, color: '#c4b5fd' },
      { id: 10, shape: Shapes.T_SHAPE, color: '#99f6e4' },
    ]
  },
  {
    id: 'level7',
    containers: [
      {
        id: 'box',
        size: [5, 5, 3],
        outlineColor: '#a7f3d0',
        position: [0, 0, 0],
        blockedCells: [
          [2, 0, 0], [2, 1, 0], [2, 2, 0], [2, 3, 0], [2, 4, 0],
          [2, 0, 1], [2, 1, 1], [2, 2, 1], [2, 3, 1], [2, 4, 1]
        ]
      }
    ],
    pieces: [
      { id: 1, shape: Shapes.WALL_SHAPE, color: '#fca5a5' },
      { id: 2, shape: Shapes.SMALL_L_SHAPE, color: '#93c5fd' },
      { id: 3, shape: Shapes.L_SHAPE, color: '#86efac' },
      { id: 4, shape: Shapes.L_SHAPE, color: '#fcd34d' },
      { id: 5, shape: Shapes.Z_SHAPE, color: '#d8b4fe' },
      { id: 6, shape: Shapes.Z_SHAPE, color: '#f9a8d4' },
      { id: 7, shape: Shapes.O_SHAPE, color: '#6ee7b7' },
      { id: 8, shape: Shapes.T_SHAPE, color: '#fbcfe8' },
      { id: 9, shape: Shapes.T_SHAPE, color: '#c4b5fd' },
      { id: 10, shape: Shapes.SMALL_L_SHAPE, color: '#fde047' },
      { id: 11, shape: Shapes.SMALL_L_SHAPE, color: '#7dd3fc' },
      { id: 12, shape: Shapes.LINE_SHAPE, color: '#fda4af' },
      { id: 13, shape: Shapes.SMALL_WALL_SHAPE, color: '#c5a363' },
      { id: 14, shape: Shapes.SMALL_LINE_SHAPE, color: '#99f6e4' },
      { id: 15, shape: Shapes.SMALL_WALL_SHAPE, color: '#6ee7b7' },
    ]
  },
  {
    id: 'level8',
    containers: [
      {
        id: 'box',
        size: [4, 4, 4],
        outlineColor: '#fcd34d',
        position: [0, 0, 0],
        blockedCells: [
          [0, 0, 0], [3, 0, 0], [0, 3, 0], [3, 3, 0],
          [0, 0, 1], [3, 0, 1], [0, 3, 1], [3, 3, 1]
        ]
      }
    ],
    pieces: [
      { id: 1, shape: Shapes.SMALL_L_SHAPE, color: '#f9a8d4' },
      { id: 2, shape: Shapes.L_SHAPE, color: '#93c5fd' },
      { id: 3, shape: Shapes.L_SHAPE, color: '#fca5a5' },
      { id: 4, shape: Shapes.T_SHAPE, color: '#86efac' },
      { id: 5, shape: Shapes.T_SHAPE, color: '#d8b4fe' },
      { id: 6, shape: Shapes.Z_SHAPE, color: '#fcd34d' },
      { id: 7, shape: Shapes.Z_SHAPE, color: '#6ee7b7' },
      { id: 8, shape: Shapes.O_SHAPE, color: '#7dd3fc' },
      { id: 9, shape: Shapes.SMALL_L_SHAPE, color: '#fbcfe8' },
      { id: 10, shape: Shapes.SMALL_L_SHAPE, color: '#c4b5fd' },
      { id: 11, shape: Shapes.SMALL_T_SHAPE, color: '#fde047' },
      { id: 12, shape: Shapes.LINE_SHAPE, color: '#fda4af' },
      { id: 13, shape: Shapes.SMALL_LINE_SHAPE, color: '#99f6e4' },
      { id: 14, shape: Shapes.SMALL_WALL_SHAPE, color: '#5eead4' },
    ]
  },
  {
    id: 'level9',
    containers: [
      {
        id: 'box',
        size: [5, 5, 3],
        outlineColor: '#fbcfe8',
        position: [0, 0, 0],
        blockedCells: [
          [0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [4, 4, 0],
          [0, 0, 1], [1, 1, 1], [2, 2, 1], [3, 3, 1], [4, 4, 1],
          [0, 0, 2], [1, 1, 2], [2, 2, 2], [3, 3, 2], [4, 4, 2]
        ]
      }
    ],
    pieces: [
      { id: 1, shape: Shapes.SMALL_L_SHAPE, color: '#fbcfe8' },
      { id: 2, shape: Shapes.L_SHAPE, color: '#fca5a5' },
      { id: 3, shape: Shapes.L_SHAPE, color: '#6ee7b7' },
      { id: 4, shape: Shapes.T_SHAPE, color: '#93c5fd' },
      { id: 5, shape: Shapes.T_SHAPE, color: '#fcd34d' },
      { id: 6, shape: Shapes.Z_SHAPE, color: '#d8b4fe' },
      { id: 7, shape: Shapes.Z_SHAPE, color: '#f9a8d4' },
      { id: 8, shape: Shapes.O_SHAPE, color: '#86efac' },
      { id: 9, shape: Shapes.L_SHAPE, color: '#7dd3fc' },
      { id: 10, shape: Shapes.SMALL_L_SHAPE, color: '#c4b5fd' },
      { id: 11, shape: Shapes.SMALL_T_SHAPE, color: '#fde047' },
      { id: 12, shape: Shapes.SMALL_T_SHAPE, color: '#fda4af' },
      { id: 13, shape: Shapes.SMALL_LINE_SHAPE, color: '#99f6e4' },
      { id: 14, shape: Shapes.SMALL_LINE_SHAPE, color: '#c5a363' },
      { id: 15, shape: Shapes.SMALL_WALL_SHAPE, color: '#5eead4' },
    ]
  },
  {
    id: 'level10',
    containers: [
      {
        id: 'box',
        size: [5, 5, 4],
        outlineColor: '#818cf8',
        position: [0, 0, 0],
        blockedCells: [
          [2, 0, 0], [2, 1, 0], [2, 2, 0], [2, 3, 0], [2, 4, 0],
          [0, 2, 0], [1, 2, 0], [3, 2, 0], [4, 2, 0],
          [2, 0, 1], [2, 1, 1], [2, 2, 1], [2, 3, 1], [2, 4, 1],
          [0, 2, 1], [1, 2, 1], [3, 2, 1], [4, 2, 1]
        ]
      }
    ],
    pieces: [
      { id: 1, shape: Shapes.SMALL_LINE_SHAPE, color: '#fca5a5' },
      { id: 2, shape: Shapes.WALL_SHAPE, color: '#fbcfe8' },
      { id: 3, shape: Shapes.WALL_SHAPE, color: '#93c5fd' },
      { id: 4, shape: Shapes.L_SHAPE, color: '#86efac' },
      { id: 5, shape: Shapes.L_SHAPE, color: '#fcd34d' },
      { id: 6, shape: Shapes.L_SHAPE, color: '#c4b5fd' },
      { id: 7, shape: Shapes.T_SHAPE, color: '#f9a8d4' },
      { id: 8, shape: Shapes.T_SHAPE, color: '#6ee7b7' },
      { id: 9, shape: Shapes.Z_SHAPE, color: '#d8b4fe' },
      { id: 10, shape: Shapes.Z_SHAPE, color: '#7dd3fc' },
      { id: 11, shape: Shapes.O_SHAPE, color: '#fde047' },
      { id: 12, shape: Shapes.O_SHAPE, color: '#fda4af' },
      { id: 13, shape: Shapes.SMALL_L_SHAPE, color: '#99f6e4' },
      { id: 14, shape: Shapes.SMALL_L_SHAPE, color: '#c5a363' },
      { id: 15, shape: Shapes.SMALL_T_SHAPE, color: '#5eead4' },
      { id: 16, shape: Shapes.LINE_SHAPE, color: '#fca5a5' },
      { id: 17, shape: Shapes.LINE_SHAPE, color: '#a7f3d0' },
    ]
  },
];