document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('recommend-btn').addEventListener('click', showRecommendedBook);
});

async function showRecommendedBook() {
  const userInput = document.getElementById('user-input').value;
  const resultDiv = document.querySelector('.result');
  const loadingDiv = document.querySelector('.loading');

  // 로딩 메시지 표시
  loadingDiv.style.display = 'block';
  resultDiv.style.display = 'none';

  try {
    // Netlify 함수를 호출해 책 추천 받기
    const response = await fetch('/.netlify/functions/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userInput })
    });

    const bookData = await response.json();

    resultDiv.innerHTML = `
      <img src="${bookData.image}" alt="${bookData.title}" class="book-cover" />
      <h2>${bookData.title}</h2>
      <p>저자: ${bookData.author}</p>
      <p>${bookData.description}</p>
      <a href="${bookData.link}" class="book-link" target="_blank">책 구매하기</a>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p>오류가 발생했습니다: ${error.message}</p>`;
  }

  // 로딩 숨기고 결과 표시
  loadingDiv.style.display = 'none';
  resultDiv.style.display = 'block';
}
