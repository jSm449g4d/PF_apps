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
### 入店編(客側)  
上のURLからページにジャンプしてください(評価モードで自動ログインします)。  
適当な店(**今回は居酒屋**)に入店します。
### 注文編(客側)  
![3](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_inned.png)  
商品を選ぶとモーダルが開き、注文が可能です。  
黄色い呼び出しボタンを押すと、店舗側に「ぽーん、お客からの呼び出しですー」というアナウンスが鳴ります(店側が**音をON**にしている場合)。  
注文履歴→注文を選んでキャンセル申請できまます(**一度注文した場合、店側の了承が無いと消せない設定です**)  
![4](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_ordering.png)  
### 受注編(店側)  
かんたんアカウント変更から店主のアカウント(**今回は出品店1**)を選択して、アカウント変更します  
※**評価モード**(クエリにportfolioが付いている)でない場合、店側のアカウントでログイン操作をする必要があります  
注文履歴→注文を選んで**取引承認**、**キャンセル**、**呼び出し**等の操作が可能です  
呼び出しすると、客側に「ピンポーン、呼び出しですー」というアナウンスが鳴ります(客側が**音をON**にしている場合)。 
![5](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_ordered.png)  
### 新商品追加(店側)  
商品一覧→「+商品を追加」というボタンを押すと、新商品追加モーダルが開きます。  
商品名を入力して新商品を追加すると、新商品の詳細を入力するモーダルが開きます。  
**画像**や**詳細**を入力してください。
また、商品一覧→商品を選択することで、いつでも商品の詳細設定が出来ます。  
![6](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_additem.png)  
