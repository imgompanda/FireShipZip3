# Supabase Storage로 파일 저장하기

> AI가 생성한 이미지와 영상을 저장할 공간이 필요해요. Supabase Storage를 사용하면 별도 서비스 없이 파일을 안전하게 저장하고 공유할 수 있어요!

---

## Supabase Storage가 뭔가요?

**한 줄 설명**: Supabase에 내장된 파일 저장소예요. AWS S3 같은 건데, Supabase 안에서 바로 쓸 수 있어요.

쉽게 말하면:
- 데이터베이스에는 **텍스트 데이터** (이름, 이메일, 가격 등)를 저장하고
- 스토리지에는 **파일** (이미지, 영상, 문서 등)을 저장해요

이 프로젝트에서는 주로 **AI가 생성한 이미지와 영상**을 저장하는 데 사용해요.

### 왜 Supabase Storage인가요?

| | Supabase Storage | AWS S3 | Cloudinary |
|---|-----------------|--------|------------|
| 설정 난이도 | SQL 한 줄 | 복잡한 IAM 설정 | API 키 발급 |
| 비용 | 무료 1GB | 종량제 | 무료 제한적 |
| Supabase 연동 | 기본 내장 | 별도 설정 | 별도 설정 |
| RLS 보안 | 기본 지원 | IAM 정책 | 별도 설정 |

---

## 전체 흐름

```
Supabase에서 버킷 생성 → RLS 정책 설정 → 업로드/다운로드 바로 사용
```

---

## 1단계: `ai-generated` 버킷 만들기

### 방법 1: Supabase 대시보드에서 만들기 (추천)

1. [app.supabase.com](https://app.supabase.com) 에 로그인해요
2. 프로젝트를 선택해요
3. 왼쪽 메뉴에서 **Storage** 클릭해요
4. **New Bucket** 버튼을 클릭해요
5. 아래처럼 설정해요:

| 항목 | 값 | 설명 |
|------|-----|------|
| Bucket Name | `ai-generated` | 버킷 이름 |
| Public bucket | **ON** (켜기) | 생성된 파일을 URL로 공개 |
| File size limit | `10MB` | 최대 파일 크기 |
| Allowed MIME types | 비워두기 | 모든 파일 허용 (이미지+영상) |

6. **Create bucket** 클릭!

> Public을 켜면 누구나 URL로 파일에 접근할 수 있어요. AI가 생성한 이미지를 사용자에게 보여주려면 필요해요.

### 방법 2: SQL로 만들기

대시보드 대신 SQL Editor에서도 만들 수 있어요:

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('ai-generated', 'ai-generated', true);
```

> 어느 방법이든 결과는 같아요. 편한 방법을 선택하세요!

---

## 2단계: RLS(보안 정책) 설정하기

버킷을 만들었으면, **누가 파일을 올리고 볼 수 있는지** 설정해야 해요.

### 우리의 보안 규칙

| 행동 | 누가 | 설명 |
|------|------|------|
| 업로드 | 로그인한 사용자만 | 아무나 파일 올리면 안 되겠죠? |
| 읽기/보기 | 누구나 | AI 생성 이미지를 공유하려면 공개 필요 |

### SQL Editor에서 실행

Supabase 대시보드 → **SQL Editor** → 아래 SQL을 복사해서 실행:

```sql
-- 로그인한 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'ai-generated' AND auth.role() = 'authenticated');

-- 누구나 파일 조회 가능 (공개)
CREATE POLICY "Anyone can view" ON storage.objects
  FOR SELECT USING (bucket_id = 'ai-generated');
```

### 정책 설명

```
업로드: 로그인한 사용자 → ai-generated 버킷에만 가능
조회:   누구나 → URL만 있으면 파일 접근 가능
삭제:   불가 → 실수로 삭제하는 것 방지 (필요하면 추가 가능)
```

> 나중에 삭제 정책도 필요하다면 Claude Code에게 "ai-generated 버킷에 본인 파일만 삭제할 수 있는 RLS 추가해줘"라고 말하면 돼요!

---

## 3단계: 저장 구조 이해하기

파일은 이런 구조로 저장돼요:

```
ai-generated/
└── ai-generations/
    └── {사용자ID}/
        ├── image-1709452800000.png    ← AI가 생성한 이미지
        ├── image-1709453100000.png
        └── video-1709454000000.mp4    ← AI가 생성한 영상
```

- 사용자별로 **폴더가 자동 생성**돼요
- 파일명에 **타임스탬프**가 붙어서 충돌이 없어요
- 이미지는 `.png`, 영상은 `.mp4`로 저장돼요

---

## 4단계: 저장된 파일 확인하기

### Supabase 대시보드에서 확인

1. Supabase 대시보드 → **Storage** 클릭
2. `ai-generated` 버킷 클릭
3. `ai-generations` 폴더 → 사용자 ID 폴더 → 파일 목록 확인

### 파일 URL 형식

저장된 파일은 이런 URL로 접근할 수 있어요:

```
https://{프로젝트ID}.supabase.co/storage/v1/object/public/ai-generated/ai-generations/{사용자ID}/image-1709452800000.png
```

이 URL을 `<img>` 태그에 넣으면 바로 이미지가 보여요!

---

## 5단계: 업로드 코드 (이미 구현되어 있어요!)

이 프로젝트에는 이미 스토리지 업로드 코드가 포함되어 있어요. AI 이미지/영상을 생성하면 자동으로 Supabase에 저장돼요.

### 서버 사이드 업로드 (src/lib/ai/storage.ts)

```typescript
import { createClient } from "@/utils/supabase/server";

export async function uploadToSupabase(
  file: Buffer,
  userId: string,
  type: "image" | "video"
): Promise<string | null> {
  const supabase = await createClient();
  const timestamp = Date.now();
  const ext = type === "image" ? "png" : "mp4";
  const path = `ai-generations/${userId}/${type}-${timestamp}.${ext}`;

  const { error } = await supabase.storage
    .from("ai-generated")
    .upload(path, file, {
      contentType: type === "image" ? "image/png" : "video/mp4",
      upsert: false,
    });

  if (error) {
    console.error("업로드 실패:", error);
    return null;
  }

  const { data } = supabase.storage.from("ai-generated").getPublicUrl(path);
  return data.publicUrl;
}
```

### 커스텀 업로드가 필요하다면

프로필 이미지 업로드 같은 기능을 추가하고 싶다면, Claude Code에게 이렇게 요청하세요:

```
"user-uploads 버킷을 새로 만들고, 프로필 이미지 업로드 기능 추가해줘.
드래그 앤 드롭도 지원하고, 미리보기도 보여줘."
```

---

## 용량 참고

| 플랜 | 용량 | 대역폭 |
|------|------|--------|
| Free | 1GB | 2GB/월 |
| Pro ($25/월) | 100GB | 250GB/월 |

> AI 생성 이미지 정도면 Free 플랜으로 충분해요. 이미지 한 장이 보통 1~3MB니까, 300장 이상 저장 가능!

---

## 트러블슈팅

### "new row violates row-level security policy" 에러

- RLS 정책이 제대로 설정되지 않았어요
- 2단계의 SQL을 다시 실행해보세요
- 로그인 상태인지 확인하세요

### 파일이 업로드되는데 URL에서 안 보여요

- 버킷이 **Public**으로 설정되어 있는지 확인해요
- Supabase 대시보드 → Storage → 버킷 설정에서 Public 토글 확인

### 파일 크기 제한 에러

- 버킷 설정에서 File size limit 확인해요
- DALL-E 이미지는 보통 2~5MB, 영상은 더 클 수 있어요
- 필요하면 제한을 늘려주세요

---

## 스토리지 스킵하기

AI 기능을 사용하지 않는다면, 스토리지 설정을 건너뛰어도 돼요. 버킷이 없어도 앱의 다른 기능은 정상 동작해요.

---

📹 **영상 촬영 포인트**

**제목:** "AI 이미지 저장소 만들기 - Supabase Storage 설정"
**길이:** 5분
**보여줄 것:**
1. "파일 저장이 왜 필요한지" 간단 설명 (AI 이미지 생성 → 어디에 저장?)
2. Supabase 대시보드 → Storage 메뉴 클릭
3. New Bucket → `ai-generated` 이름 입력 → Public ON → Create
4. SQL Editor 열기 → RLS 정책 SQL 복사/붙여넣기 → Run
5. AI 이미지 생성 기능 실행 → 이미지 생성 (라이브 데모)
6. Supabase Storage에서 저장된 파일 확인
7. 파일 URL 복사 → 브라우저에서 열어보기
8. "이게 끝이에요! AWS S3 설정 안 해도 돼요" 마무리

**스크립트 초안:**
> "AI가 이미지를 생성했어요. 근데 이 이미지를 어디에 저장할까요?
> AWS S3? 설정이 너무 복잡하죠. Cloudinary? 또 다른 서비스에 가입해야 해요.
> 우리는 이미 Supabase를 쓰고 있으니까, Supabase Storage를 사용하면 돼요!
> Storage 메뉴를 열고... New Bucket... 이름은 ai-generated... Public ON... Create!
> 보안 정책도 SQL 한 번이면 끝이에요. 로그인한 사용자만 업로드 가능, 누구나 볼 수 있게...
> 이제 AI 이미지를 생성해볼게요... 짠! Supabase에 자동으로 저장됐어요.
> 이 URL을 복사해서 브라우저에 붙여넣으면... 이미지가 보이죠?
> 별도 서비스 가입 없이, Supabase 하나로 데이터베이스 + 인증 + 파일 저장까지. 깔끔하죠?"

---

**다음**: [16-ai-sdk](../16-ai-sdk/) - AI 기능 설정
