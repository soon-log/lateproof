목표:
Next.js + TypeScript 프로젝트에서 MATCH Step의 인물 설정 화면에서
이미지 업로드 또는 교체 시 Azure Face API를 이용해 얼굴 존재 여부를 검증한다.

요구사항:
- 얼굴이 없거나 너무 저해상도로 Azure Face API가 인식하지 못하면
  업로드를 실패 처리하고 alertMessage를 반환한다.
- 얼굴이 정상적으로 인식되면 업로드를 성공 처리한다.

보안/아키텍처:
- Azure Face API Key는 프론트엔드에 절대 노출하지 않는다.
- Azure Face API 호출은 Next.js API Route에서만 처리한다.
- 프론트엔드는 이미지 파일을 FormData로 API Route에 전송하고
  결과(success, alertMessage)만 처리한다.

환경 변수:
- 개발 환경에서는 .env.local 사용
- 추후 Vercel 환경 변수로 이전 예정
- API KEY만 .env.local에 추가하면 바로 동작하도록 구현

.env.local 예시:
AZURE_FACE_ENDPOINT=
AZURE_FACE_KEY=

구현 가이드:
- API Route에서 bodyParser 비활성화
- 파일 업로드 처리 후 이미지 바이너리를
  Azure Face API /face/v1.0/detect에
  Content-Type: application/octet-stream 방식으로 전송
- faces.length === 0 → 얼굴 없음 (실패)
- 얼굴이 감지되었지만 bounding box가 너무 작으면 실패 처리
- API 응답 형식:
  {
    success: boolean;
    hasFace: boolean;
    alertMessage?: string;
  }

프론트엔드:
- API 응답이 success=false면 alertMessage 표시
- success=true면 다음 단계 진행

개발 단계 주의:
- 현재는 Azure Face API Key가 없으므로
  Key가 추가되면 코드 수정 없이 동작해야 한다.

---

Azure Face API를 사용하는 얼굴 검증 API Route를 테스트할 때
실제 외부 API를 호출하지 않고 MSW(Mock Service Worker)로 목 서버를 사용한다.

테스트 전략:
- Azure Face API는 절대 실제로 호출하지 않는다.
- MSW를 사용해 Azure Face API /face/v1.0/detect 요청을 가로채고
  mock 응답을 반환한다.
- API Route는 실제 구현 코드를 그대로 사용하고
  테스트 환경에서만 MSW로 외부 호출을 대체한다.

구현 범위:
1. MSW 설정
   - msw 설치
   - browser / server 환경 분리
   - 테스트 환경(Jest or Vitest)에서는 setupServer 사용

2. Mock 핸들러 작성
   - POST {AZURE_FACE_ENDPOINT}/face/v1.0/detect
   - Content-Type: application/octet-stream 요청 처리
   - 다음 케이스를 분기 처리:
     a) 얼굴 없음 → []
     b) 얼굴 1개 정상 → [{ faceRectangle }]
     c) 얼굴 너무 작음 → [{ faceRectangle (작은 값) }]

3. 테스트 대상
   - Next.js API Route (face-detect)
   - FormData로 이미지 업로드 요청 시:
     - 얼굴 없음 → success=false, alertMessage 반환
     - 얼굴 정상 → success=true
     - 얼굴 너무 작음 → success=false

4. 환경 변수 처리
   - 테스트 환경에서는 더미 AZURE_FACE_ENDPOINT 사용
   - 실제 API KEY는 필요 없음
   - .env.local 없이도 테스트가 동작해야 한다.

구현 가이드:
- MSW handler는 Azure Face API endpoint 기준으로 작성
- API Route 내부 fetch는 그대로 유지
- 테스트는 supertest 또는 fetch 기반으로 API Route 호출
- MSW는 외부 네트워크 요청만 mocking

---

Azure 결과에 대한 메시지 표시는 alertMessage 대신 shadcn의 기능을 사용한다. 
use context7