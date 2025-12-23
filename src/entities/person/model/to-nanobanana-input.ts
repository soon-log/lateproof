import type { Person } from './types';

export type NanobananaInputFiles = {
  baseImageFile: File | null;
  referenceImageFiles: File[];
};

export function toNanobananaInput(
  persons: Person[],
  baseImageFile?: File | null
): NanobananaInputFiles {
  const referenceImageFiles = persons
    .map((person) => person.facePhoto)
    .filter((file): file is File => Boolean(file));

  return {
    baseImageFile: baseImageFile ?? null,
    referenceImageFiles
  };
}
