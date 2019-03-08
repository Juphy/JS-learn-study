import { Point2D } from "./types";

// 整体区域的长宽
export const COLS = 30;
export const ROWS = 30;
export const GAP_SIZE = 1; // 每格间的间隙大小
export const CELL_SIZE = 10;    // 每格的大小
export const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
export const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);
// 生成canvas，确定长宽
export function createCanvasElement() {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    return canvas;
}

//  检测苹果是否与蛇身相撞
export function checkCollision(a, b) {
    return a.x === b.x && a.y === b.y;
}

// 返回 随机生成的苹果的位置坐标
export function getRandomPosition(snake: Array<Point2D> = []): Point2D {
    let position = {
        x: getRandomNumber(0, COLS - 1),
        y: getRandomNumber(0, ROWS - 1)
    };
    if (isEmptyCell(position, snake)) {
        return position;
    }
    // 如果存在位置重合，重新生成
    return getRandomPosition(snake);
}

// 生成随机数
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 新生成的苹果与蛇不重合
function isEmptyCell(position: Point2D, snake: Array<Point2D>): boolean {
    return !snake.some(segment => checkCollision(segment, position));
}