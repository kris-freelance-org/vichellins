import { policies, store } from "./config";

export type ContentField = { key: string; label: string; type?: "text" | "textarea" | "image" | "link" | "number"; value?: string; required?: boolean; hint?: string };
export type ContentGroup = { title: string; fields: ContentField[] };
export type ContentCollection = { key: string; label: string; fields: ContentField[]; rows: Record<string, string>[]; max: number };
export type PageDefinition = { label: string; path: string; groups: ContentGroup[]; collections: ContentCollection[] };
export type PageContent = { values: Record<string, string>; collections: Record<string, Record<string, string>[]> };

const text = (key: string, label: string, value = "", type: ContentField["type"] = "text"): ContentField => ({ key, label, value, type });
const sectionFields: ContentField[] = [text("heading", "Heading"), text("body", "Text", "", "textarea"), { ...text("items", "Bullet points", "", "textarea"), hint: "One bullet point per line." }, text("link_label", "Link text"), text("link_href", "Link destination", "", "link")];
const section = (heading: string, body = "", items = "", link_label = "", link_href = "") => ({ heading, body, items, link_label, link_href });
function page(label: string, path: string, title: string, intro: string, groups: ContentGroup[] = [], collections: ContentCollection[] = []): PageDefinition {
  return { label, path, groups: [
    { title: "Page introduction", fields: [{ ...text("title", "Title", title), required: true }, text("intro", "Introduction", intro, "textarea")] },
    ...groups,
    { title: "Search engine preview", fields: [text("seo_title", "Search title", label), text("seo_description", "Search description", intro, "textarea")] },
  ], collections };
}
const info = (label: string, path: string, title: string, intro: string, rows: Record<string, string>[]) => page(label, path, title, intro, [], [{ key: "sections", label: "Page sections", fields: sectionFields, rows, max: 30 }]);

export const pageDefinitions = {
  home: page("Homepage", "/", "Your next upgrade.", "Phones, laptops, and the little things that make life better. Genuine tech, with real warranties, delivered across Lagos.", [
    { title: "Main banner", fields: [text("accent", "Accent text", "Starts here."), text("eyebrow", "Eyebrow", "The upgrade you deserve"), text("hero_image", "Banner image", "/elegant-smartphone-composition.png", "image"), text("hero_alt", "Image description", "Blue and pink smartphones"), text("hero_button", "Button text", "Find your upgrade"), text("hero_link", "Button destination", "/shop", "link"), text("hero_note", "Reassurance", "Genuine products. Peace of mind included."), text("image_caption", "Image caption", "A fresh perspective.")] },
    { title: "Welcome strip", fields: [text("welcome", "Welcome text", "Good tech. Good people. Right here in Lagos."), text("about_link", "About link text", "Meet Vichellins")] },
    { title: "Wearables feature", fields: [text("wearable_eyebrow", "Eyebrow", "Small tech. Big energy."), text("wearable_title", "Heading", "A smarter everyday."), text("wearable_button", "Link text", "Explore the collection"), text("wearable_image", "Image", "/smartwatch.png", "image"), text("wearable_alt", "Image description", "Black smartwatch with an activity display")] },
    { title: "Product sections", fields: [text("category_eyebrow", "Categories eyebrow", "Something for every day"), text("category_title", "Categories heading", "Find your thing."), text("featured_eyebrow", "Featured eyebrow", "Great picks. For good reason."), text("featured_title", "Featured heading", "The crowd favourites."), text("new_eyebrow", "New arrivals eyebrow", "Fresh on the shelf"), text("new_title", "New arrivals heading", "New in. Worth a look.")] },
    { title: "Audio feature", fields: [text("audio_eyebrow", "Eyebrow", "Your world. Better sound."), text("audio_title", "Heading", "Get into your own little world."), text("audio_body", "Description", "For your commute, your focus time, and the songs you play on repeat.", "textarea"), text("audio_button", "Button text", "Find your sound"), text("audio_wordmark", "Backdrop text", "PLAY.")] },
  ], [{ key: "trust", label: "Trust items", fields: [text("title", "Title"), text("body", "Description", "", "textarea")], max: 8, rows: [
    { title: "Genuine products", body: "We check and verify every item before it goes on the site." },
    { title: "Warranty included", body: "Manufacturer or store warranty, clearly stated on each product." },
    { title: "Lagos delivery", body: "Same-day delivery on the mainland and island for most orders." },
    { title: "Inspect, then pay", body: "Choose pay on delivery and check your item first." },
  ] }]),
  workspace: page("Workspace", "/workspace", "A calm place to work, meet and try the gear.", "Drop in for the day, or settle in for the month. Fast Wi-Fi, dedicated desks, and a device bar stocked with the phones, laptops and audio we sell.", [
    { title: "Image banner", fields: [text("banner", "Banner image", "/elegant-smartphone-composition.png", "image"), text("banner_alt", "Image description", "Devices available at Vichellins"), text("eyebrow", "Eyebrow", "Our workspace"), text("book_button", "Booking button", "Book a day"), text("chat_button", "WhatsApp button", "Chat on WhatsApp")] },
    { title: "Section headings", fields: [text("amenities_title", "Amenities heading", "What's inside"), text("amenities_intro", "Amenities introduction", "Small details, done well, so you can focus on your work."), text("gallery_title", "Gallery heading", "A look around"), text("gallery_intro", "Gallery introduction", "Explore the space and the gear you can try."), text("plans_title", "Plans heading", "Pick a plan"), text("plans_intro", "Plans introduction", "Pay in person, by transfer or on arrival. We'll record it on your account.")] },
    ...[ ["day", "Day pass", "5000", "per day", "Any open seat\nWi-Fi and power\nRefreshments"], ["week", "Weekly", "25000", "per week", "Any open seat, 7 days\nPriority seating\n10% off accessories"], ["month", "Monthly", "70000", "per month", "Dedicated desk\nPrinting credit\nMeeting corner access"] ].map(([key, name, price, unit, perks]) => ({ title: `${name} plan`, fields: [{ ...text(`${key}_name`, "Plan name", name), required: true }, { ...text(`${key}_price`, "Price in naira", price, "number"), required: true }, text(`${key}_unit`, "Price period", unit), { ...text(`${key}_perks`, "What's included", perks, "textarea"), hint: "One benefit per line." }] })),
    { title: "Visit information", fields: [text("visit_title", "Heading", "Visit us"), text("visit_intro", "Introduction", "Come by any time during opening hours. No appointment needed for a day pass.", "textarea"), text("address", "Address", store.location), text("hours", "Opening hours", policies.businessHours), text("phone", "Phone", store.phoneDisplay), text("email", "Email", store.email), text("whatsapp", "WhatsApp number", store.whatsapp)] },
  ], [
    { key: "amenities", label: "Amenities", fields: [text("title", "Title"), text("body", "Description", "", "textarea")], max: 18, rows: [
      { title: "Fast Wi-Fi", body: "Fibre connection with a battery backup so your work never pauses." }, { title: "Private desks", body: "Dedicated spots with power, lighting and a comfortable chair." }, { title: "Meeting corner", body: "A small, quiet area for calls, interviews or a quick client sit-down." }, { title: "Device bar", body: "Try the phones, laptops and audio we sell before you decide." }, { title: "Refreshments", body: "Water, tea and coffee throughout the day on the house." }, { title: "Secure", body: "Access-controlled entry and CCTV so your things stay yours." },
    ] },
    { key: "gallery", label: "Gallery photos", fields: [text("image", "Photo", "", "image"), text("alt", "Image description")], max: 12, rows: [] },
  ]),
  about: info("About us", "/about", "About us", `${store.name} sells genuine gadgets and delivers them across Lagos.`, [
    section("What we do", "We sell phones, laptops, audio, smart home devices, wearables and accessories. Every product is checked before it is listed, and each listing states its condition, warranty and authenticity so you know what you are buying."),
    section("How we work", "", "Products are verified genuine before they are listed.\nWarranty is stated on every product page, including who covers it.\nWe deliver within Lagos and you can choose to pay on delivery.\nYou can reach us directly on WhatsApp before and after you buy."),
    section("Get in touch", "Questions about a product or an order?", "", "Contact us", "/contact"),
  ]),
  contact: page("Contact us", "/contact", "Contact us", "The fastest way to reach us is WhatsApp.", [
    { title: "Contact details", fields: [text("whatsapp", "WhatsApp number", store.whatsapp), text("whatsapp_body", "WhatsApp description", "Stock checks, orders and advice. Tap to start a chat."), text("phone", "Phone", store.phoneDisplay), text("email", "Email", store.email), text("address", "Address", store.location), text("location_note", "Location note", "We deliver within Lagos only."), text("hours", "Business hours", policies.businessHours), text("hours_note", "After-hours note", "Messages sent outside these hours are answered the next working day.")] },
  ], [{ key: "sections", label: "Additional sections", fields: sectionFields, rows: [], max: 20 }]),
  faq: page("FAQ", "/faq", "Frequently asked questions", "Quick answers before you order.", [
    { title: "Help link", fields: [text("help_text", "Help text", "Still stuck?"), text("help_label", "Link text", "Message us on WhatsApp"), text("help_link", "Link destination", "/contact", "link")] },
  ], [{ key: "questions", label: "Questions and answers", fields: [text("question", "Question"), text("answer", "Answer", "", "textarea")], max: 50, rows: [
    { question: "Are your products genuine?", answer: "Yes. Every product is checked before it is listed, and each product page shows its authenticity status and notes, for example whether the box is sealed." },
    { question: "Where do you deliver?", answer: "Within Lagos only. Delivery fees depend on your area and are shown at checkout." },
    { question: "How do I pay?", answer: "Choose bank transfer or pay on delivery at checkout. Follow the payment instructions shown with your order." },
    { question: "Can I pay on delivery?", answer: "Where available, pay the delivery fee in advance and the remaining amount when your order arrives." },
    { question: "Do products come with a warranty?", answer: "The warranty length and who covers it, the manufacturer or us, is stated on every product page." },
    { question: "What is a refurbished product?", answer: "A used device that has been tested, cleaned and repaired where needed. Refurbished listings say what was replaced and carry their own warranty." },
    { question: "Can I return an item?", answer: `Within ${policies.returnDays} days if it is faulty or not as described. See the delivery and returns page for details.` },
  ] }]),
  "delivery-returns": info("Delivery & returns", "/delivery-returns", "Delivery & returns", "We deliver within Lagos only.", [
    section("Delivery areas and fees", "Delivery fees and estimated times are shown at checkout. Delivery times start once we have confirmed your order and received any required payment."),
    section("Inspect before you pay", "If you choose pay on delivery, you can check the item with the rider before paying the remaining balance."),
    section("Returns", `You can return an item within ${policies.returnDays} days of delivery if it is faulty or not as described. Contact us on WhatsApp with your order details and photos or video of the problem.`, `Items must be returned with all accessories and packaging.\nItems damaged after delivery are not eligible for return.\nApproved refunds are paid within ${policies.refundDays} working days.`),
  ]),
  warranty: info("Warranty", "/warranty", "Warranty", "Every product page states its warranty length and who covers it.", [
    section("Types of warranty", "", "Manufacturer warranty: the brand covers the product. We help you make the claim.\nStore warranty: we cover the product directly and repair or replace it.\nNo warranty: stated clearly on the product page where it applies."),
    section("What is covered", "Faults that are not caused by the user, such as manufacturing defects and hardware that stops working under normal use."),
    section("What is not covered", "", "Physical damage, cracked screens and liquid damage.\nDamage from unofficial repairs or modifications.\nNormal wear and consumables such as ear cushions and cables."),
    section("Making a claim", "Send your order details and a description or video of the fault. Keep your receipt and original packaging where possible.", "", "Contact us", "/contact"),
  ]),
  privacy: info("Privacy policy", "/privacy", "Privacy policy", "What we collect, why, and how to ask us to delete it.", [
    section("What we collect", "", "Your name, phone number, delivery address and, optionally, email when you place an order.\nMessages you send us on WhatsApp.\nBasic site usage data, such as pages viewed, to improve the shop."),
    section("How we use it", "To process and deliver your order, answer your questions, and understand which products people look at. We do not sell your information."),
    section("Sharing", "We share your name, phone number and address with our delivery rider so your order can reach you, and with payment providers when you pay online."),
    section("Your choices", `You can ask us to correct or delete your information by emailing ${store.email}.`),
  ]),
  terms: info("Terms of service", "/terms", "Terms of service", `The terms for buying from ${store.name}.`, [
    section("Orders", "An order is accepted when we confirm it with you. We may cancel an order if an item is out of stock or a price was listed in error, and we will refund any payment made."),
    section("Prices and payment", "Prices are in Nigerian naira and include no delivery fee unless stated. Delivery is charged by area at checkout."),
    section("Delivery", "We deliver within Lagos only. Delivery times are estimates and not guarantees."),
    section("Returns and warranty", "See the delivery and returns page and the warranty page for how returns and warranty claims work."),
    section("Product information", "Product images on the site may be illustrations. Specifications are provided as accurately as we can; the product page states condition, warranty and authenticity for each item."),
  ]),
  shop: page("Shop", "/shop", "Everything you need.", "Phones, laptops, audio, smart home — real stock, real warranty, delivered across Lagos."),
  cart: page("Cart", "/cart", "Your cart", "", [{ title: "Cart messages", fields: [text("empty_title", "Empty cart heading", "Your cart is empty"), text("empty_body", "Empty cart message", "Add something you like and it will wait for you here.", "textarea"), text("shop_button", "Continue shopping button", "Continue shopping"), text("summary_title", "Summary heading", "Summary"), text("checkout_button", "Checkout button", "Checkout")] }]),
  checkout: page("Checkout", "/checkout", "Checkout", "Delivery within Lagos only. No account needed.", [{ title: "Checkout messages", fields: [text("empty_title", "Empty cart heading", "Nothing to check out"), text("empty_body", "Empty cart message", "Your cart's empty — add something first."), text("closed_title", "Unavailable heading", "Checkout is temporarily closed"), text("closed_body", "Unavailable message", "Delivery areas haven't been set yet. Please try again shortly.")] }]),
  "order-success": page("Order confirmation", "/checkout/success", "Thanks — we have your order", "Keep your order number handy if you need to get in touch.", [{ title: "Order messages", fields: [text("placed_title", "Placed heading", "Order placed"), text("not_found_title", "Not found heading", "Order not found"), text("not_found_body", "Not found message", "We couldn't find that order. Please reach out on WhatsApp so we can help."), text("help_button", "Help button", "Contact us on WhatsApp")] }]),
  booking: page("Workspace booking", "/workspace/book", "Book a day pass", "Reserve a seat for the day you want to visit. Pay when you arrive by cash, transfer or POS. We'll have your name waiting.", [{ title: "Help", fields: [text("help_text", "Help text", "Have a group or need a different plan?"), text("help_button", "Help link", "Chat with us on WhatsApp")] }]),
  "booking-success": page("Booking confirmation", "/workspace/book/success", "You're booked", "We'll have your name at the front desk. Pay for your day pass when you arrive.", [{ title: "Arrival instructions", fields: [text("instructions_title", "Heading", "Before you come"), { ...text("instructions", "Instructions", "Bring a valid ID at the door.\nPay on arrival by cash, bank transfer or POS.\nNeed to change your date? Message us on WhatsApp.", "textarea"), hint: "One instruction per line." }] }]),
} satisfies Record<string, PageDefinition>;

export type PageKey = keyof typeof pageDefinitions;
export const isPageKey = (value: string): value is PageKey => Object.hasOwn(pageDefinitions, value);
export function defaultPageContent(key: PageKey): PageContent {
  const definition: PageDefinition = pageDefinitions[key];
  return { values: Object.fromEntries(definition.groups.flatMap(g => g.fields.map(f => [f.key, f.value ?? ""]))), collections: Object.fromEntries(definition.collections.map(c => [c.key, c.rows.map(row => ({ ...row }))])) };
}
export const lines = (value: string) => value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
export function safeContentLink(value: string): boolean {
  if (!value) return true;
  if (/[\x00-\x20\\]/.test(value)) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { return ["https:", "http:", "mailto:", "tel:"].includes(new URL(value).protocol); } catch { return false; }
}
