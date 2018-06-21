class MVVM {
    constructor(options) {
        //先把可用的东西挂载在实例上，加上$是私有的，外面调不到
        this.$el = options.el;
        this.$data = options.data;

        //判断：是否存在要编译的模板，存在则开始编译
        if (this.$el) {
            //用数据和元素进行编译，直接传入MVVM的实例，避免以后可能会添加某些元素
            new Compile(this.$el, this);
        }
    }
}