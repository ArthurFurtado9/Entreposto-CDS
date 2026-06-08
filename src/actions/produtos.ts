"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth-utils"
import { z } from "zod"

const itemEstruturaSchema = z.object({
  id: z.string().optional(),
  tipo: z.enum(['PRODUTO', 'INSUMO']),
  itemId: z.string().min(1, "Item do componente é obrigatório."),
  quantidade: z.number().positive("A quantidade deve ser maior que zero."),
  precoCusto: z.number().nonnegative(),
  precoVenda: z.number().nonnegative(),
})

const produtoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  codigo: z.string().optional().nullable(),
  formato: z.enum(['SIMPLES', 'COMPOSICAO', 'VARIACOES']),
  tipo: z.string().default("PRODUTO"),
  situacao: z.boolean().default(true),
  precoVenda: z.number().nonnegative("Preço de venda não pode ser negativo."),
  condicao: z.enum(['NOVO', 'RECONDICIONADO']),
  imagemUrl: z.string().optional().nullable().or(z.literal("")),
  
  // Características
  marca: z.string().optional().nullable().or(z.literal("")),
  producao: z.string().optional().nullable().or(z.literal("")),
  dataValidade: z.string().optional().nullable().or(z.literal("")),
  freteGratis: z.string().optional().nullable().or(z.literal("")),
  pesoLiquido: z.number().optional().default(0),
  pesoBruto: z.number().optional().default(0),
  largura: z.number().optional().default(0),
  altura: z.number().optional().default(0),
  profundidade: z.number().optional().default(0),
  volumes: z.number().int().optional().default(1),
  itensCaixa: z.number().optional().default(1),
  unidadeMedida: z.string().optional().default("Centimetros"),
  gtinEan: z.string().optional().nullable().or(z.literal("")),
  gtinEanTributario: z.string().optional().nullable().or(z.literal("")),
  departamento: z.string().optional().nullable().or(z.literal("")),
  
  // Tributação
  origem: z.string().optional().nullable().or(z.literal("")),
  ncm: z.string().optional().nullable().or(z.literal("")),
  cest: z.string().optional().nullable().or(z.literal("")),
  tipoItem: z.string().optional().nullable().or(z.literal("")),
  percentualTributos: z.number().optional().default(0),
  grupoProdutos: z.string().optional().nullable().or(z.literal("")),
  icmsBaseStRetencao: z.number().optional().default(0),
  icmsStRetencao: z.number().optional().default(0),
  icmsProprioSubstituto: z.number().optional().default(0),
  ipiCodigoExcecaoTipi: z.string().optional().nullable().or(z.literal("")),
  pisFixo: z.number().optional().default(0),
  cofinsFixo: z.number().optional().default(0),
  informacoesAdicionais: z.string().optional().nullable().or(z.literal("")),
  
  // Estrutura
  tipoEstoque: z.string().optional().default("VIRTUAL"),
  componentes: z.array(itemEstruturaSchema).optional().default([]),
})

export async function getProdutosList(search?: string) {
  try {
    await requireRole(["ADMIN", "OPERADOR", "FINANCEIRO"])

    const filters: any = {}
    if (search && search.trim() !== "") {
      const query = search.trim()
      filters.OR = [
        { nome: { contains: query, mode: "insensitive" } },
        { codigo: { contains: query, mode: "insensitive" } },
        { gtinEan: { contains: query, mode: "insensitive" } },
      ]
    }

    const produtos = await prisma.produto.findMany({
      where: filters,
      orderBy: { nome: 'asc' },
    })

    // Serializar decimais para o frontend
    const serialized = produtos.map(p => ({
      ...p,
      precoVenda: Number(p.precoVenda),
    }))

    return { success: true, data: serialized }
  } catch (error: any) {
    console.error("Erro ao listar produtos:", error)
    return { success: false, error: error.message || "Erro ao buscar produtos." }
  }
}

export async function getProdutoDetalhes(id: string) {
  try {
    await requireRole(["ADMIN", "OPERADOR", "FINANCEIRO"])

    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        componentes: {
          include: {
            produtoFilho: true,
            insumo: true,
          }
        }
      }
    })

    if (!produto) return { success: false, error: "Produto não encontrado." }

    // Serializar campos decimaise data
    const compFormatted = produto.componentes.map(c => ({
      id: c.id,
      tipo: c.insumoId ? 'INSUMO' as const : 'PRODUTO' as const,
      itemId: c.insumoId || c.produtoFilhoId || "",
      nome: c.insumo?.nome || c.produtoFilho?.nome || "",
      codigo: c.insumo?.id?.slice(-8) || c.produtoFilho?.codigo || "",
      quantidade: c.quantidade,
      precoCusto: Number(c.precoCusto),
      precoVenda: Number(c.precoVenda),
      estoque: c.insumo?.estoqueAtual ?? 0,
    }))

    const serialized = {
      ...produto,
      precoVenda: Number(produto.precoVenda),
      dataValidade: produto.dataValidade ? produto.dataValidade.toISOString().split('T')[0] : "",
      componentes: compFormatted,
    }

    return { success: true, data: serialized }
  } catch (error: any) {
    console.error("Erro ao buscar detalhes do produto:", error)
    return { success: false, error: error.message || "Erro ao carregar detalhes do produto." }
  }
}

export async function criarProduto(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = produtoSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data

    // 1. Resolver SKU (Código)
    let sku = data.codigo?.trim()
    if (!sku) {
      let isUnique = false
      while (!isUnique) {
        sku = Math.floor(100000 + Math.random() * 900000).toString()
        const existing = await prisma.produto.findUnique({ where: { codigo: sku } })
        if (!existing) isUnique = true
      }
    } else {
      const existing = await prisma.produto.findUnique({ where: { codigo: sku } })
      if (existing) {
        return { success: false, error: "O código SKU digitado já está cadastrado em outro produto." }
      }
    }

    const dataValidadeParsed = data.dataValidade && data.dataValidade.trim() !== "" 
      ? new Date(data.dataValidade) 
      : null

    const result = await prisma.$transaction(async (tx) => {
      // Criar o produto principal
      const prod = await tx.produto.create({
        data: {
          nome: data.nome,
          codigo: sku as string,
          formato: data.formato,
          tipo: data.tipo,
          situacao: data.situacao,
          precoVenda: data.precoVenda,
          condicao: data.condicao,
          imagemUrl: data.imagemUrl || null,
          marca: data.marca || null,
          producao: data.producao || null,
          dataValidade: dataValidadeParsed,
          freteGratis: data.freteGratis || null,
          pesoLiquido: data.pesoLiquido,
          pesoBruto: data.pesoBruto,
          largura: data.largura,
          altura: data.altura,
          profundidade: data.profundidade,
          volumes: data.volumes,
          itensCaixa: data.itensCaixa,
          unidadeMedida: data.unidadeMedida,
          gtinEan: data.gtinEan || null,
          gtinEanTributario: data.gtinEanTributario || null,
          departamento: data.departamento || null,
          origem: data.origem || null,
          ncm: data.ncm || null,
          cest: data.cest || null,
          tipoItem: data.tipoItem || null,
          percentualTributos: data.percentualTributos,
          grupoProdutos: data.grupoProdutos || null,
          icmsBaseStRetencao: data.icmsBaseStRetencao,
          icmsStRetencao: data.icmsStRetencao,
          icmsProprioSubstituto: data.icmsProprioSubstituto,
          ipiCodigoExcecaoTipi: data.ipiCodigoExcecaoTipi || null,
          pisFixo: data.pisFixo,
          cofinsFixo: data.cofinsFixo,
          informacoesAdicionais: data.informacoesAdicionais || null,
          tipoEstoque: data.tipoEstoque,
        }
      })

      // Salvar os componentes de estrutura se for COMPOSICAO
      if (data.formato === "COMPOSICAO" && data.componentes.length > 0) {
        for (const comp of data.componentes) {
          await tx.componenteProduto.create({
            data: {
              produtoPaiId: prod.id,
              insumoId: comp.tipo === "INSUMO" ? comp.itemId : null,
              produtoFilhoId: comp.tipo === "PRODUTO" ? comp.itemId : null,
              quantidade: comp.quantidade,
              precoCusto: comp.precoCusto,
              precoVenda: comp.precoVenda,
            }
          })
        }
      }

      return prod
    })

    revalidatePath("/produtos")
    return { success: true, data: result }
  } catch (error: any) {
    console.error("Erro ao criar produto:", error)
    return { success: false, error: error.message || "Falha ao cadastrar o produto." }
  }
}

export async function editarProduto(id: string, rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID de produto inválido." }
    }

    const validated = produtoSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data

    // Validar SKU único
    let sku = data.codigo?.trim()
    if (!sku) {
      let isUnique = false
      while (!isUnique) {
        sku = Math.floor(100000 + Math.random() * 900000).toString()
        const existing = await prisma.produto.findUnique({ where: { codigo: sku } })
        if (!existing) isUnique = true
      }
    } else {
      const existing = await prisma.produto.findFirst({
        where: {
          codigo: sku,
          id: { not: id }
        }
      })
      if (existing) {
        return { success: false, error: "O código SKU digitado já está em uso por outro produto." }
      }
    }

    const dataValidadeParsed = data.dataValidade && data.dataValidade.trim() !== "" 
      ? new Date(data.dataValidade) 
      : null

    await prisma.$transaction(async (tx) => {
      // Atualizar dados principais
      await tx.produto.update({
        where: { id },
        data: {
          nome: data.nome,
          codigo: sku as string,
          formato: data.formato,
          tipo: data.tipo,
          situacao: data.situacao,
          precoVenda: data.precoVenda,
          condicao: data.condicao,
          imagemUrl: data.imagemUrl || null,
          marca: data.marca || null,
          producao: data.producao || null,
          dataValidade: dataValidadeParsed,
          freteGratis: data.freteGratis || null,
          pesoLiquido: data.pesoLiquido,
          pesoBruto: data.pesoBruto,
          largura: data.largura,
          altura: data.altura,
          profundidade: data.profundidade,
          volumes: data.volumes,
          itensCaixa: data.itensCaixa,
          unidadeMedida: data.unidadeMedida,
          gtinEan: data.gtinEan || null,
          gtinEanTributario: data.gtinEanTributario || null,
          departamento: data.departamento || null,
          origem: data.origem || null,
          ncm: data.ncm || null,
          cest: data.cest || null,
          tipoItem: data.tipoItem || null,
          percentualTributos: data.percentualTributos,
          grupoProdutos: data.grupoProdutos || null,
          icmsBaseStRetencao: data.icmsBaseStRetencao,
          icmsStRetencao: data.icmsStRetencao,
          icmsProprioSubstituto: data.icmsProprioSubstituto,
          ipiCodigoExcecaoTipi: data.ipiCodigoExcecaoTipi || null,
          pisFixo: data.pisFixo,
          cofinsFixo: data.cofinsFixo,
          informacoesAdicionais: data.informacoesAdicionais || null,
          tipoEstoque: data.tipoEstoque,
        }
      })

      // Deletar os componentes antigos
      await tx.componenteProduto.deleteMany({
        where: { produtoPaiId: id }
      })

      // Se for COMPOSICAO, salvar os novos componentes
      if (data.formato === "COMPOSICAO" && data.componentes.length > 0) {
        for (const comp of data.componentes) {
          await tx.componenteProduto.create({
            data: {
              produtoPaiId: id,
              insumoId: comp.tipo === "INSUMO" ? comp.itemId : null,
              produtoFilhoId: comp.tipo === "PRODUTO" ? comp.itemId : null,
              quantidade: comp.quantidade,
              precoCusto: comp.precoCusto,
              precoVenda: comp.precoVenda,
            }
          })
        }
      }
    })

    revalidatePath("/produtos")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao editar produto:", error)
    return { success: false, error: error.message || "Falha ao editar o produto." }
  }
}

export async function excluirProduto(id: string) {
  try {
    await requireRole(["ADMIN"])

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID de produto inválido." }
    }

    await prisma.produto.delete({
      where: { id }
    })

    revalidatePath("/produtos")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao excluir produto:", error)
    return { success: false, error: error.message || "Falha ao excluir o produto." }
  }
}

export async function getComponentesDisponiveis() {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    // Buscar insumos
    const insumos = await prisma.insumo.findMany({
      orderBy: { nome: 'asc' },
    })

    // Buscar outros produtos (que não sejam compostos para evitar circularidade infinita)
    const produtos = await prisma.produto.findMany({
      where: { formato: { in: ["SIMPLES", "VARIACOES"] } },
      orderBy: { nome: 'asc' },
    })

    const insumosFormatted = insumos.map(i => ({
      id: i.id,
      tipo: 'INSUMO' as const,
      nome: i.nome,
      codigo: i.id.slice(-8).toUpperCase(),
      estoque: i.estoqueAtual,
      precoCusto: 0, // Custo padrão
      precoVenda: 0,
    }))

    const produtosFormatted = produtos.map(p => ({
      id: p.id,
      tipo: 'PRODUTO' as const,
      nome: p.nome,
      codigo: p.codigo,
      estoque: 0, // O estoque de produtos não simples seria virtual
      precoCusto: 0,
      precoVenda: Number(p.precoVenda),
    }))

    return {
      success: true,
      data: [...insumosFormatted, ...produtosFormatted]
    }
  } catch (error: any) {
    console.error("Erro ao buscar componentes disponíveis:", error)
    return { success: false, error: error.message || "Falha ao carregar componentes." }
  }
}
