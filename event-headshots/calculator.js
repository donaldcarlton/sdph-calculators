/**
 * San Diego Professional Headshots - Event Headshot Booth Pricing Calculator
 * Version 1.0
 */
var SDPH_EV_CONFIG = {
  webhookURL: "https://hooks.zapier.com/hooks/catch/26507972/uxj812n/",
  halfDayRate: 2499,
  fullDayRate: 4499,
  retouchHalf: 1000,
  retouchFull: 2000,
  hmHalf: 600,
  hmFull: 1000,
  retainer: 500
};

(function() {

  var hdS = document.getElementById("sdph-ev-hds");
  var hdN = document.getElementById("sdph-ev-hdn");
  var fdS = document.getElementById("sdph-ev-fds");
  var fdN = document.getElementById("sdph-ev-fdn");
  var boothEl = document.getElementById("sdph-ev-booths");
  var retouchCk = document.getElementById("sdph-ev-retouch");
  var hmCk = document.getElementById("sdph-ev-hm");
  var pricingBody = document.getElementById("sdph-ev-pricing-body");

  if (!hdS || !hdN || !fdS || !fdN || !pricingBody) {
    console.warn("SDPH Event Calculator: Required elements not found.");
    return;
  }

  function fmt(n) {
    return "$" + n.toLocaleString("en-US");
  }

  function getData() {
    var b = boothEl ? parseInt(boothEl.value) || 1 : 1;
    var hd = Math.max(0, Math.min(10, parseInt(hdN.value) || 0));
    var fd = Math.max(0, Math.min(10, parseInt(fdN.value) || 0));
    var addRetouch = retouchCk ? retouchCk.checked : false;
    var addHM = hmCk ? hmCk.checked : false;
    var hdTotal = hd * SDPH_EV_CONFIG.halfDayRate * b;
    var fdTotal = fd * SDPH_EV_CONFIG.fullDayRate * b;
    var retouchTotal = 0;
    if (addRetouch) {
      retouchTotal = (hd * SDPH_EV_CONFIG.retouchHalf + fd * SDPH_EV_CONFIG.retouchFull) * b;
    }
    var hmTotal = 0;
    if (addHM) {
      hmTotal = (hd * SDPH_EV_CONFIG.hmHalf + fd * SDPH_EV_CONFIG.hmFull) * b;
    }
    var projectTotal = hdTotal + fdTotal + retouchTotal + hmTotal;
    return {
      b: b, hd: hd, fd: fd,
      addRetouch: addRetouch, addHM: addHM,
      hdTotal: hdTotal, fdTotal: fdTotal,
      retouchTotal: retouchTotal, hmTotal: hmTotal,
      projectTotal: projectTotal
    };
  }

  function buildPricingHTML(d) {
    var L = "";
    L += "<div class=\"pricing-line\"><span class=\"ll\">Number of Booths<\/span><span class=\"lv\">" + d.b + "<\/span><\/div>";
    if (d.hdTotal > 0) {
      L += "<div class=\"pricing-line\"><span class=\"ll\">Half-Day Booth Total<\/span><span class=\"lv\">" + fmt(d.hdTotal) + "<\/span><\/div>";
    }
    if (d.fdTotal > 0) {
      L += "<div class=\"pricing-line\"><span class=\"ll\">Full-Day Booth Total<\/span><span class=\"lv\">" + fmt(d.fdTotal) + "<\/span><\/div>";
    }
    if (d.retouchTotal > 0) {
      L += "<div class=\"pricing-line\"><span class=\"ll\">Retouching Package<\/span><span class=\"lv\">" + fmt(d.retouchTotal) + "<\/span><\/div>";
    }
    if (d.hmTotal > 0) {
      L += "<div class=\"pricing-line\"><span class=\"ll\">Professional Hair &amp; Makeup<\/span><span class=\"lv\">" + fmt(d.hmTotal) + "<\/span><\/div>";
    }
    L += "<div class=\"pricing-line hl\"><span class=\"ll\">Project Total<\/span><span class=\"lv\">" + fmt(d.projectTotal) + "<\/span><\/div>";
    return L;
  }

  function calc() {
    var d = getData();
    hdN.value = d.hd;
    hdS.value = d.hd;
    fdN.value = d.fd;
    fdS.value = d.fd;
    pricingBody.innerHTML = buildPricingHTML(d);
  }

  hdS.addEventListener("input", function() { hdN.value = hdS.value; calc(); });
  hdN.addEventListener("input", calc);
  hdN.addEventListener("blur", calc);
  fdS.addEventListener("input", function() { fdN.value = fdS.value; calc(); });
  fdN.addEventListener("input", calc);
  fdN.addEventListener("blur", calc);
  if (boothEl) { boothEl.addEventListener("change", calc); }
  if (retouchCk) { retouchCk.addEventListener("change", calc); }
  if (hmCk) { hmCk.addEventListener("change", calc); }

  calc();


  /* CONDITIONAL SOURCE DETAIL FIELD */
  var srcSelect = document.getElementById("sf-ev-src");
  var srcDetailWrap = document.getElementById("sf-ev-src-detail-wrap");
  var srcDetailLabel = document.getElementById("sf-ev-src-detail-label");
  var srcDetailInput = document.getElementById("sf-ev-src-detail");
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
  var ov = document.getElementById("sdph-ev-ov");
  var fv = document.getElementById("sdph-ev-fv");
  var sv = document.getElementById("sdph-ev-sv");
  var scr = document.getElementById("sdph-ev-scr");
  var err = document.getElementById("sdph-ev-err");
  var sendBtn = document.getElementById("sdph-ev-send");

  /* Prevent mobile browsers from zooming on input focus */
  var vpOriginal = "";
  function lockViewport() {
    var tag = document.querySelector("meta[name=viewport]");
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "viewport";
      tag.content = "width=device-width, initial-scale=1";
      document.head.appendChild(tag);
    }
    vpOriginal = tag.getAttribute("content") || "";
    tag.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
  }
  function unlockViewport() {
    var tag = document.querySelector("meta[name=viewport]");
    if (tag && vpOriginal) {
      tag.setAttribute("content", vpOriginal);
    }
  }

  function buildSummaryRows(d) {
    var rows = [];
    rows.push(["Number of Booths", "" + d.b]);
    if (d.hd > 0) { rows.push(["Half-Days", "" + d.hd]); }
    if (d.fd > 0) { rows.push(["Full-Days", "" + d.fd]); }
    if (d.hdTotal > 0) { rows.push(["Half-Day Booth Total", fmt(d.hdTotal)]); }
    if (d.fdTotal > 0) { rows.push(["Full-Day Booth Total", fmt(d.fdTotal)]); }
    if (d.retouchTotal > 0) { rows.push(["Retouching Package", fmt(d.retouchTotal)]); }
    if (d.hmTotal > 0) { rows.push(["Professional Hair & Makeup", fmt(d.hmTotal)]); }
    return rows;
  }

  function openModal() {
    var d = getData();
    var sum = document.getElementById("sdph-ev-sum");
    var html = "";
    var rows = buildSummaryRows(d);
    for (var i = 0; i < rows.length; i++) {
      html += "<div class=\"sdph-ev-sr\"><span>" + rows[i][0] + "<\/span><span>" + rows[i][1] + "<\/span><\/div>";
    }
    html += "<div class=\"sdph-ev-stot\"><span>Estimated Total<\/span><span>" + fmt(d.projectTotal) + "<\/span><\/div>";
    sum.innerHTML = html;
    fv.classList.remove("hidden");
    sv.classList.add("hidden");
    err.classList.add("hidden");
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
    lockViewport();
    ov.classList.add("active");
    document.body.style.overflow = "hidden";
    document.body.classList.add("sdph-ev-modal-open");
    scr.scrollTop = 0;
  }

  function closeModal() {
    ov.classList.remove("active");
    document.body.style.overflow = "";
    document.body.classList.remove("sdph-ev-modal-open");
    unlockViewport();
  }

  document.getElementById("sdph-ev-cta").addEventListener("click", openModal);
  document.getElementById("sdph-ev-x").addEventListener("click", closeModal);
  document.getElementById("sdph-ev-sucb").addEventListener("click", closeModal);
  ov.addEventListener("click", function(e) { if (e.target === ov) closeModal(); });
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && ov.classList.contains("active")) closeModal();
  });


  /* FORM SUBMIT */
  sendBtn.addEventListener("click", function() {
    var fn = document.getElementById("sf-ev-fn").value.trim();
    var ln = document.getElementById("sf-ev-ln").value.trim();
    var em = document.getElementById("sf-ev-em").value.trim();
    if (!fn || !ln || !em) {
      err.classList.remove("hidden");
      return;
    }
    err.classList.add("hidden");
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";
    var d = getData();
    var srcVal = document.getElementById("sf-ev-src").value;
    var srcDetail = document.getElementById("sf-ev-src-detail").value.trim();
    var referralSource = srcVal;
    if (srcDetail && (srcVal === "AI" || srcVal === "Social Media" || srcVal === "Other" || srcVal === "Referral")) {
      referralSource = srcVal + " - " + srcDetail;
    }
    var formData = new URLSearchParams();
    formData.append("first_name", fn);
    formData.append("last_name", ln);
    formData.append("company", document.getElementById("sf-ev-co").value.trim());
    formData.append("email", em);
    formData.append("phone", document.getElementById("sf-ev-ph").value.trim());
    formData.append("preferred_date", document.getElementById("sf-ev-dt").value);
    formData.append("preferred_time", document.getElementById("sf-ev-tm").value);
    formData.append("venue", document.getElementById("sf-ev-vn").value.trim());
    formData.append("details", document.getElementById("sf-ev-det").value.trim());
    formData.append("referral_source", referralSource);
    formData.append("number_of_booths", d.b);
    formData.append("half_days", d.hd);
    formData.append("full_days", d.fd);
    formData.append("half_day_total", fmt(d.hdTotal));
    formData.append("full_day_total", fmt(d.fdTotal));
    formData.append("retouching", d.addRetouch ? "Yes" : "No");
    formData.append("retouching_total", fmt(d.retouchTotal));
    formData.append("hair_and_makeup", d.addHM ? "Yes" : "No");
    formData.append("hair_and_makeup_total", fmt(d.hmTotal));
    formData.append("project_total", fmt(d.projectTotal));
    fetch(SDPH_EV_CONFIG.webhookURL, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    })
    .then(function() {
        fv.classList.add("hidden");
        sv.classList.remove("hidden");
        scr.scrollTop = 0;
        document.getElementById("sf-ev-fn").value = "";
        document.getElementById("sf-ev-ln").value = "";
        document.getElementById("sf-ev-co").value = "";
        document.getElementById("sf-ev-em").value = "";
        document.getElementById("sf-ev-ph").value = "";
        document.getElementById("sf-ev-dt").value = "";
        document.getElementById("sf-ev-tm").value = "";
        document.getElementById("sf-ev-vn").value = "";
        document.getElementById("sf-ev-det").value = "";
        document.getElementById("sf-ev-src").value = "";
        document.getElementById("sf-ev-src-detail").value = "";
        document.getElementById("sf-ev-src-detail-wrap").style.display = "none";
    })
    .catch(function() {
      err.textContent = "Something went wrong. Please try again or contact us directly.";
      err.classList.remove("hidden");
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";
    });
  });


  /* PRINT */
  document.getElementById("sdph-ev-print-btn").addEventListener("click", function() {
    var d = getData();
    var today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    var h = [];
    h.push("<!DOCTYPE html><html><head><meta charset=\"utf-8\">");
    h.push("<title>Event Booth Estimate<\/title>");
    h.push("<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@400&display=swap\" rel=\"stylesheet\">");
    h.push("<style>*{margin:0;padding:0;box-sizing:border-box;font-family:Inter,sans-serif}body{background:#fff}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}<\/style>");
    h.push("<\/head><body>");
    h.push("<div style=\"max-width:700px;margin:0 auto;padding:28px 30px\">");
    h.push("<div style=\"background:#0A3258;border-radius:8px 8px 0 0;padding:26px 32px;display:flex;justify-content:space-between;align-items:flex-start\">");
    h.push("<div><div style=\"font-family:Oswald,sans-serif;font-size:22px;font-weight:400;color:#fff;text-transform:uppercase\">SAN DIEGO PROFESSIONAL HEADSHOTS<\/div>");
    h.push("<div style=\"font-size:11px;color:rgba(255,255,255,.65);margin-top:4px\">INDIVIDUALS | TEAMS | EVENTS<\/div><\/div>");
    h.push("<div style=\"text-align:right;font-size:12px;color:rgba(255,255,255,.85);line-height:1.7\">7950 Silverton Ave, Suite 107<br>San Diego, CA 92126<br>(619) 618-8003<br>info@sandiegoprofessionalheadshots.com<\/div><\/div>");
    h.push("<div style=\"border:1px solid #e2e2e2;border-top:none;border-radius:0 0 8px 8px;padding:28px 32px\">");
    h.push("<div style=\"display:flex;justify-content:space-between;margin-bottom:22px\"><div style=\"font-size:22px;font-weight:700\">Event Booth Estimate<\/div><div style=\"font-size:12px;color:#888\">" + today + "<\/div><\/div>");
    h.push("<div style=\"background:#f8f9fa;border-radius:6px;padding:14px 18px;margin-bottom:22px\">");
    var ds = [["Number of Booths", "" + d.b]];
    if (d.hd > 0) { ds.push(["Half-Days", "" + d.hd]); }
    if (d.fd > 0) { ds.push(["Full-Days", "" + d.fd]); }
    if (d.addRetouch) { ds.push(["Retouching Package", "Yes"]); }
    if (d.addHM) { ds.push(["Professional Hair & Makeup", "Yes"]); }
    for (var i = 0; i < ds.length; i++) {
      h.push("<div style=\"display:flex;justify-content:space-between;font-size:13px;color:#555;" + (i < ds.length - 1 ? "margin-bottom:6px" : "") + "\"><span>" + ds[i][0] + "<\/span><span style=\"font-weight:600;color:#1a1a1a\">" + ds[i][1] + "<\/span><\/div>");
    }
    h.push("<\/div>");
    h.push("<table style=\"width:100%;border-collapse:collapse;margin-bottom:8px\">");
    var pr = [];
    if (d.hdTotal > 0) { pr.push(["Half-Day Booth Total", fmt(d.hdTotal)]); }
    if (d.fdTotal > 0) { pr.push(["Full-Day Booth Total", fmt(d.fdTotal)]); }
    if (d.retouchTotal > 0) { pr.push(["Retouching Package", fmt(d.retouchTotal)]); }
    if (d.hmTotal > 0) { pr.push(["Professional Hair & Makeup", fmt(d.hmTotal)]); }
    for (var j = 0; j < pr.length; j++) {
      h.push("<tr style=\"border-bottom:1px solid #e8e8e8\"><td style=\"padding:12px 18px;font-size:14px;color:#333\">" + pr[j][0] + "<\/td><td style=\"padding:12px 18px;font-size:14px;font-weight:600;text-align:right\">" + pr[j][1] + "<\/td><\/tr>");
    }
    h.push("<tr><td style=\"padding:14px 18px;font-size:16px;font-weight:700;border-top:2px solid #0A3258\">Project Total<\/td><td style=\"padding:14px 18px;font-size:20px;font-weight:700;color:#0A3258;text-align:right;border-top:2px solid #0A3258\">" + fmt(d.projectTotal) + "<\/td><\/tr><\/table>");
    h.push("<hr style=\"border:none;border-top:1px solid #e8e8e8;margin:22px 0\">");
    h.push("<div style=\"font-size:15px;font-weight:700;margin-bottom:10px\">Ready to Book?<\/div>");
    h.push("<div style=\"font-size:13px;color:#555;line-height:1.6\">Contact us to confirm your event date and details. We will coordinate all logistics so your event runs seamlessly.<\/div>");
    h.push("<div style=\"margin-top:12px;font-size:13px\"><span style=\"color:#0A3258;font-weight:600\">(619) 618-8003<\/span> <span style=\"color:#ccc\">|<\/span> <span style=\"color:#0A3258;font-weight:600\">info@sandiegoprofessionalheadshots.com<\/span><\/div>");
    h.push("<div style=\"margin-top:8px;font-size:13px;color:#0A3258;font-weight:600\">www.sandiegoprofessionalheadshots.com<\/div>");
    h.push("<div style=\"margin-top:22px;font-size:10px;color:#999;line-height:1.5\">Pricing shown is an estimate based on the information provided. Final invoicing reflects actual services rendered. A $" + SDPH_EV_CONFIG.retainer + " non-refundable retainer and signed photography agreement are required to secure your booking.<\/div>");
    h.push("<\/div><\/div><\/body><\/html>");
    var w = window.open("", "_blank", "width=800,height=900");
    w.document.write(h.join(""));
    w.document.close();
    setTimeout(function() { w.print(); }, 400);
  });


  /* PDF DOWNLOAD */
  document.getElementById("sdph-ev-dl-btn").addEventListener("click", function() {
    function buildPDF() {
      var d = getData();
      var JP = window.jspdf.jsPDF;
      var doc = new JP({ unit: "mm", format: "letter" });
      var W = 215.9, M = 25, CW = W - M * 2, y = 0, rX = W - M;
      var nv = [6, 36, 68], dk = [26, 26, 26], gr = [85, 85, 85], lg = [136, 136, 136];
      var bg = [248, 249, 250], ln = [232, 232, 232];
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
      doc.text("Event Booth Estimate", M, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(lg[0], lg[1], lg[2]);
      doc.text(today, rX, y, { align: "right" });
      y += 12;
      /* Summary box */
      var dr = [["Number of Booths", "" + d.b]];
      if (d.hd > 0) { dr.push(["Half-Days", "" + d.hd]); }
      if (d.fd > 0) { dr.push(["Full-Days", "" + d.fd]); }
      if (d.addRetouch) { dr.push(["Retouching Package", "Yes"]); }
      if (d.addHM) { dr.push(["Professional Hair & Makeup", "Yes"]); }
      var boxH = 4 + dr.length * 8 + 2;
      doc.setFillColor(bg[0], bg[1], bg[2]);
      doc.roundedRect(M, y - 4, CW, boxH, 3, 3, "F");
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
      y += boxH + 6;
      /* Pricing rows */
      var pr = [];
      if (d.hdTotal > 0) { pr.push(["Half-Day Booth Total", fmt(d.hdTotal)]); }
      if (d.fdTotal > 0) { pr.push(["Full-Day Booth Total", fmt(d.fdTotal)]); }
      if (d.retouchTotal > 0) { pr.push(["Retouching Package", fmt(d.retouchTotal)]); }
      if (d.hmTotal > 0) { pr.push(["Professional Hair & Makeup", fmt(d.hmTotal)]); }
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
      doc.text("Project Total", M + 6, y);
      doc.setFontSize(15);
      doc.setTextColor(nv[0], nv[1], nv[2]);
      doc.text(fmt(d.projectTotal), W - M - 6, y, { align: "right" });
      y += 14;
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
      var bt = doc.splitTextToSize("Contact us to confirm your event date and details. We will coordinate all logistics so your event runs seamlessly.", CW);
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
      var disc = doc.splitTextToSize("Pricing shown is an estimate based on the information provided. Final invoicing reflects actual services rendered. A $" + SDPH_EV_CONFIG.retainer + " non-refundable retainer and signed photography agreement are required to secure your booking.", CW);
      doc.text(disc, M, y);
      doc.save("Event-Booth-Estimate.pdf");
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
