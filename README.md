# Cypress Automation with Mochawesome Reports

Este projeto utiliza **Cypress** para testes end-to-end automatizados e gera relatórios com o plugin **cypress-mochawesome-reporter**.

---

## Estrutura

- **Cypress**: testes automatizados em um sistema pessoal
- **Relatórios**: JSON gerado em `cypress/reports/json` e relatório HTML combinado (merge) gerado no mesmo diretório.
- **CI/CD**: GitHub Actions executa os testes, gera relatórios e publica via GitHub Pages.
- **Link Relatório**: 
---

## Como usar

### 1. Executar localmente

```bash
npm install
npx cypress open     # para rodar testes em modo interativo
npx cypress run      # para rodar testes em modo headless
```

Os relatórios JSON serão gerados em `cypress/reports/json`.

### 2. Relatórios

Após rodar os testes, execute (localmente ou via CI) o comando para mesclar e gerar o relatório HTML:

```bash
npx mochawesome-merge "cypress/reports/json/*.json" > cypress/reports/json/report.json
npx marge cypress/reports/json/report.json --reportDir cypress/reports/json --overwrite
```

O arquivo `index.html` gerado estará em `cypress/reports/json/index.html`.


## Observações


---

## Dependências principais

- Cypress
- cypress-mochawesome-reporter
- mochawesome-merge
- mochawesome-report-generator

---
