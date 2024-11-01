# コントリビューションガイド

まず、オープンソースのコントリビューターの仲間入りをするというあなたの決断を称賛します👍🏻。さらに、VisActorコミュニティに参加し、このオープンソースプロジェクトに貢献していただき、非常に感謝しています。

## VTableコントリビューションガイド

VisActorチームは通常、GitHubで開発とissueの管理を行っています。[GitHubのウェブサイト](https://github.com/)を開き、右上の`Sign up`ボタンをクリックしてアカウントを登録し、オープンソースの旅の第一歩を踏み出してください。

何らかの理由でGitHubサイトを開くことができない場合は、[Gitee](https://gitee.com/VisActor/VTable)を通じてプロジェクトを開発することもできます。

[VTableリポジトリ](https://github.com/VisActor/VTable)には、すべてのオープンソースコントリビューター向けの[ガイド](https://github.com/VisActor/VTable/blob/develop/CONTRIBUTING.zh-CN.md)があり、バージョン管理、ブランチ管理などの内容を紹介しています。**数分間お読みいただき、理解してください**。

## 初めてのプルリクエスト

### ステップ1：Gitのインストール

Gitは、ソフトウェア開発プロジェクトのコード変更を追跡および管理するためのバージョン管理システムです。開発者がコードの履歴を記録および管理し、チームのコラボレーション、コードのバージョン管理、コードのマージなどを容易にします。Gitを使用すると、すべてのファイルのすべてのバージョンを追跡し、異なるバージョン間で簡単に切り替えおよび比較できます。Gitはまた、複数の並行開発タスクを同時に実行できるブランチ管理機能も提供します。

- Git公式ウェブサイトにアクセス：<https://git-scm.com/>
- 最新バージョンのGitインストーラーをダウンロードします。
- ダウンロードしたインストーラーを実行し、インストールウィザードの指示に従います。
- インストールが完了したら、コマンドラインで`git version`コマンドを使用してインストールが成功したことを確認できます。

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_1.png" />
  </div>

### ステップ2：プロジェクトをフォークする

- まず、このプロジェクトをフォークする必要があります。[VTableプロジェクトページ](https://github.com/VisActor/VTable)にアクセスし、右上のForkボタンをクリックします。

<div style="width: 80%; text-align: center;">
    <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_2.png" />
 </div>

- あなたのGitHubアカウントに「xxxx（あなたのGitHubユーザー名）/VTable」というプロジェクトが表示されます。
- ローカルコンピュータで次のコマンドを使用して「VTable」フォルダを取得します。

```
// ssh
git clone git@github.com:xxxx（あなたのGitHubユーザー名）/VTable.git
// https
git clone https://github.com/xxxx（あなたのGitHubユーザー名）/VTable.git
```

### ステップ3：プロジェクトコードを取得する

- VTableフォルダに入り、VTableのリモートアドレスを追加します。

```
git remote add upstream https://github.com/VisActor/VTable.git
```

- VTableの最新のソースコードを取得します。

```
git pull upstream develop
```

### ステップ4：ブランチを作成する

- さて、コードの貢献を始めることができます。VTableのデフォルトブランチはdevelopブランチです。機能開発、バグ修正、ドキュメント作成のいずれであっても、新しいブランチを作成し、developブランチにマージしてください。次のコードを使用してブランチを作成します。

```
// 機能開発ブランチを作成する
git checkout -b feat/xxxx

// 問題修正開発ブランチを作成する
git checkout -b fix/xxxx

// ドキュメント、デモブランチを作成する
git checkout -b docs/add-funnel-demo
```

- これで、ブランチ上でコードを変更できます。
- たとえば、いくつかのコードを追加し、それをリポジトリにコミットしたとします。
- `git commit -a -m "docs: add custom funnel demo and related docs"`。VisActorのコミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)仕様に従います。

  - `<type>[optional scope]: <description>`。
  - 一般的な`type`には、docs（ドキュメント、ログの変更）、feat（新機能）、fix（バグ修正）、refactor（コードリファクタリング）などがあります。実際の状況に応じて選択してください。
  - 説明は短く正確な英語で記述してください。
  - コミットする前に、コミットリントチェックを実行します。詳細については、[検査ルール](https://github.com/VisActor/VTable/blob/develop/common/autoinstallers/lint/commitlint.config.js)を参照してください。

### ステップ5：マージと修正

- 一般的な問題は、リモートのupstream（@visactor/VTable）が新しいコミットで更新されていることです。これにより、プルリクエストを送信する際に競合が発生する可能性があります。したがって、プルリクエストを送信する前に、リモートリポジトリの他の開発者のコミットを自分のコミットとマージできます。次のコードを使用してdevelopブランチに切り替えます。

```
git checkout develop
```

- 次のコードを使用してリモートから最新のコードを取得します。

```
git pull upstream develop
```

- 自分の開発ブランチに戻ります。

```
git checkout docs/add-funnel-demo
```

- developのコミットを`add-funnel-demo`にマージします。

```
git rebase develop
```

- 更新されたコードを自分のブランチにコミットします。

```
git push origin docs/add-funnel-demo
```

### ステップ6：プルリクエストを送信する

GitHubのコードリポジトリページで`Pull requests`ボタンをクリックし、次に`New pull request`をクリックできます。

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_3.png" />
  </div>

developブランチに送信することを選択します。

テンプレートに従ってこの送信の変更内容を記入します。

- どのタイプの変更かを確認します。

<div style="display: flex;">
 <div style="width: 30%; text-align: center; ">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_4.png" />
  </div>
    </div>

- 関連するissueを記入します。

<div style="display: flex;">
 <div style="width: 20%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_5.png" />
  </div>
  </div>

- 複雑な変更については、背景と解決策を説明してください。

<div style="display: flex;">
 <div style="width: 60%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_6.png" />
  </div>
  </div>

関連情報を記入したら、Create pull requestをクリックして送信します。

## ミニタスク開発ガイド

"**good first issue**"はオープンソースコミュニティで一般的なラベルであり、新しいコントリビューターが適切な入門レベルの問題を見つけるのを支援することを目的としています。

VTableの入門レベルの問題については、[issueリスト](https://github.com/VisActor/VTable/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)を通じて確認できます。現在、次の2種類が含まれています。

- デモの作成
- バグ修正と簡単な機能開発

現在、コミュニティへの貢献に参加する時間と意欲がある場合は、issueで**good first issue**を見て、興味があり、自分に適したものを選んでください。

あなたが始めたことを終わらせる人であると信じていますので、問題を理解し、クレームすることを決定したら、issueの下にメッセージを残してみんなに知らせてください。

### デモタスク

実際のアプリケーションシナリオで一般的なケースをいくつか用意しました。VTableの機能を活用してそれらを実現する方法を考える必要があります。これらのタスクを使用して、VTableの使用を開始できます。VTableは豊富な機能を提供しており、誰もが異なる実装アイデアを持っているかもしれません。**issueの下にコメントを残し、他の人と解決策を議論することができます**。

タスクを完了したら、作成したケースを公式デモに提出し、必要な人が学び、使用できるようにします。すべてのデモは`docs/assets/demo`ディレクトリに保存されます。

1.  開発を`develop`ブランチに基づいて行い、新しい`docs/***`ブランチを作成してください。
1.  （すでにインストールしている場合はこのステップをスキップしてください）`npm i --global @microsoft/rush`を使用して[@microsoft/rush](https://rushjs.io/pages/intro/get_started/)をグローバルにインストールします。
1.  ルートディレクトリから`rush update`を実行します。
1.  `rush docs`を実行して、現在のデモコンテンツをローカルでプレビューします。
1.  `docs`ディレクトリの下で：
1.  `docs/assets/demo/menu.json`ディレクトリファイルにデモ情報を追加します。
1.  `zh`/`en`ディレクトリでそれぞれ中国語と英語のデモドキュメントを完成させます。
1.  カバーアドレスのカバーフィールドについては、VTableチームのメンバーに連絡してアップロードを支援してもらうことができます。
1.  すべてのコードをコミットし、GitHubでプルリクエストを作成し、他の人にレビューを依頼します。

### バグ修正/機能タスク

ここでは、簡単で始めやすい機能開発タスクをいくつか紹介します。JavaScript/TypeScriptの基礎がある場合は、これらのタスクをクレームできます。

要件を開発することで、VTableのコードアーキテクチャをより迅速に学ぶことができます。**issueの下にメッセージを残し、解決策を他の人と議論することができます**。

1.  開発を`develop`ブランチに基づいて行い、新しい`feat/***`または`fix/***`ブランチを作成してください。
1.  （すでにインストールしている場合はこのステップをスキップしてください）`npm i --global @microsoft/rush`を使用して[@microsoft/rush](https://rushjs.io/pages/intro/get_started/)をグローバルにインストールします。

```
# 依存関係をインストール
$ rush update
# vtableパッケージに入る
$ cd packages/vtable
# ファイルパスで実行: ./packages/vtable
$ rushx demo
# サイト開発サーバーを開始、ファイルパスで実行: ./
$ rush docs
# git commitを実行した後、次のコマンドを実行して変更ログを更新してください。ファイルパスで実行: ./
$ rush change-all
```

3.  すべてのコードをコミットし、GitHubでプルリクエストを作成し、他の人にレビューを依頼します。

### プロモーションタスク貢献ガイド

プロモーションタスクとは、VisActorに関連する資料（記事、デモ、ビデオなど）をさまざまなメディアチャネルで公開する行動を指します。

新しいissueを作成し、タイプを`others`に設定し、`promotion`タグを付けます。次に、関連するリンク、スクリーンショット、要約などを一緒に投稿します。

例：https://github.com/VisActor/VChart/issues/2858

毎四半期、VisActorのプロモーション作品をいくつか選び、作者に物質的な報酬を提供します。

## VisActorコミュニティを受け入れる

VisActorにコードを貢献するだけでなく、コミュニティをより繁栄させるための他の活動にも参加することを奨励します。たとえば：

1.  プロジェクトの開発、機能計画などのアイデアを提案する
1.  記事、ビデオを作成し、VisActorを宣伝する講演を開催する
1.  プロモーション計画を作成し、チームと一緒に実行する

VisActorは、コミュニティの構築に参加する学生が一緒に成長するのを支援することにも取り組んでいます。次の支援を提供する予定です（ただし、これに限定されず、皆さんからの提案をお待ちしています）。

1.  VisActorに基づくデータ可視化の研究開発トレーニングを提供し、参加する学生がプログラミングスキル、可視化理論、アーキテクチャ設計などの面で迅速に成長できるようにします。
1.  定期的に「コード貢献賞」と「コミュニティプロモーション賞」を選出します。
1.  コミュニティメンバーを組織してオープンソース活動に参加します。
