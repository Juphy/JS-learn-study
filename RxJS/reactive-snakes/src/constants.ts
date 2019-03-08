import { Directions } from "./types";
// 各方向移动的效果
export const DIRECTIONS: Directions = {
    37: { x: -1, y: 0 }, // 左键
    39: { x: 1, y: 0 }, // 右键
    38: { x: 0, y: -1 }, // 上键
    40: { x: 0, y: 1 }, // 下键
}

export const SNAKE_LENGTH = 5; // 初始长度
export const APPLE_COUNT = 2; // 苹果的个数
export const POINTS_PER_APPLE = 1; //  每个苹果的分数

export const SPEED = 200; // 速度
export const FPS = 60;