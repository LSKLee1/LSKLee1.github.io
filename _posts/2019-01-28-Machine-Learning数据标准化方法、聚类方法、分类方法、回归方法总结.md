---
layout:     post
title:      "Machine Learning数据标准化方法、聚类方法、分类方法、回归方法总结"
subtitle:   "ML常用方法小总结"
date:       2019-01-27 19:12:10
author:     "Reno"
header-img: "img/post-bg-MLmethodsConclusion.jpg"
catalog: true
tags:
    - Machine Learning
    - Programe

---

## 数据标准化的方法： 

（1）离差标准化(最大最小值标准化）  
（2）标准差标准化   
（3）归一化标准化   
（4）二值化标准化   
（5）独热编码标准化    

## 聚类的方法： 
（1）划分法（k-means算法（k-均值算法），k-MEDOIDS算法（k-中心），CLARANS算法）   
（2）层次分析方法（BIRCH算法，cure算法）   
（3）基于密度的方法（DBSCAN算法，DENCLUS算法）   
（4）基于网格的方法（STING算法，CLIOUE算法（聚类高维空间））   

#### 聚类模型评价的指标： 

（1） 兰德系数（ARI评价法），需要真实值，最佳值为1，python里的sklearm函数adjust_rand_score   
（2）互信息（AMI评价法），需要真实值，最佳值为1，python里的sklearm函数adjust_mutuai_info_score   
（3）V-measure评价法， 需要真实值，最佳值为1，python里的sklearm函数completeness_score   
（4）FMI评价法，需要真实值，最佳值为1，python里的sklearm函数fowlkes_mallows_score   
（5）轮廓系数评价法，不需要真实值，畸变程度最大，python里的sklearm函数silhouette_score   
（6）Calinski- Harabasz指数评价法，不需要真实值，相对较大，python里的sklearm函数calinski_harabaz_core   



Tips：评价的标准是组内的相似性越大，组间相似性越小，前四种方法因为有真实值得参与相对于后两种更具有说服力，那么当有真实值得参与时聚类的评价可以等同于分类算法的评价 ，轮廓系数在不考虑业务情况下得分越高越好，最高得分是1 

## 分类模型的方法： 
（1）逻辑斯蒂回归，在python里的模块为linear_model,函数名为logisticRegression   
（2）支持向量机，在python里的模块为SVM ，函数名为SVC   
（3） k最近邻分类，在python里的模块为neighbors ，函数名为KNeighborsClassifier   
（4）高斯朴素贝叶斯，在python里的模块为naive_bayes ，函数名为GaussiaNB   
（5）分类决策树，在python里的模块为tree ，函数名为Decision Tree Classifier   
（6） 随机森林，在python里的模块为ensemble ，函数名为RandomForestClassifier   
（7）梯度提升分类树，在python里的模块为ensemble ，函数名为GrndientBoostingClassidier   

#### 分类模型评价的指标： 

（1） precision（精确率），最佳值为1，sklearn函数metrics.precision_score   
（2）Recall(召回率)，最佳值为1，sklearn函数metrics.recall_score   
（3）F1 值，最佳值为1 ，sklearn函数metrics.f1_score   
（4）Cohen’s Kappa系数，最佳值为1，sklearn.cohen_kappa_score   
（5）ROC曲线，最靠近有轴，在sklearn。roc_curve   

## 回归模型的方法： 
线性回归、非线性回归、logistics回归、岭回归、主成分回归   
线性回归，在python里的模块linear_model, 函数为linearRegression   
支持向量机回归，在python里的模块svm, 函数为SVR   
最近岭回归、回归决策树、随机森林回归、梯度提升回归树  

#### 回归模型的评价指标： 

| 方法名称        | 最优值 | sklearn函数                       |
| --------------- | ------ | --------------------------------- |
| 平均绝对误差    | 0.0    | metrics. mean_absolute_error      |
| 均方误差        | 0.0    | metrics. mean_squared_error       |
| 中值绝对误差    | 0.0    | metrics. median_absolute_error    |
| 可解释方差值    | 1.0    | metrics. explained_variance_score |
| R方值，确定系数 | 1.0    | metrics. r2_score                 |

---

Tips：回归模型的评价不同于分类模型，虽然都是对真实在进行对比，但是由于回归模型的预测结果的真实值都是线性的，不能够求取precision，recall，和f1等值评价，回归模型拥有自己的评价指标。 

