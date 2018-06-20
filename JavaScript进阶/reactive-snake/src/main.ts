import {Observable, fromEvent, BehaviorSubject} from 'rxjs';
import {
    map,
    filter,
    scan,
    startWith,
    distinctUntilChanged,
    share,
    withLatestFrom,
    tap,
    skip,
    switchMap,
    takeWhile,
    first
} from 'rxjs/operators';
import {POINTS_PER_APPLE, SNAKE_LENGTH} from './constants';
import {createCanvasElement} from './canvas';
import {Point2D, DIRECTIONS, Key} from './types';
import {nextDirection} from './untils';


let canvas = createCanvasElement();
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// 起始方向
const INITIAL_DIRECTION = DIRECTIONS[Key.RIGHT];

// 蛇的转向
let keydown$ = fromEvent(document, 'keydown');
console.log(keydown$);


let direction$ = keydown$.pipe(
    map((event: KeyboardEvent) => DIRECTIONS[event.keyCode]),
    filter(direction => !!direction),
    scan(nextDirection),
    startWith(INITIAL_DIRECTION), // 如果不使用 startWith()，那么只有当玩家按键后，我们的 Observable 才会开始发出值。
    distinctUntilChanged()
    )
;

console.log(direction$);

// SNAKE_LENGTH 指定蛇的初始长度
let length$: any = new BehaviorSubject<number>(SNAKE_LENGTH);

let snakeLength$ = length$.pipe(
    scan((step, snakeLength) => snakeLength + step),
    share()
);


let score$ = snakeLength$.pipe(
    startWith(0),
    scan((score, _) => score + POINTS_PER_APPLE)
)
