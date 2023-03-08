/**
 * @description: 일반유저 로그인
 * @author: 김승일
 */
function userLogin() {
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userpw").value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return alert("이메일 형식이 올바르지 않습니다.");
  }
  const loginData = {
    email: email,
    password: password,
  };

  axios.post("/api/auth/user/login", loginData)
    .then((res) => {
      localStorage.setItem("at", res.data.at);
      localStorage.setItem("rt", res.data.rt);
      alert("로그인 성공");
      location.href = "/";
    }).catch((err) => {
      alert(err.response.data.data)
    })
}

/**
 * @description: 일반유저 회원가입
 * @author: 김승일
 */
function userSignup() {
  const email = document.getElementById("userEmail").value;
  const nickname = document.getElementById("userNickname").value;
  const password = document.getElementById("userpw").value;
  const passwordCheck = document.getElementById("userpwCheck").value;
  const phone = document.getElementById("userPhone").value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return alert("이메일 형식이 올바르지 않습니다.");
  }


  const signupData = {
    email: email,
    nickname: nickname,
    password: password,
    passwordCheck: passwordCheck,
    phone: phone,
  };

  axios.post("/api/auth/user/signup", signupData)
    .then((res) => {
      console.log(res);
      alert("회원가입 성공");
      location.href = "/user/login";
    }).catch((err) => {
      alert(err.response.data.data)
    })
}

/**
 * @description: 카카오 로그인
 * @author: 김승일
 */
function kakaoLogin() {
  axios.get("/api/auth/login/kakao")
    .then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
}