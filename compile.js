/**
 * @author Miyi
 * @date 2018/6/20
 * @description MVVM--Compile
 */

class Compile{
    constructor(el,vm){
        this.el = this.isElementNode(el)?el:document.querySelector(el);
        this.vm = vm;
        if(this.el){
            //如果这个元素能获取到 我们才开始编译
            //1.先把这些真实的DOM移入到内存中 fragement
            let fragment = this.nodeToFragment(this.el);
            //2.编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
            this.compile(fragment);
            //3.把编译好的fragement再返回页面去
            this.el.appendChild(fragment);
        }
    }
    /* 辅助方法，比如判断功能*/

    /**
     * 判断是否是一个元素节点
     * @param node
     * @returns {boolean}
     */
    isElementNode(node){
        return node.nodeType === 1;
    }

    /* 核心方法，主要功能*/

    /**
     * 判断属性名字是不是包含'v-'
     * @param name
     * @returns {*|void}
     */
    isDirective(name){
        return name.includes('v-');
    }

    /**
     * 编译带'v-'属性的元素节点，DOM元素不能用正则判断
     * @param node
     */
    compileElement(node) {
        //取当前节点的属性
        let attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                //取到对应的值放到节点中
                let expr = attr.value;
                //取'v-'后面的值
                let type = attrName.slice(2);
                //node this.vm.$data  在对象vm上，取实例的值expr，放到节点node上
                CompileUtil[type](node, this.vm, expr);
            }
        });
    }

    /**
     * 编译文本节点，取文本内容整体 {{a}} {{b}} {{c}} 或者是{{ abc }}
     * @param node
     */
    compileText(node){
        let text = node.textContent;
        let reg = /\{\{([^}]+)\}\}/g;
        if (reg.test(text)){
            //node this.vm.$data text
            CompileUtil['text'](node,this.vm,text);
        }
    }

    /**
     * 需要递归所有节点，判断是什么类型的节点，分别使用不同的编译方法
     * @param fragment 文档碎片
     */
    compile(fragment){
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node=>{
            if(this.isElementNode(node)){
                //元素节点，里面可能还有子节点，所以还要递归
                //这里需要编译元素
                this.compileElement(node);
                this.compile(node);
            }else{
                //文本节点
                //这里需要编译文本
                this.compileText(node);
            }
        });
    }

    /**
     * 将节点el里的全部内容放到内存里面
     * @param el
     * @returns {DocumentFragment}
     */
    nodeToFragment(el) {
        //内存中的DOM节点
        let fragment = document.createDocumentFragment();
        let firstChild;
        //每次取app里面的第一个子节点，直到取完
        while (firstChild = el.firstChild){
            fragment.appendChild(firstChild);
        }
        //内存中的节点
        return fragment;
    }
}

/**
 * 编译的工具方法
 * @type {{}}
 */
CompileUtil = {

    /**
     * 获取实例上对应的数据，返回 vm.$data.XXX，'info.a' => [info,a] vm.$data.info.a
     * @param vm
     * @param expr
     * @returns {T}
     */
    getVal(vm,expr){
        expr = expr.split('.');
        return expr.reduce((pre,next)=>{
            return pre[next];
        },vm.$data);
    },
    /**
     * 获取编译文本后的结果
     * @param vm
     * @param text
     * @returns {string | * | void}
     */
    getTextVal(vm,text){
        return text.replace(/\{\{([^}]+)\}\}/g, (...arguments)=>{
            //拿到第一个分组，并且要取得没有空格的字符串，否则会报错
            return this.getVal(vm,arguments[1].trim());
        });
    },
    /**
     * {{ info.a }} => How are you 取值
     * @param node
     * @param vm
     * @param text
     */
    text(node,vm,text){

        let updateFn = this.updater['textUpdater'];
        let value = this.getTextVal(vm,text);
        console.log(value);
        //这个方法存在再去调用
        updateFn && updateFn(node,value);
    },
    /**
     * 输入框处理
     * @param node
     * @param vm
     * @param expr
     */
    model(node,vm,expr){
        let updateFn = this.updater['modelUpdater'];

        //这个方法存在再去调用
        updateFn && updateFn(node,this.getVal(vm,expr));
    },
    html(){
        //todo
    },
    /*公共逻辑的复用*/
    updater:{
        /**
         * 文本更新
         * @param node
         * @param value
         */
        textUpdater(node,value){
            node.textContent = value;
        },
        /**
         * 输入框更新
         * @param node
         * @param value
         */
        modelUpdater(node,value){
            node.value = value;
        }
    }

};