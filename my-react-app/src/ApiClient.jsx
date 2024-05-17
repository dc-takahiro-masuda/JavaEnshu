import axios from "axios";

export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // 共通の基本URLを設定
    timeout: 10000, // リクエストのタイムアウトを設定（オプション）
});
