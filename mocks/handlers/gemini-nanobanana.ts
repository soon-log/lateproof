import { HttpResponse, http } from 'msw';

const ONE_BY_ONE_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg==';

export const geminiNanobananaHandlers = [
  http.post(
    'https://generativelanguage.googleapis.com/v1beta/models/*:generateContent',
    async () => {
      return HttpResponse.json({
        candidates: [
          {
            content: {
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/png',
                    data: ONE_BY_ONE_PNG_BASE64
                  }
                },
                {
                  inlineData: {
                    mimeType: 'image/png',
                    data: ONE_BY_ONE_PNG_BASE64
                  }
                },
                {
                  inlineData: {
                    mimeType: 'image/png',
                    data: ONE_BY_ONE_PNG_BASE64
                  }
                }
              ]
            }
          }
        ]
      });
    }
  ),
  http.post('https://generativelanguage.googleapis.com/v1/models/*:generateContent', async () => {
    return HttpResponse.json({
      candidates: [
        {
          content: {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: ONE_BY_ONE_PNG_BASE64
                }
              },
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: ONE_BY_ONE_PNG_BASE64
                }
              },
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: ONE_BY_ONE_PNG_BASE64
                }
              }
            ]
          }
        }
      ]
    });
  })
];
