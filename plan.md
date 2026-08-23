# Honey Chain — Project Plan

**Problem Statement ID:** 26021
**Organization:** Ministry of MSME | **Category:** Software | **Theme:** Smart Automation

A blockchain + IoT + AI based honey traceability and smart beekeeping platform for KVIC's Honey Mission beekeepers.

---

## 1. Problem Recap (one-liner)

Rural beekeepers under KVIC lack tools to prove their honey is authentic, get fair prices, or manage hive health. Consumers can't verify honey purity/origin. We fix this with: **QR-verified blockchain traceability + IoT hive monitoring + AI disease/productivity prediction + fair market linkage.**

---

## 2. Scope Decision (lock this before building)

To avoid overbuilding, we ship a **believable end-to-end prototype**, not production infrastructure.

| Layer                                  | Real or Simulated for demo?                                                 |
| -------------------------------------- | --------------------------------------------------------------------------- |
| Blockchain ledger                      | Real (lightweight custom hash-chain or Hyperledger-style, not mainnet)      |
| QR generation & scan verification      | Real                                                                        |
| IoT sensor data (temp/humidity/weight) | Real dataset (HOBOS/Kaggle) replayed as live stream                         |
| Disease detection (image)              | Real CNN, trained on Kaggle Varroa dataset                                  |
| Purity/adulteration test               | **Simulated** — synthetic data, clearly labeled as "lab-integration ready"  |
| Fair pricing engine                    | Real logic, using real state-wise Indian honey production/price data        |
| Botanical origin tagging               | Real rule-based lookup (season + location → flora), from EAC-PM report data |
| SMS/offline/voice UI                   | Simulated/mocked in demo, described in architecture doc                     |

**Golden rule:** 2 features working flawlessly > 5 features half-broken.

---

## 3. Core Features (MVP — must have)

1. **Beekeeper batch registration** — beekeeper/field officer logs a honey batch (location, date, hive ID, quantity).
2. **Blockchain ledger** — every batch entry is hashed and chained; tampering with past records visibly breaks the chain.
3. **QR code generation** — unique QR per batch/bottle.
4. **Consumer verification page** — scan QR → see full journey: farm location (map), harvest date, beekeeper info, purity test result, "trust score."
5. **One-time-scan lock** — QR flips to "verified/opened" on first scan; re-scanning elsewhere flags a possible counterfeit.
6. **IoT hive dashboard** — live(ish) temperature/humidity/weight graphs per hive, replayed from real dataset.
7. **AI disease detection** — upload/capture a bee image → classify healthy vs. Varroa-infected.
8. **Productivity/harvest-time prediction** — simple model predicts yield / best harvest date from weight trend.
9. **Fair price suggestion** — given purity score + floral rarity + batch size, suggest a floor price using real market data.

## 4. Differentiator Features (pick 2-3 if time allows)

- **Botanical origin tagging** ("Mustard honey," "Litchi honey") from location + season lookup table.
- **Trust Score / Honey Report Card** (A/B/C grade combining purity + chain completeness + beekeeper reputation).
- **Beekeeper reputation score** over time, shown to aggregators/buyers.
- **Swarm/absconding early warning** — sudden weight drop → SMS alert simulation.
- **"Meet your beekeeper" story page** on the QR scan result (photo, village, bio).
- **KVIC cluster dashboard** — aggregate view across a village cluster (yield, disease alerts, price trends).
- **Direct reorder link** from QR page (market linkage).

## 5. Explicitly Out of Scope (say this out loud in the pitch)

- Real hardware sensor deployment (describe low-cost ESP32+DHT22+load cell kit in architecture slide only).
- Real NIR/spectroscopy purity lab integration (simulated, "lab-integration-ready API" stub instead).
- Public blockchain / mainnet gas costs (use permissioned/private chain simulation).
- Full multilingual voice UI (describe in deployment framework, mock one screen only).

---

## 6. Tech Stack

| Component                                        | Suggested Tech                                                                                                            | Notes                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Frontend (consumer + beekeeper + KVIC dashboard) | React + Tailwind                                                                                                          | 3 role-based views                                                         |
| Backend / API                                    | Node.js (Express) or Python (FastAPI)                                                                                     | REST API for batch CRUD, QR gen, ledger writes                             |
| Blockchain layer                                 | Custom hash-chain (Python/Node) for demo simplicity; OR Hyperledger Fabric / Polygon Mumbai testnet if team has bandwidth | Start with custom hash-chain — fastest, fully controllable for tamper-demo |
| Database                                         | PostgreSQL / MongoDB                                                                                                      | Stores batch metadata, off-chain details; on-chain stores only hashes      |
| QR generation                                    | `qrcode` npm/python lib                                                                                                   | Simple                                                                     |
| IoT data                                         | Replay HOBOS Kaggle dataset via a script simulating sensor push (MQTT or simple REST polling)                             | No real hardware needed                                                    |
| AI — disease detection                           | CNN (Keras/TensorFlow or PyTorch), transfer learning (MobileNet/ResNet) on Kaggle Varroa image dataset                    | Small dataset — use augmentation + transfer learning                       |
| AI — productivity prediction                     | scikit-learn regression or simple LSTM on weight time-series                                                              | Keep simple, explainable                                                   |
| Hosting/demo                                     | Vercel/Render (frontend+backend), or fully local for offline demo safety                                                  | Have an offline fallback!                                                  |

---

## 7. Data Sources (confirmed)

**IoT / Hive Sensor Data**

- HOBOS Bee Hive Metrics — https://www.kaggle.com/datasets/se18m502/bee-hive-metrics (temp, humidity, weight, 2016–2019, Germany)
- Weight/Temp/Humidity 2019–2022 — https://www.sciencedirect.com/science/article/pii/S2352340923010429 (78 colonies, richer sensor set)
- Beehives (Kaggle, simpler) — https://www.kaggle.com/datasets/vivovinco/beehives

**Disease Detection**

- Honey Bee Annotated Images (Kaggle) — search "jenny18 honey-bee-annotated-images" — healthy vs. Varroa-infected images
- Reference implementation: https://github.com/Shaddyjr/bee-image-classifier
- (Stretch) BeeTogether audio dataset (Kaggle) — merged multi-source hive audio
- (Stretch) Smart Bee Colony Monitor Sounds — https://www.kaggle.com/datasets/annajyang/beehive-sounds

**Purity / Adulteration (reference only, not raw data use)**

- Bangladeshi UV-Vis-NIR adulteration study (cite for credibility) — https://www.sciencedirect.com/science/article/pii/S235236462600009X
- Gas-sensor/e-nose adulteration detection (cite for "low-cost sensor" pitch angle) — https://www.nature.com/articles/s41538-025-00440-9

**Indian Market / Government Context**

- National Bee Board stats (PIB) — https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=1855541
- State-wise honey production (Indiastat/data.gov.in) — https://www.indiastat.com/data/agriculture/apiculture-beekeeping
- Beekeeping Development Committee Report (EAC-PM) — floral calendars, district maps — https://eacpm.gov.in/wp-content/uploads/2019/06/Report-of-the-Beekeeping-Development-Committee_Inner_Part-I.pdf

---

## 8. System Architecture (high level)

```
[Beekeeper/Field Officer App] --> [Backend API] --> [Off-chain DB: batch details, images]
                                        |
                                        v
                              [Hash-chain Ledger: batch hash, prev hash, timestamp]
                                        |
                                        v
                              [QR Generator] --> printed on bottle
                                        |
[Consumer Scans QR] --> [Public Verification Page] <-- reads ledger + DB

[IoT Simulator] --> [Sensor Data API] --> [Hive Dashboard] --> [AI Prediction Engine]
                                                                     |
                                                        [Disease Model] [Productivity Model]

[KVIC Cluster Dashboard] <-- aggregates all of the above across beekeepers/villages
```

---

## 9. Build Plan (Hackathon Timeline — adjust to actual hours available)

### Phase 0 — Setup (Hour 0–2)

- Repo setup, tech stack scaffolding, download datasets, assign roles (frontend / backend / AI / blockchain / pitch-deck).

### Phase 1 — Core Traceability (Hour 2–10)

- Batch registration form + API.
- Hash-chain ledger logic (create, append, verify integrity).
- QR generation on batch creation.
- Consumer verification page (public, no login) showing batch journey.
- Tamper-demo button (edit a past record → show chain breaks).

### Phase 2 — IoT + AI (Hour 10–20)

- Load HOBOS dataset, build replay/simulation script feeding "live" hive readings.
- Hive dashboard UI (charts: temp, humidity, weight over time).
- Train disease classifier (transfer learning) on Kaggle Varroa images; wrap in simple upload-and-predict API.
- Build productivity/harvest-time regression model.

### Phase 3 — Differentiators (Hour 20–28)

- Pick 2–3 from Section 4 based on remaining time and team strength.
- Fair pricing engine using state-wise data.
- Trust score calculation logic.

### Phase 4 — Polish + Deployment Framework (Hour 28–34)

- KVIC cluster dashboard (aggregate view).
- Architecture/deployment slide: low-cost sensor kit design, offline-first sync plan, SMS/voice UI mockup, rollout phases (pilot cluster → district → state).
- UI polish, responsive design, error handling.

### Phase 5 — Demo Prep (Hour 34–36)

- Script the demo flow (see Section 11).
- Test offline fallback (in case venue wifi fails).
- Rehearse pitch, prepare backup screenshots/video.

---

## 10. Team Role Split (suggested for 4–6 people)

| Role                   | Responsibility                                                  |
| ---------------------- | --------------------------------------------------------------- |
| Blockchain/Backend Dev | Ledger logic, API, DB schema                                    |
| Frontend Dev           | Beekeeper app, consumer QR page, KVIC dashboard                 |
| AI/ML Dev              | Disease classifier, productivity prediction, pricing logic      |
| IoT/Data Dev           | Dataset prep, sensor replay simulator, dashboard charts         |
| Design/Pitch Lead      | UI polish, deployment framework slides, demo script, pitch deck |

---

## 11. Demo Script (for judges)

1. **Hook:** "1 in 3 honey samples in India may be adulterated. Beekeepers under KVIC's Honey Mission have no way to prove authenticity or get fair prices."
2. **Beekeeper flow:** Register a batch → show it get hashed onto the ledger → QR generated.
3. **Consumer flow:** Scan QR live (or simulate) → show full traceable journey + trust score + "meet your beekeeper."
4. **Tamper demo:** Try editing a past record on stage → show it gets flagged/rejected instantly. (This is the biggest "wow" moment — don't skip it.)
5. **IoT/AI flow:** Show hive dashboard with live-replayed sensor data → trigger disease detection on a sample image → show productivity prediction.
6. **Market linkage:** Show fair price suggestion + direct reorder link — tie back to "this increases beekeeper income," not just "this is techy."
7. **Deployment framework:** One slide — low-cost sensor kit cost breakdown, offline-first sync, SMS-based data entry for non-smartphone users, phased rollout plan (pilot → cluster → state, in partnership with KVIC field officers).
8. **Close:** Tie back to problem statement's exact pain points (counterfeit honey, low trust, weak market linkage, lack of traceability) and show each one is addressed.

---

## 12. Risks & Mitigations

| Risk                                              | Mitigation                                                                                                     |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Venue wifi fails during demo                      | Have a fully local/offline version ready; pre-record a backup demo video                                       |
| AI model accuracy looks weak live                 | Use pre-selected "known good" test images; be upfront that it's a proof-of-concept, not production-grade       |
| Blockchain looks like "just a database" to judges | Explicitly demo the tamper-detection moment — this is what makes it visibly different from a normal DB         |
| Judges ask about real hardware cost               | Have the ESP32+DHT22+load cell cost breakdown ready (~₹500–1000/hive)                                          |
| Running out of time                               | Follow the "2 features working > 5 half-broken" rule; Phase 3 differentiators are droppable if behind schedule |

---

## 13. Immediate Next Steps (do these first)

- [ ] Confirm team roles (Section 10)
- [ ] Download and explore HOBOS Kaggle dataset + Varroa image dataset
- [ ] Decide: custom hash-chain vs. Hyperledger (recommend custom hash-chain for speed)
- [ ] Set up shared repo + project board (issues per feature from Section 3)
- [ ] Build the batch → hash-chain → QR flow first (this is your safety-net MVP if everything else fails)
