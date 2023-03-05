var SPRITE_HEIGHT = 64;
var SPRITE_WIDTH = 64;
//只有这个碰撞检测的类型一致的时候才能发生碰撞
var COLLISION_TYPE = 1;
var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();
        var size = cc.winSize;
        var sprite = new cc.Sprite(res.bj_jpg);
        sprite.setPosition(size.width / 2, size.height / 2);
        this.addChild(sprite);
        //初始化物理引擎
        this.initPhysics();
        //开启游戏循环 不开启的话游戏永远是静止的
        this.scheduleUpdate();
        return true;
    },
    initPhysics: function () {
        var size = cc.winSize;
        //创建物理空间
        this.space = new cp.Space();
        //开启空间的调试
        //this.setDebugNode();
        //设置当前物理空间内部的重力加速度
        this.space.gravity = cp.v(0, -10);
        //获取物理空间内的全部静态物体
        var staticBody = this.space.staticBody;
        //设置空间的边界
        //todo 绘制一个彩虹的形状
        var walls = [new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(cc.winSize.width, 0), 30)];
        for (var i = 0; i < walls.length; i++) {
            var shape = walls[i];
            //设置弹性系数
            shape.setElasticity(1);
            //设置摩擦系数
            shape.setFriction(1);
            //设置整个物理空间的边缘要和形状关联起来
            this.space.addStaticShape(shape);
            // this.space.addStaticBody(staticBody);
        }
        //碰撞检测的回调函数
        this.space.addCollisionHandler(
            COLLISION_TYPE,
            COLLISION_TYPE,
            //当两个物体开始接触的时候 只触发一次
            this.collisionBegin.bind(this),
            //当两个物体接触的时候 持续触发该事件
            this.collisionPre.bind(this),
            //如果collisionPre返回是true 触发
            this.collisionPost.bind(this),
            //当两个物体分离的时候只触发一次
            this.collisionSeparate.bind(this),
        )
    },
    showEffect: function (spriteA) {
        this._particleSystem = new cc.ParticleSystem(res.First_plist);
        this._particleSystem.setAutoRemoveOnFinish(true);
        var size = spriteA.getPosition();
        this._particleSystem.setPositionX(size.x - 10);
        this._particleSystem.setPositionY(size.y);
        this.addChild(this._particleSystem);
    },
    collisionBegin: function () {},
    collisionPre: function () {},
    collisionPost: function () {},
    collisionSeparate: function (arbiter, space) {
        //通过相互的碰撞集合
        var shapes = arbiter.getShapes();
        var bodyA = shapes[0].getBody();
        var bodyB = shapes[1].getBody();
        //真正的检测物体
        var spriteA = bodyA.data;
        var spriteB = bodyB.data;
        if (spriteA != null && spriteB != null) {
            this.showEffect(spriteA);
        }
    },
    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBegan
        }, this);
    },
    createBody: function (filename, p) {
        //创建一个质量为1的动态物体
        //cp.momentForBox 表示物体运动收到的阻力 惯性力矩
        var body = new cp.Body(1, cp.momentForBox(1, SPRITE_WIDTH, SPRITE_HEIGHT));
        body.p = p;
        //把物体添加到物理空间内
        this.space.addBody(body);
        //将物体和形状进行绑定
        var shape = new cp.BoxShape(body, SPRITE_WIDTH, SPRITE_HEIGHT);
        //形状能够设置 弹性系数 摩擦系数
        shape.setElasticity(0.5);
        shape.setFriction(0.5);
        //设置碰撞检测的类型
        shape.setCollisionType(COLLISION_TYPE);
        this.space.addShape(shape);
        //只有精灵才能被展示
        var sprite = new cc.PhysicsSprite(filename);
        sprite.setBody(body);
        sprite.setPosition(cc.p(p.x, p.y));
        this.addChild(sprite);
        body.data = sprite;
        return body;
    },
    addNewSpriteAtPosition(p) {
        var body1 = this.createBody(res.Snowman_png, p);
        var body2 = this.createBody(res.Stone_png, cc.pAdd(p, cc.p(80, -80)));
        // 添加关节约束 
        this.space.addConstraint(new cp.PinJoint(body1, body2, cp.v(0, 0), cp.v(0, SPRITE_HEIGHT / 2)))
    },
    onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        var location = touch.getLocation();
        //在触摸点的位置添加精灵对象
        target.addNewSpriteAtPosition(location);
        return false;
    },
    setDebugNode: function () {
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible = true;
        this.addChild(this._debugNode);
    },
    update: function (dt) {
        var timeStep = 0.04;
        this.space.step(timeStep);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});