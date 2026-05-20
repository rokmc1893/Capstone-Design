import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { IMAGE_ALLOWED_TYPES, IMAGE_MAX_BYTES } from '../../../lib/community/sanitize';

type ImageUploadProps = {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
};

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!IMAGE_ALLOWED_TYPES.includes(file.type as (typeof IMAGE_ALLOWED_TYPES)[number])) {
      setError('JPEG, PNG, WebP만 업로드할 수 있어요.');
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      setError('이미지는 900KB 이하로 올려 주세요.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="text-[13px] font-semibold text-white/85">이미지 (선택)</p>
      {value ? (
        <div className="relative mt-2">
          <img src={value} alt="미리보기" className="max-h-40 w-full rounded-[16px] object-cover ring-1 ring-white/25" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white"
            aria-label="이미지 제거"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
          className="mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-white/30 bg-white/8 py-8 text-[13px] text-white/70 transition hover:bg-white/12"
        >
          <ImagePlus className="h-8 w-8 text-white/60" aria-hidden />
          탭하거나 사진을 끌어다 놓으세요
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ALLOWED_TYPES.join(',')}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error ? <p className="mt-2 text-[12px] text-rose-200">{error}</p> : null}
    </div>
  );
}
