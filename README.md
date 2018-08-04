# Vue--MVVM
MVVM（Model-View-ViewModel）是基于MVC和MVP的体系结构模式，它目的在于更清楚地将用户界面（UI）的开发与 应用程序中业务逻辑和行为的开发区分开来。所以，MVVM模式的许多实现都使用声明性 数据绑定来允许从其他层分离视图上的工作。
### Model      
- 1.现实世界中对事物的抽象结果，就是建模。
- 2.我们可以把Model称为数据层，因为它仅仅关注数据本身，不关心任何行为
### View
- 1.用户操作界面
- 2.当ViewModel对Model进行更新的时候，会通过数据绑定更新到View
### ViewModel
- 1.业务逻辑层，View需要什么数据，ViewModel要提供这个数据；View有某些操作，ViewModel就要响应这些操作，所以可以说它是Model for View.
- 2.MVVM模式的重点就在View和ViewModel的交互，View和ViewModel有两种交互方式：
> 双向传递数据--数据属性和data binding，
> 单向传递操作--命令属性。
- 3.由于ViewModel中的双向数据绑定，当Model发生变化，ViewModel就会自动更新；ViewModel变化，Model也会更新
## 这里只实现文本节点和v-model属性节点的MVVM模式
- 总的思路：先有5个主要js文件，分别写模板编译Compile，数据劫持Observer，观察者Watcher，发布订阅者Dep，最后靠MVVM来整合的。

```
project
│   
└───index_mvvm.html           页面入口文件
│   
└─────────js                  js文件
│    │   
│    └───MVVM.js              MVVM类：整合功能
│    │   
│    └───mvvm_part            存放功能类的文件
│        │ 
│        └───compile.js       Compile类：编译功能
│        │   
│        └───observer.js      Observer类：数据劫持功能
│        │   
│        └───watcher.js       Watcher类：观察者
│        │   
│        └───dep.js           Dep类：发布订阅着
│   
└───README.md        
   
```


### 模板的编译Compile
- 这个 {{ message}} 是模板，它要先取到数据data.message，然后要编译成我们想要的数据格式。
### 数据劫持Observer
- 在Vue中主要通过ES5提供的 Object.defineProperty( ) 方法来劫持（监控）各属性变化，即给所有的对象上的某一些数据都加上get、set方法。
### 观察者Watcher
- 数据变化了，就要告诉视图重新编译模板，那么编译模板和数据劫持之间就需要一个关联，那就是Watcher。而Compile和Observer的具体通信靠的就是订阅者Dep，后文代码实现的时候再仔细讨论Dep。
