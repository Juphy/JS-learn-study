import { Point2D } from './types';

// 阻止反方向前进
export function nextDirection(previous, next) {
    let isOpposite = (previous: Point2D, next: Point2D) => {
        return next.x === previous.x * -1 || next.y === previous.y * -1;
    };

    if (isOpposite(previous, next)) {
        return previous;
    }

    return next;
}
