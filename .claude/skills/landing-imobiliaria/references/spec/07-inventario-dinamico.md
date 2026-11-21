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
- **INV-D07 DEVE** ficha da unidade com área e situação e o botão "Descobrir o preço" com texto "Quero descobrir o preço da gleba 09 (26.361 m²)" → Interesse `Simular minha parcela`. O JSON público **não leva preço nem planos** (PRE-07).
- **INV-D08 PODE** vista de satélite (Esri) e relevo 3D (Terrain Tiles da AWS, formato terrarium) com MapLibre; só inclina depois de confirmar que a altitude chegou válida.

## Contornos das unidades (KML/KMZ oficial)
- Os polígonos do KML de loteamento geralmente **não têm o número da unidade** (vêm como "MALHA_COORDENADA", sem nome), trazem o perímetro e às vezes polígonos repetidos ou sobrepostos. Nunca desenhe a partir da planta ilustrada: ela é artística e não está em escala.
- Método que funcionou (Estância das Águas): pegar a **planta técnica georreferenciada** (PDF do topógrafo, com grade UTM nas bordas e o número + área de cada unidade), ler duas linhas da grade (E e N), converter os vértices do KML para UTM (SIRGAS 2000, fuso da região) e sobrepor. Cada polígono recebe o número cujo rótulo cai dentro dele; confira pela área (KML × planta, diferença < 1%).
- Tire do resultado: o perímetro, linhas soltas, duplicatas e polígonos sobrepostos (uma unidade grande com duas pequenas dentro, por exemplo). Unidade sem polígono próprio pode ser reconstruída pelo vão entre as vizinhas dentro do perímetro; registre isso no JSON (`fonte`).
- Saída: `data/<unidades>-contorno.json` (GeoJSON, propriedade `n`), um polígono por unidade.
- Para o número na planta ilustrada, use a posição do círculo/rótulo de cada unidade na própria imagem (detecção dos círculos + conferência visual), não uma transformação a partir do KML.

## Relevo 3D (lições)
- Terreno `raster-dem` terrarium com `maxzoom: 12`; satélite até 18; exagero ~1,3.
- MapLibre 4: depois que a altitude chega, a câmera continua calculada no nível do mar e o centro fica deslocado. Espere `queryTerrainElevation(centro)` válida, chame `map.transform.recalculateZoom(map.terrain)` e só então incline (`pitch` ~55).
- O botão do número no mapa vai dentro de um invólucro (`div`): o MapLibre posiciona o marcador com `transform`, e um `transform` no próprio botão o tira do lugar.
- O CSS do MapLibre põe `.maplibregl-map{position:relative}`: em caixa com `position:absolute; inset:0`, reafirme o absoluto ou o mapa encolhe para 300 px.
- Navegador sem placa de vídeo (testes): `--use-angle=swiftshader --enable-unsafe-swiftshader`.

## Sem planilha
Se o comercial não tiver planilha, o inventário fica em `data/inventario.json` editado à mão, e a skill explica ao usuário como atualizar (ou propõe criar a planilha).
