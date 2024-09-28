document.getElementById('recommend-btn').addEventListener('click', function() {
  const userInput = document.getElementById('user-input').value;

  // 로딩 메시지 표시
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '책을 추천하고 있습니다...';

  fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_OPENAI_API_KEY' // 여기서 YOUR_OPENAI_API_KEY를 실제 키로 대체하세요
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: `다음 고민에 어울리는 책을 추천해줘:\n\n고민: ${userInput}\n\n추천 책:`,
      max_tokens: 150,
      temperature: 0.7
    })
  })
  .then(response => response.json())
  .then(data => {
    const recommendation = data.choices[0].text.trim();
    resultDiv.innerHTML = `<p>${recommendation}</p>`;
  })
  .catch(error => {
    console.error('Error:', error);
    resultDiv.innerHTML = '문제가 발생했습니다. 다시 시도해주세요.';
  });
});
