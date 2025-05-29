// app/api/revalidate/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';

// Define the type for the webhook body (optional but helpful)
// You might want to refine this based on Sanity's actual payload structure
interface WebhookBody {
  _type: string;
  slug?: { current?: string };
  // Add other fields you might need from the payload
}

// Export the POST handler
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('Missing SANITY_WEBHOOK_SECRET');
      return NextResponse.json({ message: 'Missing webhook secret' }, { status: 401 });
    }

    // Use parseBody to verify the webhook signature and parse the body
    // `req.text()` is used because parseBody needs the raw string body
    const { body, isValidSignature } = await parseBody<WebhookBody>(req, secret);

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 401 });
    }

    // --- Revalidation Logic ---
    // Start simple: Revalidate the homepage on any relevant update
    // You can refine this later based on the 'body' content (e.g., body._type)

    if (body?._type === 'product' || body?._type === 'category' /* Add other relevant types */) {
      // Revalidate the homepage path
      revalidatePath('/');
      console.log(`Revalidated path: /`);

      // Optional: Revalidate specific product pages if slug exists
      if (body._type === 'product' && body.slug?.current) {
        const productPath = `/product/${body.slug.current}`;
        revalidatePath(productPath);
        console.log(`Revalidated path: ${productPath}`);
      }

      return NextResponse.json({
        message: `Revalidated paths for type: ${body._type}`,
        revalidated: true,
        now: Date.now(),
        body // Optionally return body for debugging
      });
    } else {
      // Ignore webhook events for types you don't need to revalidate
       return NextResponse.json({ message: `No revalidation needed for type: ${body?._type}` });
    }

  } catch (err: unknown) {
    let errorMessage = 'Webhook error';
    if (err instanceof Error) {
       errorMessage = err.message;
    } else if (typeof err === 'string') {
       errorMessage = err;
    }
    console.error('Webhook revalidation error:', errorMessage);
    return NextResponse.json({ message: 'Webhook error', error: errorMessage }, { status: 500 });
  }
}

// Note: It's common practice for webhook handlers to only accept POST requests.
// You can add GET handlers etc. if needed, but it's usually not required for webhooks.