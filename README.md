# 최종프로젝트 [Six Pack]

## **프로젝트 소개**

```
💡전국의 운동할 수 있는 시설을(헬스장, 필라테스 등) 중개하는 ‘식스팩‘ 이라는 플랫폼 서비스를 개발
```

## **서비스 기획 배경**


❓ 우리가 제공하고자 하는  ‘식스팩’ 서비스는

내 현재 위치에서 쉽게 운동하러 갈 수 있는 공간을 중개하는 플랫폼입니다.

많은 분들이 공감하실 텐데 여행이나 출장 등 타 지역에 갔을 때 헬스장 당일권 외에는 운동할 수단이 마땅치 않습니다. 운동은 하고 싶지만 당일권을 사기엔 부담이 됩니다. ‘식스팩’은 이러한 고민을 완전히 해소해 줍니다.

그리고 내 활동 반경 안에 여러 개의 헬스장을 이용할 수 있다는 건 생각보다 굉장한 만족감과 편안함을 줍니다. 식스팩은 전국 각지에 있는 하이 퀄리티 체육관들과 제휴하고 있고, 구독만 한다면 당신이 어디에 있든 당신과 가장 가까운 체육관에 가서 운동할 수 있습니다.

또한 우리 동네 어느 체육관을 다녀야 할지 고민된다면 주저 말고 한 달만 구독해보세요!

직접 가서 체험해보시고 선택해도 늦지 않습니다.

게다가 전국 헬스장 어디와 비교해도 합리적인 가격대를 자랑합니다.

지금 당장 신청해 보세요!


### **서비스 기획 아이데이션**

<img src=./public/images/ideation.png>

<br>

### ✨프로젝트 핵심 기능

| 기능 | 기술 스택 (내용) |
  | ---------------- | ------------------------------------------------------------ |
  | 로그인, 로그아웃 | JWT(AccessToken, RefreshToken) |
  | 회원가입 | 로컬로그인, 소셜로그인(카카오 + ..) |
  | 유저정보 CRUD | 일반회원 마이페이지 |
  | 업체 회원 정보 CRUD | 사업자회원 정보 |
  | 피드 CRUD | 피드 조회. 작성, 수정, 삭제 / 피드 댓글 조회, 작성,수정,삭제 |
  | 업체 등록 CRUD | 업체 조회, 등록, 수정, 삭제 |
  | 지도 연동 | 카카오 맵 연동 |
  | 리뷰 CRUD | 리뷰 조회, 작성, 수정, 삭제 |
  | 구독 결제 | 결제, 결제 상태, 스케줄링, 빌링키 사용 자동결제, 멤버십 별 권한 부여 |
  | QR코드 | QR코드 정보 넣고 연동 |
  | 돈 정산하기 | 한 달 단위로 돈 정산 |
  | 실시간 상담 | socket.io를 이용한 양뱡향 통신(상담내용은 redis에 저장) |
  | 페이지네이션 | 무한 스크롤 예정 |
  | 어드민 페이지 | 멤버십 별 현 회원 안내, 제휴 업종별 업체 안내, 카테고리별 업체 순위 리스트, 월별 순위표, 월별 매출, 누적매출, 제휴업체 승인 |

<br>

### 📌역할분담

- **한정훈(팀장)**
  - ??
  - ??
- **김승일(부팀장)**
  - 로그인, 로그아웃
  - 회원가입
- **이효원**
  - ??
  - ??
- **정호준**
  - ??
  - ??
- **주현진**
  - 유저정보 CRUD
  - 업체 회원 정보 CRUD

<br>

### ✅최종 구현 범위 ?

- **Swagger-openAPI**
  - /api : API Document
- **Auth**
  - POST :
  - GET :
- ??
  - POST :
  - GET :
  - PATCH :
  - DELETE :

<br>

### 👨‍💻기술 스택

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![TypeORM](https://img.shields.io/badge/ORM-TYPEORM-red)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

<br>

### 🗂️폴더 구조

```
📦public
 ┣ 📂css
 ┣ 📂images
 ┗ 📂js
 📦src
 ┣ 📂domain
 ┃ ┣ 📂admin
 ┃ ┃ ┗ 📂dto
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂dto 
 ┃ ┃ ┣ 📂guard
 ┃ ┃ ┣ 📂strategy
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┗ 📂__test__
 ┃ ┣ 📂business-user
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┗ 📂__test__
 ┃ ┣ 📂feed
 ┃ ┃ ┗ 📂dto
 ┃ ┣ 📂gym
 ┃ ┃ ┗ 📂dto
 ┃ ┣ 📂payment
 ┃ ┃ ┗ 📂dto
 ┃ ┣ 📂qrcode
 ┃ ┃ ┗ 📂__test__
 ┃ ┣ 📂review
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┗ 📂__test__
 ┃ ┗ 📂user
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┗ 📂__test__
 ┗ 📂global
   ┣ 📂common
   ┃ ┣ 📂decorator
   ┃ ┣ 📂interceptor
   ┃ ┗ 📂utils
   ┣ 📂config
   ┣ 📂entities
   ┃ ┗ 📂common
   ┣ 📂exception
   ┣ 📂logger
   ┣ 📂swagger
   ┗ 📂util
📦test
📦views
 ┣ 📂admin
 ┣ 📂auth
 ┣ 📂components
 ┣ 📂feeds
 ┣ 📂gym
 ┣ 📂main
 ┣ 📂mypage
 ┗ 📂review

```

<br>

### 👀코드 컨벤션

- **패키지 관리**
  - 패키지 매니저는 npm을 사용합니다
  - 패키지를 추가할 경우 단일 커밋으로 기록합니다

<br>

- **커밋 관리**
  | 커밋 유형 | 의미 |
  | ---------------- | ------------------------------------------------------------ |
  | Feat | 새로운 기능 추가 |
  | Fix | 버그 수정 |
  | Docs | 문서 수정 |
  | Style | 코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우 |
  | Refactor | 코드 리팩토링 |
  | Test | 테스트 코드, 리팩토링 테스트 코드 추가 |
  | Chore | 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore |
  | Design | CSS 등 사용자 UI 디자인 변경 |
  | Comment | 필요한 주석 추가 및 변경 |
  | Rename | 파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우 |
  | Remove | 파일을 삭제하는 작업만 수행한 경우 |
  | !BREAKING CHANGE | 커다란 API 변경의 경우 |
  | !HOTFIX | 급하게 치명적인 버그를 고쳐야 하는 경우 |

  - 제목 첫 글자는 대문자로, 끝에는 `.` 금지

  - 제목은 영문 기준 50자 이내로 할 것

  - 여러가지 항목이 있다면 글머리 기호를 통해 가독성 높이기

    ```
    - 변경 내용 1
    - 변경 내용 2
    - 변경 내용 3
    ```

- **네이밍 컨벤션**
  - 폴더 이름은 **케밥 케이스**`-`를 준수하며 용도에 따라 `.`으로 구분합니다
  - 클래스 이름은 **파스칼 케이스**를 사용합니다
  - 메서드는 **카멜 케이스**를 사용합니다

<br/>

### 🖼️ERD

<img src="./public/images/erd.png" style="width:100%" />

<br />

### 🖼️API

[API 명세서 링크](https://www.notion.so/API-f10d0029614e4b68bc74fb133560245d)

## 😊프로젝트 시작 방법

이 섹션에서는 프로젝트 시작 방법에 대해서 설명합니다

### 패키지 설치

```
npm install
```

### 환경설정 구성

```
PORT=3000
# DB_HOST=database-1.cztc0r3bkhqe.ap-northeast-2.rds.amazonaws.com
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=sixpack
ACCESS_TOKEN_SECRET=accesstoken
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=refreshtoken
REFRESH_TOKEN_EXPIRES_IN=7d
KAKAO_CLIENT_ID=59927562288d631a54317a05c7c70cd2
KAKAO_CLIENT_SECRET=lR9ogOsyO1nWpSilVOt5AsXL34MFrJ33
KAKAO_CALLBACK_URL=http://sixpack.pro/api/auth/login/kakao/callback
KAKAO_MAP_KEY=e1d7580995b734fc0991bfb432348246
REDIS_URL=redis://localhost:6379
IMP_CODE=imp52616317
IMP_REST_API_KEY=7888224522545243
IMP_REST_API_SECRET_KEY=tQPID0gcbb1M9N6Vyia6NMbSBhwsrN1TJkKqqmnFvW4rAAHLWXdhLBIlS3IBnce16y8oZMmzfa22Nl0R
AWS_BUCKET_REGION=ap-northeast-2
AWS_BUCKET_NAME=sixpack6
AWS_ACCESS_KEY_ID=AKIATGJW5FFJSXFUJXGE
AWS_SECRET_ACCESS_KEY=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
ADMIN_EMAIL=admin@sixpack.com
ADMIN_PASSWORD=asdasd
SIXPACK_URL=http://sixpack.pro
```

### NestJS 앱 실행

```
npm run start:dev
```
