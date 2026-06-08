import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    // 1. Controle de Acesso (ID 5.5 / 12.2)
    const user = await getCurrentUser()
    if (!user || (user.role !== "ADMIN" && user.role !== "DONO")) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores ou donos autenticados podem fazer upload de arquivos." },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 })
    }

    // 2. Validação Restrita de Extensão (ID 12.4)
    const ext = path.extname(file.name).toLowerCase()
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"]
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "Extensão de arquivo não permitida. Use JPG, JPEG, PNG ou WebP." },
        { status: 400 }
      )
    }

    // 3. Validação do MIME-Type do Cabeçalho (ID 12.4)
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo inválido. Use JPG, PNG ou WebP (SVGs não são permitidos por razões de segurança)." },
        { status: 400 }
      )
    }

    // 4. Validação de Tamanho do Arquivo (Máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 2MB." },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Criar diretório de upload se não existir
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    // Gerar nome de arquivo aleatório/único com a extensão validada (ID 1.16 / 12.4)
    const filename = `logo-${Date.now()}${ext}`
    const filepath = path.join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: "Erro interno no processamento do upload." }, { status: 500 })
  }
}
