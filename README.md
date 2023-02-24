# 최종프로젝트

## **프로젝트 소개**

### ✨프로젝트 핵심 기능

- ??
- ??

### 📌역할분담

- **한정훈**
  1. ??
  2. ??
- **김승일**
  1. ??
  2. ??

### ✅최종 구현 범위

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

### 👨‍💻기술 스택

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![TypeORM](https://img.shields.io/badge/ORM-TYPEORM-red)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### 🗂️폴더 구조

```
.
```

### 👀코드 컨벤션

- **패키지 관리**
  - 패키지 매니저는 npm을 사용합니다
  - 패키지를 추가할 경우 단일 커밋으로 기록합니다
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

<br /><br />

## 😊프로젝트 시작 방법

이 섹션에서는 프로젝트 시작 방법에 대해서 설명합니다

### 패키지 설치

```
npm install
```

### 환경설정 구성

```
# ##########################################
# App & Database
# NestJS앱, 데이터베이스 설정
# ##########################################
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
PORT=

# ##########################################
# Auth
# Auth 로그인정책 설정
# ##########################################
JWT_ACCESS_TOKEN_SECRET=
JWT_ACCESS_TOKEN_EXPIRATION_TIME=
JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_TOKEN_EXPIRATION_TIME=
```

### NestJS 앱 실행

```
npm run start:dev
```
