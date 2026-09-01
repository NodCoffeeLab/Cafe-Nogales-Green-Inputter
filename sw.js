const CACHE_NAME = 'nogales-qc-v2'; // 버전을 v2로 올려 이전 캐시 강제 삭제 트리거
const ASSETS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com'
];

// 최초 설치 시 기본 에셋 캐싱
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // 새 서비스 워커 강제 활성화
});

// 활성화 시 이전 캐시를 안전하게 비우기 (캐시 버스팅 핵심 엔진)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 오프라인 작동용 패치 가로채기
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
