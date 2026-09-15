import { MercadoPagoConfig, Preference } from "mercadopago";

import { ENV_CONFIG } from "@/config/env";

function createClient() {
  if (!ENV_CONFIG.MP_ACCESS_TOKEN) {
    throw new Error("MP_ACCESS_TOKEN is not set. Copy .env.example to .env and fill it in.");
  }

  return new MercadoPagoConfig({
    accessToken: ENV_CONFIG.MP_ACCESS_TOKEN,
  });
}

const client = createClient();

export async function createVotePreference(teamId: string, teamName: string, fingerprint: string) {
  const preference = new Preference(client);

  const baseUrl = ENV_CONFIG.NEXT_PUBLIC_BASE_URL;

  const result = await preference.create({
    body: {
      items: [
        {
          id: teamId,
          title: `Voto por ${teamName}`,
          quantity: 1,
          unit_price: Number(ENV_CONFIG.VOTE_PRICE_ARS ?? 1000),
          currency_id: "ARS",
        },
      ],
      external_reference: `${teamId}|${fingerprint}`,
      back_urls: {
        success: `${baseUrl}/voto/exitoso`,
        failure: `${baseUrl}/voto/fallido`,
        pending: `${baseUrl}/voto/pendiente`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/webhook`,
    },
  });

  return result;
}
