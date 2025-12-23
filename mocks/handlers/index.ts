import { HttpResponse, http } from 'msw';
import { azureFaceHandlers } from './azure-face';
import { geminiNanobananaHandlers } from './gemini-nanobanana';

/**
 * MSW 요청 핸들러 배열
 * 각 외부 API에 대한 Mock 핸들러를 정의합니다.
 *
 * @see https://mswjs.io/docs/api/http
 */
export const handlers = [
  ...azureFaceHandlers,
  ...geminiNanobananaHandlers,

  // Toss Payments API Mock
  http.post('https://api.tosspayments.com/v1/payments/confirm', async () => {
    return HttpResponse.json({
      orderId: 'mock-order-id',
      paymentKey: 'mock-payment-key',
      status: 'DONE'
    });
  }),

  // Google Maps Places API Mock
  http.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', () => {
    return HttpResponse.json({
      candidates: [
        {
          place_id: 'mock-place-id',
          formatted_address: '서울특별시 마포구 홍대입구',
          geometry: {
            location: { lat: 37.5563, lng: 126.9233 }
          }
        }
      ],
      status: 'OK'
    });
  })
];
