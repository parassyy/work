function fetchMessages() {
    fetch('/chat/api/messages/')
      .then(response => response.json())
      .then(data => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';
        data.forEach(msg => {
            const div = document.createElement('div');
            div.className = 'message';
            div.innerHTML = `<b>${msg.user}:</b> <span class="msg-content">${msg.content}</span>
                <span class="copy-btn" onclick="copyMessage(this)">Copy</span>
                ${msg.user === window.currentUser ? `<span class="delete-btn" onclick="deleteMessage(${msg.id})">Delete</span>` : ''}
                <span style="float:right;font-size:0.75em;">${msg.timestamp}</span>`;
            messagesDiv.appendChild(div);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      });
}

function deleteMessage(msgId) {
    fetch(`/chat/api/messages/delete/${msgId}/`, {method: 'POST', headers: {'X-CSRFToken': getCookie('csrftoken')}})
      .then(res => res.json())
      .then(() => fetchMessages());
}

function copyMessage(elem) {
    const msg = elem.parentElement.querySelector('.msg-content').innerText;
    navigator.clipboard.writeText(msg);
    alert('Message copied!');
}

document.getElementById('chat-form').onsubmit = function(e) {
    e.preventDefault();
    const content = document.getElementById('message-input').value;
    fetch('/chat/api/messages/new/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken')},
      body: JSON.stringify({content})
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById('message-input').value = '';
        fetchMessages();
    });
};

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

window.onload = function() {
    // Set currentUser from Django template context
    window.currentUser = "{{ request.user.username }}";
    fetchMessages();
    setInterval(fetchMessages, 2000);
};