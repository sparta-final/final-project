/**
 * @description: 카카오 로그인 성공시 토큰 저장 및 메인페이지로 이동
 * @author: 김승일
 */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const at = urlParams.get('at');
const rt = urlParams.get('rt');
if (at && rt) {
  localStorage.setItem('at', at);
  localStorage.setItem('rt', rt);
  localStorage.setItem('type', 'user');
  location.replace('/');
}

/**
 * @description: 일반유저 로그인
 * @author: 김승일
 */
function userLogin() {
  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('userpw').value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return alert('이메일 형식이 올바르지 않습니다.');
  }
  const loginData = {
    email: email,
    password: password,
  };

  axios
    .post('/api/auth/user/login', loginData)
    .then((res) => {
      localStorage.setItem('at', res.data.at);
      localStorage.setItem('rt', res.data.rt);
      localStorage.setItem('type', res.data.type);
      location.replace('/gym');
    })
  // .catch((err) => {
  //   alert(err.response.data.data);

}

/**
 * @description: 일반유저 회원가입
 * @author: 김승일
 */
function userSignup() {
  const email = document.getElementById('userEmail').value;
  const nickname = document.getElementById('userNickname').value;
  const password = document.getElementById('userpw').value;
  const passwordCheck = document.getElementById('userpwCheck').value;
  const phone = document.getElementById('userPhone').value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return alert('이메일 형식이 올바르지 않습니다.');
  }

  const signupData = {
    email: email,
    nickname: nickname,
    password: password,
    passwordCheck: passwordCheck,
    phone: phone,
  };

  axios
    .post('/api/auth/user/signup', signupData)
    .then((res) => {
      localStorage.setItem('at', res.data.at);
      localStorage.setItem('rt', res.data.rt);
      localStorage.setItem('type', res.data.type);
      alert('회원가입 성공');
      location.replace('/');
    })
  // .catch((err) => {
  //   alert(err.response.data.data);
  // });
}

/**
 * @description: 사업자 로그인
 * @author : 김승일
 */
function businessLogin() {
  const email = document.getElementById('businessEmail').value;
  const password = document.getElementById('businesspw').value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return alert('이메일 형식이 올바르지 않습니다.');
  }
  const loginData = {
    email: email,
    password: password,
  };

  axios
    .post('/api/auth/user/business/login', loginData)
    .then((res) => {
      localStorage.setItem('at', res.data.at);
      localStorage.setItem('rt', res.data.rt);
      localStorage.setItem('type', res.data.type);
      location.replace('/business/businessMyinfo');
    })
    .catch((err) => {
      alert(err.response.data.data);
    });
}

/**
 * @description: 사업자 회원가입
 * @author: 김승일
 */
function businessSignup() {
  const email = document.getElementById('businessEmail').value;
  const name = document.getElementById('businessNickname').value;
  const password = document.getElementById('businesspw').value;
  const passwordCheck = document.getElementById('businesspwCheck').value;
  const phone = document.getElementById('businessPhone').value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return alert('이메일 형식이 올바르지 않습니다.');
  }

  const signupData = {
    email: email,
    name: name,
    password: password,
    passwordCheck: passwordCheck,
    phone: phone,
  };

  axios
    .post('/api/auth/user/business/signup', signupData)
    .then((res) => {
      localStorage.setItem('at', res.data.at);
      localStorage.setItem('rt', res.data.rt);
      localStorage.setItem('type', res.data.type);
      alert('회원가입 성공');
      location.replace('/');
    })
    .catch((err) => {
      alert(err.response.data.data);
    });
}

/**
 * @description: 어드민 로그인
 * @author: 김승일
 */
function adminLogin() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminpw').value;

  const loginData = {
    email: email,
    password: password,
  };

  axios
    .post('/api/auth/admin/login', loginData)
    .then((res) => {
      localStorage.setItem('at', res.data.at);
      localStorage.setItem('rt', res.data.rt);
      localStorage.setItem('type', res.data.type);
      location.replace('/admin');
    })
    .catch((err) => {
      alert(err.response.data.data);
    });
}
