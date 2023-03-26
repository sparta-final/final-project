

/**
 * @description: 일반유저 로그인
 * @author: 김승일
 */
function userLogin() {
  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('userpw').value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return toastr.warning('이메일 형식이 올바르지 않습니다.', '로그인 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
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
    .catch((err) => {
      toastr.error(err.response.data.data, '로그인 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
    });
}

/**
 * @description: 일반유저 회원가입
 * @author: 김승일
 */
function userSignup() {
  const email = document.getElementById('userEmail').value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return toastr.warning('이메일 형식이 올바르지 않습니다.', '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
  }
  const nickname = document.getElementById('userNickname').value;
  if (!nickname) {
    return toastr.warning('닉네임을 입력해주세요.', '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
  }
  const password = document.getElementById('userpw').value;
  if (!password) {
    return toastr.warning('비밀번호를 입력해주세요.', '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
  }
  const passwordCheck = document.getElementById('userpwCheck').value;
  if (!passwordCheck) {
    return toastr.warning('비밀번호 확인을 입력해주세요.', '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
  }
  const phone = document.getElementById('userPhone').value;
  if (!phone) {
    return toastr.warning('전화번호를 입력해주세요.', '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
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
      location.replace('/');
    })
    .catch((err) => {
      console.log('err', err)
      toastr.warning(err.response.data.data, '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
    });
}

/**
 * @description: 사업자 로그인
 * @author : 김승일
 */
function businessLogin() {
  const email = document.getElementById('businessEmail').value;
  const password = document.getElementById('businesspw').value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return toastr.warning('이메일 형식이 올바르지 않습니다.', '로그인 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
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
      toastr.warning(err.response.data.data, '로그인 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
    });
}

/**
 * @description: 사업자 회원가입
 * @author: 김승일
 */
function businessSignup() {
  const email = document.getElementById('businessEmail').value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return toastr.warning("이메일 형식이 올바르지 않습니다", "회원가입 실패", { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true })
  }
  const name = document.getElementById('businessNickname').value;
  if (!name) {
    return toastr.warning('닉네임을 입력해주세요.', '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
  }
  const password = document.getElementById('businesspw').value;
  if (!password) {
    return toastr.warning('비밀번호를 입력해주세요.', '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
  }
  const passwordCheck = document.getElementById('businesspwCheck').value;
  if (!passwordCheck) {
    return toastr.warning('비밀번호 확인을 입력해주세요.', '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
  }
  const phone = document.getElementById('businessPhone').value;
  if (!phone) {
    return toastr.warning('전화번호를 입력해주세요.', '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
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
      location.replace('/');
    })
    .catch((err) => {
      toastr.warning(err.response.data.data, '회원가입 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
    });
}

/**
 * @description: 어드민 로그인
 * @author: 김승일
 */
function adminLogin() {
  const email = document.getElementById('adminEmail').value;
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return toastr.warning("이메일 형식이 올바르지 않습니다", "회원가입 실패", { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true })
  }
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
      toastr.warning(err.response.data.data, '로그인 실패', { timeOut: 3000, positionClass: 'toast-top-center', closeButton: true, progressBar: true, preventDuplicates: true });
    })
}
