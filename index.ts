import * as fs from 'fs'
import * as path from 'path'

const JSZip = require('jszip')
const Docxtemplater = require('docxtemplater')

export function generateFile(
  base: 'person' | 'anmeldung',
  data: any,
  geschlechtConfig: Array<{
    name: string
    m: string
    w: string
  }>,
  template: string,
  id: string
): string {
  let eData
  let tmp = {}
  switch (base) {
    case 'person':
      geschlechtConfig.forEach(v => {
        tmp[v.name] = v[data.geschlecht]
      })
      eData = {
        ...data,
        ...tmp
      }
      break
    case 'anmeldung':
      geschlechtConfig.forEach(v => {
        tmp[v.name] = v[data.person.geschlecht]
      })
      eData = data
      eData.person = {
        ...eData.person,
        ...tmp
      }
      break
  }

  const doc = new Docxtemplater()
  doc.loadZip(new JSZip(Buffer.from(template, 'base64')))

  doc.setData(eData)

  doc.render()

  fs.writeFileSync(
    path.resolve(process.env.TEMP, id + '.docx'),
    doc.getZip().generate({ type: 'nodebuffer' })
  )

  return path.resolve(process.env.TEMP, id + '.docx')
}
