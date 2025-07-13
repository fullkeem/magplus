# Zustand 상태 관리 가이드

MAG+ 웹매거진의 Zustand 상태 관리 사용법입니다.

## 🚀 빠른 시작

### 스토어 사용하기

```typescript
import { useFilters, useUI, useSubscription } from '@/hooks/useStores'

function MyComponent() {
  // 필터링
  const { selectedCategory, setCategory } = useFilters()

  // UI 상태
  const { showSuccess, showError } = useUI()

  // 구독 관리
  const { isSubscribed, subscribe } = useSubscription()

  return <div>...</div>
}
```

## 📦 스토어 구조

### 1. 필터링 스토어 (`useFilters`)

아티클 검색 및 필터링 상태

```typescript
const {
  selectedCategory,    // 선택된 카테고리
  selectedRegion,      // 선택된 지역
  searchQuery,         // 검색어
  setCategory,         // 카테고리 설정
  setRegion,          // 지역 설정
  setSearchQuery,     // 검색어 설정
  clearFilters        // 필터 초기화
} = useFilters()
```

### 2. UI 스토어 (`useUI`)

모달, 로딩, 알림 등 UI 상태

```typescript
const {
  isMenuOpen,         // 메뉴 열림 상태
  isPageLoading,      // 페이지 로딩 상태
  showSuccess,        // 성공 알림 표시
  showError,          // 에러 알림 표시
  openMenu,           // 메뉴 열기
  closeMenu           // 메뉴 닫기
} = useUI()
```

### 3. 구독 스토어 (`useSubscription`)

이메일 구독 및 북마크 관리

```typescript
const {
  isSubscribed,       // 구독 상태
  email,              // 구독 이메일
  bookmarkedArticles, // 북마크한 아티클들
  subscribe,          // 구독하기
  unsubscribe,        // 구독 해지
  addBookmark,        // 북마크 추가
  removeBookmark      // 북마크 제거
} = useSubscription()
```

## 💡 주요 사용 예제

### 카테고리 필터

```typescript
function CategoryFilter() {
  const { selectedCategory, setCategory } = useFilters()

  return (
    <select value={selectedCategory || ''} onChange={(e) => setCategory(e.target.value)}>
      <option value="">전체</option>
      <option value="cafe">카페</option>
      <option value="restaurant">레스토랑</option>
    </select>
  )
}
```

### 구독 버튼

```typescript
function SubscribeButton() {
  const { isSubscribed, subscribe } = useSubscription()
  const { showSuccess, showError } = useUI()

  const handleSubscribe = async () => {
    try {
      await subscribe('user@example.com')
      showSuccess('구독 완료!')
    } catch (error) {
      showError('구독 실패')
    }
  }

  return (
    <button onClick={handleSubscribe}>
      {isSubscribed ? '구독 중' : '구독하기'}
    </button>
  )
}
```

### 북마크 버튼

```typescript
function BookmarkButton({ articleId }: { articleId: string }) {
  const { bookmarkedArticles, addBookmark, removeBookmark } = useSubscription()

  const isBookmarked = bookmarkedArticles.includes(articleId)

  const toggle = () => {
    if (isBookmarked) {
      removeBookmark(articleId)
    } else {
      addBookmark(articleId)
    }
  }

  return (
    <button onClick={toggle}>
      {isBookmarked ? '★' : '☆'}
    </button>
  )
}
```

### 알림 메시지

```typescript
function MyForm() {
  const { showSuccess, showError } = useUI()

  const handleSubmit = async () => {
    try {
      // API 호출
      showSuccess('저장되었습니다!')
    } catch (error) {
      showError('오류가 발생했습니다.')
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## 🔧 편의 훅들

### 북마크 관리

```typescript
import { useBookmarks } from '@/hooks/useStores'

const { isBookmarked, toggleBookmark } = useBookmarks()

// 사용법
const bookmarked = isBookmarked('article-123')
toggleBookmark('article-123')
```

### 토스트 알림

```typescript
import { useToasts } from '@/hooks/useStores'

const { toasts, removeToast } = useToasts()

// 알림 목록 렌더링
{toasts.map(toast => (
  <div key={toast.id}>{toast.message}</div>
))}
```

## 💾 자동 저장

구독 정보와 북마크는 브라우저에 자동으로 저장됩니다:

- 구독 상태
- 이메일 주소
- 북마크한 아티클 목록
- 읽은 아티클 기록

## 🎯 핵심 포인트

1. **간단한 사용법**: `useFilters()`, `useUI()`, `useSubscription()` 세 개의 메인 훅만 기억
2. **자동 저장**: 중요한 데이터는 자동으로 로컬에 저장
3. **타입 안전**: TypeScript로 모든 상태와 액션이 타입 체크됨
4. **편의 기능**: 자주 쓰는 패턴은 별도 훅으로 제공

이제 더 간단하게 Zustand를 사용할 수 있습니다! 🎉
