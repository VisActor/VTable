<div align="center">
   <a href="https://github.com/VisActor#gh-light-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_light.svg"/>
  </a>
  <a href="https://github.com/VisActor#gh-dark-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_dark.svg"/>
  </a>
</div>

<div align="center">
  <h1>VTable</h1>
</div>

<div align="center">

VTableは、高性能な多次元データ分析テーブルであるだけでなく、行と列の間にアートを作成するグリッドアーティストでもあります。

<p align="center">
  <a href="https://visactor.io/vtable">紹介</a> •
  <a href="https://visactor.io/vtable/example">デモ</a> •
  <a href="https://visactor.io/vtable/guide/Getting_Started/Getting_Started">チュートリアル</a> •
  <a href="https://visactor.io/vtable/option/ListTable">API</a>•
</p>

![](https://github.com/visactor/vtable/actions/workflows/bug-server.yml/badge.svg)
![](https://github.com/visactor/vtable/actions/workflows/unit-test.yml/badge.svg)
[![npm Version](https://img.shields.io/npm/v/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vtable)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vtable)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

<div align="center">

[English](./README.md) | [简体中文](./README.zh-CN.md) | 日本語

</div>

<div align="center">

（ビデオ）

</div>

# 紹介

VTableは、VisActorの可視化システムの一部であり、可視化レンダリングエンジン[VRender](https://github.com/VisActor/VRender)に基づいています。

主な機能は次のとおりです：

1. 極端なパフォーマンス：数百万のデータポイントの高速計算とレンダリングをサポートします。
2. 多次元分析：多次元データを自動的に分析し、表示します。
3. 強力な表現力：柔軟で強力なグラフィック機能を提供し、[VChart](https://github.com/VisActor/VChart)のチャートとシームレスに統合します。

# リポジトリの紹介

このリポジトリには次のパッケージが含まれています：

1. packages/vtable: VTableのコアコードリポジトリ
2. packages/vtable-gantt: ガントチャートコンポーネントのコード
3. packages/vtable-editors: テーブルエディタコンポーネントのコード
4. packages/vtable-export: テーブルエクスポートツールのコード
5. packages/vtable-search: テーブル検索ツールのコード
6. packages/react-vtable: Reactバージョンのテーブルコンポーネント
7. packages/vue-vtable: Vueバージョンのテーブルコンポーネント
8. docs: VTableのサイトチュートリアル、デモ、API、オプションを含むすべての中国語と英語のドキュメント。

# 使用方法

## インストール

[npmパッケージ](https://www.npmjs.com/package/@visactor/vtable)

```bash
// npm
npm install @visactor/vtable

// yarn
yarn add @visactor/vtable
```

## クイックスタート

```javascript
// このデモはcodesanboxで実行できます https://codesandbox.io/s/vtable-simple-demo-g8q738
import * as VTable from '@visactor/vtable';

const columns = [
  {
    field: 'Order ID',
    caption: 'Order ID'
  },
  {
    field: 'Customer ID',
    caption: 'Customer ID'
  },
  {
    field: 'Product Name',
    caption: 'Product Name'
  },
  {
    field: 'Sales',
    caption: 'Sales'
  },
  {
    field: 'Profit',
    caption: 'Profit'
  }
];

const option = {
  container: document.getElementById(CONTAINER_ID),
  records: [
    {
      'Order ID': 'CA-2018-156720',
      'Customer ID': 'JM-15580',
      'Product Name': 'Bagged Rubber Bands',
      Sales: '3.024',
      Profit: '-0.605'
    },
    {
      'Order ID': 'CA-2018-115427',
      'Customer ID': 'EB-13975',
      'Product Name': 'GBC Binding covers',
      Sales: '20.72',
      Profit: '6.475'
    }
    // ...
  ],
  columns
};
const tableInstance = new VTable.ListTable(option);
```

##

[詳細なデモとチュートリアル](https://visactor.io/vtable)

# ⌨️ 開発

まず、[@microsoft/rush](https://rushjs.io/pages/intro/get_started/)をインストールしてください。

```bash
$ npm i --global @microsoft/rush
```

次に、コードをローカルにクローンします：

```bash
# クローン
$ git clone git@github.com:VisActor/VTable.git
$ cd VTable
# 依存関係をインストール
$ rush update
# vtableデモを開始
$ cd packages/vtable
# ファイルパスで実行: ./packages/vtable
$ rushx demo
# サイト開発サーバーを開始、ファイルパスで実行: ./
$ rush docs
# git commitを実行した後、次のコマンドを実行して変更ログを更新してください。ファイルパスで実行: ./
$ rush change-all
```

# 📖 ドキュメント

インストールとクローンと更新が完了したら、docsを実行してVTableのドキュメントをローカルでプレビューします。

```bash
# vtableドキュメントサーバーを開始。ファイルパスで実行: ./
$ rush docs
```

# 🔗 関連リンク

- [公式サイト](https://visactor.io/vtable)
- [使用トレンド](https://npm-compare.com/@visactor/vtable)

# 💫 エコシステム

| プロジェクト                                                                      | 説明               |
| ---------------------------------------------------------------------------- | ----------------- |
| [React-VTable](https://www.visactor.io/vtable/guide/Developer_Ecology/react) | VTableのReactコンポーネント |

# ⭐️ スター履歴

[![Star History Chart](https://api.star-history.com/svg?repos=visactor/vtable&type=Date)](https://star-history.com/#visactor/vtable&Date)

# 🤝 貢献

貢献したい場合は、まず[行動規範](./CODE_OF_CONDUCT.md)と[ガイド](./CONTRIBUTING.md)をお読みください。

小さな流れが集まり、大きな川や海になります！

<a href="https://github.com/visactor/vtable/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vtable" /></a>

# ライセンス

[MITライセンス](./LICENSE)
