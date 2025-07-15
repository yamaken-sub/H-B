// sw.js

const CACHE_NAME = 'hit-and-blow-v1'; // キャッシュ名
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icon.svg'
];

// インストールイベント: キャッシュにアセットを追加
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('キャッシュにファイルを追加中:', CACHE_NAME);
                return cache.addAll(urlsToCache);
            })
    );
});

// フェッチイベント: キャッシュからリソースを提供、またはネットワークから取得
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // キャッシュにリソースがあればそれを使用
                if (response) {
                    return response;
                }
                // なければネットワークから取得
                return fetch(event.request).catch(() => {
                    // オフライン時のフォールバック（必要であれば）
                    // 例: return caches.match('/offline.html');
                    console.log('オフラインまたはネットワークエラー:', event.request.url);
                });
            })
    );
});

// アクティベートイベント: 古いキャッシュのクリーンアップ
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('古いキャッシュを削除中:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
