class Observer {
    constructor(data){
        this.observe(data);
    }

    /**
     * 将所有data数据改成set和get的形式
     * @param data
     */
    observe(data){
        //数据不存在或者数据不是对象
        if (!data || typeof data !== 'object'){
            return;
        }
        //将数据一一劫持 先获取到data的key和value
        Object.keys(data).forEach(key => {
            //劫持,若data[key]是个对象，则时需要递归劫持
            this.defineReactive(data,key,data[key]);
            this.observe(data[key]);
        });
    }

    /**
     * 定义响应式，在赋新值的时候加点中间过程
     * @param obj 数据对象
     * @param key 数据对象属性
     * @param value 属性值
     */
    defineReactive(obj,key,value){
        let that = this;
        let dep = new Dep();//每个变化的数据都会对应一个数组，这个数组存放所有更新的操作
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            /*取值时调用的方法*/
            get(){
                //Dep.target是Watcher实例，实例化Watcher后，才有Dep.target，只有Dep.target存在才执行这条语句
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            /*给data属性中设置值时，更改获取的属性的值*/
            set(newValue){
                if(newValue !== value){
                    //这里的this不是实例
                    //如果是对象继续劫持
                    // that.observe(newValue);
                    value = newValue;
                    dep.notify();//通知全体，数据更新了
                }
            }
        });
    }
}

