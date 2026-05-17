# TelecomSales OS — Setup-Anleitung

## Voraussetzungen

- Node.js 18+ (aktuell: v24)
- PostgreSQL 14+ (lokal oder cloud)
- OpenAI API-Key (optional, für KI-Funktionen)

## Schritt 1: Datenbank aufsetzen

### Option A: PostgreSQL lokal (empfohlen für Entwicklung)

Windows:
```
1. PostgreSQL von postgresql.org herunterladen und installieren
2. pgAdmin öffnen
3. Neue Datenbank erstellen: "telecom_sales_os"
```

### Option B: Supabase (kostenlos, cloud)

```
1. supabase.com → New Project anlegen
2. Connection String kopieren (Settings → Database → Connection String)
3. In .env eintragen
```

## Schritt 2: Umgebungsvariablen konfigurieren

`.env` Datei bearbeiten:

```env
# PostgreSQL Verbindung
DATABASE_URL="postgresql://postgres:IhrPasswort@localhost:5432/telecom_sales_os"

# Auth Secret (mindestens 32 Zeichen, beliebig wählbar)
AUTH_SECRET="ihr-geheimes-passwort-mindestens-32-zeichen-lang!!"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OpenAI (optional, für KI-Funktionen)
OPENAI_API_KEY="sk-..."
```

## Schritt 3: Datenbank-Schema erstellen

```bash
cd telecom-sales-os

# Schema in Datenbank übertragen
npx prisma migrate dev --name init

# ODER für schnellen Start ohne Migration:
npx prisma db push
```

## Schritt 4: Demo-Daten laden

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

## Schritt 5: App starten

```bash
npm run dev
```

Browser öffnen: http://localhost:3000

## Demo-Zugangsdaten

| Rolle | E-Mail | Passwort |
|-------|--------|----------|
| Admin | admin@demo.de | admin123 |
| Vertriebler | mueller@demo.de | sales123 |
| Vertriebler | schmidt@demo.de | sales123 |

## Funktionsübersicht MVP

### Phase 1 (implementiert) ✅
- [x] Login mit Rollenbasiertem Zugriff (Admin / Vertriebler)
- [x] Admin-Dashboard mit KPI-Kacheln
- [x] Vertriebler-Dashboard "Was liegt heute an?"
- [x] Kunden-CRM mit allen Feldern (Privat + Business)
- [x] Kundenakte mit 7 Tabs
- [x] Vertragsverwaltung mit automatischer Fristenberechnung
- [x] Automatische Reminder-Aufgaben (180/120/90/60/30 Tage vor VVL)
- [x] Aufgaben-System (Heute / Überfällig / Alle)
- [x] Pipeline-Kanban (7 Status-Spalten)
- [x] Angebots-Verwaltung mit Auto-Nachfassen
- [x] Provisionssystem (4 Regeltypen)
- [x] Individuelle Provisionsregeln pro Vertriebler
- [x] Auszahlungsfreigabe durch Admin
- [x] KI-Assistent (6 Funktionen, mit Fallback ohne API-Key)
- [x] CSV/Excel-Import mit Duplikaterkennung
- [x] CSV-Export Kundenliste
- [x] Vertrieblerverwaltung durch Admin
- [x] DSGVO-Consent-Tracking

### Phase 2 (nächste Iteration)
- [ ] WhatsApp Business API Integration
- [ ] Dokumenten-Upload (Supabase Storage)
- [ ] Erweiterte KI-Lead-Scores (automatisch)
- [ ] E-Mail-Benachrichtigungen (Resend)
- [ ] Mehr Dashboard-Charts (Recharts)
- [ ] Duplikaterkennung (erweitert)

## Technischer Stack

| Komponente | Technologie |
|------------|-------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| UI-Komponenten | Radix UI, shadcn/ui-ähnlich |
| Backend | Next.js API Routes |
| Datenbank | PostgreSQL + Prisma 7 |
| Auth | JWT (HttpOnly Cookie), bcryptjs |
| KI | OpenAI GPT-4o-mini |
| CSV | PapaParse |
| Icons | Lucide React |

## Produktion deployen

```bash
# Vercel (empfohlen)
vercel

# Manuell
npm run build
npm start
```

Umgebungsvariablen in Vercel Dashboard hinterlegen.
