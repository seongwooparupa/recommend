async function recommendBook(userInput) {
  // 1. OpenAI API로 고민 분석 및 키워드 생성
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
  const keyword = openAIResult.choices[0].message.content.trim();  // OpenAI로부터 생성된 키워드 추출

  // 2. 알라딘 도서 API로 생성된 키워드를 사용해 책 검색
  const ttbKey = 'YOUR_ALADIN_API_KEY';  // 발급받은 알라딘 API 키를 사용
  const response = await fetch(`https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${keyword}&MaxResults=10&start=1&SearchTarget=Book&output=JS`, {
    method: 'GET'
  });

  const data = await response.json();

  // 3. 첫 번째 책 데이터를 반환 (또는 원하는 조건에 맞는 책을 선택)
  if (data.item && data.item.length > 0) {
    const book = data.item[0];  // 첫 번째 책 정보 선택

    return {
      title: book.title,
      author: book.author,
      description: book.description,
      image: book.cover,
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
