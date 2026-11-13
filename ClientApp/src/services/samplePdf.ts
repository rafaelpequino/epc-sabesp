// TEMPORÁRIO: gera um PDF mínimo em memória para simular arquivos até existir API de arquivos.
const samplePdfUrls = new Map<string, string>()

export function createSamplePdfUrl(title: string): string {
  const cached = samplePdfUrls.get(title)
  if (cached) return cached

  const pdf = `%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 100]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n4 0 obj<</Length 52>>stream\nBT /F1 14 Tf 20 50 Td (${title}) Tj ET\nendstream\nendobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\ntrailer<</Root 1 0 R/Size 6>>\n%%EOF`
  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))
  samplePdfUrls.set(title, url)
  return url
}
