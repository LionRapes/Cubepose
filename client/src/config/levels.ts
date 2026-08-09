import { LevelConfig } from '../types';
import { L_SHAPE, T_SHAPE } from './shapes';

export const levels: LevelConfig[] = [
  {
    id: 'level1',
    containers: [
      {
        id: 'boxLeft',
        size: [3, 3, 3],
        outlineColor: 'white',
        position: [0, 0, 0],
        blockedCells: []
      },
      {
        id: 'boxRight',
        size: [3, 3, 3],
        outlineColor: 'cyan',
        position: [6, 0, 0],
        blockedCells: [[2,2,1]]
      },
    ],
    pieces: [
      {id: 1, shape: T_SHAPE, color: '#ff9c9c'},
      {id: 2, shape: L_SHAPE, color: '#c5a363'},
      {id: 3, shape: T_SHAPE, color: '#5a84c0'},
      {id: 4, shape: T_SHAPE, color: '#ff84eb'}
    ]
  },
  {
    id: 'level2',
    containers: [
      {
        id: 'boxLeft',
        size: [3, 10, 3],
        outlineColor: 'green',
        position: [0, 0, 0],
        blockedCells: [[0,0,0]]
      },
      {
        id: 'boxRight',
        size: [3, 10, 3],
        outlineColor: 'red',
        position: [6, 0, 0],
        blockedCells: [[3,2,4]]
      },
    ],
    pieces: [
      {id: 1, shape: T_SHAPE, color: '#ff9c9c'},
      {id: 2, shape: L_SHAPE, color: '#c5a363'},
    ]
  },
];