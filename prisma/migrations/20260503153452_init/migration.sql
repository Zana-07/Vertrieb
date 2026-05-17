-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SALES', 'MANAGER');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('PRIVATKUNDE', 'FAMILIE', 'FIRMA', 'SELBSTSTAENDIG');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('TELEFON', 'WHATSAPP', 'EMAIL', 'PERSOENLICH');

-- CreateEnum
CREATE TYPE "CustomerSource" AS ENUM ('SHOP', 'EMPFEHLUNG', 'AUSSENDIENST', 'WEBSITE', 'SOCIAL_MEDIA', 'BESTANDSKUNDE', 'SONSTIGE');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('AKTIV', 'INAKTIV', 'POTENZIELL', 'VERLOREN', 'GESPERRT');

-- CreateEnum
CREATE TYPE "BusinessPotential" AS ENUM ('NIEDRIG', 'MITTEL', 'HOCH');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('MOBILFUNK', 'FESTNETZ', 'GLASFASER', 'MAGENTA_TV', 'ZUSATZKARTE', 'BUSINESS_MOBILFUNK', 'BUSINESS_FESTNETZ', 'GERAET', 'VERSICHERUNG', 'ZUBEHOER', 'SONSTIGES');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('AKTIV', 'BALD_VERLAENGERBAR', 'VERLAENGERBAR', 'GEKUENDIGT', 'VERLAENGERT', 'VERLOREN', 'UNKLAR');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('OFFEN', 'ERWARTET', 'ERHALTEN', 'TEILWEISE_ERHALTEN', 'ABWEICHEND', 'STORNIERT');

-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('VERTRAGSVERLAENGERUNG', 'NEUVERTRAG', 'GLASFASER', 'FESTNETZ', 'MAGENTA_TV', 'ZUSATZKARTE', 'GERAETEVERKAUF', 'ZUBEHOERVERKAUF', 'VERSICHERUNG', 'BUSINESS_TARIF', 'TARIFWECHSEL', 'WINBACK', 'EMPFEHLUNG', 'SONSTIGER_UPSELL');

-- CreateEnum
CREATE TYPE "OpportunityPriority" AS ENUM ('NIEDRIG', 'MITTEL', 'HOCH', 'SEHR_HOCH');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('NEU', 'KONTAKTIERT', 'ANGEBOT_ERSTELLT', 'WARTET_AUF_ANTWORT', 'NACHFASSEN_NOETIG', 'GEWONNEN', 'VERLOREN', 'STORNIERT');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('ANRUF', 'WHATSAPP', 'EMAIL', 'ANGEBOT_SENDEN', 'NACHFASSEN', 'VERTRAG_PRUEFEN', 'PROVISION_PRUEFEN', 'DOKUMENT_NACHREICHEN', 'SONSTIGES');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OFFEN', 'ERLEDIGT', 'UEBERFAELLIG', 'VERSCHOBEN');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('NIEDRIG', 'MITTEL', 'HOCH', 'SEHR_HOCH');

-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('ANRUF', 'WHATSAPP', 'EMAIL', 'MEETING', 'NOTIZ');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('ERSTELLT', 'GESENDET', 'INTERESSIERT', 'WARTET_AUF_ANTWORT', 'ANGENOMMEN', 'ABGELEHNT', 'ABGELAUFEN');

-- CreateEnum
CREATE TYPE "CommissionRuleType" AS ENUM ('FIXED', 'PERCENTAGE', 'PRODUCT_PERCENTAGE', 'MANUAL');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('OFFEN', 'FREIGEGEBEN', 'AUSGEZAHLT', 'GESPERRT', 'STORNIERT');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('DAYS_BEFORE_CONTRACT_END', 'DAYS_AFTER_CONTRACT_END', 'DAYS_AFTER_OFFER_SENT', 'DAYS_WITHOUT_CONTACT', 'DAYS_AFTER_CLOSE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'SALES',
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "internalNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "companyName" TEXT,
    "customerType" "CustomerType" NOT NULL DEFAULT 'PRIVATKUNDE',
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "zip" TEXT,
    "city" TEXT,
    "birthDate" TIMESTAMP(3),
    "preferredContact" "ContactMethod" NOT NULL DEFAULT 'TELEFON',
    "source" "CustomerSource" NOT NULL DEFAULT 'BESTANDSKUNDE',
    "assignedUserId" TEXT,
    "status" "CustomerStatus" NOT NULL DEFAULT 'AKTIV',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "gdprConsent" BOOLEAN NOT NULL DEFAULT false,
    "gdprConsentDate" TIMESTAMP(3),
    "lastContactAt" TIMESTAMP(3),
    "nextContactAt" TIMESTAMP(3),
    "maritalStatus" TEXT,
    "householdSize" INTEGER,
    "hasChildren" BOOLEAN,
    "potentialAdditionalCards" BOOLEAN,
    "currentMobileProvider" TEXT,
    "currentLandlineProvider" TEXT,
    "interestedInMagentaTV" BOOLEAN,
    "interestedInGlasfaser" BOOLEAN,
    "interestedInDevice" BOOLEAN,
    "contactPerson" TEXT,
    "industry" TEXT,
    "employeeCount" INTEGER,
    "possibleSimCards" INTEGER,
    "currentProvider" TEXT,
    "needsLandline" BOOLEAN,
    "needsInternet" BOOLEAN,
    "needsMobile" BOOLEAN,
    "needsDevices" BOOLEAN,
    "businessPotential" "BusinessPotential",
    "aiLeadScore" INTEGER,
    "aiLeadScoreUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "assignedUserId" TEXT,
    "contractType" "ContractType" NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'Telekom',
    "tariffName" TEXT NOT NULL,
    "contractNumber" TEXT,
    "contractStart" TIMESTAMP(3),
    "contractEnd" TIMESTAMP(3),
    "minimumTermMonths" INTEGER,
    "cancellationPeriodDays" INTEGER DEFAULT 90,
    "cancellationDeadline" TIMESTAMP(3),
    "renewalPossibleFrom" TIMESTAMP(3),
    "devicePurchased" BOOLEAN,
    "deviceName" TEXT,
    "monthlyPrice" DECIMAL(10,2),
    "oneTimePayment" DECIMAL(10,2),
    "addons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "magentaEins" BOOLEAN,
    "status" "ContractStatus" NOT NULL DEFAULT 'AKTIV',
    "expectedProviderCommission" DECIMAL(10,2),
    "receivedProviderCommission" DECIMAL(10,2),
    "commissionStatus" "CommissionStatus" NOT NULL DEFAULT 'OFFEN',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "contractId" TEXT,
    "assignedUserId" TEXT,
    "type" "OpportunityType" NOT NULL,
    "estimatedRevenue" DECIMAL(10,2),
    "expectedCommission" DECIMAL(10,2),
    "probability" INTEGER NOT NULL DEFAULT 50,
    "priority" "OpportunityPriority" NOT NULL DEFAULT 'MITTEL',
    "status" "OpportunityStatus" NOT NULL DEFAULT 'NEU',
    "nextStep" TEXT,
    "nextActionDate" TIMESTAMP(3),
    "lostReason" TEXT,
    "aiRecommendation" TEXT,
    "closedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "contractId" TEXT,
    "opportunityId" TEXT,
    "assignedUserId" TEXT,
    "title" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL DEFAULT 'ANRUF',
    "dueDate" TIMESTAMP(3),
    "dueTime" TEXT,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MITTEL',
    "status" "TaskStatus" NOT NULL DEFAULT 'OFFEN',
    "resultNote" TEXT,
    "autoCreated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL,
    "summary" TEXT NOT NULL,
    "result" TEXT,
    "nextStep" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "userId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "tariffName" TEXT,
    "deviceName" TEXT,
    "monthlyPrice" DECIMAL(10,2),
    "oneTimePayment" DECIMAL(10,2),
    "contractDuration" INTEGER,
    "addons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "expectedCommission" DECIMAL(10,2),
    "offerDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "status" "OfferStatus" NOT NULL DEFAULT 'ERSTELLT',
    "followUpDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_rules" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ruleName" TEXT NOT NULL,
    "ruleType" "CommissionRuleType" NOT NULL,
    "productType" "ContractType",
    "fixedAmount" DECIMAL(10,2),
    "percentage" DECIMAL(5,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commissions" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "contractId" TEXT,
    "opportunityId" TEXT,
    "userId" TEXT NOT NULL,
    "productType" "ContractType" NOT NULL,
    "dealDate" TIMESTAMP(3) NOT NULL,
    "expectedProviderCommission" DECIMAL(10,2),
    "receivedProviderCommission" DECIMAL(10,2),
    "appliedRuleType" "CommissionRuleType",
    "calculatedSalesCommission" DECIMAL(10,2),
    "manualAdjustment" DECIMAL(10,2),
    "finalSalesCommission" DECIMAL(10,2),
    "payoutStatus" "PayoutStatus" NOT NULL DEFAULT 'OFFEN',
    "payoutDate" TIMESTAMP(3),
    "chargebackUntil" TIMESTAMP(3),
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "productType" "ContractType" NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'Telekom',
    "defaultExpectedCommission" DECIMAL(10,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminder_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "triggerType" "TriggerType" NOT NULL,
    "daysOffset" INTEGER NOT NULL,
    "taskTitle" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reminder_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT,
    "type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_internalNumber_key" ON "customers"("internalNumber");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_rules" ADD CONSTRAINT "commission_rules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_logs" ADD CONSTRAINT "ai_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_logs" ADD CONSTRAINT "ai_logs_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
