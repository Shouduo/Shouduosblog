---
title: 手动实现 Promise
author: Shouduo
date: 2021-06-02 12:42:18
updated: 2021-06-04 19:38:05
tags: ['前端', 'Promise', 'ES6']
categories: ['Front-end']
banner_img: /img/post/promise_diy.png
index_img: /img/post/promise_diy.png
abbrlink: promise_diy
---

## 前言

- Promise 是在 js 中进行异步编程的新解决方案。（以前旧的方案是单纯使用回调函数）
- 从语法来说，promise 是一个构造函数。
- 从功能来说，promise 对象用来封装一个异步操作，并且可以获得成功或失败的返回值。
- JS 中的常见的异步操作：定时器，AJAX 中一般也是异步操作（也可以同步），回调函数可以理解为异步（不是严谨的异步操作）…等。

## ES5 构造函数实现

``` javascript
// 自定义函数 Promise
function Promise(executor) {
    //添加状态属性与结果值属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    // 定义 callback 属性，保存 pending 状态的回调函数
    this.callbacks = [];
    //保存实例对象的this值
    const that = this;
    //自定义 resolve 函数,名字不一定用 resolve
    function resolve(data) {
        //判断状态是否修改过
        if (that.PromiseState !== 'pending') return;
        //改变状态属性
        that.PromiseState = 'fulfilled';  // 或者 resolve 
        //改变结果值属性
        that.PromiseResult = data;
        //异步任务成功后执行回调函数
        setTimeout(() => {
            that.callbacks.forEach(item => {
                item.onResolved(data);
            })
        });
    }
    //自定义 reject 函数
    function reject(data) {
        //判断状态是否修改过,改过就直接返回
        if (that.PromiseState !== 'pending') return;
        //改变状态属性
        that.PromiseState = 'rejected';
        //改变结果值属性
        that.PromiseResult = data;
        //异步任务失败后执行回调函数
        setTimeout(() => {
            that.callbacks.forEach(item => {
                item.onRejected(data);
            })
        });
    }
    try {
        //同步调用【执行器函数】
        executor(resolve, reject);
    } catch(e) {
        //更改 Promise 对象为失败
        reject(e);
    }
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
    const that = this;
    //判断回调参数是否存在
    if(typeof onRejected !== 'function') {
        onRejected = reason => {
            throw reason;
        }
    }
    if(typeof onResolved !== 'function') {
        onResolved = value => value;
    }
    return new Promise((resolve, reject) => {
        //封装重复的部分
        function callback(type) {
            try {
                //将结果值传入
                let result = type(that.PromiseResult);
                //判断
                if (result instanceof Promise) {
                    //如果是 Promise 对象
                    result.then(v => {
                        resolve(v);
                    }, r => {
                        reject(r);
                    })
                } else {
                    //结果对象状态为【成功】
                    resolve(result);
                }
            } catch (e) {
                reject(e);
            }
        }
        //如果 Promise 状态为 fulfilled 回调这个函数
        if (this.PromiseState === 'fulfilled') {
            setTimeout(()=>{
                callback(onResolved);
            });
        }
        //如果 Promise 状态为 rejected 回调这个函数
        if (this.PromiseState === 'rejected') {
            setTimeout(()=>{
                callback(onRejected);
            });
        }
        //如果 Promise 状态为 pending 保存回调函数
        if (this.PromiseState === 'pending') {
            this.callbacks.push({
                onResolved: function () {
                    callback(onResolved);
                },
                onRejected: function () {
                    callback(onRejected);
                }
            })
        }
    })
}

//添加 catch 方法
Promise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected);
}

//添加 resolve 方法
Promise.resolve = function(value) {
    //返回 promise 对象
    return new Promise((resolve, reject) => {
       if (value instanceof Promise) {
            value.then(v => {
               resolve(v);
            }, r => {
               reject(r);
            })
       } else {
            resolve(value);
       }
    })
}

//添加 reject 方法
Promise.reject = function(reason) {
    return new Promise((resolve,reject) => {
        reject(reason);
    });
}

//添加 all 方法
Promise.all = function(promises) {
    return new Promise((resolve,reject) => {
        //添加变量
        let count = 0;
        // 存放成功结果数组
        let arr =[];
        //遍历全部
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(v => {
                //能进到证明其为成功
                count++;
                //保存成功结果
                arr[i]=v;
                //如果全部成功
                if (count === promises.length) {
                    //状态为成功
                    resolve(arr);
                }
            }, r => {
                 //能进到证明其为失败
                reject(r);
            });
        }
    });
}

//添加 race 方法
Promise.race = function(promises) {
    return new Promise((resolve,reject) => {
        //遍历全部
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(v => {
                    //能进到证明其为成功
                    //状态为成功
                    resolve(v);
                }, r => {
                 //能进到证明其为失败
                reject(r);
            })
         }
    });
}

```

## ES6 Class 类实现

``` javascript
class Promise{
    //构造方法
    constructor(executor) {
        //添加状态属性与结果值属性
        this.PromiseState = 'pending';
        this.PromiseResult = null;
        // 定义 callback 属性，保存 pending 状态的回调函数
        this.callbacks = [];
        //保存实例对象的this值
        const that = this;
        //自定义 resolve 函数,名字不一定用 resolve
        function resolve(data) {
            //判断状态是否修改过
            if (that.PromiseState !== 'pending') return;
            //改变状态属性
            that.PromiseState = 'fulfilled';  // 或者 resolve 
            //改变结果值属性
            that.PromiseResult = data;
            //异步任务成功后执行回调函数
            setTimeout(() => {
                that.callbacks.forEach(item => {
                    item.onResolved(data);
                })
            });
        }
        //自定义 reject 函数
        function reject(data) {
            //判断状态是否修改过,改过就直接返回
            if (that.PromiseState !== 'pending') return;
            //改变状态属性
            that.PromiseState = 'rejected';
            //改变结果值属性
            that.PromiseResult = data;
            //异步任务失败后执行回调函数
            setTimeout(() => {
                that.callbacks.forEach(item => {
                    item.onRejected(data);
                })
            });
        }
        try {
            //同步调用【执行器函数】
            executor(resolve,reject);
        } catch(e) {
            //更改 Promise 对象为失败
            reject(e);
        }
    }

    //then 方法封装
    then(onResolved,onRejected) {
        const that = this;
        //判断回调参数是否存在
        if (typeof onRejected !== 'function') {
            onRejected = reason =>{
                throw reason;
            }
        }
        if (typeof onResolved !== 'function') {
            onResolved = value => value;
        }
        return new Promise((resolve, reject) => {
            //封装重复的部分
            function callback(type) {
                try {
                    //将结果值传入
                    let result = type(that.PromiseResult);
                    //判断
                    if (result instanceof Promise) {
                        //如果是 Promise 对象
                        result.then(v => {
                            resolve(v);
                        }, r => {
                            reject(r);
                        })
                    } else {
                        //结果对象状态为【成功】
                        resolve(result);
                    }
                } catch (e) {
                    reject(e);
                }
            }
            //如果 Promise 状态为 fulfilled 回调这个函数
            if (this.PromiseState === 'fulfilled') {
                setTimeout(() => {
                    callback(onResolved);
                });
            }
            //如果 Promise 状态为 rejected 回调这个函数
            if (this.PromiseState === 'rejected') {
                setTimeout(() => {
                    callback(onRejected);
                });
            }
            //如果 Promise 状态为 pending 保存回调函数
            if (this.PromiseState === 'pending') {
                this.callbacks.push({
                    onResolved: function () {
                        callback(onResolved);
                    },
                    onRejected: function () {
                        callback(onRejected);
                    }
                })
            }
        })
    }

    //catch 方法
    catch(onRejected) {
         return this.then(undefined, onRejected);
     }
     
    //resolve 方法
    static resolve(value) {
        //返回 promise 对象
        return new Promise((resolve, reject) =>{
            if (value instanceof Promise) {
                value.then(v => {
                  resolve(v);
                }, r => {
                  reject(r);
                })
            } else {
                  resolve(value);
            }
        })
    }

    //reject 方法
    static reject(reason) {
        return new Promise((resolve, reject)=>{
            reject(reason);
        });
    }

    //all 方法
    static all(promises) {
        return new Promise((resolve, reject) => {
            //添加变量
            let count = 0;
            // 存放成功结果数组
            let arr = [];
            //遍历全部
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(v => {
                    //能进到证明其为成功
                    count++;
                    //保存成功结果
                    arr[i] = v;
                    //如果全部成功
                    if (count === promises.length) {
                        //状态为成功
                        resolve(arr);
                    }
                }, r => {
                    //能进到证明其为失败
                    reject(r);
                });
            }
        });
    }

    //race 方法
    static race(promises) {
        return new Promise((resolve, reject) => {
            //遍历全部
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(v => {
                    //能进到证明其为成功
                    //状态为成功
                    resolve(v);
                }, r => {
                    //能进到证明其为失败
                    reject(r);
                })
            }
        });
    }

}
```

参考文章：
[前端Promise总结笔记 | 作者：北极光之夜。](https://blog.csdn.net/luo1831251387/article/details/115643059)
