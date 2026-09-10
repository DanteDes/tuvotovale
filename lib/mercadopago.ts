import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function createVotePreference(teamId: string, teamName: string, fingerprint: string) {
  const preference = new Preference(client)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const result = await preference.create({
    body: {
      items: [
        {
          id: teamId,
          title: `Voto por ${teamName}`,
          quantity: 1,
          unit_price: Number(process.env.VOTE_PRICE_ARS ?? 1000),
          currency_id: 'ARS',
        },
      ],
      external_reference: `${teamId}|${fingerprint}`,
      back_urls: {
        success: `${baseUrl}/voto/exitoso`,
        failure: `${baseUrl}/voto/fallido`,
        pending: `${baseUrl}/voto/pendiente`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/webhook`,
    },
  })

  return result
}
