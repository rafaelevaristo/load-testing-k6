import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 20 }, // Sobe para 20 utilizadores
    { duration: '10s', target: 20 },  // Mantém
    { duration: '5s', target: 0 },  // Desce
  ],
};

export default function () {
  // 1. Testar a página principal da Oficina (Workshop)
  let resWorkshop = http.get('http://crapi-workshop:8000/workshop/health_check/');
  check(resWorkshop, {
    'workshop status is 200': (r) => r.status === 200,
  });

  // 2. Tentar um Login (Endpoint de Identidade)
  // Nota: Isto vai dar erro 401 porque não temos user criado, 
  // o que é ótimo para ver erros no Grafana!
  let loginData = JSON.stringify({ email: 'user@example.com', password: '123' });
  let params = { headers: { 'Content-Type': 'application/json' } };
  
  let resLogin = http.post('http://crapi-identity:8080/identity/api/auth/login', loginData, params);
  check(resLogin, {
    'login attempted': (r) => r.status !== 0,
  });

  sleep(1);
}