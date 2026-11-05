// Checkout links and referral codes for the /websites page.
//
// CHECKOUT holds the Stripe Payment Link for each package. Each link must
// have "Allow promotion codes" turned on. If a link is blank, the button
// opens an email instead.
//
// REFERRALS maps a referral link (passworddev.com/websites?ref=KEY) to the
// referrer's name and their Stripe promotion code. Every code points at the
// same 50%-off coupon, which applies to the whole order.
const CHECKOUT = {
  basic: "https://buy.stripe.com/6oU9AV64R9ie3Ll10eaR200",
  plus: "https://buy.stripe.com/aFaeVf50NamichRaAOaR201",
};

const REFERRALS = {
  rad: { name: "Rad Tortilla Co.", code: "RADTORTILLAS" },
};

const DISCOUNT = 0.5;

(function () {
  const money = (n) => "$" + n.toLocaleString("en-US");
  const ref = new URLSearchParams(location.search).get("ref");
  const referral = ref ? REFERRALS[ref.toLowerCase()] : undefined;

  if (referral) {
    document.getElementById("referral-name").textContent = referral.name;
    document.getElementById("referral-code").textContent = referral.code;
    document.getElementById("referral-banner").hidden = false;

    document.querySelectorAll(".price-was").forEach((el) => {
      el.textContent = money(Number(el.dataset.full));
      el.hidden = false;
    });
    document.querySelectorAll(".price-now").forEach((el) => {
      el.textContent = money(Number(el.dataset.full) * (1 - DISCOUNT));
    });
  }

  document.querySelectorAll(".plan-button").forEach((button) => {
    const plan = button.dataset.plan;
    const link = CHECKOUT[plan];
    if (link) {
      const url = new URL(link);
      if (referral) url.searchParams.set("prefilled_promo_code", referral.code);
      button.href = url.toString();
    } else {
      const name = plan.charAt(0).toUpperCase() + plan.slice(1);
      const subject = `Website ${name} package` + (referral ? ` (code ${referral.code})` : "");
      button.href = "mailto:hello@passworddev.com?subject=" + encodeURIComponent(subject);
    }
  });
})();
