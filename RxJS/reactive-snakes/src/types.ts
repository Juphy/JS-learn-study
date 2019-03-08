
export interface Point2D {
    x: number;
    y: number;
}

export interface Scene {
    snake: Array<Point2D>;
    apples: Array<Point2D>;
    score: number;
}

export interface Directions {
    [key: number]: Point2D;
}

export enum Key {
    LEFT = 37,
    UP,
    RIGHT,
    DOWN
}