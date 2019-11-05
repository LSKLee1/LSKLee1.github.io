java.sql.Date,java.sql.Time和java.sql.Timestamp三个都是java.util.Date的子类（包装类）。

java.sql.Date是java.util.Date的子类，是一个包装了毫秒值的瘦包装器，允许 JDBC 将毫秒值标识为 SQL DATE 值。毫秒值表示自 1970 年 1 月 1 日 00:00:00 GMT 以来经过的毫秒数。 为了与 SQL DATE 的定义一致，由 java.sql.Date 实例包装的毫秒值必须通过将时间、分钟、秒和毫秒设置为与该实例相关的特定时区中的零来“规范化”。

说白了，java.sql.Date就是与数据库Date相对应的一个类型，而java.util.Date是纯java的Date。

从类 java.util.Date 继承的方法  
after, before, clone, compareTo, equals, getDate, getDay, getMonth, getTime, getTimezoneOffset, getYear, hashCode, parse, setDate, setMonth, setYear, toGMTString, toLocaleString, UTC 



| sql.Date也有时间的如果不想用oracle的to_date函数，可以自己生成sql.Date对象 String s = "2012-06-21 00:10:00"; SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); java.util.Date d1 = sdf.parse(s); //先把字符串转为util.Date对象 java.sql.Date d2 = new java.sql.Date(d1.getTime()); //再转换为sql.Date对象 |
| ------------------------------------------------------------ |
|                                                              |



想要将带时分秒的时间插入到数据库中，除了Oracle数据库的to_date()方法之外。我们可以用 Timestamp类来实现。java.sql.Date是规范化之后的时间，其时分秒部分被截取掉了。

java.sql.Date是为了配合SQL DATE而设置的数据类型。“规范化”的java.sql.Date只包含年月日信息，时分秒毫秒都会清零。格式类似：YYYY-MM-DD。当我们调用ResultSet的getDate()方法来获得返回值时，java程序会参照"规范"的java.sql.Date来格式化数据库中的数值。因此，如果数据库中存在的非规范化部分的信息将会被劫取。
 在sun提供的ResultSet.java中这样对getDate进行注释的：
       Retrieves the of the designated column in the current row of this <code>ResultSet</code> object as a “java.sql.Date” object in the Java programming language.


         同理。如果我们把一个java.sql.Date值通过PrepareStatement的setDate方法存入数据库时，java程序会对传入的java.sql.Date规范化，非规范化的部分将会被劫取。然而，我们java.sql.Date一般由java.util.Date转换过来，如：java.sql.Date sqlDate=new java.sql.Date(new java.util.Date().getTime()).
显然，这样转换过来的java.sql.Date往往不是一个规范的java.sql.Date.要保存java.util.Date的精确值，
我们需要利用java.sql.Timestamp.

eg：

 

[java]

view plain

copy









1. <span style="font-size:18px;">  String s="2012-01-02 03:12:21";  
2. ​        SimpleDateFormat sp = **new** SimpleDateFormat("yyyy-MM-dd hh:mm:ss");  
3. ​        java.util.Date du = sp.parse(s);  
4. ​            java.sql.Timestamp st = **new** java.sql.Timestamp(du.getTime());</span>  















把一个日期值写入数据库中，发现由java.util.Date转存为java.sql.Date后，只有年月日，没有了时分秒: 

1. java.util.Date ud = **new** java.util.Date();   
2. java.sql.Date sd = **new** java.sql.Date(ud.getTime()); 

  这个可是不行的，用户至少要精确到分。由于java.sql.Date为了能够遵守sql日期标准，把所有时分秒都归了零。只有用Timestamp来进行保存，由于Timestamp是子类，因此写好的bean里面不需要修改数据类型。 

1. pstmt.setTimestamp(15, **new** java.sql.Timestamp(Calendar.getInstance().getTime().getTime()));  //当前时间  
2. pstmt.setTimestamp(16, **new** java.sql.Timestamp(userFile.getCreateTime().getTime()));  //指定时间   

对于指定时间还可以用Calendar类的setTime()方法来设置





[java]

view plain

copy









1. <span style="font-size:18px;">Calendar cal = Calendar.getInstance();  
2. ​            System.out.println(cal.getTime().getTime());  
3. ​        String string="2012-01-01 01:02:03";  
4. ​    SimpleDateFormat sp = **new** SimpleDateFormat("yyyy-MM-dd hh:mm:ss");  
5. ​        java.util.Date da = sp.parse(string);  
6. ​        cal.setTime(da);  
7. ​            System.out.println(cal.getTime().getTime());</span>  


 在数据库中插入带时分秒的时间需要用Timestamp。一般做这种操作用框架居多，我就说一下Hibernate吧。在数据库表中字段类型设置为Date数据类型，代码中映射的字段类型设置为 Timestamp类型， private Timestamp date;  在映射文件中 <property name="date" type="timestamp" column="sj"/> Type也是时间戳类型的。在赋值取值的时候用前面的操作获取到需要的时间的时间戳对象直接赋值就行。然后就可以用Hibernate执行方法将带时分秒的时间存入到数据库里了。(不过这一点意义好像不是很大，大多都是直接varchar2存进去，取时候再to_date一下或者在代码里处理)

​      还需要说一点的就是

在使用SimpleDateFormat时格式化时间的 yyyy.MM.dd 为年月日而如果希望格式化时间为12小时制的，则使用**hh:mm:ss** 如果希望格式化时间为24小时制的，则使用**HH:mm:ss，上代码：**





[java]

view plain

copy









1. SimpleDateFormat ss = **new** SimpleDateFormat("yyyy-MM-dd hh:mm:ss");//12小时制     


 

[java]

view plain

copy









1. SimpleDateFormat sdformat = **new** SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//24小时制  


 

[java]

view plain

copy









1. Date d = **new** Date();  
2. ​        SimpleDateFormat ss = **new** SimpleDateFormat("yyyy-MM-dd hh:mm:ss");//12小时制  
3. ​        System.out.println(ss.format(d));  
4.   
5. ​        Date date = **new** Date();  
6. ​        SimpleDateFormat sdformat = **new** SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//24小时制  
7. ​        String LgTime = sdformat.format(date);  
8. ​        System.out.println(LgTime);  
9.   
10.   
11. 结果为  
12. 2008-05-28 01:32:54  
13. 2008-05-28 13:32:54  


 Date类，已经很少用了。更多使用的是**Calendar     Calendar**    date    =    Calendar.getInstance();   
  date.get(**Calendar.HOUR_OF_DAY**    );//得到24小时机制的   
  date.get(**Calendar.HOUR**);//    得到12小时机制的   