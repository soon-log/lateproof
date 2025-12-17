import { cn } from '@/shared/lib/utils';

export function HelperText({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg bg-brand-50 p-4', className)}>
      <p className="font-medium text-brand-900 text-sm">💡 좋은 사진을 선택하는 팁</p>
      <ul className="mt-2 space-y-1 text-brand-700 text-sm">
        <li>• 배경이 깔끔하고 잘 나온 사진이 좋아요</li>
        <li>• 인물을 추가할 공간이 있는 사진을 선택해주세요</li>
        <li>• 너무 어둡거나 흐린 사진은 피해주세요</li>
      </ul>
    </div>
  );
}
