import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo inválido. Use JPG, PNG, WebP ou SVG." },
        { status: 400 }
      )
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 2MB." },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const ext = path.extname(file.name) || ".png"
    const filename = `logo-${Date.now()}${ext}`
    const filepath = path.join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: "Erro interno no upload." }, { status: 500 })
  }
}
