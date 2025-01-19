import { jest } from '@jest/globals';
import LawAPIClient from '../src/api/client.js';
import { API_CONFIG, ERROR_MESSAGES, HTTP_STATUS } from '../src/config.js';

describe('LawAPIClient', () => {
  let client;
  let mockFetch;

  beforeEach(() => {
    client = new LawAPIClient();
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  describe('getLawList', () => {
    it('法令一覧を正常に取得できること', async () => {
      const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <DataRoot>
          <Result>
            <Code>0</Code>
            <Message></Message>
          </Result>
          <ApplData>
            <Category>1</Category>
            <LawNameListInfo>
              <LawId>123</LawId>
              <LawName>テスト法</LawName>
              <LawNo>平成十五年法律第五十七号</LawNo>
              <PromulgationDate>20200101</PromulgationDate>
            </LawNameListInfo>
          </ApplData>
        </DataRoot>`;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: HTTP_STATUS.OK,
        text: () => Promise.resolve(mockResponse)
      });

      const result = await client.getLawList(API_CONFIG.LAW_TYPES.ALL);
      expect(result.DataRoot.ApplData.Category).toBe('1');
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LAW_LISTS}/1`,
        expect.any(Object)
      );
    });
  });

  describe('getLaw', () => {
    it('法令を正常に取得できること', async () => {
      const lawId = '123';
      const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <DataRoot>
          <Result>
            <Code>0</Code>
            <Message></Message>
          </Result>
          <ApplData>
            <LawId>${lawId}</LawId>
            <LawNum>平成十五年法律第五十七号</LawNum>
            <LawFullText>テスト法の全文</LawFullText>
          </ApplData>
        </DataRoot>`;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: HTTP_STATUS.OK,
        text: () => Promise.resolve(mockResponse)
      });

      const result = await client.getLaw(lawId);
      expect(result.DataRoot.ApplData.LawId).toBe(lawId);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LAW_DATA}/${lawId}`,
        expect.any(Object)
      );
    });

    it('存在しない法令IDの場合エラーを返すこと', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: HTTP_STATUS.NOT_FOUND
      });

      await expect(client.getLaw('999')).rejects.toThrow(ERROR_MESSAGES.NOT_FOUND);
    });
  });

  describe('getArticles', () => {
    it('条文を正常に取得できること', async () => {
      const params = {
        lawId: '123',
        article: '第一条',
        paragraph: '1'
      };

      const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <DataRoot>
          <Result>
            <Code>0</Code>
            <Message></Message>
          </Result>
          <ApplData>
            <LawId>${params.lawId}</LawId>
            <Article>${params.article}</Article>
            <LawContents>テスト法第一条の内容</LawContents>
          </ApplData>
        </DataRoot>`;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: HTTP_STATUS.OK,
        text: () => Promise.resolve(mockResponse)
      });

      const result = await client.getArticles(params);
      expect(result.DataRoot.ApplData.LawId).toBe(params.lawId);
      expect(result.DataRoot.ApplData.Article).toBe(params.article);
    });

    it('必須パラメータがない場合エラーを返すこと', async () => {
      await expect(client.getArticles({})).rejects.toThrow(ERROR_MESSAGES.BAD_REQUEST);
    });
  });

  describe('getUpdateLawList', () => {
    it('更新法令一覧を正常に取得できること', async () => {
      const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <DataRoot>
          <Result>
            <Code>0</Code>
            <Message></Message>
          </Result>
          <ApplData>
            <Date>20240101</Date>
            <LawNameListInfo>
              <LawId>123</LawId>
              <LawName>テスト法</LawName>
              <LawNo>平成十五年法律第五十七号</LawNo>
            </LawNameListInfo>
          </ApplData>
        </DataRoot>`;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: HTTP_STATUS.OK,
        text: () => Promise.resolve(mockResponse)
      });

      const date = '2024-01-01';
      const result = await client.getUpdateLawList(date);
      expect(result.DataRoot.ApplData.Date).toBe('20240101');
    });

    it('無効な日付でエラーを返すこと', async () => {
      const invalidDate = 'invalid-date';
      await expect(client.getUpdateLawList(invalidDate)).rejects.toThrow(ERROR_MESSAGES.INVALID_DATE);
    });

    it('2020年11月24日より前の日付でエラーを返すこと', async () => {
      const oldDate = '2020-11-23';
      await expect(client.getUpdateLawList(oldDate)).rejects.toThrow(ERROR_MESSAGES.INVALID_DATE);
    });
  });
});