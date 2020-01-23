# charles https 抓包

# 简介

charles同fiddler一样，也是一款非常优秀的抓包工具，**抓包原理同fiddler一样，也是中间人攻击（man-in-the-middle）**，charles与服务通信时，使用服务器发送的证书；charles与客户端通信使用自签的证书，所以需要让客户端信任根证书。

# 特点

相比较fiddler，charles可以用在mac、windows上，而fiddler由于是C#写的，所以只能在windows下使用，mac下无法使用。另外**最新的charles版本是V4.0.1，已经支持http2、ipv6**，这是fiddler所不支持的。charles对于http2的连接使用了特殊的闪电符号。 
![这里写图片描述](https://img-blog.csdn.net/20161215203606623?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZ2p1bjUxNTk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

不过charles是收费的，可以免费使用，但是每次只能使用30分钟，并且在使用过程中，经常会有延迟，不过可以破解；将[破解包](http://download.csdn.net/detail/wangjun5159/9712671)copy到charles安装目录的lib目录下。

# 步骤

网上绝多数的charles设置教程，都是mac系统的，下边介绍windows的设置过程。

- 安装根证书，由于生成的证书默认不受系统信任，所以安装时，选择 **受信任的根证书颁发机构**

  - ![这里写图片描述](https://img-blog.csdn.net/20161215203832327?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZ2p1bjUxNTk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
  - ![这里写图片描述](https://img-blog.csdn.net/20161215204439075?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZ2p1bjUxNTk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

- 启用SSL拦截

  - Proxy——>SSL proxy settings—->enable ssl proxy—->新建键值对，host空着，port填443，如图![这里写图片描述](https://img-blog.csdn.net/20161215204759001?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZ2p1bjUxNTk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

- 拦截windows

  - ![这里写图片描述](https://img-blog.csdn.net/20161215204847333?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZ2p1bjUxNTk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

- 开始录制

  - ![这里写图片描述](https://img-blog.csdn.net/20161215205039115?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZ2p1bjUxNTk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

- 效果

  - 老规矩，还是抓百度的页面 
    ![这里写图片描述](https://img-blog.csdn.net/20161215205620888?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZ2p1bjUxNTk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

  ![这里写图片描述](https://img-blog.csdn.net/20161215205523148?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZ2p1bjUxNTk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

# 总结

charles抓包原理同fiddler一样，设置过程大同小异。所以，最重要的是理解抓包原理，只有理解了原理，设置过程才能了然于胸，也便于解决问题，**原理最重要！**