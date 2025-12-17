import { HttpResponse, http } from 'msw';

type FaceRectangle = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type DetectFaceResponse = Array<{ faceRectangle: FaceRectangle }>;

const FACE_RECT_NORMAL: FaceRectangle = { top: 10, left: 10, width: 120, height: 120 };
const FACE_RECT_SMALL: FaceRectangle = { top: 10, left: 10, width: 20, height: 20 };

/**
 * Azure Face API Mock
 *
 * 요청 바디의 첫 바이트로 케이스를 분기합니다.
 * - 0: 얼굴 없음([])
 * - 1: 얼굴 1개 정상([{ faceRectangle }])
 * - 2: 얼굴 1개지만 너무 작음([{ faceRectangle: small }])
 */
export const azureFaceHandlers = [
  http.post('*/face/v1.0/detect', async ({ request }) => {
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.startsWith('application/octet-stream')) {
      return new HttpResponse('Unsupported Media Type', { status: 415 });
    }

    const bytes = new Uint8Array(await request.arrayBuffer());
    const caseByte = bytes[0] ?? 1;

    if (caseByte === 0) {
      return HttpResponse.json([] satisfies DetectFaceResponse);
    }

    if (caseByte === 2) {
      return HttpResponse.json([{ faceRectangle: FACE_RECT_SMALL }] satisfies DetectFaceResponse);
    }

    return HttpResponse.json([{ faceRectangle: FACE_RECT_NORMAL }] satisfies DetectFaceResponse);
  })
];
