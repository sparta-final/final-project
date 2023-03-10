$(document).ready(function () {
  user();
});

function user() {
  axios
    .get(`/api/user`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      console.log('✨✨✨', res, '✨✨✨');
      $('#nickname').val(res.data.nickname);
      $('#phone').val(res.data.phone);
      document.getElementById('image').src = res.data.profileImage ? res.data.profileImage : '/images/default_profile.png';
    })
    .catch((err) => {
      console.log(err);
    });
}

function putInfo() {
  const nickname = document.getElementById('nickname').value;
  const currentPassword = document.getElementById('currentPassword').value;
  const password = document.getElementById('password')
    ? document.getElementById('password').value
    : document.getElementById('currentPassword').value;
  const passwordCheck = document.getElementById('passwordCheck')
    ? document.getElementById('passwordCheck').value
    : document.getElementById('currentPassword').value;
  const phone = document.getElementById('phone').value;
  const profileImage = document.getElementById('profileImage');

  console.log('profileImage: ', profileImage.files[0]);

  const formData = new FormData();
  formData.append('nickname', nickname);
  formData.append('currentPassword', currentPassword);
  formData.append('password', password);
  formData.append('passwordCheck', passwordCheck);
  formData.append('phone', phone);
  if (profileImage.files[0] !== undefined) {
    formData.append('profileImage', profileImage.files[0]);
  }

  axios
    .put('/api/user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      alert('성공');
      window.location.replace(`/mypage`);
    })
    .catch((err) => {
      console.log(err);
      console.log(err.response.data);
      if (err.response.data[0] === 'currentPassword should not be empty') {
        alert('현재 비밀번호를 확인해주세요.');
      }
    });
}

// 비밀번호 수정하기 버튼을 클릭하면 input 요소를 추가합니다.
function addInputs() {
  const password = document.createElement('input');
  password.type = 'password';
  password.id = 'password';
  password.style = 'width: 80%; height: 40px; margin-bottom: 10px; border-radius: 10px; border: 3px solid var(--sub-color-1);';
  password.placeholder = '새 비밀번호를 입력해주세요.';

  const passwordCheck = document.createElement('input');
  passwordCheck.type = 'password';
  passwordCheck.id = 'passwordCheck';
  passwordCheck.style =
    'width: 80%; height: 40px; border-radius: 10px; border: 3px solid var(--sub-color-1); margin-bottom: 10px;';
  passwordCheck.placeholder = '새 비밀번호를 한번 더 입력해주세요.';

  const br = document.createElement('br');

  const container = document.getElementById('inputContainer');

  const inputPassword = document.getElementById('password');

  if (!inputPassword) {
    container.appendChild(password);
    container.appendChild(br);
    container.appendChild(passwordCheck);
  } else {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
}
