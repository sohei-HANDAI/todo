const CACHE_NAME = 'pwa-todo-list-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/icon.svg',
  'https://cdn.tailwindcss.com' // CDNもキャッシュに含める
];

// Service Workerのインストールイベント
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Service Workerの有効化イベント
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 古いキャッシュを削除
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// fetchイベント（リクエストへの応答）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュにヒットした場合、それを返す
        if (response) {
          return response;
        }

        // キャッシュにない場合、ネットワークから取得
        return fetch(event.request).then(
          response => {
            // レスポンスが不正な場合はそのまま返す
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // レスポンスをクローンして片方をキャッシュに保存
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
