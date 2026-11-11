/* Configuração única do site. Preencha a partir de briefing/produto.yaml.
   Nenhum outro arquivo pode repetir estes valores.
   Envio de leads, Pixel e Google NÃO ficam aqui: vêm da linha do CRM (cadastro em CRM › Captação › Sites conectados).
   NUNCA coloque aqui chave, token, senha ou webhook. */
window.SITE = Object.freeze({
  nome: '[preencher]',                 // ex.: 'Estância da Lapa' (igual ao campo "empreendimento" do CRM)
  slug: '[preencher]',                 // ex.: 'estancia-da-lapa'
  unidade: 'gleba',                    // gleba | lote | casa | apartamento | sala

  whatsapp: '[preencher]',             // só dígitos com DDI: '5531997801248'
  whatsappExibicao: '[preencher]',     // '(31) 99780-1248'
  email: '[preencher]',

  crmSite: '[preencher]',              // código do site no CRM (Sites conectados), ex.: 'estanciadalapa'. Só para referência: a linha no HTML usa o mesmo código.

  home: { lat: 0, lng: 0 },            // portaria/stand

  mensagens: {                         // texto pré-preenchido do WhatsApp por botão
    padrao: 'Olá, quero conhecer o [preencher].',
    tabela: 'Olá, quero receber a tabela completa do [preencher].',
    duvida: 'Olá, tenho uma dúvida sobre o [preencher].'
  },

  visitas: { proximosDias: 8, excluirDiasDaSemana: [] }   // 0 = domingo ... 6 = sábado
});
