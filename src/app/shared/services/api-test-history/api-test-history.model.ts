import { StorageModel } from '../../../modules/storage/storage.model';
import { JsonRootType } from '../api-data/api-data.model';

export interface ApiTestHistoryResponse {
  headers: object[];
  statusCode: number;
  body: string;
  contentType: string;
  responseType: 'text' | 'longText' | 'stream';
  responseLength: number;
  testDeny: string;
  /**
   * Inject Code println
   */
  reportList: string[] | object[];
}
/**
 * General indicators
 * @type {object}
 */
export interface ApiTestResGeneral {
  downloadRate: string;
  downloadSize: number;
  redirectTimes: number;
  time: string;
  timingSummary: {
    dnsTiming: string;
    tcpTiming: string;
    /**
     * SSL/TSL
     */
    tlsTiming: string;
    /**
     * The request is being sent until recieve firstByte
     */
    requestSentTiming: string;
    /**
     * Content download
     */
    contentDeliveryTiming: string;
    /**
     * Waiting (TTFB) - Time To First Byte
     */
    firstByteTiming: string;
    /**
     * Total Time
     */
    responseTiming: string;
  }[];
}
export interface ApiTestHistoryFrame {
  general: ApiTestResGeneral;
  /**
   * HTTP Request
   * @type {object}
   */
  request: {
    uri: string;
    protocol: string;
    method: string;
    requestHeaders: any | object[];
    requestBodyJsonType: JsonRootType | string;
    requestBodyType: string | 'formData' | 'raw';
    requestBody: any | object[] | string;
  };
  /**
   * HTTP response
   * @type {object}
   */
  response: ApiTestHistoryResponse;
}
/**
 * API测试历史对象接口
 */
export interface ApiTestHistory extends ApiTestHistoryFrame, StorageModel {
  /**
   * Project primary key ID
   * @type {string|number}
   */
  projectID: string | number;

  /**
   * Bind API primary key ID
   * @type {string|number}
   */
  apiDataID: string | number;
}
