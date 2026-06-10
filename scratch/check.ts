import prisma from "../src/lib/prisma"

async function main() {
  const clients = await prisma.cliente.findMany()
  const orders = await prisma.pedido.findMany({
    include: {
      cliente: true,
      itens: true,
      itensVenda: true,
    }
  })
  console.log("CLIENTS:", clients)
  console.log("ORDERS:", orders)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
