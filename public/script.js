let idToken = null;

function handleCredentialResponse(response) {
  idToken = response.credential;
  document.getElementById('login-status').innerText = 'Autenticado com sucesso com o Google!';
}

document.getElementById('drawing-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const numeroInput = document.getElementById('numero').value;
  const numero = parseInt(numeroInput, 10);
  const errorContainer = document.getElementById('error-message');
  const svgContainer = document.getElementById('svg-container');

  errorContainer.innerText = '';
  svgContainer.innerHTML = '';

  if (!idToken) {
    errorContainer.innerText = 'Por favor, faça login com o Google primeiro.';
    return;
  }

  try {
    const res = await fetch('/api/desenho', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ numero })
    });

    if (res.status === 400 || res.status === 401) {
      errorContainer.innerText = `Erro na requisição (Código ${res.status}). Verifique os dados ou o login.`;
      return;
    }

    if (!res.ok) {
      errorContainer.innerText = 'Ocorreu um erro inesperado no servidor.';
      return;
    }

    const svgText = await res.text();
    svgContainer.innerHTML = svgText;

  } catch (err) {
    errorContainer.innerText = 'Erro de rede ao comunicar com o servidor.';
  }
});
