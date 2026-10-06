# ista & Vastgoedbeheer Dispute Shield 🛡️

Een gespecialiseerde webapplicatie en juridische analyse-engine ontworpen om Nederlandse huurders te beschermen tegen onrechtmatige stookkosten- en servicekostenafrekeningen (zoals opgesteld door **ista** en **Hoekstra Vastgoedbeheer**).

---

## 🌟 Belangrijkste Functies

1. **AI Document & Factuurscanner (Gemini 2.5 Flash)**:
   - Upload of fotografeer een afrekening.
   - Automatische extractie van beheerder, adres, afrekenperiode, voorschotten en openstaand saldo.
   - Detecteert automatisch vormfouten en ontbrekende bronspecificaties conform **Boek 7 van het Burgerlijk Wetboek (BW)**.

2. **Officiële Sommatiebrief Generator (PDF)**:
   - Genereert direct een juridisch sluitende, aangetekende sommatiebrief in PDF.
   - Beroept zich formeel op:
     - **Art. 7:259 lid 4 BW** (Strikte verplichting tot inzage in originele gasinkoopnota's, hoofdmeters en K-waarden).
     - **Art. 6:52 BW** (Wettelijk opschortingsrecht van het betwiste saldo).

3. **Juridische Stappentracker**:
   - Begeleidt de huurder stap-voor-stap door de 21-dagen reactietermijn, incassobescherming en de eventuele procedure bij de **Huurcommissie**.

---

## 🚀 Lokale Installatie & Opstarten

### Vereisten
- **Node.js** (LTS v20+)
- **Gemini API Key** (Google AI Studio)

### 1. Repository klonen
```bash
git clone https://github.com/Bronkie020020/monster.git
cd monster
```

### 2. Afhankelijkheden installeren
```bash
npm install
cd client && npm install && cd ..
```

### 3. Configuratie (.env)
Maak een `.env` bestand in de hoofdmap gebaseerd op `.env.example`:
```env
PORT=3001
GEMINI_API_KEY=jouw_gemini_api_key
```

### 4. Applicatie starten

**Optie A: 1-Klik Starten (Windows)**
Dubbelklik op `start.bat` of voer uit:
```cmd
start.bat
```

**Optie B: Handmatig via Terminal**
```bash
# Server & Client gecombineerd starten:
node server/index.js
```
Open vervolgens in je browser: [http://localhost:3001](http://localhost:3001)

---

## ⚖️ Juridische Grondslagen
- **Art. 7:259 lid 2 BW**: Jaarafrekening moet uiterlijk 6 maanden na het kalenderjaar (1 juli) worden verstrekt.
- **Art. 7:259 lid 4 BW**: De verhuurder moet desgevraagd inzage geven in alle onderliggende inkoopnota's en verbruiksmeterstanden.
- **Art. 6:52 BW**: Opschortingsrecht van de betaling zolang de verhuurder geen inzage verleent.
