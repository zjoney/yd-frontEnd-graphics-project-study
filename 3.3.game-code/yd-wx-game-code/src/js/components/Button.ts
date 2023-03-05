import { Subject } from 'rxjs';

class Button extends Phaser.GameObjects.Image {
  private clickSubject:Subject<Phaser.Input.Pointer> = new rxjs.Subject();
  /*
   让用户给按钮设置皮肤
   让用户能够得到对应的点击事件
   */
  // constructor() {
  //   // super();
  //   // 可以开始构建对应的点击事件
  //   this.setInteractive().on();
  // }

  onClick() {
    return this.clickSubject.asObservable();
  }
}

// Phaser.GameObjects.GameObjectFactory.register('buttonContainer',function (
//     return this.displayList.add(new Button())
// ));
export default Button;
