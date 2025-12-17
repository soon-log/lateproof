import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { UploadDropzoneViewModel } from '@/features/upload-photo/model/use-upload-dropzone';
import { UploadDropzoneStatus } from '@/features/upload-photo/model/use-upload-dropzone';
import type { useUploadPhotoFlow } from '@/features/upload-photo/model/use-upload-photo-flow';
import { UploadPhotoPage } from './upload-photo-page';

type UploadPhotoFlow = ReturnType<typeof useUploadPhotoFlow>;

const baseDropzone: UploadDropzoneViewModel = {
  rootProps: {
    role: 'button',
    tabIndex: 0,
    'aria-label': '업로드 영역'
  } as unknown as UploadDropzoneViewModel['rootProps'],
  inputProps: {
    'aria-label': '파일 입력'
  } as unknown as UploadDropzoneViewModel['inputProps'],
  status: UploadDropzoneStatus.IDLE,
  primaryText: '사진을 여기로 끌어다 놓거나',
  secondaryText: '클릭해서 선택해주세요',
  isUploading: false,
  fileRejections: []
};

const createFlow = (override: Partial<UploadPhotoFlow> = {}): UploadPhotoFlow =>
  ({
    selectedFile: null,
    previewUrl: null,
    dropzone: baseDropzone,
    handleRemoveFile: () => {},
    handleNext: () => {},
    ...override
  }) satisfies UploadPhotoFlow;

const meta = {
  title: 'Pages/UploadPhoto/UploadPhotoPage',
  component: UploadPhotoPage,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof UploadPhotoPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => <UploadPhotoPage flow={createFlow()} />
};

export const WithPreview: Story = {
  render: () => (
    <UploadPhotoPage
      flow={createFlow({
        selectedFile: new File(['x'], 'photo.png', { type: 'image/png' }),
        previewUrl:
          'data:image/svg+xml;charset=utf-8,' +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="24">Preview</text></svg>'
          )
      })}
    />
  )
};
