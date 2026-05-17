import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { addDays, addMonths, subMonths, subDays } from "date-fns";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Seeding Testdaten...");
  const now = new Date();
  const pw = await bcrypt.hash("demo123", 12);

  // ── Benutzer ──────────────────────────────────────────────────────────────

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.de" },
    update: {},
    create: { name: "Admin", email: "admin@demo.de", passwordHash: pw, role: "ADMIN", phone: "+49 30 12345678" },
  });

  // Teamleiter
  const tl1 = await prisma.user.upsert({
    where: { email: "sarah.weber@demo.de" },
    update: {},
    create: { name: "Sarah Weber", email: "sarah.weber@demo.de", passwordHash: pw, role: "MANAGER", phone: "+49 171 9000001" },
  });
  const tl2 = await prisma.user.upsert({
    where: { email: "k.bergmann@demo.de" },
    update: {},
    create: { name: "Klaus Bergmann", email: "k.bergmann@demo.de", passwordHash: pw, role: "MANAGER", phone: "+49 172 9000002" },
  });

  // Vertriebler Team Nord
  const v1 = await prisma.user.upsert({
    where: { email: "t.mueller@demo.de" },
    update: {},
    create: { name: "Thomas Müller", email: "t.mueller@demo.de", passwordHash: pw, role: "SALES", phone: "+49 171 1234567" },
  });
  const v2 = await prisma.user.upsert({
    where: { email: "j.becker@demo.de" },
    update: {},
    create: { name: "Jan Becker", email: "j.becker@demo.de", passwordHash: pw, role: "SALES", phone: "+49 176 1111222" },
  });
  const v3 = await prisma.user.upsert({
    where: { email: "m.schulz@demo.de" },
    update: {},
    create: { name: "Mia Schulz", email: "m.schulz@demo.de", passwordHash: pw, role: "SALES", phone: "+49 151 3334455" },
  });

  // Vertriebler Team Süd
  const v4 = await prisma.user.upsert({
    where: { email: "s.schmidt@demo.de" },
    update: {},
    create: { name: "Sandra Schmidt", email: "s.schmidt@demo.de", passwordHash: pw, role: "SALES", phone: "+49 172 9876543" },
  });
  const v5 = await prisma.user.upsert({
    where: { email: "n.brandt@demo.de" },
    update: {},
    create: { name: "Nina Brandt", email: "n.brandt@demo.de", passwordHash: pw, role: "SALES", phone: "+49 152 6667788" },
  });
  const v6 = await prisma.user.upsert({
    where: { email: "f.huber@demo.de" },
    update: {},
    create: { name: "Felix Huber", email: "f.huber@demo.de", passwordHash: pw, role: "SALES", phone: "+49 160 9990011" },
  });

  console.log("✓ Benutzer angelegt");

  // ── Provisionsregeln ──────────────────────────────────────────────────────

  const ruleData = [
    { uid: v1.id, suffix: "v1-mob",  name: "Mobilfunk Fix",   ruleType: "FIXED",              productType: "MOBILFUNK",    fixedAmount: 40,  percentage: null },
    { uid: v1.id, suffix: "v1-glas", name: "Glasfaser Fix",   ruleType: "FIXED",              productType: "GLASFASER",    fixedAmount: 100, percentage: null },
    { uid: v2.id, suffix: "v2-pct",  name: "30% Provision",   ruleType: "PERCENTAGE",         productType: null,           fixedAmount: null, percentage: 30 },
    { uid: v3.id, suffix: "v3-mob",  name: "Mobilfunk 25%",   ruleType: "PRODUCT_PERCENTAGE", productType: "MOBILFUNK",    fixedAmount: null, percentage: 25 },
    { uid: v3.id, suffix: "v3-tv",   name: "TV Fix 20€",      ruleType: "FIXED",              productType: "MAGENTA_TV",   fixedAmount: 20,  percentage: null },
    { uid: v4.id, suffix: "v4-bus",  name: "Business 35%",    ruleType: "PRODUCT_PERCENTAGE", productType: "BUSINESS_MOBILFUNK", fixedAmount: null, percentage: 35 },
    { uid: v4.id, suffix: "v4-mob",  name: "Mobilfunk Fix",   ruleType: "FIXED",              productType: "MOBILFUNK",    fixedAmount: 45,  percentage: null },
    { uid: v5.id, suffix: "v5-pct",  name: "25% Gesamt",      ruleType: "PERCENTAGE",         productType: null,           fixedAmount: null, percentage: 25 },
    { uid: v6.id, suffix: "v6-mob",  name: "Mobilfunk 30%",   ruleType: "PRODUCT_PERCENTAGE", productType: "MOBILFUNK",    fixedAmount: null, percentage: 30 },
    { uid: v6.id, suffix: "v6-glas", name: "Glasfaser 20%",   ruleType: "PRODUCT_PERCENTAGE", productType: "GLASFASER",    fixedAmount: null, percentage: 20 },
  ];
  for (const r of ruleData) {
    await prisma.commissionRule.upsert({
      where: { id: `rule-${r.suffix}` },
      update: {},
      create: { id: `rule-${r.suffix}`, userId: r.uid, ruleName: r.name, ruleType: r.ruleType as "FIXED", productType: r.productType as "MOBILFUNK" | null, fixedAmount: r.fixedAmount, percentage: r.percentage },
    });
  }

  console.log("✓ Provisionsregeln angelegt");

  // ── Teams ─────────────────────────────────────────────────────────────────

  const teamNord = await prisma.team.upsert({
    where: { id: "team-nord" },
    update: { name: "Team Nord", managerId: tl1.id },
    create: { id: "team-nord", name: "Team Nord", description: "Vertriebsgebiet Nord: Hamburg, Bremen, Hannover", managerId: tl1.id },
  });
  const teamSued = await prisma.team.upsert({
    where: { id: "team-sued" },
    update: { name: "Team Süd", managerId: tl2.id },
    create: { id: "team-sued", name: "Team Süd", description: "Vertriebsgebiet Süd: München, Stuttgart, Nürnberg", managerId: tl2.id },
  });

  // Team-Mitglieder
  const nordMembers = [v1.id, v2.id, v3.id];
  const suedMembers = [v4.id, v5.id, v6.id];
  for (const uid of nordMembers) {
    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: teamNord.id, userId: uid } },
      update: {},
      create: { teamId: teamNord.id, userId: uid },
    });
  }
  for (const uid of suedMembers) {
    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: teamSued.id, userId: uid } },
      update: {},
      create: { teamId: teamSued.id, userId: uid },
    });
  }

  console.log("✓ Teams angelegt");

  // ── Kunden ────────────────────────────────────────────────────────────────

  type CustomerSeed = Parameters<typeof prisma.customer.create>[0]["data"] & { id: string };

  const customers: CustomerSeed[] = [
    // Team Nord – v1 Thomas Müller
    { id: "k-01", internalNumber: "KD-20001", firstName: "Max", lastName: "Richter", phone: "+49 171 1010101", email: "max.richter@gmail.com", city: "Hamburg", zip: "20095", customerType: "PRIVATKUNDE", status: "AKTIV", source: "BESTANDSKUNDE", assignedUserId: v1.id, gdprConsent: true, tags: ["VVL-bald", "Familie"], currentMobileProvider: "Vodafone", hasChildren: true, interestedInGlasfaser: true, aiLeadScore: 85, lastContactAt: subDays(now, 4) },
    { id: "k-02", internalNumber: "KD-20002", firstName: "Petra", lastName: "Vogel", phone: "+49 172 2020202", email: "p.vogel@web.de", city: "Hamburg", zip: "22083", customerType: "FAMILIE", status: "AKTIV", source: "EMPFEHLUNG", assignedUserId: v1.id, gdprConsent: true, tags: ["MagentaTV", "Familie"], interestedInMagentaTV: true, currentMobileProvider: "O2", aiLeadScore: 68, lastContactAt: subDays(now, 12) },
    { id: "k-03", internalNumber: "KD-20003", firstName: "Bernd", lastName: "Lange", phone: "+49 151 3030303", email: "b.lange@t-online.de", city: "Bremen", zip: "28195", customerType: "PRIVATKUNDE", status: "POTENZIELL", source: "SHOP", assignedUserId: v1.id, gdprConsent: true, tags: ["Glasfaser"], interestedInGlasfaser: true, currentMobileProvider: "1&1", aiLeadScore: 52 },
    { id: "k-04", internalNumber: "KD-20004", firstName: "Karin", lastName: "Weiß", phone: "+49 176 4040404", email: "karin.weiss@gmx.de", city: "Hannover", zip: "30159", customerType: "PRIVATKUNDE", status: "INAKTIV", source: "BESTANDSKUNDE", assignedUserId: v1.id, gdprConsent: true, tags: ["Kündiger"], currentMobileProvider: "Telekom", aiLeadScore: 20, lastContactAt: subDays(now, 90) },
    { id: "k-05", internalNumber: "KD-20005", firstName: "Stefan", lastName: "Koch", phone: "+49 160 5050505", email: "s.koch@outlook.com", city: "Hamburg", zip: "21073", customerType: "PRIVATKUNDE", status: "AKTIV", source: "SOCIAL_MEDIA", assignedUserId: v1.id, gdprConsent: true, tags: ["Zusatzkarte"], potentialAdditionalCards: true, currentMobileProvider: "Telekom", interestedInDevice: true, aiLeadScore: 74, lastContactAt: subDays(now, 7) },

    // Team Nord – v2 Jan Becker
    { id: "k-06", internalNumber: "KD-20006", firstName: "Lena", lastName: "Zimmermann", phone: "+49 152 6060606", email: "lena.z@gmail.com", city: "Hannover", zip: "30171", customerType: "FAMILIE", status: "AKTIV", source: "EMPFEHLUNG", assignedUserId: v2.id, gdprConsent: true, tags: ["Familie", "VVL-bald"], interestedInMagentaTV: true, currentMobileProvider: "Vodafone", householdSize: 4, hasChildren: true, aiLeadScore: 79, lastContactAt: subDays(now, 3) },
    { id: "k-07", internalNumber: "KD-20007", firstName: "Markus", lastName: "Neumann", phone: "+49 162 7070707", email: "m.neumann@web.de", city: "Bremen", zip: "28197", customerType: "SELBSTSTAENDIG", status: "AKTIV", source: "AUSSENDIENST", assignedUserId: v2.id, gdprConsent: true, tags: ["Business-Potenzial"], businessPotential: "MITTEL", needsMobile: true, needsInternet: true, currentProvider: "Vodafone", aiLeadScore: 66 },
    { id: "k-08", internalNumber: "KD-20008", firstName: "Anna", lastName: "Fischer", phone: "+49 163 8080808", email: "anna.fisch@gmx.de", city: "Hamburg", zip: "20099", customerType: "PRIVATKUNDE", status: "POTENZIELL", source: "WEBSITE", assignedUserId: v2.id, gdprConsent: false, tags: ["Neukunde"], interestedInGlasfaser: true, aiLeadScore: 48 },
    { id: "k-09", internalNumber: "KD-20009", firstName: "Digital", lastName: "Werke GmbH", companyName: "Digital Werke GmbH", phone: "+49 40 88990011", email: "info@digitalwerke.de", city: "Hamburg", zip: "20457", customerType: "FIRMA", status: "AKTIV", source: "AUSSENDIENST", assignedUserId: v2.id, gdprConsent: true, tags: ["Business", "High-Value"], businessPotential: "HOCH", employeeCount: 42, possibleSimCards: 35, needsMobile: true, needsInternet: true, needsLandline: true, currentProvider: "O2", aiLeadScore: 93, lastContactAt: subDays(now, 6) },

    // Team Nord – v3 Mia Schulz
    { id: "k-10", internalNumber: "KD-20010", firstName: "Jonas", lastName: "Braun", phone: "+49 177 1010120", email: "jonas.braun@icloud.com", city: "Hamburg", zip: "22525", customerType: "PRIVATKUNDE", status: "AKTIV", source: "SHOP", assignedUserId: v3.id, gdprConsent: true, tags: ["Geräteinteresse"], interestedInDevice: true, currentMobileProvider: "Telekom", aiLeadScore: 60, lastContactAt: subDays(now, 14) },
    { id: "k-11", internalNumber: "KD-20011", firstName: "Sophie", lastName: "Klein", phone: "+49 173 2020230", email: "sophie.k@gmail.com", city: "Hannover", zip: "30175", customerType: "PRIVATKUNDE", status: "AKTIV", source: "EMPFEHLUNG", assignedUserId: v3.id, gdprConsent: true, tags: ["MagentaTV", "Glasfaser"], interestedInMagentaTV: true, interestedInGlasfaser: true, currentMobileProvider: "Vodafone", aiLeadScore: 82, lastContactAt: subDays(now, 2) },
    { id: "k-12", internalNumber: "KD-20012", firstName: "Tom", lastName: "Hartmann", phone: "+49 178 3030340", email: "t.hartmann@freenet.de", city: "Bremen", zip: "28209", customerType: "PRIVATKUNDE", status: "VERLOREN", source: "BESTANDSKUNDE", assignedUserId: v3.id, gdprConsent: true, tags: ["Churner"], currentMobileProvider: "Vodafone", aiLeadScore: 15, lastContactAt: subDays(now, 60) },

    // Team Süd – v4 Sandra Schmidt
    { id: "k-13", internalNumber: "KD-20013", firstName: "Michael", lastName: "Bauer", phone: "+49 170 4040450", email: "m.bauer@gmail.com", city: "München", zip: "80331", customerType: "PRIVATKUNDE", status: "AKTIV", source: "BESTANDSKUNDE", assignedUserId: v4.id, gdprConsent: true, tags: ["VVL-bald"], currentMobileProvider: "O2", interestedInGlasfaser: true, aiLeadScore: 77, lastContactAt: subDays(now, 5) },
    { id: "k-14", internalNumber: "KD-20014", firstName: "TechSolutions", lastName: "AG", companyName: "TechSolutions AG", phone: "+49 89 11223344", email: "kontakt@techsolutions.de", city: "München", zip: "80469", customerType: "FIRMA", status: "AKTIV", source: "AUSSENDIENST", assignedUserId: v4.id, gdprConsent: true, tags: ["Business", "Premium"], businessPotential: "HOCH", employeeCount: 120, possibleSimCards: 90, needsMobile: true, needsInternet: true, needsDevices: true, currentProvider: "Telekom", aiLeadScore: 96, lastContactAt: subDays(now, 1) },
    { id: "k-15", internalNumber: "KD-20015", firstName: "Claudia", lastName: "Schwarz", phone: "+49 174 5050560", email: "c.schwarz@web.de", city: "Augsburg", zip: "86150", customerType: "FAMILIE", status: "AKTIV", source: "EMPFEHLUNG", assignedUserId: v4.id, gdprConsent: true, tags: ["Familie"], householdSize: 3, hasChildren: true, interestedInMagentaTV: true, currentMobileProvider: "E-Plus", aiLeadScore: 71, lastContactAt: subDays(now, 9) },
    { id: "k-16", internalNumber: "KD-20016", firstName: "Erik", lastName: "Wolf", phone: "+49 175 6060670", email: "erik.wolf@outlook.com", city: "Nürnberg", zip: "90403", customerType: "PRIVATKUNDE", status: "POTENZIELL", source: "SOCIAL_MEDIA", assignedUserId: v4.id, gdprConsent: false, tags: ["Neukunde", "Glasfaser"], interestedInGlasfaser: true, aiLeadScore: 55 },

    // Team Süd – v5 Nina Brandt
    { id: "k-17", internalNumber: "KD-20017", firstName: "Hannah", lastName: "Maier", phone: "+49 157 7070780", email: "hannah.m@gmx.de", city: "Stuttgart", zip: "70173", customerType: "PRIVATKUNDE", status: "AKTIV", source: "SHOP", assignedUserId: v5.id, gdprConsent: true, tags: ["VVL-bald", "Zusatzkarte"], potentialAdditionalCards: true, currentMobileProvider: "Vodafone", aiLeadScore: 80, lastContactAt: subDays(now, 3) },
    { id: "k-18", internalNumber: "KD-20018", firstName: "David", lastName: "Krause", phone: "+49 158 8080890", email: "d.krause@icloud.com", city: "Freiburg", zip: "79098", customerType: "SELBSTSTAENDIG", status: "AKTIV", source: "EMPFEHLUNG", assignedUserId: v5.id, gdprConsent: true, tags: ["Business", "Mittel"], businessPotential: "MITTEL", needsMobile: true, needsInternet: true, currentProvider: "1&1", aiLeadScore: 63 },
    { id: "k-19", internalNumber: "KD-20019", firstName: "Laura", lastName: "König", phone: "+49 159 9090901", email: "laura.koenig@gmail.com", city: "München", zip: "80803", customerType: "PRIVATKUNDE", status: "AKTIV", source: "BESTANDSKUNDE", assignedUserId: v5.id, gdprConsent: true, tags: ["MagentaTV"], interestedInMagentaTV: true, currentMobileProvider: "Telekom", aiLeadScore: 58, lastContactAt: subDays(now, 21) },
    { id: "k-20", internalNumber: "KD-20020", firstName: "Industrie", lastName: "Süd GmbH", companyName: "Industrie Süd GmbH", phone: "+49 711 9988770", email: "office@industrie-sued.de", city: "Stuttgart", zip: "70174", customerType: "FIRMA", status: "AKTIV", source: "AUSSENDIENST", assignedUserId: v5.id, gdprConsent: true, tags: ["Business", "High-Value"], businessPotential: "HOCH", employeeCount: 65, possibleSimCards: 50, needsMobile: true, needsInternet: true, needsLandline: true, currentProvider: "Vodafone", aiLeadScore: 88, lastContactAt: subDays(now, 7) },

    // Team Süd – v6 Felix Huber
    { id: "k-21", internalNumber: "KD-20021", firstName: "Oliver", lastName: "Schäfer", phone: "+49 179 1112223", email: "o.schaefer@web.de", city: "Nürnberg", zip: "90402", customerType: "PRIVATKUNDE", status: "AKTIV", source: "BESTANDSKUNDE", assignedUserId: v6.id, gdprConsent: true, tags: ["Glasfaser", "VVL-bald"], interestedInGlasfaser: true, currentMobileProvider: "O2", aiLeadScore: 76, lastContactAt: subDays(now, 6) },
    { id: "k-22", internalNumber: "KD-20022", firstName: "Sabine", lastName: "Hoffmann", phone: "+49 174 2223334", email: "sabine.h@gmx.de", city: "München", zip: "81541", customerType: "FAMILIE", status: "AKTIV", source: "EMPFEHLUNG", assignedUserId: v6.id, gdprConsent: true, tags: ["Familie", "Zusatzkarte"], householdSize: 5, hasChildren: true, potentialAdditionalCards: true, currentMobileProvider: "E-Plus", aiLeadScore: 84, lastContactAt: subDays(now, 4) },
    { id: "k-23", internalNumber: "KD-20023", firstName: "Marco", lastName: "Schneider", phone: "+49 163 3334445", email: "m.schneider@gmail.com", city: "Ingolstadt", zip: "85049", customerType: "PRIVATKUNDE", status: "POTENZIELL", source: "SHOP", assignedUserId: v6.id, gdprConsent: true, tags: ["Neukunde"], currentMobileProvider: "1&1", aiLeadScore: 45 },
    { id: "k-24", internalNumber: "KD-20024", firstName: "MediaGroup", lastName: "Bayern", companyName: "MediaGroup Bayern GmbH", phone: "+49 89 44556677", email: "info@mediagroup-by.de", city: "München", zip: "80335", customerType: "FIRMA", status: "AKTIV", source: "AUSSENDIENST", assignedUserId: v6.id, gdprConsent: true, tags: ["Business", "Premium"], businessPotential: "HOCH", employeeCount: 35, possibleSimCards: 28, needsMobile: true, needsInternet: true, currentProvider: "Vodafone", aiLeadScore: 90, lastContactAt: subDays(now, 2) },
    { id: "k-25", internalNumber: "KD-20025", firstName: "Julia", lastName: "Richter", phone: "+49 161 4445556", email: "julia.r@t-online.de", city: "Regensburg", zip: "93047", customerType: "PRIVATKUNDE", status: "INAKTIV", source: "BESTANDSKUNDE", assignedUserId: v6.id, gdprConsent: true, tags: ["Reaktivierung"], currentMobileProvider: "Telekom", aiLeadScore: 30, lastContactAt: subDays(now, 120) },
  ];

  for (const k of customers) {
    await prisma.customer.upsert({
      where: { id: k.id },
      update: {},
      create: k,
    });
  }

  console.log(`✓ ${customers.length} Kunden angelegt`);

  // ── Verträge ──────────────────────────────────────────────────────────────

  type ContractSeed = Parameters<typeof prisma.contract.create>[0]["data"] & { id: string };

  const contracts: ContractSeed[] = [
    { id: "vt-01", customerId: "k-01", assignedUserId: v1.id, contractType: "MOBILFUNK",           tariffName: "MagentaMobil M",           contractStart: subMonths(now, 20), contractEnd: addDays(now, 50),  cancellationPeriodDays: 90, cancellationDeadline: subDays(addDays(now, 50), 90),  renewalPossibleFrom: subMonths(addDays(now, 50), 6), monthlyPrice: 39.99, status: "BALD_VERLAENGERBAR", expectedProviderCommission: 180, commissionStatus: "ERWARTET", devicePurchased: true, deviceName: "iPhone 14" },
    { id: "vt-02", customerId: "k-02", assignedUserId: v1.id, contractType: "MAGENTA_TV",          tariffName: "MagentaTV S",              contractStart: subMonths(now, 8),  contractEnd: addDays(now, 480), cancellationPeriodDays: 90, monthlyPrice: 10.00, status: "AKTIV", expectedProviderCommission: 50, commissionStatus: "ERHALTEN", receivedProviderCommission: 50 },
    { id: "vt-03", customerId: "k-05", assignedUserId: v1.id, contractType: "MOBILFUNK",           tariffName: "MagentaMobil L",           contractStart: subMonths(now, 14), contractEnd: addDays(now, 290), cancellationPeriodDays: 90, monthlyPrice: 49.99, status: "AKTIV", expectedProviderCommission: 200, commissionStatus: "ERHALTEN", receivedProviderCommission: 200 },
    { id: "vt-04", customerId: "k-06", assignedUserId: v2.id, contractType: "MOBILFUNK",           tariffName: "MagentaMobil S",           contractStart: subMonths(now, 22), contractEnd: addDays(now, 30),  cancellationPeriodDays: 90, cancellationDeadline: subDays(addDays(now, 30), 90),  renewalPossibleFrom: subMonths(addDays(now, 30), 6), monthlyPrice: 29.99, status: "VERLAENGERBAR", expectedProviderCommission: 150, commissionStatus: "ERWARTET", devicePurchased: true, deviceName: "Samsung Galaxy A54" },
    { id: "vt-05", customerId: "k-09", assignedUserId: v2.id, contractType: "BUSINESS_MOBILFUNK",  tariffName: "MagentaBusiness Flat L 35x", contractStart: subMonths(now, 4),  contractEnd: addDays(now, 620), cancellationPeriodDays: 90, monthlyPrice: 524.65, status: "AKTIV", expectedProviderCommission: 1400, commissionStatus: "ERHALTEN", receivedProviderCommission: 1400 },
    { id: "vt-06", customerId: "k-11", assignedUserId: v3.id, contractType: "GLASFASER",           tariffName: "MagentaZuhause XL (Glasfaser)", contractStart: subMonths(now, 10), contractEnd: addDays(now, 420), cancellationPeriodDays: 90, monthlyPrice: 54.95, status: "AKTIV", expectedProviderCommission: 200, commissionStatus: "ERHALTEN", receivedProviderCommission: 200 },
    { id: "vt-07", customerId: "k-13", assignedUserId: v4.id, contractType: "MOBILFUNK",           tariffName: "MagentaMobil M",           contractStart: subMonths(now, 21), contractEnd: addDays(now, 45),  cancellationPeriodDays: 90, cancellationDeadline: subDays(addDays(now, 45), 90),  renewalPossibleFrom: subMonths(addDays(now, 45), 6), monthlyPrice: 39.99, status: "BALD_VERLAENGERBAR", expectedProviderCommission: 180, commissionStatus: "ERWARTET" },
    { id: "vt-08", customerId: "k-14", assignedUserId: v4.id, contractType: "BUSINESS_MOBILFUNK",  tariffName: "MagentaBusiness Flat L 90x", contractStart: subMonths(now, 2),  contractEnd: addDays(now, 700), cancellationPeriodDays: 90, monthlyPrice: 1349.10, status: "AKTIV", expectedProviderCommission: 3600, commissionStatus: "ERWARTET" },
    { id: "vt-09", customerId: "k-17", assignedUserId: v5.id, contractType: "MOBILFUNK",           tariffName: "MagentaMobil S",           contractStart: subMonths(now, 23), contractEnd: addDays(now, 25),  cancellationPeriodDays: 90, cancellationDeadline: subDays(addDays(now, 25), 90),  renewalPossibleFrom: subMonths(addDays(now, 25), 6), monthlyPrice: 29.99, status: "VERLAENGERBAR", expectedProviderCommission: 140, commissionStatus: "ERWARTET" },
    { id: "vt-10", customerId: "k-20", assignedUserId: v5.id, contractType: "BUSINESS_MOBILFUNK",  tariffName: "MagentaBusiness Flat M 50x", contractStart: subMonths(now, 6),  contractEnd: addDays(now, 550), cancellationPeriodDays: 90, monthlyPrice: 699.50, status: "AKTIV", expectedProviderCommission: 1750, commissionStatus: "ERHALTEN", receivedProviderCommission: 1750 },
    { id: "vt-11", customerId: "k-21", assignedUserId: v6.id, contractType: "MOBILFUNK",           tariffName: "MagentaMobil L",           contractStart: subMonths(now, 19), contractEnd: addDays(now, 155), cancellationPeriodDays: 90, monthlyPrice: 49.99, status: "BALD_VERLAENGERBAR", expectedProviderCommission: 200, commissionStatus: "ERWARTET" },
    { id: "vt-12", customerId: "k-22", assignedUserId: v6.id, contractType: "MOBILFUNK",           tariffName: "MagentaMobil S (5x)",      contractStart: subMonths(now, 5),  contractEnd: addDays(now, 580), cancellationPeriodDays: 90, monthlyPrice: 124.95, status: "AKTIV", expectedProviderCommission: 300, commissionStatus: "ERHALTEN", receivedProviderCommission: 300 },
    { id: "vt-13", customerId: "k-24", assignedUserId: v6.id, contractType: "BUSINESS_MOBILFUNK",  tariffName: "MagentaBusiness Flat M 28x", contractStart: subMonths(now, 3),  contractEnd: addDays(now, 650), cancellationPeriodDays: 90, monthlyPrice: 391.72, status: "AKTIV", expectedProviderCommission: 980, commissionStatus: "ERWARTET" },
  ];

  for (const c of contracts) {
    await prisma.contract.upsert({ where: { id: c.id }, update: {}, create: c });
  }

  console.log(`✓ ${contracts.length} Verträge angelegt`);

  // ── Opportunities ─────────────────────────────────────────────────────────

  const opps = [
    { id: "op-01", customerId: "k-01", contractId: "vt-01", assignedUserId: v1.id,  type: "VERTRAGSVERLAENGERUNG", estimatedRevenue: 39.99*24, expectedCommission: 180, probability: 85, priority: "SEHR_HOCH", status: "KONTAKTIERT",         nextStep: "iPhone 16 Angebot erstellen", nextActionDate: addDays(now, 2) },
    { id: "op-02", customerId: "k-01", assignedUserId: v1.id,  type: "GLASFASER",             estimatedRevenue: 49.99*24, expectedCommission: 150, probability: 55, priority: "HOCH",      status: "NEU",                nextStep: "Glasfaser-Verfügbarkeit prüfen" },
    { id: "op-03", customerId: "k-02", assignedUserId: v1.id,  type: "GLASFASER",             estimatedRevenue: 54.95*24, expectedCommission: 200, probability: 60, priority: "MITTEL",    status: "ANGEBOT_ERSTELLT",   nextStep: "Angebot nachfassen", nextActionDate: addDays(now, 5) },
    { id: "op-04", customerId: "k-06", contractId: "vt-04", assignedUserId: v2.id,  type: "VERTRAGSVERLAENGERUNG", estimatedRevenue: 29.99*24, expectedCommission: 150, probability: 90, priority: "SEHR_HOCH", status: "WARTET_AUF_ANTWORT",  nextStep: "Rückruf abwarten" },
    { id: "op-05", customerId: "k-09", assignedUserId: v2.id,  type: "GLASFASER",             estimatedRevenue: 109.95*24, expectedCommission: 400, probability: 75, priority: "HOCH",     status: "ANGEBOT_ERSTELLT",   nextStep: "Angebot besprechen", nextActionDate: addDays(now, 3) },
    { id: "op-06", customerId: "k-09", assignedUserId: v2.id,  type: "BUSINESS_TARIF",        estimatedRevenue: 799.00*24, expectedCommission: 1800, probability: 65, priority: "SEHR_HOCH", status: "NEU",               nextStep: "Bedarfsanalyse vereinbaren" },
    { id: "op-07", customerId: "k-11", assignedUserId: v3.id,  type: "MAGENTA_TV",            estimatedRevenue: 15.00*24, expectedCommission: 60,  probability: 80, priority: "MITTEL",    status: "KONTAKTIERT",        nextStep: "Paket anbieten", nextActionDate: addDays(now, 1) },
    { id: "op-08", customerId: "k-13", contractId: "vt-07", assignedUserId: v4.id,  type: "VERTRAGSVERLAENGERUNG", estimatedRevenue: 39.99*24, expectedCommission: 180, probability: 80, priority: "SEHR_HOCH", status: "KONTAKTIERT",         nextStep: "Angebot mit Gerät vorbereiten", nextActionDate: addDays(now, 2) },
    { id: "op-09", customerId: "k-14", assignedUserId: v4.id,  type: "BUSINESS_TARIF",        estimatedRevenue: 1599.00*24, expectedCommission: 4200, probability: 70, priority: "SEHR_HOCH", status: "ANGEBOT_ERSTELLT", nextStep: "Präsentation beim GF", nextActionDate: addDays(now, 4), aiRecommendation: "Sehr hoher CLV. Persönlichem Meeting Vorrang geben." },
    { id: "op-10", customerId: "k-17", contractId: "vt-09", assignedUserId: v5.id,  type: "VERTRAGSVERLAENGERUNG", estimatedRevenue: 29.99*24, expectedCommission: 140, probability: 92, priority: "SEHR_HOCH", status: "WARTET_AUF_ANTWORT",  nextStep: "Entscheidung bis Freitag" },
    { id: "op-11", customerId: "k-18", assignedUserId: v5.id,  type: "BUSINESS_TARIF",        estimatedRevenue: 199.00*24, expectedCommission: 600, probability: 50, priority: "HOCH",     status: "NEU",                nextStep: "Erstgespräch terminieren" },
    { id: "op-12", customerId: "k-20", assignedUserId: v5.id,  type: "GLASFASER",             estimatedRevenue: 89.95*24, expectedCommission: 350, probability: 68, priority: "HOCH",     status: "KONTAKTIERT",        nextStep: "Glasfaser-Angebot ausarbeiten", nextActionDate: addDays(now, 6) },
    { id: "op-13", customerId: "k-21", contractId: "vt-11", assignedUserId: v6.id,  type: "VERTRAGSVERLAENGERUNG", estimatedRevenue: 49.99*24, expectedCommission: 200, probability: 75, priority: "HOCH",      status: "KONTAKTIERT",        nextStep: "Glasfaser-Kombi anbieten" },
    { id: "op-14", customerId: "k-22", assignedUserId: v6.id,  type: "ZUSATZKARTE",           estimatedRevenue: 19.99*24*2, expectedCommission: 80, probability: 85, priority: "MITTEL",  status: "ANGEBOT_ERSTELLT",   nextStep: "Angebot nachfassen", nextActionDate: addDays(now, 3) },
    { id: "op-15", customerId: "k-24", assignedUserId: v6.id,  type: "GLASFASER",             estimatedRevenue: 109.95*24, expectedCommission: 400, probability: 72, priority: "HOCH",    status: "ANGEBOT_ERSTELLT",   nextStep: "Entscheidungsträger kontaktieren", nextActionDate: addDays(now, 2) },
  ];

  for (const o of opps) {
    await prisma.opportunity.upsert({
      where: { id: o.id },
      update: {},
      create: o as Parameters<typeof prisma.opportunity.create>[0]["data"],
    });
  }

  console.log(`✓ ${opps.length} Deals/Opportunities angelegt`);

  // ── Aufgaben ──────────────────────────────────────────────────────────────

  const tasks = [
    { id: "ta-01", customerId: "k-01", contractId: "vt-01", assignedUserId: v1.id,  title: "KRITISCH: Vertrag Richter läuft in 50 Tagen aus", taskType: "ANRUF",          dueDate: addDays(now, 1),   priority: "SEHR_HOCH", status: "OFFEN",       autoCreated: true },
    { id: "ta-02", customerId: "k-02", assignedUserId: v1.id,  title: "Glasfaser-Angebot Familie Vogel nachfassen",        taskType: "EMAIL",          dueDate: addDays(now, 3),   priority: "HOCH",      status: "OFFEN" },
    { id: "ta-03", customerId: "k-03", assignedUserId: v1.id,  title: "Erstberatung Lange: Glasfaser-Verfügbarkeit",       taskType: "ANRUF",          dueDate: addDays(now, 5),   priority: "MITTEL",    status: "OFFEN" },
    { id: "ta-04", customerId: "k-06", contractId: "vt-04", assignedUserId: v2.id,  title: "KRITISCH: Vertrag Zimmermann läuft in 30 Tagen aus", taskType: "ANRUF",         dueDate: subDays(now, 2),  priority: "SEHR_HOCH", status: "UEBERFAELLIG", autoCreated: true },
    { id: "ta-05", customerId: "k-09", assignedUserId: v2.id,  title: "Business-Präsentation Digital Werke vorbereiten",  taskType: "SONSTIGES",      dueDate: addDays(now, 4),   priority: "HOCH",      status: "OFFEN" },
    { id: "ta-06", customerId: "k-11", assignedUserId: v3.id,  title: "MagentaTV-Angebot Klein nachfassen",                taskType: "WHATSAPP",       dueDate: addDays(now, 1),   priority: "HOCH",      status: "OFFEN" },
    { id: "ta-07", customerId: "k-12", assignedUserId: v3.id,  title: "Verlorenen Kunden Hartmann reaktivieren",          taskType: "ANRUF",          dueDate: addDays(now, 7),   priority: "NIEDRIG",   status: "OFFEN" },
    { id: "ta-08", customerId: "k-13", contractId: "vt-07", assignedUserId: v4.id,  title: "KRITISCH: Vertrag Bauer läuft in 45 Tagen aus",   taskType: "ANRUF",          dueDate: addDays(now, 2),   priority: "SEHR_HOCH", status: "OFFEN",       autoCreated: true },
    { id: "ta-09", customerId: "k-14", assignedUserId: v4.id,  title: "TechSolutions: GF-Termin für Vertragsabschluss",   taskType: "SONSTIGES",      dueDate: addDays(now, 4),   priority: "SEHR_HOCH", status: "OFFEN" },
    { id: "ta-10", customerId: "k-15", assignedUserId: v4.id,  title: "Familie Schwarz: MagentaTV-Angebot besprechen",    taskType: "ANRUF",          dueDate: addDays(now, 6),   priority: "MITTEL",    status: "OFFEN" },
    { id: "ta-11", customerId: "k-17", contractId: "vt-09", assignedUserId: v5.id,  title: "KRITISCH: Vertrag Maier läuft in 25 Tagen aus",   taskType: "ANRUF",          dueDate: subDays(now, 1),  priority: "SEHR_HOCH", status: "UEBERFAELLIG", autoCreated: true },
    { id: "ta-12", customerId: "k-20", assignedUserId: v5.id,  title: "Industrie Süd: Glasfaser-Angebot erstellen",       taskType: "ANGEBOT_SENDEN", dueDate: addDays(now, 5),   priority: "HOCH",      status: "OFFEN" },
    { id: "ta-13", customerId: "k-21", contractId: "vt-11", assignedUserId: v6.id,  title: "Vertrag Schäfer: Verlängerungsangebot vorbereiten", taskType: "ANGEBOT_SENDEN", dueDate: addDays(now, 3),   priority: "HOCH",      status: "OFFEN" },
    { id: "ta-14", customerId: "k-24", assignedUserId: v6.id,  title: "MediaGroup: Glasfaser-Entscheidung nachfragen",    taskType: "ANRUF",          dueDate: addDays(now, 2),   priority: "HOCH",      status: "OFFEN" },
    { id: "ta-15", customerId: "k-25", assignedUserId: v6.id,  title: "Inaktiven Kunden Richter reaktivieren",            taskType: "WHATSAPP",       dueDate: addDays(now, 10),  priority: "NIEDRIG",   status: "OFFEN" },
  ];

  for (const t of tasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: t as Parameters<typeof prisma.task.create>[0]["data"],
    });
  }

  console.log(`✓ ${tasks.length} Aufgaben angelegt`);

  // ── Provisionen ───────────────────────────────────────────────────────────

  const comms = [
    { id: "cm-01", customerId: "k-09", contractId: "vt-05", userId: v2.id, productType: "BUSINESS_MOBILFUNK", dealDate: subMonths(now, 4), expectedProviderCommission: 1400, receivedProviderCommission: 1400, appliedRuleType: "PERCENTAGE", calculatedSalesCommission: 420, finalSalesCommission: 420, payoutStatus: "AUSGEZAHLT", payoutDate: subMonths(now, 3), chargebackUntil: addDays(subMonths(now, 4), 180) },
    { id: "cm-02", customerId: "k-02", contractId: "vt-02", userId: v1.id, productType: "MAGENTA_TV",         dealDate: subMonths(now, 8), expectedProviderCommission: 50,   receivedProviderCommission: 50,   appliedRuleType: "FIXED",       calculatedSalesCommission: 20,  finalSalesCommission: 20,  payoutStatus: "AUSGEZAHLT", payoutDate: subMonths(now, 7), chargebackUntil: addDays(subMonths(now, 8), 180) },
    { id: "cm-03", customerId: "k-05", contractId: "vt-03", userId: v1.id, productType: "MOBILFUNK",          dealDate: subMonths(now, 14),expectedProviderCommission: 200,  receivedProviderCommission: 200,  appliedRuleType: "FIXED",       calculatedSalesCommission: 40,  finalSalesCommission: 40,  payoutStatus: "AUSGEZAHLT", payoutDate: subMonths(now, 13), chargebackUntil: addDays(subMonths(now, 14), 180) },
    { id: "cm-04", customerId: "k-11", contractId: "vt-06", userId: v3.id, productType: "GLASFASER",          dealDate: subMonths(now, 10),expectedProviderCommission: 200,  receivedProviderCommission: 200,  appliedRuleType: "PRODUCT_PERCENTAGE", calculatedSalesCommission: 50, finalSalesCommission: 50, payoutStatus: "FREIGEGEBEN", chargebackUntil: addDays(subMonths(now, 10), 180) },
    { id: "cm-05", customerId: "k-20", contractId: "vt-10", userId: v5.id, productType: "BUSINESS_MOBILFUNK", dealDate: subMonths(now, 6), expectedProviderCommission: 1750, receivedProviderCommission: 1750, appliedRuleType: "PERCENTAGE",  calculatedSalesCommission: 437, finalSalesCommission: 437, payoutStatus: "AUSGEZAHLT", payoutDate: subMonths(now, 5), chargebackUntil: addDays(subMonths(now, 6), 180) },
    { id: "cm-06", customerId: "k-22", contractId: "vt-12", userId: v6.id, productType: "MOBILFUNK",          dealDate: subMonths(now, 5), expectedProviderCommission: 300,  receivedProviderCommission: 300,  appliedRuleType: "PRODUCT_PERCENTAGE", calculatedSalesCommission: 90, finalSalesCommission: 90, payoutStatus: "AUSGEZAHLT", payoutDate: subMonths(now, 4), chargebackUntil: addDays(subMonths(now, 5), 180) },
    { id: "cm-07", customerId: "k-08", userId: v4.id,       productType: "BUSINESS_MOBILFUNK", dealDate: subMonths(now, 2), expectedProviderCommission: 3600, appliedRuleType: "PRODUCT_PERCENTAGE", calculatedSalesCommission: 1260, finalSalesCommission: 1260, payoutStatus: "OFFEN", chargebackUntil: addDays(subMonths(now, 2), 180) },
  ];

  for (const c of comms) {
    await prisma.commission.upsert({
      where: { id: c.id },
      update: {},
      create: c as Parameters<typeof prisma.commission.create>[0]["data"],
    });
  }

  console.log(`✓ ${comms.length} Provisionen angelegt`);

  // ── Interaktionen ─────────────────────────────────────────────────────────

  await prisma.interaction.createMany({
    skipDuplicates: true,
    data: [
      { id: "ia-01", customerId: "k-01", userId: v1.id,  type: "ANRUF",    summary: "VVL-Gespräch geführt. Richter interessiert an iPhone 16 Pro.", result: "Angebot vorbereiten", nextStep: "Angebot senden bis Freitag", createdAt: subDays(now, 4) },
      { id: "ia-02", customerId: "k-06", userId: v2.id,  type: "ANRUF",    summary: "VVL Zimmermann: Möchte aktuellen Tarif behalten oder auf M upgraden.", result: "Angebot mit M-Tarif folgt", nextStep: "Angebot schicken", createdAt: subDays(now, 2) },
      { id: "ia-03", customerId: "k-09", userId: v2.id,  type: "MEETING",  summary: "Vor-Ort-Termin Digital Werke. CEO will 35 neue SIM-Karten.", result: "Angebot ausgearbeitet", nextStep: "Angebot präsentieren", createdAt: subDays(now, 6) },
      { id: "ia-04", customerId: "k-14", userId: v4.id,  type: "MEETING",  summary: "Erstgespräch TechSolutions. Expansionspläne: 120 → 150 Mitarbeiter.", result: "Bedarfsaufnahme abgeschlossen", nextStep: "GF-Termin für Präsentation", createdAt: subDays(now, 1) },
      { id: "ia-05", customerId: "k-17", userId: v5.id,  type: "ANRUF",    summary: "Maier wartet auf schriftliches Angebot für VVL.", result: "Angebot wird heute versendet", nextStep: "Angebot per E-Mail senden", createdAt: subDays(now, 3) },
      { id: "ia-06", customerId: "k-20", userId: v5.id,  type: "EMAIL",    summary: "Industrie Süd hat Glasfaser-Interesse signalisiert.", result: "Termin für Begehung vereinbart", nextStep: "Angebot ausarbeiten", createdAt: subDays(now, 7) },
      { id: "ia-07", customerId: "k-24", userId: v6.id,  type: "MEETING",  summary: "MediaGroup: IT-Leiter bestätigt Glasfaser-Bedarf.", result: "Angebot in Vorbereitung", nextStep: "Entscheidung bis Ende Woche", createdAt: subDays(now, 2) },
      { id: "ia-08", customerId: "k-11", userId: v3.id,  type: "WHATSAPP", summary: "Sophie Klein fragt nach MagentaTV-Paket mit Glasfaser.", result: "Angebot zugesendet", nextStep: "Nachfassen in 3 Tagen", createdAt: subDays(now, 1) },
    ],
  });

  console.log("✓ Interaktionen angelegt");

  // ── Reminder-Regeln ───────────────────────────────────────────────────────

  const rules = [
    { id: "rr-vvl-180", name: "VVL 180 Tage",   trigger: "DAYS_BEFORE_CONTRACT_END", days: 180, title: "VVL-Prüfung: Vertrag in 6 Monaten fällig",    type: "VERTRAG_PRUEFEN"  },
    { id: "rr-vvl-120", name: "VVL 120 Tage",   trigger: "DAYS_BEFORE_CONTRACT_END", days: 120, title: "Kunden wegen Verlängerung kontaktieren",        type: "ANRUF"            },
    { id: "rr-vvl-90",  name: "VVL 90 Tage",    trigger: "DAYS_BEFORE_CONTRACT_END", days: 90,  title: "Angebot zur Vertragsverlängerung vorbereiten",  type: "ANGEBOT_SENDEN"   },
    { id: "rr-vvl-60",  name: "VVL 60 Tage",    trigger: "DAYS_BEFORE_CONTRACT_END", days: 60,  title: "Nachfassaktion: Vertragsverlängerung",          type: "NACHFASSEN"       },
    { id: "rr-vvl-30",  name: "VVL 30 Tage",    trigger: "DAYS_BEFORE_CONTRACT_END", days: 30,  title: "KRITISCH: Vertrag läuft bald aus!",             type: "ANRUF"            },
    { id: "rr-angebot", name: "Angebot Nachfassen", trigger: "DAYS_AFTER_OFFER_SENT", days: 7,  title: "Angebot nachfassen",                            type: "NACHFASSEN"       },
    { id: "rr-provisi", name: "Provision Prüfen",   trigger: "DAYS_AFTER_CLOSE",      days: 30, title: "Provision prüfen nach Abschluss",               type: "PROVISION_PRUEFEN"},
    { id: "rr-kontakt", name: "Kein Kontakt 90T",   trigger: "DAYS_WITHOUT_CONTACT",  days: 90, title: "Kunde erneut kontaktieren",                     type: "ANRUF"            },
  ];
  for (const r of rules) {
    await prisma.reminderRule.upsert({
      where: { id: r.id },
      update: {},
      create: { id: r.id, name: r.name, triggerType: r.trigger as "DAYS_BEFORE_CONTRACT_END", daysOffset: r.days, taskTitle: r.title, taskType: r.type as "ANRUF", active: true },
    });
  }

  console.log("✓ Reminder-Regeln angelegt");
  console.log("");
  console.log("═══════════════════════════════════════════");
  console.log("  ✅  Seed erfolgreich abgeschlossen!");
  console.log("═══════════════════════════════════════════");
  console.log("");
  console.log("  Zugangsdaten (Passwort überall: demo123)");
  console.log("");
  console.log("  ADMIN       admin@demo.de");
  console.log("  TEAMLEITER  sarah.weber@demo.de   (Team Nord)");
  console.log("  TEAMLEITER  k.bergmann@demo.de    (Team Süd)");
  console.log("  VERTRIEBLER t.mueller@demo.de     (Team Nord)");
  console.log("  VERTRIEBLER j.becker@demo.de      (Team Nord)");
  console.log("  VERTRIEBLER m.schulz@demo.de      (Team Nord)");
  console.log("  VERTRIEBLER s.schmidt@demo.de     (Team Süd)");
  console.log("  VERTRIEBLER n.brandt@demo.de      (Team Süd)");
  console.log("  VERTRIEBLER f.huber@demo.de       (Team Süd)");
  console.log("");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
