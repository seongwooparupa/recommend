document.getElementById('recommend-btn').addEventListener('click', showRecommendedBook);

async function recommendBook(userInput) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

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

  const openAIResult = await openAIResponse.json();
  const keyword = openAIResult.choices[0].message.content.trim();

  const response = await fetch(`https://openapi.naver.com/v1/search/book.json?query=${keyword}`, {
    method: 'GET',
    headers: {
      'X-Naver-Client-Id': NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
    }
  });

  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const book = data.items[0];

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

async function showRecommendedBook() {
  const userInput = document.getElementById('user-input').value;
  const resultDiv = document.querySelector('.result');
  const loadingDiv = document.querySelector('.loading');

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

  loadingDiv.style.display = 'none';
  resultDiv.style.display = 'block';
}
