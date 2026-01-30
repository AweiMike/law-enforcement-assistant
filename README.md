# 115年交通執法小幫手 (Traffic Law Enforcement Assistant 115)

這是一個 LINE Bot，旨在協助第一線執法人員快速查詢並處理將於民國 115 年（2026年）1月31日 生效的新交通法規。

## 功能特色

- **四大違規模組**：
  1. **無照駕駛** (第21、21-1條)：依車種與累犯次數判定罰鍰與處置。
  2. **酒後駕車** (第35條)：區分酒測超標與拒測，以及是否肇事。
  3. **未禮讓/未避讓** (第44、45條)：針對行人與緊急車輛的避讓規定。
  4. **其他違規** (第72、78條等)：包含微型電動二輪車、行人違規及排氣管改裝警示。
- **SOP 檢查表**：提供現場執法步驟（如扣車、扣牌、舉發連坐）。
- **人性化介面**：採用 Flex Message 設計，字體清晰、操作直觀。

## 安裝與執行

1. **安裝依賴套件**：
   ```bash
   npm install
   ```

2. **設定環境變數**：
   複製 `.env.example` 為 `.env` 並填入您的 LINE Messaging API 資訊：
   ```ini
   LINE_ACCESS_TOKEN=您的Access_Token
   LINE_CHANNEL_SECRET=您的Channel_Secret
   ```

3. **本地開發 (Console 模式)**：
   無需 LINE 帳號即可在終端機測試對話流程。
   ```bash
   npm run dev
   ```

4. **正式部署 (Render)**：

### 部署至 Render

本專案支援部署至 Render (Web Service)。

1. **推送到 GitHub**：
   - 確保您的程式碼已推送到 GitHub Repository：
     `https://github.com/AweiMike/law-enforcement-assistant.git`

2. **在 Render 建立服務**：
   - 登入 [Render Dashboard](https://dashboard.render.com/)。
   - 點擊 "New +" -> "Web Service"。
   -連結您的 GitHub Repository (`law-enforcement-assistant`)。
   - 設定以下資訊：
     - **Name**: 自定義服務名稱
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - 在 "Environment Variables" 加入：
     - `LINE_ACCESS_TOKEN`: 您的 LINE Access Token
     - `LINE_CHANNEL_SECRET`: 您的 LINE Channel Secret
     - `NODE_ENV`: `production`

3. **設定 LINE Webhook**：
   - 部署完成後，複製 Render 產生的 URL (例如 `https://your-service.onrender.com`)。
   - 到 LINE Developers Console，將 Webhook URL 設定為：
     `https://your-service.onrender.com/webhooks/line`
   - 開啟 "Use webhook" 功能。

## 專案結構

- `src/index.js`: LINE Bot 主程式入口與路由。
- `src/actions/`: 各模組邏輯 (unlicensed.js, drunk.js, yield.js, others.js)。
- `src/utils/`: 工具函式 (theme.js, flex.js)。
- `bottender.config.js`: Bottender 設定檔。

## 注意事項

- 本系統邏輯依據民國 115 年 1 月 31 日施行之新法規。
- 「排氣管登記與扣牌規定」與「強制抽血」尚未生效，系統內已加入警示。
