document.getElementById('recommend-btn').addEventListener('click', function() {
  const userInput = document.getElementById('user-input').value;

  // 로딩 메시지 표시
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '책을 추천하고 있습니다...';

  fetch('/.netlify/functions/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'user_input': userInput })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      resultDiv.innerHTML = `오류가 발생했습니다: ${data.error}`;
    } else {
      resultDiv.innerHTML = `<p>${data.recommendation}</p>`;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    resultDiv.innerHTML = '문제가 발생했습니다. 다시 시도해주세요.';
  });
});
