const userType = localStorage.getItem('type');
if (userType !== 'business') {
  alert('사업자 로그인이 필요한 서비스입니다.');
  window.location.href = '/business/login';
}

$(document).ready(function () {
  businessUser();
});

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

function businessUser() {
  axios
    .get(`/api/business`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      $('#name').val(res.data.name);
      $('#phone').val(res.data.phone);
      document.getElementById('image').src = res.data.profileImage ? res.data.profileImage : '/images/default_profile.png';
    })
    .catch((err) => {
      console.log(err);
    });
}

function putInfo() {
  const name = document.getElementById('name').value;
  const currentPassword = document.getElementById('currentPassword').value;
  const password = document.getElementById('password')
    ? document.getElementById('password').value
    : document.getElementById('currentPassword').value;
  const passwordCheck = document.getElementById('passwordCheck')
    ? document.getElementById('passwordCheck').value
    : document.getElementById('currentPassword').value;
  const phone = document.getElementById('phone').value;
  const profileImage = document.getElementById('profileImage');

  console.log('profileImage: ', profileImage);

  const formData = new FormData();
  formData.append('name', name);
  formData.append('currentPassword', currentPassword);
  formData.append('password', password);
  formData.append('passwordCheck', passwordCheck);
  formData.append('phone', phone);
  formData.append('profileImage', profileImage.files[0]);

  axios
    .put('/api/business', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      window.location.replace(`/business/businessMyInfo`);
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
