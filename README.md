# 최종프로젝트 [Six Pack]

<img src="https://file.notion.so/f/s/2ffe3d4b-c00f-44b7-b711-9b752086f432/%EB%B8%8C%EB%A1%9C%EC%85%94-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%88%98%EC%A0%95.jpg?id=5bd230fa-ff21-4859-bc76-fe632cdf9d43&table=block&spaceId=b433d277-904c-4c13-abde-13717c41df4a&expirationTimestamp=1680172075003&signature=eaJ-la9TQ5tlPbhewFZh-UYNFvTrkWmF1EdKnNS6HDk&downloadName=%EB%B8%8C%EB%A1%9C%EC%85%94-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%88%98%EC%A0%95.jpg">

## **프로젝트 소개**

```
💡전국의 운동할 수 있는 시설을(헬스장, 필라테스 등) 중개하는 ‘식스팩‘ 이라는 플랫폼 서비스를 개발
```

## **서비스 기획 배경**

#### ‘식스팩‘ 은 전국의 운동시설을 중개하는 구독형 플랫폼 서비스 입니다.

📢 **헬스장, 필라테스, 크로스핏 모두 하고싶은 사람 모여라!**

어제는 회사 앞 필라테스, 오늘은 집 앞 헬스장, 내일은 새로생긴 크로스핏을 해볼까!?

아직도 매일 똑같은 곳에서 똑같은 운동을 한다고? 🤦‍♀️
출장이 잦아서 운동을 하고싶어도 못 한다고?🤷‍♀️

지금 당장 **식스팩**에서 하고싶은 운동 마음껏 하자! 💪💪💪

### **서비스 기획 아이데이션**

<img src=./public/images/ideation.png>

<br>

### ✨프로젝트 핵심 기능

| 기능                  | 기술 스택 (내용)                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 로그인, 로그아웃      | JWT(AccessToken, RefreshToken), Redis                                                                                             |
| 회원가입              | 로컬로그인, 소셜로그인(카카오)                                                                                                    |
| 유저정보 CRUD         | 일반회원 마이페이지                                                                                                               |
| 가맹점 회원 정보 CRUD | 사업자회원 정보                                                                                                                   |
| 피드 CRUD             | 피드 조회. 작성, 수정, 삭제 / 피드 댓글 조회, 작성,삭제                                                                           |
| 가맹점 등록 CRUD      | 가맹점 조회, 등록, 수정, 삭제                                                                                                     |
| 지도 연동             | 카카오 맵 연동                                                                                                                    |
| 리뷰 CRUD             | 리뷰 조회, 작성, 수정, 삭제                                                                                                       |
| 구독 결제             | 결제, 결제 상태, 스케줄링, 빌링키 사용 자동결제, 멤버십 별 권한 부여                                                              |
| QR코드                | QR코드로 입장처리                                                                                                                 |
| 돈 정산하기           | 한 달 단위로 돈 정산                                                                                                              |
| 페이지네이션          | 무한 스크롤                                                                                                                       |
| 어드민 페이지         | 멤버십 별 현 회원 안내, 제휴 업종별 가맹점 안내, 카테고리별 가맹점 순위 리스트, 월별 순위표, 월별 매출, 누적매출, 제휴가맹점 승인 |

<br>

### 📌역할분담

- **한정훈(팀장)**
  - 기획
  - 디자인
  - 구독결제
  - 어드민 페이지 가맹점순위 카테고리
  - 가맹점 별 월 정산 로직
- **김승일(부팀장)**
  - 로그인, 로그아웃
  - 회원가입
  - Cache-aside-pattern 적용
  - Elasticsearch 적용
  - 리뷰 CRUD
  - 카카오 맵 API 연동
- **이효원**
  - 페이지 별 테스트
  - 문서작업
- **정호준**
  - QR-code 입장처리
  - 체육관 CRUD
  - 피드 & 댓글 CRUD
  - 카카오 맵 API 연동
  - 무한 스크롤
- **주현진**
  - 유저정보 CRUD
  - 업체 회원 정보 CRUD
  - 수정/삭제 유저 검증

<br>

### ✅Swagger

- [Swagger-openAPI](https://sixpack.pro/api)

<br>

### 👨‍💻기술 스택

<div align="center">
  <p style="font-size:20px;">📚Tech Stack📚</p>
  <p>⭐ Platforms & Languages ⭐</p>
	<img src="https://img.shields.io/badge/EJS-000000?style=flat&logo=EJS&logoColor=white" />
	<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=CSS3&logoColor=white" />
	<img src="https://img.shields.io/badge/JavaScript-f7df1e?style=flat&logo=JavaScript&logoColor=white" />
	<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white" />
	<img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=Axios&5A29E4=white" />
	<img src="https://img.shields.io/badge/jQuery-0769ad?style=flat&logo=jQuery&logoColor=white" />
  <br/>
	<img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white" />
	<img src="https://img.shields.io/badge/MySQL-4479a1?style=flat&logo=.env&logoColor=white" />
	<img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=NestJS&logoColor=white" />
	<img src="https://img.shields.io/badge/Elasticsearch-005571?style=flat&logo=Elasticsearch&4a154b=white" />
	<img src="https://img.shields.io/badge/TypeORM-010101?style=flat&logo=TypeORM&logoColor=white" />
	<img src="https://img.shields.io/badge/Redis-DC382D?style=flat&logo=Redis&4a154b=white" />
  <br/>
        <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=Docker&logoColor=white"/>
	<img src="https://img.shields.io/badge/JWT-000000?style=flat&logo=JSON%20web%20tokens&logoColor=white"/>
	
  <br/>
  <br/>
  <p>♻ AWS & GCP♻</p>
	<img src="https://img.shields.io/badge/Amazon-RDS-527FFF?style=flat&logo=Amazon-RDS&4a154b=white" />
	<img src="https://img.shields.io/badge/Amazon-S3-569A31?style=flat&logo=Amazon-S3&4a154b=white" />
	<img src="https://img.shields.io/badge/Google Cloud-4285F4?style=flat&logo=Google Cloud&logoColor=white"/>
  <br/>
  <br/>
  <p>🛠 Tools 🛠</p>
	<img src="https://img.shields.io/badge/Visual Studio Code-007acc?style=flat&logo=Visual Studio Code&logoColor=white" />
	<img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=GitHub&181717=white" />
	<img src="https://img.shields.io/badge/slack-4a154b?style=flat&logo=slack&4a154b=white" />
	<img src="https://img.shields.io/badge/Notion-000000?style=flat&logo=Notion&4a154b=white" />
	<img src="https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=Postman&logoColor=white"/>
</div>
<br>

<br>

### 🖼️ERD

![스크린샷(645)](https://user-images.githubusercontent.com/118158825/228525121-1b1be48d-3a4c-4e66-b34d-685a6bd0d6b9.png)

<br />


## 🖼️Six Pack 미리보기
![미리보기 최종](https://user-images.githubusercontent.com/118158825/228528601-31b529ac-1e27-457b-9588-9d77eb0682f3.png)


<br />

## 😊프로젝트 시작 방법

이 섹션에서는 프로젝트 시작 방법에 대해서 설명합니다

### 패키지 설치

```
npm install
```

### 환경설정 구성

```
PORT=3000
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=sixpack
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=7d
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
KAKAO_CALLBACK_URL=https://www.sixpack.pro/api/auth/login/kakao/callback
KAKAO_MAP_KEY=
REDIS_URL=
IMP_CODE=imp52616317
IMP_REST_API_KEY=
IMP_REST_API_SECRET_KEY=
AWS_BUCKET_REGION=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
SIXPACK_URL=https://www.sixpack.pro
```

### 서버 실행

```
docker-compose up --build
```
