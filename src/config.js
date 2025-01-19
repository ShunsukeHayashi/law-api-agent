export const API_CONFIG = {
  BASE_URL: 'https://laws.e-gov.go.jp/api/1',
  ENDPOINTS: {
    LAW_LISTS: '/lawlists',
    LAW_DATA: '/lawdata',
    ARTICLES: '/articles',
    UPDATE_LAW_LISTS: '/updatelawlists'
  },
  LAW_TYPES: {
    ALL: '1',
    CONSTITUTION_LAW: '2',
    CABINET_ORDER: '3',
    MINISTRY_ORDER: '4'
  },
  VERSION: '1.4.0'
};

export const ERROR_MESSAGES = {
  INVALID_DATE: '無効な日付形式です',
  NOT_FOUND: '該当データが存在しません',
  SERVER_ERROR: 'サーバー内処理でエラーが発生しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  BAD_REQUEST: 'リクエストパラメータが不正です',
  NOT_ACCEPTABLE: '法令APIで返却可能な容量を超えたか、法令データが複数存在します',
  MULTIPLE_CHOICES: '複数の候補が存在します'
};

export const HTTP_STATUS = {
  OK: 200,
  MULTIPLE_CHOICES: 300,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  INTERNAL_SERVER_ERROR: 500
};

export const RESULT_CODES = {
  SUCCESS: '0',
  ERROR: '1',
  MULTIPLE_CHOICES: '2'
};