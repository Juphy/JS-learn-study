import { createCanvasElement } from './canvas';
import { POINTS_PER_APPLE } from "./constants";
import { SNAKE_LENGTH } from "./constants";
import { Scene } from "./types";
import { DIRECTIONS, SPEED } from './constants';
import { Key, Point2D } from './types';

import { interval } from "rxjs/observable/interval";
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { map, filter, startWith, scan, distinctUntilChanged, share, withLatestFrom, skip, tap, combineLatest } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
    nextDirection,
    move,
    generateSnake,
    eat,
    generateApples
} from './utils';

// create canvas
let canvas = createCanvasElement();
let ctx = canvas.getContext('2d');
document.appendChild(canvas);

// starting valus
const INITIAL_DIRECTION = DIRECTIONS[Key.RIGHT];   //   起始方向

let ticks$ = interval(SPEED); // 源头流——定时器，决定

let click$ = fromEvent(document, 'click');
let keydown$ = fromEvent(document, 'keydown');
``
function createGame(fps$: Observable<number>): Observable<Scene> {
    let direction$ = keydown$.pipe(
        map((event: KeyboardEvent) => DIRECTIONS[event.keyCode]),
        filter(direction => !!direction), // 过滤掉其它按键操作
        startWith(INITIAL_DIRECTION),   // 初始化方向，控制已开始产生值，并不影响observable产生值
        scan(nextDirection),  // 类似于reduce
        distinctUntilChanged() // 暂存一个元素，并在收到新的元素之后与暂存作比较，作用就是过略掉重复的，元素前后是不相同的
    )

    // BehaviorSubject是特殊的subject，表示一个随时间而变化的值，当观察者订阅之后，它会接收到最后发出的值以及后续发出的所有值。
    let length$ = new BehaviorSubject<number>(SNAKE_LENGTH); //指定初始长度

    //  蛇身的长度
    let snakeLength$ = length$.pipe(
        scan((step, snakeLength) => snakeLength + step),
        share()
    )

    // 分数变化 
    let score$ = snakeLength$.pipe(
        startWith(0),
        scan((score, _) => score + POINTS_PER_APPLE)
    )

    let snake$: Observable<Array<Point2D>> = ticks$.pipe(
        // 主从关系，只有在主送出值才会执行callback
        // ticks$每当管道上发出新值，就取direction$和snakeLength$的最新值，即使辅助流频繁地发出值，也只会每次定时器发出值时处理数据
        withLatestFrom(direction$, snakeLength$, (_, direction, snakeLength) => [direction, snakeLength]),
        // move是(a,b)=>{}函数，generateSnake()是设定的初始值
        scan(move, generateSnake()),
        share()
    )

    let apples$ = snake$.pipe(
        scan(eat, generateApples()),
        distinctUntilChanged(),
        share()
    )

    let appleEaten$ = apples$.pipe(
        skip(1),
        tap(() => length$.next(POINTS_PER_APPLE)),  //  返回Observable的镜像Observable
    ).subscribe();

    let scene$: Observable<Scene> = combineLatest

    return
}