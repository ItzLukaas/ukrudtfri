import { sendCorrectedBookingConfirmationEmail } from "@/lib/mail";

async function main() {
  const result = await sendCorrectedBookingConfirmationEmail({
    to: "kontaktsvendsen@gmail.com",
    customerName: "Lukas",
    whenLabel: "fredag den 2. maj 2026 kl. 13.00-15.00",
    addressLabel: "Hyldevang 44, 7323 Give",
    squareMeters: 320,
    totalPriceDkk: 480,
  });

  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
