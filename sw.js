const CACHE_NAME = 'pwa-offline-v1';
 //캐쉬를 담을 파일명 정의
const filesToCache = [ //캐쉬 할 웹 자원들 목록
    '/', //index.html을 담당
    '/public/css/styles.css',
    '/public/images/banner.png',
    '/public/images/manifest.png',
    '/public/images/pwa.png',
]

// const CACHE_NAME = 'pwa-offline-v2'; 
//캐쉬를 담을 파일명 정의

// 서비스 워커 설치 (웹 자원 캐싱)
self.addEventListener('install', (event)=>{
    console.log('install ')
    event.waitUntil(//끝나기 전까지는 이벤트가 끝나지 않는다.
    //caches 브라우져 예약어
        caches.open(CACHE_NAME)
        .then((cache)=>{//캐쉬를 열고 접근 할 수 있는 캐쉬를 얻을 수 있다.
            //캐쉬에 넣어라
            return cache.addAll(filesToCache)
        })
        .catch(error=>{
            return console.log(error)
        })
    )
})

// 서비스 자원의 요청 또는 캐쉬 정보를 반환 [요청 가로 체기]
self.addEventListener('fetch',(event)=>{
    console.log('fetch', event.request)
    event.respondWith(
        caches.match(event.request) //fetch request를 보내는 내용
        //값이 있다면 캐쉬 내용을 전달 하고
        //없다면 fetch 요청을 보내서 자원을 요청한다.
        .then((response)=>response || fetch(event.request))
        .catch(console.error)
    );
})

// 불필요한 캐쉬 제거
self.addEventListener('activate',(event)=>{
    const newCacheList = [CACHE_NAME];
    event.waitUntil(//promise를 리턴 하기 전짜기 동작을 보당 해준다.
        caches.keys()
        .then((cacheList)=>{
            return Promise.all(cacheList.map(cacheName=>{
                if(newCacheList.indexOf(cacheName) === -1){
                    return caches.delete(cacheName)
                }
            }))
        })
        .catch(console.error)
    );
})