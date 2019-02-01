游戏需要的功能：
- 使用方向键操控蛇
- 记录玩家的分数
- 记录蛇（包括吃苹果和移动）
- 记录苹果（包括生成新苹果）

1、用户的输入肯定是随着时间变化的，玩家通过方向键来操控蛇，第一个源头流keydown$，每次按键都会发出值。
2、记录分数，分数取决于蛇迟了多少个苹果，分数也决定了蛇的长度，下一个源头是snakeLength$。
3、找出以计算出任何所需要的主要数据源（列如比分）

游戏相关的流：
- 蛇：随时间滚动，所以它最重要的是依赖于时间因素，因此蛇的源头流是一个定时器，它每隔一定的时间便会产生值，我们称之为tick$。这个流还决定了蛇的移动速度。
- 苹果：依赖于蛇，每次蛇移动时，检查蛇头是否与苹果碰撞，如果碰撞，就生成新的苹果。

所需的所有的源头流：
- keydown$: keydown事件（keyboardEvent）
- snakeLength$: 表示蛇的长度（Number）
- ticks$: 定时器，表示蛇的速度（Number）

### 蛇的转向
蛇的转向依赖于键盘输入，首先创建一个键盘事件的observable序列，这是第一个源头流，用户每次按键时都会发出KeyboardEvent，但是只关心方向键，并非所有按键。

### direction$
keydown事件的流，每次触发按键之后，将其映射成值，即把KeyboardEvent映射成上面的某个方向向量。
```
let direction$ = keydown$.map((event: KeyboardEvent) => DIRECTIONS[event.keyCode])
```
我们会收到每个按键事件，因为还未过滤掉不关心的键，我们已经通过方向映射中查找事件来进行过滤，在映射中找不到keyCode会返回undefined，但是这并非真正意义的过滤。
```
let direction$ = keydown$
    .map((event: KeyboardEvent) => DIRECTIONS[event.keyCode])
    .filter(direction => !!direction)
```
阻止蛇朝反方向前进，列如，从左至右或从上到下，这样的行为是完全没有意义，因为游戏的首要原则是避免首尾相撞。
解决方法就是缓存一个前进的方向，当新的keydown事件发生后，检查新方向与前一个方向是否是相反的。
```
export function nextDirection(previous, next){
    let isOpposite = (previous: Point2D, next: Point2D)=>{
        return next.x === previous.x*-1 || next.y===previous.y*-1
    }
    if(isOpposite(previous, next)){
        return previous;
    }
    return next;
}
```
但是我们要避免使用外部状态，需要一种方法来聚合无限的Observable，使用scan来保存前一个状态的值。
```
let direction$ = keydown$
    .map((event: KeyboardEvent)=> DIRECTIONS[event.keyCode])
    .filter(direction => !!direction)
    .scan(nextDirection)
    .startWith(INITIAL_DIRECTION)
    .distinctUntilChanged();
```
startWith会在Observable(keydown$)开始发出值前发出一个初始值，如果不使用startWith()，那么只有当按键触发后，我们的Observable才会开始发出值。其次，只有当发出的方向与前一个不同时才会将其发出，distinctUntilCHanged()过滤掉相同的值，只保留一个值。

### 记录长度
在实现蛇本身之前，需要记录它的长度，需要长度信息作为比分的数据来源，在命令式编程的世界中，蛇每次移动时，只需要简单地检查是否有碰撞即可，如果有的话就增加，所以完全不需要记录长度。但是这样任然需要引入另一个外部状态变量，BehaviorSubject来实现广播机制，这是一种特殊的Subject，它表示一个随时间而变化的值，当观察者订阅了BehaviorSubject，它会接收到最后发出的值以及后续发出的所有值，独特性在于需要一个初始值。
```
let length$ = new BehaviorSubject<number>(SNAKE_LENGTH);
```
实现snakeLength$，snakeLength$作为snake$的输入流，但同时又是比分的源头流，因此我们会对同一个observable进行第二次订阅，最终导致重新创建了源头流，这是因为length$是冷的observable。
```
let snakeLength$ = length$
                        .scan((step, snakeLength)=> snakeLength+step)
                        .share();
```
share()允许多次订阅observable，否则每次订阅都会重新创建源Observable，此操作符会自动在原始源Observable和未来所有订阅者之间创建一个subject，只要订阅者的数量从0变为1，它就会将Subject连接到底层的源Observable并广播所有通知，所有订阅者都将连接到中间的Subject，所以实际上底层的冷的Observable只有一个订阅。

### 实现score$
```
let score$ = snakeLength$.startWith(0).scan((socre, _)=> score+POINTS_PER_APPLE);
```
使用sankeLength$或者length$来通知订阅者有碰撞（如果有的话），我们通过POINT_PER_APPLE来增加分数，每个苹果的分数是固定的，注意startWith(0)必须在scan()前面，以避免指定种子值（初始的积累值）。

BehaviorSubject的初始值只出现在snakeLength$中，而并没有出现在score$中，那是因为第一个订阅者将使得share()订阅底层的数据源，而底层的数据源会立即发出值，当随后的订阅再发生时，这个值其实已经存在了。

### snake$
类似计时器的东西让饥饿的蛇保持移动，可以使用interval(x)来做这件事，他每隔x毫秒就会发出值，我们称之为tick(钟表的滴答声)。
```
let tick$ = Observable.interval(SPEED);
```
从tick$到最终的snake$，每次定时器触发，我们想要蛇继续前进还是增加它的身长，这取决于蛇是否吃到了苹果，所以，我们依可以使用scan()操作符来累积出蛇身的数组。

如何引进direction$或snakeLength$流引入进来？
无论是方向还是蛇的长度，如果想要在snake$流中轻易的访问他们，都需要在Observable管道外使用变量来保存这些信息，但是，这样的话就违背了修改外部状态的规则，所以我们使用withLatestFrom()，这个操作符用来组合流，应用于主要的源Observable，由它来控制何时将数据发送到结果流上。当你想组合多个流时，并且对这些被组合的流所发出的数据不感兴趣时，它就非常实用。
```
let snake$ = tick$
                    .withLatestFrom(direction$, snakeLength$, (_, direction, snakeLength)=>[direction, snakeLength])
                    .scan(move, generateSnake())
                    .share()
```
主要的源Observable是tick$，每当管道上有新值发出，我们就取direction$和snakeLength$的最新值，即使是辅助流频繁地发出值，也只会在每次定时器发出值时处理数据。
### 生成苹果
每次蛇移动时就检查是否有碰撞，如果有碰撞，就生成一个新的苹果并返回一个新的数组，这样就可以利用distinctUntilChanged()来过滤掉完全相同的值。
```
let apple$ = snake$
                    .scan(eat, generateApples())
                    .distinctUntilChanged()
                    .share()
```
每当apple$产生一个新值时，我们就可以假定蛇吞掉了一个苹果，剩下要做的就是增加比分，还要将该事件通知给其他流，比如snake$，它从snakeLength$中获取最新值，以确定是否将蛇的身体变长。

### 广播事件
```
export function eat(apples: Array<Point2D>, snake){
    let head = snake[0];
    for(let i = 0;i<apples.length;i++){
        if(checkCollision(apples[i], head)){
            apples.splice(i, 1);
            // length$.next(POINTS_PER_APPLE);
            return [...apples, getRandomPosition(snake)]
        }
    }
    return apples;
}
```
在if中调用length$.next(POINT_PER_APPLE)，但是这样会导致具体方法无法提取到自己的模块（ES2015模块）中，ES2015模块一般都是一个模块一个文件，这样组织代码的目的主要是让代码变得更容易维护和推导。解决方式是引入另一个流，appleEaten$，这个流是基于apples$的，每次流发出新值时，就执行一个动作，即调用length$.next()，为此，我们可以调用do()操作符，每次发出值都会执行一段代码。但是，我们需要通过某种方式来跳过apple$发出的第一个值（初始值），否则，最终将变成开场立刻增加比分，但这在刚刚开始时

