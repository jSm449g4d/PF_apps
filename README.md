# 全体構成  
![1](https://github.com/jSm449g4d/PF_apps/blob/master/assets/sikumi.png)  
## 使用技術   
### エディタ
- VSCode  
### インフラ  
- ローカル環境: Windows10 & anaconda + Waitress/Flask  
- テスト環境: GCP(Cloudbuild, CloudRun) + Debian + Waitress/Flask  
- 本番環境: VPS + Ubuntu20.04 + Apache2.4 & Waitress/Flask
### フロントエンド  
- React(Typescript)  
### バックエンド  
- Flask(Python)
- Firebase(Firestore, GCS)
### その他  
- Docker
- Webpack4
- Sass
- bootstrap4
- fontawesome

# 注文受付システム  
![2](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_front.png)  
- 本番環境   
https://huxiin.ga/app_tsx.html?application=oszv&portfolio  
- テスト環境(**本番環境が動かなかったら、こちらをお試しください**)  
https://sfb-tlnesjcoqq-an.a.run.app/app_tsx.html?application=oszv&portfolio  
- このアプリの記事  
https://huxiin.ga/wordpress/?p=2485  
## 説明  
飲食店での使用を想定した、注文や受付を行うWebサービスです。  
ユーザーは**商品を注文**したり、**店員を呼び出し**たり、**出店したり**できます。  
※2020/09/01現在も開発は続いているので、仕様変更したらごめんなさい。  
## 使い方  
### 入店編(客側)  
上のURLからページにジャンプしてください(評価モードで自動ログインします)。  
適当な店(**今回は居酒屋**)に入店します。  
店を出たい場合、左上のパンくずリストから出ることができます。  
### 注文編(客側)  
![3](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_inned.png)  
商品を選ぶとモーダルが開き、注文が可能です。  
黄色い呼び出しボタンを押すと、店舗側に「ぽーん、お客からの呼び出しですー」というアナウンスが鳴ります(店側が**音をON**にしている場合)。  
注文履歴→注文を選んでキャンセル申請できまます(**一度注文した場合、店側の了承が無いと消せない設定です**)  
|||
|---|---|
|![](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_orderingselect.png)|![](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_ordering.png)|

### 受注編(店側)  
かんたんアカウント変更から店主のアカウント(**今回は出品店1**)を選択して、アカウント変更します。  
※**評価モード**(クエリにportfolioが付いている)でない場合、店側のアカウントでログイン操作をする必要があります。  
注文履歴→注文を選んで**取引承認**、**キャンセル**、**呼び出し**等の操作が可能です  
呼び出しすると、客側に「ピンポーン、呼び出しですー」というアナウンスが鳴ります(客側が**音をON**にしている場合)。 
|||
|---|---|
|![](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_orderedselect.png)|![](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_ordered.png)|

### 新商品追加(店側)  
商品一覧→「+商品を追加」というボタンを押すと、新商品追加モーダルが開きます。  
商品名を入力して新商品を追加すると、新商品の詳細を入力するモーダルが開きます。  
**画像**や**詳細**を入力してください。  
また、商品一覧→商品を選択することで、いつでも商品の詳細設定が出来ます。  
|商品追加前|商品追加後|
|---|---|
|![](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_willadditem.png)|![](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_additem.png)|

### マイページ(開発中の機能)  
**マイページ**から店の画像やユーザー名を変更できます。  
※2020/09/01現在、「自分の店→店の名前を変える」を行わないと、店の画像の更新が反映されません  
|**評価モード**でマイページへ飛ぶ  |**本来の仕様**でマイページで飛ぶ |
|---|---|
|![8](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_maiA.png)|![9](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_maiB.png)|

![10](https://github.com/jSm449g4d/PF_apps/blob/master/assets/oszv_maiDa.png)  
