/**
 * @description: 일반유저 로그인
 * @author: 김승일
 */
function userLogin() {
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userpw").value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    alert("이메일 형식이 올바르지 않습니다.");
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
