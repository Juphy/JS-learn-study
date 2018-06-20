export interface Point2D {
    x: number;
    y: number;
}

export interface Directions {
    [key: number]: Point2D;
}

export const DIRECTIONS: Directions = {
    37: {x: -1, y: 0}, // 左键
    39: {x: 1, y: 0},  // 右键
    38: {x: 0, y: -1}, // 上键
    40: {x: 0, y: 1}   // 下键
};

export enum Key {
    LEFT = 37,
    RIGHT = 39,
    UP = 38,
    DOWN = 40
}