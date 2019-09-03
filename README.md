# boleto-utils
Biblioteca com funções úteis para a validação de todos os tipos de boleto

É a minha primeira publicação no NPM, portanto sintam-se à vontade para colaborar, adicionando e/ou modificando qualquer funcionalidade da lib!

### Índice
#### 1. Instalação
#### 2. Funções
#### 3. Exemplos de uso
#### 4. Regras de numeração dos boletos
---------------------------------------------------------
### 1. Instalação

Para utilizar o boleto-utils, baixe-o pelo repositório npm através do comando: `npm install --save @mrmgomes/boleto-utils`.
Depois importe-o em seu projeto javascript através do `require` (ES5) ou `import` (ES6) e já pode utilizar as funções da biblioteca.

---------------------------------------------------------
### 2. Funções

Função | Definição
--- | ---
`identificarTipoCodigo(codigo: string)` | Verifica a numeração e retorna o tipo do código inserido. CODIGO_DE_BARRAS ou LINHA_DIGITAVEL. Requer numeração completa (com ou sem formatação).
`identificarTipoBoleto(codigo: string)` | Verifica a numeração e retorna o tipo do boleto inserido. Se boleto bancário, convênio ou arrecadação. Requer numeração completa (com ou sem formatação).
`identificarReferencia(codigo: string)` | Valida o terceiro campo da numeração inserida para definir como será calculado o Dígito Verificador. Requer numeração completa (com ou sem formatação).
`identificarData(codigo: string, tipoCodigo: string)` | Verifica a numeração, o tipo de código inserido e o tipo de boleto e retorna a data de vencimento. Requer numeração completa (com ou sem formatação) e tipo de código que está sendo inserido (CODIGO_DE_BARRAS ou LINHA_DIGITAVEL).
`identificarValor(codigo: string, tipoCodigo: string)` | Verifica a numeração, o tipo de código inserido e o tipo de boleto e retorna o valor do título. Requer numeração completa (com ou sem formatação) e tipo de código que está sendo inserido (CODIGO_DE_BARRAS ou LINHA_DIGITAVEL).
`digitosVerificadores(codigo: string, mod: int)` | Verifica a numeração e o módulo a ser utilizado (Mod 10 ou Mod 11) e retorna o DV (Dígito Verificador). Requer numeração completa (com ou sem formatação) e caracteres numéricos que representam o módulo a ser usado (valores aceitos: 10 ou 11).
`codBarras2LinhaDigitavel(codigo: string, formatada: boolean)` | Transforma a numeração no formato de código de barras em linha digitável. Requer numeração completa (com ou sem formatação) e valor `true` ou `false` que representam a forma em que o código convertido será exibido. Com (true) ou sem (false) formatação.
`linhaDigitavel2CodBarras(codigo: string)` | Transforma a numeração no formato linha digitável em código de barras. Requer numeração completa (com ou sem formatação).
`calculaDVCodBarras(codigo: string, posicaoCodigo: int, mod: int)` | Verifica a numeração do código de barras, extrai o DV (dígito verificador) presente na posição indicada, realiza o cálculo do dígito utilizando o módulo indicado e retorna o dígito verificador. Serve para validar o código de barras. Requer numeração completa (com ou sem formatação), caracteres numéricos que representam a posição do dígito verificador no código de barras e caracteres numéricos que representam o módulo a ser usado (valores aceitos: 10 ou 11).
`calculaMod10(numero: string)` | Realiza o cálculo Módulo 10 do número inserido.
`calculaMod11(numero: string)` | Realiza o cálculo Módulo 11 do número inserido.
`validarBoleto(codigo: string)` | Verifica a numeração e utiliza várias das funções acima para retornar um objeto JSON contendo informações sobre a numeração inserida: `Tipo de código inserido`, `Tipo de boleto inserido`, `Código de barras`, `Linha digitável`, `Vencimento` e `Valor`

---------------------------------------------------------
### 3. Exemplos de uso
A princípio, a função `validarBoleto(codigo: string)` é a única que poderia ser utilizada para validar e trazer informações de um código de barras/linha digitável, portanto mostrarei apenas este exemplo. As demais funções estão documentadas acima e são autoexplicativas.

Exemplo #1: 
```javascript
validarBoleto('23790448095616862379336011058009740430000124020');
```
Retorno #1: 
```json
{
    "sucesso": true,
    "mensagem": "Boleto validado com sucesso",
    "tipoCodigoInput": "LINHA_DIGITAVEL",
    "tipoBoleto": "BANCO",
    "codigoBarras": "23799336051105800974404300001247044809561686237",
    "linhaDigitavel": "23790448095616862379336011058009740430000124020",
    "vencimento": "2008-11-01T23:54:59.923Z",
    "valor": 1240.2
}
```
Exemplo #2: 
```javascript
validarBoleto('34196790600001000002220000005566385101214000');
```
Retorno #2: 
```json
{
    "sucesso": true,
    "mensagem": "Boleto validado com sucesso",
    "tipoCodigoInput": "CODIGO_DE_BARRAS",
    "tipoBoleto": "BANCO",
    "codigoBarras": "34196790600001000002220000005566385101214000",
    "linhaDigitavel": "34192220090000556638551012140003679060000100000",
    "vencimento": "2019-05-31T23:54:59.373Z",
    "valor": 1000
}
```
---------------------------------------------------------
### 4. Regras de numeração dos boletos

### 4.1 __`BOLETO COBRANÇA`__
**IMPORTANTE**: As posições aqui mencionadas partem do número 0 e não do 1, a fim de facilitar o entendimento lógico

#### 4.1.1 __TIPO:__ CÓDIGO DE BARRAS (44 POSIÇÕES NUMÉRICAS)

##### __EXEMPLO:__ 11123444455555555556666666666666666666666666

Bloco | Posições | Definição
--- | --- | ---
__1__ | **0 a 2**  | `Código do Banco na Câmara de Compensação`
__2__ | **3 a 3**  | `Código da Moeda = 9 (Real)`
__3__ | **4 a 4**  | `Digito Verificador (DV) do código de Barras`
__4__ | **5 a 8**  | `Fator de Vencimento`
__5__ | **9 a 18**  | `Valor com 2 casas de centavos`
__6__ | **19 a 43**  | `Campo Livre (De uso da instituição bancária)`

#### 4.1.2 __TIPO:__ LINHA DIGITÁVEL (47 POSIÇÕES NUMÉRICAS)

##### __EXEMPLO__: AAABC.CCCCX DDDDD.DDDDDY EEEEE.EEEEEZ K UUUUVVVVVVVVVV

Campo | Posições linha dig. | Definição
--- | --- | ---
__A__ | **0 a 2** (0 a 2 do cód. barras)  | `Código do Banco na Câmara de compensação`
__B__ | **3 a 3** (3 a 3 do cód. barras)  | `Código da moeda`
__C__ | **4 a 8** (19 a 23 do cód. barras)  | `Campo Livre`
__X__ | **9 a 9**  | `Dígito verificador do Bloco 1 (Módulo 10)`
__D__ | **10 a 19** (24 a 33 do cód. barras)  | `Campo Livre`
__Y__ | **20 a 20**  | `Dígito verificador do Bloco 2 (Módulo 10)`
__E__ | **21 a 30** (24 a 43 do cód. barras)  | `Campo Livre`
__Z__ | **31 a 31**  | `Dígito verificador do Bloco 3 (Módulo 10)`
__K__ | **32 a 32** (4 a 4 do cód. barras)  | `Dígito verificador do código de barras`
__U__ | **33 a 36** (5 a 8 do cód. barras)  | `Fator de Vencimento`
__V__ | **37 a 43** (9 a 18 do cód. barras)  | `Valor`

### 4.2 __`CONTA CONVÊNIO / ARRECADAÇÃO`__

#### 4.2.1 __TIPO:__ CÓDIGO DE BARRAS (44 POSIÇÕES NUMÉRICAS)

##### __EXEMPLO__: 12345555555555566667777777777777777777777777

Campo | Posições | Definição
--- | --- | ---
__1__ | **0 a 0**  | `"8" Identificação da Arrecadação/convênio`
__2__ | **1 a 1**  | `Identificação do segmento`
__3__ | **2 a 2**  | `Identificação do valor real ou referência`
__4__ | **3 a 3**  | `Dígito verificador geral (módulo 10 ou 11)`
__5__ | **4 a 14**  | `Valor efetivo ou valor referência`
__6__ | **15 a 18**  | `Identificação da empresa/órgão`
__7__ | **19 a 43**  | `Campo livre de utilização da empresa/órgão`

#### 4.2.2 __TIPO:__ LINHA DIGITÁVEL (48 POSIÇÕES NUMÉRICAS)

##### __EXEMPLO__: ABCDEEEEEEE-W EEEEFFFFGGG-X GGGGGGGGGGG-Y GGGGGGGGGGG-Z

Campo | Posições | Definição
--- | --- | ---
__A__ | **0 a 0**  | `"8" Identificação da Arrecadação/convênio`
__B__ | **1 a 1**  | `Identificação do segmento`
__C__ | **2 a 2**  | `Identificação do valor real ou referência`
__D__ | **3 a 3**  | `Dígito verificador geral (módulo 10 ou 11)`
__E__ | **4 a 14**  | `Valor efetivo ou valor referência`
__W__ | **11 a 11**  | `Dígito verificador do Bloco 1`
__F__ | **15 a 18**  | `Identificação da empresa/órgão`
__G__ | **19 a 43**  | `Campo livre de utilização da empresa/órgão`
__X__ | **23 a 23**  | `Dígito verificador do Bloco 2`
__Y__ | **35 a 35**  | `Dígito verificador do Bloco 3`
__Z__ | **47 a 47**  | `Dígito verificador do Bloco 4`
