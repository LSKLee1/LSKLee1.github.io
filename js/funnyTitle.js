// <!--浏览器搞笑标题-->
 var OriginTitle = document.title;
 var titleTime;
 document.addEventListener('visibilitychange', function () {
     if (document.hidden) {
         $('[rel="icon"]').attr('href', "/img/avatar-reno.jpg");
         document.title = '(╬◣д◢)怎么不看我!';
         clearTimeout(titleTime);
     }
     else {
         $('[rel="icon"]').attr('href', "/img/avatar-reno.jpg");
         document.title = '(￣▽￣)我是不是很帅啊?' + OriginTitle;
         titleTime = setTimeout(function () {
             document.title = OriginTitle;
         }, 2000);
     }
 });
