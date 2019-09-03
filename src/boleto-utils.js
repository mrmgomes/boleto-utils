exports.identificarTipoCodigo = (codigo) => {
    codigo = codigo.replace(/[^0-9]/g, '');

    if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!');

    if (codigo.length == 44) {
        return 'CODIGO_DE_BARRAS'
    } else if (codigo.length == 46 || codigo.length == 47 || codigo.length == 48) {
        return 'LINHA_DIGITAVEL'
    } else {
        return 'TAMANHO_INCORRETO';
    }
}

exports.identificarTipoBoleto = (codigo) => {
    codigo = codigo.replace(/[^0-9]/g, '');

    if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!');

    if (codigo.substr(0, 1) == '8') {
        if (codigo.substr(1, 1) == '1') {
            return 'ARRECADACAO_PREFEITURA';
        } else if (codigo.substr(1, 1) == '2') {
            return 'CONVENIO_SANEAMENTO';
        } else if (codigo.substr(1, 1) == '3') {
            return 'CONVENIO_ENERGIA_ELETRICA_E_GAS';
        } else if (codigo.substr(1, 1) == '4') {
            return 'CONVENIO_TELECOMUNICACOES';
        } else if (codigo.substr(1, 1) == '5') {
            return 'ARRECADACAO_ORGAOS_GOVERNAMENTAIS';
        } else if (codigo.substr(1, 1) == '6' || codigo.substr(1, 1) == '9') {
            return 'OUTROS';
        } else if (codigo.substr(1, 1) == '7') {
            return 'ARRECADACAO_TAXAS_DE_TRANSITO';
        }
    } else {
        return 'BANCO';
    }
}

exports.identificarReferencia = (codigo) => {
    codigo = codigo.replace(/[^0-9]/g, '');

    const referencia = codigo.substr(2, 1);

    if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!');

    switch (referencia) {
        case '6':
            return {
                mod: 10,
                    efetivo: true
            };
            break;
        case '7':
            return {
                mod: 10,
                    efetivo: false
            };
            break;
        case '8':
            return {
                mod: 11,
                    efetivo: true
            };
            break;
        case '9':
            return {
                mod: 11,
                    efetivo: false
            };
            break;
        default:
            break;
    }
}

exports.identificarData = (codigo, tipoCodigo) => {
    codigo = codigo.replace(/[^0-9]/g, '');
    const tipoBoleto = this.identificarTipoBoleto(codigo);

    let fatorData = '';
    let dataBoleto = new Date();

    if (tipoCodigo === 'CODIGO_DE_BARRAS') {
        if (tipoBoleto == 'BANCO') {
            fatorData = codigo.substr(5, 4)
            dataBoleto.setFullYear(1997);
            dataBoleto.setMonth(9);
            dataBoleto.setDate(7);
            dataBoleto.setHours(23, 54, 59);
            dataBoleto.setDate(dataBoleto.getDate() + Number(fatorData));
            dataBoleto.setTime(dataBoleto.getTime() + dataBoleto.getTimezoneOffset() - (3) * 60 * 60 * 1000);
        } else {
            dataBoleto.setFullYear(parseInt(codigo.substr(19, 4)));
            dataBoleto.setMonth(parseInt(codigo.substr(23, 2) - 1));
            dataBoleto.setDate(parseInt(codigo.substr(25, 2)));
            dataBoleto.setHours(23, 54, 59);
            dataBoleto.setTime(dataBoleto.getTime() + dataBoleto.getTimezoneOffset() - (3) * 60 * 60 * 1000);
        }
    } else if (tipoCodigo === 'LINHA_DIGITAVEL') {
        if (tipoBoleto == 'BANCO') {
            fatorData = codigo.substr(33, 4)
            dataBoleto.setFullYear(1997);
            dataBoleto.setMonth(9);
            dataBoleto.setDate(7);
            dataBoleto.setHours(23, 54, 59);
            dataBoleto.setDate(dataBoleto.getDate() + Number(fatorData));
            dataBoleto.setTime(dataBoleto.getTime() + dataBoleto.getTimezoneOffset() - (3) * 60 * 60 * 1000);
        } else {
            dataBoleto.setFullYear(parseInt(codigo.substr(20, 3) + codigo.substr(24, 1)));
            dataBoleto.setMonth(parseInt(codigo.substr(25, 2) - 1));
            dataBoleto.setDate(parseInt(codigo.substr(27, 2)));
            dataBoleto.setHours(23, 54, 59);
            dataBoleto.setTime(dataBoleto.getTime() + dataBoleto.getTimezoneOffset() - (3) * 60 * 60 * 1000);
        }
    }


    return dataBoleto;
}

exports.identificarValor = (codigo, tipoCodigo) => {
    codigo = codigo.replace(/[^0-9]/g, '');

    const tipoBoleto = this.identificarTipoBoleto(codigo);

    let valorBoleto = '';
    let valorFinal;

    switch (tipoCodigo) {
        case 'CODIGO_DE_BARRAS':
            if (tipoBoleto == 'BANCO') {
                valorBoleto = codigo.substr(9, 10);
            } else {
                valorBoleto = codigo.substr(4, 14);
            }
            break;
        case 'LINHA_DIGITAVEL':
            if (tipoBoleto == 'BANCO') {
                valorBoleto = codigo.substr(37);
            } else {
                valorBoleto = codigo.substr(4, 7) + codigo.substr(12, 4);
            }
            break;
        default:
            valorBoleto = 'Valor do boleto não informado';
            break;
    }

    valorFinal = valorBoleto.substr(0, 8) + '.' + valorBoleto.substr(8, 2); // TODO: !!!!!
    let char = valorFinal.substr(1, 1);
    while (char === '0') {
        valorFinal = substringReplace(valorFinal, '', 0, 1);
        char = valorFinal.substr(1, 1);
    }

    const valorFloat = parseFloat(valorFinal);
    return valorFloat;
}

exports.digitosVerificadores = (codigo, mod) => {
    codigo = codigo.replace(/[^0-9]/g, '');
    switch (mod) {
        case 10:
            return (codigo + this.calculaMod10(codigo)).toString();
            break;
        case 11:
            return (codigo + this.calculaMod11(codigo)).toString();
            break;
        default:
            break;
    }
}

exports.codBarras2LinhaDigitavel = (codigo, formatada) => {
    codigo = codigo.replace(/[^0-9]/g, '');

    const tipoBoleto = this.identificarTipoBoleto(codigo);

    let resultado = '';

    if (tipoBoleto == 'BANCO') {
        const novaLinha = codigo.substr(0, 4) + codigo.substr(19, 25) + codigo.substr(4, 1) + codigo.substr(5, 14);

        const bloco1 = novaLinha.substr(0, 9) + this.calculaMod10(novaLinha.substr(0, 9));
        const bloco2 = novaLinha.substr(9, 10) + this.calculaMod10(novaLinha.substr(9, 10));
        const bloco3 = novaLinha.substr(19, 10) + this.calculaMod10(novaLinha.substr(19, 10));
        const bloco4 = novaLinha.substr(29);

        resultado = (bloco1 + bloco2 + bloco3 + bloco4).toString();

        if (formatada) {
            resultado =
                resultado.slice(0, 5) +
                '.' +
                resultado.slice(5, 10) +
                ' ' +
                resultado.slice(10, 15) +
                '.' +
                resultado.slice(15, 21) +
                ' ' +
                resultado.slice(21, 26) +
                '.' +
                resultado.slice(26, 32) +
                ' ' +
                resultado.slice(32, 33) +
                ' ' +
                resultado.slice(33);
        }
    } else {
        const identificacaoValorRealOuReferencia = this.identificarReferencia(codigo);
        let bloco1;
        let bloco2;
        let bloco3;
        let bloco4;

        if (identificacaoValorRealOuReferencia.mod == 10) {
            bloco1 = codigo.substr(0, 11) + this.calculaMod10(codigo.substr(0, 3) + codigo.substr(5, 7));
            bloco2 = codigo.substr(11, 11) + this.calculaMod10(codigo.substr(11, 11));
            bloco3 = codigo.substr(22, 11) + this.calculaMod10(codigo.substr(22, 11));
            bloco4 = codigo.substr(33, 11) + this.calculaMod10(codigo.substr(33, 11));
        } else if (identificacaoValorRealOuReferencia.mod == 11) {
            bloco1 = codigo.substr(0, 11) + this.calculaMod11(codigo.substr(0, 3) + codigo.substr(5, 7));
            bloco2 = codigo.substr(11, 11) + this.calculaMod11(codigo.substr(11, 11));
            bloco3 = codigo.substr(22, 11) + this.calculaMod11(codigo.substr(22, 11));
            bloco4 = codigo.substr(33, 11) + this.calculaMod11(codigo.substr(33, 11));
        }

        resultado = bloco1 + bloco2 + bloco3 + bloco4;
    }

    return resultado;
}

exports.linhaDigitavel2CodBarras = (codigo, formatada) => {
    codigo = codigo.replace(/[^0-9]/g, '');

    let resultado = codigo.substr(0, 4) +
        codigo.substr(32, 1) +
        codigo.substr(33, 14) +
        codigo.substr(4, 5) +
        codigo.substr(10, 10) +
        codigo.substr(21, 10);

    return resultado;
}

exports.calculaDVCodBarras = (codigo, posicaoCodigo, mod) => {
    codigo = codigo.replace(/[^0-9]/g, '');

    codigo = codigo.split('');
    codigo.splice(posicaoCodigo, 1);
    codigo = codigo.join('');

    if (mod == 10) {
        return this.calculaMod10(codigo);
    } else if (mod == 11) {
        return this.calculaMod11(codigo);
    }
}

// exports.calculaDVLinhaDigitavel = (codigo) => {
//     codigo = codigo.replace(/[^0-9]/g, '');

//     codigo = codigo.split('');
//     codigo.splice(4, 1);
//     codigo = codigo.join('');
//     // let novoCodigo = this.linhaDigitavel2CodBarras(codigo, false);
//     // novoCodigo = novoCodigo.split('');
//     // novoCodigo.splice(4, 1);
//     // novoCodigo = novoCodigo.join('');

//     // let dv = this.calculaMod11(novoCodigo);
//     // novoCodigo = novoCodigo.substr(0, 4) + dv + novoCodigo.substr(4);
//     // return novoCodigo;
//     return this.calculaMod11(codigo);
// }

// exports.montarCodBarrasComDV = (codigo, posicaoCodigo, mod) => {
//     codigo = codigo.replace(/[^0-9]/g, '');

//     codigo = codigo.split('');
//     codigo.splice(posicaoCodigo, 1);
//     codigo = codigo.join('');

//     const dv = this.calculaDVCodBarras(codigo, posicaoCodigo, mod);

//     return novoCodigo.substr(0, 4) + dv + novoCodigo.substr(4);
// }

/**
 * ## __`BOLETO COBRANÇA`__
 * ### __AS POSIÇÕES AQUI MENCIONADAS PARTEM DO NÚMERO 0 E NÃO DO 1, A FIM DE FACILITAR O ENTENDIMENTO LÓGICO__
 * ---------------------------------------------------------
 * 
 * ### __TIPO:__ CÓDIGO DE BARRAS (44 POSIÇÕES NUMÉRICAS)
 * 
 * ---------------------------------------------------------
 * 
 * #### __EXEMPLO:__ 11123444455555555556666666666666666666666666
 * 
 * Bloco | Posições | Definição
 * --- | --- | ---
 * __1__ | **0 a 2**  | `Código do Banco na Câmara de Compensação`
 * __2__ | **3 a 3**  | `Código da Moeda = 9 (Real)`
 * __3__ | **4 a 4**  | `Digito Verificador (DV) do código de Barras`
 * __4__ | **5 a 8**  | `Fator de Vencimento`
 * __5__ | **9 a 18**  | `Valor com 2 casas de centavos`
 * __6__ | **19 a 43**  | `Campo Livre (De uso da instituição bancária)`
 * 
 * ---------------------------------------------------------
 * 
 * ### __TIPO:__ LINHA DIGITÁVEL (47 POSIÇÕES NUMÉRICAS)
 * 
 * ---------------------------------------------------------
 * 
 * #### __EXEMPLO__: AAABC.CCCCX DDDDD.DDDDDY EEEEE.EEEEEZ K UUUUVVVVVVVVVV
 * 
 * Campo | Posições linha dig. | Definição
 * --- | --- | ---
 * __A__ | **0 a 2** (0 a 2 do cód. barras)  | `Código do Banco na Câmara de compensação`
 * __B__ | **3 a 3** (3 a 3 do cód. barras)  | `Código da moeda`
 * __C__ | **4 a 8** (19 a 23 do cód. barras)  | `Campo Livre`
 * __X__ | **9 a 9**  | `Dígito verificador do Bloco 1 (Módulo 10)`
 * __D__ | **10 a 19** (24 a 33 do cód. barras)  | `Campo Livre`
 * __Y__ | **20 a 20**  | `Dígito verificador do Bloco 2 (Módulo 10)`
 * __E__ | **21 a 30** (24 a 43 do cód. barras)  | `Campo Livre`
 * __Z__ | **31 a 31**  | `Dígito verificador do Bloco 3 (Módulo 10)`
 * __K__ | **32 a 32** (4 a 4 do cód. barras)  | `Dígito verificador do código de barras`
 * __U__ | **33 a 36** (5 a 8 do cód. barras)  | `Fator de Vencimento`
 * __V__ | **37 a 43** (9 a 18 do cód. barras)  | `Valor`
 * 
 * ## __`CONTA CONVÊNIO / ARRECADAÇÃO`__
 * 
 * ---------------------------------------------------------
 * 
 * ### __TIPO:__ CÓDIGO DE BARRAS (44 POSIÇÕES NUMÉRICAS)
 * 
 * ---------------------------------------------------------
 * 
 * #### __EXEMPLO__: 12345555555555566667777777777777777777777777
 * 
 * Campo | Posições | Definição
 * --- | --- | ---
 * __1__ | **0 a 0**  | `"8" Identificação da Arrecadação/convênio`
 * __2__ | **1 a 1**  | `Identificação do segmento`
 * __3__ | **2 a 2**  | `Identificação do valor real ou referência`
 * __4__ | **3 a 3**  | `Dígito verificador geral (módulo 10 ou 11)`
 * __5__ | **4 a 14**  | `Valor efetivo ou valor referência`
 * __6__ | **15 a 18**  | `Identificação da empresa/órgão`
 * __7__ | **19 a 43**  | `Campo livre de utilização da empresa/órgão`
 * 
 * ---------------------------------------------------------
 * 
 * ### __TIPO:__ LINHA DIGITÁVEL (48 POSIÇÕES NUMÉRICAS)
 * 
 * ---------------------------------------------------------
 * 
 * #### __EXEMPLO__: ABCDEEEEEEE-W EEEEFFFFGGG-X GGGGGGGGGGG-Y GGGGGGGGGGG-Z
 * 
 * Campo | Posições | Definição
 * --- | --- | ---
 * __A__ | **0 a 0**  | `"8" Identificação da Arrecadação/convênio`
 * __B__ | **1 a 1**  | `Identificação do segmento`
 * __C__ | **2 a 2**  | `Identificação do valor real ou referência`
 * __D__ | **3 a 3**  | `Dígito verificador geral (módulo 10 ou 11)`
 * __E__ | **4 a 14**  | `Valor efetivo ou valor referência`
 * __W__ | **11 a 11**  | `Dígito verificador do Bloco 1`
 * __F__ | **15 a 18**  | `Identificação da empresa/órgão`
 * __G__ | **19 a 43**  | `Campo livre de utilização da empresa/órgão`
 * __X__ | **23 a 23**  | `Dígito verificador do Bloco 2`
 * __Y__ | **35 a 35**  | `Dígito verificador do Bloco 3`
 * __Z__ | **47 a 47**  | `Dígito verificador do Bloco 4`
 */
exports.validarBoleto = (codigo) => {
    let retorno = {};
    codigo = codigo.replace(/[^0-9]/g, '');

    if (codigo.length != 44 && codigo.length != 46 && codigo.length != 47 && codigo.length != 48) {
        retorno.sucesso = false;
        retorno.mensagem = 'Por favor insira uma numeração válida. Códigos de barras devem ter 44 caracteres numéricos. Linhas digitáveis podem possuir 46, 47 ou 48 caracteres numéricos. Qualquer caractere não numérico será desconsiderado.';
    } else if (codigo.substr(0, 1) == '8' && codigo.length == 46 && codigo.length == 47) {
        retorno.sucesso = false;
        retorno.mensagem = 'Este tipo de boleto deve possuir 44 ou 48 caracteres numéricos.';
    } else {
        retorno.sucesso = true;
        retorno.mensagem = 'Boleto validado com sucesso';
        let tipoCodigo = this.identificarTipoCodigo(codigo);

        switch (tipoCodigo) {
            case 'CODIGO_DE_BARRAS':
                retorno.tipoCodigoInput = 'CODIGO_DE_BARRAS';
                retorno.tipoBoleto = this.identificarTipoBoleto(codigo, 'CODIGO_DE_BARRAS');
                retorno.codigoBarras = codigo;
                retorno.linhaDigitavel = this.codBarras2LinhaDigitavel(codigo, false);
                retorno.vencimento = this.identificarData(codigo, 'CODIGO_DE_BARRAS');
                retorno.valor = this.identificarValor(codigo, 'CODIGO_DE_BARRAS');
                // retorno.dvCodBarras = this.identificarTipoBoleto(codigo, 'CODIGO_DE_BARRAS') == 'BANCO' ? this.calculaDVCodBarras(codigo, 4, this.identificarReferencia(codigo).mod) : this.calculaDVCodBarras(codigo, 3, this.identificarReferencia(codigo).mod);
                break;
            case 'LINHA_DIGITAVEL':
                retorno.tipoCodigoInput = 'LINHA_DIGITAVEL';
                retorno.tipoBoleto = this.identificarTipoBoleto(codigo, 'LINHA_DIGITAVEL');
                retorno.codigoBarras = this.codBarras2LinhaDigitavel(codigo, false);
                // retorno.codigoBarras = this.calculaDVLinhaDigitavel(codigo);
                retorno.linhaDigitavel = codigo;
                retorno.vencimento = this.identificarData(codigo, 'LINHA_DIGITAVEL');
                retorno.valor = this.identificarValor(codigo, 'LINHA_DIGITAVEL');
                break;
            default:
                break;
        }
    }

    return retorno;
}

/**
 * CÁLCULO MOD 10
 */
exports.calculaMod10 = (numero) => {
    numero = numero.replace(/\D/g, '');
    var i;
    var mult = 2;
    var soma = 0;
    var s = '';

    for (i = numero.length - 1; i >= 0; i--) {
        s = (mult * parseInt(numero.charAt(i))) + s;
        if (--mult < 1) {
            mult = 2;
        }
    }
    for (i = 0; i < s.length; i++) {
        soma = soma + parseInt(s.charAt(i));
    }
    soma = soma % 10;
    if (soma != 0) {
        soma = 10 - soma;
    }
    return soma;
}

/**
 * CÁLCULO MOD 11 
 */
exports.calculaMod11 = (numero) => {
    numero = numero.replace(/\D/g, '');

    let soma = 0;
    let peso = 2;
    const base = 9;
    const contador = numero.length - 1;
    for (let i = contador; i >= 0; i--) {
        soma = soma + (parseInt(numero.substring(i, i + 1)) * peso);
        if (peso < base) {
            peso++;
        } else {
            peso = 2;
        }
    }
    let digito = 11 - (soma % 11);
    if (digito > 9) {
        digito = 0;
    }
    /* Utilizar o dígito 1(um) sempre que o resultado do cálculo padrão for igual a 0(zero), 1(um) ou 10(dez). */
    if (digito === 0) {
        digito = 1;
    }
    return digito;
}

function substringReplace(str, repl, inicio, tamanho) {
    if (inicio < 0) {
        inicio = inicio + str.length;
    }

    tamanho = tamanho !== undefined ? tamanho : str.length;
    if (tamanho < 0) {
        tamanho = tamanho + str.length - inicio;
    }

    return [
        str.slice(0, inicio),
        repl.substr(0, tamanho),
        repl.slice(tamanho),
        str.slice(inicio + tamanho)
    ].join('');
}