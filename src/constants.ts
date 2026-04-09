export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: string;
  duration: string;
  image: string;
  features: string[];
  testimonials: Testimonial[];
}

export interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
}

export const CLINIC_INFO = {
  name: 'Lumière Estética Avançada',
  brandLabel: 'LUMIÈRE',
  tagline: 'Estética Avançada',
  city: 'Recife • PE',
  neighborhood: 'Boa Viagem, Recife',
  address: 'Av. Boa Viagem, 1500 - Boa Viagem, Recife - PE',
  phone: '(81) 98765-4321',
  whatsappDigits: '5581987654321',
  email: 'contato@lumiereestetica.com.br',
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
  mapEmbed: 'https://www.google.com/maps?q=Boa%20Viagem%2C%20Recife%20PE&z=14&output=embed',
  businessHours: [
    { label: 'Segunda a Sexta', value: '08:00 - 20:00' },
    { label: 'Sábado', value: '09:00 - 15:00' },
    { label: 'Domingo', value: 'Fechado' },
  ],
};

export const DIFFERENTIALS = [
  {
    title: 'Diagnóstico individual',
    description:
      'Cada protocolo começa com leitura facial e corporal detalhada para indicar o melhor tratamento para o seu objetivo.',
  },
  {
    title: 'Tecnologia clínica premium',
    description:
      'Equipamentos atualizados, marcas reconhecidas e protocolos seguros para entregar performance com naturalidade.',
  },
  {
    title: 'Acompanhamento real',
    description:
      'Você recebe orientação de pré e pós-procedimento, revisão e suporte pelo WhatsApp para acompanhar a evolução.',
  },
];

export const TRUST_NUMBERS = [
  { value: '5.000+', label: 'procedimentos realizados com foco em segurança e naturalidade' },
  { value: '96%', label: 'de recompra em protocolos de acompanhamento e manutenção' },
  { value: '10 anos', label: 'de experiência em harmonização, pele e rejuvenescimento' },
];

export const SALES_POINTS = [
  'Avaliação estratégica com plano de tratamento personalizado',
  'Parcelamento facilitado nos protocolos mais procurados',
  'Atendimento reservado, sofisticado e focado em conversão de resultados',
];

export const SERVICES: Service[] = [
  {
    id: 'botox',
    title: 'Toxina Botulínica',
    description: 'Suavização de linhas de expressão com resultado elegante, leve e preventivo.',
    longDescription:
      'A toxina botulínica é indicada para suavizar rugas dinâmicas, prevenir marcas profundas e devolver um aspecto descansado ao rosto. O protocolo da Lumière prioriza microajustes estratégicos para manter sua expressão natural, respeitando a anatomia e o objetivo de cada paciente.',
    price: 'A partir de R$ 980',
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1713085085470-fba013d67e65?q=80&w=1200&auto=format&fit=crop',
    features: ['Avaliação facial detalhada', 'Aplicação com técnica precisa', 'Retorno para ajuste e acompanhamento'],
    testimonials: [
      { id: 't1', author: 'Mariana Silva', content: 'Resultado super natural! Amei o atendimento da Dra. Ana. Recomendo demais.', rating: 5, date: '15/02/2024' },
      { id: 't2', author: 'Carla Mendes', content: 'Faço há anos e nunca vi um cuidado tão grande com a simetria do rosto.', rating: 5, date: '10/01/2024' },
    ],
  },
  {
    id: 'preenchimento',
    title: 'Preenchimento Labial',
    description: 'Contorno, projeção e hidratação com acabamento sofisticado e harmônico.',
    longDescription:
      'O preenchimento labial é planejado para valorizar formato, definição e proporção. Trabalhamos com ácido hialurônico de alta qualidade para entregar volume sob medida, mais hidratação e uma aparência refinada, sem exageros.',
    price: 'A partir de R$ 1.200',
    duration: '45 min',
    image: 'https://plus.unsplash.com/premium_photo-1661295659157-036d16ef1576?q=80&w=1200&auto=format&fit=crop',
    features: ['Definição de contorno', 'Volume na medida certa', 'Plano de manutenção individual'],
    testimonials: [
      { id: 't3', author: 'Beatriz Costa', content: 'Meus lábios ficaram exatamente como eu queria. Sem aquele aspecto exagerado.', rating: 5, date: '20/02/2024' },
      { id: 't4', author: 'Juliana Paes', content: 'O pós-operatório foi super tranquilo e o resultado ficou incrível.', rating: 5, date: '05/03/2024' },
    ],
  },
  {
    id: 'bioestimuladores',
    title: 'Bioestimuladores',
    description: 'Estímulo inteligente de colágeno para firmeza, contorno e sustentação.',
    longDescription:
      'Os bioestimuladores são indicados para quem deseja melhorar flacidez, textura e sustentação de forma progressiva. O tratamento ativa a produção natural de colágeno e promove um efeito lifting gradual, elegante e duradouro.',
    price: 'A partir de R$ 2.500',
    duration: '60 min',
    image: 'https://plus.unsplash.com/premium_photo-1661485215956-8f50211c54d5?q=80&w=1200&auto=format&fit=crop',
    features: ['Estímulo de colágeno', 'Melhora progressiva da firmeza', 'Indicação facial e corporal'],
    testimonials: [
      { id: 't5', author: 'Renata Oliveira', content: 'Minha pele recuperou a firmeza que eu não via há anos. Vale cada centavo.', rating: 5, date: '12/12/2023' },
      { id: 't6', author: 'Fernanda Lima', content: 'O resultado demora um pouco a aparecer, mas quando vem é maravilhoso e natural.', rating: 5, date: '28/01/2024' },
    ],
  },
  {
    id: 'limpeza-pele',
    title: 'Limpeza de Pele Profunda',
    description: 'Renovação da pele com extração precisa, conforto e glow imediato.',
    longDescription:
      'Nosso protocolo de limpeza profunda combina higienização, extração cuidadosa, ativos calmantes e finalização iluminadora para desobstruir poros, reduzir a textura irregular e devolver viço logo na primeira sessão.',
    price: 'A partir de R$ 250',
    duration: '90 min',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1200&auto=format&fit=crop',
    features: ['Peeling ultrassônico', 'Máscara calmante e LED', 'Textura mais uniforme e luminosa'],
    testimonials: [
      { id: 't7', author: 'Lucas Santos', content: 'Melhor limpeza de pele que já fiz em Recife. Ambiente muito relaxante.', rating: 5, date: '18/02/2024' },
      { id: 't8', author: 'Patrícia Melo', content: 'Saí com a pele de porcelana. O cuidado das profissionais é impecável.', rating: 5, date: '02/03/2024' },
    ],
  },
  {
    id: 'depilacao-laser',
    title: 'Depilação a Laser',
    description: 'Redução consistente dos pelos com tecnologia segura e mais conforto.',
    longDescription:
      'A depilação a laser da Lumière utiliza tecnologia de alta performance com sistema de resfriamento para reduzir o desconforto e otimizar os resultados. O plano é montado por área, fototipo e objetivo, com acompanhamento da evolução ao longo das sessões.',
    price: 'A partir de R$ 150 (sessao)',
    duration: '20-40 min',
    image: 'https://plus.unsplash.com/premium_photo-1661727003623-764bea3b24a4?q=80&w=1200&auto=format&fit=crop',
    features: ['Tecnologia com resfriamento', 'Plano por área corporal', 'Resultados visíveis desde o início'],
    testimonials: [
      { id: 't9', author: 'Amanda Rocha', content: 'Praticamente indolor comparado a outros que já fiz. Recomendo o pacote.', rating: 5, date: '14/01/2024' },
      { id: 't10', author: 'Sofia Arraes', content: 'Finalmente livre de lâminas! O atendimento é nota 10.', rating: 5, date: '22/02/2024' },
    ],
  },
];
