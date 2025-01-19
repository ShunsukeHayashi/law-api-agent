import { API_CONFIG, ERROR_MESSAGES, HTTP_STATUS, RESULT_CODES } from '../config.js';
import { JSDOM } from 'jsdom';

class LawAPIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.dom = new JSDOM();
    this.DOMParser = this.dom.window.DOMParser;
    this.Node = this.dom.window.Node;
  }

  // XMLをパースしてJavaScriptオブジェクトに変換
  async #parseXMLResponse(response) {
    try {
      const text = await response.text();
      const parser = new this.DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      return this.#xmlToJson(xmlDoc);
    } catch (error) {
      throw new Error('XMLのパースに失敗しました: ' + error.message);
    }
  }

  // XMLノードをJavaScriptオブジェクトに変換するヘルパーメソッド
  #xmlToJson(node) {
    const obj = {};

    if (node.nodeType === this.Node.TEXT_NODE) {
      return node.nodeValue;
    }

    if (node.hasChildNodes()) {
      for (const child of node.childNodes) {
        if (child.nodeType === this.Node.TEXT_NODE) {
          if (child.nodeValue.trim()) {
            return child.nodeValue.trim();
          }
        } else {
          const item = this.#xmlToJson(child);
          if (obj[child.nodeName]) {
            if (!Array.isArray(obj[child.nodeName])) {
              obj[child.nodeName] = [obj[child.nodeName]];
            }
            obj[child.nodeName].push(item);
          } else {
            obj[child.nodeName] = item;
          }
        }
      }
    }

    return obj;
  }

  async #fetchAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Accept': 'application/xml',
          ...options.headers
        }
      });

      // HTTPステータスコードに基づくエラーハンドリング
      switch (response.status) {
        case HTTP_STATUS.OK:
        case HTTP_STATUS.MULTIPLE_CHOICES:
          break;
        case HTTP_STATUS.BAD_REQUEST:
          throw new Error(ERROR_MESSAGES.BAD_REQUEST);
        case HTTP_STATUS.NOT_FOUND:
          throw new Error(ERROR_MESSAGES.NOT_FOUND);
        case HTTP_STATUS.NOT_ACCEPTABLE:
          throw new Error(ERROR_MESSAGES.NOT_ACCEPTABLE);
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          throw new Error(ERROR_MESSAGES.SERVER_ERROR);
        default:
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }

      const result = await this.#parseXMLResponse(response);
      
      // 処理結果コードに基づくエラーハンドリング
      if (result.DataRoot?.Result?.Code === RESULT_CODES.ERROR) {
        throw new Error(result.DataRoot.Result.Message || ERROR_MESSAGES.SERVER_ERROR);
      }

      return result;
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  // 法令名一覧取得API
  async getLawList(lawType = API_CONFIG.LAW_TYPES.ALL) {
    return this.#fetchAPI(`${API_CONFIG.ENDPOINTS.LAW_LISTS}/${lawType}`);
  }

  // 法令取得API
  async getLaw(lawIdOrNum) {
    return this.#fetchAPI(`${API_CONFIG.ENDPOINTS.LAW_DATA}/${encodeURIComponent(lawIdOrNum)}`);
  }

  // 条文内容取得API
  async getArticles({ lawId, lawNum, article, paragraph, appdxTable }) {
    if (!lawId && !lawNum) {
      throw new Error(ERROR_MESSAGES.BAD_REQUEST);
    }

    const params = new URLSearchParams();
    if (lawId) params.append('lawId', lawId);
    if (lawNum) params.append('lawNum', lawNum);
    if (article) params.append('article', article);
    if (paragraph) params.append('paragraph', paragraph);
    if (appdxTable) params.append('appdxTable', appdxTable);

    return this.#fetchAPI(`${API_CONFIG.ENDPOINTS.ARTICLES};${params.toString()}`);
  }

  // 更新法令一覧取得API
  async getUpdateLawList(date) {
    if (!this.#isValidDate(date)) {
      throw new Error(ERROR_MESSAGES.INVALID_DATE);
    }

    const formattedDate = this.#formatDate(date);
    return this.#fetchAPI(`${API_CONFIG.ENDPOINTS.UPDATE_LAW_LISTS}/${formattedDate}`);
  }

  // 日付のバリデーション
  #isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && date >= new Date('2020-11-24');
  }

  // 日付のフォーマット（YYYYMMDD）
  #formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
}

export default LawAPIClient;