# YouTube-Loop-Marker 要件定義（requirements.md）

## 目的
YouTubeの動画再生中に「A地点」「B地点」をマウス操作で設定し、A〜B区間の自動ループ再生と、指定地点へのジャンプを行えるChrome拡張を提供する。

## 前提
- Chrome拡張（Manifest V3）として実装する
- 対象はYouTubeの通常視聴ページ（`https://www.youtube.com/watch?v=...`）
- A/B地点の設定は**マウス操作のみ**で行う（ショートカットでの設定は禁止）
- A/B地点へのジャンプはショートカットキーで可能とする（mac向けにCommand/Optionを使用）

## 主要機能
### 1. A/B地点の設定（マウス操作）
- YouTubeプレイヤー上に拡張UIを追加し、以下の操作を提供
  - 「A地点を設定」ボタン
  - 「B地点を設定」ボタン
- クリック時点の再生位置（`video.currentTime`）をそれぞれ保存

### 2. A〜B区間のループ再生
- A/Bが両方設定済みの場合にループモードを有効化できる
- ループ中は `timeupdate` で `currentTime >= B` なら `currentTime = A` へ戻す
- ループのON/OFFはUIのトグルボタンで切替

### 3. 指定地点へのジャンプ（ショートカット）
- 例：
  - `Command+Shift+A` → A地点へジャンプ
  - `Command+Shift+B` → B地点へジャンプ
- ショートカットはChrome拡張のcommandsで定義

### 4. 状態表示
- A/Bの設定値（秒数）をUIに表示
- ループON/OFF状態も表示

## 非機能要件
- YouTube以外のページには影響を与えない
- UIは既存プレイヤーの操作を邪魔しない軽量なものにする

## 技術構成（想定）
- `manifest.json`（Manifest V3）
- `content_script.js`（YouTube上でUI追加＆制御）
- `style.css`（UIスタイル）
- `background.js`（ショートカット処理、タブへのメッセージ送信）

## 軽い設計メモ
- A/B設定は**マウス操作のみ**という要件のため、
  プレイヤー上に小型のUIパネルを設置（例：右下付近）
- ショートカットは地点設定ではなく**ジャンプ専用**に限定
- ループ機能はvideo要素の`timeupdate`イベントで制御

## 実行方法（利用手順）
1. `chrome://extensions` を開く
2. 「デベロッパーモード」をON
3. 拡張フォルダを「パッケージ化されていない拡張機能を読み込む」で指定
4. YouTubeの動画ページを開く
5. UIでA/B地点をマウスで設定
6. ループONでA〜B区間の自動ループを確認
7. ショートカットでA/B地点へジャンプ
