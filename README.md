# YouTube-Loop-Marker

YouTubeの再生中にA/B地点をマウス操作で設定し、A〜B区間のループ再生とジャンプを行うChrome拡張です。

## 設計方針
- コンテンツスクリプトでプレイヤー上に軽量なUIを追加する
- A/B地点の設定はボタンのみで行い、ショートカットはジャンプ専用にする
- `timeupdate` イベントでループ制御を行う

## 使い方
1. `chrome://extensions` を開く
2. 「デベロッパーモード」をONにする
3. 「パッケージ化されていない拡張機能を読み込む」からこのフォルダを選択する
4. YouTubeの動画ページを開く
5. プレイヤー上のUIでA/B地点を設定し、ループをONにする
6. ショートカットでA/B地点へジャンプする

### ショートカット
- Windows/Linux: `Ctrl+Shift+A` / `Ctrl+Shift+B`
- macOS: `Command+Shift+A` / `Command+Shift+B`
