import { gerarDesenho } from '../../lib/desenho.js';

export async function onRequest(context) {
  const { request, env } = context;

  // 1. Verificação do Método: Apenas POST (405)
  if (request.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    // 2. Corpo ausente ou JSON inválido (400)
    return new Response(JSON.stringify({ error: 'JSON inválido' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  const { numero } = body;
  if (numero === undefined || !Number.isInteger(numero) || numero < 1 || numero > 100) {
    return new Response(JSON.stringify({ error: 'Número inválido' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  // 3. Verificação do Token: Header Authorization obrigatório (401)
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Token ausente' }), { 
      status: 401, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    if (!googleRes.ok) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const data = await googleRes.json();

    if (data.aud !== env.GOOGLE_CLIENT_ID || (data.email_verified !== 'true' && data.email_verified !== true)) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const email = data.email;
    const svgContent = gerarDesenho(numero, email);

    return new Response(svgContent, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro de validação' }), { 
      status: 401, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
