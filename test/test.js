const expect = require('chai').expect;
const boleto = require('../src/boleto-utils')

describe('Boleto Inválido', function () {
    describe('Caracteres Inválidos', function () {
        it('deve retornar Objeto com {sucesso: false}', function () {
            expect(boleto.validarBoleto('jiuajs')).to.have.property('sucesso').to.be.false;
        });
    });
    describe('Fora do limite de caracteres', function () {
        it('deve retornar Objeto com {sucesso: false}', function () {
            expect(boleto.validarBoleto('1234')).to.have.property('sucesso').to.be.false;
        });
    });
});


describe('Boleto Válido', function () {
    describe('Código de barras', function () {
        it('deve retornar Objeto com informações do boleto', function () {
            result = boleto.validarBoleto('83860000005096000190000008017823000034306271')
            expect(result).to.have.property('sucesso').to.be.true;
            expect(result).to.have.property('sucesso').to.be.true;
            expect(result).to.have.property('mensagem').to.equal('Boleto válido');
            expect(result).to.have.property('valor').to.equal(509.6);
            expect(result).to.have.property('tipoCodigoInput').to.equal('CODIGO_DE_BARRAS');
            expect(result).to.have.property('tipoBoleto').to.equal('CONVENIO_ENERGIA_ELETRICA_E_GAS');
            expect(result).to.have.property('codigoBarras').to.equal('83860000005096000190000008017823000034306271');
            expect(result).to.have.property('linhaDigitavel').to.equal('838600000050096000190009000801782309000343062712');
        });
    });
    describe('Linha Digitável', function () {
        it('deve retornar Objeto com informações do boleto', function () {
            result = boleto.validarBoleto('838600000050096000190009000801782309000343062712')
            expect(result).to.have.property('sucesso').to.be.true;
            expect(result).to.have.property('mensagem').to.equal('Boleto válido');
            expect(result).to.have.property('valor').to.equal(509.6);
            expect(result).to.have.property('tipoCodigoInput').to.equal('LINHA_DIGITAVEL');
            expect(result).to.have.property('tipoBoleto').to.equal('CONVENIO_ENERGIA_ELETRICA_E_GAS');
            expect(result).to.have.property('codigoBarras').to.equal('83860000005096000190000008017823000034306271');
            expect(result).to.have.property('linhaDigitavel').to.equal('838600000050096000190009000801782309000343062712');
        });
    });
});