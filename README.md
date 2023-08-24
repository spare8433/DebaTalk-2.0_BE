# DebaTalk-2.0_BE

[DebaTalk-2.0](https://github.com/spare8433/DebaTalk-2.0_FE) 의 백엔드 부분

<br>

## About The Project

처음으로 제대로 구성해본 백엔드 프로젝트로 [sequelize][sequelize-url] 를 통해 DB 모델을 구현했으며 [Node.js][Node-url] 와 [Express][Express-url] 를 활용해 백엔드 환경을 구성함

정적인 웹 어플리케이션 페이지에 맞게 기본적인 crud 기능에서 크게 벗어나지않는 기능들이 대부분이다.

## Tech Stack

- [![TypeScript][TypeScript]][TypeScript-url]
- [![Node][Node.js]][Node-url]
- [![Express][Express]][Express-url]
- [![sequelize][sequelize]][sequelize-url]
- etc ..

[Express]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white
[Express-url]: https://Express.com/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white
[TypeScript-url]: https://styled-components.com/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Nodedotjs&logoColor=white
[Node-url]: https://Nodejs.org/
[sequelize]: https://img.shields.io/badge/sequelize-52B0E7?style=for-the-badge&logo=nextdotjs&logoColor=white
[sequelize-url]: https://sequelize.js.org/

<br>

## Feature

- sequlize 를 통한 데이터베이스 모델 생성 및 관계 정의

- 로그인 및 로그아웃 기능 (쿠키 및 세션 방식)
  - 로그인 인증 및 확인
- 회원가입 기능
- 아이디 조회 기능
- 비밀번호 재설정 관련
  - 인증 코드 등록 및 메일을 통한 발송 **(※ 현재 배포환경에서는 작동되지않음)**
  - 인증 코드 인증
- 이용자 목록 조회

- 토론 및 주제 추천 게시물 등록 및 조회
  - 이미지 서버에 이미지 등록
- 토론 및 주제 추천 게시물 의견 및 답글 등록 및 조회

<br>

## Todo-list

아직 구현되지 못했거나 추가될 수 있는 기능 리스트

### featuer

- [ ] : 레벨 및 포인트 관련 기능
- [ ] : 사용자 및 게시물 신고 기능
- [ ] : 회원 탈퇴 기능
- [ ] : 토론 및 주제 추천 게시물 수정 및 삭제 기능
- [ ] : 의견 및 답글 수정 및 삭제
- [ ] : 사용자 관리 및 제제 기능
- [ ] : 커뮤니티 페이지 관련 게시물, 의견, 답글 기능

<br>

## License

License This project is licensed under the MIT License - see the [LICENSE](https://github.com/spare8433/DebaTalk-2.0_BE/blob/main/LICENSE). file for details
