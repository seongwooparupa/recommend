// Netlify 환경 변수로 API 키를 불러옴
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// OpenAI API를 사용하여 고민에 맞는 키워드 생성
async function recommendBook(userInput) {
  // OpenAI API 호출
  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that recommends books based on user concerns.' },
        { role: 'user', content: `사용자가 이런 고민을 하고 있습니다: ${userInput}. 이 고민을 해결할 수 있는 책을 추천하기 위해 적절한 키워드를 추천해 주세요.` }
      ]
    })
  });

  // OpenAI API 응답에서 키워드 추출
  const openAIResult = await openAIResponse.json();
  const keyword = openAIResult.choices[0].message.content.trim();

  // 네이버 도서 API 호출
  const response = await fetch(`https://openapi.naver.com/v1/search/book.json?query=${keyword}`, {
    method: 'GET',
    headers: {
      'X-Naver-Client-Id': NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
    }
  });

  const data = await response.json();

  // 첫 번째 책 데이터를 반환
  if (data.items && data.items.length > 0) {
    const book = data.items[0];  // 첫 번째 책 정보 선택

    return {
      title: book.title,
      author: book.author,
      description: book.description,
      image: book.image,
      link: book.link
    };
  } else {
    throw new Error('책을 찾을 수 없습니다.');
  }
}

// 책 추천 결과를 화면에 표시
async function showRecommendedBook() {
  const userInput = document.getElementById('user-input').value;
  const resultDiv = document.querySelector('.result');
  const loadingDiv = document.querySelector('.loading');

  // 로딩 메시지 표시
  loadingDiv.style.display = 'block';
  resultDiv.style.display = 'none';

  try {
    const bookData = await recommendBook(userInput);

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
