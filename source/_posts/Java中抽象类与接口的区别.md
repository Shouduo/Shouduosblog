---
title: Java 中抽象类与接口的区别
author: Shouduo
date: 2016-08-27 10:22:45
updated: 2016-08-31 20:17:09
tags: ['Android', 'Java']
categories: ['Android']
banner_img: /img/post/java_abstract_versus_interface.png
index_img: /img/post/java_abstract_versus_interface.png
abbrlink: java_abstract_versus_interface
---

## 前言

在 Java 中，抽象类 与 接口 都对多态的实现提供了非常好的支持，但在具体开发中两者又有诸多不同之处，根据实际应用采取合适的方法是程序员必备的素养。

## 抽象类

抽象类是用来捕捉、归纳子类的通用特性的。抽象类是被用来创建继承层级里子类的模板的。

1. 抽象类不能被实例化，只能被用作子类的超类，但可以被用来声明引用；
2. **非抽象子类**必须对抽象父类的所有抽象方法进行重写（抽象子类则不必）；
3. 抽象类可以包含具体的方法、普通成员变量和静态成员变量，访问类型任意；
4. 子类中的抽象方法不能与父类中的抽象方法同名；
5. 包含抽象方法的类必声明为抽象类，反之，抽象类中却不一定包含抽象方法；
6. abstract不能与private，static，final或native并列修饰同一个方法（抽象方法需要在抽象类被子类继承，且子类可以访问抽象类的抽象方法时才可被重写。即抽象方法的作用域必须包含子类）。

例如：

``` java
// abstractTest.java
abstract class Animal{
  private String name;  //抽象类可以包含普通成员变量
  
  public Animal(String name){
    this.name = name;
  }
  public void eat(){  //抽象类可以包含具体的方法
    System.out.println(getName() + " is eating...");
  }
  public String getName(){
    return name;
  }
  public abstract void cry();  //抽象方法提取子类的共性
}

class Dog extends Animal{
  public Dog(String name){
    super(name);
  }
  public void cry(){  //子类必须重写父类的抽象方法
    System.out.println(getName() + ": Wang wang!");
  }
}

class Cat extends Animal{
  public Cat(String name){
    super(name);
  }
  public void cry(){
    System.out.println(getName() + ": Mewo mewo~");
  }
}

public class abstractTest{
  public static void main(String[] args){
    Animal a1 = new Dog("Doge");  //抽象类不能实例化但可以声明引用
    Animal a2 = new Cat("Catty");

    a1.eat();  //实现多态
    a2.eat();

    a1.cry();  //实现多态
    a2.cry();
  }
}
```

运行结果：
> Doge is eating...
> Catty is eating...
> Doge: Wang wang!
> Catty: Mewo mewo~

## 接口

接口是抽象方法的集合。如果一个类实现（implements）了某个接口，那么它就获得了这个接口的抽象方法。接口是用来建立类与类之间的协议的，它的提供只是一种形式，没有具体的实现。

1.接口不能被实例化，但可以被类实现（implements），可以被其他接口继承（extends），可以被用来声明引用；
2.**非抽象类**必须对接口中所有抽象方法进行重写（抽象类则不必）；
3.接口中不能有构造方法；
4.接口中只能有公共抽象方法，未显示声明的方法都将被自动声明为 public abstract，如果使用 protected、private、会导致编译错误；
5.接口中只能有静态常量，未显示声明的“成员变量”将被自动声明为 public final static，而且必须被显示初始化；
6.实现多接口时需要注意方法名是否重复。

例如：

``` java
// Cry.java
public interface Cry{
  public abstract void cry(); //显示声明public abstract
}
```

``` java
// Eat.java
public interface Eat{
  void eat();  //接口中的方法将自动声明为public abstract
}
```

``` java
// interfaceTest.java
class Animal implements Cry, Eat{  //类可以实现多接口
  private String name;
  private String crying;
  public Animal(String name, String crying){
    this.name = name;
    this.crying = crying;
  }
  public String getName(){
    return name;
  }
  public String getCrying(){
    return crying;
  }
  public void cry(){  //必须重写接口中的抽象方法
    System.out.println(getName() + ": " + getCrying());
  }
  public void eat(){
    System.out.println(getName() + " is eating...");
  }
} 

public class interfaceTest{
  public static void main(String[] args){
    Animal a1 = new Animal("Doge", "Wang wang!");
    Animal a2 = new Animal("Catty", "Mewo mewo~");

    a1.eat();
    a2.eat();

    a1.cry();
    a2.cry();
  }
}
```

运行结果：
> Doge is eating...
> Catty is eating...
> Doge: Wang wang!
> Catty: Mewo mewo~

## 抽象类 与 接口 的对比

参数 | 抽象类 | 接口
----|--------|------
默认的方法实现  | 它可以有默认的方法实现 | 接口完全是抽象的，不存在方法实现（JDK 1.8 中接口的抽象方法也可以有默认的方法实现：[Java 8 之默认方法——作者：kimy](http://blog.csdn.net/kimylrong/article/details/47277577)）
实现 | 子类使用 extends 关键字来继承抽象类。如果子类不是抽象类的话，它需要提供抽象类中所有声明的方法的实现 | 子类使用关键字 implements 来实现接口。它需要提供接口中所有声明的方法的实现
构造器 | 抽象类可以有构造器 | 接口不能有构造器
与正常 Java 类的区别 | 除了不能实例化抽象类之外，它和普通Java类没有任何区别 | 接口是完全不同的类型
访问修饰符 | 抽象方法可以有 public、protected 和 default 这些修饰符 | 接口方法默认修饰符是 public。你不可以使用其它修饰符
main 方法 | 抽象方法可以有 main 方法并且可以运行 | 接口没有 main 方法，因此不能运行
多继承 | 抽象方法可以继承一个类和实现多个接口 | 接口只可以继承一个或多个其它接口
速度 | 它比接口速度要快 | 接口是稍微有点慢，因为它需要时间去寻找在类中实现的方法
添加新方法 | 如果往抽象类中添加新的方法，可以给它提供默认的实现。因此不需要改变现在的代码 | 如果往接口中添加方法，那么必须改变实现该接口的类

## 总结

抽象类方式中，抽象类可以拥有任意范围的成员数据，同时也可以拥有自己的非抽象方法；但是接口方式中，仅能够有静态、不能修改的成员数据（即 final static，但是一般是不会在接口中使用成员数据），同时它所有的方法都必须是抽象的。在某种程度上来说，接口是抽象类的特殊化。可以这样理解，抽象类是对类的抽象，接口是对行为的抽象。抽象类对是类整体进行抽象，包括属性、行为，而接口是对类局部（行为）进行抽象。

分析如下：

- 如果有一些相似但不全相同的方法，并且想让它们中的一些有默认实现，那么使用抽象类吧；
- 如果类想实现多重继承，那么必须使用接口。由于 Java 不支持多继承，子类不能够继承多个类，但可以实现多个接口。因此就可以使用接口来解决；
- 如果基本功能在不断改变，那么就需要使用抽象类。

## 补充

抽象类中的抽象方法不能用 private、static、**synchronized**、final、native 访问修饰符修饰。

原因如下：
修饰符 | 原因
-------|-------
private | 抽象方法没有方法体，是用来被继承的，所以不能用 private 修饰
static | static 修饰的方法可以通过类名来访问该方法，抽象方法用 static 修饰没有意义
synchronized | 使用 synchronized 关键字是为该方法加一个锁。而如果该关键字修饰的方法是 static 方法。则使用的锁就是 class 变量的锁。如果是修饰类方法。则用 this 变量锁。但是抽象类不能实例化对象，因为该方法不是在该抽象类中实现的，是在其子类实现的，所以，锁应该归其子类所有，抽象方法也就不能用 synchronized 关键字修饰了
final | 被 final 修饰的方法不可被重写，抽象方法用 final 修饰没有意义
native | native 本身就和 abstract 冲突，他们都是方法的声明，只是一个把方法实现移交给子类，另一个是移交给本地操作系统。如果同时出现，就相当于即把实现移交给子类，又把实现移交给本地操作系统

接口是一种特殊的抽象类，接口中的方法全部是抽象方法，所以抽象类中的抽象方法不能用的访问修饰符接口也不能用；而且 protected 访问修饰符也不能使用，因为接口可以让所有的类去实现，所以接口中的抽象方法只能被声明为 public。

---
> 声明：
> 文章为本人在空闲时编写、整理、摘抄所得的学习笔记，一方面作为自己日后查询回顾知识的工具，另一方面也公开至互联网作学习分享。
> 文章中有许多整段粘贴、表述参考的地方，亦有个人见解之处，由于文章篇幅较长，引用之处未在文中明确标注，而是在文章末尾注明参考文章链接，请谅解。
> 文中如若出现错漏之处，请回复指明，我将非常感激！
> 转载请附带原文地址及下方参考文章链接，请勿商业使用。

参考文章：
[Java基础篇(一)：接口与抽象类 | 作者：zhutoulwz](http://www.jianshu.com/p/2b5a9bdcd25f)
[Java抽象类与接口的区别 | 作者：Arpit Mandliya | 翻译：Jessenpan](http://www.importnew.com/12399.html)
[java接口的方法修饰符可以为？(忽略内部接口) | 作者：奔跑中的蜗牛](https://www.nowcoder.com/questionTerminal/4b12e28267ad4e0ab8cde2c4a7c93a8d)
