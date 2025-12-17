1. /.ruler 폴더를 참고하여 다음 할 일들에 대해 이야기를 나눠봅시다.
2. M2-E3-T01에 대한 질문입니다. react-dropzone 라이브러리를 반드시 사용해야 하나요? 다른 유사 라이브러리, 직접 만들었을 때 이 모든 것의 장단점을 비교하여 가장 알맞은 선택지를 제시해주세요. 코드를 수정하지 않습니다.
3. .ruler/PRD.md를 참고하여 사진으로 만들기로 넘어간 M2-E3-T01 기능을 구현해주세요. 이때 화면단만을 구현합니다. 상세한 비즈니스 로직은 이후 구현합니다. 이전에 구현한 코드를 참고하여 구현해주세요.
4. Select Photo 단계에선 배경이 잘나온 사진을 선택할 수 있도록 안내 문구를 배치해주세요. 
5. 모든 경우 한글을 사용해서 일관적으로 보이게 문구를 작성해주세요.
6. 화면 너비를 각 step 페이지마다 설정하는 것 보다 전체적으로 설정하는 것이 더 효율적입니다. 전체로 통제하고 각 step에선 width-100%를 주면 될 것 습니다.
7. 모든 UI를 src/features/upload-photo 배치하는 것 보다 src/pages/upload-photo에서 이전으로 버튼이나 제목과 같은 비즈니스 로직과 무관한 부분들은 표시, 현재 step과 관련된 부분들은 src/features/upload-photo에서 구현해 불러와 표시하는 식이 좋을 것 같습니다. 이전으로 버튼은 계속 재사용될 것 같은데 어디에서 구현하면 될지 고민해주세요. 코드를 수정하지 말고 의견을 나눠봅시다.
8. widget에 title과 description을 props로 받아 공통 헤더를 표시하는 컴포넌트를 생성해줘. useStepStore의 selectCanGoBack이 true일 때만 이전으로 버튼이 표시되도록 해줘.
9. src/features/upload-photo/ui/upload-photo-view.tsx 와 src/features/select-mode/ui/select-mode-view.tsx 에서 현재 사용되고 있어. 모든 step의 다음 버튼이 스타일적으로 통일감만 주려는 목적이야. Button Props를 전부 받을 수 있어야 해. shared 레이어에 해당 컴포넌트를 배치해도 되지 않을까? 
10. 현재 변경된 코드 중 src/features/upload-photo/ui/upload-photo-view.tsx 의 관심사가 너무 많다. 이를 분리하고 싶은데 어떤식으로 설계하면 좋을지 이야기해보자.
11. 10번의 개선 방향을 앞으로 계속 반영할 수 있도록 .ruler/AGENTS.md 를 수정합니다.
12. 파일 정보(파일명/용량)이 사용자에게 보여질 필요가 없을 것 같아. 그래서 PhotoPreview 컴포넌트에서 제외했어.  handleFileSelect에서 기존 previewURL을 revokeObjectURL해 메모리 누수를 방지해줘. 
13. .ruler/AGENTS.md 에 이미지를 사용할 땐 next 이미지 컴포넌트(next/image)를 사용하라 명시해
14. src/features/upload-photo/ui/upload-dropzone.tsx 파일에서 biome lint/complexity/noExcessiveCognitiveComplexity 에러가 발생했습니다. className 부분에서 삼항연산자를 중첩해서 사용한 것이 문제로 보이는데 어떻게 개선하는 게 좋을지 의견을 나눠봅시다. (코드를 수정하진 않습니다.)
15. src/features/upload-photo/model/use-photo-upload.ts hook이 가진 역할이 파일을 업로드 하는 역할만 갖는게 좋지 않을까? 지금 다음 스탭으로 이동하는 역할도 혼재되어 있는게 마음에 안드는데 어떻게 생각해? 의견을 나눠보자. (코드 수정 금지)
16. 방금 수정한 내용처럼 hook도 여러 관심사를 갖지 않게 분리하는 측면으로 AGENTS.md 규칙을
설정해줘. (모든 상황에 통용될 만한 규칙 설정)
17. src/features/upload-photo/ui/upload-photo-view.tsx 과 같이 생성된 코드에 대한 테스트 코드가 작성되어 있지 않아. 또 /src/features/upload-photo/ui/upload-dropzone.tsx 이런 UI 컴포넌트도 마찬가지고 이건 테스트 코드 뿐만 아니라 story 도 만들어야 해. 이러한 내용을 강제하는 규칙을 .ruler/AGENTS.md에 추가해주고 모든 폴더 구조를 둘러보며 미비된 코드의 테스트 코드와 story를 작성해줘.
18. .ruler/TASKS.md의 Epic 2.3 — UPLOAD Step의 나머지 TASK를 수행하자. 수행하기 앞서 할 작업에 대해 이야기해보자. (코드 작업은 하지 않습니다.)
19. 기획을 변경하여 UPLOAD Step에선 이미지 업로드만 진행하고 이미지를 상태로 가지고 다음 스탭으로 넘어가는 것만 수행한다. 
- entities/photo에 store 생성
- UPLOAD의 T02~T04를 MATCH STEP의 T05~T07로 이관