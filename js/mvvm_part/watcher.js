/**
 * @author Miyi
 * @date 2018/6/20
 * @description MVVM--Watcher  观察者的目的在于给需要变化的那个元素增加一个观察者，当数据变化后执行对应的方法
 */

class Watcher{
    constructor(vm,expr,cb){

        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        //先获取老的值
        this.value = this.get();
    }
    getVal(vm,expr){
        expr = expr.split('.');
        return expr.reduce((pre,next)=>{
            return pre[next];
        },vm.$data);
    }
    get(){
        Dep.target = this;//只要一创建Watcher实例,就把实例赋给Dep.target
        let value = this.getVal(this.vm,this.expr);//这里一取属性就会调用属性的get()方法，在observer.js
        //更新完后后，要取消掉
        Dep.target = null;
        return value;
    }
    //什么时候调用新值
    //对外暴露的更新方法，有人会拿旧值和新值作比较，如果不一样就执行cb
    update(){
        let newValue = this.getVal(this.vm,this.expr);
        let oldValue = this.value;
        if (newValue !== oldValue){
            //调用watcher的回调函数
            this.cb(newValue);
        }
    }

}