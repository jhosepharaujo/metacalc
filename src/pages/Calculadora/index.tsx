import React, { useState, useCallback, useRef } from 'react';
import { FiCalendar, FiActivity, FiMinusCircle } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Container, Content, AnimationContainer } from './styles';
import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidateErrors';

interface CalculadoraFormData {
  meta: number;
  diasUteis: number;
  abono: number;
}

const Calculadora: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [pontuacao, setPontuacao] = useState(0);

  const handleSubmit = useCallback(async (data: CalculadoraFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        meta: Yup.string()
          .matches(/^([0]([.][0-9]+)?|[1-9]([0-9]+)?([.][0-9]+)?)$/, {
            message: 'Formato incorreto. Ex: 90 ou 87.5',
          })
          .required('Meta obrigatória'),
        abono: Yup.string()
          .matches(/^([0]([.][0-9]+)?|[1-9]([0-9]+)?([.][0-9]+)?)$/, {
            message: 'Formato incorreto. Ex: 10 ou 7.5',
          })
          .required('Dias abonados obrigatório'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const { meta, diasUteis, abono } = data;

      const pontuacaoDiaria = (diasUteis - abono) / diasUteis;

      const pontuacaoTotal = (meta * pontuacaoDiaria).toFixed(2);

      setPontuacao(parseFloat(pontuacaoTotal));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const erros = getValidationErrors(err);
        formRef.current?.setErrors(erros);
      }
    }

    // console.log(pontuacaoTotal);
  }, []);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Calculadora de meta INSS Digital</h1>
            <Input
              icon={FiActivity}
              name="meta"
              placeholder="Meta mensal. Ex: 90"
              type="text"
            />
            <Input
              icon={FiCalendar}
              name="diasUteis"
              placeholder="Dias úteis"
              type="number"
              value="21.1"
              disabled
            />
            <Input
              icon={FiMinusCircle}
              name="abono"
              type="text"
              placeholder="Dias abonados"
            />
            <Button type="submit">Calcular</Button>
          </Form>
          <div>
            <h1>{pontuacao}</h1>
            <span>Pontos</span>
          </div>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Calculadora;
