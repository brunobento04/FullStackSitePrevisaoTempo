# FullStackSitePrevisaoTempo

//////////////////////////////////// --- ////////////////////////////////////////////////////////////
Tecnologias utilizadas:
GitHub - Para versionamento
Angular - FrontEnd
Bootstrap - FrontEnd
.NET 8.0 - BackEnd
SQL Server - Banco de dados

//////////////////////////////////// --- ////////////////////////////////////////////////////////////
Necessidades da Aplicação:

# Funcionalidades WEB

- **Busca Climática:**
    - Desenvolva uma interface em **Angular** que permita:
        - Buscar previsões do tempo por cidade.
        - Exibir os seguintes dados:
            - Temperatura atual.
            - Condições climáticas (com ícones representativos).
            - Temperatura máxima e mínima.
            - Umidade.
    - Utilize a API Backend do desafio para obter as informações.
- **Tela de Favoritos:**
    - Permita que o usuário:
        - Adicione cidades aos favoritos.
        - Remova cidades dos favoritos.
        - Visualize uma lista de cidades favoritas.
        - Destaque uma cidade favorita, alterando seu tamanho, posição ou cor.
- **Previsões Climáticas (5 dias):**
    - Exiba a previsão climática diária para os próximos 5 dias com:
        - Temperatura máxima e mínima.
        - Ícones que representem as condições climáticas.
- **Gerenciamento de Estado e Persistência:**
    - Utilize o **BehaviorSubject** do RxJS ou NgRx para gerenciar o estado da aplicação.
    - Armazene as cidades favoritas no **LocalStorage** para garantir persistência de dados.
- **Ajustes Responsivos:**
    - Garanta que a interface funcione bem em dispositivos desktop e móveis:
        - Teste a aplicação em diferentes resoluções.

### Entregáveis:

- Aplicação funcional em Angular.
- Código organizado e bem documentado.
- Tela inicial com busca, tela de favoritos e previsões.

//////////////////////////////////// --- ////////////////////////////////////////////////////////////
Necessidades da Aplicação:

# Funcionalidades Backend

> Essas serão as funcionalidades que devem ser implementadas.
> 
- **API REST:**
    - Desenvolva uma API REST usando `  ou superior`.
    - Endpoints:
        - Buscar previsão do tempo por cidade (integrado à API **OpenWeatherMap**/WeatherAPI).
        - Adicionar cidade aos favoritos.
        - Listar cidades favoritas.
        - Remover cidade dos favoritos.
        - Buscar previsão para os próximos 5 dias.
- **Banco de Dados:**
    - Utilize SQL Server para armazenar cidades favoritas.
    - Modelagem:
        - Tabela `CidadesFavoritas` com `Id`, `Nome`, `UsuarioId`.
        - (Opcional) Relacione com uma tabela `Usuarios` para autenticação.
- **Autenticação (Bônus):**
    - Implemente JWT para autenticação de usuários.
    - Restrinja acesso aos endpoints de favoritos para usuários autenticados.
- **Boas Práticas:**
    - Use Entity Framework, Dapper para acesso ao banco.
    - Garanta validações e tratamento de erros.

### Entregáveis:

- API-REST funcional em .NET.
- Código organizado e bem documentado.
- Funcionalidades de busca, favoritos e previsões em 5 dias.
