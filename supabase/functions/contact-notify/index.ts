import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = "officialshopijavid@gmail.com";

function buildContactEmailHTML(opts: {
  name: string;
  email: string;
  company: string;
  phone: string;
  services: string[];
  budget: string;
  message: string;
  workWith: string;
  consultationCode: string;
  timestamp: string;
}): string {
  const servicesList = opts.services.length > 0
    ? opts.services.map((s) => `<li style="padding:4px 0;">${s}</li>`).join("")
    : "<li>None specified</li>";

  const rows = [
    ["Name", opts.name],
    ["Email", opts.email],
    ["Company", opts.company || "Not provided"],
    ["Phone", opts.phone || "Not provided"],
    ["Budget", opts.budget || "Not specified"],
    ["Wants to work with", opts.workWith || "No preference"],
    ["Consultation Code", opts.consultationCode || "N/A"],
    ["Submitted", opts.timestamp],
  ];
  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#1a1a1a;border:1px solid #e5e5e5;background:#f9fafb;">${k}</td><td style="padding:6px 12px;color:#444;border:1px solid #e5e5e5;">${v}</td></tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="background:#0a0a0a;padding:24px 32px;">
      <h1 style="margin:0;color:#10b981;font-size:22px;letter-spacing:2px;">SHOPIJAVID</h1>
      <p style="margin:4px 0 0;color:#888;font-size:12px;">New Contact Form Submission</p>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:20px;">New Contact Request from ${opts.name}</h2>
      <p style="color:#555;font-size:14px;line-height:1.6;">A potential client has submitted the contact form. Reach out within 24 hours to maintain a professional response time.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">${rowsHtml}</table>
      <h3 style="color:#1a1a1a;font-size:15px;margin:24px 0 8px;">Services Requested</h3>
      <ul style="margin:0;padding-left:20px;color:#444;font-size:14px;">${servicesList}</ul>
      <h3 style="color:#1a1a1a;font-size:15px;margin:24px 0 8px;">Message</h3>
      <div style="background:#fafafa;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;color:#333;border-left:3px solid #10b981;">${opts.message || "No message provided."}</div>
      <div style="text-align:center;margin:28px 0;">
        <a href="mailto:${opts.email}?subject=Re: Your inquiry to SHOPIJAVID&body=Hi ${opts.name},%0D%0A%0D%0AThank you for reaching out to SHOPIJAVID. We have received your message and would love to discuss your project further.%0D%0A%0D%0ABest regards,%0D%0ASHOPIJAVID Team" style="display:inline-block;background:#10b981;color:#fff;font-weight:700;font-size:16px;padding:14px 40px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">REPLY TO ${opts.name.toUpperCase()}</a>
      </div>
    </div>
    <div style="background:#fafafa;padding:16px 32px;text-align:center;">
      <p style="margin:0;color:#999;font-size:11px;">&copy; ${new Date().getFullYear()} SHOPIJAVID. What matters is results.</p>
    </div>
  </div>
</body></html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      name,
      email,
      company,
      phone,
      services,
      budget,
      message,
      workWith,
      consultationCode,
    } = body;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, message" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Persist to database (work_with column may not exist yet — insert without it)
    const insertData: Record<string, any> = {
      name,
      email,
      company,
      phone,
      services: services || [],
      budget,
      message,
      consultation_code: consultationCode,
    };
    if (workWith) insertData.work_with = workWith;

    const { error: dbError } = await supabase.from("sj_contacts").insert(insertData);

    if (dbError) {
      console.error("Database insert error:", dbError.message);
    }

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Toronto",
      dateStyle: "full",
      timeStyle: "short",
    });

    // Send email via Resend if configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    let emailSent = false;

    if (resendApiKey) {
      const emailHtml = buildContactEmailHTML({
        name,
        email,
        company: company || "",
        phone: phone || "",
        services: services || [],
        budget: budget || "",
        message: message || "",
        workWith: workWith || "",
        consultationCode: consultationCode || "",
        timestamp,
      });

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "SHOPIJAVID <noreply@shopijavid.com>",
          to: [ADMIN_EMAIL],
          subject: `New Contact Request from ${name}${consultationCode ? ` [${consultationCode}]` : ""}`,
          html: emailHtml,
          reply_to: email,
        }),
      });

      if (emailResponse.ok) {
        emailSent = true;
      } else {
        const errText = await emailResponse.text();
        console.error("Email send failed:", errText);
      }
    } else {
      console.log("RESEND_API_KEY not configured. Email notification skipped. Contact saved to database.");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact form submitted successfully",
        emailSent,
        consultationCode,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
