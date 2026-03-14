# Mobile App (Expo)

環境構築手順は `docs/` にまとめています。

- WSL/Windows: `docs/windows.md`
- macOS: `docs/mac.md`

## よく使うコマンド（Makefile）

`mobile/` ディレクトリで実行してください。

### 依存関係のインストール

```bash
make setup
```

### 開発サーバー起動

```bash
make start
```

WSL で接続が不安定な場合はトンネルを使います。

```bash
make start-tunnel
```

### Android エミュレーター起動

事前に `ANDROID_HOME` を設定してください。

```bash
export ANDROID_HOME="/mnt/c/Users/<your>/AppData/Local/Android/Sdk"
```

エミュレーター起動（AVD 名は任意）。

```bash
make android AVD=Pixel_5
```

### adb コマンド

```bash
make adb-start
make adb-devices
make adb-kill
```
