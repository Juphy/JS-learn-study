import { Scene, Point2D } from "./types";
import { SNAKE_LENGTH, APPLE_COUNT } from "./constants";
import { checkCollision, getRandomPosition } from "./canvas";

export function nextDirection(previous, next) {
    let isOpposite = (previous: Point2D, next: Point2D) => {
        return next.x === previous.x * -1 || next.y === previous.y * -1;
    }
    // 如果前后方向相反，按照之前的反向，否则，按照之后的方向
    if (isOpposite(previous, next)) {
        return previous;
    }
    return next;
}

export function move(snake, [direction, snakeLength]) {
    let nx = snake[0].x, ny = snake[0].y;
    // direction={x:1, y:0}
    nx += 1 * direction.x;
    ny += 1 * direction.y;

    let tail;
    if (snakeLength > snake.length) {
        // 吃到苹果，直接将最新的一个加到首位
        tail = { x: nx, y: ny }
    } else {
        // 没有吃到，去掉尾巴，加在头部
        tail = snake.pop();
        tail.x = nx;
        tail.y = ny;
    }

    snake.unshift(tail);
    return snake;
}

// 根据起始长度，列出所有snake上的点的位置
export function generateSnake() {
    let snake: Array<Point2D> = [];
    for (let i = SNAKE_LENGTH - 1; i >= 0; i--) {
        snake.push({ x: i, y: 0 });
    }
    return snake;
}

export function eat(apples: Array<Point2D>, snake) {
    let head = snake[0];
    for (let i = 0; i < apples.length; i++) {
        if (checkCollision(apples[i], head)) {
            apples.splice(i, 1);
            return [...apples, getRandomPosition(snake)]
        }
    }
    return apples;
}

// 根据起始苹果数量，列出所有苹果的位置
// 没有判断生成的苹果重合的问题
export function generateApples() {
    let apples = [];
    for (let i = 0; i < APPLE_COUNT; i++) {
        apples.push(getRandomPosition());
    }
    return apples;
}