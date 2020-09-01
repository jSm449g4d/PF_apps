## 全体構成
![1](https://github.com/jSm449g4d/PF_apps/blob/master/assets/sikumi.png)  
**使用技術**  
クラウド  
 GCP: Firestore, GCS, CloudBuild, CloudRun(テスト環境)  
 VPS: Ubuntu+Apache2.4(本番環境)  
フロントエンド  
 React(Typescript)  
バックエンド  
 Flask(Python), Firebase
その他  
 Sass,Docker,bootstrap4,fontawesome

# 注文受付システム  
![2](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_front.png)  
本番環境   
https://huxiin.ga/app_tsx.html?application=oszv&portfolio  
テスト環境  
https://sfb-tlnesjcoqq-an.a.run.app/app_tsx.html?application=oszv&portfolio  
このアプリの記事  
https://huxiin.ga/wordpress/?p=2485  
## 説明  
飲食店での使用を想定した、注文や受付を行うWebサービスです。  
ユーザーは**商品を注文**したり、**店員を呼び出し**たり、**出店したり**できます。  
※2020/09/01現在も開発は続いているので、仕様変更したらごめんなさい。  
## 使い方  
### 入店編  
上のURLからページにジャンプしてください(評価モードで自動ログインします)。  
適当な店(**今回は居酒屋**)に入店します。
### 注文編  
![3](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_inned.png)  
商品を選ぶとモーダルが開き、注文が可能です。  
黄色い呼び出しボタンを押すと、店舗側に「ぽーん、お客からの呼び出しですー」というアナウンスが鳴ります(店側が**音をON**にしている場合)。  
注文履歴→商品を選んでキャンセルできまます  
