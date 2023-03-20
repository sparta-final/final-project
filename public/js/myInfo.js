const userType = localStorage.getItem('type');
if (userType !== 'user') {
  alert('일반 로그인이 필요한 서비스입니다.');
  window.location.href = '/user/login';
}

$(document).ready(function () {
  user();
});

/**
 * 마이페이지 - 내 정보 수정하기
 * @author 주현진
 */

// 사진 미리보기
const fileInput = document.getElementById('profileImage');
const preview = document.getElementById('image');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
  };
  reader.readAsDataURL(file);
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
      $('#nickname').val(res.data.nickname);
      $('#phone').val(res.data.phone);
      document.getElementById('image').src = res.data.profileImage
        ? res.data.profileImage
        : 'https://www.sixpack.pro/images/default_profile.png';
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
      window.location.replace(`/mypage`);
    })
    .catch((err) => {
      console.log('err.response.data :', err.response.data.data);

      if (err.response.data.data === '현재 비밀번호가 일치하지 않습니다.') {
        alert('현재 비밀번호가 일치하지않습니다.');
      }
      if (err.response.data.data[0] === 'currentPassword should not be empty') {
        alert('현재 비밀번호를 입력해주세요.');
      }

      if (err.response.data.data === '비밀번호가 일치하지 않습니다.') {
        alert('수정할 비밀번호가 일치하지 않습니다.');
      }
    });
}

// 비밀번호 수정하기 버튼을 클릭하면 input 요소를 추가합니다.
function addInputs() {
  const password = document.createElement('input');
  password.type = 'password';
  password.id = 'password';
  password.placeholder = '새 비밀번호를 입력해주세요.';

  const passwordCheck = document.createElement('input');
  passwordCheck.type = 'password';
  passwordCheck.id = 'passwordCheck';
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

// // 회원 탈퇴
// function deleteMember() {
//   if (window.confirm('정말 회원 탈퇴하시겠습니까?')) {
//     axios({
//       url: '/api/user/delete',
//       method: 'put',
//       headers: {
//         accesstoken: `${localStorage.getItem('at')}`,
//         refreshtoken: `${localStorage.getItem('rt')}`,
//       },
//     })
//       .then((res) => {
//         alert('회원 탈퇴가 정상적으로 처리되었습니다.');
//         localStorage.removeItem('at');
//         localStorage.removeItem('rt');
//         localStorage.removeItem('type');
//         location.href = '/';
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }
