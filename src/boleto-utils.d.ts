declare module '@mrmgomes/boleto-utils' {
    type int = number;
    /**
     * Verifica a numeração e retorna o tipo do código inserido.
     * CODIGO_DE_BARRAS ou LINHA_DIGITAVEL.
     * Requer numeração completa (com ou sem formatação).
     */
    function identificarTipoCodigo(codigo: string): TipoCodigoInput;

    /**
     * Verifica a numeração e retorna o tipo do boleto inserido.
     * Se boleto bancário, convênio ou arrecadação.
     * Requer numeração completa (com ou sem formatação).
     */
    function identificarTipoBoleto(codigo: string): TipoBoleto;

    /**
     * Valida o terceiro campo da numeração inserida para definir como será calculado o Dígito Verificador.
     * Requer numeração completa (com ou sem formatação).
     */
    function identificarReferencia(codigo: string): { mod: int; efetivo: boolean };

    /**
     * Verifica a numeração, o tipo de código inserido e o tipo de boleto e retorna a data de vencimento.
     * Requer numeração completa (com ou sem formatação) e tipo de código que está sendo inserido (CODIGO_DE_BARRAS ou LINHA_DIGITAVEL).
     */
    function identificarData(codigo: string, tipoCodigo: string): Date;

    /**
     * Verifica a numeração e o tipo de código inserido e retorna o valor do CÓDIGO DE BARRAS do tipo Arrecadação.
     * Requer numeração completa (com ou sem formatação) e tipo de código que está sendo inserido (CODIGO_DE_BARRAS ou LINHA_DIGITAVEL).
     */
    function identificarValorCodBarrasArrecadacao(codigo: string, tipoCodigo: string): string | number;

    /**
     * Verifica a numeração, o tipo de código inserido e o tipo de boleto e retorna o valor do título.
     * Requer numeração completa (com ou sem formatação) e tipo de código que está sendo inserido (CODIGO_DE_BARRAS ou LINHA_DIGITAVEL).
     */
    function identificarValor(codigo: string, tipoCodigo: string): number;

    /**
     * Verifica a numeração e o módulo a ser utilizado (Mod 10 ou Mod 11) e retorna o DV (Dígito Verificador).
     * Requer numeração completa (com ou sem formatação) e caracteres numéricos que representam o módulo a ser usado (valores aceitos: 10 ou 11).
     */
    function digitosVerificadores(codigo: string, mod: int): string;

    /**
     * Transforma a numeração no formato de código de barras em linha digitável.
     * Requer numeração completa (com ou sem formatação) e valor true ou false que representam a forma em que o código convertido será exibido.
     * Com (true) ou sem (false) formatação.
     */
    function codBarras2LinhaDigitavel(codigo: string, formatada: boolean): string;

    /**
     * Transforma a numeração no formato linha digitável em código de barras.
     * Requer numeração completa (com ou sem formatação).
     */
    function linhaDigitavel2CodBarras(codigo: string): string;

    /**
     * Verifica a numeração do código de barras, extrai o DV (dígito verificador) presente na posição indicada, realiza o cálculo do dígito utilizando o módulo indicado e retorna o dígito verificador.
     * Serve para validar o código de barras.
     * Requer numeração completa (com ou sem formatação), caracteres numéricos que representam a posição do dígito verificador no código de barras e caracteres numéricos que representam o módulo a ser usado (valores aceitos: 10 ou 11).
     */
    function calculaDVCodBarras(codigo: string, posicaoCodigo: int, mod: int): int;

    /**
     * Calcula o dígito verificador de toda a numeração do código de barras.
     * Retorno true para numeração válida e false para inválida.
     */
    function validarCodigoComDV(codigo: string): int;

    /**
     * Transforma a linha digitável em código de barras inserindo o DV.
     */
    function geraCodBarras(codigo: string): string;

    /**
     * Realiza o cálculo Módulo 10 do número inserido.
     */
    function calculaMod10(numero: string): int;

    /**
     * Realiza o cálculo Módulo 11 do número inserido.
     */
    function calculaMod11(numero: string): int;

    /**
     * Verifica a numeração e utiliza várias das funções acima para retornar um objeto JSON contendo informações sobre a numeração inserida: Tipo de código inserido, Tipo de boleto inserido, Código de barras, Linha digitável, Vencimento e Valor
     */
    function validarBoleto(codigo: string): Boleto;

    interface Boleto {
        sucesso: boolean;
        mensagem: string;
        tipoCodigoInput: string;
        tipoBoleto: TipoBoleto;
        codigoBarras: string;
        linhaDigitavel: string;
        vencimento: string;
        valor: number;
    }

    type TipoBoleto = 'ARRECADACAO_PREFEITURA' | 'CONVENIO_SANEAMENTO' | 'CONVENIO_ENERGIA_ELETRICA_E_GAS' | 'CONVENIO_TELECOMUNICACOES' | 'ARRECADACAO_ORGAOS_GOVERNAMENTAIS' | 'OUTROS' | 'ARRECADACAO_TAXAS_DE_TRANSITO' | 'BANCO';

    type TipoCodigoInput = 'CODIGO_DE_BARRAS' | 'LINHA_DIGITAVEL';
}
