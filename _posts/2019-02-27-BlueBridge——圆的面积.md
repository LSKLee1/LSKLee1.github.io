---
layout:     post
title:      "BlueBridge——圆的面积"
subtitle:   " \"垃圾题\" "
date:       2019-02-27 11:05:00
author:     "Reno"
header-img: "img/post-bg-nianhua.jpg"
catalog: true
tags:
    - BlueBridge


---

```java
import	java.util.Scanner;
public	class	Main {
    public	static	void	main(String[] args) {
        int	n = new	Scanner(System.in).nextInt();
        System.out.printf("%.7f",Math.PI*n*n);
    }
}
```

printf()方法里的常用格式和C语言中的用差不多一样的

int i = 1234;

double d = 321.654;

String s = "hello!";

System.out.printf("%f",d);  //"f"表示格式化输出浮点数。

System.out.printf("%10.4f",d);   //"10.4"中的10表示输出的长度(符号,小数点也算位数)，4表示小数点后的位数。

 System.out.printf("%+9.2f",d);   //"+"表示输出的数带正负号。  

System.out.printf("%-9.4f",d);   //"-"表示输出的数左对齐（默认为右对齐）。

System.out.printf("%+-9.3f",d);   //"+-"表示输出的数带正负号且左对齐。   

System.out.printf("%d",i);   //"d"表示输出十进制整数。   

System.out.printf("%o",i);   //"o"表示输出八进制整数(**注意是小写字母"o"**)。   

System.out.printf("%x",i);   //"x"表示输出十六进制整数。(大小写不分)   

System.out.printf("%#x",i);   //"#x"表示输出带有十六进制标志的整数。 

System.out.printf("输出一个浮点数：%f，一个整数：%d，一个字符串：%s", d , i , s);  //可以输出多个变量，注意顺序。

System.out.printf("字符串：%2$s，%1$d的十六进制数：%1$#x", i , s);   //"X$"表示第几个变量。