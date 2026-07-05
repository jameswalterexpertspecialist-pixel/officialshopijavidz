import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = "officialshopijavid@gmail.com";

function generateTicketNumber(): string {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SJ-${ymd}-${rand}`;
}

function buildEmailHTML(opts: {
  userName: string;
  userEmail: string;
  userPhone: string;
  userCompany: string;
  subject: string;
  pageSource: string;
  ticketNumber: string;
  priority: string;
  conversationSummary: string;
  timestamp: string;
  joinUrl: string;
}): string {
  const rows = [
    ['Visitor Name', opts.userName || 'Not provided'],
    ['Visitor Email', opts.userEmail || 'Not provided'],
    ['Visitor Phone', opts.userPhone || 'Not provided'],
    ['Company', opts.userCompany || 'Not provided'],
    ['Subject', opts.subject || 'Not specified'],
    ['Page Source', opts.pageSource || 'Unknown'],
    ['Ticket Number', opts.ticketNumber],
    ['Priority', opts.priority],
    ['Date & Time', opts.timestamp],
  ];
  const rowsHtml = rows.map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;color:#1a1a1a;border:1px solid #e5e5e5;">${k}</td><td style="padding:6px 12px;color:#444;border:1px solid #e5e5e5;">${v}</td></tr>`).join('');
  const summaryHtml = opts.conversationSummary
    ? opts.conversationSummary.split('\n').map((l) => `<div style="padding:4px 0;border-bottom:1px solid #f0f0f0;">${l.replace(/^(user|ai|agent|system):/i, '<strong style="text-transform:capitalize;">$1:</strong>')}</div>`).join('')
    : '<p style="color:#999;">No conversation history</p>';

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="background:#0a0a0a;padding:24px 32px;">
      <h1 style="margin:0;color:#f59e0b;font-size:22px;letter-spacing:2px;">SHOPIJAVID</h1>
      <p style="margin:4px 0 0;color:#888;font-size:12px;">Live Support Notification</p>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:20px;">New Live Support Request Received</h2>
      <p style="color:#555;font-size:14px;line-height:1.6;">A visitor has requested live support. Please join the conversation as soon as possible.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">${rowsHtml}</table>
      <h3 style="color:#1a1a1a;font-size:15px;margin:24px 0 8px;">Conversation Summary</h3>
      <div style="background:#fafafa;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.5;max-height:300px;overflow-y:auto;">${summaryHtml}</div>
      <div style="text-align:center;margin:28px 0;">
        <a href="${opts.joinUrl}" style="display:inline-block;background:#f59e0b;color:#0a0a0a;font-weight:700;font-size:16px;padding:14px 40px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">JOIN CONVERSATION</a>
      </div>
      <p style="color:#999;font-size:12px;text-align:center;">Or copy this link: ${opts.joinUrl}</p>
    </div>
    <div style="background:#fafafa;padding:16px 32px;text-align:center;">
      <p style="margin:0;color:#999;font-size:11px;">© ${new Date().getFullYear()} SHOPIJAVID. What matters is results.</p>
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
      type,
      sessionId,
      userName,
      userEmail,
      userPhone,
      userCompany,
      subject,
      pageSource,
      conversationSummary,
    } = body;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const ticketNumber = body.ticketNumber || generateTicketNumber();
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Toronto', dateStyle: 'full', timeStyle: 'short' });
    const siteUrl = Deno.env.get("SITE_URL") || (req.headers.get("origin") || "https://shopijavid.com");
    const joinUrl = `${siteUrl}/#/admin?session=${sessionId}`;

    let emailSubject = "";
    let priority = "normal";

    if (type === "live_support_request") {
      emailSubject = `New Live Support Request Received - ${ticketNumber}`;
      priority = "high";
    } else if (type === "fallback_callback") {
      emailSubject = `Live Support Callback Requested - ${ticketNumber}`;
      priority = "high";
    } else if (type === "visitor_new_message") {
      emailSubject = `New Message from Visitor - ${ticketNumber}`;
      priority = "normal";
    } else if (type === "visitor_returned") {
      emailSubject = `Visitor Returned to Conversation - ${ticketNumber}`;
      priority = "normal";
    } else {
      emailSubject = `Live Support Notification - ${ticketNumber}`;
    }

    // Store/update the request in the database
    const { data: existingRequest } = await supabase
      .from("sj_live_requests")
      .select("id")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingRequest) {
      await supabase
        .from("sj_live_requests")
        .update({
          user_email: userEmail,
          user_name: userName,
          user_phone: userPhone,
          purpose: subject,
          page_source: pageSource,
          conversation_summary: conversationSummary,
          ticket_number: ticketNumber,
          status: type === "fallback_callback" ? "waiting_callback" : "waiting",
        })
        .eq("id", existingRequest.id);
    } else {
      await supabase.from("sj_live_requests").insert({
        session_id: sessionId,
        user_email: userEmail,
        user_name: userName,
        user_phone: userPhone,
        purpose: subject,
        page_source: pageSource,
        conversation_summary: conversationSummary,
        ticket_number: ticketNumber,
        status: type === "fallback_callback" ? "waiting_callback" : "waiting",
      });
    }

    // Update session with contact info and ticket number
    await supabase
      .from("sj_live_sessions")
      .update({
        user_email: userEmail,
        user_name: userName,
        user_phone: userPhone,
        user_company: userCompany,
        subject: subject,
        page_source: pageSource,
        ticket_number: ticketNumber,
        priority,
        status: "waiting",
      })
      .eq("session_id", sessionId);

    // Send email via Supabase auth admin invite (as a workaround) or Resend
    // Since we don't have a dedicated email service, we use the database
    // to store the notification. The admin dashboard polls for new notifications.
    // We also attempt to send via Resend if the API key is configured.
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (resendApiKey) {
      const emailHtml = buildEmailHTML({
        userName: userName || '',
        userEmail: userEmail || '',
        userPhone: userPhone || '',
        userCompany: userCompany || '',
        subject: subject || '',
        pageSource: pageSource || '',
        ticketNumber,
        priority,
        conversationSummary: conversationSummary || '',
        timestamp,
        joinUrl,
      });

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "SHOPIJAVID Support <noreply@shopijavid.com>",
          to: [ADMIN_EMAIL],
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (!emailResponse.ok) {
        const errText = await emailResponse.text();
        console.error("Email send failed:", errText);
      }
    } else {
      console.log("RESEND_API_KEY not configured. Email notification skipped. Notification stored in database.");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification processed",
        ticketNumber,
        joinUrl,
        emailSent: !!resendApiKey,
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
