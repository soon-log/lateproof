import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { UploadDropzoneViewModel } from '@/features/upload-photo/model/use-upload-dropzone';
import { UploadDropzoneStatus } from '@/features/upload-photo/model/use-upload-dropzone';
import { UploadDropzone } from './upload-dropzone';

const base: UploadDropzoneViewModel = {
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

const meta = {
  title: 'Features/UploadPhoto/UploadDropzone',
  component: UploadDropzone,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof UploadDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: base
};

export const Active: Story = {
  args: {
    ...base,
    status: UploadDropzoneStatus.ACTIVE,
    primaryText: '여기에 놓아주세요',
    secondaryText: undefined
  }
};

export const Reject: Story = {
  args: {
    ...base,
    status: UploadDropzoneStatus.REJECT,
    primaryText: '이 파일은 사용할 수 없어요',
    secondaryText: 'JPG, PNG, WebP 파일만 가능해요'
  }
};

export const ErrorState: Story = {
  args: {
    ...base,
    status: UploadDropzoneStatus.ERROR,
    primaryText: '사진 크기가 너무 커요',
    secondaryText: '10MB 이하의 사진을 선택해주세요'
  }
};

export const Uploading: Story = {
  args: {
    ...base,
    isUploading: true
  }
};
