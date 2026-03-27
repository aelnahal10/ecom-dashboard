import { addDays, formatISO, subDays } from "date-fns";

import { clamp } from "@/lib/utils";
import type {
  Channel,
  CustomerProfile,
  Order,
  OrderItem,
  Product,
  ProductCategory,
  Region,
} from "@/types/dashboard";

const END_DATE = new Date("2026-03-27T00:00:00Z");
const START_DATE = subDays(END_DATE, 179);

const firstNames = [
  "Isla",
  "Milo",
  "Freya",
  "Ethan",
  "Ava",
  "Arlo",
  "Nina",
  "Jonah",
  "Thea",
  "Leo",
  "Zara",
  "Roman",
  "Ivy",
  "Jude",
  "Maya",
  "Noah",
  "Elise",
  "Kai",
  "Luca",
  "Sara",
];

const lastNames = [
  "Bennett",
  "Sloane",
  "Carter",
  "Mercer",
  "Hayes",
  "Quinn",
  "Turner",
  "Frost",
  "Brooks",
  "Ellis",
  "Parker",
  "Bishop",
];

const productCatalog: Product[] = [
  { id: "prd_luna_carryall", name: "Luna Carryall", category: "Travel", price: 148, cogs: 62, hero: true },
  { id: "prd_atlas_weekender", name: "Atlas Weekender", category: "Travel", price: 192, cogs: 91, hero: true },
  { id: "prd_nimbus_carry_on", name: "Nimbus Carry-On", category: "Travel", price: 218, cogs: 154, hero: true },
  { id: "prd_halo_crossbody", name: "Halo Crossbody", category: "Accessories", price: 84, cogs: 38 },
  { id: "prd_meridian_wallet", name: "Meridian Wallet", category: "Accessories", price: 58, cogs: 24 },
  { id: "prd_keyline_pouch", name: "Keyline Tech Pouch", category: "Accessories", price: 44, cogs: 16 },
  { id: "prd_solstice_bottle", name: "Solstice Bottle", category: "Hydration", price: 36, cogs: 10 },
  { id: "prd_drift_tumbler", name: "Drift Tumbler", category: "Hydration", price: 32, cogs: 9 },
  { id: "prd_studio_candle", name: "Studio Candle Set", category: "Home", price: 72, cogs: 26 },
  { id: "prd_ember_diffuser", name: "Ember Diffuser", category: "Home", price: 94, cogs: 41 },
  { id: "prd_packing_cubes", name: "Shoreline Packing Cubes", category: "Travel", price: 48, cogs: 17 },
  { id: "prd_tag_set", name: "Voyage Tag Set", category: "Accessories", price: 26, cogs: 8 },
];

const channels: Channel[] = ["Meta", "Google", "Email", "Organic", "Direct"];
const regions: Region[] = [
  "United Kingdom",
  "North America",
  "Europe",
  "Middle East",
];

const channelBaseWeights: Record<Channel, number> = {
  Meta: 0.28,
  Google: 0.23,
  Email: 0.14,
  Organic: 0.21,
  Direct: 0.14,
};

const regionWeights: Record<Region, number> = {
  "United Kingdom": 0.44,
  "North America": 0.26,
  Europe: 0.2,
  "Middle East": 0.1,
};

const categoryRefundBias: Record<ProductCategory, number> = {
  Travel: 0.045,
  Accessories: 0.082,
  Hydration: 0.03,
  Home: 0.055,
};

function createSeededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function chooseWeighted<T>(
  entries: ReadonlyArray<readonly [T, number]>,
  random: () => number,
) {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let cursor = random() * total;

  for (const [item, weight] of entries) {
    cursor -= weight;
    if (cursor <= 0) return item;
  }

  return entries[entries.length - 1][0];
}

function pickProduct(channel: Channel, random: () => number) {
  const products = productCatalog.map((product) => {
    let weight = 1;

    if (channel === "Email" && product.category === "Home") weight += 0.5;
    if (channel === "Meta" && product.category === "Accessories") weight += 0.8;
    if (channel === "Google" && product.category === "Travel") weight += 0.8;
    if (channel === "Organic" && product.category === "Hydration") weight += 0.35;
    if (product.hero) weight += 0.3;

    return [product, weight] as const;
  });

  return chooseWeighted(products, random);
}

function createCustomer(
  id: number,
  region: Region,
  dayOffset: number,
  random: () => number,
): CustomerProfile {
  const first = firstNames[Math.floor(random() * firstNames.length)];
  const last = lastNames[Math.floor(random() * lastNames.length)];
  const handle = `${first}.${last}.${id}`.toLowerCase();

  return {
    id: `cus_${id.toString().padStart(4, "0")}`,
    name: `${first} ${last}`,
    email: `${handle}@aurelium-demo.com`,
    region,
    firstOrderDate: formatISO(addDays(START_DATE, dayOffset), { representation: "date" }),
  };
}

function createOrderItem(
  product: Product,
  random: () => number,
  channel: Channel,
  isRecentMetaPush: boolean,
): OrderItem {
  const quantity = random() > 0.78 ? 2 : 1;
  const grossRevenue = product.price * quantity;

  let discountRate = 0;
  if (channel === "Meta") discountRate += 0.08;
  if (channel === "Email") discountRate += 0.06;
  if (product.id === "prd_nimbus_carry_on") discountRate += 0.03;
  if (product.category === "Accessories") discountRate += 0.02;
  if (isRecentMetaPush && channel === "Meta") discountRate += 0.05;
  discountRate += random() * 0.04;
  discountRate = clamp(discountRate, 0, 0.22);

  return {
    productId: product.id,
    name: product.name,
    category: product.category,
    quantity,
    unitPrice: product.price,
    unitCogs: product.cogs,
    grossRevenue,
    discountAmount: grossRevenue * discountRate,
  };
}

function generateOrders() {
  const random = createSeededRandom(48291);
  const orders: Order[] = [];
  const customers: CustomerProfile[] = [];
  const activeCustomers: CustomerProfile[] = [];

  let customerCounter = 1;

  for (let dayOffset = 0; dayOffset < 180; dayOffset += 1) {
    const date = addDays(START_DATE, dayOffset);
    const weekday = date.getUTCDay();
    const month = date.getUTCMonth();
    const recentWindow = dayOffset >= 150;

    const seasonalLift =
      (month === 9 ? 1.05 : 1) *
      (month === 10 || month === 11 ? 1.12 : 1) *
      (weekday === 5 || weekday === 6 ? 0.88 : 1) *
      (dayOffset > 120 ? 1.08 : 1);

    const orderVolume = Math.round(5 + seasonalLift * 3 + random() * 4);

    for (let orderIndex = 0; orderIndex < orderVolume; orderIndex += 1) {
      const channelWeights: Array<[Channel, number]> = channels.map((channel) => {
        let weight = channelBaseWeights[channel];

        if (recentWindow && channel === "Meta") weight *= 1.2;
        if (recentWindow && channel === "Email") weight *= 0.92;

        return [channel, weight];
      });

      const region = chooseWeighted(
        regions.map((entry) => [entry, regionWeights[entry]] as const),
        random,
      );
      const channel = chooseWeighted(channelWeights, random);

      const returningProbability = clamp(
        0.24 + dayOffset / 540 + (channel === "Email" ? 0.18 : 0),
        0.24,
        0.58,
      );
      const shouldReuseCustomer =
        activeCustomers.length > 80 && random() < returningProbability;

      let customer: CustomerProfile;
      let isReturningCustomer = false;

      if (shouldReuseCustomer) {
        customer =
          activeCustomers[Math.floor(random() * activeCustomers.length)];
        isReturningCustomer = true;
      } else {
        customer = createCustomer(customerCounter, region, dayOffset, random);
        customerCounter += 1;
        customers.push(customer);
        activeCustomers.push(customer);
      }

      const itemsCount = random() > 0.82 ? 3 : random() > 0.5 ? 2 : 1;
      const items: OrderItem[] = [];

      for (let itemIndex = 0; itemIndex < itemsCount; itemIndex += 1) {
        const product = pickProduct(channel, random);
        items.push(createOrderItem(product, random, channel, recentWindow));
      }

      const grossRevenue = items.reduce((sum, item) => sum + item.grossRevenue, 0);
      const discountTotal = items.reduce(
        (sum, item) => sum + item.discountAmount,
        0,
      );
      const shippingRevenue = grossRevenue > 180 ? 0 : 6 + random() * 4;
      const shippingCost =
        (region === "Middle East"
          ? 9.5
          : region === "North America"
            ? 7.6
            : 5.4) + random() * 2.4;

      const dominantCategory = [...items].sort(
        (left, right) => right.grossRevenue - left.grossRevenue,
      )[0].category;

      let refundProbability =
        categoryRefundBias[dominantCategory] +
        (recentWindow && dominantCategory === "Accessories" ? 0.03 : 0);

      if (channel === "Meta") refundProbability += 0.01;
      const refundRoll = random();

      let refundAmount = 0;
      let status: Order["status"] =
        dayOffset > 174 ? "processing" : "fulfilled";

      if (refundRoll < refundProbability * 0.42) {
        refundAmount = grossRevenue * (0.3 + random() * 0.35);
        status = "partially_refunded";
      } else if (refundRoll < refundProbability * 0.62) {
        refundAmount = grossRevenue * (0.75 + random() * 0.2);
        status = "refunded";
      }

      const itemCogs = items.reduce(
        (sum, item) => sum + item.unitCogs * item.quantity,
        0,
      );
      const spendRate =
        channel === "Meta"
          ? recentWindow
            ? 0.3
            : 0.22
          : channel === "Google"
            ? 0.16
            : channel === "Email"
              ? 0.05
              : channel === "Organic"
                ? 0.02
                : 0.015;
      const adSpend = grossRevenue * spendRate * (0.84 + random() * 0.32);
      const netRevenue = grossRevenue - discountTotal + shippingRevenue - refundAmount;
      const grossProfit = netRevenue - itemCogs - shippingCost;
      const contributionProfit = grossProfit - adSpend;

      orders.push({
        id: `ord_${(orders.length + 1).toString().padStart(5, "0")}`,
        orderNumber: `AG-${(112400 + orders.length).toString()}`,
        createdAt: formatISO(date, { representation: "date" }),
        channel,
        region: customer.region,
        status,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        isReturningCustomer,
        items,
        grossRevenue,
        discountTotal,
        shippingRevenue,
        shippingCost,
        refundAmount,
        adSpend,
        netRevenue,
        cogs: itemCogs,
        grossProfit,
        contributionProfit,
      });
    }
  }

  return {
    startDate: formatISO(START_DATE, { representation: "date" }),
    endDate: formatISO(END_DATE, { representation: "date" }),
    products: productCatalog,
    orders,
    customers,
  };
}

export const mockDashboardData = generateOrders();
