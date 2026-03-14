/**
 * San Diego Professional Headshots - Team Headshot Pricing Calculator
 * Version 2.1
 */
var SDPH_CONFIG = {
  formspreeURL: "https://formspree.io/f/xnjgzvpn",
  onsiteFee: 299,
  groupRate: 250,
  baseRate: 200,
  retainer: 500
};

(function() {

  var mS = document.getElementById("sdph-ms");
  var mN = document.getElementById("sdph-mn");
  var gS = document.getElementById("sdph-gs");
  var gN = document.getElementById("sdph-gn");
  var pricingBody = document.getElementById("sdph-pricing-body");

  if (!mS || !mN || !gS || !gN || !pricingBody) {
    console.warn("SDPH Calculator: Required elements not found.");
    return;
  }

  function sliderToMembers(s) {
    s = +s;
    if (s <= 500) return Math.round(3 + (s / 500) * 47);
    return Math.round(50 + ((s - 500) / 500) * 150);
  }

  function membersToSlider(m) {
    m = +m;
    if (m <= 50) return Math.round(((m - 3) / 47) * 500);
    return Math.round(500 + ((m - 50) / 150) * 500);
  }

  function getRate(n) {
    if (n >= 80) return 90;
    if (n >= 70) return 95;
    if (n >= 60) return 100;
    if (n >= 50) return 105;
    if (n >= 45) return 110;
    if (n >= 40) return 115;
    if (n >= 35) return 120;
    if (n >= 30) return 125;
    if (n >= 25) return 130;
    if (n >= 20) return 140;
    if (n >= 15) return 150;
    if (n >= 10) return 160;
    if (n >= 7) return 170;
    if (n >= 5) return 180;
    if (n >= 3) return SDPH_CONFIG.baseRate;
    return 0;
  }

  function fmt(n) {
    return "$" + n.toLocaleString("en-US");
  }

  function getData() {
    var locEl = document.getElementById("sdph-location");
    var m = Math.max(3, Math.min(200, parseInt(mN.value) || 3));
    var g = Math.max(0, Math.min(10, parseInt(gN.value) || 0));
    var on = locEl ? locEl.value === "onsite" : true;
    var r = getRate(m);
    var ht = m * r;
    var osFee = on ? SDPH_CONFIG.onsiteFee : 0;
    var gt = g * SDPH_CONFIG.groupRate;
    var st = ht + osFee + gt;
    var pct = Math.round(((SDPH_CONFIG.baseRate - r) / SDPH_CONFIG.baseRate) * 100);
    var mins;
    if (m <= 4) { mins = m * 15; }
    else if (m <= 12) { mins = 60; }
    else { mins = m * 5; }
    mins += g * 10;
    var ts;
    if (mins < 60) {
      ts = "~" + mins + " minutes";
    } else {
      var h = Math.floor(mins / 60);
      var mn = mins % 60;
      ts = "~" + h + (h === 1 ? " hour" : " hours") + (mn > 0 ? " " + mn + " min" : "");
    }
    return {
      m: m, g: g, on: on, r: r, ht: ht, osFee: osFee, gt: gt, st: st,
      pct: pct, ts: ts, loc: on ? "On-Site (Office, Hotel, Etc.)" : "Studio"
    };
  }

  function buildPricingHTML(d) {
    var L = "";
    L += "<div class=\"pricing-line\"><span class=\"ll\">Team Members<\/span><span class=\"lv\">" + d.m + "<\/span><\/div>";
    L += "<div class=\"pricing-line\"><span class=\"ll\">Per Person Rate<\/span><span class=\"lv\">$" + d.r.toFixed(2) + "<\/span><\/div>";
    L += "<div class=\"pricing-line\"><span class=\"ll\">Headshots Total<\/span><span class=\"lv\">" + fmt(d.ht) + "<\/span><\/div>";
    if (d.on) {
      L += "<div class=\"pricing-line\"><span class=\"ll\">On-Site Setup Fee<\/span><span class=\"lv\">$" + SDPH_CONFIG.onsiteFee + "<\/span><\/div>";
    }
    if (d.g > 0) {
      L += "<div class=\"pricing-line\"><span class=\"ll\">Group Portraits<\/span><span class=\"lv\">" + fmt(d.gt) + "<\/span><\/div>";
    }
    L += "<div class=\"pricing-line hl\"><span class=\"ll\">Session Total<\/span><span class=\"lv\">" + fmt(d.st) + "<\/span><\/div>";
    if (d.pct > 0) {
      L += "<div class=\"sav\"><span>Volume discount: " + d.pct + "% off base rate<\/span><\/div>";
    }
    L += "<div class=\"stm\"><span>Estimated session time: " + d.ts + "<\/span><\/div>";
    return L;
  }

  function calc() {
    var d = getData();
    mN.value = d.m;
    mS.value = membersToSlider(d.m);
    gN.value = d.g;
    gS.value = d.g;
    pricingBody.innerHTML = buildPricingHTML(d);
  }

  mS.addEventListener("input", function() { mN.value = sliderToMembers(mS.value); calc(); });
  mN.addEventListener("input", function() { mS.value = membersToSlider(mN.value); calc(); });
  mN.addEventListener("blur", function() { mS.value = membersToSlider(mN.value); calc(); });
  gS.addEventListener("input", function() { gN.value = gS.value; calc(); });
  gN.addEventListener("input", calc);
  gN.addEventListener("blur", calc);

  var locEl = document.getElementById("sdph-location");
  if (locEl) {
    locEl.addEventListener("change", calc);
    locEl.addEventListener("input", calc);
  }

  calc();


  /* CONDITIONAL SOURCE DETAIL FIELD */
  var srcSelect = document.getElementById("sf-src");
  var srcDetailWrap = document.getElementById("sf-src-detail-wrap");
  var srcDetailLabel = document.getElementById("sf-src-detail-label");
  var srcDetailInput = document.getElementById("sf-src-detail");
  if (srcSelect && srcDetailWrap) {
    srcDetailWrap.style.display = "none";
    srcSelect.addEventListener("change", function() {
      var val = srcSelect.value;
      if (val === "AI") {
        srcDetailLabel.textContent = "Which AI platform?";
        srcDetailInput.placeholder = "e.g. ChatGPT, Perplexity, Gemini...";
        srcDetailWrap.style.display = "flex";
      } else if (val === "Social Media") {
        srcDetailLabel.textContent = "Which platform?";
        srcDetailInput.placeholder = "e.g. Instagram, Facebook, TikTok...";
        srcDetailWrap.style.display = "flex";
      } else if (val === "Other") {
        srcDetailLabel.textContent = "Please specify";
        srcDetailInput.placeholder = "How did you find us?";
        srcDetailWrap.style.display = "flex";
      } else if (val === "Referral") {
        srcDetailLabel.textContent = "Who referred you?";
        srcDetailInput.placeholder = "Name or company";
        srcDetailWrap.style.display = "flex";
      } else {
        srcDetailWrap.style.display = "none";
        srcDetailInput.value = "";
      }
    });
  }


  /* MODAL */
  var ov = document.getElementById("sdph-ov");
  var fv = document.getElementById("sdph-fv");
  var sv = document.getElementById("sdph-sv");
  var scr = document.getElementById("sdph-scr");
  var err = document.getElementById("sdph-err");
  var sendBtn = document.getElementById("sdph-send");

  function openModal() {
    var d = getData();
    var sum = document.getElementById("sdph-sum");
    var html = "";
    html += "<div class=\"sdph-sr\"><span>Session Location<\/span><span>" + d.loc + "<\/span><\/div>";
    html += "<div class=\"sdph-sr\"><span>Team Members<\/span><span>" + d.m + "<\/span><\/div>";
    html += "<div class=\"sdph-sr\"><span>Per Person Rate<\/span><span>$" + d.r.toFixed(2) + "<\/span><\/div>";
    html += "<div class=\"sdph-sr\"><span>Headshots Total<\/span><span>" + fmt(d.ht) + "<\/span><\/div>";
    if (d.on) {
      html += "<div class=\"sdph-sr\"><span>On-Site Setup Fee<\/span><span>$" + SDPH_CONFIG.onsiteFee + "<\/span><\/div>";
    }
    if (d.g > 0) {
      html += "<div class=\"sdph-sr\"><span>Group Portraits (" + d.g + ")<\/span><span>" + fmt(d.gt) + "<\/span><\/div>";
    }
    html += "<div class=\"sdph-stot\"><span>Estimated Total<\/span><span>" + fmt(d.st) + "<\/span><\/div>";
    sum.innerHTML = html;
    fv.classList.remove("hidden");
    sv.classList.add("hidden");
    err.classList.add("hidden");
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
    ov.classList.add("active");
    document.body.style.overflow = "hidden";
    document.body.classList.add("sdph-modal-open");
    scr.scrollTop = 0;
  }

  function closeModal() {
    ov.classList.remove("active");
    document.body.style.overflow = "";
    document.body.classList.remove("sdph-modal-open");
  }

  document.getElementById("sdph-cta").addEventListener("click", openModal);
  document.getElementById("sdph-x").addEventListener("click", closeModal);
  document.getElementById("sdph-sucb").addEventListener("click", closeModal);
  ov.addEventListener("click", function(e) { if (e.target === ov) closeModal(); });
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && ov.classList.contains("active")) closeModal();
  });


  /* FORM SUBMIT */
  sendBtn.addEventListener("click", function() {
    var fn = document.getElementById("sf-fn").value.trim();
    var ln = document.getElementById("sf-ln").value.trim();
    var em = document.getElementById("sf-em").value.trim();
    if (!fn || !ln || !em) {
      err.classList.remove("hidden");
      return;
    }
    err.classList.add("hidden");
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";
    var d = getData();
    var srcVal = document.getElementById("sf-src").value;
    var srcDetail = document.getElementById("sf-src-detail").value.trim();
    var referralSource = srcVal;
    if (srcDetail && (srcVal === "AI" || srcVal === "Social Media" || srcVal === "Other" || srcVal === "Referral")) {
      referralSource = srcVal + " - " + srcDetail;
    }
    var payload = {
      first_name: fn,
      last_name: ln,
      company: document.getElementById("sf-co").value.trim(),
      email: em,
      phone: document.getElementById("sf-ph").value.trim(),
      preferred_date: document.getElementById("sf-dt").value,
      preferred_time: document.getElementById("sf-tm").value,
      venue: document.getElementById("sf-vn").value.trim(),
      details: document.getElementById("sf-det").value.trim(),
      referral_source: referralSource,
      session_location: d.loc,
      team_members: d.m,
      per_person_rate: "$" + d.r.toFixed(2),
      headshots_total: fmt(d.ht),
      group_portraits: d.g,
      group_total: fmt(d.gt),
      onsite_fee: d.on ? "$" + SDPH_CONFIG.onsiteFee : "$0",
      session_total: fmt(d.st),
      estimated_time: d.ts
    };
    fetch(SDPH_CONFIG.formspreeURL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(function(res) {
      if (res.ok) {
        fv.classList.add("hidden");
        sv.classList.remove("hidden");
        scr.scrollTop = 0;
        document.getElementById("sf-fn").value = "";
        document.getElementById("sf-ln").value = "";
        document.getElementById("sf-co").value = "";
        document.getElementById("sf-em").value = "";
        document.getElementById("sf-ph").value = "";
        document.getElementById("sf-dt").value = "";
        document.getElementById("sf-tm").value = "";
        document.getElementById("sf-vn").value = "";
        document.getElementById("sf-det").value = "";
        document.getElementById("sf-src").value = "";
        document.getElementById("sf-src-detail").value = "";
        document.getElementById("sf-src-detail-wrap").style.display = "none";
      } else {
        err.textContent = "Something went wrong. Please try again or contact us directly.";
        err.classList.remove("hidden");
        sendBtn.disabled = false;
        sendBtn.textContent = "Send";
      }
    })
    .catch(function() {
      err.textContent = "Something went wrong. Please try again or contact us directly.";
      err.classList.remove("hidden");
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";
    });
  });


  /* PRINT */
  document.getElementById("sdph-print-btn").addEventListener("click", function() {
    var d = getData();
    var today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    var h = [];
    h.push("<!DOCTYPE html><html><head><meta charset=\"utf-8\">");
    h.push("<title>Session Estimate<\/title>");
    h.push("<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@400&display=swap\" rel=\"stylesheet\">");
    h.push("<style>*{margin:0;padding:0;box-sizing:border-box;font-family:Inter,sans-serif}body{background:#fff}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}<\/style>");
    h.push("<\/head><body>");
    h.push("<div style=\"max-width:700px;margin:0 auto;padding:28px 30px\">");
    h.push("<div style=\"background:#0A3258;border-radius:8px 8px 0 0;padding:26px 32px;display:flex;justify-content:space-between;align-items:flex-start\">");
    h.push("<div><div style=\"font-family:Oswald,sans-serif;font-size:22px;font-weight:400;color:#fff;text-transform:uppercase\">SAN DIEGO PROFESSIONAL HEADSHOTS<\/div>");
    h.push("<div style=\"font-size:11px;color:rgba(255,255,255,.65);margin-top:4px\">INDIVIDUALS | TEAMS | EVENTS<\/div><\/div>");
    h.push("<div style=\"text-align:right;font-size:12px;color:rgba(255,255,255,.85);line-height:1.7\">7950 Silverton Ave, Suite 107<br>San Diego, CA 92126<br>(619) 618-8003<br>info@sandiegoprofessionalheadshots.com<\/div><\/div>");
    h.push("<div style=\"border:1px solid #e2e2e2;border-top:none;border-radius:0 0 8px 8px;padding:28px 32px\">");
    h.push("<div style=\"display:flex;justify-content:space-between;margin-bottom:22px\"><div style=\"font-size:22px;font-weight:700\">Session Estimate<\/div><div style=\"font-size:12px;color:#888\">" + today + "<\/div><\/div>");
    h.push("<div style=\"background:#f8f9fa;border-radius:6px;padding:14px 18px;margin-bottom:22px\">");
    var ds = [["Session Location", d.loc], ["Team Members", "" + d.m], ["Group Portraits", "" + d.g]];
    for (var i = 0; i < ds.length; i++) {
      h.push("<div style=\"display:flex;justify-content:space-between;font-size:13px;color:#555;" + (i < 2 ? "margin-bottom:6px" : "") + "\"><span>" + ds[i][0] + "<\/span><span style=\"font-weight:600;color:#1a1a1a\">" + ds[i][1] + "<\/span><\/div>");
    }
    h.push("<\/div>");
    h.push("<table style=\"width:100%;border-collapse:collapse;margin-bottom:8px\">");
    var pr = [["Team Members", "" + d.m], ["Per Person Rate", "$" + d.r.toFixed(2)], ["Headshots Total", fmt(d.ht)]];
    if (d.g > 0) { pr.push(["Group Portraits (" + d.g + ")", fmt(d.gt)]); }
    if (d.on) { pr.push(["On-Site Setup Fee", "$" + SDPH_CONFIG.onsiteFee]); }
    for (var j = 0; j < pr.length; j++) {
      h.push("<tr style=\"border-bottom:1px solid #e8e8e8\"><td style=\"padding:12px 18px;font-size:14px;color:#333\">" + pr[j][0] + "<\/td><td style=\"padding:12px 18px;font-size:14px;font-weight:600;text-align:right\">" + pr[j][1] + "<\/td><\/tr>");
    }
    h.push("<tr><td style=\"padding:14px 18px;font-size:16px;font-weight:700;border-top:2px solid #0A3258\">Session Total<\/td><td style=\"padding:14px 18px;font-size:20px;font-weight:700;color:#0A3258;text-align:right;border-top:2px solid #0A3258\">" + fmt(d.st) + "<\/td><\/tr><\/table>");
    if (d.pct > 0) {
      h.push("<div style=\"display:inline-block;background:#e8f5e9;color:#2e7d32;font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px;margin-top:12px\">Volume discount: " + d.pct + "% off base rate<\/div>");
    }
    h.push("<div style=\"font-size:12px;color:#777;margin-top:8px\">Estimated session time: " + d.ts + "<\/div>");
    h.push("<hr style=\"border:none;border-top:1px solid #e8e8e8;margin:22px 0\">");
    h.push("<div style=\"font-size:15px;font-weight:700;margin-bottom:10px\">Ready to Book?<\/div>");
    h.push("<div style=\"font-size:13px;color:#555;line-height:1.6\">Contact us to confirm your session date and details. We will coordinate all logistics so your team can focus on what matters.<\/div>");
    h.push("<div style=\"margin-top:12px;font-size:13px\"><span style=\"color:#0A3258;font-weight:600\">(619) 618-8003<\/span> <span style=\"color:#ccc\">|<\/span> <span style=\"color:#0A3258;font-weight:600\">info@sandiegoprofessionalheadshots.com<\/span><\/div>");
    h.push("<div style=\"margin-top:8px;font-size:13px;color:#0A3258;font-weight:600\">www.sandiegoprofessionalheadshots.com<\/div>");
    h.push("<div style=\"margin-top:22px;font-size:10px;color:#999;line-height:1.5\">Pricing shown is an estimate. Per-person rates reflect projected volume and may adjust if headcount changes. Final invoicing reflects actual services. A $" + SDPH_CONFIG.retainer + " non-refundable retainer and signed photography agreement are required.<\/div>");
    h.push("<\/div><\/div><\/body><\/html>");
    var w = window.open("", "_blank", "width=800,height=900");
    w.document.write(h.join(""));
    w.document.close();
    setTimeout(function() { w.print(); }, 400);
  });


  /* PDF DOWNLOAD */
  document.getElementById("sdph-dl-btn").addEventListener("click", function() {
    function buildPDF() {
      var d = getData();
      var JP = window.jspdf.jsPDF;
      var doc = new JP({ unit: "mm", format: "letter" });
      var W = 215.9, M = 25, CW = W - M * 2, y = 0, rX = W - M;
      var nv = [6, 36, 68], dk = [26, 26, 26], gr = [85, 85, 85], lg = [136, 136, 136];
      var gn = [46, 125, 50], bg = [248, 249, 250], ln = [232, 232, 232];
      var today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      doc.setFillColor(nv[0], nv[1], nv[2]);
      doc.rect(0, 0, W, 38, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("SAN DIEGO PROFESSIONAL HEADSHOTS", M, 16);
      doc.setFontSize(8);
      doc.text("INDIVIDUALS  |  TEAMS  |  EVENTS", M, 23);
      doc.setFontSize(9);
      doc.setTextColor(220, 220, 220);
      doc.text("7950 Silverton Ave, Suite 107", rX, 12, { align: "right" });
      doc.text("San Diego, CA 92126", rX, 17, { align: "right" });
      doc.text("(619) 618-8003", rX, 22, { align: "right" });
      doc.text("info@sandiegoprofessionalheadshots.com", rX, 27, { align: "right" });
      y = 48;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(dk[0], dk[1], dk[2]);
      doc.text("Session Estimate", M, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(lg[0], lg[1], lg[2]);
      doc.text(today, rX, y, { align: "right" });
      y += 12;
      doc.setFillColor(bg[0], bg[1], bg[2]);
      doc.roundedRect(M, y - 4, CW, 26, 3, 3, "F");
      var dr = [["Session Location", d.loc], ["Team Members", "" + d.m], ["Group Portraits", "" + d.g]];
      for (var i = 0; i < dr.length; i++) {
        var ry = y + 3 + i * 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(gr[0], gr[1], gr[2]);
        doc.text(dr[i][0], M + 10, ry);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(dk[0], dk[1], dk[2]);
        doc.text(dr[i][1], W - M - 10, ry, { align: "right" });
      }
      y += 30;
      var pr = [["Team Members", "" + d.m], ["Per Person Rate", "$" + d.r.toFixed(2)], ["Headshots Total", fmt(d.ht)]];
      if (d.g > 0) { pr.push(["Group Portraits (" + d.g + ")", fmt(d.gt)]); }
      if (d.on) { pr.push(["On-Site Setup Fee", "$" + SDPH_CONFIG.onsiteFee]); }
      doc.setFontSize(10);
      for (var j = 0; j < pr.length; j++) {
        var ry2 = y + j * 10;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(dk[0], dk[1], dk[2]);
        doc.text(pr[j][0], M + 6, ry2);
        doc.setFont("helvetica", "bold");
        doc.text(pr[j][1], W - M - 6, ry2, { align: "right" });
        doc.setDrawColor(ln[0], ln[1], ln[2]);
        doc.setLineWidth(0.3);
        doc.line(M, ry2 + 3, W - M, ry2 + 3);
      }
      y += pr.length * 10 + 4;
      doc.setDrawColor(nv[0], nv[1], nv[2]);
      doc.setLineWidth(0.8);
      doc.line(M, y, W - M, y);
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(dk[0], dk[1], dk[2]);
      doc.text("Session Total", M + 6, y);
      doc.setFontSize(15);
      doc.setTextColor(nv[0], nv[1], nv[2]);
      doc.text(fmt(d.st), W - M - 6, y, { align: "right" });
      y += 10;
      if (d.pct > 0) {
        doc.setFillColor(232, 245, 233);
        doc.roundedRect(M, y - 4, 68, 7, 3, 3, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(gn[0], gn[1], gn[2]);
        doc.text("Volume discount: " + d.pct + "% off base rate", M + 4, y + 1);
        y += 10;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(lg[0], lg[1], lg[2]);
      doc.text("Estimated session time: " + d.ts, M, y);
      y += 12;
      doc.setDrawColor(ln[0], ln[1], ln[2]);
      doc.setLineWidth(0.3);
      doc.line(M, y, W - M, y);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(dk[0], dk[1], dk[2]);
      doc.text("Ready to Book?", M, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(gr[0], gr[1], gr[2]);
      var bt = doc.splitTextToSize("Contact us to confirm your session date and details. We will coordinate all logistics so your team can focus on what matters.", CW);
      doc.text(bt, M, y);
      y += bt.length * 5 + 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(nv[0], nv[1], nv[2]);
      doc.text("(619) 618-8003", M, y);
      doc.text("|", M + 28, y);
      doc.text("info@sandiegoprofessionalheadshots.com", M + 32, y);
      y += 6;
      doc.text("www.sandiegoprofessionalheadshots.com", M, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      var disc = doc.splitTextToSize("Pricing shown is an estimate based on the information provided. Per-person rates reflect projected volume and may adjust if the final headcount changes. Final invoicing reflects actual services rendered. A $" + SDPH_CONFIG.retainer + " non-refundable retainer and signed photography agreement are required to secure your booking.", CW);
      doc.text(disc, M, y);
      doc.save("Team-Headshot-Estimate.pdf");
    }
    if (window.jspdf) {
      buildPDF();
    } else {
      var s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = buildPDF;
      document.head.appendChild(s);
    }
  });

})();
