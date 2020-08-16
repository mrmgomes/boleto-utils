const { expect, assert } = require('chai');
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
            expect(
                boleto.validarBoleto('123482938102381039810293810938093819023810982309182301238109238109328091')
            ).to.have.property('sucesso').to.be.false;
        });
    });
});


describe('Boletos de 5 campos', function () {
    describe('Boleto Bancário', function () {
        describe('Código de barras', function () {
            it('deve retornar Objeto com informações do boleto', function () {
                result = boleto.validarBoleto('10499898100000214032006561000100040099726390')
                expect(result).to.have.property('sucesso').to.be.true;
                expect(result).to.have.property('mensagem').to.equal('Boleto válido');
                expect(result).to.have.property('valor').to.equal(214.03);
                expect(result).to.have.property('tipoCodigoInput').to.equal('CODIGO_DE_BARRAS');
                expect(result).to.have.property('tipoBoleto').to.equal('BANCO');
                expect(result).to.have.property('codigoBarras').to.equal('10499898100000214032006561000100040099726390');
                expect(result).to.have.property('linhaDigitavel').to.equal('10492006506100010004200997263900989810000021403');
                expect(result).to.have.property('vencimento');
                assert.deepEqual(result.vencimento, new Date('2022-05-10T20:54:59.000Z'));
                
            });
        });
        describe('Linha Digitável', function () {
            it('deve retornar Objeto com informações do boleto', function () {
                result = boleto.validarBoleto('10492006506100010004200997263900989810000021403')
                expect(result).to.have.property('sucesso').to.be.true;
                expect(result).to.have.property('mensagem').to.equal('Boleto válido');
                expect(result).to.have.property('valor').to.equal(214.03);
                expect(result).to.have.property('tipoCodigoInput').to.equal('LINHA_DIGITAVEL');
                expect(result).to.have.property('tipoBoleto').to.equal('BANCO');
                expect(result).to.have.property('codigoBarras').to.equal('10499898100000214032006561000100040099726390');
                expect(result).to.have.property('linhaDigitavel').to.equal('10492006506100010004200997263900989810000021403');
                expect(result).to.have.property('vencimento');
                assert.deepEqual(result.vencimento, new Date('2022-05-10T20:54:59.000Z'));
            });
        });
    });
    describe('Boleto de Cartão de Crédito', function () {
        describe('Código de barras', function () {
            it('deve retornar Objeto com informações do boleto', function () {
                result = boleto.validarBoleto('23797000000000000004150090019801673500021140')
                expect(result).to.have.property('sucesso').to.be.true;
                expect(result).to.have.property('mensagem').to.equal('Boleto válido');
                expect(result).to.have.property('valor').to.equal(0);
                expect(result).to.have.property('tipoCodigoInput').to.equal('CODIGO_DE_BARRAS');
                expect(result).to.have.property('tipoBoleto').to.equal('CARTAO_DE_CREDITO');
                expect(result).to.have.property('codigoBarras').to.equal('23797000000000000004150090019801673500021140');
                expect(result).to.have.property('linhaDigitavel').to.equal('23794150099001980167035000211405700000000000000');
            });
        });
        describe('Linha Digitável', function () {
            it('deve retornar Objeto com informações do boleto', function () {
                result = boleto.validarBoleto('23794150099001980167035000211405700000000000000')
                expect(result).to.have.property('sucesso').to.be.true;
                expect(result).to.have.property('mensagem').to.equal('Boleto válido');
                expect(result).to.have.property('valor').to.equal(0);
                expect(result).to.have.property('tipoCodigoInput').to.equal('LINHA_DIGITAVEL');
                expect(result).to.have.property('tipoBoleto').to.equal('CARTAO_DE_CREDITO');
                expect(result).to.have.property('codigoBarras').to.equal('23797000000000000004150090019801673500021140');
                expect(result).to.have.property('linhaDigitavel').to.equal('23794150099001980167035000211405700000000000000');
            });
        });
    });
});


describe('Boletos de 4 campos', function () {
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