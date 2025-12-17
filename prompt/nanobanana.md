목표:
- 앱에 저장된 “베이스 이미지 + 인물(최대 5명) + 인물별 변형값(위치/크기/회전/얼굴 오프셋) + 인물별 표정(이모티콘)” 상태를
  **텍스트로 직렬화**하고, 나노바나나(NanoBanana) 이미지 생성에 바로 투입 가능한 **최종 프롬프트 문자열**로 변환한다.
- EXPRESSION 단계에서 “결제하기” 버튼을 눌렀을 때, **생성된 최종 프롬프트(및 보조 정보)**를 콘솔에 출력한다(복사/디버깅 목적).

---

핵심 목표(이번 개선 포인트):
- **베이스 이미지는 “거의 변경하지 않는다”**를 기본 정책으로 한다.
  - 해상도/종횡비/프레이밍/배경/원래 인물/오브젝트를 최대한 유지한다.
  - **원래 인물을 지우거나 베이스 이미지 규격을 바꾸지 않는다.**
- 추가 인물(참조 얼굴 사진 기반)은 **합성(추가)** 중심으로 자연스럽게 배치한다.
  - “두번째 이미지(인물)”은 **정체성(얼굴) 참고용**이며, 장면/구도 참고용이 아니다.

입력(상태) 범위:
- 베이스 이미지(UPLOAD에서 선택한 파일)
- 인물 목록(1~5명)
  - 인물별 얼굴 사진 파일(선택, 업로드되지 않을 수 있음)
  - 인물별 마커 변형값
    - positionX/positionY (0~1 정규화, 베이스 이미지 기준)
    - scale (배율)
    - rotationDegrees (0~360)
    - faceImageScale (마커 내부 얼굴 이미지 스케일)
    - faceImageOffsetXPercent / faceImageOffsetYPercent (마커 내부 오프셋)
  - 인물별 표정 이모티콘(expression, 선택)

권장 입력 포맷(예시):
- MATCH 단계: `exportMatchStepDataForAI()` 결과 + `formatMatchStepDataAsPrompt()` 결과 문자열
- EXPRESSION 단계: persons의 `expression`(emoji) 포함

---

출력(최종 산출물) 요구사항:
1) 나노바나나에 전달할 “최종 프롬프트 문자열”
   - 베이스 이미지/인물 얼굴 사진을 **참조 이미지로 함께 전달한다는 전제**로 작성한다.
   - 프롬프트는 “정체성 유지 + 배치 반영 + 표정 반영 + 품질/제약”을 모두 포함한다.
2) 디버깅을 위한 “상태 요약 텍스트”
   - 실제로 어떤 입력(좌표/스케일/회전/표정)을 근거로 프롬프트가 만들어졌는지 사람이 읽을 수 있어야 한다.
3) 콘솔 출력 포맷은 복사하기 쉬워야 한다.

---

프롬프트 생성 규칙(중요):

베이스 이미지 보존 정책(가장 중요):
- 베이스 이미지를 “잠금(locked)된 배경 플레이트(plate)”로 취급한다.
- 다음 변경은 **금지**:
  - 크롭/리사이즈/스트레치(종횡비 변경)/줌인·줌아웃/프레이밍 변경
  - 배경/오브젝트/텍스처/조명 환경의 재구성
  - 베이스 이미지에 이미 존재하는 인물/얼굴/사물의 삭제 또는 대체
- 아래 “모델이 자주 하는 오해”도 명시적으로 금지한다:
  - 기존 인물 얼굴을 참조 얼굴로 **교체(face swap)** 하기
  - “사진 카드/필름 프레임/라운드 코너/보더/비네팅” 같은 **액자 효과** 추가
- 허용되는 변경은 “추가 인물 합성에 필요한 최소 영역”에 한정한다.
  - 예: 가벼운 그림자/반사/가림(occlusion) 처리, 가장자리 블렌딩

정체성/일관성:
- 각 인물은 해당 인물의 얼굴 사진(있다면)을 **identity reference(얼굴 정체성 참고)**로만 사용한다.
- 얼굴 참고 이미지를 배경/구도 참고로 사용하지 않는다(얼굴 이미지를 장면으로 “갈아끼우지” 않기).
- 인물 수/순서는 상태의 인물 목록을 그대로 따른다(추가/삭제/재배치 금지).
- 베이스 이미지가 있다면, 전체 장면의 구도/배경/광원은 베이스 이미지를 최대한 유지한다.

배치/변형 텍스트화(좌표 → 자연어):
- (권장) 3x3 그리드로 위치를 요약한다.
  - X: 0~0.33 = left, 0.34~0.66 = center, 0.67~1 = right
  - Y: 0~0.33 = top, 0.34~0.66 = middle, 0.67~1 = bottom
- 동시에 “퍼센트 좌표”를 함께 제공한다.
  - 예: “Person 2 at left-middle (x=18%, y=54%)”
- scale은 “상대적 크기”로 요약하되, 수치도 반드시 포함한다.
  - 예: “slightly larger (scale=1.35)”
- rotation은 0° 근처(예: ±5°)는 무시하고, 그 외에는 방향/각도를 명시한다.
  - 예: “tilted clockwise ~25°”
- faceImageScale / faceImageOffset은 “얼굴 크롭/정렬 보정”으로 설명하고 수치를 포함한다.
  - 예: “face zoom 1.2x, offset X +10%, Y -5%”

표정(이모티콘) 텍스트화:
- expression(emoji)이 있으면 해당 이모티콘의 감정/표정을 자연어로 번역해 포함한다.
- 이모티콘이 낯설거나 애매하면 과도한 해석을 피하고 “matching the emoji expression”처럼 표현한다.
- 이모티콘이 없으면 “neutral/relaxed expression”으로 둔다.

품질/제약(공통):
- photorealistic, high detail, consistent lighting, natural skin texture
- no text, no watermark, no logo, no extra people, no extra faces, no deformed hands
- keep original camera angle / framing and base image resolution/aspect ratio

합성 자연스러움(추가 지시):
- 추가 인물은 “붙여넣기”처럼 보이지 않도록 다음을 수행한다:
  - 장면의 원근/카메라 높이/렌즈 느낌을 베이스와 일치
  - 조명 방향/색온도/그림자(접지 그림자 포함)/반사(필요 시) 일치
  - 피사계 심도(선명도/블러), 노이즈/그레인, 색보정 톤 일치
  - 오브젝트와의 가림(occlusion)이 자연스럽게 발생하도록 처리
- 베이스 이미지의 “원래 인물/오브젝트”는 **픽셀 단위로 최대한 동일**하게 유지한다.
  - 변경은 “추가 인물 주변의 국소 영역(local area)”에만 제한한다.

---

나노바나나 전달용 최종 프롬프트 템플릿(권장, 영어):

아래 템플릿을 채워서 최종 프롬프트 문자열을 만든다. (대괄호는 값으로 치환)

"""
Use the provided base image as a locked scene/background plate. Preserve it as much as possible.
Do NOT crop, resize, stretch, zoom, or change the framing/aspect ratio. Do NOT remove or replace any existing people/objects in the base image.
Do NOT face-swap existing people. Do NOT add frames/borders/rounded corners/vignettes.

This is an image edit/inpaint task: keep all pixels outside the insertion area unchanged.
Add [N] additional people into the base image (do not change existing people). Place them exactly as specified.
Use each provided face photo as an identity reference for the corresponding added person (Person 1..N). Preserve identity, age, and facial features.
The face reference images are for identity only; do NOT use them as scene/composition references.

Composition & placement (must follow):
[PERSON_PLACEMENT_LIST]

Facial expressions (must follow):
[PERSON_EXPRESSION_LIST]

Camera/lighting/style:
Keep the original camera angle and framing from the base image. Match lighting direction and color temperature. Photorealistic, high detail, natural skin texture, sharp focus.

Constraints:
No text, no watermark, no logos, no duplicated faces, no deformed anatomy.
"""

NEGATIVE PROMPT(권장):
"""
text, watermark, logo, extra people, extra faces, duplicated face, deformed hands, malformed fingers, lowres, blurry, artifacts, uncanny, plastic skin,
cropped, resized, stretched, changed aspect ratio, zoomed, reframed, different background, removed person, replaced person,
face swap, pasted face, collage, sticker, border, frame, rounded corners, vignette, polaroid
"""

PERSON_PLACEMENT_LIST 생성 규칙(예):
- Person 1: [grid 위치] (x=[%], y=[%]), size [small/normal/large] (scale=[n]), rotation [none/cw/ccw] ([deg]), face alignment: zoom [n]x, offset X [n]%, Y [n]%

PERSON_EXPRESSION_LIST 생성 규칙(예):
- Person 1: [emoji or neutral] → [expression text]

---

콘솔 출력 요구사항(EXPRESSION 단계, “결제하기” 클릭 시):
- 아래 포맷으로 **한 번에 복사 가능**하도록 출력한다.
- 사람이 읽는 “요약”과, 모델에 넣는 “최종 프롬프트”를 분리한다.

출력 포맷(권장):
```
=== NANOBANANA_PROMPT_START ===
[DEBUG_SUMMARY]

--- PROMPT ---
[FINAL_PROMPT]

--- NEGATIVE_PROMPT ---
[NEGATIVE_PROMPT]
=== NANOBANANA_PROMPT_END ===
```

DEBUG_SUMMARY 최소 포함 항목:
- 베이스 이미지 파일명/타입/크기(가능하면)
- 총 인물 수, 얼굴 사진 업로드된 인물 수
- 인물별: position(x,y), scale, rotation, faceImageScale, faceImageOffsetX/Y, expression(emoji or null)

---

검증 체크리스트(생성 직전/직후):
- [ ] 최종 프롬프트에 “추가할 사람 수(N)”가 상태와 일치한다.
- [ ] 인물 1..N이 모두 언급된다(누락 없음).
- [ ] 표정은 인물별로 분리되어 기술된다(섞이지 않음).
- [ ] “추가 인물/추가 얼굴/텍스트 생성 금지” 제약이 포함되어 있다.
- [ ] 배치 정보가 자연어 + 수치(%)로 함께 제공된다.
- [ ] “베이스 이미지 크롭/리사이즈/종횡비 변경/인물 삭제 금지”가 포함되어 있다.
