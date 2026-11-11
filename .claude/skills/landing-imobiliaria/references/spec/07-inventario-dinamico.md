# 07 · Inventário dinâmico (mapa de unidades)

Use quando o produto tem unidades com status e preço próprios (glebas, lotes, casas). A referência é a seção `#glebas` da Estância.

## Fluxo dos dados
```
Planilha Google (time comercial atualiza)
   └─ tools/sync_inventario.py  (GitHub Actions a cada 15 min: '7,22,37,52 * * * *')
        └─ public_html/data/inventario.json  (commit só se mudou)
             └─ dispara o deploy (o push do Actions não dispara outro workflow sozinho: chamar `gh workflow run deploy.yml`)
                  └─ inventario.js lê o JSON no site; se falhar, usa a cópia embutida
```

## Requisitos
- **INV-D01 DEVE** a planilha é compartilhada como "qualquer pessoa com o link pode ver" e lida em CSV (`/export?format=csv&gid=<aba>`). Nada de credencial no repositório.
- **INV-D02 DEVE** o script acha o cabeçalho pelas colunas (ex.: "Gleba"/"Lote" e "Status"), normaliza acentos, converte números no formato brasileiro e valida. Se a leitura falhar ou vier vazia, **mantém o JSON atual** (o site segue com a última versão boa).
- **INV-D03 DEVE** formato do JSON:
```json
{
  "fonte": "Tabela Matriz · aba <Produto>",
  "atualizado": "2026-11-10T12:07:00Z",
  "total": 61,
  "unidades": [
    { "n": 3, "quadra": "A", "st": "D", "area": 27468.0, "preco": 523930.0,
      "planos": { "s10": 52393.0, "p48": 9823.69, "s20": 104786.0, "p60": 6985.73,
                  "ent": 45057.98, "t210": 4679.57, "a210": 3509.68, "a17": 14767.86 } }
  ]
}
```
  `st`: `D` disponível · `R` reservada · `V` vendida. Na referência os planos estão no mesmo nível (`s10`, `p48`...) e a lista se chama `glebas`; em sites novos use `unidades` e `planos`.
- **INV-D04 DEVE** os números da seção (disponíveis, reservadas, "a partir de", "Restam X", percentual vendido) são calculados do JSON; o HTML traz os valores do dia como reserva.
- **INV-D05 DEVE** posição de cada unidade na planta em pixels da imagem (centro do número), num objeto no `inventario.js`. Para satélite/relevo, a transformação planta → coordenadas é ajustada a partir do KMZ do loteamento (afim: `lng = A0 + A1·x + A2·y`, `lat = B0 + B1·x + B2·y`), com erro médio informado no comentário.
- **INV-D06 DEVE** planta em WebP em 2 tamanhos (leve para a vista inteira, grande para zoom), trocando para a maior só quando o zoom pede.
- **INV-D07 DEVE** ficha da unidade com planos calculados a partir do JSON e botão de WhatsApp com texto "Quero saber mais sobre a gleba 09 (26.361 m², R$ 624.360)" → Interesse `Simular minha parcela`, `Faixa de investimento` = preço.
- **INV-D08 PODE** vista de satélite (Esri) e relevo 3D (Terrain Tiles da AWS, formato terrarium) com MapLibre; só inclina depois de confirmar que a altitude chegou válida.

## Sem planilha
Se o comercial não tiver planilha, o inventário fica em `data/inventario.json` editado à mão, e a skill explica ao usuário como atualizar (ou propõe criar a planilha).
