# App

MyCashly - Financial Controll App

# RFs (Requisitos funcionais) - Funcionalidades da aplicação
- [ ] Deve ser possível X/
- [X] Deve ser possível cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível obter um perfíl de um usuário logado;
- [ ] Deve ser possível editar um usuário;
- [ ] Deve ser possível excluir um usuário;
- [ ] Deve ser possível obter as transações do usuário por id;
- [ ] Deve ser possível obter o número total de transações, entradas, saídas, investimento e o balança entre elas.;
- [ ] Deve ser possível obter o número total de despesas de cada mês;
- [ ] Deve ser possível obter os top 10 principais gastos do usuário;

# RNs (Regras de negócios) - Regras das funcionalidades
- [X] O usuário não deve se cadastrar com email duplicado;

# RFNs (Requisitos não-funcionais) - Requisitos técnicos que não dependem do cliente
- [X] A senha do usuário precisa estar criptografada;
- [ ] Os dados da aplicação precisam estar persistidos em um banco PostgresSQL;
- [ ] Todas lsitas de dados precisam estar paginadas com 20 intens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON web Token);
