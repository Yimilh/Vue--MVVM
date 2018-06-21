class Dep{
    constructor(){
        //订阅的数组
        this.subs = [];

    }

    /**
     * 添加订阅
     * @param watcher
     */
    addSub(watcher){
        this.subs.push(watcher);
    }

    /**
     * 通知全体完成添加订阅，循环每一个watcher，调用watcher的update(),文本节点和表单全部重新赋值
     */
    notify(){
        this.subs.forEach(watcher => watcher.update());
    }
}