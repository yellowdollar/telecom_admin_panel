    document.addEventListener('DOMContentLoaded', () => {
        const token = get_cookie('token');
        if(!token) {
            window.location.href = 'http://10.251.4.131/';
            return;
        }
        
        fetch('http://10.251.4.131/api/telecom_app/admin/get_not_identify_users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Error in Request: ${response.status} ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            const table_identify = document.getElementById('users');
            table_identify.innerHTML = "";

            data.forEach((user, index) => {
                const row = document.createElement('tr');

                const user_id = document.createElement('td');
                user_id.textContent = user['user_id'];
                row.appendChild(user_id);

                const username = document.createElement('td');
                username.textContent = user['username'];
                row.appendChild(username);

                const role = document.createElement('td');
                role.textContent = user['role'];
                row.appendChild(role);

                const name = document.createElement('td');
                name.textContent = user['user_info']['name'];
                row.appendChild(name);

                const surname = document.createElement('td');
                surname.textContent = user['user_info']['surname'];
                row.appendChild(surname);

                const patronymic = document.createElement('td');
                patronymic.textContent = user['user_info']['patronymic'];
                row.appendChild(patronymic);

                const birth = document.createElement('td');
                birth.textContent = user['user_info']['birth'];
                row.appendChild(birth);

                const action_input = document.createElement('td');
                const action = document.createElement('input');
                action.type = 'submit'; 
                action.value = 'Проверить';
                action.dataset.index = index;
                action.className = 'check-action';
                action_input.appendChild(action);
                row.appendChild(action_input);

                table_identify.appendChild(row);
            });

            document.querySelectorAll('.check-action').forEach(button => {
                button.addEventListener('click', (event) => {
                    const userIndex = event.target.dataset.index;

                    document.getElementById('check_identify').scrollIntoView({
                        behavior: 'smooth'
                    });

                    const selectedUser = data[userIndex];

                    var user_check = document.getElementById('user_check');
                    user_check.innerHTML = "";

                    var row = document.createElement('tr');

                    const user_id = document.createElement('td');
                    user_id.textContent = selectedUser['user_id'];
                    row.appendChild(user_id);

                    const username = document.createElement('td');
                    username.textContent = selectedUser['username'];
                    row.appendChild(username);

                    const role = document.createElement('td');
                    role.textContent = selectedUser['role'];
                    row.appendChild(role);

                    const name = document.createElement('td');
                    name.textContent = selectedUser['user_info']['name'];
                    row.appendChild(name);

                    const surname = document.createElement('td');
                    surname.textContent = selectedUser['user_info']['surname'];
                    row.appendChild(surname);

                    const patronymic = document.createElement('td');
                    patronymic.textContent = selectedUser['user_info']['patronymic'];
                    row.appendChild(patronymic);

                    const birth = document.createElement('td');
                    birth.textContent = selectedUser['user_info']['birth'];
                    row.appendChild(birth);

                    const email = document.createElement('td');
                    email.textContent = selectedUser['user_info']['email'];
                    row.appendChild(email);

                    const phone_number = document.createElement('td');
                    phone_number.textContent = selectedUser['phone_number'];
                    row.appendChild(phone_number);

                    var check = document.getElementById('check');
                    check.innerHTML = "";

                    const photoPaths = selectedUser['user_info']['idPhotoPath'].split(';');
                    
                    const photo_path = document.createElement('div');
                    const first_photo = document.createElement('input');
                    first_photo.type = 'submit';
                    first_photo.value = 'Первое Фото';
                    first_photo.id = 'first_photo'
                    first_photo.addEventListener('click', () => fetchPhoto(photoPaths[0]));
                    
                    const second_photo = document.createElement('input');
                    second_photo.type = 'submit';
                    second_photo.value = 'Второе Фото';
                    second_photo.id = 'second_photo'
                    second_photo.addEventListener('click', () => fetchPhoto(photoPaths[1]));
                    
                    const third_photo = document.createElement('input');
                    third_photo.type = 'submit';
                    third_photo.value = 'Третье Фото';
                    third_photo.id = 'third_photo'
                    third_photo.addEventListener('click', () => fetchPhoto(photoPaths[2]));
                    
                    photo_path.appendChild(first_photo);
                    photo_path.appendChild(second_photo);
                    photo_path.appendChild(third_photo);

                    check.appendChild(photo_path)

                    user_check.appendChild(row);
                });
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    function get_cookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function fetchPhoto(photoPath) {
        const token = get_cookie('token');
        const url = `http://10.251.4.131/api/telecom_app/uploads?filename=${encodeURIComponent(photoPath)}`;
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при запросе фото');
            }
            return response.blob();
        })
        .then(blob => {
            const photoUrl = URL.createObjectURL(blob);
            window.open(photoUrl);
        })
        .catch(error => {
            console.error('Ошибка загрузки фото:', error);
        });
    }
