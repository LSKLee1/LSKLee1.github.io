---
layout:     post
title:      "BlueBridge——序列求和"
subtitle:   " \"垃圾题\" "
date:       2019-02-27 11:07:00
author:     "Reno"
header-img: "img/post-bg-blueBridge.jpg"
catalog: true
tags:
    - BlueBridge



---

```java
import java.util.Scanner;

public class Main {
	public static void main(String args[]){
		   long n = new Scanner(System.in).nextInt();
	       System.out.println( ((1+n)*n)/2 );
	}
}
```

注意：

1. 不要用循环，时间不够，背点公式
2. int可能储存不了太大的数，用long

