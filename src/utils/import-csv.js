import { parse } from 'csv-parse'
import { createReadStream } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const csvPath = resolve(__dirname, 'tasks.csv')

async function run() {
  const parser = createReadStream(csvPath).pipe(
    parse({
      delimiter: ',',
      from_line: 2, // pula o cabeçalho automaticamente
    })
  )

  for await (const line of parser) {
    const [title, description] = line

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    })

    console.log(`Task criada: ${title}`)
  }

  console.log('Importação concluída!')
}

run()
