import {Container} from 'inversify';
import {AwsHttpClient, HttpBufferedResponse, HttpRequestOptions, HttpResponseWrapper} from './aws-http-client.isvc';
import {TYPES} from './inversify.types';
import {LoggerVoidImpl} from './logger-void.svc';
import {Logger} from './logger.isvc';
import {OpenSearch} from './opensearch.isvc';
import {OpenSearchImpl} from './opensearch.svc';

test('index', async () => {
  const awsHttpClientMock:AwsHttpClient = {
    executeSignedHttpRequest: (httpRequestParams: HttpRequestOptions): Promise<HttpResponseWrapper> => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const items = httpRequestParams.body.trim().split('\n');
      const response = {body: {errors: false, items: [] as any[]}};
      for (let index = 0; index < items.length; index+=2) {
        const item = JSON.parse(items[index]);
        const item2:any = {index: {_id: item.index._id}};
        response.body.items.push(item2);
      }
      return Promise.resolve({response} as HttpResponseWrapper);
    },
    waitAndReturnResponseBody: (value: HttpResponseWrapper): Promise<HttpBufferedResponse> => {
      return Promise.resolve({statusCode: 200, body: JSON.stringify(value.response.body)} as HttpBufferedResponse);
    },
  };

  const myContainer = new Container();
  myContainer.bind<OpenSearch>(TYPES.OpenSearch).to(OpenSearchImpl);
  myContainer.bind<AwsHttpClient>(TYPES.AwsHttpClient).toConstantValue(awsHttpClientMock);
  myContainer.bind<Logger>(TYPES.Logger).to(LoggerVoidImpl);
  const openSearchClient = myContainer.get<OpenSearch>(TYPES.OpenSearch);
  const docs = [
    {'@timestamp': new Date(), 'message': 'Hello', '_index': 'my-index1', '_id': '1',
      'kinesis': {eventID: 'shardId-000000000000:100001'},
    },
    {'@timestamp': new Date(), 'message': 'Hello', '_index': 'my-index2', '_id': '2',
      'kinesis': {eventID: 'shardId-000000000000:100002'},
    },
  ];
  const output = await openSearchClient.bulk(docs);
  expect(output).toEqual({'success': true, 'errors': []});
});
