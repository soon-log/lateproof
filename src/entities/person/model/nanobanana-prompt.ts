import { exportMatchStepDataForAI, formatMatchStepDataAsPrompt } from './export-for-ai';
import type { ExpressionEmoji, Person } from './types';

export type NanobananaPromptResult = {
  debugSummary: string;
  prompt: string;
  negativePrompt: string;
  consoleOutput: string;
};

const DEFAULT_NEGATIVE_PROMPT =
  'text, watermark, logo, extra people, extra faces, duplicated face, deformed hands, malformed fingers, lowres, blurry, artifacts, uncanny, plastic skin, cropped, resized, stretched, changed aspect ratio, zoomed, reframed, different background, removed person, replaced person, face swap, pasted face, collage, sticker, border, frame, rounded corners, vignette, polaroid';

type BuildNanobananaPromptParams = {
  persons: Person[];
  baseImageFile?: File | null;
};

export function buildNanobananaPrompt({
  persons,
  baseImageFile
}: BuildNanobananaPromptParams): NanobananaPromptResult {
  const matchData = exportMatchStepDataForAI(persons, baseImageFile);
  const placementDebug = formatMatchStepDataAsPrompt(matchData);

  const placementLines = matchData.persons
    .map((personForAI, index) => {
      const person = persons[index];
      const grid = toGrid(personForAI.positionX, personForAI.positionY);
      const xPercent = Math.round(personForAI.positionX * 100);
      const yPercent = Math.round(personForAI.positionY * 100);

      const sizeLabel = toSizeLabel(personForAI.scale);
      const rotationLabel = toRotationLabel(personForAI.rotationDegrees);
      const faceAlignment = toFaceAlignmentLabel(
        personForAI.faceImageScale,
        personForAI.faceImageOffsetXPercent,
        personForAI.faceImageOffsetYPercent
      );

      const hasFaceRef = person?.facePhoto !== null && person?.facePhoto !== undefined;
      const faceRefLabel = hasFaceRef
        ? 'identity reference: provided face photo'
        : 'identity reference: none (generate a plausible person)';

      return `- Person ${index + 1}: ${grid} (x=${xPercent}%, y=${yPercent}%), size ${sizeLabel} (scale=${formatNumber(
        personForAI.scale
      )}), rotation ${rotationLabel}, ${faceAlignment}, ${faceRefLabel}.`;
    })
    .join('\n');

  const expressionLines = persons
    .map((person, index) => {
      const emoji = person.expression;
      const description = toExpressionDescription(emoji);
      return `- Person ${index + 1}: ${description}`;
    })
    .join('\n');

  const additionalPeopleLabel =
    persons.length === 1 ? '1 additional person' : `${persons.length} additional people`;

  const prompt = [
    'Use the provided base image as a locked scene/background plate. Preserve it as much as possible.',
    'Do NOT crop, resize, stretch, zoom, or change the framing/aspect ratio. Do NOT remove or replace any existing people/objects in the base image.',
    'Do NOT face-swap existing people. Do NOT add frames/borders/rounded corners/vignettes.',
    'This is an image edit/inpaint task: keep all pixels outside the insertion area unchanged.',
    'Output MUST keep the base image resolution and aspect ratio exactly. Only make minimal edits around the inserted people (inpaint locally).',
    'Reference images: the base image is the only scene/composition reference. Face photos are identity references only.',
    '',
    `Add exactly ${additionalPeopleLabel} into the base image (do not change existing people). Place them exactly as specified.`,
    'Use each provided face photo as an identity reference for the corresponding added person (Person 1..N). Preserve identity, age, and facial features.',
    'The face reference images are for identity only; do NOT use them as scene/composition references.',
    '',
    'Composition & placement (must follow):',
    placementLines,
    '',
    'Facial expressions (must follow):',
    expressionLines,
    '',
    'Camera/lighting/style:',
    'Keep the original camera angle, framing, and base image resolution/aspect ratio. Match lighting direction and color temperature. Photorealistic, high detail, natural skin texture, sharp focus.',
    'Blend the inserted people naturally: matching perspective, contact shadows, occlusion with nearby objects, and the base image color grading/grain.',
    '',
    'Constraints:',
    'No text, no watermark, no logos, no extra people beyond the requested additions, no duplicated faces, no deformed anatomy.'
  ].join('\n');

  const debugSummary = buildDebugSummary(matchData, placementDebug, persons);
  const negativePrompt = DEFAULT_NEGATIVE_PROMPT;
  const consoleOutput = [
    '=== NANOBANANA_PROMPT_START ===',
    debugSummary,
    '',
    '--- PROMPT ---',
    prompt,
    '',
    '--- NEGATIVE_PROMPT ---',
    negativePrompt,
    '=== NANOBANANA_PROMPT_END ==='
  ].join('\n');

  return { debugSummary, prompt, negativePrompt, consoleOutput };
}

function buildDebugSummary(
  matchData: ReturnType<typeof exportMatchStepDataForAI>,
  placementDebug: string,
  persons: Person[]
): string {
  const lines: string[] = [];

  lines.push('[DEBUG_SUMMARY]');
  lines.push(
    `베이스 이미지: ${
      matchData.hasBaseImage
        ? `${matchData.baseImageFileName ?? '(unknown)'} (${matchData.baseImageMimeType ?? 'unknown'}, ${matchData.baseImageFileSizeBytes ?? 0} bytes)`
        : '없음'
    }`
  );
  lines.push(
    `인물: 총 ${matchData.totalPersonCount}명 / 얼굴 사진 업로드 ${matchData.personsWithFacePhotoCount}명`
  );
  lines.push('');

  lines.push(placementDebug.trim());
  lines.push('');

  lines.push('[표정 정보]');
  for (const [index, person] of persons.entries()) {
    lines.push(`- 인물 ${index + 1}: ${person.expression ?? '없음'}`);
  }

  return lines.join('\n');
}

function toGrid(x: number, y: number): string {
  const xLabel = x <= 0.33 ? 'left' : x <= 0.66 ? 'center' : 'right';
  const yLabel = y <= 0.33 ? 'top' : y <= 0.66 ? 'middle' : 'bottom';
  return `${xLabel}-${yLabel}`;
}

function toSizeLabel(scale: number): string {
  if (scale < 0.9) return 'smaller';
  if (scale <= 1.15) return 'normal';
  if (scale <= 1.6) return 'larger';
  return 'much larger';
}

function toRotationLabel(rotationDegrees: number): string {
  const normalized = normalizeDegreesToSigned(rotationDegrees);
  if (Math.abs(normalized) <= 5) return 'none (≈0°)';

  const absDeg = Math.round(Math.abs(normalized));
  if (normalized > 0) return `clockwise ~${absDeg}°`;
  return `counterclockwise ~${absDeg}°`;
}

function toFaceAlignmentLabel(scale: number, offsetX: number, offsetY: number): string {
  const hasScale = Math.abs(scale - 1) >= 0.05;
  const hasOffset = Math.abs(offsetX) >= 1 || Math.abs(offsetY) >= 1;

  if (!hasScale && !hasOffset) return 'face alignment: default';

  const parts: string[] = ['face alignment:'];
  if (hasScale) parts.push(`zoom ${formatNumber(scale)}x`);
  if (hasOffset) {
    parts.push(`offset X ${formatSignedPercent(offsetX)}, Y ${formatSignedPercent(offsetY)}`);
  }

  return parts.join(' ');
}

function toExpressionDescription(emoji: ExpressionEmoji | null): string {
  if (!emoji) return 'neutral/relaxed';

  const mapped = EMOJI_TO_EXPRESSION[emoji];
  if (mapped) return `${mapped} (${emoji})`;

  return `matching the emoji expression (${emoji})`;
}

const EMOJI_TO_EXPRESSION: Record<string, string> = {
  '😄': 'smiling, happy',
  '😢': 'sad, teary',
  '😡': 'angry',
  '😮': 'surprised, wide-eyed',
  '😐': 'neutral',
  '😴': 'sleepy',
  '🥰': 'loving, affectionate',
  '😎': 'confident, cool',
  '🤔': 'thinking, curious',
  '😏': 'smirking'
};

function normalizeDegreesToSigned(degrees: number): number {
  const wrapped = ((degrees % 360) + 360) % 360;
  return ((wrapped + 180) % 360) - 180;
}

function formatSignedPercent(value: number): string {
  const rounded = Math.round(value);
  if (rounded === 0) return '0%';
  return `${rounded > 0 ? '+' : ''}${rounded}%`;
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}
