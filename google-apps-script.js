// ============================================================
// Google Apps Script — MarketScore Alpha Provider Applications
// ============================================================
//
// SETUP:
// 1. Open your Google Sheet "MarketScore IB application"
// 2. Go to Extensions > Apps Script
// 3. Delete ALL existing code
// 4. Paste this ENTIRE file
// 5. Click Save (Ctrl+S)
// 6. Click Deploy > New Deployment
// 7. Type: Web app | Execute as: Me | Access: Anyone
// 8. Click Deploy > Authorize > Allow
// 9. Copy the new Web App URL
// 10. Update the URL in App.jsx
// ============================================================

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the data - handle all possible formats
    var data = {};

    // Try e.parameter first (works with form-urlencoded from browser)
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    }
    // Try parsing postData
    else if (e.postData && e.postData.contents) {
      var contents = e.postData.contents;
      try {
        data = JSON.parse(contents);
      } catch (err) {
        // Parse URL-encoded string manually
        var pairs = contents.split("&");
        for (var i = 0; i < pairs.length; i++) {
          var kv = pairs[i].split("=");
          if (kv.length === 2) {
            data[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1].replace(/\+/g, " "));
          }
        }
      }
    }

    // Log for debugging
    Logger.log("Received data: " + JSON.stringify(data));

    var fullName = data.fullName || "";
    var email = data.email || "";
    var whatsapp = data.whatsapp || "";
    var providerType = data.providerType || "";
    var audienceSize = data.audienceSize || "";
    var platform = data.platform || "";
    var message = data.message || "";

    // Append to sheet
    sheet.appendRow([
      Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy, HH:mm:ss"),
      fullName,
      email,
      "'" + whatsapp,
      providerType,
      audienceSize,
      platform,
      message,
      "Pending"
    ]);

    // Send confirmation email
    if (email && email.indexOf("@") > -1) {
      sendConfirmationEmail(fullName, email, whatsapp, providerType, audienceSize, platform);
    }

    lock.releaseLock();

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("ERROR: " + error.message);
    Logger.log("Event object: " + JSON.stringify(e));

    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests with parameters (alternative submission method)
  if (e.parameter && e.parameter.fullName) {
    return doPost(e);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "MarketScore API is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendConfirmationEmail(fullName, email, whatsapp, providerType, audienceSize, platform) {
  var subject = "MarketScore - Application Received Successfully";

  var htmlBody = ""
    + "<html><body style='margin:0;padding:0;background:#04070D;font-family:Arial,sans-serif;'>"
    + "<table width='100%' cellpadding='0' cellspacing='0' style='background:#04070D;padding:40px 20px;'>"
    + "<tr><td align='center'>"
    + "<table width='600' cellpadding='0' cellspacing='0' style='background:#0B1120;border-radius:16px;border:1px solid #1A2744;'>"

    // Header
    + "<tr><td style='background:linear-gradient(135deg,#00E5B0,#00B88E);padding:28px 40px;text-align:center;border-radius:16px 16px 0 0;'>"
    + "<h1 style='margin:0;color:#04070D;font-size:22px;font-weight:900;'>MarketScore</h1>"
    + "<p style='margin:4px 0 0;color:#04070D;font-size:13px;opacity:0.7;'>Alpha Provider Program</p>"
    + "</td></tr>"

    // Success message
    + "<tr><td style='padding:40px;'>"
    + "<div style='text-align:center;margin-bottom:24px;'>"
    + "<div style='display:inline-block;width:56px;height:56px;line-height:56px;border-radius:50%;background:#00E5B0;color:#04070D;font-size:28px;font-weight:bold;'>&#10003;</div>"
    + "</div>"
    + "<h2 style='color:#F0F4F8;font-size:22px;text-align:center;margin:0 0 8px;'>Application Received!</h2>"
    + "<p style='color:#8B9DC3;font-size:15px;text-align:center;margin:0 0 32px;line-height:1.6;'>Hi " + fullName + ", thank you for applying to become an Alpha Provider.</p>"

    // Details box
    + "<table width='100%' cellpadding='0' cellspacing='0' style='background:#111B2E;border-radius:12px;border:1px solid #1A2744;'>"
    + "<tr><td style='padding:24px;'>"
    + "<h3 style='color:#00E5B0;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 16px;'>Application Details</h3>"
    + "<table width='100%' cellpadding='0' cellspacing='0'>"
    + "<tr><td style='padding:8px 0;color:#8B9DC3;font-size:13px;width:130px;'>Full Name</td><td style='padding:8px 0;color:#F0F4F8;font-size:14px;font-weight:600;'>" + fullName + "</td></tr>"
    + "<tr><td style='padding:8px 0;color:#8B9DC3;font-size:13px;'>Email</td><td style='padding:8px 0;color:#F0F4F8;font-size:14px;font-weight:600;'>" + email + "</td></tr>"
    + "<tr><td style='padding:8px 0;color:#8B9DC3;font-size:13px;'>WhatsApp</td><td style='padding:8px 0;color:#F0F4F8;font-size:14px;font-weight:600;'>" + whatsapp + "</td></tr>"
    + "<tr><td style='padding:8px 0;color:#8B9DC3;font-size:13px;'>Provider Type</td><td style='padding:8px 0;color:#F0F4F8;font-size:14px;font-weight:600;'>" + providerType + "</td></tr>"
    + (audienceSize ? "<tr><td style='padding:8px 0;color:#8B9DC3;font-size:13px;'>Audience Size</td><td style='padding:8px 0;color:#F0F4F8;font-size:14px;font-weight:600;'>" + audienceSize + "</td></tr>" : "")
    + (platform ? "<tr><td style='padding:8px 0;color:#8B9DC3;font-size:13px;'>Platform</td><td style='padding:8px 0;color:#F0F4F8;font-size:14px;font-weight:600;'>" + platform + "</td></tr>" : "")
    + "</table>"
    + "</td></tr></table>"

    // Next steps
    + "<div style='margin-top:28px;padding:24px;background:#111B2E;border-radius:12px;border:1px solid #1A2744;'>"
    + "<h3 style='color:#F0F4F8;font-size:15px;margin:0 0 16px;'>What happens next?</h3>"
    + "<table cellpadding='0' cellspacing='0'>"
    + "<tr><td style='padding:6px 12px 6px 0;vertical-align:top;'><div style='width:24px;height:24px;line-height:24px;border-radius:6px;background:#00E5B0;color:#04070D;font-size:12px;font-weight:bold;text-align:center;'>1</div></td><td style='padding:6px 0;color:#8B9DC3;font-size:14px;line-height:24px;'>Our team reviews your application</td></tr>"
    + "<tr><td style='padding:6px 12px 6px 0;vertical-align:top;'><div style='width:24px;height:24px;line-height:24px;border-radius:6px;background:#00E5B0;color:#04070D;font-size:12px;font-weight:bold;text-align:center;'>2</div></td><td style='padding:6px 0;color:#8B9DC3;font-size:14px;line-height:24px;'>We contact you via WhatsApp within 48 hours</td></tr>"
    + "<tr><td style='padding:6px 12px 6px 0;vertical-align:top;'><div style='width:24px;height:24px;line-height:24px;border-radius:6px;background:#00E5B0;color:#04070D;font-size:12px;font-weight:bold;text-align:center;'>3</div></td><td style='padding:6px 0;color:#8B9DC3;font-size:14px;line-height:24px;'>Your Alpha Provider channel goes live</td></tr>"
    + "<tr><td style='padding:6px 12px 6px 0;vertical-align:top;'><div style='width:24px;height:24px;line-height:24px;border-radius:6px;background:#00E5B0;color:#04070D;font-size:12px;font-weight:bold;text-align:center;'>4</div></td><td style='padding:6px 0;color:#8B9DC3;font-size:14px;line-height:24px;'>You start earning on every lot traded</td></tr>"
    + "</table>"
    + "</div>"

    + "</td></tr>"

    // Footer
    + "<tr><td style='padding:20px 40px;border-top:1px solid #1A2744;text-align:center;'>"
    + "<p style='color:#4A5D80;font-size:11px;margin:0;line-height:1.6;'>MarketScore is a technology platform. All trading involves risk.</p>"
    + "<p style='color:#4A5D80;font-size:11px;margin:8px 0 0;'>&copy; 2026 MarketScore. All rights reserved.</p>"
    + "</td></tr>"

    + "</table>"
    + "</td></tr></table>"
    + "</body></html>";

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: "MarketScore"
  });
}

// Test function - run this manually to verify sheet access works
function testAppend() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy, HH:mm:ss"),
    "Manual Test",
    "test@test.com",
    "'+91 12345",
    "Signal Provider",
    "100-500",
    "Telegram",
    "Manual test row",
    "Pending"
  ]);
  Logger.log("Test row added successfully");
}
